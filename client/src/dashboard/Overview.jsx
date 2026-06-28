import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, AlertCircle, Users, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import { DashboardLayout } from './DashboardLayout'
import { BUCKET_COLOR } from '../constants'

function StatCard({ label, value, sub, color, icon: Icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-[20px] p-[1px] overflow-hidden bg-white/[0.04] border border-white/[0.04]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative h-full bg-[#111] rounded-[19px] p-5 flex flex-col justify-between overflow-hidden">
        
        <div className="flex items-start justify-between mb-6 z-10">
          <div className="font-inter text-[13px] text-[#888] font-medium tracking-wide">{label}</div>
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500 group-hover:scale-110"
            style={{ backgroundColor: `${color}10`, borderColor: `${color}20` }}
          >
            <Icon size={14} style={{ color: color || '#fff' }} />
          </div>
        </div>

        <div className="z-10">
          <div className="font-geist tabular-nums tracking-tight text-white mb-1" style={{ fontSize: '42px', lineHeight: '1' }}>
            {value}
          </div>
          {sub && (
            <div className="font-inter text-[11px] text-[#555] flex items-center gap-1.5 mt-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color || '#555' }} />
              {sub}
            </div>
          )}
        </div>

        {color && (
          <div 
            className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[45px] opacity-10 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
            style={{ backgroundColor: color }}
          />
        )}
      </div>
    </motion.div>
  )
}

function BucketBar({ leads }) {
  const buckets = ['hot', 'good', 'maybe', 'low']
  const total = leads.length
  const counts = Object.fromEntries(buckets.map(b => [b, leads.filter(l => l.bucket === b).length]))

  return (
    <div className="group relative rounded-[20px] p-[1px] overflow-hidden bg-white/[0.04] border border-white/[0.04]">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative h-full bg-[#111] rounded-[19px] p-6 flex flex-col justify-between overflow-hidden">
        
        <div>
          <div className="font-inter text-[13px] text-[#888] font-medium tracking-wide mb-1">BUCKET DISTRIBUTION</div>
          <div className="font-inter text-[11px] text-[#555] mb-6">{total} leads scored</div>
        </div>

        <div className="flex h-[6px] rounded-full overflow-hidden gap-[2px] mb-6 bg-white/[0.05]">
          {buckets.map(b => {
            const pct = (counts[b] / total) * 100
            if (pct === 0) return null
            return (
              <motion.div
                key={b}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="h-full first:rounded-l-full last:rounded-r-full hover:opacity-80 transition-opacity cursor-crosshair"
                style={{ backgroundColor: BUCKET_COLOR[b] }}
              />
            )
          })}
        </div>

        <div className="grid grid-cols-4 gap-3">
          {buckets.map(b => (
            <div key={b} className="flex flex-col gap-1 p-2 rounded-xl hover:bg-white/[0.03] transition-colors border border-white/[0.05] p-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: BUCKET_COLOR[b], boxShadow: `0 0 8px ${BUCKET_COLOR[b]}80` }} />
                <span className="font-inter text-[10px] text-[#777] uppercase tracking-wider">{b}</span>
              </div>
              <span className="font-geist tabular-nums text-white" style={{ fontSize: '20px', letterSpacing: '-0.02em' }}>{counts[b]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RecentHot({ leads, navigate }) {
  const hot = leads.filter(l => l.bucket === 'hot').slice(0, 4)
  const mismatch = leads.filter(l => Array.isArray(l.flags) && l.flags.some(f => (typeof f === 'string' ? f : f.type) === 'mismatch'))

  return (
    <div className="group relative rounded-[20px] p-[1px] overflow-hidden bg-white/[0.04] border border-white/[0.04]">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative h-full bg-[#111] rounded-[19px] flex flex-col overflow-hidden">
        
        <div className="px-6 py-5 border-b border-white/[0.04] flex items-center justify-between">
          <div>
            <div className="font-inter text-[13px] text-[#888] font-medium tracking-wide mb-1">HOT LEADS</div>
            <div className="font-inter text-[11px] text-[#555]">Highest priority</div>
          </div>
          <button
            onClick={() => navigate('/dashboard/leads')}
            className="flex items-center gap-1.5 font-inter text-[11px] text-[#666] hover:text-white transition-colors bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] rounded-full px-3 py-1 cursor-pointer"
          >
            View all <ArrowRight size={11} />
          </button>
        </div>
        
        <div className="divide-y divide-white/[0.03]">
          {hot.map(lead => (
            <div
              key={lead.id}
              onClick={() => navigate(`/dashboard/leads/${lead.id}`)}
              className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer group/item"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                  <span className="font-display text-[#F5A623]" style={{ fontSize: '13px' }}>{lead.name?.[0] || 'A'}</span>
                </div>
                <div className="min-w-0">
                  <div className="font-inter text-[13px] text-white tracking-tight truncate">{lead.name || 'Anonymous'}</div>
                  <div className="font-inter text-[11px] text-[#666] mt-0.5">{lead.type}</div>
                </div>
              </div>
              <div className="font-geist tabular-nums text-[#F5A623]" style={{ fontSize: '18px' }}>
                {lead.score}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

function NeedsReview({ leads, navigate }) {
  const provisional = leads.filter(l => l.score_status === 'provisional' || l.score_status === 'processing')
  const mismatch = leads.filter(l => Array.isArray(l.flags) && l.flags.some(f => (typeof f === 'string' ? f : f.type) === 'mismatch'))

  if (provisional.length === 0 && mismatch.length === 0) return null

  return (
    <div className="rounded-[18px] bg-[#161616] border border-white/[0.06] overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      <div className="px-5 py-4 border-b border-white/[0.05]">
        <div className="font-inter text-[13px] text-[#888] font-medium tracking-wide mb-1 " style={{ fontSize: '15px', letterSpacing: '-0.03em' }}>Needs attention</div>
        <div className="font-inter text-[11px] text-[#444] tracking-[-0.01em]">{provisional.length + mismatch.length} items</div>
      </div>

      {provisional.length > 0 && (
        <div className="px-5 py-3 border-b border-white/[0.04]">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
            <span className="font-inter text-[11px] text-[#F59E0B] tracking-[-0.01em] font-medium">Provisional scores ({provisional.length})</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {provisional.slice(0, 3).map(lead => (
              <div
                key={lead.id}
                onClick={() => navigate(`/dashboard/leads/${lead.id}`)}
                className="flex items-center justify-between py-1 cursor-pointer group"
              >
                <span className="font-inter text-[12px] text-[#666] group-hover:text-white transition-colors tracking-[-0.01em]">{lead.name}</span>
                <span className="font-inter text-[11px] text-[#F59E0B] tabular-nums">{lead.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {mismatch.length > 0 && (
        <div className="px-5 py-3">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
            <span className="font-inter text-[11px] text-[#DC2626] tracking-[-0.01em] font-medium">Mismatch flags ({mismatch.length})</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {mismatch.map(lead => (
              <div
                key={lead.id}
                onClick={() => navigate(`/dashboard/leads/${lead.id}`)}
                className="flex items-center justify-between py-1 cursor-pointer group"
              >
                <span className="font-inter text-[12px] text-[#666] group-hover:text-white transition-colors tracking-[-0.01em]">{lead.name}</span>
                <span className="font-inter text-[11px] text-[#DC2626]">⚠</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TypeSplit({ leads }) {
  const founders = leads.filter(l => l.type === 'founder').length
  const investors = leads.filter(l => l.type === 'investor').length
  const total = leads.length
  const avgScore = Math.round(leads.reduce((s, l) => s + l.score, 0) / total)

  return (
    <div className="group relative rounded-[20px] p-[1px] overflow-hidden bg-white/[0.04] border border-white/[0.04]">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative h-full bg-[#111] rounded-[19px] p-6 flex flex-col justify-between overflow-hidden">
        
        <div className="mb-6">
          <div className="font-inter text-[13px] text-[#888] font-medium tracking-wide mb-1">PIPELINE HEALTH</div>
          <div className="font-inter text-[11px] text-[#555]">Average score out of 100</div>
        </div>

        <div className="flex items-end gap-5 mb-8">
          <div>
            <div className="font-geist tabular-nums text-white leading-none tracking-tight" style={{ fontSize: '48px' }}>{avgScore}</div>
          </div>
          <div className="flex-1 pb-1.5">
            <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${avgScore}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#22C55E]"
                style={{ boxShadow: '0 0 12px rgba(34, 197, 94, 0.4)' }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[14px] bg-[#3B82F6]/[0.05] border border-[#3B82F6]/20 p-3 hover:bg-[#3B82F6]/[0.08] transition-colors">
            <div className="font-geist text-[#3B82F6] tabular-nums leading-none mb-1.5" style={{ fontSize: '24px' }}>{founders}</div>
            <div className="font-inter text-[10px] text-[#3B82F6]/80 uppercase tracking-wider font-medium">Founders</div>
          </div>
          <div className="rounded-[14px] bg-[#22C55E]/[0.05] border border-[#22C55E]/20 p-3 hover:bg-[#22C55E]/[0.08] transition-colors">
            <div className="font-geist text-[#22C55E] tabular-nums leading-none mb-1.5" style={{ fontSize: '24px' }}>{investors}</div>
            <div className="font-inter text-[10px] text-[#22C55E]/80 uppercase tracking-wider font-medium">Investors</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Overview() {
  const navigate = useNavigate()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/leads`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.leads) setLeads(data.leads)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const renderContent = () => {
    if (loading) {
      return <div className="flex items-center justify-center h-64 text-[#555]">Loading...</div>
    }

    const hot = leads.filter(l => l.bucket === 'hot').length
    const provisional = leads.filter(l => l.score_status === 'provisional' || l.score_status === 'processing').length
    const mismatch = leads.filter(l => Array.isArray(l.flags) && l.flags.some(f => (typeof f === 'string' ? f : f.type) === 'mismatch')).length

    return (
      <div className="px-4 md:px-8 py-6 flex flex-col gap-5">
        {/* Stat cards row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total leads" value={leads.length} sub="All time" color="#3B82F6" icon={Users} delay={0.04} />
          <StatCard label="Hot leads" value={hot} sub="Ready to contact" color="#F5A623" icon={Zap} delay={0.08} />
          <StatCard label="Need review" value={provisional} sub="Provisional scores" color="#F59E0B" icon={AlertCircle} delay={0.12} />
          <StatCard label="Mismatch flags" value={mismatch} sub="Require manual check" color="#DC2626" icon={TrendingUp} delay={0.16} />
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-4">
          <TypeSplit leads={leads} />
          <BucketBar leads={leads} />
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
          <RecentHot leads={leads} navigate={navigate} />
          <NeedsReview leads={leads} navigate={navigate} />
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="px-4 md:px-8 pt-8 pb-6 border-b border-white/[0.05]">
        <div className="font-inter text-[11px] text-[#333] tracking-[0.06em] uppercase mb-1">Dashboard</div>
        <h1 className="font-display text-white" style={{ fontSize: '32px', letterSpacing: '-0.045em', lineHeight: 1 }}>Overview</h1>
      </div>
      {renderContent()}
    </DashboardLayout>
  )
}
