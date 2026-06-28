import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { API_URL } from '../config'
import { LayoutDashboard, Users, GitBranch, ChevronRight, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../AuthContext'

const NAV = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/dashboard/leads', label: 'Leads', icon: Users },
]

export function DashboardLayout({ children, breadcrumb }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, setUser } = useAuth()
  const [userOpen, setUserOpen] = useState(false)

  async function handleLogout() {
    try {
      await fetch(`${API_URL}/api/auth/logout`, { method: "POST", credentials: "include" })
      setUser(null)
      navigate('/login')
    } catch(err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col md:flex-row pb-16 md:pb-0">
      <aside className="w-56 shrink-0 border-r border-white/[0.05] hidden md:flex flex-col sticky top-0 h-screen z-10 bg-[#0A0A0A]">
        <div className="px-5 py-5 border-b border-white/[0.05]">
          <div className="font-serif italic" style={{ fontSize: '24px', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #3B82F6, #93C5FD)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Trinity</div>
          <div className="font-inter text-[10px] text-[#333] tracking-[0.04em] uppercase mt-0.5">Venturizer · Internal</div>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = to === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(to)
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl no-underline transition-all font-inter text-[13px] tracking-[-0.01em] ${
                  active
                    ? 'bg-white/[0.07] text-white'
                    : 'text-[#444] hover:text-[#999] hover:bg-white/[0.03]'
                }`}
              >
                <Icon size={14} className={active ? 'text-white' : 'text-[#333]'} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-3 border-t border-white/[0.05] relative">
          <button
            onClick={() => setUserOpen(!userOpen)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer bg-transparent border-0 text-left"
          >
            <div className="w-6 h-6 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/30 flex items-center justify-center shrink-0">
              <span className="font-display text-[#3B82F6]" style={{ fontSize: '10px' }}>V</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-inter text-[12px] text-white tracking-[-0.01em] leading-none mb-0.5">Venturizer</div>
              <div className="font-inter text-[10px] text-[#333] tracking-[-0.01em] truncate">team@venturizer.co</div>
            </div>
            <ChevronDown size={12} className={`text-[#333] transition-transform ${userOpen ? 'rotate-180' : ''}`} />
          </button>

          {userOpen && (
            <div className="absolute bottom-14 left-3 right-3 bg-[#1A1A1A] border border-white/[0.08] rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
              <div className="px-3 py-2.5 border-b border-white/[0.06]">
                <div className="font-inter text-[11px] text-[#555] tracking-[-0.01em]">Signed in as</div>
                <div className="font-inter text-[12px] text-white tracking-[-0.01em]">team@venturizer.co</div>
              </div>
              <button
                onClick={() => { setUserOpen(false); handleLogout() }}
                className="w-full flex items-center gap-2 px-3 py-2.5 font-inter text-[12px] text-[#DC2626] hover:bg-white/[0.04] transition-colors cursor-pointer bg-transparent border-0 text-left"
              >
                <LogOut size={12} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {breadcrumb && (
          <div className="h-11 border-b border-white/[0.05] flex items-center px-6 gap-1.5 shrink-0">
            <Link to="/dashboard/leads" className="font-inter text-[12px] text-[#444] no-underline hover:text-[#999] transition-colors">Leads</Link>
            <ChevronRight size={11} className="text-white/15" />
            <span className="font-inter text-[12px] text-[#777] tracking-[-0.01em] truncate">{breadcrumb}</span>
          </div>
        )}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-[#0D0D0D] border-t border-white/[0.05] flex items-center justify-around px-2 z-20">
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = to === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(to)
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg no-underline transition-all ${
                active ? 'text-white' : 'text-[#555] hover:text-[#999]'
              }`}
            >
              <Icon size={18} />
              <span className="font-inter text-[10px] tracking-[-0.01em]">{label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
