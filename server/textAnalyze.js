// Lightweight deterministic text analysis — produces per-dimension AI-like
// params by scanning the raw answer text. No API call needed.
//
// Used as the fallback when Groq is unavailable. Produces MUCH better params
// than the old flat floor-defaults (specificity: 0.3 everywhere) because it
// actually reads the answers.
//
// Limitations vs real AI:
//   - Cannot detect subtle contradictions (supports_selection always true)
//   - Cannot judge argument quality or logical coherence
//   - Named-entity detection is heuristic (capitalized words)
//   - No cross-field consistency checking
//
// But it CAN detect: numbers, currency, percentages, strong-evidence keywords,
// named entities, answer length/detail, and specificity — which is enough to
// move scores from floor to mid-to-upper band.

const { getFlow, getDimensions } = require("./flow/flow");
const { isJunk } = require("./validate");

// ---- regex patterns ----

// Numbers with optional currency/unit context
const QUANT_RE = /(?:₹|rs\.?|inr|\$|usd)?\s*\d[\d,]*\.?\d*\s*(?:l|lakh|lakhs|cr|crore|crores|k|m|mn|million|billion|%|percent|bps)?/gi;

// Percentage patterns
const PERCENT_RE = /\d+(?:\.\d+)?\s*%/g;

// Metric keywords that indicate quantification even without a number nearby
const METRIC_KEYWORDS = new Set([
  "mrr","arr","arpu","ltv","cac",
  "nps","dau","mau","wau","gmv","rev",
  "revenue","run rate","burn rate",
  "runway","yoy","mom","qoq","cagr","roi"
]);

// Strong-evidence keywords — words that indicate real proof/traction
const STRONG_EVIDENCE = new Set([
  "paying", "paid", "revenue", "mrr", "arr", "income",
  "signed", "contract", "agreement", "loi", "mou",
  "customer", "customers", "client", "clients", "user", "users",
  "partner", "partnership", "partnered",
  "pilot", "pilots", "deployed", "live", "launched", "shipping",
  "waitlist", "pipeline", "funnel",
  "retained", "retention", "renewal", "renewed",
  "growing", "growth", "month-over-month", "yoy",
  "acquired", "acquisition",
  "profitable", "profit", "margin",
  "invested", "investment", "portfolio", "fund", "aum",
  "deal", "deals", "cheque", "check", "ticket",
  "board", "advisory", "mentor", "mentored",
  "exit", "exited", "ipo",
]);

// Moderate-evidence keywords — less definitive but still signal
const MODERATE_EVIDENCE = new Set([
  "interested", "interest", "exploring", "conversation",
  "feedback", "responded", "engaged",
  "building", "developing", "prototype", "mvp", "beta",
  "plan", "planned", "planning", "roadmap",
  "network", "connections", "intro", "intros",
  "experience", "experienced", "background", "worked",
  "sector", "thesis", "focus", "strategy",
]);

// ---- named entity detection ----

// Common sentence starters / non-entity capitalized words to ignore
const COMMON_CAPS = new Set([
  "i", "we", "my", "our", "the", "a", "an", "it", "this", "that",
  "yes", "no", "not", "and", "or", "but", "for", "with", "from",
  "about", "been", "have", "has", "had", "are", "is", "was", "were",
  "will", "would", "could", "should", "can", "may", "might",
  "also", "just", "very", "really", "currently", "recently",
  "through", "between", "across", "around", "into", "over",
  "pre", "post", "ex", "via", "per",
  // common non-entity proper-seeming words
  "series", "stage", "seed", "angel", "fund", "round",
]);

/**
 * Detect likely named entities in text.
 * Heuristic: capitalized words (not at sentence start) that aren't common words.
 * Also catches known patterns like "ex-Company" and "B2B/D2C/SaaS".
 *
 * @param {string} text
 * @returns {string[]} detected entity-like tokens
 */
function detectEntities(text) {
  const entities = [];

  // Pattern 1: capitalized words not at sentence start
  // Split into sentences, then check non-first words
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  for (const sentence of sentences) {
    const words = sentence.trim().split(/\s+/);
    for (let i = 1; i < words.length; i++) {
      const w = words[i].replace(/[^a-zA-Z0-9]/g, "");
      if (w.length >= 2 && /^[A-Z]/.test(w) && !COMMON_CAPS.has(w.toLowerCase())) {
        entities.push(w);
      }
    }
  }

  // Pattern 2: known acronym/brand patterns (all-caps 2-5 chars)
  const acronyms = text.match(/\b[A-Z]{2,5}\b/g) || [];
  for (const a of acronyms) {
    if (!COMMON_CAPS.has(a.toLowerCase()) && !["CEO", "CTO", "CFO", "COO", "VP", "MD"].includes(a)) {
      entities.push(a);
    }
  }

  // Pattern 3: "ex-Something" pattern
  const exPatterns = text.match(/ex-[A-Z][a-zA-Z]+/g) || [];
  for (const e of exPatterns) {
    entities.push(e.replace("ex-", ""));
  }

  return [...new Set(entities)];
}

/**
 * Count how many quantification signals are in the text.
 * @param {string} text
 * @returns {{ count: number, hasPercent: boolean, hasCurrency: boolean }}
 */
function detectQuantification(text) {
  const lower = text.toLowerCase();

  const quantMatches = text.match(QUANT_RE) || [];
  const percentMatches = text.match(PERCENT_RE) || [];
  const hasCurrency = /[₹$]/.test(text) || /\b(?:rs|inr|usd|cr|crore|lakh)\b/i.test(text);

  // check for metric keywords
  let metricCount = 0;
  for (const kw of METRIC_KEYWORDS) {
    if (lower.includes(kw)) metricCount++;
  }

  return {
    count: quantMatches.length + percentMatches.length + metricCount,
    hasPercent: percentMatches.length > 0,
    hasCurrency,
  };
}

/**
 * Count evidence-signal keywords in text.
 * @param {string} text
 * @returns {{ strong: number, moderate: number }}
 */
function detectEvidence(text) {
  const words = text.toLowerCase().split(/[\s,;:.()\-—/]+/);
  let strong = 0;
  let moderate = 0;

  for (const w of words) {
    if (STRONG_EVIDENCE.has(w)) strong++;
    if (MODERATE_EVIDENCE.has(w)) moderate++;
  }

  return { strong, moderate };
}

/**
 * Estimate specificity from text features.
 * @param {string} text
 * @param {{ count: number }} quant
 * @param {string[]} entities
 * @returns {number} 0..1
 */
function estimateSpecificity(text, quant, entities) {
  const wordCount = text.split(/\s+/).length;

  let score = 0;

  // length contributes (longer = more specific, with diminishing returns)
  if (wordCount >= 5) score += 0.1;
  if (wordCount >= 15) score += 0.1;
  if (wordCount >= 30) score += 0.1;
  if (wordCount >= 50) score += 0.1;

  // numbers
  if (quant.count >= 1) score += 0.15;
  if (quant.count >= 3) score += 0.1;
  if (quant.hasCurrency) score += 0.05;
  if (quant.hasPercent) score += 0.05;

  // entities
  if (entities.length >= 1) score += 0.1;
  if (entities.length >= 3) score += 0.05;

  // unique words ratio (diverse vocabulary = more specific)
  const unique = new Set(text.toLowerCase().split(/\s+/));
  const diversity = unique.size / Math.max(wordCount, 1);
  if (diversity > 0.6) score += 0.1;

  return Math.min(1, score);
}

/**
 * Estimate evidence strength from detected signals.
 * @param {{ strong: number, moderate: number }} evidence
 * @param {{ count: number }} quant
 * @param {string[]} entities
 * @returns {number} 0..1
 */
function estimateEvidenceStrength(evidence, quant, entities) {
  let score = 0;

  // strong evidence keywords
  if (evidence.strong >= 1) score += 0.2;
  if (evidence.strong >= 3) score += 0.15;
  if (evidence.strong >= 5) score += 0.1;

  // moderate evidence
  if (evidence.moderate >= 1) score += 0.1;
  if (evidence.moderate >= 3) score += 0.05;

  // quantification boosts evidence
  if (quant.count >= 2) score += 0.15;
  if (quant.count >= 4) score += 0.1;

  // named entities = concrete evidence
  if (entities.length >= 1) score += 0.1;
  if (entities.length >= 2) score += 0.05;

  return Math.min(1, score);
}

// ---- main: analyze a full transcript ----

/**
 * Analyze a transcript and produce per-dimension params (same shape as Groq output).
 * Pure deterministic — no API call.
 *
 * @param {object} transcript  { type, answers: [{ questionId, selection, values }] }
 * @returns {object} per-dimension params keyed by dimension name
 */
function analyzeTranscript(transcript) {
  const flow = getFlow(transcript.type);
  const dims = getDimensions(transcript.type);

  // index answers by questionId
  const answersById = {};
  for (const a of transcript.answers || []) {
    answersById[a.questionId] = a;
  }

  // collect all text per dimension
  const textByDim = {};
  for (const d of dims) textByDim[d] = [];

  for (const q of flow.questions) {
    if (!q.scoringDimension) continue;
    const a = answersById[q.id];
    if (!a) continue;
    
    if (a.values) {
      for (const val of Object.values(a.values)) {
        if (typeof val === "string" && val.trim()) {
          textByDim[q.scoringDimension].push(val.trim());
        }
      }
    } else if (a.value && typeof a.value === "string" && a.value.trim()) {
      textByDim[q.scoringDimension].push(a.value.trim());
    }
  }

  // analyze each dimension
  const out = {};
  for (const dim of dims) {
    const combined = textByDim[dim].join(" ");

    if (!combined || isJunk(combined)) {
      // no text or junk → floor defaults
      out[dim] = {
        is_substantive: false,
        specificity: 0,
        has_quantification: false,
        has_named_entities: false,
        evidence_strength: 0,
        internal_consistency: true,   // can't detect without AI
        supports_selection: true,     // can't detect without AI
        confidence: 0.4,             // low but not rock-bottom (we did analyze)
      };
      continue;
    }

    const quant = detectQuantification(combined);
    const entities = detectEntities(combined);
    const evidence = detectEvidence(combined);
    const specificity = estimateSpecificity(combined, quant, entities);
    const evidenceStrength = estimateEvidenceStrength(evidence, quant, entities);

    // confidence: based on how much signal we could extract
    const signalCount = (quant.count > 0 ? 1 : 0)
      + (entities.length > 0 ? 1 : 0)
      + (evidence.strong > 0 ? 1 : 0)
      + (evidence.moderate > 0 ? 1 : 0)
      + (combined.split(/\s+/).length > 15 ? 1 : 0);
    const confidence = Math.min(0.85, 0.4 + signalCount * 0.1);

    out[dim] = {
      is_substantive: true,
      specificity,
      has_quantification: quant.count >= 1,
      has_named_entities: entities.length >= 1,
      evidence_strength: evidenceStrength,
      internal_consistency: true,   // can't detect without AI
      supports_selection: true,     // can't detect without AI
      confidence,
    };
  }

  return out;
}

module.exports = {
  analyzeTranscript,
  // exported for testing
  detectQuantification,
  detectEntities,
  detectEvidence,
  estimateSpecificity,
  estimateEvidenceStrength,
};
