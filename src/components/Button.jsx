import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../lib/cn'

/**
 * Satu-satunya komponen tombol.
 * variant: 'primary' (utama) | 'secondary' (sekunder)
 * onAccent: versi untuk ditaruh di atas latar ungu (banner)
 * danger: nuansa merah untuk aksi tegas (Keluar, Batalkan). Utama = merah solid, sekunder = garis merah.
 * to: jika diisi, dirender sebagai tautan navigasi dengan gaya tombol
 */
const Button = forwardRef(function Button(
  { variant = 'primary', onAccent = false, danger = false, fullWidth = false, icon: Icon, to, className, children, type = 'button', ...props },
  ref,
) {
  const classes = cn(
    'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-ctl px-5 text-sm font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60',
    fullWidth && 'w-full',
    variant === 'primary' &&
      !onAccent &&
      !danger &&
      'bg-accent text-white hover:bg-accent-hover active:brightness-95',
    variant === 'primary' && danger && 'bg-[#D92D20] text-white hover:bg-[#B42318] active:brightness-95',
    variant === 'primary' && onAccent && 'bg-white text-[#4B38D6] hover:bg-[#F1EEFF] active:bg-[#E6E0FF]',
    variant === 'secondary' &&
      !danger &&
      'border border-line bg-surface text-ink hover:bg-surface2 active:bg-surface2',
    variant === 'secondary' &&
      danger &&
      'border border-[#F3C5C5] bg-surface text-[#B42318] hover:bg-[#FEF3F2] dark:border-[#5A2A2A] dark:text-[#FDA29B] dark:hover:bg-[#2A1618]',
    className,
  )

  const content = (
    <>
      {Icon && <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />}
      {children}
    </>
  )

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }

  return (
    <button ref={ref} type={type} className={classes} {...props}>
      {content}
    </button>
  )
})

export default Button
