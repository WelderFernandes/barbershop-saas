"use client"
import { useState, useTransition, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  Calendar01Icon,
  CheckmarkBadge01Icon,
  Clock01Icon,
  Scissor01Icon,
  UserCircleIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons"
import { createPublicAppointment } from "@/lib/actions/public-booking"
import { getAvailableSlots } from "@/lib/actions/availability"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  cn,
  formatDate,
  formatDayOfWeek,
  formatDayOfMonth,
  formatPhone,
} from "@/lib/utils"
import Image from "next/image"

type Service = {
  id: string
  name: string
  price: number
  duration: number
}

type Barber = {
  id: string
  name: string
  avatarUrl?: string | null
}

type Props = {
  barbershop: { id: string; name: string }
  services: Service[]
  barbers: Barber[]
}

export function BookingClient({ barbershop, services, barbers }: Props) {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isPending, startTransition] = useTransition()
  const [isFinished, setIsFinished] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)

  const steps = [
    { title: "Serviço", icon: Scissor01Icon },
    { title: "Barbeiro", icon: UserCircleIcon },
    { title: "Data/Hora", icon: Calendar01Icon },
    { title: "Confirmar", icon: CheckmarkBadge01Icon },
  ]

  // ═══════════════════════════════════════════════════════
  // Efeito para carregar horários dinâmicos
  // ═══════════════════════════════════════════════════════
  useEffect(() => {
    if (selectedBarber && selectedDate) {
      const fetchSlots = async () => {
        setIsLoadingSlots(true)
        try {
          const slots = await getAvailableSlots({
            barbershopId: barbershop.id,
            barberId: selectedBarber.id,
            date: selectedDate,
          })
          setAvailableSlots(slots)
        } catch (error) {
          console.error("Erro ao carregar slots:", error)
          setAvailableSlots([])
        } finally {
          setIsLoadingSlots(false)
        }
      }

      fetchSlots()
    }
  }, [selectedBarber, selectedDate, barbershop.id])

  const handleFinish = async () => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime)
      return

    // Combinar data e hora
    const [hours, minutes] = selectedTime.split(":")
    const finalDate = new Date(selectedDate)
    finalDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)

    startTransition(async () => {
      try {
        await createPublicAppointment({
          barbershopId: barbershop.id,
          serviceId: selectedService.id,
          barberId: selectedBarber.id,
          date: finalDate,
          clientName: name,
          clientPhone: phone,
        })
        setIsFinished(true)
      } catch (error) {
        console.log("🚀 ~ handleFinish ~ error:", error)
        alert("Erro ao realizar agendamento. Tente novamente.")
      }
    })
  }

  if (isFinished) {
    return (
      <div className="flex animate-in flex-col items-center justify-center space-y-6 pt-12 duration-500 fade-in zoom-in">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xl shadow-emerald-500/20">
          <HugeiconsIcon icon={CheckmarkBadge01Icon} className="h-12 w-12" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-black tracking-tight uppercase">
            Agendado!
          </h2>
          <p className="max-w-[250px] font-medium text-slate-500">
            Tudo pronto, {name}. Te esperamos na {barbershop.name}!
          </p>
        </div>
        <Button
          variant="outline"
          className="mt-4 rounded-full border-2 border-slate-900 px-8 font-bold dark:border-white"
          onClick={() => window.location.reload()}
        >
          Novo Agendamento
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between px-2">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="shadow-soft-xl flex h-10 w-10 items-center justify-center rounded-full bg-white transition-all active:scale-95 dark:bg-slate-800"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" />
          </button>
        )}
        <div className="flex flex-1 justify-center gap-2">
          {steps.map((s, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                step === i + 1
                  ? "w-8 bg-slate-900 dark:bg-white"
                  : "w-2 bg-slate-300 dark:bg-slate-700"
              )}
            />
          ))}
        </div>
        <div className="h-10 w-10" /> {/* Spacer */}
      </div>

      <div className="space-y-4">
        {/* Step Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            <HugeiconsIcon icon={steps[step - 1].icon} className="h-4 w-4" />
          </div>
          <h2 className="text-xl font-black tracking-tight uppercase">
            {steps[step - 1].title}
          </h2>
        </div>

        {/* STEP 1: SERVICES */}
        {step === 1 && (
          <div className="grid animate-in gap-3 fade-in slide-in-from-bottom-4">
            {services.map((service) => (
              <Card
                key={service.id}
                className={cn(
                  "cursor-pointer overflow-hidden border-2 transition-all active:scale-[0.98]",
                  selectedService?.id === service.id
                    ? "border-slate-900 shadow-2xl ring-4 ring-slate-900/5 dark:border-white"
                    : "border-transparent"
                )}
                onClick={() => {
                  setSelectedService(service)
                  setStep(2)
                }}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold">{service.name}</h3>
                    <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1">
                        <HugeiconsIcon icon={Clock01Icon} className="h-3 w-3" />
                        {service.duration} min
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-lg font-black tracking-tight">
                      R$ {service.price / 100}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* STEP 2: BARBERS */}
        {step === 2 && (
          <div className="grid animate-in grid-cols-1 gap-3 fade-in slide-in-from-right-4 sm:grid-cols-2 sm:gap-4">
            {barbers.map((barber) => (
              <Card
                key={barber.id}
                className={cn(
                  "cursor-pointer border-2 text-center transition-all active:scale-[0.98]",
                  selectedBarber?.id === barber.id
                    ? "border-slate-900 shadow-2xl dark:border-white"
                    : "border-transparent"
                )}
                onClick={() => {
                  setSelectedBarber(barber)
                  setStep(3)
                }}
              >
                <CardContent className="space-y-3 p-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 dark:bg-slate-800">
                    {barber.avatarUrl ? (
                      <Image
                        src={barber.avatarUrl}
                        alt={barber.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <HugeiconsIcon
                        icon={UserCircleIcon}
                        className="h-8 w-8 opacity-20"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="truncate text-sm font-bold">
                      {barber.name}
                    </h3>
                    <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                      Disponível
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* STEP 3: DATE & TIME */}
        {step === 3 && (
          <div className="animate-in space-y-6 fade-in slide-in-from-right-4">
            {/* Simple Calendar (MOCK) */}
            <div className="space-y-3">
              <p className="text-xs font-black tracking-widest uppercase opacity-50">
                Escolha o dia
              </p>
              <div className="scrollbar-none flex gap-2 overflow-x-auto pb-2">
                {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                  const date = new Date()
                  date.setDate(date.getDate() + day)
                  const isSelected =
                    selectedDate?.toDateString() === date.toDateString()
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        "flex h-20 w-14 shrink-0 flex-col items-center justify-center rounded-3xl border-2 transition-all active:scale-95",
                        isSelected
                          ? "border-slate-900 bg-slate-900 text-white shadow-xl dark:border-white dark:bg-white dark:text-slate-900"
                          : "border-transparent bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                      )}
                    >
                      <span className="text-[10px] font-black tracking-tighter uppercase opacity-50">
                        {formatDayOfWeek(date)}
                      </span>
                      <span className="text-lg font-black">
                        {formatDayOfMonth(date)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="font-outfit animate-in space-y-3 zoom-in-95 fade-in">
                <p className="text-xs font-black tracking-widest uppercase opacity-50">
                  Horários disponíveis
                </p>

                {isLoadingSlots ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-10">
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      className="h-8 w-8 animate-spin opacity-20"
                    />
                    <span className="text-[10px] font-black tracking-widest uppercase opacity-30">
                      Calculando agenda...
                    </span>
                  </div>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {availableSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          setSelectedTime(time)
                          setStep(4)
                        }}
                        className={cn(
                          "h-12 rounded-2xl border-2 text-sm font-black transition-all",
                          selectedTime === time
                            ? "border-slate-900 bg-slate-900 text-white shadow-xl dark:bg-white dark:text-slate-900"
                            : "border-transparent bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[32px] border-2 border-dashed border-slate-100 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-sm font-bold opacity-40">
                      Nenhum horário disponível para este barbeiro na data
                      selecionada.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 4: CONFIRMATION */}
        {step === 4 && (
          <div className="animate-in space-y-6 fade-in slide-in-from-right-4">
            <div className="shadow-soft-xl space-y-6 rounded-[40px] border border-slate-900/5 bg-white p-8 dark:bg-slate-800">
              <div className="flex flex-col items-center space-y-1 text-center">
                <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                  <HugeiconsIcon
                    icon={CheckmarkBadge01Icon}
                    className="h-8 w-8"
                  />
                </div>
                <h3 className="text-sm font-black tracking-widest uppercase opacity-50">
                  Resumo do pedido
                </h3>
                <p className="text-2xl font-black tracking-tight">
                  {selectedService?.name}
                </p>
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-4 dark:border-slate-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-bold opacity-50">
                    <HugeiconsIcon icon={UserCircleIcon} className="h-4 w-4" />{" "}
                    Barbeiro
                  </span>
                  <span className="font-black">{selectedBarber?.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-bold opacity-50">
                    <HugeiconsIcon icon={Calendar01Icon} className="h-4 w-4" />{" "}
                    Data
                  </span>
                  <span className="font-black">
                    {formatDate(selectedDate || new Date())}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="space-y-3">
                <Label
                  htmlFor="cust-name"
                  className="ml-1 text-xs font-black tracking-widest uppercase opacity-50"
                >
                  Seu Nome
                </Label>
                <Input
                  id="cust-name"
                  placeholder="Ex: João Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-14 rounded-3xl border-2 border-slate-200 bg-white px-6 font-bold dark:border-slate-800 dark:bg-slate-800"
                />
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="cust-phone"
                  className="ml-1 text-xs font-black tracking-widest uppercase opacity-50"
                >
                  WhatsApp
                </Label>
                <Input
                  id="cust-phone"
                  placeholder="(11) 99999 9999"
                  value={formatPhone(phone)}
                  onChange={(e) => setPhone(formatPhone(e.target.value) || "")}
                  className="h-14 rounded-3xl border-2 border-slate-200 bg-white px-6 font-bold dark:border-slate-800 dark:bg-slate-800"
                />
              </div>
            </div>

            <Button
              className="h-16 w-full cursor-pointer rounded-2xl text-lg font-black tracking-widest uppercase shadow-2xl shadow-slate-900/20 transition-all active:scale-95 sm:h-20 sm:rounded-[40px] sm:text-xl"
              onClick={handleFinish}
              disabled={isPending || !name || !phone}
            >
              {isPending ? "Confirmando..." : "Confirmar Agendamento"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
