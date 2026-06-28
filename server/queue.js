const { scoreTranscript: aiScore, analyzeTranscript, GroqUnavailable } = require("./groc");
const { scoreTranscript: computeScore } = require("./hardScores");
const { updateLeadScore } = require("./db/leads.repo");

/**
 * In-memory background worker to score leads without requiring Redis/BullMQ.
 * This runs entirely within the Node.js event loop, preventing crashes if external queues go down.
 */
async function processLead({ leadId, transcript, junkFields }, jobName = "scoreLead") {
  let aiParams;
  let scoreStatus = "final";
  let needsAiRescore = false;

  try {
    console.log(`[worker] Processing ${jobName} for lead ${leadId}`);
    aiParams = await aiScore(transcript);
  } catch (e) {
    if (e instanceof GroqUnavailable) {
      console.warn(`[worker] Groq unavailable for lead ${leadId}, falling back to provisional scoring`);
      aiParams = analyzeTranscript(transcript);
      scoreStatus = "provisional";
      needsAiRescore = true;
    } else {
      console.error(`[worker] Unexpected scoring error for lead ${leadId}`, e);
      aiParams = analyzeTranscript(transcript);
      scoreStatus = "provisional";
      needsAiRescore = true;
    }
  }

  const result = computeScore(transcript, aiParams, junkFields);
  const flags = [...result.flags];

  if (scoreStatus === "provisional") {
    flags.push({ type: "provisional", reason: "scored without AI — rescore queued" });
  }

  const name = aiParams && aiParams.name ? aiParams.name : null;
  const email = aiParams && aiParams.email ? aiParams.email : null;
  const phone = aiParams && aiParams.phone ? aiParams.phone : null;
  const linkedin = aiParams && aiParams.linkedin ? aiParams.linkedin : null;

  await updateLeadScore(leadId, {
    score: result.total,
    bucket: result.bucket,
    breakdown: result.breakdown,
    flags,
    aiParams,
    scoreStatus,
    needsAiRescore,
    name,
    email,
    phone,
    linkedin,
  });

  console.log(`[worker] Successfully scored lead ${leadId} (status: ${scoreStatus})`);

  // If provisional, we schedule a rescore job with a 30 second delay using Node.js setTimeout
  if (scoreStatus === "provisional" && jobName === "scoreLead") {
    console.log(`[worker] Scheduled rescore for lead ${leadId} in 30 seconds`);
    setTimeout(() => {
      processLead({ leadId, transcript, junkFields }, "rescoreLead");
    }, 30000);
  }
}

module.exports = { processLead };
