require('dotenv').config()

const sevenLeads = [
  // Good Founder
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm Kevin. Building a B2B marketplace for industrial parts." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "Procurement is done over phone calls and fax machines." },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "live" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "We charge a 5% transaction fee. Processed $10k last month." },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "We have 10 regular buyers." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "We are live with 3 suppliers." },
      { questionId: "team", question: "Who's on the team?", value: "Me and my brother, we worked in manufacturing." },
      { questionId: "funding", question: "What's your funding status?", value: "seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "Bootstrapped to revenue." },
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "Suppliers don't want to use new software." },
      { questionId: "contact", question: "Last one — drop your email", value: "kevin@parts.co" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "Relationships matter more than tech." }
    ]
  },
  // Good Investor
  {
    type: "investor",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm Rachel, partner at a small seed fund." },
      { questionId: "thesis", question: "What's your investment thesis", value: "We back B2B SaaS and fintech in emerging markets." },
      { questionId: "stage", question: "Which stage do you typically invest in?", value: "seed" },
      { questionId: "stage_detail", question: "At that early stage, what gives you conviction", value: "A working product and early customer love." },
      { questionId: "cheque", question: "What's your typical cheque size per deal", value: "We write $250k cheques." },
      { questionId: "portfolio", question: "Tell us about your track record", value: "some" },
      { questionId: "portfolio_detail", question: "What stage were those companies at", value: "We have a portfolio of 15 seed stage startups." },
      { questionId: "timeline", question: "How soon are you looking to deploy capital?", value: "near" },
      { questionId: "timeline_detail", question: "What would make you say yes", value: "Strong founder market fit." },
      { questionId: "support", question: "Beyond capital, what do you bring", value: "We help with Series A fundraising." },
      { questionId: "contact", question: "How can the Venturizer team reach you?", value: "rachel@seedfund.vc" },
      { questionId: "alignment", question: "Last one — what are you hoping to find", value: "Good deals outside of the valley." }
    ]
  },
  // Good Founder
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm Nina. Building an HR tech platform for remote teams." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "Tracking employee engagement across time zones is hard." },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "live" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "SaaS model, $5k MRR." },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "We have 20 paying small businesses." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "No pilots, just direct sales." },
      { questionId: "team", question: "Who's on the team?", value: "Two technical co-founders." },
      { questionId: "funding", question: "What's your funding status?", value: "pre_seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "We raised a small $100k angel round." },
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "Companies have budget freezes." },
      { questionId: "contact", question: "Last one — drop your email", value: "nina@remotehr.io" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "Remote work is here to stay but needs better tools." }
    ]
  },
  // Good Founder
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "My name is Daniel. We are building AI for legal document review." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "Lawyers spend 30 hours a week reading contracts." },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "building" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "We plan to charge per document. Currently in closed beta." },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "We have 3 law firms actively testing it." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "Yes, 3 unpaid pilots." },
      { questionId: "team", question: "Who's on the team?", value: "I am a lawyer and my co-founder is an ML engineer." },
      { questionId: "funding", question: "What's your funding status?", value: "pre_seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "No investors yet." },
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "Hallucinations in the AI are unacceptable in law." },
      { questionId: "contact", question: "Last one — drop your email", value: "daniel@legalai.com" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "Lawyers only buy products from other lawyers." }
    ]
  },
  // Maybe Founder
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm Greg. I want to build a fitness tracking app." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "People lose motivation to work out." },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "idea" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "Subscription model." },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "I have some wireframes." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "No." },
      { questionId: "team", question: "Who's on the team?", value: "Just me, looking for developers." },
      { questionId: "funding", question: "What's your funding status?", value: "pre_seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "Looking for funding to build the MVP." },
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "The market is very saturated." },
      { questionId: "contact", question: "Last one — drop your email", value: "greg@fitnessapp.com" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "Gamification works." }
    ]
  },
  // Maybe Investor
  {
    type: "investor",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm an individual angel investor." },
      { questionId: "thesis", question: "What's your investment thesis", value: "I like interesting consumer products." },
      { questionId: "stage", question: "Which stage do you typically invest in?", value: "agnostic" },
      { questionId: "stage_detail", question: "At that early stage, what gives you conviction", value: "If the product looks cool." },
      { questionId: "cheque", question: "What's your typical cheque size per deal", value: "I invest small amounts, around $5k." },
      { questionId: "portfolio", question: "Tell us about your track record", value: "first_time" },
      { questionId: "portfolio_detail", question: "What stage were those companies at", value: "I haven't made an investment yet." },
      { questionId: "timeline", question: "How soon are you looking to deploy capital?", value: "exploring" },
      { questionId: "timeline_detail", question: "What would make you say yes", value: "If the valuation is low." },
      { questionId: "support", question: "Beyond capital, what do you bring", value: "I can be an early beta tester." },
      { questionId: "contact", question: "How can the Venturizer team reach you?", value: "angel@personal.com" },
      { questionId: "alignment", question: "Last one — what are you hoping to find", value: "Something fun." }
    ]
  },
  // Maybe Founder
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm Chloe. Developing a platform for indie musicians." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "Spotify doesn't pay enough." },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "building" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "Direct fan support model." },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "I have 5 bands interested." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "No." },
      { questionId: "team", question: "Who's on the team?", value: "I am a musician and learning to code." },
      { questionId: "funding", question: "What's your funding status?", value: "pre_seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "Bootstrapping." },
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "Musicians are hard to monetize." },
      { questionId: "contact", question: "Last one — drop your email", value: "chloe@indiemusic.io" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "Fans want to support artists directly." }
    ]
  }
];

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function run() {
  console.log(`Submitting ${sevenLeads.length} leads (Good & Maybe ONLY) to /api/submit...`);

  for (let i = 0; i < sevenLeads.length; i++) {
    const payload = sevenLeads[i]

    console.log(`Submitting lead ${i + 1}/${sevenLeads.length} (${payload.type})...`)
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

  console.log(`All ${sevenLeads.length} leads submitted via POST requests!`);
  process.exit(0);
}

run().catch(console.error);
