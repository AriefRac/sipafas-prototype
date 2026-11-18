import { useRef } from 'react'
import { flushSync } from 'react-dom'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { cn } from '../lib/cn'

const DURATION = 450

/**
 * Tombol ganti tema dengan animasi lingkaran membesar dari posisi tombol,
 * diadaptasi dari AnimatedThemeToggler (Magic UI) memakai View Transitions API.
 * Tanpa dukungan browser atau dengan reduced motion: tema langsung berganti.
 */
export default function ThemeToggle({ className }) {
  const { theme, setTheme } = useTheme()
  const ref = useRef(null)
  const isDark = theme === 'dark'

  const toggle = () => {
    const next = isDark ? 'light' : 'dark'
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (typeof document.startViewTransition !== 'function' || reduce || !ref.current) {
      setTheme(next)
      return
    }

    let applied = false
    const apply = () => {
      if (applied) return
      applied = true
      flushSync(() => setTheme(next))
    }

    // Selama ganti tema, kerangka (navbar/header/sidebar) tidak punya lapisan transisi sendiri
    // supaya ikut terbuka bersama lingkaran.
    const root = document.documentElement
    root.classList.add('theme-switching')
    let transition
    try {
      transition = document.startViewTransition(apply)
    } catch {
      root.classList.remove('theme-switching')
      apply()
      return
    }
    transition.finished
      .catch(() => {})
      .finally(() => root.classList.remove('theme-switching'))
    // Pengaman jika browser menunda transisi (mis. tab di latar belakang)
    const safety = setTimeout(() => {
      if (!applied) {
        transition.skipTransition?.()
        apply()
      }
    }, 400)

    transition.ready
      .then(() => {
        clearTimeout(safety)
        const { top, left, width, height } = ref.current.getBoundingClientRect()
        const x = left + width / 2
        const y = top + height / 2
        const maxRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`] },
          { duration: DURATION, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' },
        )
      })
      .catch(() => {})
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
      title={isDark ? 'Mode terang' : 'Mode gelap'}
      className={cn(
        'grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-ink transition-colors duration-150 hover:bg-surface2',
        className,
      )}
    >
      {isDark ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
    </button>
  )
}
