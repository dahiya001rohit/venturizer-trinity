import { motion } from 'framer-motion'

export function OptionPills({ options, onSelect, disabled }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-wrap gap-2 px-4 pb-2"
    >
      {options.map((opt, i) => (
        <motion.button
          key={opt.value}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.18, delay: i * 0.05 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => !disabled && onSelect(opt.value)}
          disabled={disabled}
          className="font-inter text-[12px] tracking-[-0.01em] px-3.5 py-2 border cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            borderRadius: '8px',
            backgroundColor: '#262626',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#eee',
          }}
          onMouseEnter={e => {
            if (!disabled) {
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)'
              e.currentTarget.style.color = '#fff'
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            e.currentTarget.style.color = '#ccc'
          }}
        >
          {opt.label}
        </motion.button>
      ))}
    </motion.div>
  )
}
