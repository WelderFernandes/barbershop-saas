import { getBusinessHours, getBlockedSlots } from "@/lib/actions/availability";
import { getBarbers } from "@/lib/actions/barber";
import { HoursForm } from "./hours-form";
import { BlockedSlotsList } from "./blocked-slots-list";
import { CreateBlockModal } from "./create-block-modal";
import { 
  Calendar01Icon, 
  Clock01Icon, 
  InformationCircleIcon 
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default async function HoursSettingsPage() {
  const [businessHours, blockedSlots, barbers] = await Promise.all([
    getBusinessHours(),
    getBlockedSlots(),
    getBarbers(),
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Lado Esquerdo: Horário Semanal */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-soft-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <HugeiconsIcon icon={Clock01Icon} className="w-5 h-5 text-slate-900 dark:text-white" />
              </div>
              <h2 className="text-xl font-bold">Horário de Funcionamento</h2>
            </div>
            <HoursForm initialData={businessHours} />
          </div>
        </div>

        {/* Lado Direito: Bloqueios */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-soft-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <HugeiconsIcon icon={Calendar01Icon} className="w-5 h-5 text-slate-900 dark:text-white" />
                </div>
                <h2 className="text-xl font-bold">Bloqueios de Agenda</h2>
              </div>
              <CreateBlockModal barbers={barbers} />
            </div>

            <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 flex gap-3 text-sm text-amber-800 dark:text-amber-200 leading-snug">
              <HugeiconsIcon icon={InformationCircleIcon} className="w-5 h-5 shrink-0" />
              <p>Bloqueios impedem novos agendamentos no período selecionado, seja para um barbeiro ou para toda a loja.</p>
            </div>

            <BlockedSlotsList initialData={blockedSlots} />
          </div>
        </div>
      </div>
    </div>
  );
}
