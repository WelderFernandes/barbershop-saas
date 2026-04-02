'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mockAppointments, mockBarbers, mockServices } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { AppointmentStatusBadge } from '@/components/status-badge'
import { Appointment } from '@/lib/types'
import { HugeiconsIcon } from '@hugeicons/react'
import {
    Add01Icon,
    ArrowLeft01Icon,
    ArrowRight01Icon,
    Calendar01Icon,
    Clock01Icon,
    MoreHorizontalIcon,
    PencilEdit01Icon,
    Tick02Icon,
    Cancel01Icon,
    Search01Icon,
    FilterIcon,
    LayoutGridIcon,
    AlignLeftIcon,
    Call02Icon, StarIcon
} from '@hugeicons/core-free-icons'

const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)
const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

type ViewMode = 'day' | 'week'

function formatPrice(cents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100)
}

export default function AgendaPage() {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [viewMode, setViewMode] = useState<ViewMode>('day')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedBarber, setSelectedBarber] = useState('all')
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

    const filteredAppointments = useMemo(() => {
        return (mockAppointments as unknown as Appointment[]).filter(apt => {
            const aptDate = new Date(apt.date)
            const matchesDate = viewMode === 'day' 
                ? aptDate.toDateString() === selectedDate.toDateString()
                : true // Simplified for week view
            
            const matchesSearch = apt.clientName.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesBarber = selectedBarber === 'all' || apt.barberId === selectedBarber
            
            return matchesDate && matchesSearch && matchesBarber
        })
    }, [selectedDate, searchTerm, selectedBarber, viewMode])

    const navigateDate = (dir: 'prev' | 'next' | 'today') => {
        if (dir === 'today') {
            setSelectedDate(new Date())
            return
        }
        const newDate = new Date(selectedDate)
        if (viewMode === 'day') {
            newDate.setDate(selectedDate.getDate() + (dir === 'prev' ? -1 : 1))
        } else {
            newDate.setDate(selectedDate.getDate() + (dir === 'prev' ? -7 : 7))
        }
        setSelectedDate(newDate)
    }

    const getWeekDates = () => {
        const dates = []
        const curr = new Date(selectedDate)
        const first = curr.getDate() - curr.getDay()
        for (let i = 0; i < 7; i++) {
            dates.push(new Date(curr.setDate(first + i)))
        }
        return dates
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Agenda</h1>
                    <p className="text-muted-foreground">Gerencie o fluxo de atendimentos da sua barbearia</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-muted p-1 rounded-2xl flex items-center gap-1">
                        <Button 
                            variant={viewMode === 'day' ? 'secondary' : 'ghost'} 
                            size="sm" 
                            className="rounded-xl px-4"
                            onClick={() => setViewMode('day')}
                        >
                            <HugeiconsIcon icon={AlignLeftIcon} className="w-4 h-4 mr-2" />
                            Dia
                        </Button>
                        <Button 
                            variant={viewMode === 'week' ? 'secondary' : 'ghost'} 
                            size="sm" 
                            className="rounded-xl px-4"
                            onClick={() => setViewMode('week')}
                        >
                            <HugeiconsIcon icon={LayoutGridIcon} className="w-4 h-4 mr-2" />
                            Semana
                        </Button>
                    </div>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger
                      render={
                        <Button className="rounded-2xl px-6 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20">
                          <HugeiconsIcon icon={Add01Icon} className="w-4 h-4 mr-2" strokeWidth={2.5} />
                          Novo Agendamento
                        </Button>
                      }
                    />
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Novo Agendamento</DialogTitle>
                            <DialogDescription>Preencha os detalhes para agendar um novo serviço.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="client">Cliente</Label>
                                    <Input id="client" placeholder="Nome do cliente" className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">WhatsApp</Label>
                                    <Input id="phone" placeholder="(00) 00000-0000" className="rounded-xl" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Data</Label>
                                    <Input type="date" className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Horário</Label>
                                    <Select>
                                        <SelectTrigger className="rounded-xl">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timeSlots.slice(8, 20).map(t => (
                                                <SelectItem key={t} value={t}>{t}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Barbeiro</Label>
                                <Select>
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder="Selecione o barbeiro" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockBarbers.map(b => (
                                          <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Serviço</Label>
                                <Select>
                                    <SelectTrigger className="rounded-xl">
                                        <SelectValue placeholder="Selecione o serviço" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockServices.map(s => (
                                          <SelectItem key={s.id} value={s.id}>{s.name} - {formatPrice(s.price)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Observações</Label>
                                <Textarea id="notes" placeholder="Detalhes adicionais..." className="rounded-xl min-h-[80px]" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" className="rounded-xl" onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
                            <Button className="rounded-xl px-8 bg-accent text-accent-foreground">Agendar</Button>
                        </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
            </div>

            <Card className="bg-card border-border shadow-md rounded-3xl overflow-hidden">
                <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" onClick={() => navigateDate('prev')} className="rounded-full w-8 h-8">
                                    <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => navigateDate('next')} className="rounded-full w-8 h-8">
                                    <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
                                </Button>
                                <Button variant="secondary" size="sm" onClick={() => navigateDate('today')} className="rounded-xl font-semibold px-4 ml-1">
                                    Hoje
                                </Button>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-bold text-lg leading-tight">
                                    {selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </h3>
                                <span className="text-xs text-muted-foreground font-medium capitalize">
                                    {viewMode === 'day' ? selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' }) : 'Visão Semanal'}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                                <Input 
                                    placeholder="Buscar cliente..." 
                                    className="pl-9 w-full sm:w-[240px] bg-muted/50 border-transparent rounded-2xl focus:bg-background transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={selectedBarber} onValueChange={(val: string | null) => setSelectedBarber(val ?? 'all')}>
                                <SelectTrigger className="w-[180px] bg-muted/50 border-transparent rounded-2xl">
                                    <HugeiconsIcon icon={FilterIcon} className="w-4 h-4 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder="Barbeiro" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    {mockBarbers.map(b => (
                                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {/* Day View Grid */}
                    {viewMode === 'day' && (
                        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 h-[800px]">
                            <div className="md:col-span-3 lg:col-span-4 overflow-y-auto overflow-x-hidden border-r border-border custom-scrollbar">
                                <div className="relative min-h-full">
                                    {/* Time indicators */}
                                    {timeSlots.map((time) => (
                                        <div key={time} className="group relative flex h-20 items-start border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                                            <div className="sticky left-0 flex w-20 flex-col items-center justify-center py-4 bg-background/80 backdrop-blur-sm z-10">
                                                <span className="text-xs font-bold text-muted-foreground">{time}</span>
                                            </div>
                                            
                                            <div className="flex-1 px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="sm" className="text-[10px] text-muted-foreground hover:text-accent font-bold uppercase tracking-wider rounded-lg h-7">
                                                    <HugeiconsIcon icon={Add01Icon} className="w-3 h-3 mr-1" />
                                                    Disponível
                                                </Button>
                                            </div>

                                            {/* Render appointments in this slot */}
                                            <div className="absolute inset-y-0 left-20 right-4 flex gap-2 p-2">
                                                {filteredAppointments.filter(apt => {
                                                    const d = new Date(apt.date)
                                                    const aptTime = `${d.getHours().toString().padStart(2, '0')}:00`
                                                    return aptTime === time
                                                }).map((apt) => (
                                                    <div 
                                                        key={apt.id}
                                                        className={cn(
                                                            "w-full h-full rounded-2xl border-l-4 p-3 shadow-md flex flex-col justify-between transition-all hover:scale-[1.01] hover:shadow-lg cursor-pointer",
                                                            apt.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-900 border-emerald-500" :
                                                            apt.status === 'CANCELLED' ? "bg-red-50 text-red-900 border-red-500 opacity-60" :
                                                            apt.status === 'IN_PROGRESS' ? "bg-amber-50 text-amber-900 border-amber-500" :
                                                            "bg-blue-50 text-blue-900 border-blue-500"
                                                        )}
                                                        onClick={() => setSelectedAppointment(apt)}
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="min-w-0">
                                                                <h4 className="font-bold text-sm truncate leading-none">{apt.clientName}</h4>
                                                                <span className="text-[10px] opacity-70 font-medium uppercase tracking-tighter">{apt.service.name}</span>
                                                            </div>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger
                                                                    render={
                                                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-black/5" onClick={(e) => e.stopPropagation()}>
                                                                            <HugeiconsIcon icon={MoreHorizontalIcon} className="w-3 h-3" />
                                                                        </Button>
                                                                    }
                                                                />
                                                                <DropdownMenuContent align="end" className="rounded-2xl">
                                                                    <DropdownMenuItem className="rounded-xl">
                                                                        <HugeiconsIcon icon={PencilEdit01Icon} className="w-4 h-4 mr-2" />
                                                                        Detalhes
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem className="rounded-xl">
                                                                        <HugeiconsIcon icon={Tick02Icon} className="w-4 h-4 mr-2" />
                                                                        Check-in
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem className="text-destructive rounded-xl">
                                                                        <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4 mr-2" />
                                                                        Cancelar
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <div className="flex items-center gap-1.5 min-w-0">
                                                                <Avatar className={cn("w-5 h-5 border border-white", apt.status === 'CANCELLED' && "grayscale")}>
                                                                    <AvatarImage src={apt.barber.avatarUrl || undefined} />
                                                                    <AvatarFallback className="text-[8px] bg-white text-black font-bold">
                                                                      {apt.barber.name.split(' ').map((n: string) => n[0]).join('')}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <span className="text-[9px] font-bold opacity-80 truncate">{apt.barber.name}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <HugeiconsIcon icon={Clock01Icon} className="w-2.5 h-2.5 opacity-60" />
                                                                <span className="text-[9px] font-black">{apt.service.duration}min</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Day info sidebar */}
                            <div className="hidden md:flex flex-col p-6 space-y-8 bg-muted/10">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <HugeiconsIcon icon={AlignLeftIcon} className="w-4 h-4 text-accent" />
                                        Estatísticas
                                    </h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="bg-background border border-border p-4 rounded-3xl shadow-sm">
                                            <p className="text-xs text-muted-foreground font-semibold">Agendamentos</p>
                                            <p className="text-3xl font-black">{filteredAppointments.length}</p>
                                            <div className="mt-2 flex gap-1 h-1 rounded-full overflow-hidden bg-muted">
                                                <div className="bg-emerald-500 h-full" style={{ width: '40%' }} />
                                                <div className="bg-blue-500 h-full" style={{ width: '35%' }} />
                                                <div className="bg-amber-500 h-full" style={{ width: '15%' }} />
                                                <div className="bg-red-500 h-full" style={{ width: '10%' }} />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between px-2">
                                            <span className="text-xs text-muted-foreground font-medium">Receita Est.</span>
                                            <span className="font-bold text-accent">
                                              {formatPrice(filteredAppointments.reduce((acc, a) => acc + (a.service?.price || 0), 0))}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <HugeiconsIcon icon={StarIcon} className="w-4 h-4 text-amber-500" />
                                        Barbeiros
                                    </h4>
                                    <div className="space-y-4">
                                        {mockBarbers.filter(b => b.isActive).map((barber) => (
                                            <div key={barber.id} className="flex items-center gap-3">
                                                <Avatar className="w-8 h-8 ring-2 ring-background">
                                                    <AvatarImage src={barber.avatarUrl || undefined} />
                                                    <AvatarFallback className="bg-accent/10 text-accent text-[10px] font-bold">
                                                        {barber.name.split(' ').map((n: string) => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold truncate leading-none mb-1">{barber.name}</p>
                                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                                        <span className="flex items-center gap-0.5"><HugeiconsIcon icon={StarIcon} className="w-2 h-2 text-amber-500 fill-amber-500" /> 4.9</span>
                                                        <span className="w-1 h-1 rounded-full bg-border" />
                                                        <span>{filteredAppointments.filter(a => a.barberId === barber.id).length} apt.</span>
                                                    </div>
                                                </div>
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {viewMode === 'week' && (
                        <div className="h-[800px] overflow-auto border-t border-border custom-scrollbar">
                            <div className="grid grid-cols-8 min-w-[1000px] divide-x divide-border">
                                <div className="bg-muted/5 sticky left-0 z-20">
                                    <div className="h-16 border-b border-border bg-muted/10 backdrop-blur-md" />
                                    {timeSlots.map(t => (
                                        <div key={t} className="h-20 flex items-center justify-center border-b border-border bg-muted/5">
                                            <span className="text-[10px] font-black text-muted-foreground/50">{t}</span>
                                        </div>
                                    ))}
                                </div>
                                {getWeekDates().map((date, idx) => (
                                    <div key={idx} className="flex-1 relative last:border-r-0">
                                        <div className={cn(
                                            "h-16 flex flex-col items-center justify-center border-b border-border sticky top-0 bg-background/95 backdrop-blur-md z-10",
                                            date.toDateString() === new Date().toDateString() && "bg-accent/5"
                                        )}>
                                            <span className="text-[10px] font-black uppercase text-muted-foreground">{weekDays[idx]}</span>
                                            <span className={cn(
                                                "text-lg font-black",
                                                date.toDateString() === new Date().toDateString() && "text-accent"
                                            )}>{date.getDate()}</span>
                                        </div>
                                        {timeSlots.map(t => (
                                            <div key={t} className="h-20 border-b border-border group hover:bg-muted/5 transition-colors relative">
                                                {filteredAppointments.filter(a => {
                                                    const ad = new Date(a.date)
                                                    const aptTime = `${ad.getHours().toString().padStart(2, '0')}:00`
                                                    return ad.toDateString() === date.toDateString() && aptTime === t
                                                }).map(a => (
                                                    <div 
                                                        key={a.id} 
                                                        className={cn(
                                                            "absolute inset-x-1 inset-y-1 rounded-xl p-1.5 flex flex-col shadow-sm border-l-2 cursor-pointer transition-all hover:z-30 hover:scale-105",
                                                            a.status === 'COMPLETED' ? "bg-emerald-50 border-emerald-500 text-emerald-900" :
                                                            a.status === 'CANCELLED' ? "bg-red-50 border-red-500 text-red-900 opacity-60" :
                                                            "bg-blue-50 border-blue-500 text-blue-900"
                                                        )}
                                                        onClick={() => setSelectedAppointment(a)}
                                                    >
                                                        <span className="text-[10px] font-black truncate leading-tight">{a.clientName}</span>
                                                        <span className="text-[8px] font-bold opacity-70 truncate">{a.service.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Sheet open={!!selectedAppointment} onOpenChange={(open) => !open && setSelectedAppointment(null)}>
                <SheetContent className="sm:max-w-md rounded-l-[40px] border-l-0 shadow-2xl">
                    {selectedAppointment && (
                        <div className="h-full flex flex-col pt-6">
                            <SheetHeader className="pb-8 border-b border-border px-2">
                                <div className="flex items-center gap-4 mb-4">
                                    <Avatar className="w-16 h-16 ring-4 ring-accent/10">
                                        <AvatarFallback className="bg-accent/10 text-accent text-xl font-black">
                                          {selectedAppointment.clientName.split(' ').map((n: string) => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <SheetTitle className="text-2xl font-black tracking-tight">{selectedAppointment.clientName}</SheetTitle>
                                        <SheetDescription className="flex items-center gap-2 font-bold text-accent">
                                            <HugeiconsIcon icon={Call02Icon} className="w-3 h-3" />
                                            {selectedAppointment.clientPhone || 'Sem número'}
                                        </SheetDescription>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <AppointmentStatusBadge status={selectedAppointment.status} className="rounded-xl px-4 py-1 h-auto text-[10px]" />
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-muted text-[10px] font-bold">
                                        <HugeiconsIcon icon={Calendar01Icon} className="w-3 h-3" />
                                        {new Date(selectedAppointment.date).toLocaleDateString('pt-BR')}
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-muted text-[10px] font-bold">
                                        <HugeiconsIcon icon={Clock01Icon} className="w-3 h-3" />
                                        {new Date(selectedAppointment.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </SheetHeader>
                            
                            <div className="flex-1 overflow-y-auto py-8 px-2 space-y-8 custom-scrollbar">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Serviço & Barbeiro</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-3xl bg-muted/30 border border-border">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Serviço</p>
                                            <p className="font-black text-sm">{selectedAppointment.service.name}</p>
                                            <p className="text-accent font-black mt-2 text-lg">{formatPrice(selectedAppointment.service.price)}</p>
                                        </div>
                                        <div className="p-4 rounded-3xl bg-muted/30 border border-border text-center">
                                            <Avatar className="w-10 h-10 mx-auto mb-2 ring-2 ring-background">
                                                <AvatarImage src={selectedAppointment.barber.avatarUrl || undefined} />
                                                <AvatarFallback className="text-[10px]">
                                                  {selectedAppointment.barber.name.split(' ').map((n: string) => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Barbeiro</p>
                                            <p className="font-black text-sm">{selectedAppointment.barber.name}</p>
                                        </div>
                                    </div>
                                </div>

                                {selectedAppointment.notes && (
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Observações</h4>
                                        <div className="p-4 rounded-3xl bg-amber-50/50 border border-amber-100 text-amber-900 italic text-sm">
                                            &quot;{selectedAppointment.notes}&quot;
                                        </div>
                                    </div>
                                )}
                            </div>

                            <SheetFooter className="p-6 border-t border-border flex-row gap-3">
                                <Button variant="outline" className="flex-1 rounded-2xl py-6 font-bold border-2" onClick={() => setSelectedAppointment(null)}>
                                    Voltar
                                </Button>
                                <Button className="flex-1 rounded-2xl py-6 font-bold bg-accent text-accent-foreground shadow-lg shadow-accent/30">
                                    <HugeiconsIcon icon={Tick02Icon} className="w-5 h-5 mr-2" />
                                    Check-in
                                </Button>
                            </SheetFooter>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
