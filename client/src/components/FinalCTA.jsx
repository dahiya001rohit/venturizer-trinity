import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Aurora } from './Aurora'

export function FinalCTA() {
  const shouldReduce = useReducedMotion()

  return (
    <section id="dashboard" className="bg-[#0A0A0A] py-32 px-6 relative overflow-hidden text-center">
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={['#1E3A8A', '#3B82F6', '#0A0A0A']}
          amplitude={0.9}
          blend={0.22}
          speed={0.35}
        />
      </div>

      <div className="relative z-10 max-w-[720px] mx-auto">
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-1.5 bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-full px-3 py-1 mb-7">
            <span className="font-inter text-[11px] font-medium text-[#3B82F6] uppercase tracking-[0.06em]">
              Internal · Venturizer team
            </span>
          </div>
        </motion.div>

        <motion.h2
          initial={shouldReduce ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-white mb-6"
          style={{ fontSize: 'clamp(40px, 7vw, 84px)', letterSpacing: '-0.045em', lineHeight: 0.91 }}
        >
          Stop triaging
          <br />
          manually.
        </motion.h2>

        <motion.p
          initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="font-inter text-[#999] text-[16px] tracking-[-0.014em] leading-relaxed mb-10 max-w-[460px] mx-auto"
        >
          Every founder. Every investor. Scored, bucketed, and surfaced — so your team focuses only on what's worth a call.
        </motion.p>

        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="flex gap-2.5 justify-center flex-wrap"
        >
          <motion.div whileTap={{ scale: 0.94 }} transition={{ duration: 0.15 }}>
            <Link
              to="/chat"
              className="inline-flex items-center gap-1.5 bg-[#EF4444] text-white rounded-full px-7 py-3.5 font-inter font-medium text-[15px] tracking-[-0.01em] no-underline"
            >
              Open Trinity
              <ArrowRight size={15} />
            </Link>
          </motion.div>

          <motion.div whileTap={{ scale: 0.94 }} transition={{ duration: 0.15 }}>
            <Link
              to="/dashboard"
              className="inline-flex items-center bg-[#161616] border border-white/[0.08] text-[#999] rounded-full px-7 py-3.5 font-inter font-medium text-[15px] tracking-[-0.01em] no-underline transition-colors hover:text-white hover:border-white/[0.18]"
            >
              View dashboard
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
