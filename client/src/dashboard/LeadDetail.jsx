import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Phone, ExternalLink, Trash2 } from 'lucide-react'
import { DashboardLayout } from './DashboardLayout'
import { ScoreBlock } from './ScoreBlock'
import { ScoreBreakdown } from './ScoreBreakdown'
import { Transcript } from './Transcript'

export function LeadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/leads/${id}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.lead) setLead(data.lead)
        setLoading(false)
      })
      .catch(console.error)
  }, [id])

  const deleteLead = async () => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return
    try {
      const res = await fetch(`${API_URL}/api/leads/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (res.ok) {
        navigate('/dashboard/leads')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const rescoreLead = async () => {
    setLead(prev => ({ ...prev, score_status: 'processing' }))
    try {
      await fetch(`${API_URL}/api/leads/${id}/rescore`, {
        method: 'POST',
        credentials: 'include'
      })
      // The background worker will eventually finish, we could poll or just let the user refresh.
      // For now, setting it to processing visually is enough.
    } catch (e) {
      console.error(e)
    }
  }

  const markHumanVerified = async () => {
    try {
      const newFlags = [...(lead.flags || [])]
      // Don't remove mismatch, just add human_verified so it shows the green badge
      if (!newFlags.some(f => (typeof f === 'string' ? f : f.type) === 'human_verified')) {
        newFlags.push({ type: 'human_verified' })
      }
      
      const res = await fetch(`${API_URL}/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ flags: newFlags })
      })
      
      if (res.ok) {
        const data = await res.json()
        setLead(data.lead)
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen text-[#555]">Loading...</div>
      </DashboardLayout>
    )
  }

  if (!lead) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <span className="font-inter text-[13px] text-[#333]">Lead not found.</span>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout breadcrumb={lead.name}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="px-8 py-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 font-inter text-[12px] text-[#555] hover:text-[#999] transition-colors bg-transparent border-0 cursor-pointer p-0"
          >
            <ArrowLeft size={13} />
            Back to leads
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={rescoreLead}
              disabled={lead.score_status === 'processing'}
              className="flex items-center gap-1.5 font-inter text-[12px] text-[#555] hover:text-[#999] transition-colors bg-transparent border-0 cursor-pointer p-0 disabled:opacity-50"
            >
              Re-score with AI
            </button>
            <button
              onClick={deleteLead}
              className="flex items-center gap-1.5 font-inter text-[12px] text-[#555] hover:text-[#DC2626] transition-colors bg-transparent border-0 cursor-pointer p-0"
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="font-display text-white mb-1" style={{ fontSize: '28px', letterSpacing: '-0.045em' }}>{lead.name}</h1>
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <span className="font-inter text-[12px] text-[#555] tracking-[-0.01em]">{lead.type}</span>
            <span className="font-inter text-[11px] text-[#333]">·</span>
            <span className="font-inter text-[12px] text-[#444] tabular-nums tracking-[-0.01em]">
              {new Date(lead.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <ContactLink icon={Mail} label={lead.email} href={`mailto:${lead.email}`} />
            <ContactLink icon={Phone} label={lead.phone} href={`tel:${lead.phone}`} />
            <ContactLink icon={ExternalLink} label="LinkedIn" href={lead.linkedin ? `https://${lead.linkedin}` : '#'} />
          </div>
        </div>

        {/* Alerts */}
        {(lead.score_status === 'provisional' || lead.score_status === 'processing' || (Array.isArray(lead.flags) && lead.flags.some(f => (typeof f === 'string' ? f : f.type) === 'mismatch'))) && (
          <div className="flex flex-col gap-2 mb-5">
            {lead.score_status === 'provisional' && (
              <div
                className="rounded-[14px] bg-[#161616] border border-white/[0.06] px-4 py-3 flex gap-3 items-start"
                style={{ borderLeft: '3px solid #F59E0B' }}
              >
                <span className="font-inter text-[11px] font-medium text-[#F59E0B] uppercase tracking-[0.05em] shrink-0 mt-px">Provisional</span>
                <p className="font-inter text-[12px] text-[#666] leading-relaxed tracking-[-0.01em] m-0">
                  Scored without AI review — will update automatically once the service is available.
                </p>
              </div>
            )}
            {lead.score_status === 'processing' && (
              <div
                className="rounded-[14px] bg-[#161616] border border-white/[0.06] px-4 py-3 flex gap-3 items-start animate-pulse"
                style={{ borderLeft: '3px solid #3B82F6' }}
              >
                <span className="font-inter text-[11px] font-medium text-[#3B82F6] uppercase tracking-[0.05em] shrink-0 mt-px">Processing</span>
                <p className="font-inter text-[12px] text-[#666] leading-relaxed tracking-[-0.01em] m-0">
                  Calculating score using AI... this usually takes about 10-30 seconds.
                </p>
              </div>
            )}
            {Array.isArray(lead.flags) && lead.flags.some(f => (typeof f === 'string' ? f : f.type) === 'mismatch') && (
              <div
                className="rounded-[14px] bg-[#161616] border border-white/[0.06] px-4 py-3 flex gap-3 items-start justify-between"
                style={{ borderLeft: '3px solid #DC2626' }}
              >
                <div className="flex gap-3 items-start">
                  <span className="font-inter text-[11px] font-medium text-[#DC2626] uppercase tracking-[0.05em] shrink-0 mt-px">⚠ Mismatch</span>
                  <p className="font-inter text-[12px] text-[#666] leading-relaxed tracking-[-0.01em] m-0">
                    Self-reported answers contain signals inconsistent with stated profile. Review transcript carefully.
                  </p>
                </div>
                {!lead.flags.some(f => (typeof f === 'string' ? f : f.type) === 'human_verified') && (
                  <button 
                    onClick={markHumanVerified}
                    className="font-inter text-[11px] text-white bg-[#DC2626]/20 hover:bg-[#DC2626]/30 px-3 py-1.5 rounded-full border border-[#DC2626]/40 cursor-pointer transition-colors whitespace-nowrap"
                  >
                    Mark Verified
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-4 items-start">
          {/* Left col — score + breakdown stacked */}
          <div className="flex flex-col gap-4">
            <div className="rounded-[20px] bg-[#161616] border border-white/[0.06] p-5 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
              <ScoreBlock lead={lead} />
            </div>
            <ScoreBreakdown breakdown={lead.breakdown} />
          </div>

          {/* Right col — transcript takes all remaining height */}
          <Transcript transcript={lead.answers} />
        </div>
      </motion.div>
    </DashboardLayout>
  )
}

function ContactLink({ icon: Icon, label, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 font-inter text-[12px] text-[#444] hover:text-[#3B82F6] no-underline transition-colors tracking-[-0.01em]"
    >
      <Icon size={12} />
      {label}
    </a>
  )
}
