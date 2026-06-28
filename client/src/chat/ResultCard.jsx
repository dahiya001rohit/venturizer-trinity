import { motion } from 'framer-motion'
import { BUCKET_COLOR, BUCKET_MESSAGE } from './flowEngine'

export function ResultCard({ score, bucket, onReset }) {
  const color = BUCKET_COLOR[bucket]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center flex-1 px-6 py-10 text-center"
    >
      <div className="relative mb-6">
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-30"
          style={{ backgroundColor: color, transform: 'scale(1.4)' }}
        />
        <div
          className="relative font-display tabular-nums leading-none"
          style={{ fontSize: '88px', letterSpacing: '-0.06em', color }}
        >
          {score}
        </div>
      </div>

      <div
        className="inline-flex items-center gap-2 font-inter text-[12px] font-medium tracking-[0.04em] uppercase rounded-full px-4 py-1.5 mb-4"
        style={{
          backgroundColor: `${color}15`,
          border: `1px solid ${color}35`,
          color,
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        {bucket}
      </div>

      <p className="font-inter text-[14px] text-[#999] tracking-[-0.01em] leading-relaxed max-w-[260px] mb-8">
        {BUCKET_MESSAGE[bucket]}
      </p>

      <button
        onClick={onReset}
        className="font-inter text-[12px] text-[#444] hover:text-[#999] transition-colors bg-transparent border-0 cursor-pointer tracking-[-0.01em]"
      >
        Start over
      </button>
    </motion.div>
  )
}
