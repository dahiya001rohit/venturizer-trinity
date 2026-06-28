import { useState } from 'react'
import { API_URL } from '../config'
import { useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Aurora } from '../components/Aurora'
import { useAuth } from '../AuthContext'

const FEATURES = [
  { label: '12-turn interviews', sub: 'Structured qualification, every time' },
  { label: '0–100 scoring', sub: 'Deterministic rubric, no guesswork' },
  { label: '4 lead buckets', sub: 'Hot · Good · Maybe · Low — auto-sorted' },
  { label: 'Instant dashboard', sub: 'Real-time results for your whole team' },
]

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user, setUser } = useAuth()

  if (user) {
    return <Navigate to="/overview" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email) { setError('Email is required.'); return }
    if (!password) { setError('Password is required.'); return }
    
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      })
      
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to login')
        setLoading(false)
        return
      }

      setUser(data.user)
      navigate('/dashboard')
    } catch (err) {
      setError('Network error, please try again')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col lg:flex-row overflow-hidden">
      {/* Left panel — brand + features */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden">
        <div className="absolute inset-0">
          <Aurora colorStops={['#3B82F6', '#1E3A8A', '#0A0A0A']} amplitude={1.4} blend={0.5} speed={0.3} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A0A0A]/60" />

        <div className="relative z-10 flex flex-col h-full px-14 py-14">
          <div>
            <div className="font-serif italic mb-1" style={{ fontSize: '32px', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #3B82F6, #93C5FD)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Trinity</div>
            <div className="font-inter text-[#444] text-[12px] tracking-[-0.01em]">by Venturizer</div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-3">
                <span className="font-inter text-[11px] text-[#3B82F6] tracking-[0.06em] uppercase font-medium">Lead qualification engine</span>
              </div>
              <h1 className="font-display text-white mb-6" style={{ fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '-0.045em', lineHeight: 0.92 }}>
                Every inbound lead,<br />
                <span style={{ background: 'linear-gradient(135deg, #3B82F6, #60A5FA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  scored instantly.
                </span>
              </h1>
              <p className="font-inter text-[#555] text-[14px] leading-relaxed tracking-[-0.01em] max-w-[340px] mb-10">
                Trinity interviews founders and investors over 12 turns and surfaces the best leads in your team dashboard.
              </p>

              <div className="flex flex-col gap-4">
                {FEATURES.map((f, i) => (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] mt-1.5 shrink-0" />
                    <div>
                      <div className="font-inter text-[13px] text-white tracking-[-0.01em] leading-none mb-0.5">{f.label}</div>
                      <div className="font-inter text-[11px] text-[#444] tracking-[-0.01em]">{f.sub}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="font-inter text-[11px] text-[#fff] tracking-[-0.01em]">
            © 2025 Venturizer · Team access only
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-[440px] shrink-0 flex items-center justify-center px-6 lg:px-8 py-12 bg-[#0D0D0D] border-t lg:border-t-0 lg:border-l border-white/[0.05] relative min-h-screen lg:min-h-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[340px]"
        >
          <div className="mb-10">
            <div className="font-display text-white mb-2" style={{ fontSize: '26px', letterSpacing: '-0.04em' }}>Welcome back</div>
            <div className="font-inter text-[#444] text-[13px] tracking-[-0.01em]">Sign in to your team dashboard</div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Field label="Email address">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="team@venturizer.com"
                autoComplete="email"
                className="w-full font-inter text-[13px] text-white bg-[#111] border border-white/[0.08] rounded-[12px] px-4 py-3 outline-none placeholder:text-[#2A2A2A] tracking-[-0.01em] transition-all"
                onFocus={e => e.target.style.boxShadow = '0 0 0 1px rgba(59,130,246,0.5), 0 0 0 4px rgba(59,130,246,0.1)'}
                onBlur={e => e.target.style.boxShadow = 'none'}
              />
            </Field>

            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full font-inter text-[13px] text-white bg-[#111] border border-white/[0.08] rounded-[12px] px-4 py-3 outline-none placeholder:text-[#2A2A2A] tracking-[-0.01em]"
                onFocus={e => e.target.style.boxShadow = '0 0 0 1px rgba(59,130,246,0.5), 0 0 0 4px rgba(59,130,246,0.1)'}
                onBlur={e => e.target.style.boxShadow = 'none'}
              />
            </Field>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-[10px] px-3 py-2.5"
              >
                <span className="text-[#DC2626]" style={{ fontSize: '12px' }}>⚠</span>
                <span className="font-inter text-[12px] text-[#DC2626] tracking-[-0.01em]">{error}</span>
              </motion.div>
            )}

            <div className="flex flex-col gap-3 mt-1">
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.12 }}
                className="w-full font-inter font-medium text-[13px] text-white rounded-[12px] py-3 tracking-[-0.01em] cursor-pointer border-0 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: loading ? '#1A1A1A' : 'linear-gradient(135deg, #3B82F6, #2563EB)' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />
                    Signing in…
                  </span>
                ) : 'Sign in'}
              </motion.button>

              <button
                type="button"
                onClick={() => {
                  setEmail('team@venturizer.com')
                  setPassword('reviewer123')
                }}
                className="w-full font-inter font-medium text-[12px] text-[#3B82F6] hover:text-[#60A5FA] bg-[#3B82F6]/10 hover:bg-[#3B82F6]/15 rounded-[12px] py-2.5 transition-colors cursor-pointer border border-[#3B82F6]/20"
              >
                Auto-fill Reviewer Account
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
            <div className="font-inter text-[11px] text-[#fff] tracking-[-0.01em]">Only team@venturizer.com is authorized</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-inter text-[11px] text-[#555] tracking-[0.03em] uppercase font-medium">{label}</label>
      {children}
    </div>
  )
}
