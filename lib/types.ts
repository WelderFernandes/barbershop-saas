export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'owner' | 'barber' | 'admin'
}

export interface Barbershop {
  id: string
  name: string
  logo?: string
  address: string
  phone: string
  email: string
  plan: 'starter' | 'professional' | 'enterprise'
}

export interface Barber {
  id: string
  name: string
  phone?: string | null
  avatarUrl?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Removido o Client global por enquanto, pois o Appointment usa clientName/clientPhone
// Se necessário para uma página de clientes futura, podemos re-adicionar.

export interface Service {
  id: string
  name: string
  description?: string | null
  price: number
  duration: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Appointment {
  id: string
  date: string
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  clientName: string
  clientPhone?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
  barberId: string
  barber: Pick<Barber, 'id' | 'name' | 'avatarUrl'>
  serviceId: string
  service: Pick<Service, 'id' | 'name' | 'price' | 'duration'>
}

export interface Transaction {
  id: string
  type: 'income' | 'expense'
  category: string
  description: string
  amount: number
  date: string
  appointmentId?: string
}

export interface DashboardMetrics {
  todayAppointments: number
  weeklyRevenue: number
  monthlyRevenue: number
  totalClients: number
  appointmentsGrowth: number
  revenueGrowth: number
  clientsGrowth: number
}

export type AppointmentStatus = Appointment["status"]
export type PlanType = Barbershop["plan"]

export interface BusinessHour {
  id: string
  dayOfWeek: number
  openTime: string | null
  closeTime: string | null
  isActive: boolean
}

export interface BlockedSlot {
  id: string
  startTime: string
  endTime: string
  reason?: string | null
  recurrence: "NONE" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"
  barberId?: string | null
  barber?: { id: string; name: string } | null
}
