import { motion, useReducedMotion } from 'framer-motion'
import { Zap } from 'lucide-react'

const STATS = [
  { value: '<2s', label: 'Score delivered' },
  { value: '100%', label: 'Leads scored' },
  { value: '65%', label: 'Deterministic' },
  { value: '0', label: 'Manual reviews needed' },
]

const TRUTHS = [
  {
    heading: 'If AI is slow, the rubric takes over.',
    body: 'Trinity runs a deterministic scoring engine in parallel with every AI call. If inference lags or fails, the rubric fires immediately — no waiting, no blank scores, no blocked leads.',
  },
  {
    heading: 'Same founder, same answers, same score. Every time.',
    body: 'No interviewer variance. No Monday-morning effect. No mood-based bias. The rubric is fixed — and every result is traceable back to the exact responses that drove it.',
  },
]

export function Resilience() {
  const shouldReduce = useReducedMotion()

  return (
    <section className="bg-[#0A0A0A] py-24 px-6 border-t border-white/[0.05]">
      <div className="max-w-[1200px] mx-auto">

        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-1.5 bg-[#F5A623]/10 border border-[#F5A623]/20 rounded-full px-3 py-1 mb-6">
            <Zap size={10} className="text-[#F5A623]" />
            <span className="font-inter text-[11px] font-medium text-[#F5A623] uppercase tracking-[0.06em]">Built to hold</span>
          </div>
          <h2
            className="font-display text-white"
            style={{ fontSize: 'clamp(36px, 6vw, 64px)', letterSpacing: '-0.045em', lineHeight: 0.9 }}
          >
            Never blocks.<br />
            <span className="text-white/25">Never misses</span><br />
            <span className="text-white/25">a lead.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05] rounded-2xl overflow-hidden mb-16">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={shouldReduce ? {} : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="bg-[#0A0A0A] px-6 py-8 flex flex-col gap-1"
            >
              <div
                className="font-geist font-semibold text-[#F5A623]"
                style={{ fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '-0.04em', lineHeight: 1 }}
              >
                {s.value}
              </div>
              <div className="font-inter text-[12px] text-white/30 tracking-[-0.01em]">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.05] rounded-2xl overflow-hidden">
          {TRUTHS.map((t, i) => (
            <motion.div
              key={t.heading}
              initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#0A0A0A] px-8 py-10"
            >
              <div
                className="font-display text-white mb-4"
                style={{ fontSize: 'clamp(17px, 2vw, 22px)', letterSpacing: '-0.03em', lineHeight: 1.1 }}
              >
                {t.heading}
              </div>
              <p className="font-inter text-[13px] text-white/30 tracking-[-0.01em] leading-relaxed m-0">
                {t.body}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
