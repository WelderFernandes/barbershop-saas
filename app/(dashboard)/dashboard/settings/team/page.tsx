import { getTeams } from "@/lib/actions/team";
import { CreateTeamDialog } from "@/components/dashboard/create-team-dialog";
import { TeamList } from "@/components/dashboard/team-list";
import { UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default async function TeamSettingsPage() {
  const teams = await getTeams();

  return (
    <div className="space-y-8 pb-10">
      {/* Header com Glassmorphism */}
      <header className="relative overflow-hidden rounded-[40px] border border-white/10 bg-slate-950/40 p-8 backdrop-blur-2xl md:p-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />
        
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <HugeiconsIcon icon={UserGroupIcon} className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tighter text-white md:text-4xl">
                Gestão de <span className="text-primary">Times</span>
              </h1>
            </div>
            <p className="max-w-md text-sm font-medium text-muted-foreground md:text-base">
              Organize seus membros em times para facilitar o agendamento e a gestão de serviços por categorias ou turnos.
            </p>
          </div>
          
          <CreateTeamDialog />
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
            Times da Organização ({teams.length})
          </h2>
        </div>

        <TeamList teams={teams} />
      </main>
    </div>
  );
}
