require('dotenv').config()

// 5 Good (60-79) - Modest traction, ok team, mid-stage
const goodLeads = [
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm Sarah. We are building a social app for pets." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "Pet owners want to share photos but Instagram is too crowded." },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "live" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "Freemium model. We have 500 active users, no revenue yet." },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "Our daily active users increased by 10% this month." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "We have an open beta test." },
      { questionId: "team", question: "Who's on the team?", value: "Just me and a freelance developer." },
      { questionId: "funding", question: "What's your funding status?", value: "pre_seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "Bootstrapped so far." },
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "Users said the app was slow, so we fixed the image loading." },
      { questionId: "contact", question: "Last one — drop your email", value: "sarah@petsocial.app 555-0011" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "People love their pets like children." }
    ]
  },
  {
    type: "investor",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm Mark, an angel investor." },
      { questionId: "thesis", question: "What's your investment thesis", value: "I invest in consumer tech and marketplaces." },
      { questionId: "stage", question: "Which stage do you typically invest in?", value: "seed" },
      { questionId: "stage_detail", question: "At that early stage, what gives you conviction", value: "A strong team with a good prototype." },
      { questionId: "cheque", question: "What's your typical cheque size per deal", value: "I follow rounds with $50,000 cheques." },
      { questionId: "portfolio", question: "Tell us about your track record", value: "some" },
      { questionId: "portfolio_detail", question: "What stage were those companies at", value: "I've made 3 angel investments at the seed stage." },
      { questionId: "timeline", question: "How soon are you looking to deploy capital?", value: "near" },
      { questionId: "timeline_detail", question: "What would make you say yes", value: "If I find a good consumer app this year." },
      { questionId: "support", question: "Beyond capital, what do you bring", value: "I can help with marketing strategy." },
      { questionId: "contact", question: "How can the Venturizer team reach you?", value: "mark@angel.co" },
      { questionId: "alignment", question: "Last one — what are you hoping to find", value: "Good deals to follow." }
    ]
  },
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm Raj. Building a marketplace for local tutors." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "Finding a reliable tutor takes too long." },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "live" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "We take a 10% cut. Processing $2,000 a month." },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "We have 50 active tutors on the platform." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "Live in one city." },
      { questionId: "team", question: "Who's on the team?", value: "Two co-founders, I do sales and he does code." },
      { questionId: "funding", question: "What's your funding status?", value: "seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "Raised a small friends and family round of $50k." },
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "Tutors try to bypass the platform fee." },
      { questionId: "contact", question: "Last one — drop your email", value: "raj@tutors.co" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "Trust is the most important factor in education." }
    ]
  },
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm Emily. We make eco-friendly packaging materials." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "Plastic packaging is destroying the environment." },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "building" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "B2B sales. No revenue yet, just prototypes." },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "We have 3 letters of intent from small local brands." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "Testing the material durability." },
      { questionId: "team", question: "Who's on the team?", value: "I have a background in materials science." },
      { questionId: "funding", question: "What's your funding status?", value: "pre_seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "Self funded." },
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "It's too expensive to manufacture at scale right now." },
      { questionId: "contact", question: "Last one — drop your email", value: "emily@ecopack.co" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "Brands want to be green but only if it doesn't hurt margins." }
    ]
  },
  {
    type: "investor",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm John from Nexus Ventures." },
      { questionId: "thesis", question: "What's your investment thesis", value: "We look for B2B enterprise software companies." },
      { questionId: "stage", question: "Which stage do you typically invest in?", value: "series_a" },
      { questionId: "stage_detail", question: "At that early stage, what gives you conviction", value: "We need to see $1M in ARR before we invest." },
      { questionId: "cheque", question: "What's your typical cheque size per deal", value: "We write $5M cheques." },
      { questionId: "portfolio", question: "Tell us about your track record", value: "experienced" },
      { questionId: "portfolio_detail", question: "What stage were those companies at", value: "We have invested in 20 companies at Series A." },
      { questionId: "timeline", question: "How soon are you looking to deploy capital?", value: "near" },
      { questionId: "timeline_detail", question: "What would make you say yes", value: "A company that meets our exact revenue metrics." },
      { questionId: "support", question: "Beyond capital, what do you bring", value: "Board governance and hiring help." },
      { questionId: "contact", question: "How can the Venturizer team reach you?", value: "john@nexus.vc" },
      { questionId: "alignment", question: "Last one — what are you hoping to find", value: "Series A deal flow." }
    ]
  }
];

// 5 Maybe (40-59) - Vague answers, no real traction, just an idea
const maybeLeads = [
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm Chris. I have an idea for a blockchain game." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "Games don't let players truly own their assets." },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "idea" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "We will sell NFTs to fund development." },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "We have a Discord server with 100 people." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "No, still designing the game." },
      { questionId: "team", question: "Who's on the team?", value: "Just me, looking for a technical cofounder." },
      { questionId: "funding", question: "What's your funding status?", value: "pre_seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "None yet." },
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "Crypto is in a bear market." },
      { questionId: "contact", question: "Last one — drop your email", value: "chris@cryptogame.io" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "Web3 is the future of gaming." }
    ]
  },
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm Lisa. Making an AI app for recipes." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "People don't know what to cook." },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "building" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "Ads. No revenue yet." },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "My friends said they would use it." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "No." },
      { questionId: "team", question: "Who's on the team?", value: "Me." },
      { questionId: "funding", question: "What's your funding status?", value: "pre_seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "Looking for angel investors." },
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "There are already a lot of recipe apps." },
      { questionId: "contact", question: "Last one — drop your email", value: "lisa@recipes.ai" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "Everyone needs to eat." }
    ]
  },
  {
    type: "investor",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm Mike." },
      { questionId: "thesis", question: "What's your investment thesis", value: "I invest in good teams." },
      { questionId: "stage", question: "Which stage do you typically invest in?", value: "agnostic" },
      { questionId: "stage_detail", question: "At that early stage, what gives you conviction", value: "Just a gut feeling about the founder." },
      { questionId: "cheque", question: "What's your typical cheque size per deal", value: "Usually $10k to $25k." },
      { questionId: "portfolio", question: "Tell us about your track record", value: "some" },
      { questionId: "portfolio_detail", question: "What stage were those companies at", value: "I've made a couple investments." },
      { questionId: "timeline", question: "How soon are you looking to deploy capital?", value: "exploring" },
      { questionId: "timeline_detail", question: "What would make you say yes", value: "If something really catches my eye." },
      { questionId: "support", question: "Beyond capital, what do you bring", value: "Just capital." },
      { questionId: "contact", question: "How can the Venturizer team reach you?", value: "mike@invest.com" },
      { questionId: "alignment", question: "Last one — what are you hoping to find", value: "Cool startups." }
    ]
  },
  {
    type: "investor",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I am a family office." },
      { questionId: "thesis", question: "What's your investment thesis", value: "Real estate tech." },
      { questionId: "stage", question: "Which stage do you typically invest in?", value: "series_a" },
      { questionId: "stage_detail", question: "At that early stage, what gives you conviction", value: "Profitability." },
      { questionId: "cheque", question: "What's your typical cheque size per deal", value: "We can write $1M." },
      { questionId: "portfolio", question: "Tell us about your track record", value: "first_time" },
      { questionId: "portfolio_detail", question: "What stage were those companies at", value: "We mostly do traditional real estate, looking to get into tech." },
      { questionId: "timeline", question: "How soon are you looking to deploy capital?", value: "exploring" },
      { questionId: "timeline_detail", question: "What would make you say yes", value: "A very safe deal." },
      { questionId: "support", question: "Beyond capital, what do you bring", value: "Real estate connections." },
      { questionId: "contact", question: "How can the Venturizer team reach you?", value: "family@office.com" },
      { questionId: "alignment", question: "Last one — what are you hoping to find", value: "Diversification." }
    ]
  },
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I'm Tom. Building the next Uber." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "Taxis are still bad." },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "building" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "We will take 20% of every ride." },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "We registered the domain." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "No." },
      { questionId: "team", question: "Who's on the team?", value: "I am a business student." },
      { questionId: "funding", question: "What's your funding status?", value: "pre_seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "I am seeking $5M to build the app." },
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "Uber already exists." },
      { questionId: "contact", question: "Last one — drop your email", value: "tom@nextuber.com" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "It's a big market." }
    ]
  }
];

// 5 Low (0-39) - Contradictions, absolute junk, single word answers
const lowLeads = [
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "asdf" },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "idk" },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "idea" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "we don't charge yet" },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "none" },
      { questionId: "pilots", question: "Are you running any pilots?", value: "no" },
      { questionId: "team", question: "Who's on the team?", value: "me" },
      { questionId: "funding", question: "What's your funding status?", value: "pre_seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "no" },
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "nothing" },
      { questionId: "contact", question: "Last one — drop your email", value: "test@test.com" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "stuff" }
    ]
  },
  {
    type: "investor",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I am bob" },
      { questionId: "thesis", question: "What's your investment thesis", value: "i want to make money" },
      { questionId: "stage", question: "Which stage do you typically invest in?", value: "growth" },
      { questionId: "stage_detail", question: "At that early stage, what gives you conviction", value: "money" },
      { questionId: "cheque", question: "What's your typical cheque size per deal", value: "$50" },
      { questionId: "portfolio", question: "Tell us about your track record", value: "first_time" },
      { questionId: "portfolio_detail", question: "What stage were those companies at", value: "never invested" },
      { questionId: "timeline", question: "How soon are you looking to deploy capital?", value: "learning" },
      { questionId: "timeline_detail", question: "What would make you say yes", value: "idk" },
      { questionId: "support", question: "Beyond capital, what do you bring", value: "nothing" },
      { questionId: "contact", question: "How can the Venturizer team reach you?", value: "bob@bob.com" },
      { questionId: "alignment", question: "Last one — what are you hoping to find", value: "yes" }
    ]
  },
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "We are making a time machine." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "Time only moves forward." },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "revenue" }, // contradiction incoming
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "We have no product and no revenue." }, // contradiction!
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "Physics says it's impossible." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "No." },
      { questionId: "team", question: "Who's on the team?", value: "Nobody yet." },
      { questionId: "funding", question: "What's your funding status?", value: "series_a" }, // contradiction
      { questionId: "funding_milestone", question: "Who are your investors?", value: "We have not raised any money." }, // contradiction!
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "It violates thermodynamics." },
      { questionId: "contact", question: "Last one — drop your email", value: "time@machine.com" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "Einstein was wrong." }
    ]
  },
  {
    type: "investor",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "fake person" },
      { questionId: "thesis", question: "What's your investment thesis", value: "fake" },
      { questionId: "stage", question: "Which stage do you typically invest in?", value: "pre_seed" },
      { questionId: "stage_detail", question: "At that early stage, what gives you conviction", value: "fake" },
      { questionId: "cheque", question: "What's your typical cheque size per deal", value: "0" },
      { questionId: "portfolio", question: "Tell us about your track record", value: "first_time" },
      { questionId: "portfolio_detail", question: "What stage were those companies at", value: "none" },
      { questionId: "timeline", question: "How soon are you looking to deploy capital?", value: "learning" },
      { questionId: "timeline_detail", question: "What would make you say yes", value: "none" },
      { questionId: "support", question: "Beyond capital, what do you bring", value: "none" },
      { questionId: "contact", question: "How can the Venturizer team reach you?", value: "fake@fake.com" },
      { questionId: "alignment", question: "Last one — what are you hoping to find", value: "fake" }
    ]
  },
  {
    type: "founder",
    answers: [
      { questionId: "intro", question: "Let's start with the basics.", value: "I want to start a restaurant." },
      { questionId: "problem", question: "What's the core problem you're solving?", value: "People are hungry." },
      { questionId: "mvp_stage", question: "Where are you right now with the product?", value: "idea" },
      { questionId: "mvp_detail", question: "What's the revenue model, and what numbers are you at?", value: "Selling food." },
      { questionId: "traction", question: "What's the strongest signal of traction you have right now?", value: "I like to cook." },
      { questionId: "pilots", question: "Are you running any pilots?", value: "No." },
      { questionId: "team", question: "Who's on the team?", value: "Just me." },
      { questionId: "funding", question: "What's your funding status?", value: "pre_seed" },
      { questionId: "funding_milestone", question: "Who are your investors?", value: "My mom." },
      { questionId: "validation", question: "What's the hardest piece of feedback you've gotten so far?", value: "My cooking is bad." },
      { questionId: "contact", question: "Last one — drop your email", value: "chef@restaurant.com" },
      { questionId: "founder_insight", question: "what do you understand about this market", value: "Food is tasty." }
    ]
  }
];

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function run() {
  const allLeads = [...goodLeads, ...maybeLeads, ...lowLeads];
  console.log(`Submitting ${allLeads.length} leads (Good, Maybe, Low) to /api/submit...`);

  for (let i = 0; i < allLeads.length; i++) {
    const payload = allLeads[i]

    console.log(`Submitting lead ${i + 1}/${allLeads.length} (${payload.type})...`)
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

  console.log(`All ${allLeads.length} leads submitted via POST requests!`);
  process.exit(0);
}

run().catch(console.error);
