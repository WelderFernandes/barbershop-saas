"use client";

import { useState, useTransition, useEffect } from "react";
import { UserAdd01Icon, UserRemove01Icon, Settings02Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { addMemberToTeam, removeMemberFromTeam, getOrganizationMembers } from "@/lib/actions/team";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface OrganizationMember {
  id: string;
  teamId: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  } | null;
}

interface TeamManagementDialogProps {
  teamId: string;
  teamName: string;
  initialMembersCount: number;
}

export function TeamManagementDialog({ teamId, teamName }: TeamManagementDialogProps) {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await getOrganizationMembers();
      // Mapear para garantir que o tipo coincida, tratando os usuários nulos se houver
      setMembers(data as unknown as OrganizationMember[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchMembers();
    }
  }, [open]);

  const handleToggleMember = (memberId: string, currentTeamId: string | null) => {
    const isAdding = currentTeamId !== teamId;
    
    startTransition(async () => {
      try {
        if (isAdding) {
          await addMemberToTeam(teamId, memberId);
        } else {
          await removeMemberFromTeam(memberId);
        }
        await fetchMembers();
        router.refresh();
      } catch (error) {
        console.error(error);
      }
    });
  };

  const filteredMembers = members.filter((m) =>
    (m.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (m.user?.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2 rounded-full border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white"
          >
            <HugeiconsIcon icon={Settings02Icon} className="h-3 w-3" />
            Gestão
          </Button>
        }
      />
      <DialogContent className="border-white/10 bg-slate-950/90 backdrop-blur-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-white">
            Gestão de <span className="text-primary">{teamName}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="relative">
            <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar membros da organização..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-white/10 bg-white/5 pl-10 font-bold uppercase tracking-wider text-[10px]"
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {loading ? (
              <div className="py-10 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Carregando membros...
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="py-10 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Nenhum membro encontrado.
              </div>
            ) : (
              filteredMembers.map((member) => {
                const isInCurrentTeam = member.teamId === teamId;
                const isInAnotherTeam = member.teamId && member.teamId !== teamId;
                
                return (
                  <div key={member.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarImage src={member.user?.image || undefined} />
                        <AvatarFallback className="bg-slate-800 text-[10px] font-bold">
                          {member.user?.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-white uppercase tracking-tight">{member.user?.name}</p>
                        <p className="text-[9px] text-muted-foreground font-mono">{member.user?.email}</p>
                        {isInAnotherTeam && (
                           <Badge variant="outline" className="border-amber-500/20 bg-amber-500/10 text-[8px] font-bold text-amber-500 uppercase px-1 h-3">
                             Em outro time
                           </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isPending}
                      onClick={() => handleToggleMember(member.id, member.teamId)}
                      className={`h-8 w-8 rounded-full p-0 transition-all ${
                        isInCurrentTeam 
                          ? "border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white" 
                          : "border-primary/20 bg-primary/10 text-primary hover:bg-primary hover:text-white"
                      }`}
                    >
                      <HugeiconsIcon 
                        icon={isInCurrentTeam ? UserRemove01Icon : UserAdd01Icon} 
                        className="h-4 w-4" 
                      />
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
