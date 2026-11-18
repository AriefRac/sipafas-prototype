import { Link } from 'react-router-dom'
import { cn } from '../lib/cn'

/**
 * Satu-satunya komponen kartu.
 * Tanpa `to`: kartu informasi biasa (tidak ada efek hover, tidak bisa diklik).
 * Dengan `to`: seluruh kartu menjadi tautan (ada hover dan fokus).
 */
export default function Card({ to, as: Tag = 'div', className, children, ...props }) {
  const base = 'rounded-card border border-line bg-surface shadow-soft'
  if (to) {
    return (
      <Link
        to={to}
        className={cn(base, 'block transition-colors duration-150 hover:border-accent/40 hover:bg-surface2', className)}
        {...props}
      >
        {children}
      </Link>
    )
  }
  return (
    <Tag className={cn(base, className)} {...props}>
      {children}
    </Tag>
  )
}
