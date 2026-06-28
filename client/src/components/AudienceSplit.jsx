import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Aurora } from './Aurora'

const FOUNDER_SIGNALS = [
  'Problem-solution clarity & market evidence',
  'MRR, user count, growth rate, retention',
  'MVP stage: prototype → pilot → live',
  'Team depth: domain + execution backgrounds',
  'Funding ask vs. traction alignment',
]

const INVESTOR_SIGNALS = [
  'Stage focus: pre-seed, seed, Series A',
  'Sector & geography thesis fit',
  'Cheque size & portfolio capacity',
  'Deployment timeline: active vs. exploring',
  'Syndication & follow-on behavior',
]

function SpotlightCard({ side, title, tagline, signals, cta, delay }) {
  const shouldReduce = useReducedMotion()
  const isFounder = side === 'founder'

  return (
    <motion.div
      initial={shouldReduce ? {} : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex-1 min-w-[280px] rounded-[30px] border border-white/[0.07] bg-[#161616] overflow-hidden"
      style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="absolute inset-0 pointer-events-none">
        <Aurora
          colorStops={isFounder ? ['#3B82F6', '#1E3A8A', '#161616'] : ['#1E3A8A', '#3B82F6', '#161616']}
          amplitude={0.8}
          blend={0.18}
          speed={0.3}
        />
      </div>

      <div className="relative z-10 p-8 lg:p-10">
        <div className="inline-flex items-center gap-1.5 bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-full px-3 py-1 mb-6">
          <span className="font-inter text-[11px] font-medium text-[#3B82F6] uppercase tracking-[0.06em]">
            {isFounder ? 'For founders' : 'For investors'}
          </span>
        </div>

        <h3
          className="font-geist font-semibold text-white mb-3"
          style={{ fontSize: 'clamp(24px, 3.2vw, 34px)', letterSpacing: '-0.04em', lineHeight: 1.0 }}
        >
          {title}
        </h3>
        <p className="font-inter text-[#999] text-[14px] tracking-[-0.012em] leading-relaxed mb-8">
          {tagline}
        </p>

        <div className="mb-8">
          <div className="font-inter text-[10px] text-[#444] uppercase tracking-[0.07em] mb-3">
            Trinity qualifies on
          </div>
          <div className="flex flex-col gap-2.5">
            {signals.map((s) => (
              <div key={s} className="flex items-start gap-2.5">
                <CheckCircle2 size={13} className="text-[#3B82F6] shrink-0 mt-[1px]" />
                <span className="font-inter text-[13px] text-[#777] tracking-[-0.01em] leading-snug">{s}</span>
              </div>
            ))}
          </div>
        </div>

        <motion.div whileTap={{ scale: 0.94 }} transition={{ duration: 0.15 }}>
          <Link
            to="/chat"
            className="inline-flex items-center gap-1.5 bg-[#EF4444] text-white rounded-full px-5 py-2.5 font-inter font-medium text-[13px] tracking-[-0.01em] no-underline"
          >
            {cta}
            <ArrowRight size={13} />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function AudienceSplit() {
  return (
    <section className="bg-[#0A0A0A] py-24 px-6 border-t border-white/[0.05]">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h2
            className="font-geist font-semibold text-white mb-3"
            style={{ fontSize: 'clamp(28px, 4vw, 46px)', letterSpacing: '-0.04em', lineHeight: 0.95 }}
          >
            Two paths. One pipeline.
          </h2>
          <p className="font-inter text-[#999] text-[15px] tracking-[-0.012em] leading-relaxed max-w-[400px] mx-auto">
            Trinity branches the conversation automatically. Same link — right questions for each audience.
          </p>
        </motion.div>

        <div className="flex gap-5 flex-wrap">
          <SpotlightCard
            side="founder"
            title="Building something real?"
            tagline="Trinity qualifies founders on validation, traction, and execution. Surfaces the ones worth a deeper conversation with the Venturizer team."
            signals={FOUNDER_SIGNALS}
            cta="Start as a founder"
            delay={0}
          />
          <SpotlightCard
            side="investor"
            title="Deploying capital?"
            tagline="Investors get qualified on thesis fit, cheque size, and deployment timeline. No cold decks, no scheduling tag."
            signals={INVESTOR_SIGNALS}
            cta="Start as an investor"
            delay={0.12}
          />
        </div>
      </div>
    </section>
  )
}
