import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BUCKET_COLOR } from '../constants'
import { StatusBadge, FlagChip } from './StatusBadge'

function BucketPill({ bucket, status }) {
  const isProcessing = status === 'processing';
  const displayBucket = isProcessing ? 'PENDING' : bucket;
  const color = BUCKET_COLOR[isProcessing ? 'maybe' : bucket] || BUCKET_COLOR['maybe']
  return (
    <span
      className="inline-flex items-center gap-1 font-inter text-[10px] font-medium tracking-[0.02em] uppercase rounded-full px-2 py-0.5"
      style={{
        backgroundColor: `${color}12`,
        border: `1px solid ${color}30`,
        color,
      }}
    >
      {displayBucket}
    </span>
  )
}

export function LeadsTable({ leads, loading }) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="font-inter text-[13px] text-[#555] tracking-[-0.01em]">Loading...</span>
      </div>
    )
  }

  if (leads.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="font-inter text-[13px] text-[#333] tracking-[-0.01em]">No leads match the current filters.</span>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {['Name', 'Type', 'Score', 'Bucket', 'Status', 'Flags', 'Date'].map(col => (
              <th
                key={col}
                className="font-inter text-[10px] text-[#555] tracking-widest uppercase text-left px-5 py-3.5 font-medium whitespace-nowrap bg-[#0A0A0A]/80 backdrop-blur-sm sticky top-0"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, i) => (
              <motion.tr
                key={lead.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: i * 0.02 }}
                onClick={() => navigate(`/dashboard/leads/${lead.id}`)}
                className="border-b border-white/[0.03] cursor-pointer group hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <span className="font-display text-[#888] group-hover:text-white transition-colors" style={{ fontSize: '12px' }}>{lead.name?.[0] || 'A'}</span>
                    </div>
                    <span className="font-inter text-[13px] text-white tracking-tight">{lead.name || 'Anonymous'}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-inter text-[12px] text-[#666] uppercase tracking-wider">{lead.type}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className="font-geist tabular-nums"
                    style={{ fontSize: '22px', letterSpacing: '-0.04em', color: BUCKET_COLOR[lead.score_status === 'processing' ? 'maybe' : lead.bucket], lineHeight: 1 }}
                  >
                    {lead.score_status === 'processing' ? '-' : lead.score}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <BucketPill bucket={lead.bucket} status={lead.score_status} />
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={lead.score_status} />
                </td>
                <td className="px-5 py-3.5">
                  <FlagChip flags={lead.flags || []} />
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-inter text-[12px] text-[#555] tracking-tight tabular-nums">
                    {new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </td>
              </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
