"use client";

import { useState } from "react";

import { UserAdd01Icon, Mail01Icon, Tag01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createInvite } from "@/lib/actions/invite";
import { useRouter } from "next/navigation";

interface Team {
  id: string;
  name: string;
}

interface InviteMemberDialogProps {
  teams: Team[];
}

export function InviteMemberDialog({ teams }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "member" | "owner">("member");
  const [teamId, setTeamId] = useState<string>("none");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInvite = async () => {
    if (!email.trim()) return;
    setLoading(true);
    try {
      await createInvite(email, role, teamId === "none" ? undefined : teamId);
      setOpen(false);
      setEmail("");
      router.refresh();
      // TODO: Mostrar toast de sucesso
    } catch (error) {
      console.error(error);
      // TODO: Mostrar toast de erro
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="gap-2 rounded-full px-6 font-bold uppercase tracking-widest shadow-xl transition-all hover:scale-105">
            <HugeiconsIcon icon={UserAdd01Icon} className="h-4 w-4" />
            Convidar Membro
          </Button>
        }
      />
      <DialogContent className="border-white/10 bg-slate-950/90 backdrop-blur-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-white">
            Convidar <span className="text-primary">Novo Membro</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* E-mail */}
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
               <HugeiconsIcon icon={Mail01Icon} className="h-3 w-3" />
               E-mail do Convidado
            </Label>
            <Input
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-white/10 bg-white/5 font-medium text-white transition-all focus:border-primary focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Papel (Role) */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                 <HugeiconsIcon icon={Tag01Icon} className="h-3 w-3" />
                 Papel
              </Label>
              <Select value={role} onValueChange={(v) => setRole(v as any)}>


                <SelectTrigger className="border-white/10 bg-white/5 font-bold uppercase text-[10px] tracking-wider text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-slate-950/95 backdrop-blur-xl">
                  <SelectItem value="member" className="text-[10px] font-bold uppercase tracking-wider">Membro</SelectItem>
                  <SelectItem value="admin" className="text-[10px] font-bold uppercase tracking-wider">Administrador</SelectItem>
                  <SelectItem value="owner" className="text-[10px] font-bold uppercase tracking-wider">Proprietário</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time (Team) */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                 <HugeiconsIcon icon={UserGroupIcon} className="h-3 w-3" />
                 Time (Opcional)
              </Label>
              <Select value={teamId} onValueChange={(v) => setTeamId(v || "none")}>


                <SelectTrigger className="border-white/10 bg-white/5 font-bold uppercase text-[10px] tracking-wider text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-slate-950/95 backdrop-blur-xl">
                  <SelectItem value="none" className="text-[10px] font-bold uppercase tracking-wider">Nenhum</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id} className="text-[10px] font-bold uppercase tracking-wider">
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            onClick={handleInvite}
            disabled={loading || !email.trim()}
            className="w-full font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
          >
            {loading ? "Enviando..." : "Enviar Convite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
