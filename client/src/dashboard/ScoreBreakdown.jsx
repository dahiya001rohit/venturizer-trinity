import { motion, useReducedMotion } from 'framer-motion'
import { BUCKET_COLOR } from '../constants'

const DIMENSION_COLOR = (score, max) => {
  const pct = score / max
  if (pct >= 0.75) return '#22C55E'
  if (pct >= 0.55) return '#3B82F6'
  if (pct >= 0.35) return '#F59E0B'
  return '#DC2626'
}

export function ScoreBreakdown({ breakdown }) {
  const safeBreakdown = Array.isArray(breakdown) ? breakdown : []
  const shouldReduce = useReducedMotion()
  const total = safeBreakdown.reduce((s, d) => s + (d.max || 0), 0)

  return (
    <div className="rounded-[20px] bg-[#161616] border border-white/[0.06] overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between">
        <span className="font-display text-white text-[14px]" style={{ letterSpacing: '-0.03em' }}>Score breakdown</span>
        <span className="font-inter text-[11px] text-[#444] tabular-nums tracking-[-0.01em]">out of {total}</span>
      </div>
      <div className="p-5 flex flex-col gap-4">
        {safeBreakdown.map((dim, i) => {
          const max = dim.max || 100
          const pct = ((dim.score || 0) / max) * 100
          const color = DIMENSION_COLOR(dim.score || 0, max)
          return (
            <div key={dim.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-inter text-[13px] text-[#999] tracking-[-0.01em]">{dim.label}</span>
                <span className="font-inter text-[13px] tabular-nums tracking-[-0.01em]" style={{ color }}>
                  {dim.score}<span className="text-[#333]">/{dim.max}</span>
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                  initial={shouldReduce ? { width: `${pct}%` } : { width: '0%' }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
