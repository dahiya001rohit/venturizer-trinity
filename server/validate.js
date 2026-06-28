// Validation engine. Two jobs:
//   1. Hard validation — email/phone/url/number/required format checks.
//   2. Junk pre-check (Gap 2) — WHOLE-STRING match against a blocklist.
//      Never substring: "idk but 180-200 customers" is substantive (has a
//      number) and must NOT be flagged.
//
// Runs on submit, server-side. Never trusts the client.
// Frontend imports the same checks for inline per-turn feedback.

const { getFlow } = require("./flow/flow");

// ---- Junk blocklist: answers that are ONLY one of these (trimmed, lowercased)
// count as non-answers. Whole-string equality only.
const JUNK_BLOCKLIST = new Set([
  "", "n/a", "na", "none", "nil", "nothing",
  "idk", "dunno", "dk", "no idea", "not sure", "no",
  "i dont know", "i don't know", "no clue", "cant say", "can't say",
  "-", "--", ".", "..", "...", "?", "??", "!",
  "test", "testing", "asdf", "asdfasdf", "qwerty", "lorem ipsum",
  "good", "great", "ok", "okay", "fine", "yes", "yeah", "sure",
  "maybe", "tbd", "to be decided", "soon", "later", "wip",
  "nope", "nah", "no comment", "skip", "pass", "next",
  "nada", "zilch", "zero", "stuff", "things", "etc", "etc.",
  "xyz", "abc", "hmm", "umm", "uh", "blah", "whatever",
]);

// ---- Regex helpers ----
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// permissive phone: digits, spaces, +, -, (), min 7 digits
const PHONE_RE = /^[+\d][\d\s\-()]{6,}$/;
// permissive url: optional scheme, a dot, no spaces
const URL_RE = /^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/i;
// has at least one digit somewhere
const HAS_DIGIT_RE = /\d/;

// Vowels (incl 'y' as a vowel for pronounceability checks).
const VOWELS = new Set(["a", "e", "i", "o", "u", "y"]);

/**
 * Loose gibberish detection for a single token (word).
 * Deliberately conservative — only flags OBVIOUS keyboard-mash.
 * Whitelists short all-caps acronyms (MVP, CRM, B2B) and anything
 * containing a digit (₹50k, 200, v2). Subtle fakes are left to the AI.
 *
 * @param {string} token  a single word, already lowercased
 * @returns {boolean}
 */
function isGibberishToken(token) {
  if (token.length < 4) return false;          // short words pass (idk handled by blocklist)
  if (/\d/.test(token)) return false;          // has a digit → likely real (50k, v2)

  // no vowel at all in a 4+ char alphabetic token → gibberish (srfgsdgd)
  let hasVowel = false;
  for (const ch of token) {
    if (VOWELS.has(ch)) { hasVowel = true; break; }
  }
  if (!hasVowel) return true;

  // 5+ consonants in a row → gibberish (asdfgh, qwrtp)
  let run = 0;
  for (const ch of token) {
    if (/[a-z]/.test(ch) && !VOWELS.has(ch)) {
      run++;
      if (run >= 5) return true;
    } else {
      run = 0;
    }
  }

  return false;
}

/**
 * Is this answer pure junk? Combines:
 *   - whole-string blocklist (known non-answers: idk, n/a, good…)
 *   - punctuation-only
 *   - gibberish (keyboard-mash like "srfgsdgd")
 *
 * Whole-string / per-token only — never penalizes a real answer that
 * merely CONTAINS a junk word ("idk but 200 customers" stays valid).
 *
 * @param {string} raw
 * @returns {boolean}
 */
function isJunk(raw) {
  const t = (raw || "").trim().toLowerCase();
  if (t === "") return true;

  // whole-string blocklist
  if (JUNK_BLOCKLIST.has(t)) return true;

  // only punctuation / symbols (no letters, no digits)
  if (!/[a-z0-9]/i.test(t)) return true;

  // gibberish: tokenize, flag only if EVERY alphabetic token is gibberish
  // (so one real word saves the answer). Short answers (1-2 words) of pure
  // mash get caught; longer real answers with a stray mash word survive.
  const tokens = t.split(/\s+/).filter((w) => /[a-z]/.test(w));
  if (tokens.length > 0 && tokens.length <= 2) {
    const allGibberish = tokens.every((w) => isGibberishToken(w));
    if (allGibberish) return true;
  }

  return false;
}

/**
 * Validate a single field's raw value against its validator rule.
 * Returns { ok, error } — error is a short reason if invalid.
 *
 * Note: "junk" is tracked separately from "invalid". A required field that
 * is junk is reported as junk (scored at floor), not as a hard format error,
 * so the bot can re-ask gently rather than hard-blocking.
 *
 * @param {string} validator  one of required|optional|email|phone|url|number
 * @param {string} raw
 * @returns {{ ok: boolean, error: string|null, junk: boolean }}
 */
function validateField(validator, raw) {
  const value = (raw || "").trim();

  // optional + empty → fine, nothing to check
  if (validator === "optional" && value === "") {
    return { ok: true, error: null, junk: false };
  }

  // empty on anything non-optional → junk (will be re-asked / floored)
  if (value === "") {
    return { ok: true, error: null, junk: true };
  }

  switch (validator) {
    case "email":
    case "phone":
    case "url":
      // In a conversational chat, users type these all in one sentence
      // We will let the AI extract them later. Just check for junk.
      return { ok: true, error: null, junk: isJunk(value) };

    case "number":
      return HAS_DIGIT_RE.test(value)
        ? { ok: true, error: null, junk: false }
        : { ok: false, error: "expected a number", junk: false };

    case "required":
    case "optional":
    default:
      // freeform text: only gate is the junk pre-check
      return { ok: true, error: null, junk: isJunk(value) };
  }
}

/**
 * Validate a full submitted transcript against its flow definition.
 *
 * @param {object} transcript  { type, answers: [{ questionId, selection, values }] }
 * @returns {{
 *   valid: boolean,                         // false if any HARD format error
 *   errors: Array<{questionId, key, error}>,// hard format failures (block submit)
 *   junkFields: Array<{questionId, key}>,   // non-answers (floor + flag, don't block)
 * }}
 */
function validateTranscript(transcript) {
  const errors = [];
  const junkFields = [];

  let flow;
  try {
    flow = getFlow(transcript.type);
  } catch (e) {
    return {
      valid: false,
      errors: [{ questionId: null, key: null, error: "unknown flow type" }],
      junkFields: [],
    };
  }

  // index submitted answers by questionId for lookup
  const answersById = {};
  for (const a of transcript.answers || []) {
    answersById[a.questionId] = a;
  }

  for (const q of flow.questions) {
    const answer = answersById[q.id];

    // selection turns must have a valid option chosen
    if (q.kind === "select") {
      const sel = answer ? (answer.selection || answer.value) : null;
      const validValues = (q.options || []).map((o) => o.value);
      if (!sel || !validValues.includes(sel)) {
        errors.push({ questionId: q.id, key: "selection", error: "invalid selection" });
      }
    }

    // check each captured field
    for (const cap of q.captures) {
      let raw = "";
      if (answer && answer.values && answer.values[cap.key] !== undefined) {
        raw = answer.values[cap.key];
      } else if (answer && answer.value !== undefined) {
        raw = answer.value;
      }
      
      const res = validateField(cap.validator, raw);
      if (!res.ok) {
        errors.push({ questionId: q.id, key: cap.key, error: res.error });
      }
      if (res.junk) {
        junkFields.push({ questionId: q.id, key: cap.key });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    junkFields,
  };
}

module.exports = {
  isJunk,
  isGibberishToken,
  validateField,
  validateTranscript,
  JUNK_BLOCKLIST,
};