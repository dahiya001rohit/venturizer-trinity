// Investor flow — 12 turns, ~17 captured fields.
// Matches PROJECT_CONTEXT §1 + §3. Selection turns (3, 6, 8) drive branch follow-ups (4, 7, 9).
// Each question's scoringDimension maps to the §3 investor rubric.
// Tone: warm, self-explaining, professional — Venturizer institutional feel.

const investorFlow = {
  type: "investor",
  questions: [
    {
      id: "intro",
      turn: 1,
      prompt:
        "Welcome to Venturizer. To start — what's your name, and are you investing solo as an angel, or through a fund?",
      kind: "text",
      captures: [
        { key: "name", validator: "required" },
        { key: "investor_type", validator: "required" },
      ],
    },

    {
      id: "thesis",
      turn: 2,
      prompt:
        "We'd love to understand your lens. What's your investment thesis — the sectors, stage, and the kind of founders or businesses you look for?",
      kind: "text",
      captures: [
        { key: "thesis", validator: "required" },
        { key: "focus", validator: "required" },
      ],
      scoringDimension: "thesis_clarity",
      hint: "The sharper your focus, the better we can match you with the right deals.",
    },

    {
      id: "stage",
      turn: 3,
      prompt: "Which stage do you typically invest in? Pick whichever fits you best.",
      kind: "select",
      options: [
        { value: "pre_seed", label: "Pre-seed" },
        { value: "seed", label: "Seed" },
        { value: "series_a", label: "Series A" },
        { value: "growth", label: "Growth" },
        { value: "agnostic", label: "Stage-agnostic" },
      ],
      captures: [{ key: "stage", validator: "required" }],
      scoringDimension: "stage_fit",
      branch: {
        capturesKey: "stage_detail",
        followUps: {
          pre_seed:
            "At that early stage, what gives you conviction to write a cheque — the team, early traction, or the market?",
          seed: "At seed, what gives you conviction to write a cheque — the team, early traction, or the market?",
          series_a:
            "Do you ever go earlier than Series A for the right opportunity? We'd love to know how flexible you are.",
          growth:
            "Do you ever go earlier than growth stage for the right opportunity? We'd love to know how flexible you are.",
          agnostic:
            "When you say stage-agnostic — where do most of your cheques actually land in practice?",
        },
      },
    },

    {
      id: "stage_detail",
      turn: 4,
      prompt: "", // dynamic — set from stage branch
      kind: "text",
      captures: [{ key: "stage_detail", validator: "required" }],
      scoringDimension: "stage_fit",
    },

    {
      id: "cheque",
      turn: 5,
      prompt:
        "What's your typical cheque size per deal, and do you usually lead the round or follow another investor?",
      kind: "text",
      captures: [
        { key: "cheque_size", validator: "optional" },
        { key: "lead_follow", validator: "optional" },
      ],
      scoringDimension: "cheque_capacity",
      hint: "e.g. ₹25L–₹1Cr, usually lead.",
    },

    {
      id: "portfolio",
      turn: 6,
      prompt:
        "Tell us about your track record so far — roughly how many investments have you made, and are there any you're especially proud of?",
      kind: "select",
      options: [
        { value: "experienced", label: "Several investments" },
        { value: "some", label: "A few investments" },
        { value: "first_time", label: "This would be my first" },
      ],
      captures: [
        { key: "portfolio_count", validator: "optional" },
        { key: "portfolio_examples", validator: "optional" },
      ],
      scoringDimension: "portfolio",
      branch: {
        capturesKey: "portfolio_detail",
        followUps: {
          experienced:
            "That's a solid track record. What stage were those companies at when you first came in?",
          some: "Good to hear. What stage were those companies at when you first came in?",
          first_time:
            "Welcome — everyone starts somewhere. What's drawing you to early-stage investing now?",
        },
      },
    },

    {
      id: "portfolio_detail",
      turn: 7,
      prompt: "", // dynamic — set from portfolio branch
      kind: "text",
      captures: [{ key: "portfolio_detail", validator: "required" }],
      scoringDimension: "portfolio",
    },

    {
      id: "timeline",
      turn: 8,
      prompt: "How soon are you looking to deploy capital? Pick whichever describes you best.",
      kind: "select",
      options: [
        { value: "now", label: "Actively now" },
        { value: "near", label: "Next 3–6 months" },
        { value: "exploring", label: "Exploring" },
        { value: "learning", label: "Just learning" },
      ],
      captures: [{ key: "timeline", validator: "required" }],
      scoringDimension: "deploy_timeline",
      branch: {
        capturesKey: "timeline_detail",
        followUps: {
          now: "Great — what would make you say yes to a deal this quarter?",
          near: "Understood. What needs to line up before you're ready to deploy?",
          exploring: "No rush at all. What's holding you from deploying right now?",
          learning: "That's completely fine. What would help you feel ready to take the next step?",
        },
      },
    },

    {
      id: "timeline_detail",
      turn: 9,
      prompt: "", // dynamic — set from timeline branch
      kind: "text",
      captures: [{ key: "timeline_detail", validator: "required" }],
      scoringDimension: "deploy_timeline",
    },

    {
      id: "support",
      turn: 10,
      prompt:
        "Beyond capital, what do you bring to the founders you back — network, operating experience, board guidance, anything else?",
      kind: "text",
      captures: [{ key: "support_model", validator: "required" }],
      scoringDimension: "support_model",
      hint: "Venturizer values investors who add more than money.",
    },

    {
      id: "contact",
      turn: 11,
      prompt:
        "Almost done. How can the Venturizer team reach you? Please share your email and phone, and your LinkedIn or fund website if you'd like.",
      kind: "contact",
      captures: [
        { key: "email", validator: "email" },
        { key: "phone", validator: "phone" },
        { key: "linkedin", validator: "url" },
      ],
    },

    {
      id: "alignment",
      turn: 12,
      prompt:
        "Last one — what are you hoping to find in a partner like Venturizer, and what does an ideal opportunity look like to you?",
      kind: "text",
      captures: [{ key: "alignment", validator: "required" }],
      scoringDimension: "thesis_clarity", // deepens thesis/fit signal
    },
  ],
};

module.exports = { investorFlow };