import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, CircleCheck, CircleX, ImageOff, Send } from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import Dialog from '../components/Dialog'
import { FieldError, inputClass } from '../components/FormField'
import { Bone } from '../components/Skeleton'
import SkeletonSwap, { useSimulatedLoading } from '../components/SkeletonSwap'
import StarRating from '../components/StarRating'
import StatusChip from '../components/StatusChip'
import Timeline from '../components/Timeline'
import { useReports } from '../context/ReportContext'
import { formatDateTime } from '../lib/format'
import { cn } from '../lib/cn'

function BackLink() {
  return (
    <Link
      to="/riwayat"
      className="-ml-2 inline-flex min-h-[44px] items-center gap-1 rounded-ctl px-2 text-sm font-semibold text-accent-text hover:underline"
    >
      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      Kembali
    </Link>
  )
}

function Info({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-ink">{children}</dd>
    </div>
  )
}

function RatingForm({ report }) {
  const { rateReport } = useReports()
  const [stars, setStars] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [justSent, setJustSent] = useState(false)

  if (report.rating) {
    return (
      <div>
        {justSent && (
          <p role="status" className="mb-4 flex items-center gap-2 rounded-ctl bg-[#DCFCE7] px-3.5 py-3 text-sm font-medium text-[#166534] dark:bg-[#0F2E1C] dark:text-[#86EFAC]">
            <CircleCheck className="h-5 w-5 shrink-0" aria-hidden="true" />
            Terima kasih, penilaian Anda sudah terkirim.
          </p>
        )}
        <p className="text-sm font-semibold text-ink">Penilaian Anda</p>
        <div className="mt-2">
          <StarRating value={report.rating.stars} readOnly />
        </div>
        {report.rating.comment && <p className="mt-2 text-sm text-ink">“{report.rating.comment}”</p>}
        <p className="mt-1 text-xs text-muted">Dikirim {formatDateTime(report.rating.date)}</p>
      </div>
    )
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!stars) {
      setError('Pilih jumlah bintang terlebih dahulu.')
      return
    }
    rateReport(report.id, stars, comment)
    setJustSent(true)
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <p className="text-sm text-muted">Bagaimana hasil penanganan laporan ini?</p>
      <div className="mt-3">
        <StarRating
          value={stars}
          onChange={(n) => {
            setStars(n)
            setError('')
          }}
          describedBy={error ? 'rating-error' : undefined}
          invalid={Boolean(error)}
        />
        <FieldError id="rating-error">{error}</FieldError>
      </div>
      <label htmlFor="comment" className="mt-4 block text-sm font-semibold text-ink">
        Komentar <span className="font-normal text-muted">(opsional)</span>
      </label>
      <textarea
        id="comment"
        rows={3}
        maxLength={200}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Tulis komentar singkat"
        aria-describedby="comment-count"
        className={cn(inputClass, 'mt-1.5 resize-y')}
      />
      <p id="comment-count" className="mt-1 text-right text-xs text-muted">
        {comment.length}/200
      </p>
      <Button type="submit" icon={Send} className="mt-2">
        Kirim Penilaian
      </Button>
    </form>
  )
}

function DetailContent({ report }) {
  const { cancelReport, getPhotoUrl } = useReports()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const noRef = useRef(null)
  const photoUrl = getPhotoUrl(report)

  const doCancel = () => {
    cancelReport(report.id)
    setConfirmOpen(false)
    setCancelled(true)
  }

  return (
    <>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted">Detail Laporan</p>
          <h1 className="text-2xl font-bold tracking-tight text-ink">{report.id}</h1>
        </div>
        <StatusChip status={report.status} className="px-3 py-1.5 text-sm" />
      </div>

      {cancelled && (
        <p role="status" className="mt-4 flex items-center gap-2 rounded-ctl bg-[#F1F1F4] px-3.5 py-3 text-sm font-medium text-[#4B4B5A] dark:bg-[#26262F] dark:text-[#C4C4CF]">
          <CircleX className="h-5 w-5 shrink-0" aria-hidden="true" />
          Laporan dibatalkan.
        </p>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card as="section" aria-labelledby="info-title" className="p-5 lg:p-6">
            <h2 id="info-title" className="text-lg font-semibold text-ink">
              Info laporan
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-4">
              <Info label="Kategori">{report.category}</Info>
              <Info label="Lokasi">{report.room}</Info>
              <div className="col-span-2">
                <Info label="Tanggal dibuat">{formatDateTime(report.createdAt)}</Info>
              </div>
              <div className="col-span-2">
                <Info label="Deskripsi">
                  <span className="font-normal leading-relaxed">{report.description}</span>
                </Info>
              </div>
              <div className="col-span-2">
                <dt className="text-xs font-medium text-muted">Foto</dt>
                <dd className="mt-1.5">
                  {photoUrl ? (
                    <figure>
                      <img src={photoUrl} alt={`Foto laporan ${report.id}`} className="max-h-56 rounded-[18px] border border-line object-cover" />
                      <figcaption className="mt-1 text-xs text-muted">{report.photoName}</figcaption>
                    </figure>
                  ) : report.photoName ? (
                    <span className="inline-flex items-center gap-2 rounded-ctl bg-surface2 px-3 py-2 text-sm text-ink">
                      <ImageOff className="h-4 w-4 text-muted" aria-hidden="true" />
                      {report.photoName}
                    </span>
                  ) : (
                    <span className="text-sm text-muted">Tidak ada foto</span>
                  )}
                </dd>
              </div>
            </dl>

            {report.status === 'Menunggu' && (
              <div className="mt-6 border-t border-line pt-5">
                <p className="mb-3 text-sm text-muted">Laporan masih bisa dibatalkan selama berstatus Menunggu.</p>
                <Button variant="secondary" danger icon={CircleX} onClick={() => setConfirmOpen(true)}>
                  Batalkan Laporan
                </Button>
              </div>
            )}
          </Card>

          {report.status === 'Selesai' && (
            <Card as="section" aria-labelledby="rating-title" className="p-5 lg:p-6">
              <h2 id="rating-title" className="text-lg font-semibold text-ink">
                Penilaian
              </h2>
              <div className="mt-3">
                <RatingForm report={report} />
              </div>
            </Card>
          )}
        </div>

        <Card as="section" aria-labelledby="timeline-title" className="h-fit p-5 lg:p-6">
          <h2 id="timeline-title" className="text-lg font-semibold text-ink">
            Linimasa status
          </h2>
          <div className="mt-4">
            <Timeline items={report.timeline} />
          </div>
        </Card>
      </div>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} labelledBy="cancel-title" describedBy="cancel-desc" initialFocusRef={noRef}>
        <h2 id="cancel-title" className="text-lg font-bold text-ink">
          Batalkan laporan {report.id}?
        </h2>
        <p id="cancel-desc" className="mt-2 text-sm text-muted">
          Laporan yang dibatalkan tidak dapat diproses lagi.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button ref={noRef} variant="secondary" onClick={() => setConfirmOpen(false)}>
            Tidak
          </Button>
          <Button danger onClick={doCancel}>Ya, batalkan</Button>
        </div>
      </Dialog>
    </>
  )
}

function DetailSkeleton() {
  return (
    <>
      <div className="mt-2 flex items-center justify-between">
        <div className="space-y-2">
          <Bone className="h-4 w-24" />
          <Bone className="h-7 w-44" />
        </div>
        <Bone className="h-8 w-28 rounded-full" />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="rounded-card border border-line bg-surface p-5 lg:col-span-2 lg:p-6">
          <Bone className="h-6 w-32" />
          <div className="mt-4 grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="space-y-1.5">
                <Bone className="h-3 w-16" />
                <Bone className="h-4 w-28" />
              </div>
            ))}
          </div>
          <Bone className="mt-4 h-4 w-full" />
          <Bone className="mt-2 h-4 w-3/4" />
        </div>
        <div className="rounded-card border border-line bg-surface p-5 lg:p-6">
          <Bone className="h-6 w-36" />
          <div className="mt-4 space-y-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-4">
                <Bone className="h-5 w-5 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Bone className="h-6 w-24 rounded-full" />
                  <Bone className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default function ReportDetailPage() {
  const { id } = useParams()
  const { reports } = useReports()
  const report = reports.find((r) => r.id === id)
  const loading = useSimulatedLoading()

  if (!report) {
    return (
      <div>
        <BackLink />
        <Card className="mt-4 p-8 text-center">
          <h1 className="text-lg font-semibold text-ink">Laporan tidak ditemukan.</h1>
          <Button to="/riwayat" variant="secondary" className="mt-4">
            Ke Riwayat Laporan
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <BackLink />
      <SkeletonSwap loading={loading} skeleton={<DetailSkeleton />}>
        <DetailContent report={report} />
      </SkeletonSwap>
    </div>
  )
}
