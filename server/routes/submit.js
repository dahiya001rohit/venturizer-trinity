const express = require("express");
const { validateTranscript } = require("../validate");
const { insertPendingLead } = require("../db/leads.repo");
const { processLead } = require("../queue");

const router = express.Router();

function extractContact(transcript) {
  const byId = {};
  for (const a of transcript.answers || []) byId[a.questionId] = a;

  const intro = byId["intro"];
  const contact = byId["contact"];
  
  let name = intro && intro.values ? intro.values.name : null;
  let email = contact && contact.values ? contact.values.email : null;
  let phone = contact && contact.values ? contact.values.phone : null;
  let linkedin = contact && contact.values ? contact.values.linkedin : null;

  // Fallback: extract from raw unstructured Chat Widget strings using regex
  if (intro && intro.value && !name) {
    const rawIntro = intro.value;
    // VERY simple heuristic: first capitalized word after "I'm" or "name is"
    const nameMatch = rawIntro.match(/(?:i'm|i am|name is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i) || rawIntro.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
    name = nameMatch ? nameMatch[1] : "Founder";
  }

  if (contact && contact.value) {
    const rawContact = contact.value;
    if (!email) {
      const emailMatch = rawContact.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      email = emailMatch ? emailMatch[0] : null;
    }
    if (!phone) {
      const phoneMatch = rawContact.match(/(?:\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/);
      phone = phoneMatch ? phoneMatch[0] : null;
    }
    if (!linkedin) {
      const linkedinMatch = rawContact.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s]*/i);
      linkedin = linkedinMatch ? linkedinMatch[0] : null;
    }
  }

  return { name, email, phone, linkedin };
}

// POST /api/submit
router.post("/", async (req, res) => {
  const transcript = req.body;

  if (!transcript || !transcript.type || !Array.isArray(transcript.answers)) {
    return res.status(400).json({ error: "invalid payload: expected { type, answers[] }" });
  }
  if (transcript.type !== "founder" && transcript.type !== "investor") {
    return res.status(400).json({ error: "type must be 'founder' or 'investor'" });
  }

  // 1. Validate
  const validation = validateTranscript(transcript);
  if (!validation.valid) {
    return res.status(400).json({
      error: "validation failed",
      fields: validation.errors,
    });
  }

  // 2. Insert pending lead
  const contact = extractContact(transcript);
  let saved;
  try {
    saved = await insertPendingLead({
      type: transcript.type,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      linkedin: contact.linkedin,
      answers: transcript.answers,
    });
  } catch (e) {
    console.error("[submit] db insert failed", e);
    return res.status(500).json({ error: "could not save lead" });
  }

  // 3. Process score asynchronously in the background
  try {
    processLead({
      leadId: saved.id,
      transcript,
      junkFields: validation.junkFields,
    }).catch(e => console.error("[submit] background scoring failed", e));
  } catch (e) {
    console.error("[submit] could not start processing", e);
  }

  // 4. Return immediately
  return res.status(202).json({
    message: "submitted",
    id: saved.id,
  });
});

module.exports = router;
