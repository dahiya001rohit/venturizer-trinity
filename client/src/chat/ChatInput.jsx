import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export function ChatInput({ onSend, disabled, placeholder = 'Type your answer…' }) {
  const [value, setValue] = useState('')

  function handleSend() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-center gap-2 px-3 py-3 border-t border-white/[0.06]">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKey}
        disabled={disabled}
        placeholder={placeholder}
        className="flex-1 font-inter text-[14px] text-white bg-[#1A1A1A] border border-white/[0.1] rounded-[10px] px-4 py-3 outline-none placeholder:text-[#555] tracking-[-0.01em] disabled:opacity-40 transition-all"
        onFocus={e => e.target.style.boxShadow = '0 0 0 1px rgba(59,130,246,0.5), 0 0 0 3px rgba(59,130,246,0.15)'}
        onBlur={e => e.target.style.boxShadow = 'none'}
      />
      <motion.button
        whileTap={{ scale: 0.88 }}
        transition={{ duration: 0.12 }}
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="w-9 h-9 rounded-full bg-[#EF4444] flex items-center justify-center shrink-0 border-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
      >
        <ArrowUp size={15} className="text-white" />
      </motion.button>
    </div>
  )
}
