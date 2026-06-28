import { founderFlow } from './founderFlow'
import { investorFlow } from './investorFlow'

export function getFlow(type) {
  return type === 'Founder' ? founderFlow : investorFlow
}

export function resolvePrompt(turn, flow, prevAnswer) {
  if (!turn.prompt && flow) {
    const parent = flow.find(q => q.branch && q.branch.capturesKey === turn.id);
    if (parent && parent.branch.followUps) {
      return parent.branch.followUps[prevAnswer] || "";
    }
  }
  return turn.prompt
}

export function getAcknowledgement(turnId, answer) {
  const acks = {
    mvp_stage: {
      idea: "Got it — idea stage.",
      building: "Nice, deep in build mode.",
      live: "You're live — let's dig in.",
      revenue: "Impressive — you're already earning.",
    },
    funding: {
      bootstrapped: "Bootstrapped — respect.",
      friends: "Friends and family round, noted.",
      raising: "Actively raising — let's talk specifics.",
      raised: "Already raised, great.",
    },
    stage: {
      pre_seed: "Pre-seed focus, got it.",
      seed: "Seed stage investor.",
      series_a: "Series A — higher bar.",
      agnostic: "Stage-agnostic — conviction-driven.",
    },
    portfolio: {
      experienced: "Active portfolio — good.",
      some: "Building your portfolio now.",
      first_time: "First check — exciting.",
    },
    timeline: {
      now: "Actively deploying — you move fast.",
      near: "Standard short term window.",
      exploring: "Exploring options — thorough.",
      learning: "Learning mode — makes sense.",
    },
    intro: {
      angel: "Angel investor — noted.",
      vc: "VC fund, got it.",
      syndicate: "Syndicate model.",
      family_office: "Family office — interesting.",
    },
  }
  return acks[turnId]?.[answer] || null
}

