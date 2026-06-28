import { motion, useReducedMotion } from 'framer-motion'

const DIMENSIONS = [
  { label: 'Validation', score: 18, max: 25, color: '#F5A623', pct: 72 },
  { label: 'Traction', score: 15, max: 20, color: '#F5A623', pct: 75 },
  { label: 'Team depth', score: 14, max: 20, color: '#22C55E', pct: 70 },
  { label: 'Market size', score: 12, max: 20, color: '#3B82F6', pct: 60 },
  { label: 'Clarity', score: 10, max: 15, color: '#22C55E', pct: 67 },
]

const BUCKETS = [
  { label: 'Hot', range: '75–100', color: '#F5A623', count: 3 },
  { label: 'Good', range: '50–74', color: '#22C55E', count: 11 },
  { label: 'Maybe', range: '30–49', color: '#3B82F6', count: 8 },
  { label: 'Low', range: '0–29', color: '#6B7280', count: 21 },
]

const STATS = [
  { value: '65%', label: 'Deterministic logic', color: '#3B82F6' },
  { value: '35%', label: 'AI pattern recognition', color: '#999' },
  { value: '0–100', label: 'Auditable score range', color: '#22C55E' },
]

function RadialScore({ score, bucket, color, shouldReduce }) {
  const radius = 54
  const circ = 2 * Math.PI * radius
  const fill = (score / 100) * circ

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <motion.circle
            cx="64" cy="64" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={shouldReduce ? { strokeDashoffset: circ - fill } : { strokeDashoffset: circ }}
            whileInView={{ strokeDashoffset: circ - fill }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-geist font-semibold text-white" style={{ fontSize: '32px', letterSpacing: '-0.04em', lineHeight: 1 }}>{score}</span>
          <span className="font-inter text-[10px] text-white/30 tracking-[0.04em] uppercase mt-0.5">/ 100</span>
        </div>
      </div>
      <div
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 border"
        style={{ backgroundColor: `${color}12`, borderColor: `${color}30` }}
      >
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color }}>{bucket}</span>
      </div>
    </div>
  )
}

export function ScoringExplainer() {
  const shouldReduce = useReducedMotion()

  return (
    <section id="scoring" className="bg-[#0A0A0A] py-24 px-6 border-t border-white/[0.05]">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-1.5 bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-full px-3 py-1 mb-5">
            <span className="font-inter text-[11px] font-medium text-[#3B82F6] uppercase tracking-[0.06em]">Scoring</span>
          </div>
          <h2
            className="font-display text-white mb-4"
            style={{ fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-0.04em', lineHeight: 0.95 }}
          >
            Not a black box.
            <br />
            Every point is earned.
          </h2>
          <p className="font-inter text-[#999] text-[15px] tracking-[-0.014em] leading-relaxed max-w-[460px] mx-auto">
            ~65% deterministic. Every score breaks down per-dimension — your team can trace exactly why a founder scored 72, not just that they did.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-start">
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4"
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={shouldReduce ? {} : { opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-white/[0.06] bg-[#161616] p-5 relative overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                <div
                  className="font-geist font-semibold mb-1"
                  style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', letterSpacing: '-0.04em', lineHeight: 1, color: s.color }}
                >
                  {s.value}
                </div>
                <div className="font-inter text-[12px] text-[#555] tracking-[-0.01em]">{s.label}</div>
              </motion.div>
            ))}

            <motion.div
              initial={shouldReduce ? {} : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-white/[0.06] bg-[#161616] p-5 relative overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
              <div className="font-inter text-[11px] text-[#444] uppercase tracking-[0.06em] mb-3">Priority buckets</div>
              <div className="flex flex-col gap-2">
                {BUCKETS.map((b) => (
                  <div key={b.label} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                    <span className="font-geist text-[13px] font-medium tracking-[-0.02em]" style={{ color: b.color }}>{b.label}</span>
                    <span className="font-inter text-[11px] text-[#444] tracking-[-0.01em]">{b.range}</span>
                    <span className="ml-auto font-geist text-[12px] font-medium text-white/20">{b.count}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center"
          >
            <RadialScore score={84} bucket="Hot" color="#F5A623" shouldReduce={shouldReduce} />
          </motion.div>

          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[20px] border border-white/[0.07] bg-[#161616] overflow-hidden relative shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="p-5 border-b border-white/[0.05] flex items-center justify-between">
              <div>
                <div className="font-inter text-[10px] text-[#444] uppercase tracking-[0.06em] mb-1">Score breakdown</div>
                <div className="font-geist text-[13px] font-medium text-white tracking-[-0.02em]">Aarav Shah · Founder</div>
              </div>
              <div className="text-right">
                <div className="font-geist font-semibold text-white" style={{ fontSize: '32px', letterSpacing: '-0.04em', lineHeight: 1 }}>84</div>
                <div className="font-inter text-[10px] text-[#444] tracking-[-0.01em]">out of 100</div>
              </div>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {DIMENSIONS.map((dim, i) => (
                <div key={dim.label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-inter text-[12px] text-[#999] tracking-[-0.01em]">{dim.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-geist text-[12px] font-medium tracking-[-0.02em]" style={{ color: dim.color }}>
                        {dim.score}
                      </span>
                      <span className="font-inter text-[10px] text-[#444]">/ {dim.max}</span>
                    </div>
                  </div>
                  <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: dim.color }}
                      initial={shouldReduce ? { width: `${dim.pct}%` } : { width: '0%' }}
                      whileInView={{ width: `${dim.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: i * 0.07 + 0.2, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 pb-5">
              <div className="rounded-xl bg-[#F5A623]/[0.06] border border-[#F5A623]/15 p-3">
                <div className="font-inter text-[11px] text-[#F5A623]/70 leading-relaxed tracking-[-0.01em]">
                  Strong team signal + early traction tips this to Hot. Validation score is the ceiling to watch.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
