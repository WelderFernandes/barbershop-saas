"use client"

import { useState, useTransition } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AddCircleIcon,
  Calendar01Icon,
  Note01Icon,
  UserCircleIcon,
  CheckmarkBadge01Icon,
} from "@hugeicons/core-free-icons"
import { createBlockedSlot } from "@/lib/actions/availability"

type Barber = {
  id: string
  name: string
}

interface CreateBlockModalProps {
  barbers: Barber[]
}

export function CreateBlockModal({ barbers }: CreateBlockModalProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Form State
  const [barberId, setBarberId] = useState<string>("all")
  const [reason, setReason] = useState("")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("10:00")
  const [recurrence, setRecurrence] = useState("NONE")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const start = new Date(`${startDate}T${startTime}:00`)
    const end = new Date(`${endDate || startDate}T${endTime}:00`)

    startTransition(async () => {
      try {
        await createBlockedSlot({
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          reason,
          recurrence: recurrence as
            | "NONE"
            | "DAILY"
            | "WEEKLY"
            | "MONTHLY"
            | "YEARLY",
          barberId: barberId === "all" ? undefined : barberId,
        })

        setOpen(false)
        window.location.reload()
      } catch (error) {
        alert(
          "Erro ao criar bloqueio: " +
            (error instanceof Error ? error.message : "Desconhecido")
        )
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="gap-2 rounded-full bg-slate-900 font-black tracking-widest uppercase transition-all active:scale-95 dark:bg-white dark:text-slate-900" />
        }
      >
        <HugeiconsIcon icon={AddCircleIcon} className="h-5 w-5" />
        Novo Bloqueio
      </DialogTrigger>

      <DialogContent className="glass-effect rounded-[40px] border-none p-8 shadow-2xl sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tight uppercase">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <HugeiconsIcon icon={Calendar01Icon} className="h-5 w-5" />
            </div>
            Bloquear Agenda
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Barbeiro */}
          <div className="space-y-3">
            <Label className="ml-1 text-[10px] font-black tracking-widest uppercase opacity-50">
              Aplicar para:
            </Label>
            <div className="group relative">
              <HugeiconsIcon
                icon={UserCircleIcon}
                className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 opacity-40 transition-all group-focus-within:opacity-100"
              />
              <select
                value={barberId}
                onChange={(e) => setBarberId(e.target.value)}
                className="h-14 w-full appearance-none rounded-3xl border-2 border-slate-100 bg-white pr-4 pl-12 font-bold ring-slate-900/5 transition-all outline-none focus:ring-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <option value="all">Toda a Barbearia</option>
                {barbers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Motivo */}
          <div className="space-y-3">
            <Label className="ml-1 text-[10px] font-black tracking-widest uppercase opacity-50">
              Motivo / Título:
            </Label>
            <div className="group relative">
              <HugeiconsIcon
                icon={Note01Icon}
                className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 opacity-40 transition-all group-focus-within:opacity-100"
              />
              <Input
                placeholder="Ex: Almoço, Folga, Manutenção..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="h-14 rounded-3xl border-2 border-slate-100 bg-white pl-12 font-bold dark:border-slate-800 dark:bg-slate-900"
                required
              />
            </div>
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="ml-1 text-[10px] font-black tracking-widest uppercase opacity-50">
                Início (Data/Hora):
              </Label>
              <div className="space-y-2">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-12 rounded-2xl border-slate-100 font-bold dark:border-slate-800"
                  required
                />
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="h-12 rounded-2xl border-slate-100 font-bold dark:border-slate-800"
                  required
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="ml-1 text-[10px] font-black tracking-widest uppercase opacity-50">
                Fim (Hora):
              </Label>
              <div className="space-y-2">
                <Input
                  type="date"
                  value={endDate || startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-12 rounded-2xl border-slate-100 font-bold opacity-50 dark:border-slate-800"
                  disabled
                />
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="h-12 rounded-2xl border-slate-100 font-bold dark:border-slate-800"
                  required
                />
              </div>
            </div>
          </div>

          {/* Recorrência */}
          <div className="space-y-3">
            <Label className="ml-1 text-[10px] font-black tracking-widest uppercase opacity-50">
              Recorrência:
            </Label>
            <select
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value)}
              className="h-12 w-full appearance-none rounded-2xl border-2 border-slate-100 bg-white px-4 font-bold outline-none dark:border-slate-800 dark:bg-slate-900"
            >
              <option value="NONE">Apenas uma vez</option>
              <option value="DAILY">Diariamente</option>
              <option value="WEEKLY">Semanalmente</option>
              <option value="MONTHLY">Mensalmente</option>
            </select>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="submit"
              disabled={isPending || !startDate}
              className="h-16 w-full gap-3 rounded-[32px] bg-slate-900 text-lg font-black tracking-widest uppercase shadow-2xl transition-all active:scale-95 dark:bg-white dark:text-slate-900"
            >
              {isPending ? (
                "Criando..."
              ) : (
                <>
                  <HugeiconsIcon
                    icon={CheckmarkBadge01Icon}
                    className="h-5 w-5"
                  />
                  Confirmar Bloqueio
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
