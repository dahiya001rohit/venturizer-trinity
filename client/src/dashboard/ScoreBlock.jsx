import { BUCKET_COLOR } from '../data/mockLeads'
import { StatusBadge, FlagChip } from './StatusBadge'

export function ScoreBlock({ lead }) {
  const color = BUCKET_COLOR[lead.bucket]

  return (
    <div className="flex items-start gap-6 flex-wrap">
      <div>
        <div
          className="font-display tabular-nums leading-none mb-2"
          style={{ fontSize: 'clamp(56px, 8vw, 80px)', letterSpacing: '-0.05em', color }}
        >
          {lead.score_status === 'processing' ? '-' : lead.score}
        </div>
        <div className="font-inter text-[11px] text-[#444] tracking-[-0.01em]">
          {lead.score_status === 'processing' ? 'Calculating...' : 'out of 100'}
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <span
          className="inline-flex items-center gap-1.5 font-inter text-[12px] font-medium tracking-[0.02em] uppercase rounded-full px-3 py-1"
          style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30`, color }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          {lead.score_status === 'processing' ? 'PENDING' : lead.bucket}
        </span>
        <StatusBadge status={lead.score_status} />
        <FlagChip flags={lead.flags || []} />
      </div>
    </div>
  )
}
