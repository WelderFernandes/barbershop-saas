import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

export function formatTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function formatDayOfWeek(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
  })
    .format(date)
    .replace(".", "")
}

export function formatDayOfMonth(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
  }).format(date)
}

export function formatPhone(value: string) {
  const v = value.replace(/\D/g, "").slice(0, 11)
  if (v.length <= 2) return v
  if (v.length <= 7) return `(${v.slice(0, 2)}) ${v.slice(2)}`
  return `(${v.slice(0, 2)}) ${v.slice(2, 7)} ${v.slice(7, 11)}`
}
