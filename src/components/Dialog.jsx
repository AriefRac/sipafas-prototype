import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../lib/cn'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Dialog modal: Esc menutup, fokus masuk ke dialog, terkunci di dalam,
 * lalu kembali ke elemen pemicu saat ditutup.
 * fullscreenMobile: tampil layar penuh di bawah 1024px.
 */
export default function Dialog({ open, onClose, labelledBy, describedBy, initialFocusRef, fullscreenMobile = false, className, children }) {
  const panelRef = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return undefined
    const previouslyFocused = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // DOM dialog sudah ter-render saat efek berjalan, jadi fokus bisa dipindah langsung.
    const target = initialFocusRef?.current || panelRef.current?.querySelector(FOCUSABLE) || panelRef.current
    target?.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCloseRef.current?.()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const items = [...panelRef.current.querySelectorAll(FOCUSABLE)]
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
      if (previouslyFocused && document.contains(previouslyFocused)) previouslyFocused.focus()
    }
  }, [open, initialFocusRef])

  if (!open) return null

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-[#0E0D17]/50 p-4',
        fullscreenMobile && 'max-lg:items-stretch max-lg:p-0',
      )}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={cn(
          'w-full max-w-md overflow-y-auto rounded-card border border-line bg-surface p-6 shadow-xl outline-none',
          'max-h-[calc(100dvh-2rem)]',
          fullscreenMobile && 'max-lg:max-h-none max-lg:max-w-none max-lg:rounded-none max-lg:border-0',
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
