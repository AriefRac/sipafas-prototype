import { FilePlus2, History, House, UserRound } from 'lucide-react'

export const NAV_ITEMS = [
  { to: '/', label: 'Beranda', icon: House, end: true },
  { to: '/buat', label: 'Buat Laporan', icon: FilePlus2 },
  { to: '/riwayat', label: 'Riwayat', icon: History },
  { to: '/profil', label: 'Profil', icon: UserRound },
]
