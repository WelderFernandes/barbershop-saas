"use client";

import { useTransition } from "react";
import { deleteBlockedSlot } from "@/lib/actions/availability";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Calendar01Icon, 
  Clock01Icon, 
  Delete01Icon, 
  PinIcon, 
  UserCircleIcon 
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

type BlockedSlot = {
  id: string;
  startTime: Date;
  endTime: Date;
  reason: string | null;
  recurrence: string;
  barber?: { id: string; name: string } | null;
};

interface BlockedSlotsListProps {
  initialData: BlockedSlot[];
}

export function BlockedSlotsList({ initialData }: BlockedSlotsListProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (!confirm("Deseja realmente remover este bloqueio?")) return;
    
    startTransition(async () => {
      try {
        await deleteBlockedSlot(id);
        window.location.reload(); // Refresh para atualizar a lista
      } catch (error) {
        alert("Erro ao remover bloqueio: " + (error instanceof Error ? error.message : "Desconhecido"));
      }
    });
  };

  if (initialData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[32px] space-y-4">
        <div className="h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300">
            <HugeiconsIcon icon={Calendar01Icon} className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <p className="font-bold text-slate-900 dark:text-white">Nenhum bloqueio ativo</p>
          <p className="text-sm text-slate-500 max-w-[200px]">Agenda 100% disponível para este estabelecimento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
      {initialData.map((slot) => (
        <div 
          key={slot.id}
          className="group flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-soft-xl hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300"
        >
          <div className="flex gap-4 items-start">
            <div className={cn(
              "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0",
              slot.barber ? "bg-amber-50 dark:bg-amber-900/10 text-amber-600" : "bg-red-50 dark:bg-red-900/10 text-red-600"
            )}>
                <HugeiconsIcon icon={slot.barber ? UserCircleIcon : PinIcon} className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-black text-xs uppercase tracking-widest opacity-40">
                  {slot.barber ? `Reserva: ${slot.barber.name}` : "Bloqueio Estabelecimento"}
                </span>
                {slot.recurrence !== "NONE" && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[9px] font-black uppercase text-slate-500">
                    Sincronizado {slot.recurrence}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-base leading-tight">
                {slot.reason || "Sem motivo especificado"}
              </h3>
              <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Calendar01Icon} className="w-3.5 h-3.5" />
                  {formatDate(slot.startTime)}
                </span>
                <span className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Clock01Icon} className="w-3.5 h-3.5" />
                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handleDelete(slot.id)}
            disabled={isPending}
            className="rounded-full h-10 w-10 border-slate-200 dark:border-slate-700 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 active:scale-90 transition-all"
          >
            <HugeiconsIcon icon={Delete01Icon} className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
