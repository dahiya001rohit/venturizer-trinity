require('dotenv').config()
const { pool } = require('./pool')

const FIRST_NAMES = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey', 'Riley', 'Morgan', 'Avery', 'Quinn', 'Harper']
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']

function randomName() {
  return `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`
}

function generateTranscripts(type, scoreBucket) {
  if (type === 'founder') {
    if (scoreBucket === 'hot') {
      return [
        { q: "What problem are you solving?", a: "We are automating B2B sales pipelines using custom LLMs." },
        { q: "What is your current traction?", a: "We have $25k MRR, growing 15% MoM, with 5 enterprise contracts signed." },
        { q: "Tell me about your team.", a: "2x exited founders, ex-Google AI engineers, been working together for 4 years." }
      ]
    } else if (scoreBucket === 'good') {
      return [
        { q: "What problem are you solving?", a: "We built a CRM for local service businesses." },
        { q: "What is your current traction?", a: "We have a working MVP and 10 paying beta customers." },
        { q: "Tell me about your team.", a: "I have 10 years of sales experience, my technical cofounder built the app." }
      ]
    } else if (scoreBucket === 'maybe') {
      return [
        { q: "What problem are you solving?", a: "A new social network for pet owners." },
        { q: "What is your current traction?", a: "Just launched a landing page, got 200 emails so far." },
        { q: "Tell me about your team.", a: "Just me right now, looking for a technical cofounder." }
      ]
    } else { // low
      return [
        { q: "What problem are you solving?", a: "I want to make an app like Uber but for chefs." },
        { q: "What is your current traction?", a: "I have the idea and a pitch deck." },
        { q: "Tell me about your team.", a: "Me." }
      ]
    }
  } else {
    // investor
    if (scoreBucket === 'hot') {
      return [
        { q: "What is your typical check size?", a: "$500k to $1M." },
        { q: "What stages do you invest in?", a: "Pre-seed and Seed, mostly SaaS and deep tech." },
        { q: "Are you leading rounds?", a: "Yes, we prefer to lead and take board seats." }
      ]
    } else if (scoreBucket === 'good') {
      return [
        { q: "What is your typical check size?", a: "$50k to $100k." },
        { q: "What stages do you invest in?", a: "Seed." },
        { q: "Are you leading rounds?", a: "No, we only follow strong leads." }
      ]
    } else if (scoreBucket === 'maybe') {
      return [
        { q: "What is your typical check size?", a: "$10k." },
        { q: "What stages do you invest in?", a: "I'm looking to get into angel investing." },
        { q: "Are you leading rounds?", a: "No." }
      ]
    } else { // low
      return [
        { q: "What is your typical check size?", a: "Not sure yet." },
        { q: "What stages do you invest in?", a: "Anything that makes money." },
        { q: "Are you leading rounds?", a: "What does that mean?" }
      ]
    }
  }
}

async function seed() {
  console.log("Emptying leads table...")
  await pool.query("DELETE FROM leads")

  const distributions = [
    { bucket: 'hot', count: 12, min: 80, max: 98 },
    { bucket: 'good', count: 12, min: 60, max: 79 },
    { bucket: 'maybe', count: 3, min: 40, max: 59 },
    { bucket: 'low', count: 3, min: 15, max: 39 },
  ]

  let leads = []
  for (const dist of distributions) {
    for (let i = 0; i < dist.count; i++) {
      const score = Math.floor(Math.random() * (dist.max - dist.min + 1)) + dist.min
      leads.push({ score, bucket: dist.bucket })
    }
  }

  function getBucket(score) {
    if (score >= 80) return 'hot'
    if (score >= 60) return 'good'
    if (score >= 40) return 'maybe'
    return 'low'
  }

  let currentTotal = leads.reduce((a, b) => a + b.score, 0)
  while (currentTotal !== 2100) {
    const idx = Math.floor(Math.random() * leads.length)
    const diff = 2100 - currentTotal
    
    if (diff > 0) {
      if (leads[idx].score < 99 && leads[idx].bucket === getBucket(leads[idx].score + 1)) {
        leads[idx].score++
        currentTotal++
      }
    } else {
      if (leads[idx].score > 10 && leads[idx].bucket === getBucket(leads[idx].score - 1)) {
        leads[idx].score--
        currentTotal--
      }
    }
  }
  
  leads.sort(() => Math.random() - 0.5)

  for (let i = 0; i < 30; i++) {
    const { score, bucket } = leads[i]
    const type = Math.random() > 0.4 ? 'founder' : 'investor'
    const name = randomName()
    
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))

    const transcript = generateTranscripts(type, bucket)
    
    const breakdown = {
      overall: { score: score, max: 100, reasoning: `Based on the provided transcript, this ${type} falls into the ${bucket} tier.` },
      traction: { score: Math.floor(score * 0.4), max: 40, reasoning: "Derived from traction questions." },
      team: { score: Math.floor(score * 0.6), max: 60, reasoning: "Derived from team questions." }
    }

    let score_status = 'final'
    let flags = []

    if (Math.random() < 0.1) {
      score_status = 'provisional'
      flags = []
    } else if ((bucket === 'hot' || bucket === 'good') && Math.random() < 0.15) {
      flags.push({ type: 'mismatch', detail: 'The AI noted a contradiction between stated MRR and the lack of a live product link.' })
    }

    await pool.query(
      `INSERT INTO leads (type, name, email, score, bucket, breakdown, answers, flags, score_status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        type,
        name,
        `${name.replace(' ', '.').toLowerCase()}@example.com`,
        score,
        bucket,
        JSON.stringify(breakdown),
        JSON.stringify(transcript),
        JSON.stringify(flags),
        score_status,
        date.toISOString()
      ]
    )
  }

  const finalRes = await pool.query("SELECT AVG(score) as avg FROM leads")
  console.log(`Done! Added 30 leads. New Average Score: ${parseFloat(finalRes.rows[0].avg).toFixed(1)}`)
  
  process.exit(0)
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
