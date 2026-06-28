#!/usr/bin/env node
/**
 * test.js — End-to-end pipeline smoke test.
 *
 * Exercises the full scoring pipeline:
 *   flow (questions + answers) → validate → groq (or fallback) → hardScores → persist → return
 *
 * Usage:
 *   node test.js              # uses fallback (no Groq call)
 *   node test.js --live-ai    # calls Groq API (needs valid GROQ_API_KEY in .env)
 *   node test.js --no-db      # skip DB persist step
 *
 * Prints each stage's output so you can see the pipeline working.
 */

// ---- bootstrap env (must come before anything that reads env) ----
require("dotenv").config();

const { getFlow }           = require("./flow/flow");
const { validateTranscript } = require("./validate");
const { scoreTranscript: groqScore, analyzeTranscript, GroqUnavailable } = require("./groc");
const { scoreTranscript: hardScore } = require("./hardScores");
const { insertLead }        = require("./db/leads.repo");
const { pingDb, pool }      = require("./db/pool");

// ---- CLI flags ----
const LIVE_AI = process.argv.includes("--live-ai");
const SKIP_DB = process.argv.includes("--no-db");

// ---- helper: pretty print ----
function section(title) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`  ${title}`);
  console.log("=".repeat(60));
}

function json(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

// ---- build a realistic founder transcript ----
function buildFounderTranscript() {
  const flow = getFlow("founder");

  return {
    type: "founder",
    answers: [
      {
        questionId: "intro",
        values: {
          name: "Arjun Mehta",
          one_liner: "NexPay — an AI-powered B2B payments reconciliation platform that cuts close-time from 5 days to 4 hours for mid-market D2C brands",
        },
      },
      {
        questionId: "problem",
        values: {
          problem: "Mid-market D2C brands (₹5Cr–₹100Cr revenue) lose 2–4% of revenue to reconciliation errors across 6+ payment gateways and 3+ bank accounts. Finance teams spend 40+ hours/month manually matching transactions in spreadsheets. The average brand has 12,000 unreconciled transactions per month.",
          who: "CFOs and finance heads at D2C brands doing ₹5Cr–₹100Cr annual revenue. We've validated with 28 finance leaders — 24 said reconciliation is their #1 operational bottleneck.",
        },
      },
      {
        questionId: "mvp_stage",
        selection: "revenue",
        values: { mvp_stage: "revenue" },
      },
      {
        questionId: "mvp_detail",
        values: {
          mvp_detail: "Live since January 2026. Processing ₹47Cr in monthly transaction volume across 18 paying customers. Our AI auto-matches 94.2% of transactions — up from 87% at launch. Average customer saves 35 hours/month in finance team time. Zero critical bugs in the last 90 days.",
        },
      },
      {
        questionId: "traction",
        values: {
          users: "18 paying customers, 3 more in onboarding pipeline. 340 daily active users across all accounts. 97% monthly retention — only lost 1 customer (they got acquired).",
          revenue: "₹6.2L MRR, growing 22% month-over-month for the last 4 months. LTV:CAC ratio is 4.8x. Annual contract value averages ₹4.1L per customer.",
        },
      },
      {
        questionId: "pilots",
        values: {
          pilots: "Signed partnership with Razorpay for co-marketing to their D2C merchant base (3,200 qualifying merchants). LOI from Cashfree to integrate NexPay into their merchant dashboard. BoAt and Mamaearth are on paid annual plans. Pilot with Nykaa's finance team starts next month.",
        },
      },
      {
        questionId: "team",
        values: {
          team_size: "5 — 2 co-founders, 2 engineers, 1 customer success manager",
          tech_cofounder: "Yes — my co-founder Priya Sharma, ex-Stripe (4 years, payments infra team lead). She built the reconciliation engine and the ML matching pipeline. I'm ex-Razorpay (product, 3 years).",
        },
      },
      {
        questionId: "funding",
        selection: "seed",
        values: {
          funding_amount: "Raising ₹2.5Cr seed round",
          funding_stage: "seed",
        },
      },
      {
        questionId: "funding_milestone",
        values: {
          funding_milestone: "Hit 50 paying customers and ₹18L MRR within 9 months. Use the round to hire 3 more engineers, build the ERP integration layer (Tally + Zoho), and launch the enterprise tier targeting ₹100Cr+ brands.",
        },
      },
      {
        questionId: "validation",
        values: {
          validation: "18 paying customers generating ₹6.2L MRR. 3 signed annual contracts (BoAt, Mamaearth, WOW Skin Science) worth ₹12.3L total. Razorpay partnership LOI signed. 42 companies on the waitlist from a single Product Hunt launch (#3 Product of the Day). NPS score of 72 from our last customer survey.",
        },
      },
      {
        questionId: "contact",
        values: {
          email: "arjun@nexpay.in",
          phone: "+91-9988776655",
          linkedin: "https://linkedin.com/in/arjunmehta",
        },
      },
      {
        questionId: "founder_insight",
        values: {
          founder_insight: "Everyone in fintech is building better payment acceptance — nobody is solving what happens AFTER the money lands. Reconciliation is a $4.7B global problem hiding in spreadsheets. We know this because we lived it: at Razorpay I watched 200+ merchants struggle with the same reconciliation chaos every month-end. The insight is that 94% of transaction matching follows learnable patterns — you don't need rules engines, you need ML that adapts to each merchant's payment stack.",
        },
      },
    ],
  };
}

// ---- main pipeline ----
async function main() {
  console.log("🚀 Trinity Pipeline Test");
  console.log(`   Mode: ${LIVE_AI ? "LIVE AI (Groq)" : "FALLBACK (no AI call)"}`);
  console.log(`   DB:   ${SKIP_DB ? "SKIPPED" : "will persist"}`);

  // ──── STEP 1: Flow ────
  section("STEP 1 — FLOW (questions + simulated answers)");
  const transcript = buildFounderTranscript();
  const flow = getFlow(transcript.type);
  console.log(`Flow type: ${transcript.type}`);
  console.log(`Questions: ${flow.questions.length}`);
  console.log(`Answers provided: ${transcript.answers.length}`);
  console.log("\nQ&A summary:");
  for (const q of flow.questions) {
    const a = transcript.answers.find((x) => x.questionId === q.id);
    const sel = a && a.selection ? ` [selected: ${a.selection}]` : "";
    const vals = a && a.values
      ? Object.entries(a.values).map(([k, v]) => `  ${k}: ${v.substring(0, 80)}${v.length > 80 ? "…" : ""}`).join("\n")
      : "  (no answer)";
    console.log(`\n  Q${q.turn}. ${q.id} (${q.kind})${sel}${q.scoringDimension ? ` → scores: ${q.scoringDimension}` : ""}`);
    console.log(vals);
  }

  // ──── STEP 2: Validate ────
  section("STEP 2 — VALIDATE");
  const validation = validateTranscript(transcript);
  console.log(`Valid: ${validation.valid}`);
  if (validation.errors.length > 0) {
    console.log("Hard errors:");
    json(validation.errors);
  } else {
    console.log("No hard validation errors ✓");
  }
  if (validation.junkFields.length > 0) {
    console.log("Junk fields (will be floored in scoring):");
    json(validation.junkFields);
  } else {
    console.log("No junk fields detected ✓");
  }

  if (!validation.valid) {
    console.error("\n❌ Transcript has hard validation errors — pipeline would stop here in production.");
    process.exit(1);
  }

  // ──── STEP 3: Groq (or fallback) ────
  section("STEP 3 — GROQ AI SCORING (or fallback)");
  let aiParams;
  let scoreStatus;
  let needsAiRescore;

  if (LIVE_AI) {
    console.log("Calling Groq API…");
    try {
      aiParams = await groqScore(transcript);
      scoreStatus = "final";
      needsAiRescore = false;
      console.log("✓ Groq returned AI params:");
      json(aiParams);
    } catch (err) {
      if (err instanceof GroqUnavailable) {
        console.log(`⚠  Groq unavailable: ${err.message}`);
        console.log("   Falling back to deterministic floor-default params…");
        aiParams = analyzeTranscript(transcript);
        scoreStatus = "provisional";
        needsAiRescore = true;
        console.log("Fallback params:");
        json(aiParams);
      } else {
        throw err;
      }
    }
  } else {
    console.log("Using deterministic text-analysis fallback (pass --live-ai to call Groq)");
    aiParams = analyzeTranscript(transcript);
    scoreStatus = "provisional";
    needsAiRescore = true;
    console.log("Text-analysis params:");
    json(aiParams);
  }

  // ──── STEP 4: Hard scores ────
  section("STEP 4 — HARD SCORES (deterministic)");
  const result = hardScore(transcript, aiParams, validation.junkFields);
  console.log(`Total score: ${result.total} / 100`);
  console.log(`Bucket: ${result.bucket.toUpperCase()}`);
  console.log("\nBreakdown:");
  for (const [dim, info] of Object.entries(result.breakdown)) {
    const bar = "█".repeat(Math.round(info.score / info.max * 10)).padEnd(10, "░");
    console.log(`  ${dim.padEnd(18)} ${bar} ${info.score}/${info.max}`);
  }
  if (result.flags.length > 0) {
    console.log("\nFlags:");
    json(result.flags);
  } else {
    console.log("\nNo flags ✓");
  }

  // ──── STEP 5: Persist ────
  section("STEP 5 — PERSIST (DB insert)");
  if (SKIP_DB) {
    console.log("Skipped (--no-db flag). Would insert this lead:");
    const lead = buildLeadPayload(transcript, result, aiParams, scoreStatus, needsAiRescore);
    json(lead);
  } else {
    // check DB connectivity first
    const dbOk = await pingDb();
    if (!dbOk) {
      console.log("⚠  Database unreachable — skipping persist. (Run with --no-db to skip silently)");
      const lead = buildLeadPayload(transcript, result, aiParams, scoreStatus, needsAiRescore);
      console.log("\nWould have inserted:");
      json(lead);
    } else {
      const lead = buildLeadPayload(transcript, result, aiParams, scoreStatus, needsAiRescore);
      console.log("Inserting lead into database…");
      const row = await insertLead(lead);
      console.log(`✓ Lead persisted — id: ${row.id}, created_at: ${row.created_at}`);
    }
    // close the pool so the process exits cleanly
    await pool.end();
  }

  // ──── STEP 6: Return ────
  section("STEP 6 — RETURN (API response shape)");
  const response = {
    ok: true,
    score: result.total,
    bucket: result.bucket,
    breakdown: result.breakdown,
    flags: result.flags,
    scoreStatus,
    needsAiRescore,
  };
  console.log("API response payload:");
  json(response);

  console.log(`\n✅ Pipeline complete! Bucket: ${result.bucket.toUpperCase()} (${result.total}/100)\n`);
}

// ---- build the lead payload for DB insert ----
function buildLeadPayload(transcript, result, aiParams, scoreStatus, needsAiRescore) {
  const vals = {};
  for (const a of transcript.answers) {
    Object.assign(vals, a.values || {});
  }
  return {
    type: transcript.type,
    name: vals.name || null,
    email: vals.email || null,
    phone: vals.phone || null,
    linkedin: vals.linkedin || null,
    answers: transcript.answers,
    score: result.total,
    bucket: result.bucket,
    breakdown: result.breakdown,
    flags: result.flags,
    aiParams: aiParams,
    scoreStatus,
    needsAiRescore,
  };
}

main().catch((err) => {
  console.error("\n💥 Pipeline failed:", err);
  process.exit(1);
});
