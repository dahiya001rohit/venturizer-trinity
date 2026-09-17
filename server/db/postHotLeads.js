require('dotenv').config()

const hotFounders = [
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm Jordan Smith. We are building an AI-powered CRM for enterprise sales." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "Sales teams waste 40% of their time on data entry." },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "revenue" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "SaaS model, $25k MRR, growing 15% MoM." },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "We have 5 enterprise contracts signed." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "Yes, 3 pilots with Fortune 500 companies." },
      { questionId: "team", question: "Who's on the team?", value: "2 exited founders, ex-Google engineers." },
      { questionId: "funding", question: "What's your funding status?", value: "series_a" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "Raised $1M from Sequoia." },
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "Pricing was too low. We tripled it and didn't lose any customers." },
      { questionId: "contact", question: "Last one — drop your email", value: "jordan@example.com 555-1234 linkedin.com/in/jordan" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "AI will fully automate SDRs in 3 years." }
    ]
  },
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I am Sam Reynolds, building a CI/CD platform for quantum computing." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "Quantum developers have no automated deployment pipelines." },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "revenue" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "We charge $50k/yr per enterprise. Currently at $150k ARR." },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "IBM and Rigetti are our first paying customers." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "Piloting with two national labs right now." },
      { questionId: "team", question: "Who's on the team?", value: "3 PhDs in quantum physics, all technical." },
      { questionId: "funding", question: "What's your funding status?", value: "seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "YCombinator W24 batch, raising seed." },
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "Hardware is still too early, but software abstraction is needed today." },
      { questionId: "contact", question: "Last one — drop your email", value: "sam@quantumdeploy.dev 123-456-7890" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "Software abstraction will define the quantum era, not hardware." }
    ]
  },
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "Ali Rahman here. We've built a cross-border payroll API for emerging markets." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "Paying contractors in LatAm and Africa takes 5 days and 10% in fees." },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "revenue" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "We take 1% on volume. Processing $2M/mo in volume right now." },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "Volume is growing 30% month-over-month." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "Integrating with Deel as a backend provider." },
      { questionId: "team", question: "Who's on the team?", value: "Ex-Stripe and ex-Plaid engineers." },
      { questionId: "funding", question: "What's your funding status?", value: "seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "Bootstrapped to $2M/mo volume, now raising $3M seed." },
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "Compliance is a nightmare, so we acquired a local license." },
      { questionId: "contact", question: "Last one — drop your email", value: "ali@borderless.io" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "Local licenses matter more than tech in fintech." }
    ]
  },
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "My name is Priya Patel. Building an FDA-cleared AI for radiology." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "Radiologists miss 15% of early-stage lung cancers due to fatigue." },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "live" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "Product is live in 4 hospitals. Software-as-a-medical-device." },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "We received FDA Class II clearance last week." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "4 hospital systems using it clinically." },
      { questionId: "team", question: "Who's on the team?", value: "2 MDs and an AI researcher from DeepMind." },
      { questionId: "funding", question: "What's your funding status?", value: "series_a" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "Raised $4M seed, looking for $10M Series A." },
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "Doctors didn't trust the black box, so we added explainable AI layers." },
      { questionId: "contact", question: "Last one — drop your email", value: "priya@rad-ai.med" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "You must integrate into the existing PACS viewer, not make a new app." }
    ]
  },
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "Alex Chen here. We make solid-state batteries for grid storage." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "Lithium-ion is too expensive and dangerous for utility-scale solar." },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "building" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "We have lab-scale prototypes and $10M in LOIs." },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "Signed LOI from NextEra Energy." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "Building a 1MWh pilot facility." },
      { questionId: "team", question: "Who's on the team?", value: "Ex-Tesla battery engineering leads." },
      { questionId: "funding", question: "What's your funding status?", value: "seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "Grant funded by the DOE, raising seed." },
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "Scaling from lab to factory is hard, so we hired a manufacturing VP." },
      { questionId: "contact", question: "Last one — drop your email", value: "alex@solidgrid.energy" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "Cost per kWh matters more than energy density for the grid." }
    ]
  }
]

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function run() {
  console.log("Submitting 5 UNIQUE HOT leads...");

  for (let i = 0; i < 5; i++) {
    const payload = hotFounders[i]

    console.log(`Submitting unique hot lead ${i + 1}/5 (${payload.answers[0].value.split('.')[0]})...`)
    try {
      const response = await fetch("http://localhost:4000/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      console.log("Response:", data)
      
      console.log("Waiting 5 seconds for background AI to process before sending next...")
      await sleep(5000)
    } catch (e) {
      console.error("Fetch failed:", e)
    }
  }

  console.log("All 5 unique hot leads submitted!");
  process.exit(0);
}

run().catch(console.error);
