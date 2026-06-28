import { motion } from 'framer-motion'

export function MessageBubble({ role, text, index }) {
  const isBot = role === 'bot'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-end gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      {isBot && (
        <div className="w-6 h-6 rounded-full bg-[#3B82F6]/15 border border-[#3B82F6]/25 flex items-center justify-center shrink-0 mb-0.5">
          <span className="font-display text-[#3B82F6]" style={{ fontSize: '9px', letterSpacing: '-0.02em' }}>T</span>
        </div>
      )}
      <div
        className={`font-inter leading-relaxed tracking-[-0.01em] ${isBot ? 'max-w-[85%] text-[14px] px-4 py-3.5' : 'max-w-[78%] text-[13px] px-4 py-2.5'}`}
        style={{
          backgroundColor: isBot ? '#161616' : '#1E1E1E',
          color: isBot ? '#e5e5e5' : '#ffffff',
          borderRadius: isBot ? '20px 20px 20px 4px' : '20px 20px 4px 20px',
          border: isBot ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(255,255,255,0.12)',
        }}
      >
        {text}
      </div>
    </motion.div>
  )
}
