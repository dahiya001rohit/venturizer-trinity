export function StatusBadge({ status }) {
  if (status === 'final') return null
  if (status === 'processing') {
    return (
      <span className="inline-flex items-center gap-1 font-inter text-[10px] font-medium tracking-[-0.01em] rounded-[6px] px-1.5 py-0.5 bg-[#3B82F6]/10 border border-[#3B82F6]/25 text-[#3B82F6] whitespace-nowrap animate-pulse">
        ⏳ Processing
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 font-inter text-[10px] font-medium tracking-[-0.01em] rounded-[6px] px-1.5 py-0.5 bg-[#F59E0B]/10 border border-[#F59E0B]/25 text-[#F59E0B] whitespace-nowrap">
      ⏳ Provisional
    </span>
  )
}

export function FlagChip({ flags }) {
  if (!flags || !Array.isArray(flags)) return null
  
  const isHumanVerified = flags.some(f => (typeof f === 'string' ? f : f.type) === 'human_verified')
  if (isHumanVerified) {
    return (
      <span className="inline-flex items-center gap-1 font-inter text-[10px] font-medium tracking-[-0.01em] rounded-[6px] px-1.5 py-0.5 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] whitespace-nowrap">
        ✔ Human Verified
      </span>
    )
  }

  const isMismatch = flags.some(f => (typeof f === 'string' ? f : f.type) === 'mismatch')
  if (isMismatch) {
    return (
      <span className="inline-flex items-center gap-1 font-inter text-[10px] font-medium tracking-[-0.01em] rounded-[6px] px-1.5 py-0.5 bg-[#DC2626]/10 border border-[#DC2626]/30 text-[#DC2626] whitespace-nowrap">
        ⚠ Mismatch
      </span>
    )
  }
  
  return null
}
