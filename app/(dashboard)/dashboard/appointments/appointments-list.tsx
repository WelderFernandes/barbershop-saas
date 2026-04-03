"use client"

import { useState, useTransition, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} from "@/lib/actions/appointment"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { AppointmentStatusBadge } from "@/components/status-badge"
import { Appointment, Barber, Service, BusinessHour, BlockedSlot } from "@/lib/types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  MoreHorizontalIcon,
  PencilEdit01Icon,
  Tick02Icon,
  Cancel01Icon,
  Call02Icon,
  Mail01Icon,
  Search01Icon,
  WhatsappIcon,
  ShoppingBag01Icon,
  Calendar02Icon,
  Clock01Icon,
  UserIcon,
  CheckListIcon,
} from "@hugeicons/core-free-icons"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

// ═══════════════════════════════════════════════════════
// Constantes e Utilitários
// ═══════════════════════════════════════════════════════

const HOURS = Array.from(
  { length: 13 },
  (_, i) => `${(i + 8).toString().padStart(2, "0")}:00`
)

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100)
}

function formatDateToISO(date: Date) {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  return `${year}-${month}-${day}`
}

// ═══════════════════════════════════════════════════════
// Componente Principal
// ═══════════════════════════════════════════════════════

export function AppointmentsList({
  appointments,
  barbers,
  services,
  businessHours,
  blockedSlots,
}: {
  appointments: Appointment[]
  barbers: Barber[]
  services: Service[]
  businessHours: BusinessHour[]
  blockedSlots: BlockedSlot[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedBarber, setSelectedBarber] = useState("Todos")
  const [selectedStatus, setSelectedStatus] = useState("Todos")
  const [selectedService, setSelectedService] = useState("Todos")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [newAppointmentOpen, setNewAppointmentOpen] = useState(false)

  // Estados do formulário (Novo Agendamento)
  const [formClientName, setFormClientName] = useState("")
  const [formClientPhone, setFormClientPhone] = useState("")
  const [formBarberId, setFormBarberId] = useState("")
  const [formServiceId, setFormServiceId] = useState("")
  const [formDate, setFormDate] = useState("")
  const [formTime, setFormTime] = useState("")
  const [formNotes, setFormNotes] = useState("")

  const navigateDate = (dir: "prev" | "next") => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() + (dir === "prev" ? -1 : 1))
    setSelectedDate(newDate)
  }

  // Filtrar agendamentos reais
  const filteredAppointments = useMemo(() => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const day = selectedDate.getDate()

    return appointments.filter((apt) => {
      const d = new Date(apt.date)
      const matchesDate =
        d.getFullYear() === year &&
        d.getMonth() === month &&
        d.getDate() === day
      const matchesBarber =
        selectedBarber === "Todos" || apt.barberId === selectedBarber
      const matchesStatus =
        selectedStatus === "Todos" || apt.status === selectedStatus
      const matchesService =
        selectedService === "Todos" || apt.serviceId === selectedService
      const matchesSearch = apt.clientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

      return (
        matchesDate &&
        matchesBarber &&
        matchesStatus &&
        matchesService &&
        matchesSearch
      )
    })
  }, [
    appointments,
    selectedDate,
    selectedBarber,
    selectedStatus,
    selectedService,
    searchTerm,
  ])

  // Estatísticas do dia
  const stats = useMemo(() => {
    const dayApts = filteredAppointments
    return {
      total: dayApts.length,
      confirmed: dayApts.filter((a) => a.status === "CONFIRMED").length,
      completed: dayApts.filter((a) => a.status === "COMPLETED").length,
      revenue: dayApts
        .filter((a) => a.status !== "CANCELLED")
        .reduce((acc, a) => acc + (a.service?.price || 0), 0),
    }
  }, [filteredAppointments])

  // Ações
  async function handleStatusChange(id: string, status: Appointment["status"]) {
    startTransition(async () => {
      await updateAppointmentStatus({ id, status })
      router.refresh()
      if (selectedAppointment?.id === id) {
        setSelectedAppointment(null)
      }
    })
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir?")) return
    startTransition(async () => {
      await deleteAppointment(id)
      router.refresh()
      setSelectedAppointment(null)
    })
  }

  async function handleCreateAppointment(e: React.FormEvent) {
    e.preventDefault()
    if (!formDate || !formTime) return

    const dateTime = new Date(`${formDate}T${formTime}:00`)

    startTransition(async () => {
      try {
        await createAppointment({
          date: dateTime.toISOString(),
          clientName: formClientName,
          clientPhone: formClientPhone || undefined,
          barberId: formBarberId || barbers[0]?.id,
          serviceId: formServiceId || services[0]?.id,
          notes: formNotes || undefined,
        })
        setNewAppointmentOpen(false)
        // Reset form
        setFormClientName("")
        setFormClientPhone("")
        setFormNotes("")
        router.refresh()
      } catch (err) {
        alert(err instanceof Error ? err.message : "Erro ao agendar")
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header com Filtros */}

      <InputGroup className="max-w-full md:max-w-md lg:max-w-lg">
        <InputGroupInput
          placeholder="Buscar cliente..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <InputGroupAddon>
          <HugeiconsIcon
            icon={Search01Icon}
            className="h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-accent"
          />
        </InputGroupAddon>
      </InputGroup>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Select
            value={selectedBarber}
            onValueChange={(val: string | null) =>
              setSelectedBarber(val ?? "Todos")
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Barbeiro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos os Barbeiros</SelectItem>
              {barbers.map((barber) => (
                <SelectItem key={barber.id} value={barber.name}>
                  {barber.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedStatus}
            onValueChange={(val: string | null) =>
              setSelectedStatus(val ?? "Todos")
            }
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos Status</SelectItem>
              <SelectItem value="SCHEDULED">Agendado</SelectItem>
              <SelectItem value="CONFIRMED">Confirmado</SelectItem>
              <SelectItem value="IN_PROGRESS">Em Atendimento</SelectItem>
              <SelectItem value="COMPLETED">Concluído</SelectItem>
              <SelectItem value="CANCELLED">Cancelado</SelectItem>
              <SelectItem value="NO_SHOW">Não Compareceu</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedService}
            onValueChange={(val: string | null) =>
              setSelectedService(val ?? "Todos")
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Serviço" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos Serviços</SelectItem>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.name}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog
            open={newAppointmentOpen}
            onOpenChange={setNewAppointmentOpen}
          >
            <DialogTrigger
              render={
                <Button>
                  <HugeiconsIcon icon={Add01Icon} className="mr-2 h-4 w-4" />
                  Novo Agendamento
                </Button>
              }
            />
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Novo Agendamento</DialogTitle>
                <DialogDescription>
                  Preencha os dados do cliente e escolha o horário.
                </DialogDescription>
              </DialogHeader>
              <form
                id="new-apt-form"
                onSubmit={handleCreateAppointment}
                className="space-y-4 py-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Nome do Cliente</Label>
                    <Input
                      id="clientName"
                      placeholder="Ex: João Silva"
                      value={formClientName}
                      onChange={(e) => setFormClientName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientPhone">Telefone</Label>
                    <Input
                      id="clientPhone"
                      placeholder="(11) 99999-9999"
                      value={formClientPhone}
                      onChange={(e) => setFormClientPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Horário</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Barbeiro</Label>
                  <Select
                    value={formBarberId}
                    onValueChange={(val: string | null) =>
                      setFormBarberId(val ?? "")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um barbeiro" />
                    </SelectTrigger>
                    <SelectContent>
                      {barbers.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Serviço</Label>
                  <Select
                    value={formServiceId}
                    onValueChange={(val: string | null) =>
                      setFormServiceId(val ?? "")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name} ({formatPrice(s.price)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    placeholder="Adicione observações se necessário..."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </form>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setNewAppointmentOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" form="new-apt-form" disabled={isPending}>
                  {isPending ? "Agendando..." : "Criar Agendamento"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDate("prev")}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDate("next")}
            >
              <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedDate(new Date())}
            >
              Hoje
            </Button>
            <div className="ml-2 font-medium">
              {selectedDate.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Grid de Horários */}
        <div className="lg:col-span-3">
          <Card className="border-none shadow-sm dark:bg-muted/20">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {HOURS.map((hour) => {
                  const hourAppointments = filteredAppointments.filter(
                    (apt) => {
                      const d = new Date(apt.date)
                      const aptHour = d.getHours().toString().padStart(2, "0")
                      return `${aptHour}:00` === hour
                    }
                  )

                  return (
                    <div
                      key={hour}
                      className="group flex min-h-[100px] transition-colors hover:bg-accent/5"
                    >
                      <div className="flex w-20 flex-col items-center justify-center border-r border-border py-4 text-sm font-medium text-muted-foreground">
                        {hour}
                      </div>
                      <div className="flex flex-1 flex-col gap-2 p-3">
                        {(() => {
                          // 1. Verificar se é um agendamento real
                          if (hourAppointments.length > 0) {
                            return hourAppointments.map((appointment) => (
                              <div
                                key={appointment.id}
                                className={cn(
                                  "flex w-full cursor-pointer items-center justify-between rounded-xl border p-4 transition-all hover:shadow-md",
                                  appointment.status === "CANCELLED"
                                    ? "border-muted bg-muted/50 opacity-60"
                                    : "border-border bg-card hover:border-accent/50"
                                )}
                                onClick={() => setSelectedAppointment(appointment)}
                              >
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-10 w-10 border-2 border-background">
                                    <AvatarFallback className="bg-accent/10 font-semibold text-accent">
                                      {appointment.clientName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-semibold">{appointment.clientName}</h4>
                                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground uppercase">
                                        {new Date(appointment.date).toLocaleTimeString("pt-BR", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {appointment.service.name} • {appointment.barber.name}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="hidden text-right sm:block">
                                    <p className="text-sm font-bold text-accent">
                                      {formatPrice(appointment.service.price)}
                                    </p>
                                    <p className="text-[10px] tracking-wider text-muted-foreground uppercase">
                                      {appointment.service.duration} min
                                    </p>
                                  </div>
                                  <AppointmentStatusBadge
                                    status={appointment.status}
                                    className="hidden sm:flex"
                                  />
                                  <DropdownMenu>
                                    <DropdownMenuTrigger
                                      render={
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <HugeiconsIcon
                                            icon={MoreHorizontalIcon}
                                            className="h-4 w-4"
                                          />
                                        </Button>
                                      }
                                    />
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() => setSelectedAppointment(appointment)}
                                      >
                                        <HugeiconsIcon icon={PencilEdit01Icon} className="mr-2 h-4 w-4" />
                                        Detalhes
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleStatusChange(appointment.id, "CONFIRMED")
                                        }
                                      >
                                        <HugeiconsIcon icon={Tick02Icon} className="mr-2 h-4 w-4" />
                                        Confirmar
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        className="text-destructive focus:text-destructive"
                                        onClick={() =>
                                          handleStatusChange(appointment.id, "CANCELLED")
                                        }
                                      >
                                        <HugeiconsIcon icon={Cancel01Icon} className="mr-2 h-4 w-4" />
                                        Cancelar
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="text-destructive focus:text-destructive"
                                        onClick={() => handleDelete(appointment.id)}
                                      >
                                        <HugeiconsIcon icon={Cancel01Icon} className="mr-2 h-4 w-4" />
                                        Excluir
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            ))
                          }

                          // 2. Verificar Horário de Funcionamento
                          const dayOfWeek = selectedDate.getDay()
                          const businessHour = businessHours.find((bh) => bh.dayOfWeek === dayOfWeek)
                          
                          if (!businessHour || !businessHour.isActive || !businessHour.openTime || !businessHour.closeTime) {
                            return (
                              <div className="flex w-full items-center justify-between rounded-xl border border-dashed bg-muted/10 p-4 opacity-50">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                  Estabelecimento Fechado
                                </span>
                              </div>
                            )
                          }

                          const [hourH, hourM] = hour.split(":").map(Number)
                          const [openH, openM] = businessHour.openTime.split(":").map(Number)
                          const [closeH, closeM] = businessHour.closeTime.split(":").map(Number)

                          const hourTotal = hourH * 60 + hourM
                          const openTotal = openH * 60 + openM
                          const closeTotal = closeH * 60 + closeM

                          if (hourTotal < openTotal || hourTotal >= closeTotal) {
                            return (
                              <div className="flex w-full items-center justify-between rounded-xl border border-dashed bg-muted/10 p-4 opacity-50">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                  Fora do Expediente
                                </span>
                              </div>
                            )
                          }

                          // 3. Verificar Bloqueios de Agenda
                          const startOfDay = new Date(selectedDate)
                          startOfDay.setHours(0, 0, 0, 0)
                          
                          const hourDate = new Date(selectedDate)
                          hourDate.setHours(hourH, hourM, 0, 0)

                          const activeBlockedSlot = blockedSlots.find((slot) => {
                            const slotStart = new Date(slot.startTime)
                            const slotEnd = new Date(slot.endTime)
                            
                            // Somente se for para o barbeiro selecionado ou para todos
                            const barberMatch = selectedBarber === "Todos" || (!slot.barberId) || (barbers.find(b => b.name === selectedBarber)?.id === slot.barberId)
                            
                            if (!barberMatch) return false

                            // Verificação simplificada de horário (Recorrência não inclusa aqui para simplicidade de UI, apenas o slot real)
                            return hourDate >= slotStart && hourDate < slotEnd
                          })

                          if (activeBlockedSlot) {
                            return (
                              <div className="flex w-full items-center justify-between rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-amber-900">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                                    <HugeiconsIcon icon={Clock01Icon} className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold uppercase tracking-wider">Horário Bloqueado</p>
                                    <p className="text-[10px] opacity-70 italic">{activeBlockedSlot.reason || "Intervalo planejado"}</p>
                                  </div>
                                </div>
                              </div>
                            )
                          }

                          // 4. Horário Livre
                          return (
                            <div className="flex w-full items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
                              <span className="text-xs italic text-muted-foreground">
                                Horário disponível
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-muted-foreground hover:text-foreground"
                                onClick={() => {
                                  setFormTime(hour)
                                  setFormDate(formatDateToISO(selectedDate))
                                  setNewAppointmentOpen(true)
                                }}
                              >
                                <HugeiconsIcon icon={Add01Icon} className="mr-1 h-3 w-3" />
                                Agendar
                              </Button>
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Sidebar */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm dark:bg-muted/20">
            <CardHeader>
              <CardTitle className="text-lg">Resumo do Dia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total de Agendados
                </span>
                <span className="font-bold">{stats.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Confirmados
                </span>
                <span className="font-bold text-emerald-500">
                  {stats.confirmed}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Concluídos
                </span>
                <span className="font-bold text-blue-500">
                  {stats.completed}
                </span>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Receita Estimada</span>
                  <span className="text-lg font-bold text-accent">
                    {formatPrice(stats.revenue)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm dark:bg-muted/20">
            <CardHeader>
              <CardTitle className="text-lg">Barbeiros</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {barbers.map((barber) => (
                  <div
                    key={barber.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={barber.avatarUrl || undefined} />
                        <AvatarFallback className="text-[10px]">
                          {barber.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{barber.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {barber.isActive ? "Disponível" : "Ausente"}
                        </p>
                      </div>
                    </div>
                    {barber.isActive && (
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sheet de Detalhes */}
      <Sheet
        open={!!selectedAppointment}
        onOpenChange={(open) => !open && setSelectedAppointment(null)}
      >
        <SheetContent className="flex flex-col overflow-hidden border-l-0 p-0 sm:max-w-md">
          {selectedAppointment && (
            <div className="flex h-full flex-col overflow-hidden">
              {/* Header com Gradiente */}
              <div className="relative flex h-32 flex-col justify-end bg-linear-to-br from-accent/20 to-accent/5 p-6">
                <SheetHeader className="space-y-0 text-left">
                  <div className="mb-2 flex items-center justify-between">
                    <AppointmentStatusBadge
                      status={selectedAppointment.status}
                    />
                    <span className="rounded-full bg-background/50 px-2 py-1 text-[10px] font-bold tracking-tighter text-muted-foreground uppercase backdrop-blur-sm">
                      ID: #{selectedAppointment.id.slice(-4)}
                    </span>
                  </div>
                  <SheetTitle className="flex items-center gap-2 text-2xl font-black tracking-tight">
                    <HugeiconsIcon
                      icon={Calendar02Icon}
                      className="h-5 w-5 text-accent"
                    />
                    Agendamento
                  </SheetTitle>
                </SheetHeader>
              </div>

              <div className="flex-1 space-y-8 overflow-y-auto p-6">
                {/* Data e Hora Card */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 rounded-2xl border border-border/50 bg-muted/30 p-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <HugeiconsIcon
                        icon={Calendar02Icon}
                        className="h-3 w-3"
                      />
                      <span className="text-[10px] font-bold tracking-wider uppercase">
                        Data
                      </span>
                    </div>
                    <p className="truncate text-sm font-bold">
                      {new Date(selectedAppointment.date).toLocaleDateString(
                        "pt-BR",
                        { day: "2-digit", month: "short", year: "numeric" }
                      )}
                    </p>
                  </div>
                  <div className="space-y-1 rounded-2xl border border-border/50 bg-muted/30 p-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <HugeiconsIcon icon={Clock01Icon} className="h-3 w-3" />
                      <span className="text-[10px] font-bold tracking-wider uppercase">
                        Horário
                      </span>
                    </div>
                    <p className="text-sm font-bold">
                      {new Date(selectedAppointment.date).toLocaleTimeString(
                        "pt-BR",
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </p>
                  </div>
                </div>

                {/* Cliente */}
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                    <HugeiconsIcon
                      icon={UserIcon}
                      className="h-3 w-3 text-accent"
                    />
                    Cliente
                  </h4>
                  <div className="flex items-center gap-4 rounded-3xl border border-border/50 bg-card p-4 shadow-sm">
                    <Avatar className="h-14 w-14 border-2 border-accent/20">
                      <AvatarFallback className="bg-accent/10 text-xl font-black text-accent">
                        {selectedAppointment.clientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-lg leading-tight font-bold">
                        {selectedAppointment.clientName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedAppointment.clientPhone ||
                          "Sem telefone cadastrado"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      className="h-11 flex-1 rounded-2xl font-bold transition-all hover:scale-[1.02]"
                      onClick={() =>
                        window.open(
                          `https://wa.me/55${selectedAppointment.clientPhone?.replace(/\D/g, "")}`,
                          "_blank"
                        )
                      }
                    >
                      <HugeiconsIcon
                        icon={WhatsappIcon}
                        className="mr-2 h-4 w-4 text-emerald-500"
                      />
                      WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(
                          `tel:${selectedAppointment.clientPhone}`,
                          "_self"
                        )
                      }
                      className="flex h-11 w-11 items-center justify-center rounded-2xl p-0 transition-all hover:scale-[1.02]"
                    >
                      <HugeiconsIcon icon={Call02Icon} className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Detalhes do Serviço */}
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                    <HugeiconsIcon
                      icon={ShoppingBag01Icon}
                      className="h-3 w-3 text-accent"
                    />
                    Serviço e Profissional
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-3xl border border-border/50 bg-muted/20 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10">
                          <HugeiconsIcon
                            icon={CheckListIcon}
                            className="h-5 w-5 text-accent"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold">
                            {selectedAppointment.service.name}
                          </p>
                          <p className="text-[10px] font-bold tracking-tighter text-muted-foreground uppercase">
                            {selectedAppointment.service.duration} minutos de
                            duração
                          </p>
                        </div>
                      </div>
                      <span className="text-lg font-black text-accent">
                        {formatPrice(selectedAppointment.service.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 rounded-full border border-border/50 bg-background p-3 px-4">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={
                            selectedAppointment.barber.avatarUrl || undefined
                          }
                        />
                        <AvatarFallback className="bg-accent/20 text-[8px]">
                          {selectedAppointment.barber.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <p className="flex-1 text-xs font-bold text-muted-foreground">
                        Profissional:{" "}
                        <span className="text-foreground">
                          {selectedAppointment.barber.name}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Observações */}
                {selectedAppointment.notes && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                      Observações
                    </h4>
                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm leading-relaxed text-amber-900 italic dark:text-amber-200">
                      &quot;{selectedAppointment.notes}&quot;
                    </div>
                  </div>
                )}
              </div>

              {/* Footer de Ações Rápidas */}
              <div className="mt-auto bg-background p-6 pt-0">
                <div className="space-y-3 rounded-3xl border border-border/50 bg-muted/10 p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      className="rounded-2xl bg-emerald-500 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:bg-emerald-600"
                      onClick={() =>
                        handleStatusChange(selectedAppointment.id, "CONFIRMED")
                      }
                      disabled={
                        selectedAppointment.status === "CONFIRMED" || isPending
                      }
                    >
                      <HugeiconsIcon
                        icon={Tick02Icon}
                        className="mr-2 h-4 w-4"
                      />
                      Confirmar
                    </Button>
                    <Button
                      className="rounded-2xl bg-blue-500 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] hover:bg-blue-600"
                      onClick={() =>
                        handleStatusChange(selectedAppointment.id, "COMPLETED")
                      }
                      disabled={
                        selectedAppointment.status === "COMPLETED" || isPending
                      }
                    >
                      <HugeiconsIcon
                        icon={Tick02Icon}
                        className="mr-2 h-4 w-4"
                      />
                      Concluir
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="rounded-2xl border-destructive/20 font-bold text-destructive transition-all hover:scale-[1.02] hover:bg-destructive hover:text-white"
                      onClick={() =>
                        handleStatusChange(selectedAppointment.id, "CANCELLED")
                      }
                      disabled={
                        selectedAppointment.status === "CANCELLED" || isPending
                      }
                    >
                      <HugeiconsIcon
                        icon={Cancel01Icon}
                        className="mr-2 h-4 w-4"
                      />
                      Cancelar
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-2xl border-border font-bold"
                      onClick={() => setSelectedAppointment(null)}
                    >
                      Fechar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
