require('dotenv').config()
const { pool } = require('./pool')

const perfectFounders = [
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm Jordan Smith. We are building an AI-powered CRM for enterprise sales." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "Enterprise sales teams waste exactly 40% of their time on data entry, costing them $25,000 per rep annually." },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "revenue" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "SaaS model, we are at $100,000 MRR, growing 20% month-over-month." },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "We have 150 paying enterprise customers and $1.2M in annual recurring revenue." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "Yes, 12 paid pilots with Fortune 500 companies converting at 90%." },
      { questionId: "team", question: "Who's on the team?", value: "3 cofounders. 2 are technical PhDs in machine learning from MIT." },
      { questionId: "funding", question: "What's your funding status?", value: "pre_seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "Raising $2,000,000 to reach $5,000,000 ARR in 18 months." },
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "We have 500 signed letters of intent from buyers. The hardest feedback was onboarding time, which we reduced to 2 days." },
      { questionId: "contact", question: "Last one — drop your email", value: "jordan@perfectcrm.com 555-123-4567" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "AI will fully automate 80% of SDRs in exactly 3 years." }
    ]
  },
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I am Sam Reynolds, building a CI/CD platform for quantum computing." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "Quantum developers spend 15 hours a week deploying code, a $1B market inefficiency." },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "revenue" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "We charge $50,000 per enterprise. Currently at $500,000 ARR." },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "IBM and Rigetti are our first 10 paying customers, generating $500k ARR." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "Piloting with 5 national labs right now with 100% success rate." },
      { questionId: "team", question: "Who's on the team?", value: "4 PhDs in quantum physics, all 4 are technical engineers." },
      { questionId: "funding", question: "What's your funding status?", value: "seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "Raising $3,000,000 seed to double our headcount." },
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "We have 20 paying customers. They wanted faster compile times, so we reduced it by 50%." },
      { questionId: "contact", question: "Last one — drop your email", value: "sam@quantumdeploy.dev 123-456-7890" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "Software abstraction will define the quantum era within 5 years." }
    ]
  }
]

const perfectInvestors = [
  {
    type: "investor",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm David Chen. I am managing partner at a $100M VC fund." },
      { questionId: "thesis", question: "What's your investment thesis", value: "We invest in B2B SaaS companies with over $10,000 ACV and 100% year-over-year growth." },
      { questionId: "stage", question: "Which stage do you typically invest in?", value: "pre_seed" },
      { questionId: "stage_detail", question: "At that early stage, what gives you conviction", value: "We need to see at least 3 technical founders and 10 paying customers." },
      { questionId: "cheque", question: "What's your typical cheque size per deal", value: "We lead rounds with exactly $2,000,000 to $3,000,000 cheques per deal." },
      { questionId: "portfolio", question: "Tell us about your track record", value: "experienced" },
      { questionId: "portfolio_detail", question: "What stage were those companies at", value: "We have made 50 investments, and 5 of them are unicorns valued at over $1,000,000,000." },
      { questionId: "timeline", question: "How soon are you looking to deploy capital?", value: "now" },
      { questionId: "timeline_detail", question: "What would make you say yes", value: "I need to deploy $10,000,000 this quarter and will sign a term sheet in 7 days for the right team." },
      { questionId: "support", question: "Beyond capital, what do you bring", value: "We join the board, recruit 3 executives for you, and introduce you to 50 enterprise buyers." },
      { questionId: "contact", question: "How can the Venturizer team reach you?", value: "david@vc.fund 555-987-6543" },
      { questionId: "alignment", question: "Last one — what are you hoping to find", value: "I am looking for exactly 3 investments this year with 100x return potential." }
    ]
  },
  {
    type: "investor",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "Elena Rodriguez. Solo GP of a $50M seed fund." },
      { questionId: "thesis", question: "What's your investment thesis", value: "Deeptech and robotics hardware with at least 5 filed patents and 60% gross margins." },
      { questionId: "stage", question: "Which stage do you typically invest in?", value: "seed" },
      { questionId: "stage_detail", question: "At that early stage, what gives you conviction", value: "We require $500,000 in signed LOIs and 2 functional prototypes." },
      { questionId: "cheque", question: "What's your typical cheque size per deal", value: "We lead with a $1,500,000 cheque and take a 15% ownership target." },
      { questionId: "portfolio", question: "Tell us about your track record", value: "experienced" },
      { questionId: "portfolio_detail", question: "What stage were those companies at", value: "Made 25 investments at seed stage, generated a 4.5x TVPI so far." },
      { questionId: "timeline", question: "How soon are you looking to deploy capital?", value: "now" },
      { questionId: "timeline_detail", question: "What would make you say yes", value: "I have $5,000,000 left to deploy this year and will wire funds in 14 days." },
      { questionId: "support", question: "Beyond capital, what do you bring", value: "I personally spend 10 hours a week with founders and guarantee 5 warm customer intros per month." },
      { questionId: "contact", question: "How can the Venturizer team reach you?", value: "elena@robotics.vc 555-111-2222" },
      { questionId: "alignment", question: "Last one — what are you hoping to find", value: "I want to back 5 generational hardware companies this fund cycle." }
    ]
  }
]

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function run() {
  const allLeads = [...perfectFounders, ...perfectInvestors];
  console.log("Submitting 4 PERFECT leads (2 Founders, 2 Investors)...");

  for (let i = 0; i < allLeads.length; i++) {
    const payload = allLeads[i]

    console.log(`Submitting lead ${i + 1}/4...`)
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

  console.log("All 4 perfect leads submitted!");
  process.exit(0);
}

run().catch(console.error);
