import { CircleAlert } from 'lucide-react'

export const inputClass =
  'w-full min-h-[44px] rounded-ctl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted transition-colors duration-150 hover:border-accent/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 aria-[invalid=true]:border-[#D92D20] dark:aria-[invalid=true]:border-[#F97066]'

export function FieldError({ id, children }) {
  if (!children) return null
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-[#B42318] dark:text-[#FDA29B]">
      <CircleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
      {children}
    </p>
  )
}

/** Label + kontrol + pesan kesalahan. Kontrol diberi id yang sama dengan `id`. */
export default function FormField({ id, label, required, hint, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {required && <span className="text-muted font-normal"> (wajib)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mb-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {children}
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  )
}
