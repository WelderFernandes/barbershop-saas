import { getOrganizationMembers, getTeams } from "@/lib/actions/team";
import { listInvitations } from "@/lib/actions/invite";
import { InviteMemberDialog } from "@/components/dashboard/invite-member-dialog";
import { UserGroupIcon, Tag01Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";


export default async function MembersPage() {
  const [members, invitations, teams] = await Promise.all([
    getOrganizationMembers(),
    listInvitations(),
    getTeams(),
  ]);

  return (
    <div className="space-y-8 pb-10">
      {/* Header Premium */}
      <header className="relative overflow-hidden rounded-[40px] border border-white/10 bg-slate-950/40 p-8 backdrop-blur-2xl md:p-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />
        
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <HugeiconsIcon icon={UserGroupIcon} className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tighter text-white md:text-4xl">
                Gestão de <span className="text-primary">Membros</span>
              </h1>
            </div>

            <p className="max-w-md text-sm font-medium text-muted-foreground md:text-base">
              Gerencie quem tem acesso à sua barbearia, atribua papéis e organize-os em times.
            </p>
          </div>
          
          <InviteMemberDialog teams={teams} />
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Lista de Membros Ativos */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-4">
            Membros Ativos ({members.length})
          </h2>
          
          <div className="space-y-3">
            {members.map((member) => (
              <Card key={member.id} className="border-white/5 bg-slate-900/40 backdrop-blur-md transition-all hover:border-primary/20">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-xl">
                      <AvatarImage src={member.user?.image || ""} />
                      <AvatarFallback className="bg-slate-800 text-xs font-black uppercase">
                        {member.user?.name?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="font-black uppercase tracking-tight text-white">{member.user?.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-white/10 bg-white/5 text-[8px] font-bold uppercase tracking-widest text-muted-foreground h-4">
                          {member.role}
                        </Badge>
                        {member.team && (
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] font-bold uppercase tracking-widest h-4">
                            {member.team.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right sr-only md:not-sr-only">
                    <p className="font-mono text-[9px] text-muted-foreground uppercase">{member.user?.email}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Convites Pendentes */}
        <aside className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-4 flex items-center gap-2">
            <HugeiconsIcon icon={Clock01Icon} className="h-3 w-3" />
            Convites Pendentes ({invitations.length})
          </h2>

          <div className="space-y-3">
            {invitations.length === 0 ? (
              <div className="rounded-[30px] border border-dashed border-white/10 p-8 text-center bg-white/2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Sem convites pendentes</p>
              </div>
            ) : (
              invitations.map((invite) => (
                <Card key={invite.id} className="border-white/5 bg-slate-900/60 backdrop-blur-xl">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                       <p className="font-mono text-[10px] font-bold text-white truncate max-w-[150px]">{invite.email}</p>
                       <Badge variant="secondary" className="text-[7px] font-black uppercase h-4 bg-amber-500/10 text-amber-500 border-amber-500/20">
                          Pendente
                       </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">
                       <HugeiconsIcon icon={Tag01Icon} className="h-3 w-3" />
                       {invite.role}
                       {invite.team && (
                         <>
                           <span className="opacity-20">|</span>
                           <span className="text-primary">{invite.team.name}</span>
                         </>
                       )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
