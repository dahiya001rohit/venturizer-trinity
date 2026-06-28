import { motion, useReducedMotion } from 'framer-motion'

const STEPS = [
  {
    num: '01',
    color: '#3B82F6',
    title: 'Bot interviews',
    sub: '12 turns · auto-branches',
    body: 'Trinity opens a structured conversation — no form, no friction. It branches automatically: founders get asked about validation and traction; investors get asked about thesis and cheque size.',
    stat: '12',
    statLabel: 'conversational turns',
  },
  {
    num: '02',
    color: '#22C55E',
    title: 'Deterministic score',
    sub: '0–100 · per-dimension',
    body: 'Every answer maps to a rubric dimension. ~65% is pure deterministic logic — concrete signals like MRR, team depth, and market evidence. The score is fully traceable.',
    stat: '65%',
    statLabel: 'deterministic logic',
  },
  {
    num: '03',
    color: '#F5A623',
    title: 'Team triages',
    sub: 'Dashboard · filtered by bucket',
    body: 'Scored leads surface in the team dashboard sorted Hot → Good → Maybe → Low. Filter, assign, and move — without touching the conversation.',
    stat: '4',
    statLabel: 'priority buckets',
  },
]

export function HowItWorks() {
  const shouldReduce = useReducedMotion()

  return (
    <section id="how-it-works" className="bg-[#0A0A0A] py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-1.5 bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-full px-3 py-1 mb-5">
            <span className="font-inter text-[11px] font-medium text-[#3B82F6] uppercase tracking-[0.06em]">How it works</span>
          </div>
          <h2
            className="font-display text-white mb-4"
            style={{ fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-0.04em', lineHeight: 0.95 }}
          >
            Cold inquiry to scored lead.
            <br />
            Zero human effort.
          </h2>
          <p className="font-inter text-[#999] text-[15px] tracking-[-0.014em] leading-relaxed max-w-[440px] mx-auto">
            The full pipeline runs automatically. Your team only sees leads that have already been interviewed and scored.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden md:block absolute top-[52px] left-[calc(16.67%-1px)] right-[calc(16.67%-1px)] h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={shouldReduce ? {} : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col"
              >
                <div className="flex flex-col items-start md:items-center md:text-center mb-8">
                  <div
                    className="w-[52px] h-[52px] rounded-full border-2 flex items-center justify-center mb-6 relative bg-[#0A0A0A]"
                    style={{ borderColor: `${step.color}40` }}
                  >
                    <div
                      className="absolute inset-0 rounded-full opacity-20"
                      style={{ background: `radial-gradient(circle, ${step.color} 0%, transparent 70%)` }}
                    />
                    <span
                      className="font-geist font-semibold text-[13px] relative z-10"
                      style={{ color: step.color, letterSpacing: '-0.02em' }}
                    >
                      {step.num}
                    </span>
                  </div>

                  <div className="mb-1">
                    <span
                      className="font-inter text-[10px] font-medium uppercase tracking-[0.07em]"
                      style={{ color: step.color }}
                    >
                      {step.sub}
                    </span>
                  </div>
                  <h3
                    className="font-display text-white mb-3"
                    style={{ fontSize: 'clamp(20px, 2.5vw, 26px)', letterSpacing: '-0.035em', lineHeight: 1.05 }}
                  >
                    {step.title}
                  </h3>
                  <p className="font-inter text-[#999] text-[13px] tracking-[-0.01em] leading-[1.65] max-w-[300px]">
                    {step.body}
                  </p>
                </div>

                <div
                  className="mt-auto rounded-2xl border p-5 flex items-end justify-between"
                  style={{
                    backgroundColor: `${step.color}08`,
                    borderColor: `${step.color}18`,
                  }}
                >
                  <div>
                    <div
                      className="font-geist font-semibold mb-0.5"
                      style={{ fontSize: 'clamp(28px, 4vw, 40px)', letterSpacing: '-0.04em', lineHeight: 1, color: step.color }}
                    >
                      {step.stat}
                    </div>
                    <div className="font-inter text-[11px] text-[#555] tracking-[-0.01em]">{step.statLabel}</div>
                  </div>
                  <div
                    className="font-geist font-semibold text-[11px] opacity-20 tracking-[0.05em]"
                    style={{ color: step.color }}
                  >
                    STEP {step.num}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
