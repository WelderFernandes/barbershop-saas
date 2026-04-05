"use client";

import { useTransition } from "react";
import { UserGroupIcon, Delete02Icon, Settings02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteTeam } from "@/lib/actions/team";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { TeamManagementDialog } from "./team-management-dialog";



interface TeamWithCount {
  id: string;
  name: string;
  _count: {
    members: number;
  };
}

interface TeamListProps {
  teams: TeamWithCount[];
}

export function TeamList({ teams }: TeamListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (!confirm("Deseja realmente excluir este time? Membros não serão excluídos da organização.")) return;
    
    startTransition(async () => {
      try {
        await deleteTeam(id);
        router.refresh();
      } catch (error) {
        console.error(error);
      }
    });
  };

  if (teams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <HugeiconsIcon icon={UserGroupIcon} className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold uppercase tracking-tight text-white">Nenhum time encontrado</h3>
        <p className="max-w-xs text-sm text-muted-foreground">Comece criando um novo time para organizar seu atendimento.</p>
      </div>
    );
  }


  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => (
        <Card key={team.id} className="border-white/5 bg-slate-900/40 backdrop-blur-md transition-all hover:border-primary/30">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-xl font-black uppercase tracking-tighter text-white">
                {team.name}
              </CardTitle>
              <CardDescription className="font-mono text-[9px] uppercase tracking-widest">
                ID: {team.id.slice(0, 8)}
              </CardDescription>
            </div>
            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-[10px] font-bold text-primary">
              {team._count.members} Membros
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex -space-x-2 overflow-hidden py-2">
               {/* Futuro: Mostrar avatares dos membros aqui */}
               {[...Array(Math.min(team._count.members, 5))].map((_, i) => (
                 <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-900 bg-slate-800 text-[10px] font-bold text-muted-foreground ring-2 ring-primary/10">
                   U
                 </div>
               ))}
               {team._count.members > 5 && (
                 <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-900 bg-slate-800 text-[10px] font-bold text-white ring-2 ring-primary/10">
                   +{team._count.members - 5}
                 </div>
               )}
            </div>
          </CardContent>

          <CardFooter className="gap-2 border-t border-white/5 pt-4">
            <TeamManagementDialog 
              teamId={team.id} 
              teamName={team.name} 
              initialMembersCount={team._count.members} 
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(team.id)}
              disabled={isPending}
              className="group h-8 w-8 rounded-full border-white/10 bg-white/5 p-0 hover:bg-destructive hover:text-white"
            >
              <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4 transition-transform group-hover:scale-110" />
            </Button>
          </CardFooter>

        </Card>
      ))}
    </div>
  );
}
