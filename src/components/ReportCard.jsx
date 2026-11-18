import { CalendarDays, MapPin } from 'lucide-react'
import { formatDate } from '../lib/format'
import Card from './Card'
import { Bone } from './Skeleton'
import StatusChip from './StatusChip'

/** Kartu laporan yang bisa diklik (dipakai di Beranda versi mobile dan Riwayat). */
export default function ReportCard({ report }) {
  return (
    <Card to={`/laporan/${report.id}`} className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted">{report.id}</p>
          <p className="mt-0.5 font-semibold text-ink">{report.category}</p>
        </div>
        <StatusChip status={report.status} />
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-muted">{report.description}</p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {report.room}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          {formatDate(report.createdAt)}
        </span>
      </div>
    </Card>
  )
}

export function ReportCardSkeletonList({ count = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-card border border-line bg-surface p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Bone className="h-3 w-24" />
              <Bone className="h-4 w-32" />
            </div>
            <Bone className="h-6 w-24 rounded-full" />
          </div>
          <Bone className="mt-3 h-3 w-full" />
          <Bone className="mt-2 h-3 w-2/3" />
          <div className="mt-3 flex gap-4">
            <Bone className="h-3 w-28" />
            <Bone className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}
