import { CircleCheck, CircleX, Clock, ShieldCheck, Wrench, ClipboardList } from 'lucide-react'
import { cn } from '../lib/cn'

// Satu tabel untuk warna + ikon status. Dipakai juga oleh kartu ringkasan Beranda.
export const STATUS_STYLE = {
  Menunggu: {
    icon: Clock,
    chip: 'bg-[#FEF3C7] text-[#92400E] dark:bg-[#3A2A0A] dark:text-[#FCD34D]',
  },
  Diverifikasi: {
    icon: ShieldCheck,
    chip: 'bg-[#DBEAFE] text-[#1E40AF] dark:bg-[#172554] dark:text-[#93C5FD]',
  },
  Diproses: {
    icon: Wrench,
    chip: 'bg-[#EDE9FE] text-[#5B21B6] dark:bg-[#2E1A5E] dark:text-[#C4B5FD]',
  },
  Selesai: {
    icon: CircleCheck,
    chip: 'bg-[#DCFCE7] text-[#166534] dark:bg-[#0F2E1C] dark:text-[#86EFAC]',
  },
  Dibatalkan: {
    icon: CircleX,
    chip: 'bg-[#F1F1F4] text-[#4B4B5A] dark:bg-[#26262F] dark:text-[#C4C4CF]',
  },
  Total: {
    icon: ClipboardList,
    chip: 'bg-accent-soft text-accent-text',
  },
}

export default function StatusChip({ status, className }) {
  const style = STATUS_STYLE[status]
  const Icon = style.icon
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold',
        style.chip,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {status}
    </span>
  )
}
