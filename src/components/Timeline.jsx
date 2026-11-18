import { formatDateTime } from '../lib/format'
import { cn } from '../lib/cn'
import StatusChip from './StatusChip'

export default function Timeline({ items }) {
  return (
    <ol className="relative">
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <li key={`${item.status}-${i}`} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && <span className="absolute left-[9px] top-6 h-[calc(100%-12px)] w-0.5 bg-line" aria-hidden="true" />}
            <span
              aria-hidden="true"
              className={cn(
                'relative mt-1 h-5 w-5 shrink-0 rounded-full border-4',
                isLast ? 'border-accent bg-surface' : 'border-line bg-surface',
              )}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <StatusChip status={item.status} />
                {isLast && <span className="text-xs font-semibold text-accent-text">Status saat ini</span>}
              </div>
              <p className="mt-1.5 text-sm text-ink">{item.note}</p>
              <p className="mt-0.5 text-xs text-muted">
                <time dateTime={item.date}>{formatDateTime(item.date)}</time>
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
