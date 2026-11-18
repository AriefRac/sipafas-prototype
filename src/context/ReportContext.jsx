import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { CATEGORIES, SEED_REPORTS, SEED_USER } from '../data/seed'

const DATA_KEY = 'sipafas-reports'
const AUTH_KEY = 'sipafas-auth'

const ReportContext = createContext(null)

// Pratinjau foto yang dipilih dari perangkat hanya disimpan di memori (tidak diunggah).
const photoPreviews = new Map()

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* localStorage tidak tersedia: data tetap ada selama sesi */
  }
}

const cloneSeed = () => JSON.parse(JSON.stringify(SEED_REPORTS))

const nowISO = () => {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function ReportProvider({ children }) {
  const [reports, setReports] = useState(() => readJSON(DATA_KEY, cloneSeed()))
  const [auth, setAuth] = useState(() => readJSON(AUTH_KEY, null))

  useEffect(() => writeJSON(DATA_KEY, reports), [reports])
  useEffect(() => writeJSON(AUTH_KEY, auth), [auth])

  const login = useCallback((nim) => {
    photoPreviews.clear()
    setReports(cloneSeed())
    setAuth({ nim: nim.trim() })
  }, [])

  const logout = useCallback(() => setAuth(null), [])

  const createReport = useCallback(
    (data) => {
      const maxNo = reports.reduce((max, r) => Math.max(max, Number(r.id.split('-')[2])), 0)
      const id = `LAP-2026-${String(maxNo + 1).padStart(4, '0')}`
      const createdAt = nowISO()
      const report = {
        id,
        category: data.category,
        room: data.room.trim(),
        description: data.description.trim(),
        photoName: data.photo?.name ?? null,
        photoUrl: data.photo?.persist ? data.photo.url : null,
        status: 'Menunggu',
        createdAt,
        timeline: [{ status: 'Menunggu', note: 'Laporan dikirim', date: createdAt }],
        rating: null,
      }
      if (data.photo?.url && !data.photo.persist) photoPreviews.set(id, data.photo.url)
      setReports((prev) => [report, ...prev])
      return report
    },
    [reports],
  )

  const cancelReport = useCallback((id) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id && r.status === 'Menunggu'
          ? {
              ...r,
              status: 'Dibatalkan',
              timeline: [...r.timeline, { status: 'Dibatalkan', note: 'Dibatalkan oleh pelapor', date: nowISO() }],
            }
          : r,
      ),
    )
  }, [])

  const rateReport = useCallback((id, stars, comment) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id && r.status === 'Selesai' && !r.rating
          ? { ...r, rating: { stars, comment: comment.trim(), date: nowISO() } }
          : r,
      ),
    )
  }, [])

  const sorted = useMemo(
    () => [...reports].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [reports],
  )

  const summary = useMemo(() => {
    const count = (s) => reports.filter((r) => r.status === s).length
    return {
      Menunggu: count('Menunggu'),
      Diverifikasi: count('Diverifikasi'),
      Diproses: count('Diproses'),
      Selesai: count('Selesai'),
      Dibatalkan: count('Dibatalkan'),
      total: reports.length,
    }
  }, [reports])

  const byCategory = useMemo(
    () =>
      CATEGORIES.map((c) => ({ category: c, count: reports.filter((r) => r.category === c).length })).filter(
        (c) => c.count > 0,
      ),
    [reports],
  )

  const getPhotoUrl = useCallback((report) => report.photoUrl || photoPreviews.get(report.id) || null, [])

  const value = {
    user: auth ? { ...SEED_USER, nim: auth.nim } : null,
    isAuthed: Boolean(auth),
    reports: sorted,
    summary,
    byCategory,
    login,
    logout,
    createReport,
    cancelReport,
    rateReport,
    getPhotoUrl,
  }

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
}

export function useReports() {
  const ctx = useContext(ReportContext)
  if (!ctx) throw new Error('useReports harus dipakai di dalam ReportProvider')
  return ctx
}
