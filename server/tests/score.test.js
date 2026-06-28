#!/usr/bin/env node
/**
 * score.test.js — Plain-Node test suite. No test framework needed.
 *
 * Covers:
 *   hardScores.js — positionInBand, pickLadderIdx, scoreTranscript (founder + investor)
 *   validate.js   — isJunk, validateField, validateTranscript
 *
 * Run: node tests/score.test.js
 * Exit 0 = all pass. Exit 1 = one or more failures.
 */

// ── bootstrap env before any require that touches env.js ──
process.env.DATABASE_URL = "postgresql://fake:fake@localhost:5432/fake";
process.env.GROQ_API_KEY = "gsk_fake";
process.env.JWT_SECRET    = "fake_secret";

const assert = require("assert");
const {
  scoreTranscript,
  positionInBand,
  pickLadderIdx,
  bucketFor,
  FOUNDER,
  INVESTOR,
} = require("../hardScores");

const {
  isJunk,
  validateField,
  validateTranscript,
} = require("../validate");

// ── tiny test harness ──────────────────────────────────────

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓  ${name}`);
    passed++;
  } catch (e) {
    console.error(`  ✗  ${name}`);
    console.error(`       ${e.message}`);
    failures.push({ name, message: e.message });
    failed++;
  }
}

function section(title) {
  console.log(`\n── ${title} ──`);
}

// ── helpers ───────────────────────────────────────────────

// Minimal AI params that put a score comfortably in mid-band.
function midParams() {
  return {
    is_substantive: true,
    specificity: 0.5,
    has_quantification: false,
    has_named_entities: false,
    evidence_strength: 0.5,
    internal_consistency: true,
    supports_selection: true,
    confidence: 0.7,
  };
}

// Strong AI params (with quantification) — should reach top of band.
function strongParams() {
  return {
    is_substantive: true,
    specificity: 0.9,
    has_quantification: true,
    has_named_entities: true,
    evidence_strength: 0.9,
    internal_consistency: true,
    supports_selection: true,
    confidence: 0.9,
  };
}

// Floor AI params — junk / not substantive.
function floorParams() {
  return {
    is_substantive: false,
    specificity: 0,
    has_quantification: false,
    has_named_entities: false,
    evidence_strength: 0,
    internal_consistency: true,
    supports_selection: true,
    confidence: 0,
  };
}

// Contradiction params — explicit mismatch between selection and text.
function contradictionParams() {
  return {
    is_substantive: true,
    specificity: 0.5,
    has_quantification: false,
    has_named_entities: false,
    evidence_strength: 0.4,
    internal_consistency: false,
    supports_selection: false,   // ← contradiction
    confidence: 0.8,
  };
}

// Build a complete founder transcript.
function founderTranscript(mvpSelection = "revenue", fundingSelection = "seed") {
  return {
    type: "founder",
    answers: [
      { questionId: "intro",            values: { name: "Alice", one_liner: "AI payments platform." } },
      { questionId: "problem",          values: { problem: "Manual reconciliation wastes 40h/month.", who: "D2C CFOs" } },
      { questionId: "mvp_stage",        selection: mvpSelection, values: { mvp_stage: mvpSelection } },
      { questionId: "mvp_detail",       values: { mvp_detail: "18 paying customers, ₹6.2L MRR, 97% retention." } },
      { questionId: "traction",         values: { users: "340 DAU", revenue: "₹6.2L MRR growing 22% MoM" } },
      { questionId: "pilots",           values: { pilots: "Razorpay LOI signed, BoAt and Mamaearth on annual plans." } },
      { questionId: "team",             values: { team_size: "5", tech_cofounder: "Yes, ex-Stripe 4 years." } },
      { questionId: "funding",          selection: fundingSelection, values: { funding_stage: fundingSelection, funding_amount: "₹2.5Cr" } },
      { questionId: "funding_milestone", values: { funding_milestone: "50 customers and ₹18L MRR in 9 months." } },
      { questionId: "validation",       values: { validation: "18 paying customers, ₹6.2L MRR, 3 signed annual contracts." } },
      { questionId: "contact",          values: { email: "alice@nexpay.in", phone: "+91-9988776655", linkedin: "linkedin.com/in/alice" } },
      { questionId: "founder_insight",  values: { founder_insight: "Reconciliation is a $4.7B problem hidden in spreadsheets. 94% of patterns are learnable." } },
    ],
  };
}

// Build a complete investor transcript.
function investorTranscript(stageSelection = "seed", portfolioSelection = "experienced", timelineSelection = "now") {
  return {
    type: "investor",
    answers: [
      { questionId: "intro",           values: { name: "Raj", investor_type: "angel" } },
      { questionId: "thesis",          values: { thesis: "B2B SaaS in fintech and logistics.", focus: "India early-stage" } },
      { questionId: "stage",           selection: stageSelection, values: { stage: stageSelection } },
      { questionId: "stage_detail",    values: { stage_detail: "Strong team with domain expertise and first paying customers." } },
      { questionId: "cheque",          values: { cheque_size: "₹50L–₹1Cr", lead_follow: "lead" } },
      { questionId: "portfolio",       selection: portfolioSelection, values: { portfolio_count: "12", portfolio_examples: "Razorpay seed, Khatabook" } },
      { questionId: "portfolio_detail", values: { portfolio_detail: "Seed stage, 3 exits, 2 IPOs." } },
      { questionId: "timeline",        selection: timelineSelection, values: { timeline: timelineSelection } },
      { questionId: "timeline_detail", values: { timeline_detail: "Strong team, defensible moat, early revenue." } },
      { questionId: "support",         values: { support_model: "Network of 200+ founders, board seats, intro to follow-on investors." } },
      { questionId: "contact",         values: { email: "raj@fund.in", phone: "+91-9876543210", linkedin: "linkedin.com/in/raj" } },
      { questionId: "alignment",       values: { alignment: "Partner who brings deal flow and co-investors. Ideal deal: ₹5Cr–₹50Cr ARR potential." } },
    ],
  };
}

// ─────────────────────────────────────────────────────────
// SECTION 1: positionInBand
// ─────────────────────────────────────────────────────────
section("positionInBand");

test("junk answer → returns floor", () => {
  const score = positionInBand([5, 20], floorParams(), true);
  assert.strictEqual(score, 5, `expected 5, got ${score}`);
});

test("not substantive → returns floor", () => {
  const score = positionInBand([0, 10], floorParams(), false);
  assert.strictEqual(score, 0, `expected 0, got ${score}`);
});

test("mid params without quantification → capped at mid-band", () => {
  const band = [0, 20];
  const score = positionInBand(band, midParams(), false);
  assert.ok(score <= 10, `expected ≤ 10 (mid-cap), got ${score}`);
  assert.ok(score > 0,   `expected > 0, got ${score}`);
});

test("strong params with quantification → can exceed mid-band", () => {
  const band = [0, 20];
  const score = positionInBand(band, strongParams(), false);
  assert.ok(score > 10, `expected > 10 (above mid), got ${score}`);
});

test("strong params with quantification → stays within band ceiling", () => {
  const band = [0, 20];
  const score = positionInBand(band, strongParams(), false);
  assert.ok(score <= 20, `expected ≤ 20 (ceiling), got ${score}`);
});

test("score always ≥ floor", () => {
  const band = [8, 15];
  const score = positionInBand(band, midParams(), false);
  assert.ok(score >= 8, `expected ≥ 8, got ${score}`);
});

// ─────────────────────────────────────────────────────────
// SECTION 2: pickLadderIdx
// ─────────────────────────────────────────────────────────
section("pickLadderIdx");

test("not substantive → weakest band (last index)", () => {
  const ladder = [[18,25],[12,18],[7,13],[3,7],[0,3]];
  const idx = pickLadderIdx(ladder, floorParams());
  assert.strictEqual(idx, ladder.length - 1, `expected ${ladder.length - 1}, got ${idx}`);
});

test("strong evidence → top bands (idx 0 or 1)", () => {
  const ladder = [[18,25],[12,18],[7,13],[3,7],[0,3]];
  const idx = pickLadderIdx(ladder, strongParams());
  assert.ok(idx <= 1, `expected 0 or 1, got ${idx}`);
});

test("mid evidence → middle bands", () => {
  const ladder = [[18,25],[12,18],[7,13],[3,7],[0,3]];
  const idx = pickLadderIdx(ladder, midParams());
  assert.ok(idx >= 1 && idx <= 3, `expected 1–3, got ${idx}`);
});

// ─────────────────────────────────────────────────────────
// SECTION 3: bucketFor
// ─────────────────────────────────────────────────────────
section("bucketFor");

test("score 80 → hot",  () => assert.strictEqual(bucketFor(80),  "hot"));
test("score 100 → hot", () => assert.strictEqual(bucketFor(100), "hot"));
test("score 79 → good", () => assert.strictEqual(bucketFor(79),  "good"));
test("score 60 → good", () => assert.strictEqual(bucketFor(60),  "good"));
test("score 59 → maybe",() => assert.strictEqual(bucketFor(59),  "maybe"));
test("score 40 → maybe",() => assert.strictEqual(bucketFor(40),  "maybe"));
test("score 39 → low",  () => assert.strictEqual(bucketFor(39),  "low"));
test("score 0 → low",   () => assert.strictEqual(bucketFor(0),   "low"));

// ─────────────────────────────────────────────────────────
// SECTION 4: scoreTranscript — founder
// ─────────────────────────────────────────────────────────
section("scoreTranscript — founder");

test("strong founder scores in hot bucket", () => {
  const transcript = founderTranscript("revenue", "seed");
  const aiParams = {
    validation:      strongParams(),
    traction:        strongParams(),
    mvp:             strongParams(),
    problem_clarity: strongParams(),
    team:            strongParams(),
    funding_fit:     strongParams(),
  };
  const result = scoreTranscript(transcript, aiParams, []);
  assert.ok(result.total >= 80, `expected ≥ 80 (hot), got ${result.total}`);
  assert.strictEqual(result.bucket, "hot");
});

test("weak founder (idea stage, no quant) scores in low/maybe", () => {
  const transcript = founderTranscript("idea", "pre_seed");
  const aiParams = {
    validation:      floorParams(),
    traction:        floorParams(),
    mvp:             floorParams(),
    problem_clarity: floorParams(),
    team:            floorParams(),
    funding_fit:     floorParams(),
  };
  const result = scoreTranscript(transcript, aiParams, []);
  assert.ok(result.total < 40, `expected < 40 (low), got ${result.total}`);
});

test("founder score total is 0–100", () => {
  const result = scoreTranscript(founderTranscript(), {}, []);
  assert.ok(result.total >= 0 && result.total <= 100,
    `expected 0–100, got ${result.total}`);
});

test("founder breakdown has all 6 dimensions", () => {
  const result = scoreTranscript(founderTranscript(), {}, []);
  const labels = result.breakdown.map(d => d.label);
  assert.strictEqual(result.breakdown.length, 6, `expected 6 dims, got ${result.breakdown.length}`);
  for (const d of result.breakdown) {
    assert.ok(typeof d.score === "number", `score missing on ${d.label}`);
    assert.ok(typeof d.max === "number",   `max missing on ${d.label}`);
    assert.ok(d.score >= 0 && d.score <= d.max,
      `${d.label}: score ${d.score} out of range [0, ${d.max}]`);
  }
});

test("revenue selection scores higher mvp than idea selection", () => {
  const ai = { mvp: midParams(), validation: midParams(), traction: midParams(),
               problem_clarity: midParams(), team: midParams(), funding_fit: midParams() };
  const hot  = scoreTranscript(founderTranscript("revenue"), ai, []);
  const cold = scoreTranscript(founderTranscript("idea"),    ai, []);
  assert.ok(hot.total > cold.total,
    `revenue (${hot.total}) should outscore idea (${cold.total})`);
});

test("Gap 1: contradiction on mvp drops score vs no contradiction", () => {
  const baseAi = {
    validation: midParams(), traction: midParams(), problem_clarity: midParams(),
    team: midParams(), funding_fit: midParams(),
  };
  const normal       = { ...baseAi, mvp: { ...midParams(), supports_selection: true  } };
  const contradiction= { ...baseAi, mvp: { ...midParams(), supports_selection: false } };
  const scoreNormal  = scoreTranscript(founderTranscript("revenue"), normal,        []);
  const scoreContra  = scoreTranscript(founderTranscript("revenue"), contradiction, []);
  assert.ok(scoreNormal.total > scoreContra.total,
    `normal (${scoreNormal.total}) should outscore contradiction (${scoreContra.total})`);
});

test("Gap 1: contradiction produces a mismatch flag", () => {
  const ai = {
    validation: midParams(), traction: midParams(), problem_clarity: midParams(),
    team: midParams(), funding_fit: midParams(),
    mvp: contradictionParams(),
  };
  const result = scoreTranscript(founderTranscript("revenue"), ai, []);
  const hasMismatch = result.flags.some(f => f.type === "mismatch");
  assert.ok(hasMismatch, "expected a mismatch flag, got none");
});

test("Gap 2: junk field floors that dimension and adds junk flag", () => {
  const ai = {
    validation: strongParams(), traction: strongParams(), problem_clarity: strongParams(),
    team: strongParams(), funding_fit: strongParams(), mvp: strongParams(),
  };
  const junkFields = [{ questionId: "validation", key: "validation" }];
  const withJunk    = scoreTranscript(founderTranscript("revenue"), ai, junkFields);
  const withoutJunk = scoreTranscript(founderTranscript("revenue"), ai, []);

  const junkDim  = withJunk.breakdown.find(d => d.label === "Validation");
  const cleanDim = withoutJunk.breakdown.find(d => d.label === "Validation");

  assert.ok(junkDim,  "validation dimension missing from breakdown");

  // junk → positionInBand returns band floor (not a free position within band)
  // so junk score must be strictly less than non-junk score
  assert.ok(junkDim.score < cleanDim.score,
    `junk (${junkDim.score}) should be < clean (${cleanDim.score})`);

  // the junk flag must be set
  const hasJunkFlag = withJunk.flags.some(f => f.type === "junk");
  assert.ok(hasJunkFlag, "expected a junk flag, got none");
});

test("junk fields lower total score vs no junk", () => {
  const ai = {
    validation: strongParams(), traction: strongParams(), problem_clarity: strongParams(),
    team: strongParams(), funding_fit: strongParams(), mvp: strongParams(),
  };
  const clean = scoreTranscript(founderTranscript("revenue"), ai, []);
  const junky = scoreTranscript(founderTranscript("revenue"), ai, [
    { questionId: "validation", key: "validation" },
    { questionId: "traction",   key: "users"      },
  ]);
  assert.ok(clean.total > junky.total,
    `clean (${clean.total}) should outscore junky (${junky.total})`);
});

// ─────────────────────────────────────────────────────────
// SECTION 5: scoreTranscript — investor
// ─────────────────────────────────────────────────────────
section("scoreTranscript — investor");

test("strong investor scores in hot bucket", () => {
  const transcript = investorTranscript("seed", "experienced", "now");
  const ai = {
    thesis_clarity:  strongParams(),
    stage_fit:       strongParams(),
    cheque_capacity: strongParams(),
    portfolio:       strongParams(),
    deploy_timeline: strongParams(),
    support_model:   strongParams(),
  };
  const result = scoreTranscript(transcript, ai, []);
  assert.ok(result.total >= 80, `expected ≥ 80, got ${result.total}`);
  assert.strictEqual(result.bucket, "hot");
});

test("learning/first-time investor scores lower than now/experienced", () => {
  const ai = {
    thesis_clarity: midParams(), stage_fit: midParams(), cheque_capacity: midParams(),
    portfolio: midParams(), deploy_timeline: midParams(), support_model: midParams(),
  };
  const strong = scoreTranscript(investorTranscript("seed", "experienced", "now"),      ai, []);
  const weak   = scoreTranscript(investorTranscript("growth", "first_time", "learning"), ai, []);
  assert.ok(strong.total > weak.total,
    `experienced/now (${strong.total}) should outscore first-time/learning (${weak.total})`);
});

test("investor breakdown has all 6 dimensions", () => {
  const result = scoreTranscript(investorTranscript(), {}, []);
  assert.strictEqual(result.breakdown.length, 6, `expected 6, got ${result.breakdown.length}`);
  for (const d of result.breakdown) {
    assert.ok(d.score >= 0 && d.score <= d.max,
      `${d.label}: ${d.score} out of range [0, ${d.max}]`);
  }
});

test("investor score total is 0–100", () => {
  const result = scoreTranscript(investorTranscript(), {}, []);
  assert.ok(result.total >= 0 && result.total <= 100,
    `expected 0–100, got ${result.total}`);
});

test("unknown flow type throws", () => {
  assert.throws(
    () => scoreTranscript({ type: "unknown", answers: [] }, {}, []),
    /unknown flow type/
  );
});

// ─────────────────────────────────────────────────────────
// SECTION 6: isJunk (validate.js)
// ─────────────────────────────────────────────────────────
section("isJunk");

test('empty string → junk',           () => assert.ok(isJunk("")));
test('"idk" → junk',                  () => assert.ok(isJunk("idk")));
test('"n/a" → junk',                  () => assert.ok(isJunk("n/a")));
test('"test" → junk',                 () => assert.ok(isJunk("test")));
test('"good" → junk',                 () => assert.ok(isJunk("good")));
test('"tbd" → junk',                  () => assert.ok(isJunk("tbd")));
test('"asdfasdf" → junk (gibberish)', () => assert.ok(isJunk("asdfasdf")));
test('"srfgsdgd" → junk (consonant run)', () => assert.ok(isJunk("srfgsdgd")));

test('"idk but 200 customers" → NOT junk (has real info)', () =>
  assert.ok(!isJunk("idk but 200 customers")));
test('"we have 18 paying customers" → NOT junk', () =>
  assert.ok(!isJunk("we have 18 paying customers")));
test('"Razorpay LOI signed" → NOT junk', () =>
  assert.ok(!isJunk("Razorpay LOI signed")));
test('"B2B SaaS" → NOT junk',          () => assert.ok(!isJunk("B2B SaaS")));
test('"MVP live since Jan" → NOT junk', () => assert.ok(!isJunk("MVP live since Jan")));

// ─────────────────────────────────────────────────────────
// SECTION 7: validateField
// ─────────────────────────────────────────────────────────
section("validateField");

test("required + non-empty real answer → ok, not junk", () => {
  const r = validateField("required", "We have 18 paying customers.");
  assert.ok(r.ok,   "expected ok");
  assert.ok(!r.junk,"expected not junk");
});

test("required + empty → junk (not a hard error)", () => {
  const r = validateField("required", "");
  assert.ok(r.ok,  "expected ok (not a hard error)");
  assert.ok(r.junk,"expected junk");
});

test("required + blocklist word → junk", () => {
  const r = validateField("required", "idk");
  assert.ok(r.junk, "expected junk for 'idk'");
});

test("optional + empty → ok, not junk", () => {
  const r = validateField("optional", "");
  assert.ok(r.ok,   "expected ok");
  assert.ok(!r.junk,"expected not junk");
});

test("email validator passes real-looking email", () => {
  const r = validateField("email", "alice@nexpay.in");
  assert.ok(r.ok,   "expected ok");
  assert.ok(!r.junk,"expected not junk");
});

test("number validator passes value with digit", () => {
  const r = validateField("number", "₹6.2L MRR");
  assert.ok(r.ok, "expected ok");
});

test("number validator fails value with no digit", () => {
  const r = validateField("number", "lots");
  assert.ok(!r.ok, "expected not ok");
});

// ─────────────────────────────────────────────────────────
// SECTION 8: validateTranscript (end-to-end)
// ─────────────────────────────────────────────────────────
section("validateTranscript");

test("complete valid founder transcript → valid, no hard errors", () => {
  const result = validateTranscript(founderTranscript());
  assert.ok(result.valid, `expected valid, errors: ${JSON.stringify(result.errors)}`);
  assert.strictEqual(result.errors.length, 0);
});

test("complete valid investor transcript → valid, no hard errors", () => {
  const result = validateTranscript(investorTranscript());
  assert.ok(result.valid, `expected valid, errors: ${JSON.stringify(result.errors)}`);
  assert.strictEqual(result.errors.length, 0);
});

test("unknown type → invalid with error", () => {
  const result = validateTranscript({ type: "robot", answers: [] });
  assert.ok(!result.valid, "expected invalid");
  assert.ok(result.errors.length > 0, "expected at least one error");
});

test("invalid mvp_stage selection → hard error", () => {
  const t = founderTranscript();
  // corrupt the mvp_stage selection
  const ans = t.answers.find(a => a.questionId === "mvp_stage");
  ans.selection = "unicorn"; // not a valid option
  const result = validateTranscript(t);
  assert.ok(!result.valid, "expected invalid");
  const selErr = result.errors.find(e => e.questionId === "mvp_stage");
  assert.ok(selErr, "expected selection error on mvp_stage");
});

test("junk answer in required field → flagged as junk, not a hard error", () => {
  const t = founderTranscript();
  const ans = t.answers.find(a => a.questionId === "validation");
  ans.values = { validation: "idk" };
  const result = validateTranscript(t);
  assert.ok(result.valid, "junk should not cause a hard error");
  const junk = result.junkFields.find(j => j.questionId === "validation");
  assert.ok(junk, "expected validation to be in junkFields");
});

// ─────────────────────────────────────────────────────────
// RESULTS
// ─────────────────────────────────────────────────────────

const total = passed + failed;
console.log(`\n${"─".repeat(50)}`);
console.log(`  ${passed}/${total} tests passed`);
if (failures.length) {
  console.log(`\n  Failures:`);
  for (const f of failures) {
    console.log(`    ✗ ${f.name}`);
    console.log(`      ${f.message}`);
  }
}
console.log(`${"─".repeat(50)}\n`);

process.exit(failed > 0 ? 1 : 0);
