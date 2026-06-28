import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Aurora } from '../components/Aurora'
import { ChatWidget } from './ChatWidget'

export function ChatPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] relative flex flex-col overflow-hidden">
      {/* Full-page aurora — same energy as hero */}
      <div className="absolute inset-0 z-0">
        <Aurora colorStops={['#3B82F6', '#1E3A8A', '#0A0A0A']} amplitude={1.3} blend={0.42} speed={0.28} />
      </div>
      {/* vignette bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-64 z-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0A0A0A, transparent)' }} />

      {/* Sticky Navbar strip with blur */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-8 py-5 shrink-0 backdrop-blur-md bg-[#0A0A0A]/70 border-b border-white/[0.05]">
        <Link
          to="/"
          className="flex items-center gap-2 font-inter text-[13px] text-white/50 hover:text-white no-underline transition-colors tracking-[-0.01em]"
        >
          <ArrowLeft size={14} />
          Back
        </Link>
        <div className="font-serif italic" style={{ fontSize: '24px', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #3B82F6, #93C5FD)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Trinity</div>
        <div className="font-inter text-[12px] text-white/30 tracking-[-0.01em]">by Venturizer</div>
      </div>

      {/* Hero text above the card */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-1.5 bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-full px-3 py-1 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] inline-block" />
            <span className="font-inter text-[11px] font-medium text-[#3B82F6] tracking-[0.04em] uppercase">Lead qualification</span>
          </div>
          <h1
            className="font-display text-white mb-3"
            style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-0.045em', lineHeight: 0.92 }}
          >
            Tell us about<br />
            <span style={{ background: 'linear-gradient(135deg, #3B82F6 30%, #60A5FA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              yourself.
            </span>
          </h1>
          <p className="font-inter text-white/35 text-[14px] tracking-[-0.01em] leading-relaxed max-w-[340px] mx-auto">
            12 questions · ~3 minutes · no login needed
          </p>
        </motion.div>

        {/* The card — 80% width, max 760px */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full relative"
          style={{ maxWidth: '1400px', width: '85%' }}
        >
          {/* Outer glow ring */}
          <div
            className="absolute -inset-px rounded-[28px] pointer-events-none z-0"
            style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(30,58,138,0.1), transparent)', borderRadius: '28px' }}
          />

          <div
            className="relative overflow-hidden"
            style={{
              borderRadius: '24px',
              background: '#0F0F0F',
              border: '1px solid rgba(255,255,255,0.09)',
              boxShadow: '0 0 0 1px rgba(59,130,246,0.06), 0 40px 100px rgba(0,0,0,0.65), 0 12px 32px rgba(0,0,0,0.4)',
              height: 'min(600px, calc(100vh - 260px))',
            }}
          >
            {/* Window chrome bar — gives iframe feel */}
            <div
              className="flex items-center gap-2 px-4 border-b shrink-0"
              style={{ height: '36px', borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div
                  className="font-inter text-[11px] text-white/20 tracking-[-0.01em] px-3 py-0.5 rounded-md"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  trinity.venturizer.co/qualify
                </div>
              </div>
            </div>

            {/* top highlight */}
            <div
              className="absolute inset-x-0 top-[36px] h-px pointer-events-none z-10"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }}
            />

            {/* Chat widget fills the rest */}
            <div className="absolute inset-x-0 bottom-0" style={{ top: '36px' }}>
              <ChatWidget mode="bubble" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-5 font-inter text-[11px] text-white/15 tracking-[-0.01em] text-center"
        >
          Your answers are private and shared only with the Venturizer team
        </motion.div>
      </div>
    </div>
  )
}
