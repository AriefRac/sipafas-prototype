import { Suspense, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useReports } from '../context/ReportContext'
import { initials } from '../lib/format'
import BottomNav from './BottomNav'
import Sidebar, { Logo } from './Sidebar'
import ThemeToggle from './ThemeToggle'

function pageTitle(pathname) {
  if (pathname === '/') return 'Beranda'
  if (pathname.startsWith('/buat')) return 'Buat Laporan'
  if (pathname.startsWith('/riwayat')) return 'Riwayat Laporan'
  if (pathname.startsWith('/laporan')) return 'Detail Laporan'
  if (pathname.startsWith('/profil')) return 'Profil'
  return 'SIPAFAS'
}

export default function AppLayout() {
  const { user } = useReports()
  const { pathname } = useLocation()
  const title = pageTitle(pathname)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = `${title} · SIPAFAS`
  }, [pathname, title])

  return (
    <div className="min-h-dvh bg-bg">
      <Sidebar />

      <div className="lg:pl-64">
        {/* Header mobile */}
        <header className="vt-mobile-header sticky top-0 z-30 flex items-center justify-between border-b border-line bg-surface px-4 py-2 lg:hidden">
          <Logo />
          <ThemeToggle />
        </header>

        {/* Top bar desktop */}
        <header className="vt-topbar sticky top-0 z-20 hidden items-center justify-between border-b border-line bg-surface px-8 py-3 lg:flex">
          <p className="text-lg font-semibold text-ink">{title}</p>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/profil"
              className="flex min-h-[44px] items-center gap-3 rounded-full border border-line py-1 pl-1 pr-4 transition-colors duration-150 hover:bg-surface2"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-accent-soft text-sm font-bold text-accent-text" aria-hidden="true">
                {initials(user.name)}
              </span>
              <span className="text-left leading-tight">
                <span className="block text-sm font-semibold text-ink">{user.name}</span>
                <span className="block text-xs text-muted">Lihat profil</span>
              </span>
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 pb-32 pt-5 lg:px-8 lg:pb-10 lg:pt-7">
          {/* Hanya area konten yang menunggu file halaman; navbar & header tetap tampil */}
          <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
