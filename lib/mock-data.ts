import type { Barber, Service, Appointment, Transaction, DashboardMetrics } from '@/lib/types'

export const mockBarbers: Barber[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    phone: '(11) 99999-1111',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Rafael Oliveira',
    phone: '(11) 99999-2222',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'André Santos',
    phone: '(11) 99999-3333',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Corte Masculino',
    description: 'Corte tradicional com máquina e tesoura',
    duration: 30,
    price: 4500,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Corte Degradê',
    description: 'Corte moderno com degradê nas laterais',
    duration: 45,
    price: 5500,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Barba Completa',
    description: 'Aparar, modelar e toalha quente',
    duration: 30,
    price: 3500,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    barberId: '1',
    barber: { id: '1', name: 'Carlos Silva', avatarUrl: mockBarbers[0].avatarUrl },
    serviceId: '1',
    service: { id: '1', name: 'Corte Masculino', price: 4500, duration: 30 },
    date: '2024-01-16T09:00:00Z',
    status: 'CONFIRMED',
    clientName: 'João Mendes',
    clientPhone: '(11) 98888-1111',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    barberId: '2',
    barber: { id: '2', name: 'Rafael Oliveira', avatarUrl: mockBarbers[1].avatarUrl },
    serviceId: '2',
    service: { id: '2', name: 'Corte Degradê', price: 5500, duration: 45 },
    date: '2024-01-16T10:00:00Z',
    status: 'SCHEDULED',
    clientName: 'Pedro Costa',
    clientPhone: '(11) 98888-2222',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    category: 'Serviços',
    description: 'Combo Corte + Barba - João Mendes',
    amount: 75,
    date: '2024-01-15',
    appointmentId: '1',
  },
]

export const mockDashboardMetrics: DashboardMetrics = {
  todayAppointments: 12,
  weeklyRevenue: 4850,
  monthlyRevenue: 18500,
  totalClients: 342,
  appointmentsGrowth: 12.5,
  revenueGrowth: 8.3,
  clientsGrowth: 15.2,
}

export const weeklyRevenueData = [
  { day: 'Seg', value: 650 },
  { day: 'Ter', value: 820 },
  { day: 'Qua', value: 750 },
  { day: 'Qui', value: 890 },
  { day: 'Sex', value: 1100 },
  { day: 'Sáb', value: 1450 },
  { day: 'Dom', value: 0 },
]

export const monthlyData = [
  { month: 'Jan', revenue: 15200, appointments: 280 },
]

export const serviceDistribution = [
  { name: 'Corte', value: 45, color: 'var(--chart-1)' },
]
