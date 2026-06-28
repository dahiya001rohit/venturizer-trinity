// Lead routes. The /submit endpoint is the heart — it orchestrates the full
// pipeline: validate → AI params (or fallback) → score → persist → respond.
//
// Pipeline (PROJECT_CONTEXT §5):
//   1. validate.js re-validates the transcript (never trust client)
//      - hard format errors (bad email) → 400, block submit
//      - junk fields → don't block, passed to scorer for floor + flag
//   2. groq.scoreTranscript() for AI params
//      - success → status "final"
//      - GroqUnavailable → analyzeTranscript() fallback, status "provisional"
//   3. hardScores.scoreTranscript() computes score from params + junk
//   4. insertLead() persists once
//   5. return { id, score, bucket, breakdown, status }

const express = require("express");
const { listLeads, getLeadById, getStats, updateLead } = require("../db/leads.repo");
const { requireAuth } = require("../src/requireAuth");

const router = express.Router();

router.use(requireAuth); // Protect all dashboard endpoints


// ---- GET /api/leads  (dashboard list) ----
router.get("/", async (req, res) => {
  const { type, bucket, limit, offset } = req.query;
  try {
    const leads = await listLeads({
      type: type || undefined,
      bucket: bucket || undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });
    return res.json({ leads });
  } catch (e) {
    console.error("[leads] list failed", e);
    return res.status(500).json({ error: "could not fetch leads" });
  }
});

// ---- GET /api/leads/stats (overview data) ----
router.get("/stats", async (req, res) => {
  try {
    const stats = await getStats();
    return res.json(stats);
  } catch (e) {
    console.error("[leads] getStats failed", e);
    return res.status(500).json({ error: "could not fetch stats" });
  }
});

// ---- GET /api/leads/:id  (lead detail) ----
router.get("/:id", async (req, res) => {
  try {
    const lead = await getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ error: "lead not found" });
    return res.json({ lead });
  } catch (e) {
    console.error("[leads] get failed", e);
    return res.status(500).json({ error: "could not fetch lead" });
  }
});

// ---- PATCH /api/leads/:id (update status, flags, etc) ----
router.patch("/:id", async (req, res) => {
  try {
    // Only allow updating specific fields
    const updates = {};
    if (req.body.bucket) updates.bucket = req.body.bucket;
    if (req.body.flags) updates.flags = JSON.stringify(req.body.flags);
    // Add other fields as needed

    const lead = await updateLead(req.params.id, updates);
    if (!lead) return res.status(404).json({ error: "lead not found or no updates provided" });
    return res.json({ lead });
  } catch (e) {
    console.error("[leads] update failed", e);
    return res.status(500).json({ error: "could not update lead" });
  }
});

// ---- DELETE /api/leads/:id (delete lead) ----
router.delete("/:id", async (req, res) => {
  try {
    const { deleteLead } = require("../db/leads.repo");
    await deleteLead(req.params.id);
    return res.json({ success: true });
  } catch (e) {
    console.error("[leads] delete failed", e);
    return res.status(500).json({ error: "could not delete lead" });
  }
});

// ---- POST /api/leads/:id/rescore (trigger AI rescore) ----
router.post("/:id/rescore", async (req, res) => {
  try {
    const lead = await getLeadById(req.params.id);
    if (!lead) return res.status(404).json({ error: "lead not found" });

    // Mark as processing in DB so UI updates instantly
    await updateLead(lead.id, { score_status: 'processing' });

    // Kick off worker
    const { processLead } = require("../queue");
    processLead({ 
      leadId: lead.id, 
      transcript: { type: lead.type, answers: lead.answers }, 
      junkFields: [] 
    }, "rescoreLead").catch(console.error);

    return res.json({ success: true });
  } catch (e) {
    console.error("[leads] rescore failed", e);
    return res.status(500).json({ error: "could not rescore lead" });
  }
});

module.exports = router;