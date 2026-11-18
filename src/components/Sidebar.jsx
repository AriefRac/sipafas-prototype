import { NavLink } from 'react-router-dom'
import { CircleCheckBig, LogOut } from 'lucide-react'
import { cn } from '../lib/cn'
import LogoutButton from './LogoutButton'
import { NAV_ITEMS } from './navItems'

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-white" aria-hidden="true">
        <CircleCheckBig className="h-5 w-5" />
      </span>
      <span className="text-lg font-bold tracking-tight text-ink">SIPAFAS</span>
    </div>
  )
}

export default function Sidebar() {
  return (
    <aside className="vt-sidebar fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-surface px-4 py-6 lg:flex">
      <div className="px-2">
        <Logo />
      </div>
      <nav aria-label="Navigasi utama" className="mt-8 flex-1">
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted">Menu</p>
        <ul className="mt-2 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex min-h-[44px] items-center gap-3 rounded-ctl px-3 text-sm font-medium transition-colors duration-150',
                    isActive ? 'bg-accent-soft text-accent-text' : 'text-muted hover:bg-surface2 hover:text-ink',
                  )
                }
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <LogoutButton className="flex min-h-[44px] items-center gap-3 rounded-ctl px-3 text-sm font-semibold text-[#D92D20] transition-colors duration-150 hover:bg-[#FEF3F2] hover:text-[#B42318] dark:text-[#FF8A80] dark:hover:bg-[#2A1618] dark:hover:text-[#FFB4AB]">
        <LogOut className="h-5 w-5" aria-hidden="true" />
        Keluar
      </LogoutButton>
    </aside>
  )
}
