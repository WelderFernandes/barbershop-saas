import { UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function TeamSettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 rounded-[40px] bg-white/20 dark:bg-slate-900/20 backdrop-blur-3xl border border-white/20 dark:border-slate-800/20 shadow-2xl">
      <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center">
        <HugeiconsIcon icon={UserGroupIcon} className="w-10 h-10 text-accent" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">Gestão de Equipe</h2>
        <p className="text-muted-foreground font-medium max-w-xs">Em breve: Gerencie permissões e perfis dos seus barbeiros em um só lugar.</p>
      </div>
    </div>
  );
}
