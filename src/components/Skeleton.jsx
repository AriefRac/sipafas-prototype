import { m, useReducedMotion } from 'motion/react'
import { cn } from '../lib/cn'

// Diadaptasi dari referensi SkeletonShimmer (motion), memakai token warna proyek.
// Memakai komponen `m` yang ringan; fitur animasinya disediakan <LazyMotion> di SkeletonSwap.
const SHIMMER_GRADIENT = 'linear-gradient(90deg, var(--bone-base) 25%, var(--bone-highlight) 50%, var(--bone-base) 75%)'
const shimmerAnimate = { backgroundPosition: ['-200% 0', '200% 0'] }
const DURATION = 1.5

function useShimmer() {
  const reduce = useReducedMotion()
  return reduce
    ? {}
    : { animate: shimmerAnimate, transition: { duration: DURATION, ease: 'easeInOut', repeat: Infinity } }
}

/** Kotak/lingkaran kosong dengan ukuran tertentu. */
export function Bone({ className, style }) {
  const anim = useShimmer()
  return (
    <m.div
      {...anim}
      className={cn('shrink-0 rounded-md', className)}
      style={{ background: SHIMMER_GRADIENT, backgroundSize: '200% 100%', ...style }}
    />
  )
}

/** Membungkus elemen asli yang dibuat tak terlihat agar ukuran skeleton persis sama. */
export function Shimmer({ className, children }) {
  const anim = useShimmer()
  return (
    <m.div
      {...anim}
      className={cn('overflow-hidden rounded-md', className)}
      style={{ background: SHIMMER_GRADIENT, backgroundSize: '200% 100%' }}
    >
      <div className="invisible">{children}</div>
    </m.div>
  )
}
