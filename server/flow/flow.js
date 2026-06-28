// Flow entry point. Imports both flows, exposes helpers used by
// frontend (to render) and backend (to validate/score).
//
// Single source of truth — both sides import from here so the flow
// never drifts between client and server.

const { founderFlow } = require("./founder");
const { investorFlow } = require("./investor");

const FLOWS = {
  founder: founderFlow,
  investor: investorFlow,
};

/**
 * Get a full flow definition by type.
 * @param {"founder"|"investor"} type
 * @returns {object} the flow definition (throws if unknown type)
 */
function getFlow(type) {
  const flow = FLOWS[type];
  if (!flow) {
    throw new Error(`[flow] unknown flow type: ${type}`);
  }
  return flow;
}

/**
 * Get a single question by its id within a flow.
 * @param {"founder"|"investor"} type
 * @param {string} questionId
 * @returns {object|null}
 */
function getQuestion(type, questionId) {
  const flow = getFlow(type);
  return flow.questions.find((q) => q.id === questionId) || null;
}

/**
 * Resolve the dynamic prompt for a branch follow-up turn.
 *
 * Turns 4 and 9 (founder) / 4, 7, 9 (investor) have empty `prompt` —
 * their text comes from the PRECEDING select question's branch, based on
 * which option the user chose. This returns the right follow-up prompt.
 *
 * @param {"founder"|"investor"} type
 * @param {string} followUpQuestionId  the empty-prompt turn (e.g. "mvp_detail")
 * @param {string} selectedValue       the option chosen on the select turn
 * @returns {string} the resolved prompt (empty string if none matches)
 */
function resolveBranchPrompt(type, followUpQuestionId, selectedValue) {
  const flow = getFlow(type);
  // Find the select question whose branch fills this follow-up.
  const parent = flow.questions.find(
    (q) => q.branch && q.branch.capturesKey === followUpQuestionId
  );
  if (!parent || !parent.branch) return "";
  return parent.branch.followUps[selectedValue] || "";
}

/**
 * List the scoring dimensions present in a flow (deduped).
 * Useful for the scorer + dashboard breakdown.
 * @param {"founder"|"investor"} type
 * @returns {string[]}
 */
function getDimensions(type) {
  const flow = getFlow(type);
  const dims = new Set();
  for (const q of flow.questions) {
    if (q.scoringDimension) dims.add(q.scoringDimension);
  }
  return [...dims];
}

/**
 * Flatten every captured field key in a flow with its validator.
 * validate.js uses this to know what to check on submit.
 * @param {"founder"|"investor"} type
 * @returns {Array<{questionId: string, key: string, validator: string}>}
 */
function getAllFields(type) {
  const flow = getFlow(type);
  const fields = [];
  for (const q of flow.questions) {
    for (const cap of q.captures) {
      fields.push({ questionId: q.id, key: cap.key, validator: cap.validator });
    }
  }
  return fields;
}

module.exports = {
  getFlow,
  getQuestion,
  resolveBranchPrompt,
  getDimensions,
  getAllFields,
};