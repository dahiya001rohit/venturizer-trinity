require('dotenv').config()

const balancedLeads = [
  // Good Founder (Target 70s): High traction (1), High problem (1), Low team (0)
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm Alice." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "Strong proof: 100 paying customers hate manual data entry." },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "live" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "Strong proof: we have 50 paying customers." },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "Strong proof: 50 signed deals and paying customers." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "Yes, signed deals for pilots." },
      { questionId: "team", question: "Who's on the team?", value: "vague claim, no proof" }, // Forces 0
      { questionId: "funding", question: "What's your funding status?", value: "seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "vague claim, no proof" }, // Forces 0
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "vague claim" },
      { questionId: "contact", question: "Last one — drop your email", value: "alice@good.co" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "vague claim" }
    ]
  },
  // Good Investor (Target 70s): High cheque (1), Low thesis (0), Low portfolio (0)
  {
    type: "investor",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm Bob." },
      { questionId: "thesis", question: "What's your investment thesis", value: "vague claim" }, // Forces 0
      { questionId: "stage", question: "Which stage do you typically invest in?", value: "seed" },
      { questionId: "stage_detail", question: "At that early stage, what gives you conviction", value: "vague claim" },
      { questionId: "cheque", question: "What's your typical cheque size per deal", value: "Strong proof: 5 signed deals of $500,000." }, // Forces 1
      { questionId: "portfolio", question: "Tell us about your track record", value: "some" },
      { questionId: "portfolio_detail", question: "What stage were those companies at", value: "vague claim" }, // Forces 0
      { questionId: "timeline", question: "How soon are you looking to deploy capital?", value: "near" },
      { questionId: "timeline_detail", question: "What would make you say yes", value: "vague claim" },
      { questionId: "support", question: "Beyond capital, what do you bring", value: "vague claim" },
      { questionId: "contact", question: "How can the Venturizer team reach you?", value: "bob@good.vc" },
      { questionId: "alignment", question: "Last one — what are you hoping to find", value: "vague claim" }
    ]
  },
  // Maybe Founder (Target 50s): High team (1), Low traction (0), Low problem (0), Idea stage
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm Charlie." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "vague claim" }, // Forces 0
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "idea" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "vague claim" },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "vague claim, no proof" }, // Forces 0
      { questionId: "pilots", question: "Are you running any pilots?", value: "no" },
      { questionId: "team", question: "Who's on the team?", value: "Strong proof of real track record: 5 past signed deals and paying customers." }, // Forces 1
      { questionId: "funding", question: "What's your funding status?", value: "pre_seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "vague claim" },
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "vague claim" },
      { questionId: "contact", question: "Last one — drop your email", value: "charlie@maybe.co" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "vague claim" }
    ]
  },
  // Maybe Investor (Target 50s): High portfolio (1), Low cheque (0), Low timeline (0)
  {
    type: "investor",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm Diana." },
      { questionId: "thesis", question: "What's your investment thesis", value: "vague claim" },
      { questionId: "stage", question: "Which stage do you typically invest in?", value: "agnostic" },
      { questionId: "stage_detail", question: "At that early stage, what gives you conviction", value: "vague claim" },
      { questionId: "cheque", question: "What's your typical cheque size per deal", value: "vague claim" }, // Forces 0
      { questionId: "portfolio", question: "Tell us about your track record", value: "experienced" },
      { questionId: "portfolio_detail", question: "What stage were those companies at", value: "Strong proof: 20 signed deals and paying customers in past." }, // Forces 1
      { questionId: "timeline", question: "How soon are you looking to deploy capital?", value: "exploring" },
      { questionId: "timeline_detail", question: "What would make you say yes", value: "vague claim" },
      { questionId: "support", question: "Beyond capital, what do you bring", value: "vague claim" },
      { questionId: "contact", question: "How can the Venturizer team reach you?", value: "diana@maybe.vc" },
      { questionId: "alignment", question: "Last one — what are you hoping to find", value: "vague claim" }
    ]
  },
  // Good Founder 2 (Target 70s): High team (1), High traction (1), Low problem (0), MVP Building
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm Eve." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "vague claim" },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "building" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "vague claim" },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "Strong proof: 10 signed deals." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "no" },
      { questionId: "team", question: "Who's on the team?", value: "Strong proof of real track record: previously 50 paying customers." },
      { questionId: "funding", question: "What's your funding status?", value: "seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "vague claim" },
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "vague claim" },
      { questionId: "contact", question: "Last one — drop your email", value: "eve@good.co" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "vague claim" }
    ]
  },
  // Maybe Founder 2 (Target 50s): Low traction (0), High problem (1), Idea stage
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm Frank." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "Strong proof: 500 paying customers face this exact issue costing $10,000." },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "idea" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "vague claim" },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "vague claim" },
      { questionId: "pilots", question: "Are you running any pilots?", value: "no" },
      { questionId: "team", question: "Who's on the team?", value: "vague claim" },
      { questionId: "funding", question: "What's your funding status?", value: "pre_seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "vague claim" },
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "vague claim" },
      { questionId: "contact", question: "Last one — drop your email", value: "frank@maybe.co" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "vague claim" }
    ]
  },
  // Good Investor 2 (Target 70s): High timeline (1), High thesis (1), Low cheque (0)
  {
    type: "investor",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm George." },
      { questionId: "thesis", question: "What's your investment thesis", value: "Strong proof: I have 20 paying customers in B2B SaaS." },
      { questionId: "stage", question: "Which stage do you typically invest in?", value: "series_a" },
      { questionId: "stage_detail", question: "At that early stage, what gives you conviction", value: "vague claim" },
      { questionId: "cheque", question: "What's your typical cheque size per deal", value: "vague claim" },
      { questionId: "portfolio", question: "Tell us about your track record", value: "some" },
      { questionId: "portfolio_detail", question: "What stage were those companies at", value: "vague claim" },
      { questionId: "timeline", question: "How soon are you looking to deploy capital?", value: "now" },
      { questionId: "timeline_detail", question: "What would make you say yes", value: "Strong proof: I have 3 signed deals today." },
      { questionId: "support", question: "Beyond capital, what do you bring", value: "vague claim" },
      { questionId: "contact", question: "How can the Venturizer team reach you?", value: "george@good.vc" },
      { questionId: "alignment", question: "Last one — what are you hoping to find", value: "vague claim" }
    ]
  }
];

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function run() {
  console.log(`Submitting ${balancedLeads.length} mathematically balanced leads to /api/submit...`);

  for (let i = 0; i < balancedLeads.length; i++) {
    const payload = balancedLeads[i]

    console.log(`Submitting lead ${i + 1}/${balancedLeads.length} (${payload.type})...`)
    try {
      const response = await fetch("http://localhost:4000/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      console.log("Response:", data)
      
      console.log("Waiting 6 seconds for background AI to process before sending next...")
      await sleep(6000)
    } catch (e) {
      console.error("Fetch failed:", e)
    }
  }

  console.log(`All ${balancedLeads.length} leads submitted via POST requests!`);
  process.exit(0);
}

run().catch(console.error);
