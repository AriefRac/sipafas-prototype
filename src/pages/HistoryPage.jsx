import { useState } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import ReportCard, { ReportCardSkeletonList } from '../components/ReportCard'
import { Bone } from '../components/Skeleton'
import SkeletonSwap, { useSimulatedLoading } from '../components/SkeletonSwap'
import { useReports } from '../context/ReportContext'
import { STATUSES } from '../data/seed'
import { cn } from '../lib/cn'

const FILTERS = ['Semua', ...STATUSES]

function HistoryContent() {
  const { reports } = useReports()
  const [filter, setFilter] = useState('Semua')
  const count = (f) => (f === 'Semua' ? reports.length : reports.filter((r) => r.status === f).length)
  const shown = filter === 'Semua' ? reports : reports.filter((r) => r.status === filter)

  return (
    <>
      {/* Mobile: filter digeser horizontal; pudar di tepi kanan menandakan masih ada pilihan lain */}
      <div className="relative -mx-4 mt-4 lg:mx-0">
      <div
        role="group"
        aria-label="Filter status"
        className="flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:flex-wrap lg:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {FILTERS.map((f) => {
          const active = f === filter
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={(e) => {
                setFilter(f)
                e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
              }}
              className={cn(
                'inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors duration-150',
                active ? 'border-accent bg-accent text-white' : 'border-line bg-surface text-ink hover:bg-surface2',
              )}
            >
              {f}
              <span className={cn('rounded-full px-1.5 text-xs', active ? 'bg-white/20' : 'bg-surface2 text-muted')}>{count(f)}</span>
            </button>
          )
        })}
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-bg to-transparent lg:hidden" />
      </div>

      <p className="sr-only" role="status">
        Menampilkan {shown.length} laporan{filter !== 'Semua' ? ` berstatus ${filter}` : ''}.
      </p>

      {shown.length === 0 ? (
        <Card className="mt-4 p-8 text-center">
          <p className="text-sm text-muted">Belum ada laporan dengan status {filter}.</p>
          <Button variant="secondary" className="mt-4" onClick={() => setFilter('Semua')}>
            Tampilkan semua
          </Button>
        </Card>
      ) : (
        <ul className="mt-4 grid gap-3 lg:grid-cols-2">
          {shown.map((r) => (
            <li key={r.id}>
              <ReportCard report={r} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function HistorySkeleton() {
  return (
    <>
      <div className="mt-4 flex gap-2 overflow-hidden">
        {[0, 1, 2, 3, 4].map((i) => (
          <Bone key={i} className="h-11 w-28 rounded-full" />
        ))}
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <ReportCardSkeletonList count={2} />
        <ReportCardSkeletonList count={2} />
      </div>
    </>
  )
}

export default function HistoryPage() {
  const loading = useSimulatedLoading()
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">Riwayat Laporan</h1>
      <p className="mt-1 text-sm text-muted">Semua laporan Anda, terbaru di atas.</p>
      <SkeletonSwap loading={loading} skeleton={<HistorySkeleton />}>
        <HistoryContent />
      </SkeletonSwap>
    </div>
  )
}
