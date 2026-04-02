"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Calendar01Icon,
  CheckmarkBadge01Icon,
  Clock01Icon,
  Scissor01Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { createPublicAppointment } from "@/lib/actions/public-booking";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, formatDate, formatDayOfWeek, formatDayOfMonth } from "@/lib/utils";
import Image from "next/image";

type Service = {
  id: string;
  name: string;
  price: number;
  duration: number;
};

type Barber = {
  id: string;
  name: string;
  avatarUrl?: string | null;
};

type Props = {
  barbershop: { id: string; name: string };
  services: Service[];
  barbers: Barber[];
};

export function BookingClient({ barbershop, services, barbers }: Props) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isFinished, setIsFinished] = useState(false);

  const steps = [
    { title: "Serviço", icon: Scissor01Icon },
    { title: "Barbeiro", icon: UserCircleIcon },
    { title: "Data/Hora", icon: Calendar01Icon },
    { title: "Confirmar", icon: CheckmarkBadge01Icon },
  ];

  const handleFinish = async () => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime) return;
    
    // Combinar data e hora
    const [hours, minutes] = selectedTime.split(":");
    const finalDate = new Date(selectedDate);
    finalDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    startTransition(async () => {
      try {
        await createPublicAppointment({
          barbershopId: barbershop.id,
          serviceId: selectedService.id,
          barberId: selectedBarber.id,
          date: finalDate,
          clientName: name,
          clientPhone: phone,
        });
        setIsFinished(true);
      } catch (error) {
        console.log("🚀 ~ handleFinish ~ error:", error)
        alert("Erro ao realizar agendamento. Tente novamente.");
      }
    });
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 pt-12 animate-in fade-in zoom-in duration-500">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xl shadow-emerald-500/20">
          <HugeiconsIcon icon={CheckmarkBadge01Icon} className="h-12 w-12" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black uppercase tracking-tight">Agendado!</h2>
          <p className="text-slate-500 font-medium max-w-[250px]">
            Tudo pronto, {name}. Te esperamos na {barbershop.name}!
          </p>
        </div>
        <Button 
          variant="outline" 
          className="rounded-full px-8 mt-4 font-bold border-2 border-slate-900 dark:border-white"
          onClick={() => window.location.reload()}
        >
          Novo Agendamento
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between px-2">
        {step > 1 && (
          <button 
            onClick={() => setStep(step - 1)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-soft-xl active:scale-95 transition-all"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5" />
          </button>
        )}
        <div className="flex-1 flex justify-center gap-2">
          {steps.map((s, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                step === i + 1 ? "w-8 bg-slate-900 dark:bg-white" : "w-2 bg-slate-300 dark:bg-slate-700"
              )} 
            />
          ))}
        </div>
        <div className="w-10 h-10" /> {/* Spacer */}
      </div>

      <div className="space-y-4">
        {/* Step Header */}
        <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                <HugeiconsIcon icon={steps[step - 1].icon} className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight">{steps[step - 1].title}</h2>
        </div>

        {/* STEP 1: SERVICES */}
        {step === 1 && (
          <div className="grid gap-3 animate-in fade-in slide-in-from-bottom-4">
            {services.map((service) => (
              <Card 
                key={service.id} 
                className={cn(
                  "overflow-hidden cursor-pointer active:scale-[0.98] transition-all border-2",
                  selectedService?.id === service.id ? "border-slate-900 dark:border-white ring-4 ring-slate-900/5 shadow-2xl" : "border-transparent"
                )}
                onClick={() => {
                  setSelectedService(service);
                  setStep(2);
                }}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-base">{service.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <HugeiconsIcon icon={Clock01Icon} className="w-3 h-3" />
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
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-4">
            {barbers.map((barber) => (
              <Card 
                key={barber.id} 
                className={cn(
                  "cursor-pointer active:scale-[0.98] transition-all text-center border-2",
                  selectedBarber?.id === barber.id ? "border-slate-900 dark:border-white shadow-2xl" : "border-transparent"
                )}
                onClick={() => {
                  setSelectedBarber(barber);
                  setStep(3);
                }}
              >
                <CardContent className="p-4 space-y-3">
                    <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-200">
                      {barber.avatarUrl ? (
                        <Image src={barber.avatarUrl} alt={barber.name} width={64} height={64} className="w-full h-full object-cover" />
                      ) : (
                        <HugeiconsIcon icon={UserCircleIcon} className="w-8 h-8 opacity-20" />
                      )}
                    </div>
                    <div>
                        <h3 className="font-bold text-sm truncate">{barber.name}</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Disponível</p>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* STEP 3: DATE & TIME */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
             {/* Simple Calendar (MOCK) */}
             <div className="space-y-3">
                <p className="text-xs font-black uppercase tracking-widest opacity-50">Escolha o dia</p>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                        const date = new Date();
                        date.setDate(date.getDate() + day);
                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                        return (
                            <button
                                key={day}
                                onClick={() => setSelectedDate(date)}
                                className={cn(
                                    "shrink-0 flex flex-col items-center justify-center w-14 h-20 rounded-3xl border-2 transition-all active:scale-95",
                                    isSelected ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-xl" : "bg-white dark:bg-slate-800 border-transparent text-slate-900 dark:text-white shadow-sm"
                                )}
                            >
                                <span className="text-[10px] font-black uppercase tracking-tighter opacity-50">
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
                <div className="space-y-3 animate-in fade-in zoom-in-95">
                    <p className="text-xs font-black uppercase tracking-widest opacity-50">Horários disponíveis</p>
                    <div className="grid grid-cols-3 gap-2">
                        {["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"].map((time) => (
                            <button
                                key={time}
                                onClick={() => {
                                  setSelectedTime(time);
                                  setStep(4);
                                }}
                                className={cn(
                                    "h-12 rounded-2xl font-black text-sm border-2 transition-all",
                                    selectedTime === time ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 shadow-xl" : "bg-white dark:bg-slate-800 border-transparent text-slate-900 dark:text-white shadow-sm"
                                )}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>
             )}
          </div>
        )}

        {/* STEP 4: CONFIRMATION */}
        {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="rounded-[40px] bg-white dark:bg-slate-800 p-8 shadow-soft-xl border border-slate-900/5 space-y-6">
                    <div className="flex flex-col items-center text-center space-y-1">
                        <div className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-2">
                            <HugeiconsIcon icon={CheckmarkBadge01Icon} className="w-8 h-8" />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-widest opacity-50">Resumo do pedido</h3>
                        <p className="text-2xl font-black tracking-tight">{selectedService?.name}</p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-bold opacity-50 flex items-center gap-2"><HugeiconsIcon icon={UserCircleIcon} className="w-4 h-4" /> Barbeiro</span>
                            <span className="font-black">{selectedBarber?.name}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-bold opacity-50 flex items-center gap-2"><HugeiconsIcon icon={Calendar01Icon} className="w-4 h-4" /> Data</span>
                            <span className="font-black">
                              {formatDate(selectedDate || new Date())}
                              </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <div className="space-y-3">
                        <Label htmlFor="cust-name" className="text-xs font-black uppercase tracking-widest opacity-50 ml-1">Seu Nome</Label>
                        <Input 
                            id="cust-name" 
                            placeholder="Ex: João Silva" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-14 rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-6 font-bold"
                        />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="cust-phone" className="text-xs font-black uppercase tracking-widest opacity-50 ml-1">WhatsApp</Label>
                        <Input 
                            id="cust-phone" 
                            placeholder="(11) 99999-9999" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="h-14 rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-6 font-bold"
                        />
                    </div>
                </div>

                <Button 
                    className="h-20 w-full rounded-[40px] text-xl font-black uppercase tracking-widest shadow-2xl shadow-slate-900/20 active:scale-95 transition-all"
                    onClick={handleFinish}
                    disabled={isPending || !name || !phone}
                >
                    {isPending ? "Confirmando..." : "Confirmar Agendamento"}
                </Button>
            </div>
        )}
      </div>
    </div>
  );
}
