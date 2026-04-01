'use client'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { AppointmentStatus } from '@/lib/types';

const appointmentStatusConfig: Record<AppointmentStatus, { label: string; className: string }> = {
  SCHEDULED: {
    label: 'Agendado',
    className: 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20',
  },
  CONFIRMED: {
    label: 'Confirmado',
    className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20',
  },
  IN_PROGRESS: {
    label: 'Em Atendimento',
    className: 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20',
  },
  COMPLETED: {
    label: 'Concluído',
    className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20',
  },
  CANCELLED: {
    label: 'Cancelado',
    className: 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20',
  },
  NO_SHOW: {
    label: 'Não Compareceu',
    className: 'bg-gray-500/10 text-gray-500 border-gray-500/20 hover:bg-gray-500/20',
  },
}

// Barber status is now a boolean 'isActive' in Prisma, mapping here for the badge
const barberStatusConfig: Record<'active' | 'inactive', { label: string; className: string }> = {
  active: {
    label: 'Ativo',
    className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20',
  },
  inactive: {
    label: 'Inativo',
    className: 'bg-gray-500/10 text-gray-500 border-gray-500/20 hover:bg-gray-500/20',
  },
}

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus
  className?: string
}

export function AppointmentStatusBadge({ status, className }: AppointmentStatusBadgeProps) {
  const config = appointmentStatusConfig[status]
  
  return (
    <Badge
      variant="outline"
      className={cn('font-medium', config.className, className)}
    >
      {config.label}
    </Badge>
  )
}

interface BarberStatusBadgeProps {
  isActive: boolean
  className?: string
}

export function BarberStatusBadge({ isActive, className }: BarberStatusBadgeProps) {
  const status = isActive ? 'active' : 'inactive'
  const config = barberStatusConfig[status]
  
  return (
    <Badge
      variant="outline"
      className={cn('font-medium', config.className, className)}
    >
      {config.label}
    </Badge>
  )
}
