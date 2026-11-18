import { domAnimation, LazyMotion, m, useReducedMotion } from 'motion/react'

/** Animasi centang sukses: lingkaran memantul, centang tergambar, riak cincin sekali. */
export default function SuccessCheck() {
  const reduce = useReducedMotion()

  return (
    <LazyMotion features={domAnimation} strict>
    <div className="relative mx-auto grid h-28 w-28 place-items-center" aria-hidden="true">
      {!reduce &&
        [0, 1].map((i) => (
          <m.span
            key={i}
            className="absolute inset-2 rounded-full border-2 border-accent"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: [1, 1.8], opacity: [0.45, 0] }}
            transition={{ delay: 0.35 + i * 0.18, duration: 0.9, ease: 'easeOut' }}
          />
        ))}
      <m.div
        className="grid h-24 w-24 place-items-center rounded-full bg-accent shadow-[0_12px_30px_rgb(109_91_246/0.35)]"
        initial={reduce ? false : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 14 }}
      >
        <svg viewBox="0 0 52 52" className="h-12 w-12">
          <m.path
            d="M14 27.5 L22.5 36 L39 18"
            fill="none"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.3, duration: 0.35, ease: 'easeOut' }}
          />
        </svg>
      </m.div>
    </div>
    </LazyMotion>
  )
}
