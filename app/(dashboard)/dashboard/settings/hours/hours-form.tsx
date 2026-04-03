"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBusinessHours } from "@/lib/actions/availability";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkBadge01Icon, FloppyDiskIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

const DAYS_OF_WEEK = [
  "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"
];

type BusinessHour = {
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  isActive: boolean;
};

interface HoursFormProps {
  initialData: BusinessHour[];
}

export function HoursForm({ initialData }: HoursFormProps) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  
  // Garantir que todos os 7 dias estejam presentes no estado inicial
  const defaultHours = Array.from({ length: 7 }, (_, i) => {
    const found = initialData.find(h => h.dayOfWeek === i);
    return found || { dayOfWeek: i, openTime: "08:00", closeTime: "18:00", isActive: i !== 0 };
  });

  const [hours, setHours] = useState<BusinessHour[]>(defaultHours);

  const handleToggle = (dayIndex: number) => {
    setHours(prev => prev.map(h => 
      h.dayOfWeek === dayIndex ? { ...h, isActive: !h.isActive } : h
    ));
    setSuccess(false);
  };

  const handleChange = (dayIndex: number, field: "openTime" | "closeTime", value: string) => {
    setHours(prev => prev.map(h => 
      h.dayOfWeek === dayIndex ? { ...h, [field]: value } : h
    ));
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateBusinessHours(hours);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (error) {
        alert("Erro ao salvar horários: " + (error instanceof Error ? error.message : "Desconhecido"));
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {hours.map((day) => (
          <div 
            key={day.dayOfWeek}
            className={cn(
              "flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border transition-all",
              day.isActive ? "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700" : "bg-slate-50 dark:bg-slate-900 border-transparent opacity-60"
            )}
          >
            <div className="flex items-center gap-4 min-w-[140px] mb-3 sm:mb-0">
              <button
                type="button"
                onClick={() => handleToggle(day.dayOfWeek)}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-colors duration-300",
                  day.isActive ? "bg-slate-900 dark:bg-white" : "bg-slate-300 dark:bg-slate-700"
                )}
              >
                  <div className={cn(
                    "w-4 h-4 rounded-full bg-white dark:bg-slate-900 absolute top-1 transition-transform duration-300",
                    day.isActive ? "translate-x-7" : "translate-x-1"
                  )} />
              </button>
              <span className="font-bold text-sm">{DAYS_OF_WEEK[day.dayOfWeek]}</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {day.isActive ? (
                <>
                  <Input 
                    type="time" 
                    value={day.openTime || "08:00"} 
                    onChange={(e) => handleChange(day.dayOfWeek, "openTime", e.target.value)}
                    className="h-10 w-28 rounded-xl border-slate-200 dark:border-slate-700 font-bold text-center"
                  />
                  <span className="text-slate-400 font-bold">até</span>
                  <Input 
                    type="time" 
                    value={day.closeTime || "18:00"} 
                    onChange={(e) => handleChange(day.dayOfWeek, "closeTime", e.target.value)}
                    className="h-10 w-28 rounded-xl border-slate-200 dark:border-slate-700 font-bold text-center"
                  />
                </>
              ) : (
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 py-2">Fechado</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Configuração salvas automaticamente no banco</p>
        <Button 
          onClick={handleSave} 
          disabled={isPending}
          className={cn(
            "rounded-full px-8 h-12 font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all gap-2",
            success ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20" : "bg-slate-900 dark:bg-white dark:text-slate-900"
          )}
        >
          {isPending ? (
            "Salvando..."
          ) : success ? (
            <>
              <HugeiconsIcon icon={CheckmarkBadge01Icon} className="w-5 h-5" />
              Salvo!
            </>
          ) : (
            <>
              <HugeiconsIcon icon={FloppyDiskIcon} className="w-5 h-5" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
