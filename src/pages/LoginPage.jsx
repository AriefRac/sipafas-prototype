import { useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, IdCard, LockKeyhole, LogIn } from 'lucide-react'
import fotoKecil from '../assets/gedung-fakultas-1100.webp'
import fotoBesar from '../assets/gedung-fakultas-1672.webp'
import Button from '../components/Button'
import FormField, { inputClass } from '../components/FormField'
import { Logo } from '../components/Sidebar'
import ThemeToggle from '../components/ThemeToggle'
import { useReports } from '../context/ReportContext'
import { FACULTY } from '../data/seed'
import { cn } from '../lib/cn'

// Input versi halaman Masuk: latar abu lembut dengan ikon di kiri (mengacu mockup).
const loginInput = cn(inputClass, 'border-transparent bg-surface2 pl-11 hover:border-line')

const PHOTO_ALT = `Gedung ${FACULTY}`

/**
 * Foto gedung. Kedua blok (mobile & desktop) memakai <picture> yang sama, jadi
 * tiap perangkat hanya mengunduh SATU file: versi kecil di HP, versi besar di laptop.
 */
function FacultyPhoto() {
  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={fotoBesar} />
      <img
        src={fotoKecil}
        alt={PHOTO_ALT}
        width={1100}
        height={619}
        fetchpriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-[28%_center]"
      />
    </picture>
  )
}

export default function LoginPage() {
  const { login, isAuthed } = useReports()
  const navigate = useNavigate()
  const [nim, setNim] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const nimRef = useRef(null)
  const passRef = useRef(null)

  if (isAuthed) return <Navigate to="/" replace />

  const onSubmit = (e) => {
    e.preventDefault()
    const next = {}
    if (!nim.trim()) next.nim = 'NIM wajib diisi.'
    if (!password.trim()) next.password = 'Kata sandi wajib diisi.'
    setErrors(next)
    if (next.nim) return nimRef.current?.focus()
    if (next.password) return passRef.current?.focus()
    login(nim)
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-dvh bg-bg lg:grid lg:grid-cols-2">
      {/* ===== Kolom kiri: form ===== */}
      <section className="flex min-h-dvh flex-col">
        {/* Hero foto khusus mobile */}
        <div className="relative h-[300px] overflow-hidden lg:hidden">
          <FacultyPhoto />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1E1450]/80 via-[#1E1450]/45 to-[#1E1450]/85" aria-hidden="true" />
          <div className="relative flex h-full flex-col px-5 pb-12 pt-5 text-white">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold tracking-tight">SIPAFAS</span>
              <ThemeToggle className="border-white/30 bg-white/10 text-white hover:bg-white/20" />
            </div>
            <p className="mt-auto text-2xl font-bold leading-snug">
              Laporkan kerusakan fasilitas, pantau tindak lanjutnya.
            </p>
            <p className="mt-1 text-sm text-white/85">{FACULTY}</p>
          </div>
        </div>

        {/* Header desktop */}
        <div className="hidden items-center justify-between px-10 pt-8 lg:flex">
          <Logo />
          <ThemeToggle />
        </div>

        {/* Lembar form: menimpa foto di mobile, polos di desktop */}
        <div className="relative -mt-8 flex flex-1 justify-center rounded-t-[28px] bg-surface px-5 pb-10 pt-8 lg:mt-0 lg:items-center lg:rounded-none lg:bg-transparent lg:px-10 lg:pb-16 lg:pt-0">
          <div className="w-full max-w-sm">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-ink">Masuk</h1>
              <p className="mt-1.5 text-sm text-muted">
                Sistem Informasi Pelaporan Fasilitas
                <br />
                <span className="font-medium text-accent-text">{FACULTY}</span>
              </p>
            </div>

            <form onSubmit={onSubmit} noValidate className="mt-7 space-y-4">
              <FormField id="nim" label="NIM" error={errors.nim}>
                <div className="relative">
                  <IdCard className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
                  <input
                    ref={nimRef}
                    id="nim"
                    name="nim"
                    inputMode="numeric"
                    autoComplete="username"
                    placeholder="Masukkan NIM"
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    aria-invalid={Boolean(errors.nim)}
                    aria-describedby={errors.nim ? 'nim-error' : undefined}
                    className={loginInput}
                  />
                </div>
              </FormField>

              <FormField id="password" label="Kata sandi" error={errors.password}>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
                  <input
                    ref={passRef}
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    className={cn(loginInput, 'pr-12')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    aria-pressed={showPassword}
                    className="absolute right-0 top-0 grid h-11 w-11 place-items-center rounded-ctl text-muted transition-colors duration-150 hover:text-ink"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
                  </button>
                </div>
              </FormField>

              <Button type="submit" fullWidth icon={LogIn} className="!mt-6">
                Masuk
              </Button>
            </form>

            <p className="mt-5 rounded-ctl bg-surface2 px-3.5 py-3 text-center text-xs text-muted">
              Prototype: gunakan NIM dan kata sandi apa saja.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Kolom kanan: foto fakultas (desktop) ===== */}
      <section className="sticky top-0 hidden h-dvh lg:block">
        <figure className="relative h-full overflow-hidden">
          <FacultyPhoto />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E1450]/90 via-[#1E1450]/30 to-transparent" aria-hidden="true" />
          <figcaption className="absolute inset-x-0 bottom-0 p-10 text-white">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#C9C0FF]">{FACULTY}</p>
            <p className="mt-2 max-w-md text-3xl font-bold leading-snug">Laporkan kerusakan fasilitas, pantau tindak lanjutnya.</p>
          </figcaption>
        </figure>
      </section>
    </div>
  )
}
