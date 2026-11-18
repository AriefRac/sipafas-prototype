import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useReports } from '../context/ReportContext'
import Button from './Button'
import Dialog from './Dialog'

/**
 * Pemicu Keluar + dialog konfirmasi (supaya tidak keluar karena salah ketuk,
 * terutama dari navigasi bawah). Tampilan pemicu diatur lewat `className`/`children`.
 */
export default function LogoutButton({ asButton = false, className, children, ...props }) {
  const { logout } = useReports()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const cancelRef = useRef(null)

  const confirm = () => {
    setOpen(false)
    logout()
    navigate('/masuk', { replace: true })
  }

  return (
    <>
      {asButton ? (
        // Memakai komponen Button (utama + merah) agar konsisten
        <Button danger fullWidth icon={LogOut} className={className} onClick={() => setOpen(true)} {...props}>
          Keluar
        </Button>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className={className} {...props}>
          {children}
        </button>
      )}
      <Dialog open={open} onClose={() => setOpen(false)} labelledBy="logout-title" describedBy="logout-desc" initialFocusRef={cancelRef}>
        <span className="grid h-12 w-12 place-items-center rounded-full bg-[#FEE4E2] text-[#B42318] dark:bg-[#3A1517] dark:text-[#FDA29B]" aria-hidden="true">
          <LogOut className="h-6 w-6" />
        </span>
        <h2 id="logout-title" className="mt-4 text-lg font-bold text-ink">
          Keluar dari SIPAFAS?
        </h2>
        <p id="logout-desc" className="mt-2 text-sm text-muted">
          Anda perlu masuk lagi untuk membuat atau memantau laporan.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button ref={cancelRef} variant="secondary" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button danger icon={LogOut} onClick={confirm}>
            Ya, keluar
          </Button>
        </div>
      </Dialog>
    </>
  )
}
