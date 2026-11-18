import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { domAnimation, LazyMotion } from 'motion/react'

const LOAD_MS = 700
const WIPE_MS = 600
const VT_NAME = 'page-content'

/** Simulasi memuat data: true selama ±700ms setelah halaman dibuka. */
export function useSimulatedLoading(ms = LOAD_MS) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms)
    return () => clearTimeout(t)
  }, [ms])
  return loading
}

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Mengganti skeleton dengan konten memakai efek wipe (meniru transisi
 * AnimateView di referensi). AnimateView dari motion membutuhkan React 19.3,
 * jadi di sini dipakai View Transitions API langsung. Browser tanpa dukungan
 * atau dengan reduced motion: konten langsung tampil.
 */
export default function SkeletonSwap({ loading, skeleton, children }) {
  const [showContent, setShowContent] = useState(!loading)
  const ref = useRef(null)

  useEffect(() => {
    if (loading) {
      setShowContent(false)
      return
    }
    if (typeof document.startViewTransition !== 'function' || prefersReducedMotion() || !ref.current) {
      setShowContent(true)
      return
    }
    const el = ref.current
    el.style.viewTransitionName = VT_NAME
    // Pengaman: jika browser menunda transisi (mis. tab di latar belakang), konten tetap tampil.
    let transition
    const safety = setTimeout(() => {
      transition?.skipTransition?.()
      el.style.viewTransitionName = ''
      setShowContent(true)
    }, 1000)
    try {
      transition = document.startViewTransition(() => {
        clearTimeout(safety)
        flushSync(() => setShowContent(true))
      })
    } catch {
      clearTimeout(safety)
      el.style.viewTransitionName = ''
      setShowContent(true)
      return undefined
    }
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { '--wipe': ['100%', '-100%'] },
          { duration: WIPE_MS, easing: 'ease-in-out', pseudoElement: `::view-transition-old(${VT_NAME})` },
        )
      })
      .catch(() => {})
    transition.finished
      .catch(() => {})
      .finally(() => {
        el.style.viewTransitionName = ''
      })
    return () => clearTimeout(safety)
  }, [loading])

  return (
    <div ref={ref} aria-busy={!showContent}>
      {showContent ? (
        children
      ) : (
        <>
          <span className="sr-only" role="status">
            Memuat…
          </span>
          <LazyMotion features={domAnimation} strict>
            <div aria-hidden="true">{skeleton}</div>
          </LazyMotion>
        </>
      )}
    </div>
  )
}
