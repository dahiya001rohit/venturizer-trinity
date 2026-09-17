require('dotenv').config()

const proofFounders = [
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm Jordan. We have a real track record in AI SaaS." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "Strong proof of the problem: 1,000 paying customers lose $25,000 exactly each year to manual data entry." },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "revenue" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "As strong proof of our real track record, we have $1,000,000 MRR from 150 paying customers and signed deals." },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "We have strong proof of traction: 150 paying customers and signed deals worth $2,000,000 exactly." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "Yes, we have 15 signed deals and paying customers for paid pilots." },
      { questionId: "team", question: "Who's on the team?", value: "Strong proof of a real track record: 3 technical cofounders with 10 years of experience." },
      { questionId: "funding", question: "What's your funding status?", value: "pre_seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "We raised exactly $2,000,000 from top funds." },
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "Strong proof of validation: 500 paying customers gave us feedback, leading to 50 new signed deals." },
      { questionId: "contact", question: "Last one — drop your email", value: "jordan@proof.com 555-123-4567" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "We know that 100% of SDRs will be automated in 3 years." }
    ]
  },
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm Sam. We build quantum CI/CD." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "Strong proof: 500 quantum developers waste 15 hours a week, a $1,000,000 problem." },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "revenue" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "Strong proof: we have $500,000 ARR from 20 paying customers and signed deals." },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "Our real track record includes strong proof: 20 paying customers and signed deals with IBM." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "We have 5 signed deals and paying customers for pilots." },
      { questionId: "team", question: "Who's on the team?", value: "Strong proof: 4 technical PhD cofounders with a real track record of 5 quantum exits." },
      { questionId: "funding", question: "What's your funding status?", value: "seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "Raised exactly $3,000,000." },
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "Strong proof from paying customers: they demanded 50% faster compile times, which we delivered via 5 new signed deals." },
      { questionId: "contact", question: "Last one — drop your email", value: "sam@quantum.com 123-456-7890" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "Software abstraction will define the quantum era in 5 years." }
    ]
  }
]

const proofInvestors = [
  {
    type: "investor",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm David. I have a real track record as a GP of a $100M fund." },
      { questionId: "thesis", question: "What's your investment thesis", value: "Strong proof of my thesis: I have signed deals with 20 B2B SaaS paying customers yielding 100% growth." },
      { questionId: "stage", question: "Which stage do you typically invest in?", value: "pre_seed" },
      { questionId: "stage_detail", question: "At that early stage, what gives you conviction", value: "I require strong proof: signed deals and 10 paying customers with $10,000 revenue." },
      { questionId: "cheque", question: "What's your typical cheque size per deal", value: "I write exactly $2,000,000 cheques. Strong proof is my 15 signed deals this year." },
      { questionId: "portfolio", question: "Tell us about your track record", value: "experienced" },
      { questionId: "portfolio_detail", question: "What stage were those companies at", value: "Real track record and strong proof: 50 investments, 20 signed deals, 10 paying customers." },
      { questionId: "timeline", question: "How soon are you looking to deploy capital?", value: "now" },
      { questionId: "timeline_detail", question: "What would make you say yes", value: "I will deploy exactly $5,000,000 today. Strong proof: I have 3 signed deals." },
      { questionId: "support", question: "Beyond capital, what do you bring", value: "I offer strong proof of support: I bring 50 paying customers and signed deals to the founders." },
      { questionId: "contact", question: "How can the Venturizer team reach you?", value: "david@vc.fund 555-987-6543" },
      { questionId: "alignment", question: "Last one — what are you hoping to find", value: "I am looking for exactly 3 investments." }
    ]
  }
]

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function run() {
  const allLeads = [...proofFounders, ...proofInvestors];
  console.log("Submitting 3 EXPLICITLY PROOFED leads (2 Founders, 1 Investor)...");

  for (let i = 0; i < allLeads.length; i++) {
    const payload = allLeads[i]

    console.log(`Submitting lead ${i + 1}/3...`)
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

  console.log("All 3 leads submitted!");
  process.exit(0);
}

run().catch(console.error);
