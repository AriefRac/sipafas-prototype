import Card from '../components/Card'
import LogoutButton from '../components/LogoutButton'
import { useReports } from '../context/ReportContext'
import { FACULTY } from '../data/seed'
import { initials } from '../lib/format'

export default function ProfilePage() {
  const { user } = useReports()

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold tracking-tight text-ink">Profil</h1>
      <Card className="mt-5 p-6 text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-accent-soft text-2xl font-bold text-accent-text" aria-hidden="true">
          {initials(user.name)}
        </span>
        <p className="mt-4 text-lg font-semibold text-ink">{user.name}</p>
        <dl className="mt-4 space-y-3 rounded-[18px] bg-surface2 p-4 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">NIM</dt>
            <dd className="font-medium text-ink">{user.nim}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Program studi</dt>
            <dd className="text-right font-medium text-ink">{user.prodi}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Fakultas</dt>
            <dd className="text-right font-medium text-ink">{FACULTY}</dd>
          </div>
        </dl>
        <LogoutButton asButton className="mt-6" />
      </Card>
    </div>
  )
}
