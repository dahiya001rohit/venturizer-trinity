import { useState, useMemo, useEffect } from 'react'
import { API_URL } from '../config'
import { DashboardLayout } from './DashboardLayout'
import { StatsRow } from './StatsRow'
import { FilterBar } from './FilterBar'
import { LeadsTable } from './LeadsTable'

function parseDate(str) {
  return new Date(str).getTime()
}

function weekAgo() {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  return d.getTime()
}

function monthAgo() {
  const d = new Date()
  d.setMonth(d.getMonth() - 1)
  return d.getTime()
}

export function LeadsList() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState('All')
  const [bucket, setBucket] = useState('All')
  const [provisional, setProvisional] = useState(false)
  const [dateRange, setDateRange] = useState('All time')
  const [sort, setSort] = useState('date-desc')

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

  const filtered = useMemo(() => {
    let list = leads.filter(l => {
      if (type !== 'All' && l.type !== type.toLowerCase()) return false
      if (bucket !== 'All' && l.bucket !== bucket.toLowerCase()) return false
      if (provisional && l.score_status !== 'provisional') return false
      if (dateRange === 'This week' && parseDate(l.created_at) < weekAgo()) return false
      if (dateRange === 'This month' && parseDate(l.created_at) < monthAgo()) return false
      return true
    })

    list = [...list].sort((a, b) => {
      if (sort === 'date-desc') return parseDate(b.created_at) - parseDate(a.created_at)
      if (sort === 'date-asc') return parseDate(a.created_at) - parseDate(b.created_at)
      if (sort === 'score-desc') return b.score - a.score
      if (sort === 'score-asc') return a.score - b.score
      return 0
    })

    return list
  }, [leads, type, bucket, provisional, dateRange, sort])

  return (
    <DashboardLayout>
      <div className="px-4 md:px-8 pt-8 pb-5 border-b border-white/[0.06]">
        <div className="mb-1">
          <span className="font-inter text-[11px] text-[#333] tracking-[0.06em] uppercase">Leads</span>
        </div>
        <h1 className="font-display text-white mb-4" style={{ fontSize: '32px', letterSpacing: '-0.045em', lineHeight: 1 }}>
          All leads
        </h1>
        <StatsRow leads={leads} />
      </div>

      <div className="px-4 md:px-8 py-3.5 border-b border-white/[0.05]">
        <FilterBar
          type={type} setType={setType}
          bucket={bucket} setBucket={setBucket}
          provisional={provisional} setProvisional={setProvisional}
          dateRange={dateRange} setDateRange={setDateRange}
          sort={sort} setSort={setSort}
        />
      </div>

      <LeadsTable leads={filtered} loading={loading} />
    </DashboardLayout>
  )
}
