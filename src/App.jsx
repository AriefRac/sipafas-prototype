import { lazy, Suspense, useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import { ReportProvider, useReports } from './context/ReportContext'
import { ThemeProvider } from './context/ThemeContext'

// Tiap halaman dipecah jadi file sendiri: yang diunduh di awal hanya halaman yang dibuka.
const loadLogin = () => import('./pages/LoginPage')
const loadHome = () => import('./pages/HomePage')
const loadCreate = () => import('./pages/CreateReportPage')
const loadHistory = () => import('./pages/HistoryPage')
const loadDetail = () => import('./pages/ReportDetailPage')
const loadProfile = () => import('./pages/ProfilePage')

const LoginPage = lazy(loadLogin)
const HomePage = lazy(loadHome)
const CreateReportPage = lazy(loadCreate)
const HistoryPage = lazy(loadHistory)
const ReportDetailPage = lazy(loadDetail)
const ProfilePage = lazy(loadProfile)

/** Setelah halaman pertama tampil, halaman lain diunduh diam-diam saat browser senggang. */
function usePrefetchPages() {
  useEffect(() => {
    const run = () => [loadHome, loadCreate, loadHistory, loadDetail, loadProfile, loadLogin].forEach((load) => load().catch(() => {}))
    const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 1500))
    const cancel = window.cancelIdleCallback ?? clearTimeout
    const id = idle(run, { timeout: 3000 })
    return () => cancel(id)
  }, [])
}

function RequireAuth({ children }) {
  const { isAuthed } = useReports()
  return isAuthed ? children : <Navigate to="/masuk" replace />
}

// Placeholder kosong berwarna latar (tanpa spinner) agar tidak berkedip saat file halaman dimuat.
const PageFallback = () => <div className="min-h-dvh bg-bg" aria-busy="true" />

function AppRoutes() {
  usePrefetchPages()
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/masuk" element={<LoginPage />} />
        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="beranda" element={<Navigate to="/" replace />} />
          <Route path="buat" element={<CreateReportPage />} />
          <Route path="riwayat" element={<HistoryPage />} />
          <Route path="laporan/:id" element={<ReportDetailPage />} />
          <Route path="profil" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ReportProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </ReportProvider>
    </ThemeProvider>
  )
}
