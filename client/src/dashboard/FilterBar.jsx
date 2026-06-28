const TYPE_OPTS = ['All', 'Founder', 'Investor']
const BUCKET_OPTS = ['All', 'Hot', 'Good', 'Maybe', 'Low']
const DATE_OPTS = ['All time', 'This week', 'This month']
const SORT_OPTS = [
  { label: 'Date ↓', value: 'date-desc' },
  { label: 'Date ↑', value: 'date-asc' },
  { label: 'Score ↓', value: 'score-desc' },
  { label: 'Score ↑', value: 'score-asc' },
]

const BUCKET_COLOR = { Hot: '#F5A623', Good: '#22C55E', Maybe: '#3B82F6', Low: '#6B7280' }

export function FilterBar({ type, setType, bucket, setBucket, provisional, setProvisional, dateRange, setDateRange, sort, setSort }) {
  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      <SegmentedControl value={type} onChange={setType} options={TYPE_OPTS} />

      <Divider />

      <SegmentedControl
        value={bucket}
        onChange={setBucket}
        options={BUCKET_OPTS}
        colorFn={v => BUCKET_COLOR[v]}
      />

      <Divider />

      <SegmentedControl value={dateRange} onChange={setDateRange} options={DATE_OPTS} />

      <Divider />

      <SelectDropdown value={sort} onChange={setSort} options={SORT_OPTS} />

      <Divider />

      <button
        onClick={() => setProvisional(!provisional)}
        className={`font-inter text-[12px] tracking-[-0.01em] rounded-full px-3 py-1.5 border cursor-pointer transition-all whitespace-nowrap ${
          provisional
            ? 'bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B]'
            : 'bg-transparent border-white/[0.08] text-[#555] hover:text-[#999]'
        }`}
      >
        ⏳ Needs review
      </button>
    </div>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-white/[0.06] shrink-0" />
}

function SegmentedControl({ value, onChange, options, colorFn }) {
  return (
    <div className="flex items-center gap-0.5 bg-[#111] rounded-full p-0.5 border border-white/[0.06]">
      {options.map(opt => {
        const active = value === opt
        const color = colorFn ? colorFn(opt) : null
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`font-inter text-[12px] tracking-[-0.01em] rounded-full px-3 py-1 cursor-pointer border-0 transition-all whitespace-nowrap ${
              active ? 'bg-[#1E1E1E] shadow-sm' : 'bg-transparent hover:text-[#999]'
            }`}
            style={{ color: active && color ? color : active ? '#FFFFFF' : '#555' }}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function SelectDropdown({ value, onChange, options }) {
  const selected = options.find(o => o.value === value) || options[0]
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="font-inter text-[12px] tracking-[-0.01em] text-[#999] bg-[#111] border border-white/[0.06] rounded-full px-3 py-1.5 cursor-pointer outline-none appearance-none pr-7"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23555' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
      >
        {options.map(o => (
          <option key={o.value} value={o.value} style={{ backgroundColor: '#111', color: '#999' }}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
