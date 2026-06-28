export function Transcript({ transcript }) {
  const safeTranscript = Array.isArray(transcript) ? transcript : []
  return (
    <div className="rounded-[20px] bg-[#161616] border border-white/[0.06] overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between">
        <span className="font-display text-white text-[14px]" style={{ letterSpacing: '-0.03em' }}>Transcript</span>
        <span className="font-inter text-[11px] text-[#444] tracking-[-0.01em]">{safeTranscript.length} turns</span>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {safeTranscript.map((turn, i) => {
          const q = turn.q || turn.questionId
          const a = turn.a || turn.value || (turn.values && JSON.stringify(turn.values)) || "—"
          return (
            <div key={i} className="px-5 py-4 flex gap-4">
              <span className="font-inter text-[11px] text-[#333] tabular-nums tracking-[-0.01em] mt-0.5 shrink-0 w-5 text-right">{i + 1}</span>
              <div className="flex flex-col gap-1.5 min-w-0">
                <p className="font-inter text-[12px] text-[#555] leading-relaxed tracking-[-0.01em] m-0">{q}</p>
                <p className="font-inter text-[13px] text-white leading-relaxed tracking-[-0.01em] m-0">{a}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
