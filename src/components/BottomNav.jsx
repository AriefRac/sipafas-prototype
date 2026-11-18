import { NavLink } from 'react-router-dom'
import { History, House, LogOut, Plus, UserRound } from 'lucide-react'
import { cn } from '../lib/cn'
import LogoutButton from './LogoutButton'

const itemBase =
  'flex min-h-[56px] w-full flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] leading-none transition-colors duration-150'

function NavItem({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(itemBase, isActive ? 'font-semibold text-nav-active' : 'font-medium text-nav-text hover:text-nav-active')
      }
    >
      {({ isActive }) => (
        <>
          <Icon className="h-[22px] w-[22px]" aria-hidden="true" strokeWidth={isActive ? 2.3 : 1.8} />
          <span>{label}</span>
          <span
            aria-hidden="true"
            className={cn('h-1 w-1 rounded-full transition-colors duration-150', isActive ? 'bg-nav-active' : 'bg-transparent')}
          />
        </>
      )}
    </NavLink>
  )
}

/**
 * Navigasi bawah (mobile), 5 menu. Tombol tengah "Lapor" dibuat menonjol
 * karena membuat laporan adalah tugas utama. Warna mengikuti tema (token --nav*).
 */
export default function BottomNav() {
  return (
    <nav
      aria-label="Navigasi utama"
      className="vt-bottom-nav fixed inset-x-3 bottom-3 z-40 rounded-[24px] border border-line bg-nav px-1.5 pb-1 pt-1.5 shadow-floating lg:hidden"
    >
      <ul className="grid grid-cols-5 items-end">
        <li>
          <NavItem to="/" end label="Beranda" icon={House} />
        </li>
        <li>
          <NavItem to="/riwayat" label="Riwayat" icon={History} />
        </li>

        {/* Tombol utama: Buat Laporan */}
        <li className="flex justify-center">
          <NavLink to="/buat" aria-label="Buat Laporan" className="group -mt-7 flex flex-col items-center gap-1 rounded-full">
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'grid h-[60px] w-[60px] place-items-center rounded-full border-[5px] border-bg bg-accent text-white shadow-[0_8px_20px_rgb(109_91_246/0.45)] transition-colors duration-150 group-hover:bg-accent-hover',
                    isActive && 'bg-accent-hover',
                  )}
                  aria-hidden="true"
                >
                  <Plus className="h-7 w-7" strokeWidth={2.6} />
                </span>
                <span className={cn('text-[11px] leading-none', isActive ? 'font-semibold text-nav-active' : 'font-medium text-nav-text')} aria-hidden="true">
                  Lapor
                </span>
                <span aria-hidden="true" className="h-1 w-1" />
              </>
            )}
          </NavLink>
        </li>

        <li>
          <NavItem to="/profil" label="Profil" icon={UserRound} />
        </li>
        <li>
          <LogoutButton className={cn(itemBase, 'font-semibold text-[#D92D20] hover:text-[#B42318] dark:text-[#FF8A80] dark:hover:text-[#FFB4AB]')}>
            <LogOut className="h-[22px] w-[22px]" aria-hidden="true" strokeWidth={2.1} />
            <span>Keluar</span>
            <span aria-hidden="true" className="h-1 w-1" />
          </LogoutButton>
        </li>
      </ul>
    </nav>
  )
}
