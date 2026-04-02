"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} from "@/lib/actions/appointment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AppointmentStatusBadge } from "@/components/status-badge";
import { Appointment, Barber, Service } from "@/lib/types";
import { HugeiconsIcon } from "@hugeicons/react";
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
} from "@hugeicons/core-free-icons";

// ═══════════════════════════════════════════════════════
// Constantes e Utilitários
// ═══════════════════════════════════════════════════════

const HOURS = Array.from({ length: 13 }, (_, i) => `${(i + 8).toString().padStart(2, "0")}:00`);

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function formatDateToISO(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ═══════════════════════════════════════════════════════
// Componente Principal
// ═══════════════════════════════════════════════════════

export function AppointmentsList({
  appointments,
  barbers,
  services,
}: {
  appointments: Appointment[];
  barbers: Barber[];
  services: Service[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBarber, setSelectedBarber] = useState("Todos");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [selectedService, setSelectedService] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);

  // Estados do formulário (Novo Agendamento)
  const [formClientName, setFormClientName] = useState("");
  const [formClientPhone, setFormClientPhone] = useState("");
  const [formBarberId, setFormBarberId] = useState("");
  const [formServiceId, setFormServiceId] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const navigateDate = (dir: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (dir === "prev" ? -1 : 1));
    setSelectedDate(newDate);
  };

  // Filtrar agendamentos reais
  const filteredAppointments = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();

    return appointments.filter((apt) => {
      const d = new Date(apt.date);
      const matchesDate = d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
      const matchesBarber = selectedBarber === "Todos" || apt.barberId === selectedBarber;
      const matchesStatus = selectedStatus === "Todos" || apt.status === selectedStatus;
      const matchesService = selectedService === "Todos" || apt.serviceId === selectedService;
      const matchesSearch = apt.clientName.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesDate && matchesBarber && matchesStatus && matchesService && matchesSearch;
    });
  }, [appointments, selectedDate, selectedBarber, selectedStatus, selectedService, searchTerm]);

  // Estatísticas do dia
  const stats = useMemo(() => {
    const dayApts = filteredAppointments;
    return {
      total: dayApts.length,
      confirmed: dayApts.filter((a) => a.status === "CONFIRMED").length,
      completed: dayApts.filter((a) => a.status === "COMPLETED").length,
      revenue: dayApts
        .filter((a) => a.status !== "CANCELLED")
        .reduce((acc, a) => acc + (a.service?.price || 0), 0),
    };
  }, [filteredAppointments]);

  // Ações
  async function handleStatusChange(id: string, status: Appointment["status"]) {
    startTransition(async () => {
      await updateAppointmentStatus({ id, status });
      router.refresh();
      if (selectedAppointment?.id === id) {
        setSelectedAppointment(null);
      }
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    startTransition(async () => {
      await deleteAppointment(id);
      router.refresh();
      setSelectedAppointment(null);
    });
  }

  async function handleCreateAppointment(e: React.FormEvent) {
    e.preventDefault();
    if (!formDate || !formTime) return;

    const dateTime = new Date(`${formDate}T${formTime}:00`);
    
    startTransition(async () => {
      try {
        await createAppointment({
          date: dateTime.toISOString(),
          clientName: formClientName,
          clientPhone: formClientPhone || undefined,
          barberId: formBarberId || barbers[0]?.id,
          serviceId: formServiceId || services[0]?.id,
          notes: formNotes || undefined,
        });
        setNewAppointmentOpen(false);
        // Reset form
        setFormClientName("");
        setFormClientPhone("");
        setFormNotes("");
        router.refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Erro ao agendar");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Header com Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedBarber} onValueChange={(val: string | null) => setSelectedBarber(val ?? 'Todos')}>
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

          <Select value={selectedStatus} onValueChange={(val: string | null) => setSelectedStatus(val ?? 'Todos')}>
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

          <Select value={selectedService} onValueChange={(val: string | null) => setSelectedService(val ?? 'Todos')}>
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

          <div className="relative group">
            <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <Input 
              placeholder="Buscar cliente..." 
              className="pl-9 w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Dialog open={newAppointmentOpen} onOpenChange={setNewAppointmentOpen}>
            <DialogTrigger
              render={
                <Button>
                  <HugeiconsIcon icon={Add01Icon} className="w-4 h-4 mr-2" />
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
              <form id="new-apt-form" onSubmit={handleCreateAppointment} className="space-y-4 py-4">
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
                  <Select value={formBarberId} onValueChange={(val: string | null) => setFormBarberId(val ?? '')}>
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
                  <Select value={formServiceId} onValueChange={(val: string | null) => setFormServiceId(val ?? '')}>
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
                <Button variant="ghost" onClick={() => setNewAppointmentOpen(false)}>
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
            <Button variant="outline" size="icon" onClick={() => navigateDate('prev')}>
              <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigateDate('next')}>
              <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={() => setSelectedDate(new Date())}>
              Hoje
            </Button>
            <div className="ml-2 font-medium">
              {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
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
                  const hourAppointments = filteredAppointments.filter(apt => {
                    const d = new Date(apt.date);
                    const aptHour = d.getHours().toString().padStart(2, '0');
                    return `${aptHour}:00` === hour;
                  });

                  return (
                    <div key={hour} className="group flex min-h-[100px] hover:bg-accent/5 transition-colors">
                      <div className="flex w-20 flex-col items-center justify-center border-r border-border py-4 text-sm font-medium text-muted-foreground">
                        {hour}
                      </div>
                      <div className="flex flex-1 flex-col gap-2 p-3">
                        {hourAppointments.length > 0 ? (
                          hourAppointments.map((appointment) => (
                            <div 
                              key={appointment.id}
                              className={cn(
                                "flex w-full cursor-pointer items-center justify-between rounded-xl border p-4 transition-all hover:shadow-md",
                                appointment.status === 'CANCELLED' ? "bg-muted/50 border-muted opacity-60" : "bg-card border-border hover:border-accent/50"
                              )}
                              onClick={() => setSelectedAppointment(appointment)}
                            >
                              <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10 border-2 border-background">
                                  <AvatarFallback className="bg-accent/10 text-accent font-semibold">
                                    {appointment.clientName.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold">{appointment.clientName}</h4>
                                    <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase">
                                      {new Date(appointment.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{appointment.service.name} • {appointment.barber.name}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                  <p className="text-sm font-bold text-accent">{formatPrice(appointment.service.price)}</p>
                                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{appointment.service.duration} min</p>
                                </div>
                                <AppointmentStatusBadge status={appointment.status} className="hidden sm:flex" />
                                <DropdownMenu>
                                  <DropdownMenuTrigger
                                    render={
                                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                        <HugeiconsIcon icon={MoreHorizontalIcon} className="w-4 h-4" />
                                      </Button>
                                    }
                                  />
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => setSelectedAppointment(appointment)}>
                                    <HugeiconsIcon icon={PencilEdit01Icon} className="w-4 h-4 mr-2" />
                                    Detalhes
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, 'CONFIRMED')}>
                                    <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4 mr-2" />
                                    Confirmar
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => handleStatusChange(appointment.id, 'CANCELLED')}
                                  >
                                    <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4 mr-2" />
                                    Cancelar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => handleDelete(appointment.id)}
                                  >
                                    <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4 mr-2" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))
                      ) : (
                          <div className="flex w-full items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs text-muted-foreground italic">Horário disponível</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-muted-foreground text-xs hover:text-foreground"
                              onClick={() => {
                                setFormTime(hour);
                                setFormDate(formatDateToISO(selectedDate));
                                setNewAppointmentOpen(true);
                              }}
                            >
                              <HugeiconsIcon icon={Add01Icon} className="w-3 h-3 mr-1" />
                              Agendar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
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
                <span className="text-sm text-muted-foreground">Total de Agendados</span>
                <span className="font-bold">{stats.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Confirmados</span>
                <span className="font-bold text-emerald-500">{stats.confirmed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Concluídos</span>
                <span className="font-bold text-blue-500">{stats.completed}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Receita Estimada</span>
                  <span className="font-bold text-lg text-accent">{formatPrice(stats.revenue)}</span>
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
                  <div key={barber.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={barber.avatarUrl || undefined} />
                        <AvatarFallback className="text-[10px]">{barber.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{barber.name}</p>
                        <p className="text-[10px] text-muted-foreground">{barber.isActive ? "Disponível" : "Ausente"}</p>
                      </div>
                    </div>
                    {barber.isActive && <div className="h-2 w-2 rounded-full bg-emerald-500" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sheet de Detalhes */}
      <Sheet open={!!selectedAppointment} onOpenChange={(open) => !open && setSelectedAppointment(null)}>
        <SheetContent className="sm:max-w-md border-l-0 p-0 overflow-hidden flex flex-col">
          {selectedAppointment && (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Header com Gradiente */}
              <div className="relative h-32 bg-linear-to-br from-accent/20 to-accent/5 p-6 flex flex-col justify-end">
                <SheetHeader className="text-left space-y-0">
                  <div className="flex items-center justify-between mb-2">
                    <AppointmentStatusBadge status={selectedAppointment.status} />
                    <span className="text-[10px] font-bold text-muted-foreground bg-background/50 backdrop-blur-sm px-2 py-1 rounded-full uppercase tracking-tighter">
                      ID: #{selectedAppointment.id.slice(-4)}
                    </span>
                  </div>
                  <SheetTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
                    <HugeiconsIcon icon={Calendar02Icon} className="w-5 h-5 text-accent" />
                    Agendamento
                  </SheetTitle>
                </SheetHeader>
              </div>

              <div className="p-6 space-y-8 flex-1 overflow-y-auto">
                {/* Data e Hora Card */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-muted/30 border border-border/50 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <HugeiconsIcon icon={Calendar02Icon} className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Data</span>
                    </div>
                    <p className="text-sm font-bold truncate">
                      {new Date(selectedAppointment.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/30 border border-border/50 space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <HugeiconsIcon icon={Clock01Icon} className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Horário</span>
                    </div>
                    <p className="text-sm font-bold">
                      {new Date(selectedAppointment.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {/* Cliente */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <HugeiconsIcon icon={UserIcon} className="w-3 h-3 text-accent" />
                    Cliente
                  </h4>
                  <div className="flex items-center gap-4 p-4 rounded-3xl bg-card border border-border/50 shadow-sm">
                    <Avatar className="w-14 h-14 border-2 border-accent/20">
                      <AvatarFallback className="bg-accent/10 text-accent font-black text-xl">
                        {selectedAppointment.clientName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold text-lg leading-tight">{selectedAppointment.clientName}</p>
                      <p className="text-xs text-muted-foreground">{selectedAppointment.clientPhone || "Sem telefone cadastrado"}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      className="flex-1 rounded-2xl h-11 font-bold transition-all hover:scale-[1.02]"
                      onClick={() => window.open(`https://wa.me/55${selectedAppointment.clientPhone?.replace(/\D/g, '')}`, '_blank')}
                    >
                      <HugeiconsIcon icon={WhatsappIcon} className="w-4 h-4 mr-2 text-emerald-500" />
                      WhatsApp
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => window.open(`tel:${selectedAppointment.clientPhone}`, '_self')}
                      className="rounded-2xl h-11 w-11 p-0 flex items-center justify-center transition-all hover:scale-[1.02]"
                    >
                      <HugeiconsIcon icon={Call02Icon} className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Detalhes do Serviço */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <HugeiconsIcon icon={ShoppingBag01Icon} className="w-3 h-3 text-accent" />
                    Serviço e Profissional
                  </h4>
                  <div className="space-y-3">
                    <div className="p-4 rounded-3xl bg-muted/20 border border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center">
                          <HugeiconsIcon icon={CheckListIcon} className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{selectedAppointment.service.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">{selectedAppointment.service.duration} minutos de duração</p>
                        </div>
                      </div>
                      <span className="font-black text-lg text-accent">{formatPrice(selectedAppointment.service.price)}</span>
                    </div>

                    <div className="flex gap-3 items-center p-3 px-4 rounded-full border border-border/50 bg-background">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={selectedAppointment.barber.avatarUrl || undefined} />
                        <AvatarFallback className="text-[8px] bg-accent/20">{selectedAppointment.barber.name[0]}</AvatarFallback>
                      </Avatar>
                      <p className="text-xs font-bold text-muted-foreground flex-1">Profissional: <span className="text-foreground">{selectedAppointment.barber.name}</span></p>
                    </div>
                  </div>
                </div>

                {/* Observações */}
                {selectedAppointment.notes && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Observações</h4>
                    <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-sm text-amber-900 dark:text-amber-200 italic leading-relaxed">
                      &quot;{selectedAppointment.notes}&quot;
                    </div>
                  </div>
                )}
              </div>

              {/* Footer de Ações Rápidas */}
              <div className="p-6 pt-0 mt-auto bg-background">
                <div className="bg-muted/10 p-4 rounded-3xl border border-border/50 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      className="rounded-2xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                      onClick={() => handleStatusChange(selectedAppointment.id, 'CONFIRMED')}
                      disabled={selectedAppointment.status === 'CONFIRMED' || isPending}
                    >
                      <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4 mr-2" />
                      Confirmar
                    </Button>
                    <Button 
                      className="rounded-2xl font-bold bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
                      onClick={() => handleStatusChange(selectedAppointment.id, 'COMPLETED')}
                      disabled={selectedAppointment.status === 'COMPLETED' || isPending}
                    >
                      <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4 mr-2" />
                      Concluir
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline"
                      className="rounded-2xl font-bold border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all hover:scale-[1.02]"
                      onClick={() => handleStatusChange(selectedAppointment.id, 'CANCELLED')}
                      disabled={selectedAppointment.status === 'CANCELLED' || isPending}
                    >
                      <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button 
                      variant="outline"
                      className="rounded-2xl font-bold border-border"
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
  );
}

