// Deterministic scoring authority. Pure functions, no network.
//
// CORE MECHANIC (PROJECT_CONTEXT §2/§3):
//   1. A selection (or evidence category) sets the BAND [floor, ceil].
//   2. AI params position the answer WITHIN the band.
//   3. Top of band requires has_quantification (real numbers).
//   4. Gap 1: explicit contradiction → re-band DOWN + sit at floor + flag.
//   5. Junk field → band floor (or 0) + flag.
//
// AI params are passed in keyed by DIMENSION. On AI failure the caller
// passes floor-default params for every dimension, so scoring runs
// identically (just blunter) — see groq.js fallback.
//
// Each AI param object (per dimension) looks like:
//   { is_substantive, specificity, has_quantification, has_named_entities,
//     evidence_strength, internal_consistency, supports_selection, confidence }
// All fields optional; defaults applied here.

const { getFlow } = require("./flow/flow");

// ---------- helpers ----------

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const round = (n) => Math.round(n);

// Safe AI-param access with defaults (so partial/missing params never crash).
function p(params, dim) {
  const d = (params && params[dim]) || {};
  return {
    is_substantive: d.is_substantive !== false, // default true unless explicitly false
    specificity: typeof d.specificity === "number" ? d.specificity : 0,
    has_quantification: d.has_quantification === true,
    has_named_entities: d.has_named_entities === true,
    evidence_strength: typeof d.evidence_strength === "number" ? d.evidence_strength : 0,
    internal_consistency: d.internal_consistency !== false,
    supports_selection: d.supports_selection !== false, // default true (no contradiction)
    confidence: typeof d.confidence === "number" ? d.confidence : 0.5,
  };
}

/**
 * Position a score within a band [floor, ceil] using AI signals.
 *
 * - quality 0..1 drives where in the band you land.
 * - quality is built from specificity + evidence_strength.
 * - TOP of band is gated: without has_quantification, capped at mid-band.
 * - junk → floor.
 *
 * @param {[number,number]} band  [floor, ceil]
 * @param {object} ai             resolved ai params (from p())
 * @param {boolean} isJunk        is the backing answer junk?
 * @returns {number} score within band
 */
function positionInBand(band, ai, isJunk) {
  const [floor, ceil] = band;
  if (isJunk || !ai.is_substantive) return floor;

  // base quality from specificity + evidence
  let quality = 0.5 * ai.specificity + 0.5 * ai.evidence_strength;
  // named entities nudge up
  if (ai.has_named_entities) quality += 0.1;
  // low AI confidence pulls toward floor (honest scoring)
  quality *= clamp(0.6 + 0.4 * ai.confidence, 0, 1);
  quality = clamp(quality, 0, 1);

  // quantification gate: without numbers, cannot exceed mid-band
  const span = ceil - floor;
  let pos = floor + quality * span;
  if (!ai.has_quantification) {
    const midCap = floor + 0.5 * span;
    pos = Math.min(pos, midCap);
  }
  return clamp(pos, floor, ceil);
}

/**
 * Apply Gap 1 contradiction handling.
 * If the answer explicitly contradicts the selection (supports_selection=false),
 * re-band DOWN to the next-lower band and sit at its floor, and flag.
 *
 * @param {Array<[number,number]>} ladder  bands ordered HIGH→LOW
 * @param {number} selectedIdx             index of the selection's band
 * @param {object} ai
 * @returns {{ bandIdx: number, forceFloor: boolean, mismatch: boolean }}
 */
function applyContradiction(ladder, selectedIdx, ai) {
  if (ai.supports_selection) {
    return { bandIdx: selectedIdx, forceFloor: false, mismatch: false };
  }
  // contradiction → drop one band (not below the lowest)
  const lowerIdx = Math.min(selectedIdx + 1, ladder.length - 1);
  return { bandIdx: lowerIdx, forceFloor: true, mismatch: true };
}

// ---------- FOUNDER bands (PROJECT_CONTEXT §2) ----------
// Each ladder ordered HIGH→LOW so index 0 = strongest category.

const FOUNDER = {
  validation: {
    max: 25,
    ladder: [
      [18, 25], // paying customers
      [12, 18], // LOIs / signed
      [7, 13],  // waitlist / signups
      [3, 7],   // anecdotal
      [0, 3],   // none
    ],
  },
  traction: {
    max: 20,
    ladder: [
      [14, 20], // revenue / paying
      [8, 14],  // active users
      [5, 9],   // pilots / LOIs
      [2, 5],   // plan only
      [0, 2],   // nothing
    ],
  },
  mvp: {
    max: 15,
    // mvp band is chosen DIRECTLY by the select option (no evidence-category guess)
    bySelection: {
      revenue: [11, 15],
      live: [7, 11],
      building: [3, 7],
      idea: [1, 3],
    },
    ladderOrder: ["revenue", "live", "building", "idea"], // for contradiction re-band
  },
  problem_clarity: {
    max: 15,
    ladder: [
      [11, 15], // specific + quantified
      [6, 10],  // clear but generic
      [2, 5],   // vague
    ],
  },
  team: {
    max: 15,
    ladder: [
      [10, 15], // tech cofounder + balanced
      [5, 10],  // solo capable / partial
      [2, 5],   // solo + gaps
    ],
  },
  funding_fit: {
    max: 10,
    bySelection: {
      pre_seed: [6, 10],
      seed: [6, 10],
      series_a: [2, 6],
      later: [2, 6],
    },
    ladderOrder: ["pre_seed", "series_a"], // sweet-spot vs edge
  },
};

// ---------- INVESTOR bands (PROJECT_CONTEXT §3) ----------
// Derived to match the rubric examples (Hot ~93, Good ~70, Maybe ~47, Low ~18).

const INVESTOR = {
  cheque_capacity: {
    max: 22,
    ladder: [
      [15, 22], // strong cheque + leads
      [9, 15],  // moderate / follows
      [4, 9],   // small
      [0, 4],   // negligible / unsure
    ],
  },
  stage_fit: {
    max: 20,
    bySelection: {
      pre_seed: [16, 20],
      seed: [16, 20],
      series_a: [8, 14],
      growth: [2, 6],
      agnostic: [10, 16], // depends where cheques land — mid by default
    },
    ladderOrder: ["pre_seed", "agnostic", "series_a", "growth"],
  },
  thesis_clarity: {
    max: 18,
    ladder: [
      [13, 18], // sharp, focused
      [7, 12],  // clear-ish / generalist
      [2, 6],   // vague ("good teams")
    ],
  },
  portfolio: {
    max: 15,
    bySelection: {
      experienced: [10, 15],
      some: [6, 11],
      first_time: [2, 7],
    },
    ladderOrder: ["experienced", "some", "first_time"],
  },
  deploy_timeline: {
    max: 15,
    bySelection: {
      now: [11, 15],
      near: [7, 11],
      exploring: [3, 7],
      learning: [0, 3],
    },
    ladderOrder: ["now", "near", "exploring", "learning"],
  },
  support_model: {
    max: 10,
    ladder: [
      [6, 10], // hands-on: network/ops/board
      [3, 6],  // some value-add
      [0, 3],  // just money
    ],
  },
};

// ---------- evidence-category pickers ----------
// For ladder dimensions (no direct selection), AI evidence_strength picks the
// category. Higher evidence_strength → stronger (lower-index) band.

function pickLadderIdx(ladder, ai) {
  const n = ladder.length;
  if (!ai.is_substantive) return n - 1; // weakest
  // map evidence_strength (0..1) → category index (0 = strongest)
  // strong evidence + quantification → top categories
  let s = ai.evidence_strength;
  if (ai.has_quantification) s += 0.15;
  if (ai.has_named_entities) s += 0.1;
  s = clamp(s, 0, 1);
  // invert: high s → low index
  const idx = Math.round((1 - s) * (n - 1));
  return clamp(idx, 0, n - 1);
}

// ---------- per-dimension scorer ----------

function scoreLadderDimension(cfg, ai, isJunk) {
  const idx = pickLadderIdx(cfg.ladder, ai);
  // contradiction doesn't apply to ladder dims (no explicit selection to contradict)
  const band = cfg.ladder[idx];
  const raw = positionInBand(band, ai, isJunk);
  return { score: round(raw), band, mismatch: false };
}

function scoreSelectionDimension(cfg, selection, ai, isJunk) {
  const order = cfg.ladderOrder;
  const selectedIdx = order.indexOf(selection);
  // build a ladder of bands in order for contradiction re-banding
  const ladder = order.map((key) => cfg.bySelection[key]);
  const safeIdx = selectedIdx >= 0 ? selectedIdx : ladder.length - 1;

  const c = applyContradiction(ladder, safeIdx, ai);
  const band = ladder[c.bandIdx];
  let raw;
  if (c.forceFloor) {
    raw = band[0]; // sit at floor on contradiction
  } else {
    raw = positionInBand(band, ai, isJunk);
  }
  return { score: round(raw), band, mismatch: c.mismatch };
}

// ---------- helpers to read selections from a transcript ----------

function selectionFor(answersById, questionId) {
  const a = answersById[questionId];
  return a ? a.selection || a.value || null : null;
}

// gather which captured fields feed a dimension and whether any are junk
function dimensionHasJunk(flow, answersById, dimension, junkSet) {
  for (const q of flow.questions) {
    if (q.scoringDimension !== dimension) continue;
    for (const cap of q.captures) {
      if (junkSet.has(`${q.id}:${cap.key}`)) return true;
    }
  }
  return false;
}

// ---------- main scorers ----------

function scoreFounder(transcript, aiParams, junkFields) {
  const flow = getFlow("founder");
  const answersById = {};
  for (const a of transcript.answers || []) answersById[a.questionId] = a;
  const junkSet = new Set((junkFields || []).map((j) => `${j.questionId}:${j.key}`));

  const breakdown = {};
  const flags = [];

  // selection-driven: mvp, funding_fit
  const mvpSel = selectionFor(answersById, "mvp_stage");
  const mvpJunk = dimensionHasJunk(flow, answersById, "mvp", junkSet);
  breakdown.mvp = scoreSelectionDimension(FOUNDER.mvp, mvpSel, p(aiParams, "mvp"), mvpJunk);

  const fundSel = selectionFor(answersById, "funding");
  const fundJunk = dimensionHasJunk(flow, answersById, "funding_fit", junkSet);
  breakdown.funding_fit = scoreSelectionDimension(FOUNDER.funding_fit, fundSel, p(aiParams, "funding_fit"), fundJunk);

  // ladder-driven: validation, traction, problem_clarity, team
  for (const dim of ["validation", "traction", "problem_clarity", "team"]) {
    const junk = dimensionHasJunk(flow, answersById, dim, junkSet);
    breakdown[dim] = scoreLadderDimension(FOUNDER[dim], p(aiParams, dim), junk);
  }

  // collect mismatch flags
  for (const [dim, r] of Object.entries(breakdown)) {
    if (r.mismatch) flags.push({ type: "mismatch", dimension: dim });
  }
  for (const [dim, param] of Object.entries(aiParams || {})) {
    if (param && param.internal_consistency === false && !flags.find(f => f.type === "mismatch" && f.dimension === dim)) {
      flags.push({ type: "mismatch", dimension: dim });
    }
  }
  // junk flags
  for (const j of junkFields || []) {
    flags.push({ type: "junk", questionId: j.questionId, key: j.key });
  }

  const total = Object.values(breakdown).reduce((s, r) => s + r.score, 0);
  return finalize(total, breakdown, flags, FOUNDER);
}

function scoreInvestor(transcript, aiParams, junkFields) {
  const flow = getFlow("investor");
  const answersById = {};
  for (const a of transcript.answers || []) answersById[a.questionId] = a;
  const junkSet = new Set((junkFields || []).map((j) => `${j.questionId}:${j.key}`));

  const breakdown = {};
  const flags = [];

  // selection-driven: stage_fit, portfolio, deploy_timeline
  const stageSel = selectionFor(answersById, "stage");
  breakdown.stage_fit = scoreSelectionDimension(
    INVESTOR.stage_fit, stageSel, p(aiParams, "stage_fit"),
    dimensionHasJunk(flow, answersById, "stage_fit", junkSet)
  );

  const portSel = selectionFor(answersById, "portfolio");
  breakdown.portfolio = scoreSelectionDimension(
    INVESTOR.portfolio, portSel, p(aiParams, "portfolio"),
    dimensionHasJunk(flow, answersById, "portfolio", junkSet)
  );

  const timeSel = selectionFor(answersById, "timeline");
  breakdown.deploy_timeline = scoreSelectionDimension(
    INVESTOR.deploy_timeline, timeSel, p(aiParams, "deploy_timeline"),
    dimensionHasJunk(flow, answersById, "deploy_timeline", junkSet)
  );

  // ladder-driven: cheque_capacity, thesis_clarity, support_model
  for (const dim of ["cheque_capacity", "thesis_clarity", "support_model"]) {
    const junk = dimensionHasJunk(flow, answersById, dim, junkSet);
    breakdown[dim] = scoreLadderDimension(INVESTOR[dim], p(aiParams, dim), junk);
  }

  for (const [dim, r] of Object.entries(breakdown)) {
    if (r.mismatch) flags.push({ type: "mismatch", dimension: dim });
  }
  for (const [dim, param] of Object.entries(aiParams || {})) {
    if (param && param.internal_consistency === false && !flags.find(f => f.type === "mismatch" && f.dimension === dim)) {
      flags.push({ type: "mismatch", dimension: dim });
    }
  }
  for (const j of junkFields || []) {
    flags.push({ type: "junk", questionId: j.questionId, key: j.key });
  }

  const total = Object.values(breakdown).reduce((s, r) => s + r.score, 0);
  return finalize(total, breakdown, flags, INVESTOR);
}

// ---------- bucket + finalize ----------

function bucketFor(score) {
  if (score >= 80) return "hot";
  if (score >= 60) return "good";
  if (score >= 40) return "maybe";
  return "low";
}

function finalize(total, breakdown, flags, cfg) {
  const clamped = clamp(round(total), 0, 100);
  
  // Format labels nicely for the dashboard
  const formatLabel = (key) => {
    const labels = {
      mvp: 'MVP Stage',
      funding_fit: 'Funding Fit',
      validation: 'Validation',
      traction: 'Traction',
      problem_clarity: 'Clarity',
      team: 'Team',
      thesis_clarity: 'Thesis',
      stage_fit: 'Stage Fit',
      cheque_capacity: 'Cheque Size',
      portfolio: 'Portfolio',
      deploy_timeline: 'Timeline',
      support_model: 'Value Add'
    };
    return labels[key] || key;
  };

  // flatten breakdown to an array of { label, score, max } for the dashboard
  const flat = [];
  for (const [dim, r] of Object.entries(breakdown)) {
    flat.push({ label: formatLabel(dim), score: r.score, max: cfg[dim].max });
  }

  return {
    total: clamped,
    bucket: bucketFor(clamped),
    breakdown: flat,
    flags,
  };
}

/**
 * Public entry — score a transcript.
 * @param {object} transcript  { type, answers }
 * @param {object} aiParams    per-dimension AI params (or floor-defaults on fallback)
 * @param {Array}  junkFields  [{questionId, key}] from validate.js
 * @returns {{ total, bucket, breakdown, flags }}
 */
function scoreTranscript(transcript, aiParams, junkFields) {
  if (transcript.type === "founder") {
    return scoreFounder(transcript, aiParams || {}, junkFields || []);
  }
  if (transcript.type === "investor") {
    return scoreInvestor(transcript, aiParams || {}, junkFields || []);
  }
  throw new Error(`[hardScores] unknown flow type: ${transcript.type}`);
}

module.exports = {
  scoreTranscript,
  bucketFor,
  // exported for tests
  positionInBand,
  pickLadderIdx,
  FOUNDER,
  INVESTOR,
};