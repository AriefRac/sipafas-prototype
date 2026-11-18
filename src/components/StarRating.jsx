import { Star } from 'lucide-react'
import { cn } from '../lib/cn'

/**
 * Pilihan bintang 1–5 memakai radio asli (bisa dipakai dengan panah keyboard).
 * readOnly: hanya menampilkan nilai.
 */
export default function StarRating({ value, onChange, readOnly = false, name = 'rating', describedBy, invalid }) {
  if (readOnly) {
    return (
      <div className="flex items-center gap-1" role="img" aria-label={`${value} dari 5 bintang`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            aria-hidden="true"
            className={cn('h-5 w-5', n <= value ? 'fill-[#F5A524] text-[#F5A524]' : 'text-line')}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      role="radiogroup"
      aria-label="Jumlah bintang"
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      className="flex items-center gap-1"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <label
          key={n}
          className="group relative grid h-11 w-11 cursor-pointer place-items-center rounded-ctl transition-colors duration-150 hover:bg-surface2 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[var(--focus)]"
        >
          <input
            type="radio"
            name={name}
            value={n}
            checked={value === n}
            onChange={() => onChange(n)}
            className="sr-only"
            aria-label={`${n} dari 5 bintang`}
          />
          <Star
            aria-hidden="true"
            className={cn(
              'h-7 w-7 transition-colors duration-150',
              n <= value ? 'fill-[#F5A524] text-[#F5A524]' : 'text-muted',
            )}
          />
        </label>
      ))}
    </div>
  )
}
