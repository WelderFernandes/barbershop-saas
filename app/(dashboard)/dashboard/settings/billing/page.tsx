import { CreditCardIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function BillingSettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 rounded-[40px] bg-white/20 dark:bg-slate-900/20 backdrop-blur-3xl border border-white/20 dark:border-slate-800/20 shadow-2xl">
      <div className="h-20 w-20 rounded-full bg-blue-500/10 flex items-center justify-center">
        <HugeiconsIcon icon={CreditCardIcon} className="w-10 h-10 text-blue-500" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">Plano & Assinatura</h2>
        <p className="text-muted-foreground font-medium max-w-xs">Em breve: Gerencie seus pagamentos, faturas e upgrade de plano em um só lugar.</p>
      </div>
    </div>
  );
}
