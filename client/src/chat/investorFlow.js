export const investorFlow = [
  {
    id: 'intro',
    type: 'select',
    prompt: "Great to meet you. How would you describe yourself as an investor?",
    options: ['Angel', 'VC fund', 'Syndicate', 'Family office'],
  },
  {
    id: 'thesis',
    type: 'text',
    prompt: "What's your investment thesis — and which sectors or geographies are you focused on?",
  },
  {
    id: 'stage',
    type: 'select',
    prompt: "What stage do you typically invest at?",
    options: ['Pre-seed', 'Seed', 'Series A', 'Stage-agnostic'],
  },
  {
    id: 'stage_detail',
    type: 'text',
    prompt: null,
    branch: {
      'Pre-seed': "At pre-seed, what does a fundable team look like to you — what are the non-negotiables?",
      'Seed': "At seed, are you looking for revenue, or does strong traction without revenue work?",
      'Series A': "At Series A, what metrics need to be in place before you'll seriously look at a deal?",
      'Stage-agnostic': "You said stage-agnostic — what actually drives the conviction to write a check?",
    },
  },
  {
    id: 'cheque',
    type: 'text',
    prompt: "What's your typical cheque size, and do you usually lead or follow?",
  },
  {
    id: 'portfolio',
    type: 'select',
    prompt: "Do you have an active portfolio right now?",
    options: ['Yes, active', 'Building it', 'First investment', 'Paused'],
  },
  {
    id: 'portfolio_detail',
    type: 'text',
    prompt: null,
    branch: {
      'Yes, active': "Tell me about one or two companies you're most excited about in your portfolio.",
      'Building it': "What's your target portfolio size, and how many deals have you done so far?",
      'First investment': "What's making you pull the trigger now — what's changed for you?",
      'Paused': "What would bring you back to active — what are you waiting on?",
    },
  },
  {
    id: 'timeline',
    type: 'select',
    prompt: "How quickly can you move when you find the right deal?",
    options: ['< 2 weeks', '2–6 weeks', '1–3 months', 'Depends on deal'],
  },
  {
    id: 'timeline_detail',
    type: 'text',
    prompt: null,
    branch: {
      '< 2 weeks': "Fast mover — what lets you move that quickly? Is it solo decision or do you have a committee?",
      '2–6 weeks': "Standard pace — what's in the process: calls, references, docs?",
      '1–3 months': "What slows it down — diligence, internal process, or something else?",
      'Depends on deal': "What factors make it fast vs slow?",
    },
  },
  {
    id: 'support',
    type: 'text',
    prompt: "Beyond capital, how do you support founders? Introductions, hiring, go-to-market — what's your actual value-add?",
  },
  {
    id: 'contact',
    type: 'text',
    prompt: "Last one — drop your email, phone, and LinkedIn so we can match you with the right founders.",
  },
  {
    id: 'alignment',
    type: 'text',
    prompt: "Final question: what's the one thing founders always get wrong when pitching you?",
  },
]
