// Groq AI layer. Produces the per-dimension AI params that hardScores.js
// consumes. Returns JSON only — never code.
//
// Resilience (PROJECT_CONTEXT §5, Gap 3 + Gap 4 Phase 1):
//   - 2 quick retries, short timeout each (~2.5s)
//   - safeParse with PER-FIELD defaults — partial/malformed survives
//   - on total failure → throws GroqUnavailable so caller uses floor-default fallback
//   - ping() for cheap health checks (background rescore, /health)
//
// The final scoring call sees the WHOLE transcript and is asked to check
// cross-field consistency (Gap 6) + per-answer contradiction (Gap 1).

const Groq = require("groq-sdk");
const { env } = require("./src/env");
const { getFlow, getDimensions } = require("./flow/flow");

const client = new Groq({ apiKey: env.GROQ_API_KEY });

const MAX_RETRIES = 2;
const TIMEOUT_MS = 2500;
const RETRY_GAP_MS = 800;

// Signal type so callers can distinguish "AI down" from other errors.
class GroqUnavailable extends Error {
  constructor(msg) {
    super(msg || "groq unavailable");
    this.name = "GroqUnavailable";
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Wrap a promise with a hard timeout.
function withTimeout(promise, ms) {
  let t;
  const timeout = new Promise((_, rej) => {
    t = setTimeout(() => rej(new Error("timeout")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
}

// ---------- prompt construction ----------

function buildPrompt(transcript) {
  const flow = getFlow(transcript.type);
  const dims = getDimensions(transcript.type);

  // turn the transcript into readable Q/A pairs for the model
  const answersById = {};
  for (const a of transcript.answers || []) answersById[a.questionId] = a;

  const lines = [];
  for (const q of flow.questions) {
    const a = answersById[q.id];
    const sel = a && (a.selection || a.value) ? ` [selected: ${a.selection || a.value}]` : "";
    let vals = "(no answer)";
    if (a && a.values) {
      vals = Object.entries(a.values).map(([k, v]) => `${k}: ${v}`).join(" | ");
    } else if (a && a.value) {
      vals = a.value;
    }
    const dim = q.scoringDimension ? ` (scores: ${q.scoringDimension})` : "";
    lines.push(`Q${q.turn} ${q.id}${dim}${sel}\n  ${vals}`);
  }

  const schema = dims
    .map(
      (d) =>
        `"${d}": { "is_substantive": bool, "specificity": 0..1, "has_quantification": bool, "has_named_entities": bool, "evidence_strength": 0..1, "internal_consistency": bool, "supports_selection": bool, "confidence": 0..1 }`
    )
    .join(",\n    ");

  return `You are a lead-qualification analyst for Venturizer, an early-stage venture firm. You are scoring a ${transcript.type}'s intake responses.

For EACH scoring dimension below, assess the backing answer(s) and return structured signals. Do NOT compute a final score — only these per-dimension signals. A separate deterministic system computes the score from your signals.

Signal meanings:
- is_substantive: false if the answer is empty, gibberish, or says nothing real ("we're doing great").
- specificity: 0 = vague/generic, 1 = sharp and concrete.
- has_quantification: true if the answer contains real numbers (users, revenue, %, cheque size).
- has_named_entities: true if it names specific customers, partners, places, or facts.
- evidence_strength: 0 = no proof, 1 = strong proof (paying customers, signed deals, real track record).
- internal_consistency: false if the answer contradicts itself.
- supports_selection: false ONLY if the answer EXPLICITLY contradicts the option the user selected (e.g. selected "Revenue" but says "we don't charge yet"). Low/modest numbers do NOT count as contradiction.
- confidence: your confidence in this assessment, 0..1.

Also check consistency ACROSS all answers: if one answer contradicts another (e.g. "no revenue" in one place but "paying customers" elsewhere), set supports_selection=false and internal_consistency=false on the affected dimensions.

INTAKE RESPONSES:
${lines.join("\n")}

Return ONLY a JSON object, no markdown, no backticks, no prose, exactly this shape:
{
  ${schema}
}`;
}

// ---------- safe JSON parse with per-field defaults ----------

function safeParse(text, dims) {
  let obj;
  try {
    // strip accidental code fences / leading prose
    const cleaned = text.replace(/```json|```/g, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    obj = JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
  if (!obj || typeof obj !== "object") return null;

  // fill defaults per dimension so partial responses are usable
  const out = {};
  for (const d of dims) {
    const v = obj[d] || {};
    out[d] = {
      is_substantive: v.is_substantive !== false,
      specificity: clamp01(v.specificity),
      has_quantification: v.has_quantification === true,
      has_named_entities: v.has_named_entities === true,
      evidence_strength: clamp01(v.evidence_strength),
      internal_consistency: v.internal_consistency !== false,
      supports_selection: v.supports_selection !== false,
      confidence: typeof v.confidence === "number" ? clamp01(v.confidence) : 0.5,
    };
  }
  return out;
}

function clamp01(n) {
  return typeof n === "number" ? Math.max(0, Math.min(1, n)) : 0;
}

// ---------- public: scoreTranscript ----------

/**
 * Call Groq to get per-dimension AI params for a transcript.
 * Retries on failure; throws GroqUnavailable after exhausting retries
 * so the caller can use the deterministic floor-default fallback.
 *
 * @param {object} transcript  { type, answers }
 * @returns {Promise<object>}  per-dimension params (keyed by dimension)
 * @throws {GroqUnavailable}
 */
async function scoreTranscript(transcript) {
  const dims = getDimensions(transcript.type);
  const prompt = buildPrompt(transcript);

  let lastErr;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const resp = await withTimeout(
        client.chat.completions.create({
          model: env.GROQ_MODEL,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2,
          max_tokens: 1200,
          response_format: { type: "json_object" },
        }),
        TIMEOUT_MS
      );

      const text = resp.choices?.[0]?.message?.content || "";
      const parsed = safeParse(text, dims);
      if (parsed) return parsed;
      lastErr = new Error("unparseable response");
    } catch (e) {
      lastErr = e;
    }
    if (attempt < MAX_RETRIES) await sleep(RETRY_GAP_MS);
  }

  throw new GroqUnavailable(lastErr ? lastErr.message : "scoring failed");
}

// ---------- public: ping ----------

/**
 * Cheap health check. Returns true if Groq responds.
 * Used by the background rescore job + /health.
 * @returns {Promise<boolean>}
 */
async function ping() {
  try {
    const resp = await withTimeout(
      client.chat.completions.create({
        model: env.GROQ_MODEL,
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 5,
      }),
      TIMEOUT_MS
    );
    return !!resp.choices?.[0]?.message;
  } catch {
    return false;
  }
}

// ---------- fallback params (deterministic text analysis, no API) ----------
// When Groq is unavailable, analyzeTranscript() reads the answers and produces
// real per-dimension params (far better than flat defaults). Documented limits:
// no contradiction detection, no cross-field consistency — those stay AI-only.
const { analyzeTranscript } = require("./textAnalyze");

module.exports = {
  scoreTranscript,
  ping,
  analyzeTranscript, // deterministic fallback when Groq is down
  GroqUnavailable,
  // exported for tests
  buildPrompt,
  safeParse,
};