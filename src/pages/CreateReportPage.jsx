import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Armchair,
  CalendarDays,
  Check,
  CircleEllipsis,
  CircleX,
  Droplets,
  ImagePlus,
  Layers,
  MapPin,
  Send,
  Snowflake,
  Sparkles,
  Trash2,
  Upload,
  Wifi,
  Zap,
  Brush,
} from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import Dialog from '../components/Dialog'
import { FieldError, inputClass } from '../components/FormField'
import StatusChip from '../components/StatusChip'
import SuccessCheck from '../components/SuccessCheck'
import { useReports } from '../context/ReportContext'
import { CATEGORIES, SAMPLE_PHOTO } from '../data/seed'
import { formatDateTime } from '../lib/format'
import { cn } from '../lib/cn'

const CATEGORY_ICON = {
  Listrik: Zap,
  AC: Snowflake,
  'Air dan Sanitasi': Droplets,
  Furnitur: Armchair,
  Jaringan: Wifi,
  Kebersihan: Brush,
  Lainnya: CircleEllipsis,
}

const EMPTY = { category: '', room: '', description: '', photo: null }
const MIN_DESC = 10

function validate(f) {
  const e = {}
  if (!f.category) e.category = 'Pilih kategori laporan.'
  if (!f.room.trim()) e.room = 'Isi lokasi atau nama ruang.'
  if (f.description.trim().length < MIN_DESC) e.description = `Jelaskan kerusakan minimal ${MIN_DESC} karakter.`
  return e
}

const ORDER = ['category', 'room', 'description']

/** Judul bagian bernomor; nomor berubah jadi centang saat bagian sudah lengkap. */
function SectionTitle({ number, done, optional, htmlFor, id, as = 'label', children }) {
  const Tag = as
  return (
    <div className="mb-3 flex items-center gap-3">
      <span
        aria-hidden="true"
        className={cn(
          'grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors duration-150',
          done ? 'bg-accent text-white' : 'bg-surface2 text-muted ring-1 ring-line',
        )}
      >
        {done ? <Check className="h-4 w-4" strokeWidth={3} /> : number}
      </span>
      <Tag id={id} htmlFor={as === 'label' ? htmlFor : undefined} className="text-sm font-semibold text-ink">
        {children}{' '}
        <span className="font-normal text-muted">{optional ? '(opsional)' : '(wajib)'}</span>
      </Tag>
    </div>
  )
}

function SummaryList({ data }) {
  return (
    <dl className="space-y-2.5 text-sm">
      <div className="flex gap-3">
        <dt className="w-20 shrink-0 text-muted">Kategori</dt>
        <dd className="font-medium text-ink">{data.category}</dd>
      </div>
      <div className="flex gap-3">
        <dt className="w-20 shrink-0 text-muted">Lokasi</dt>
        <dd className="font-medium text-ink">{data.room}</dd>
      </div>
      <div className="flex gap-3">
        <dt className="w-20 shrink-0 text-muted">Deskripsi</dt>
        <dd className="line-clamp-3 text-ink">{data.description}</dd>
      </div>
      <div className="flex gap-3">
        <dt className="w-20 shrink-0 text-muted">Foto</dt>
        <dd className="truncate text-ink">{data.photo?.name ?? 'Tidak ada foto'}</dd>
      </div>
    </dl>
  )
}

export default function CreateReportPage() {
  const { createReport } = useReports()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)
  const [created, setCreated] = useState(null)
  const fileRef = useRef(null)
  const successTitleRef = useRef(null)
  const confirmSendRef = useRef(null)
  const keepEditingRef = useRef(null)
  const refs = { category: useRef(null), room: useRef(null), description: useRef(null) }

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const done = {
    category: Boolean(form.category),
    room: Boolean(form.room.trim()),
    description: form.description.trim().length >= MIN_DESC,
    photo: Boolean(form.photo),
  }
  const requiredDone = [done.category, done.room, done.description].filter(Boolean).length
  const progress = Math.round((requiredDone / 3) * 100)
  const isDirty = Boolean(form.category || form.room || form.description || form.photo)

  const onPickFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    set('photo', { name: file.name, url: file.type.startsWith('image/') ? URL.createObjectURL(file) : null, persist: false })
    e.target.value = ''
  }

  // Kirim: validasi dulu, lalu minta konfirmasi
  const onSubmit = (e) => {
    e.preventDefault()
    const next = validate(form)
    setErrors(next)
    const firstError = ORDER.find((k) => next[k])
    if (firstError) {
      refs[firstError].current?.focus()
      return
    }
    setConfirmOpen(true)
  }

  const doSend = () => {
    const report = createReport(form)
    setConfirmOpen(false)
    setCreated(report)
    setForm(EMPTY)
  }

  const onCancel = () => {
    if (isDirty) setDiscardOpen(true)
    else navigate('/')
  }

  const closeSuccess = (to = '/') => {
    setCreated(null)
    navigate(to)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight text-ink">Buat Laporan</h1>
      <p className="mt-1 text-sm text-muted">Laporkan kerusakan fasilitas di Fakultas Sains &amp; Teknologi.</p>

      <Card as="form" onSubmit={onSubmit} noValidate className="mt-5 overflow-hidden">
        {/* Progres kelengkapan */}
        <div className="border-b border-line bg-gradient-to-r from-accent-soft to-surface px-5 py-4 lg:px-7">
          <div className="flex items-center justify-between gap-3 text-sm">
            <p id="progress-label" className="font-semibold text-ink">
              Kelengkapan laporan
            </p>
            <p className="font-medium text-accent-text">{requiredDone} dari 3 kolom wajib</p>
          </div>
          <div
            role="progressbar"
            aria-labelledby="progress-label"
            aria-valuemin={0}
            aria-valuemax={3}
            aria-valuenow={requiredDone}
            aria-valuetext={`${requiredDone} dari 3 kolom wajib terisi`}
            className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-surface2 ring-1 ring-inset ring-line"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#8B7CF8] to-accent transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-7 p-5 lg:p-7">
          {/* 1. Kategori */}
          <div>
            <SectionTitle number={1} done={done.category} as="span" id="category-title">
              Kategori
            </SectionTitle>
            <div
              ref={refs.category}
              tabIndex={-1}
              role="radiogroup"
              aria-labelledby="category-title"
              aria-describedby={errors.category ? 'category-error' : undefined}
              className="grid grid-cols-2 gap-2 outline-none sm:grid-cols-4"
            >
              {CATEGORIES.map((c) => {
                const Icon = CATEGORY_ICON[c]
                const checked = form.category === c
                return (
                  <label
                    key={c}
                    className={cn(
                      'flex min-h-[52px] cursor-pointer items-center gap-2.5 rounded-[16px] border px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                      'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--focus)]',
                      checked
                        ? 'border-accent bg-accent-soft text-accent-text'
                        : cn('bg-surface text-ink hover:bg-surface2', errors.category ? 'border-[#D92D20] dark:border-[#F97066]' : 'border-line'),
                    )}
                  >
                    <input type="radio" name="category" value={c} checked={checked} onChange={() => set('category', c)} className="sr-only" />
                    <span
                      aria-hidden="true"
                      className={cn(
                        'grid h-8 w-8 shrink-0 place-items-center rounded-xl transition-colors duration-150',
                        checked ? 'bg-accent text-white' : 'bg-surface2 text-muted',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="leading-tight">{c}</span>
                  </label>
                )
              })}
            </div>
            <FieldError id="category-error">{errors.category}</FieldError>
          </div>

          {/* 2. Lokasi */}
          <div>
            <SectionTitle number={2} done={done.room} htmlFor="room">
              Lokasi / ruang
            </SectionTitle>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                ref={refs.room}
                id="room"
                placeholder="Contoh: Ruang 2.04, Lab Komputer 1, Toilet Lt. 2"
                value={form.room}
                onChange={(e) => set('room', e.target.value)}
                aria-invalid={Boolean(errors.room)}
                aria-describedby={errors.room ? 'room-error' : undefined}
                className={cn(inputClass, 'pl-11')}
              />
            </div>
            <FieldError id="room-error">{errors.room}</FieldError>
          </div>

          {/* 3. Deskripsi */}
          <div>
            <SectionTitle number={3} done={done.description} htmlFor="description">
              Deskripsi kerusakan
            </SectionTitle>
            <textarea
              ref={refs.description}
              id="description"
              rows={4}
              maxLength={500}
              placeholder="Jelaskan kerusakan yang Anda temukan"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? 'description-error description-count' : 'description-count'}
              className={cn(inputClass, 'resize-y')}
            />
            <div className="mt-1 flex items-start justify-between gap-3">
              <FieldError id="description-error">{errors.description}</FieldError>
              <p id="description-count" className="ml-auto shrink-0 text-xs text-muted">
                {form.description.length}/500
              </p>
            </div>
          </div>

          {/* 4. Foto (simulasi) */}
          <div>
            <SectionTitle number={4} done={done.photo} optional as="span">
              Foto
            </SectionTitle>
            {form.photo ? (
              <div className="flex items-center gap-3 rounded-[18px] border border-line bg-surface2 p-3">
                {form.photo.url ? (
                  <img src={form.photo.url} alt="Pratinjau foto yang dipilih" className="h-16 w-20 rounded-xl object-cover" />
                ) : (
                  <span className="grid h-16 w-20 place-items-center rounded-xl bg-surface text-muted" aria-hidden="true">
                    <ImagePlus className="h-6 w-6" />
                  </span>
                )}
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{form.photo.name}</p>
                <button
                  type="button"
                  onClick={() => set('photo', null)}
                  aria-label="Hapus foto"
                  className="grid h-11 w-11 place-items-center rounded-ctl text-muted transition-colors duration-150 hover:bg-surface hover:text-ink"
                >
                  <Trash2 className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="rounded-[18px] border border-dashed border-line p-4 text-center">
                <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-accent-soft text-accent-text" aria-hidden="true">
                  <ImagePlus className="h-5 w-5" />
                </span>
                <p className="mt-2 text-xs text-muted">Simulasi: foto tidak diunggah ke mana pun.</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <input ref={fileRef} type="file" accept="image/*" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={onPickFile} />
                  <Button variant="secondary" icon={Upload} onClick={() => fileRef.current?.click()}>
                    Pilih file
                  </Button>
                  <Button variant="secondary" icon={Sparkles} onClick={() => set('photo', { ...SAMPLE_PHOTO, persist: true })}>
                    Gunakan foto contoh
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-line px-5 py-4 sm:flex-row sm:justify-end lg:px-7">
          <Button variant="secondary" danger icon={CircleX} onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit" icon={Send}>
            Kirim Laporan
          </Button>
        </div>
      </Card>

      {/* Konfirmasi kirim */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} labelledBy="send-title" describedBy="send-desc" initialFocusRef={confirmSendRef}>
        <h2 id="send-title" className="text-lg font-bold text-ink">
          Kirim laporan ini?
        </h2>
        <p id="send-desc" className="mt-1 text-sm text-muted">
          Periksa kembali data laporan Anda sebelum dikirim.
        </p>
        <div className="mt-4 rounded-[18px] border border-line bg-surface2 p-4">
          <SummaryList data={form} />
        </div>
        <p className="mt-3 text-xs text-muted">Setelah dikirim, laporan berstatus Menunggu dan masih bisa dibatalkan selama status itu.</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
            Periksa lagi
          </Button>
          <Button ref={confirmSendRef} icon={Send} onClick={doSend}>
            Ya, kirim
          </Button>
        </div>
      </Dialog>

      {/* Konfirmasi batal */}
      <Dialog open={discardOpen} onClose={() => setDiscardOpen(false)} labelledBy="discard-title" describedBy="discard-desc" initialFocusRef={keepEditingRef}>
        <span className="grid h-12 w-12 place-items-center rounded-full bg-[#FEE4E2] text-[#B42318] dark:bg-[#3A1517] dark:text-[#FDA29B]" aria-hidden="true">
          <CircleX className="h-6 w-6" />
        </span>
        <h2 id="discard-title" className="mt-4 text-lg font-bold text-ink">
          Batalkan pembuatan laporan?
        </h2>
        <p id="discard-desc" className="mt-2 text-sm text-muted">
          Data yang sudah Anda isi akan hilang.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button ref={keepEditingRef} variant="secondary" onClick={() => setDiscardOpen(false)}>
            Lanjut mengisi
          </Button>
          <Button
            danger
            onClick={() => {
              setDiscardOpen(false)
              setForm(EMPTY)
              navigate('/')
            }}
          >
            Ya, batalkan
          </Button>
        </div>
      </Dialog>

      {/* Layar sukses */}
      <Dialog
        open={Boolean(created)}
        onClose={() => closeSuccess('/')}
        labelledBy="success-title"
        describedBy="success-desc"
        initialFocusRef={successTitleRef}
        fullscreenMobile
        className="flex flex-col justify-center text-center lg:max-w-md lg:p-8"
      >
        {created && (
          <div className="mx-auto w-full max-w-sm">
            <SuccessCheck />
            <h2 id="success-title" ref={successTitleRef} tabIndex={-1} className="mt-6 text-2xl font-bold tracking-tight text-ink outline-none">
              Laporan berhasil dikirim
            </h2>
            <p id="success-desc" className="mt-1 text-sm text-muted">
              Laporan Anda sudah diterima dan menunggu pemeriksaan petugas.
            </p>
            <div className="mt-5 rounded-[20px] border border-line bg-surface2 p-4 text-left">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-muted">Nomor laporan</p>
                  <p className="text-lg font-bold text-ink">{created.id}</p>
                </div>
                <StatusChip status={created.status} />
              </div>
              <dl className="mt-3 space-y-1.5 border-t border-line pt-3 text-sm">
                <div className="flex items-center gap-2 text-muted">
                  <Layers className="h-4 w-4" aria-hidden="true" />
                  <dt className="sr-only">Kategori</dt>
                  <dd className="text-ink">{created.category}</dd>
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  <dt className="sr-only">Lokasi</dt>
                  <dd className="text-ink">{created.room}</dd>
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  <dt className="sr-only">Waktu kirim</dt>
                  <dd className="text-ink">{formatDateTime(created.createdAt)}</dd>
                </div>
              </dl>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <Button fullWidth onClick={() => closeSuccess(`/laporan/${created.id}`)}>
                Lihat laporan
              </Button>
              <Button variant="secondary" fullWidth onClick={() => closeSuccess('/')}>
                Kembali ke Beranda
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}
