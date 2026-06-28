export const founderFlow = [
  {
    id: 'intro',
    type: 'text',
    prompt: "Let's start with the basics. What's your name, and give me one sentence on what you're building.",
  },
  {
    id: 'problem',
    type: 'text',
    prompt: "Good. What's the core problem you're solving — and who specifically has it?",
  },
  {
    id: 'mvp_stage',
    type: 'select',
    prompt: "Where are you right now with the product?",
    options: ['Idea', 'Building', 'Live', 'Revenue'],
  },
  {
    id: 'mvp_detail',
    type: 'text',
    prompt: null,
    branch: {
      Idea: "What does the product actually do, and what's your plan to get to a first version?",
      Building: "What's built so far, and what does the MVP do when it ships?",
      Live: "When did you launch, and what are users doing with it?",
      Revenue: "What's the revenue model, and what numbers are you at?",
    },
  },
  {
    id: 'traction',
    type: 'text',
    prompt: "What's the strongest signal of traction you have right now — users, revenue, letters of intent, anything?",
  },
  {
    id: 'pilots',
    type: 'text',
    prompt: "Are you running any pilots or working with early customers? Tell me about them.",
  },
  {
    id: 'team',
    type: 'text',
    prompt: "Who's on the team? Headcount, and do you have a technical co-founder?",
  },
  {
    id: 'funding',
    type: 'select',
    prompt: "What's your funding status?",
    options: ['Bootstrapped', 'Friends & family', 'Raising now', 'Already raised'],
  },
  {
    id: 'funding_milestone',
    type: 'text',
    prompt: null,
    branch: {
      Bootstrapped: "Respect — how long can you run on current resources?",
      'Friends & family': "How much have you raised so far, and what's the next milestone?",
      'Raising now': "What's your ask, what's the use of funds, and what milestone closes the round?",
      'Already raised': "Who are your investors, how much have you raised total, and what are you raising next?",
    },
  },
  {
    id: 'validation',
    type: 'text',
    prompt: "What's the hardest piece of feedback you've gotten so far, and how did you respond to it?",
  },
  {
    id: 'contact',
    type: 'text',
    prompt: "Last one — drop your email, phone, and LinkedIn so we can follow up.",
  },
  {
    id: 'founder_insight',
    type: 'text',
    prompt: "One last thing: what do you understand about this market that most people don't see yet?",
  },
]
