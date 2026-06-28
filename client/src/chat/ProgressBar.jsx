import { motion } from 'framer-motion'

export function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.06]">
      <div className="flex-1 h-px bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#3B82F6] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span className="font-inter text-[11px] text-[#444] tabular-nums tracking-[-0.01em] shrink-0">
        {current} / {total}
      </span>
    </div>
  )
}
