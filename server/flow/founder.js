// Founder flow — 12 turns, ~18 captured fields.
// Matches PROJECT_CONTEXT §1. Selection turns (3, 8) drive branch follow-ups (4, 9).
// Each question's scoringDimension maps to the §2 founder rubric.
// Tone: warm, self-explaining, professional — Venturizer "fractional co-founder" feel.

const founderFlow = {
  type: "founder",
  questions: [
    {
      id: "intro",
      turn: 1,
      prompt:
        "Welcome to Venturizer. Let's start simple — what's your name, and how would you describe what you're building in a sentence?",
      kind: "text",
      captures: [
        { key: "name", validator: "required" },
        { key: "one_liner", validator: "required" },
      ],
    },

    {
      id: "problem",
      turn: 2,
      prompt:
        "Every strong venture starts with a real problem. What problem are you solving, and who feels it most?",
      kind: "text",
      captures: [
        { key: "problem", validator: "required" },
        { key: "who", validator: "required" },
      ],
      scoringDimension: "problem_clarity",
      hint: "Be specific about the segment — who feels this pain, and how badly.",
    },

    {
      id: "mvp_stage",
      turn: 3,
      prompt: "Where is your product in its journey today? Pick whichever fits best.",
      kind: "select",
      options: [
        { value: "idea", label: "Idea only" },
        { value: "building", label: "Building" },
        { value: "live", label: "Live MVP" },
        { value: "revenue", label: "Revenue" },
      ],
      captures: [{ key: "mvp_stage", validator: "required" }],
      scoringDimension: "mvp",
      branch: {
        capturesKey: "mvp_detail",
        followUps: {
          idea: "Got it. What's the main thing holding you back from building — is it clarity, skills, or capital?",
          building:
            "Nice — you're in motion. When do you expect to ship, and what's the biggest blocker right now?",
          live: "Love that it's live. How many people have used it so far, and what are they actually doing with it?",
          revenue:
            "Impressive — you're already earning. What's your current MRR, and how fast is it growing?",
        },
      },
    },

    {
      id: "mvp_detail",
      turn: 4,
      prompt: "", // dynamic — set from mvp_stage selection's branch follow-up
      kind: "text",
      captures: [{ key: "mvp_detail", validator: "required" }],
      scoringDimension: "mvp", // deepens the SAME dimension as the selection
    },

    {
      id: "traction",
      turn: 5,
      prompt:
        "Let's talk traction. Share whatever's real — users, revenue, anything that shows momentum. Concrete numbers help us understand where you are.",
      kind: "text",
      captures: [
        { key: "users", validator: "optional" },
        { key: "revenue", validator: "optional" },
      ],
      scoringDimension: "traction",
      hint: "e.g. 200 active users, ₹1.4L MRR — whatever's real.",
    },

    {
      id: "pilots",
      turn: 6,
      prompt:
        "Have you lined up any pilots, partnerships, or signed interest yet? Even early conversations count.",
      kind: "text",
      captures: [{ key: "pilots", validator: "optional" }],
      scoringDimension: "traction", // deepens traction evidence
    },

    {
      id: "team",
      turn: 7,
      prompt:
        "Tell us about your team — how many of you are there, and do you have someone covering the technical side?",
      kind: "text",
      captures: [
        { key: "team_size", validator: "optional" },
        { key: "tech_cofounder", validator: "optional" },
      ],
      scoringDimension: "team",
    },

    {
      id: "funding",
      turn: 8,
      prompt:
        "Where are you on funding? Let us know how much you're raising and which stage you'd place yourself in.",
      kind: "select",
      options: [
        { value: "pre_seed", label: "Pre-seed" },
        { value: "seed", label: "Seed" },
        { value: "series_a", label: "Series A" },
        { value: "later", label: "Later / other" },
      ],
      captures: [
        { key: "funding_amount", validator: "optional" },
        { key: "funding_stage", validator: "required" },
      ],
      scoringDimension: "funding_fit",
      branch: {
        capturesKey: "funding_milestone",
        followUps: {
          pre_seed: "And what would this round help you unlock — what's the key milestone you're aiming for?",
          seed: "And what would this round help you unlock — what's the key milestone you're aiming for?",
          series_a: "And what would this round help you unlock — what's the key milestone you're aiming for?",
          later: "And what would this round help you unlock — what's the key milestone you're aiming for?",
        },
      },
    },

    {
      id: "funding_milestone",
      turn: 9,
      prompt: "", // dynamic — set from funding branch
      kind: "text",
      captures: [{ key: "funding_milestone", validator: "required" }],
      scoringDimension: "funding_fit",
    },

    {
      id: "validation",
      turn: 10,
      prompt:
        "This one matters to us most — what evidence shows people genuinely want this? Paying customers, signed LOIs, a waitlist, anything real.",
      kind: "text",
      captures: [{ key: "validation", validator: "required" }],
      scoringDimension: "validation",
      hint: "Venturizer cares most about real validation evidence.",
    },

    {
      id: "contact",
      turn: 11,
      prompt:
        "Almost done. How can the Venturizer team reach you? Please share your email and phone, and your LinkedIn or website if you'd like.",
      kind: "contact",
      captures: [
        { key: "email", validator: "email" },
        { key: "phone", validator: "phone" },
        { key: "linkedin", validator: "url" },
      ],
    },

    {
      id: "founder_insight",
      turn: 12,
      prompt:
        "Last one, and it's our favourite — what do you understand about this problem that most people don't, and what makes you the right person to solve it?",
      kind: "text",
      captures: [{ key: "founder_insight", validator: "required" }],
      scoringDimension: "problem_clarity", // deepens problem understanding signal
    },
  ],
};

module.exports = { founderFlow };