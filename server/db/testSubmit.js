require('dotenv').config()
const { pool } = require('./pool')

const founders = [
  // Hot founder
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics", value: "I'm Jordan Smith. We are building an AI-powered CRM for enterprise sales." },
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
  // Good founder
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics", value: "I'm Taylor Johnson. We built a CRM for local service businesses." },
      { questionId: "problem", question: "What's the core problem", value: "Plumbers and electricians have terrible software." },
      { questionId: "mvp_stage", question: "Where are you right now", value: "live" },
      { questionId: "mvp_detail", question: "What's the revenue model", value: "Launched last month, users are booking jobs daily." },
      { questionId: "traction", question: "What's the strongest signal", value: "10 paying beta customers." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "Working with 3 local plumbing companies." },
      { questionId: "team", question: "Who's on the team?", value: "10 years of sales experience, technical cofounder." },
      { questionId: "funding", question: "What's your funding status?", value: "seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "Can run for 12 months." },
      { questionId: "validation", question: "What's the hardest piece of feedback", value: "UI was too complex, we simplified it." },
      { questionId: "contact", question: "Last one — drop your email", value: "taylor@example.com 555-5678" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "Local businesses are ready for mobile-first." }
    ]
  },
  // Maybe founder
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics", value: "Casey Williams. Social network for pet owners." },
      { questionId: "problem", question: "What's the core problem", value: "Pets need a place to connect." },
      { questionId: "mvp_stage", question: "Where are you right now", value: "building" },
      { questionId: "mvp_detail", question: "What's the revenue model", value: "Working on the MVP." },
      { questionId: "traction", question: "What's the strongest signal", value: "200 emails on landing page." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "None yet." },
      { questionId: "team", question: "Who's on the team?", value: "Just me, looking for technical cofounder." },
      { questionId: "funding", question: "What's your funding status?", value: "pre_seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "Need $500k to build the app." },
      { questionId: "validation", question: "What's the hardest piece of feedback", value: "People say they wouldn't use it, but I think they will." },
      { questionId: "contact", question: "Last one — drop your email", value: "casey@example.com" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "Pets are humans too." }
    ]
  },
  // Low founder
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics", value: "Riley Brown. Uber for chefs." },
      { questionId: "problem", question: "What's the core problem", value: "You want a chef." },
      { questionId: "mvp_stage", question: "Where are you right now", value: "idea" },
      { questionId: "mvp_detail", question: "What's the revenue model", value: "I have a pitch deck." },
      { questionId: "traction", question: "What's the strongest signal", value: "My mom likes it." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "No." },
      { questionId: "team", question: "Who's on the team?", value: "Me." },
      { questionId: "funding", question: "What's your funding status?", value: "later" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "Need $5M." },
      { questionId: "validation", question: "What's the hardest piece of feedback", value: "None." },
      { questionId: "contact", question: "Last one — drop your email", value: "riley@example.com" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "Food is good." }
    ]
  }
]

async function testSubmit() {
  console.log("Emptying leads table first...")
  await pool.query("DELETE FROM leads")
  console.log("Database emptied!")

  let allTemplates = [
    ...Array(3).fill(founders[0]), // 3 Hot
    ...Array(5).fill(founders[1]), // 5 Good
    ...Array(4).fill(founders[2]), // 4 Maybe
    ...Array(4).fill(founders[3]), // 4 Low
  ]

  for (let i = 0; i < allTemplates.length; i++) {
    const template = allTemplates[i]
    
    // Add some random variation to the name/email so they don't group identically in the UI
    const randomSuffix = Math.floor(Math.random() * 1000)
    let payload = JSON.parse(JSON.stringify(template))
    payload.answers[0].value = payload.answers[0].value.replace(/\./, ` ${randomSuffix}.`)
    payload.answers[10].value = `user${randomSuffix}@example.com`

    console.log(`Submitting lead ${i + 1}/${allTemplates.length}...`)
    try {
      const response = await fetch("http://localhost:4000/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
      
      const data = await response.json()
      console.log("Response:", data)
    } catch (e) {
      console.error("Fetch failed:", e)
    }
  }

  console.log("Submitted all leads to the AI pipeline!")
  console.log("Note: The AI processing will take a few minutes in the background since it is processing 16 leads.")
  process.exit(0)
}

testSubmit().catch(console.error)
