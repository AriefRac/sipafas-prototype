import { Link } from 'react-router-dom'
import { ArrowRight, ChartColumnBig, FilePlus2 } from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import ReportCard from '../components/ReportCard'
import { Bone } from '../components/Skeleton'
import SkeletonSwap, { useSimulatedLoading } from '../components/SkeletonSwap'
import StatusChip, { STATUS_STYLE } from '../components/StatusChip'
import { useReports } from '../context/ReportContext'
import { formatDate } from '../lib/format'
import { cn } from '../lib/cn'

const SUMMARY = [
  { key: 'Menunggu', label: 'Menunggu' },
  { key: 'Diproses', label: 'Diproses' },
  { key: 'Selesai', label: 'Selesai' },
  { key: 'total', label: 'Total laporan', style: 'Total' },
]

function SummaryCard({ value, label, styleKey }) {
  const { icon: Icon, chip } = STATUS_STYLE[styleKey]
  return (
    <div className="relative overflow-hidden rounded-[20px] bg-surface p-4 text-ink">
      {/* Aksen dekoratif sesuai warna status (statis, non-interaktif) */}
      <span className={cn('pointer-events-none absolute -right-7 -top-7 h-24 w-24 rounded-full opacity-60', chip)} aria-hidden="true" />
      <span className={cn('pointer-events-none absolute -right-2 top-10 h-8 w-8 rounded-full opacity-40', chip)} aria-hidden="true" />
      <span className={cn('relative grid h-10 w-10 place-items-center rounded-xl ring-4 ring-surface', chip)} aria-hidden="true">
        <Icon className="h-5 w-5" />
      </span>
      <p className="relative mt-3 text-2xl font-bold tracking-tight lg:text-3xl">{value}</p>
      <p className="relative text-sm text-muted">{label}</p>
    </div>
  )
}

function HomeContent() {
  const { user, summary, byCategory, reports } = useReports()
  const latest = reports.slice(0, 3)
  const firstName = user.name.split(' ')[0]

  return (
    <div className="space-y-6">
      {/* Banner sapaan + ringkasan */}
      <section
        aria-labelledby="sapaan"
        className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#6D5BF6] to-[#4A3BC9] p-5 text-white lg:p-6"
      >
        {/* Bentuk dekoratif statis di sisi kanan (jauh dari teks agar kontras tetap aman) */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 text-white lg:right-0 lg:h-80 lg:w-80"
          viewBox="0 0 200 200"
          fill="none"
        >
          <circle cx="120" cy="80" r="80" fill="currentColor" fillOpacity="0.07" />
          <circle cx="120" cy="80" r="52" stroke="currentColor" strokeOpacity="0.14" strokeWidth="1.5" />
          <circle cx="40" cy="150" r="14" fill="currentColor" fillOpacity="0.08" />
        </svg>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 left-1/4 h-72 w-72 rounded-full"
          style={{ background: 'radial-gradient(circle, rgb(169 155 255 / 0.28) 0%, transparent 65%)' }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-6 top-6 hidden h-16 w-28 opacity-25 lg:block"
          style={{ backgroundImage: 'radial-gradient(rgb(255 255 255) 1.2px, transparent 1.2px)', backgroundSize: '12px 12px' }}
        />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 id="sapaan" className="text-2xl font-bold tracking-tight lg:text-3xl">
              Halo, {firstName}
            </h1>
            <p className="mt-1 text-sm text-white/90">Pantau laporan fasilitas Anda di sini.</p>
          </div>
          {/* Di mobile tombol ini disembunyikan karena sudah ada tombol Lapor di navigasi bawah */}
          <Button to="/buat" onAccent icon={FilePlus2} className="hidden self-start lg:inline-flex">
            Buat Laporan
          </Button>
        </div>
        <h2 className="sr-only">Ringkasan laporan</h2>
        <div className="relative mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {SUMMARY.map((s) => (
            <SummaryCard key={s.key} value={summary[s.key]} label={s.label} styleKey={s.style ?? s.key} />
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Laporan terbaru */}
        <Card as="section" aria-labelledby="terbaru" className="p-5 lg:col-span-2 lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 id="terbaru" className="text-lg font-semibold text-ink">
              Laporan terbaru
            </h2>
            <Link
              to="/riwayat"
              className="inline-flex min-h-[44px] items-center gap-1 rounded-ctl px-2 text-sm font-semibold text-accent-text hover:underline"
            >
              Lihat semua
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {latest.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Belum ada laporan.</p>
          ) : (
            <>
              {/* Mobile: kartu */}
              <div className="mt-3 space-y-3 xl:hidden">
                {latest.map((r) => (
                  <ReportCard key={r.id} report={r} />
                ))}
              </div>
              {/* Desktop: tabel */}
              <div className="mt-3 hidden overflow-hidden rounded-[18px] border border-line xl:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface2 text-xs font-semibold text-muted">
                    <tr>
                      <th scope="col" className="px-4 py-3">No. Laporan</th>
                      <th scope="col" className="px-4 py-3">Kategori</th>
                      <th scope="col" className="px-4 py-3">Lokasi</th>
                      <th scope="col" className="px-4 py-3">Tanggal</th>
                      <th scope="col" className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latest.map((r) => (
                      <tr key={r.id} className="relative border-t border-line transition-colors duration-150 hover:bg-surface2">
                        <td className="whitespace-nowrap px-4 py-3 font-semibold text-ink">
                          <Link
                            to={`/laporan/${r.id}`}
                            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-md focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-[var(--focus)]"
                          >
                            {r.id}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-ink">{r.category}</td>
                        <td className="px-4 py-3 text-muted">
                          {r.room}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(r.createdAt)}</td>
                        <td className="px-4 py-3">
                          <StatusChip status={r.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Card>

        {/* Laporan per kategori */}
        <Card as="section" aria-labelledby="kategori" className="p-5 lg:p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-line text-accent-text" aria-hidden="true">
              <ChartColumnBig className="h-5 w-5" />
            </span>
            <h2 id="kategori" className="text-lg font-semibold text-ink">
              Laporan per kategori
            </h2>
          </div>
          <p className="mt-4 text-sm text-muted">Total laporan</p>
          <p className="text-3xl font-bold tracking-tight text-ink">{summary.total}</p>
          <ul className="mt-4 space-y-3.5">
            {byCategory.map(({ category, count }) => {
              const pct = summary.total ? Math.round((count / summary.total) * 100) : 0
              return (
                <li key={category}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-ink">{category}</span>
                    <span className="shrink-0 font-semibold text-muted">{count} laporan</span>
                  </div>
                  <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-surface2" aria-hidden="true">
                    <div className="bar-stripes h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>
    </div>
  )
}

function HomeSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-[26px] bg-accent/15 p-5 lg:p-6">
        <Bone className="h-8 w-40" />
        <Bone className="mt-2 h-4 w-60" />
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-[20px] bg-surface p-4">
              <Bone className="h-10 w-10 rounded-xl" />
              <Bone className="mt-3 h-7 w-12" />
              <Bone className="mt-2 h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-card border border-line bg-surface p-5 lg:col-span-2 lg:p-6">
          <Bone className="h-6 w-40" />
          <div className="mt-4 space-y-3">
            {[0, 1, 2].map((i) => (
              <Bone key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </div>
        <div className="rounded-card border border-line bg-surface p-5 lg:p-6">
          <Bone className="h-6 w-44" />
          <Bone className="mt-4 h-9 w-12" />
          <div className="mt-4 space-y-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Bone className="h-3.5 w-28" />
                <Bone className="mt-2 h-3 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const loading = useSimulatedLoading()
  return (
    <SkeletonSwap loading={loading} skeleton={<HomeSkeleton />}>
      <HomeContent />
    </SkeletonSwap>
  )
}
