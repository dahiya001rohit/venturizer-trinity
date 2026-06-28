import { motion } from 'framer-motion'

export function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-[#161616] rounded-[20px] rounded-bl-[4px] w-fit">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="block w-1.5 h-1.5 rounded-full bg-white/30"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
