import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Users, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Aurora } from './Aurora'

function ChatPreview() {
  const messages = [
    { role: 'bot', text: 'Hey! Are you a founder or an investor?' },
    { role: 'user', text: 'Founder.' },
    { role: 'bot', text: 'What problem are you solving — and for whom?' },
    { role: 'user', text: 'AI-native ERP for Southeast Asian SMBs. $12k MRR, 3 months in.' },
    { role: 'bot', text: "Strong traction signal. Who's on the team?" },
    { role: 'user', text: 'Ex-Grab + ex-SAP. Raising $500k pre-seed.' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="mt-16 w-[80%] mx-auto"
    >
      <div className="rounded-[20px] border border-white/[0.07] bg-[#111] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.7)] relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="flex flex-col md:flex-row md:h-[480px]">
          <div className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-white/[0.06] bg-[#0D0D0D] flex flex-col h-48 md:h-auto">
            <div className="px-4 py-3 border-b border-white/[0.05] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
              <span className="font-geist text-[12px] font-medium tracking-[-0.02em] text-white/60">Trinity</span>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {[
                { name: 'Aarav Shah', score: 84, bucket: 'Hot', color: '#F5A623', active: true },
                { name: 'Priya Menon', score: 71, bucket: 'Good', color: '#22C55E', active: false },
                { name: 'Rohan Verma', score: 48, bucket: 'Maybe', color: '#3B82F6', active: false },
                { name: 'Nadia K.', score: 22, bucket: 'Low', color: '#6B7280', active: false },
              ].map((lead) => (
                <div
                  key={lead.name}
                  className={`px-3 py-2.5 mx-2 rounded-xl mb-1 flex items-center justify-between cursor-default transition-colors ${lead.active ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'}`}
                >
                  <div>
                    <div className="font-geist text-[12px] font-medium tracking-[-0.02em] text-white/80 leading-none mb-1">{lead.name}</div>
                    <div className="font-inter text-[11px] text-white/30">{lead.bucket}</div>
                  </div>
                  <div className="font-geist text-[14px] font-semibold tracking-[-0.03em]" style={{ color: lead.color }}>{lead.score}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="px-4 py-3 border-b border-white/[0.05] flex items-center justify-between">
              <div>
                <div className="font-geist text-[13px] font-medium tracking-[-0.02em] text-white">Aarav Shah</div>
                <div className="font-inter text-[11px] text-white/30">Founder · Turn 6 of 12</div>
              </div>
              <div className="flex items-center gap-1.5 bg-[#F5A623]/10 border border-[#F5A623]/25 rounded-full px-2.5 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
                <span className="font-inter text-[11px] font-semibold text-[#F5A623] uppercase tracking-[0.05em]">Score 84 · Hot</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 flex flex-col justify-end">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[80%] rounded-[10px] px-3.5 py-2.5 font-inter text-[13px] leading-relaxed tracking-[-0.01em]"
                    style={{
                      backgroundColor: m.role === 'bot' ? '#1A1A1A' : 'rgba(59,130,246,0.15)',
                      border: m.role === 'bot' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(59,130,246,0.2)',
                      borderRadius: m.role === 'bot' ? '10px 10px 10px 3px' : '10px 10px 3px 10px',
                      color: m.role === 'bot' ? '#bbb' : '#fff',
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              <div className="flex justify-start">
                <div className="bg-[#1A1A1A] border border-white/[0.06] rounded-[10px] rounded-bl-[3px] px-3 py-2 flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-1 rounded-full bg-white/30"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-56 shrink-0 border-t md:border-t-0 md:border-l border-white/[0.06] bg-[#0D0D0D] p-4 flex flex-col gap-4">
            <div className="font-inter text-[11px] text-white/30 uppercase tracking-[0.06em]">Breakdown</div>
            {[
              { label: 'Validation', score: 18, max: 25, color: '#F5A623' },
              { label: 'Traction', score: 15, max: 20, color: '#F5A623' },
              { label: 'Team', score: 14, max: 20, color: '#22C55E' },
              { label: 'Market', score: 12, max: 20, color: '#3B82F6' },
              { label: 'Clarity', score: 10, max: 15, color: '#22C55E' },
            ].map((d) => (
              <div key={d.label}>
                <div className="flex justify-between mb-1">
                  <span className="font-inter text-[11px] text-white/40">{d.label}</span>
                  <span className="font-inter text-[11px] font-medium" style={{ color: d.color }}>{d.score}/{d.max}</span>
                </div>
                <div className="h-[3px] rounded-full bg-white/[0.05] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(d.score / d.max) * 100}%`, backgroundColor: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-2.5 border-t border-white/[0.05] flex items-center gap-2">
          <div className="flex-1 bg-white/[0.04] rounded-full px-4 py-2 font-inter text-[12px] text-white/20 tracking-[-0.01em]">
            Continue the conversation…
          </div>
          <div className="w-6 h-6 rounded-full bg-[#3B82F6]/20 flex items-center justify-center">
            <ArrowRight size={10} className="text-[#3B82F6]" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function Hero() {
  const shouldReduce = useReducedMotion()

  const fadeUp = (delay = 0) => ({
    initial: shouldReduce ? {} : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
  })

  return (
    <section className="relative min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center pt-28 pb-20 px-6 overflow-hidden text-center">
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={['#3B82F6', '#1E3A8A', '#0A0A0A']}
          amplitude={1.2}
          blend={0.35}
          speed={0.4}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-[860px]">
        <motion.div {...fadeUp(0.05)}>
          <div className="inline-flex items-center gap-2 bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-full px-3 py-1 mb-7">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] inline-block"
              style={{ animation: 'pulse-blue 2s ease-in-out infinite' }}
            />
            <span className="font-inter text-[11px] font-medium text-[#3B82F6] tracking-[-0.01em]">
              Internal Tool · Venturizer
            </span>
          </div>
        </motion.div>

        <motion.h1
          {...fadeUp(0.12)}
          className="font-display text-white mb-7"
          style={{
            fontSize: 'clamp(52px, 9vw, 92px)',
            letterSpacing: '-0.045em',
            lineHeight: 0.91,
            textWrap: 'balance',
          }}
        >
          Qualify every <span className="text-red-500 font-light uppercase">founder</span>
          <br />
          <span className="text-white/40">&amp;</span> <span className="text-red-500 font-light uppercase">investor.</span>{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #3B82F6 30%, #60A5FA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Instantly.
          </span>
        </motion.h1>

        <motion.div {...fadeUp(0.18)} className="flex flex-col items-center gap-2 mb-5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-[#3B82F6]/[0.12] border border-[#3B82F6]/30 rounded-full px-4 py-2">
              <div className="w-5 h-5 rounded-full bg-[#3B82F6]/20 flex items-center justify-center">
                <Users size={11} className="text-[#3B82F6]" />
              </div>
              <span className="font-geist font-medium text-[13px] text-[#3B82F6] tracking-[-0.02em]">Founders</span>
            </div>
            <span className="font-inter text-[11px] text-white/20 tracking-[0.06em] uppercase">&amp;</span>
            <div className="flex items-center gap-2 bg-[#22C55E]/[0.1] border border-[#22C55E]/25 rounded-full px-4 py-2">
              <div className="w-5 h-5 rounded-full bg-[#22C55E]/15 flex items-center justify-center">
                <TrendingUp size={11} className="text-[#22C55E]" />
              </div>
              <span className="font-geist font-medium text-[13px] text-[#22C55E] tracking-[-0.02em]">Investors</span>
            </div>
          </div>
          <span className="font-inter text-[11px] text-white/25 tracking-[0.06em] uppercase">qualified automatically</span>
        </motion.div>

        <motion.p
          {...fadeUp(0.22)}
          className="font-inter text-[#999] mb-10 max-w-[500px]"
          style={{
            fontSize: '17px',
            lineHeight: 1.4,
            letterSpacing: '-0.016em',
            fontFeatureSettings: '"cv01", "cv05", "cv09", "cv11", "ss03"',
          }}
        >
          A conversational bot interviews inbound founders &amp; investors over 12 turns, scores them 0–100 on a deterministic rubric, and surfaces the best leads in your team dashboard.
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="flex gap-2.5 flex-wrap justify-center">
          <motion.div whileTap={{ scale: 0.94 }} transition={{ duration: 0.15 }}>
            <Link
              to="/chat"
              className="inline-flex items-center gap-1.5 bg-[#EF4444] text-white font-inter font-medium text-sm tracking-[-0.01em] rounded-full px-6 py-3 no-underline"
            >
              Open Trinity
              <ArrowRight size={14} />
            </Link>
          </motion.div>
          <motion.div whileTap={{ scale: 0.94 }} transition={{ duration: 0.15 }}>
            <a
              href="#how-it-works"
              className="inline-flex items-center bg-[#161616] border border-white/[0.08] text-[#999] font-inter font-medium text-sm tracking-[-0.01em] rounded-full px-6 py-3 no-underline transition-colors hover:text-white hover:border-white/[0.18]"
            >
              See how it works
            </a>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative z-10 w-full mt-4">
        <ChatPreview />
      </div>

      <style>{`
        @keyframes pulse-blue {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </section>
  )
}
