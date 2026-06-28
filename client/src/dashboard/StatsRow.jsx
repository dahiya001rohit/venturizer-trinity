import { BUCKET_COLOR } from '../constants'

export function StatsRow({ leads }) {
  const total = leads.length
  const hot = leads.filter(l => l.bucket === 'hot').length
  const needsReview = leads.filter(l => l.score_status === 'provisional').length

  return (
    <div className="flex items-center gap-6 flex-wrap">
      <Stat label="Total leads" value={total} />
      <div className="w-px h-6 bg-white/[0.06]" />
      <Stat label="Hot" value={hot} color={BUCKET_COLOR.hot} />
      <div className="w-px h-6 bg-white/[0.06]" />
      {needsReview > 0 && (
        <Stat label="Need review" value={needsReview} color="#F59E0B" />
      )}
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div className="flex items-baseline gap-2">
      <span
        className="font-geist tabular-nums"
        style={{ fontSize: '22px', letterSpacing: '-0.04em', color: color || '#FFFFFF', lineHeight: 1 }}
      >
        {value}
      </span>
      <span className="font-inter text-[12px] text-[#555] tracking-[-0.01em]">{label}</span>
    </div>
  )
}
