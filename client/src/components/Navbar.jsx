import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Scoring', href: '#scoring' },
  { label: 'Dashboard', href: '#dashboard' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto w-full max-w-[860px] h-12 flex items-center pl-5 pr-2 rounded-full transition-all duration-200"
          style={{
            backgroundColor: scrolled ? 'rgba(16,16,16,0.92)' : 'rgba(22,22,22,0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: scrolled ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(255,255,255,0.07)',
            boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.5)' : '0 4px 16px rgba(0,0,0,0.3)',
          }}
        >
          <nav className="w-full flex items-center justify-between relative">
            <Link
              to="/"
              className="font-display text-white no-underline shrink-0"
              style={{ fontSize: '16px', letterSpacing: '-0.04em' }}
            >
              Trinity
            </Link>

            <div
              className="nav-center absolute left-1/2 -translate-x-1/2 flex gap-7"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-inter text-[#999] no-underline whitespace-nowrap transition-colors duration-150 hover:text-white"
                  style={{ fontSize: '13px', letterSpacing: '-0.01em' }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <Link
                to="/signin"
                className="nav-signin font-inter text-[#999] no-underline rounded-full transition-colors duration-150 hover:text-white"
                style={{ fontSize: '12px', letterSpacing: '-0.01em', padding: '5px 14px' }}
              >
                Sign in
              </Link>

              <motion.div whileTap={{ scale: 0.93 }} transition={{ duration: 0.15 }}>
                <Link
                  to="/chat"
                  className="font-inter text-white no-underline bg-[#EF4444] rounded-full inline-block whitespace-nowrap"
                  style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '-0.01em', padding: '6px 16px' }}
                >
                  Get started
                </Link>
              </motion.div>

              <button
                className="nav-hamburger hidden bg-transparent border-0 cursor-pointer text-[#999] p-1 ml-0.5 rounded-full"
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </nav>
        </motion.header>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[76px] inset-x-4 z-[49] rounded-[20px] p-5 flex flex-col gap-3.5"
            style={{
              backgroundColor: 'rgba(16,16,16,0.96)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-inter text-[#999] no-underline"
                style={{ fontSize: '15px' }}
              >
                {link.label}
              </a>
            ))}
            <div className="h-px bg-white/[0.06]" />
            <Link
              to="/signin"
              onClick={() => setOpen(false)}
              className="font-inter text-[#999] no-underline"
              style={{ fontSize: '15px' }}
            >
              Sign in
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 810px) {
          .nav-center { display: none !important; }
          .nav-signin { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}
