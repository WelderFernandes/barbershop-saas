"use client";

import { useState } from "react";
import { Add01Icon } from "@hugeicons/core-free-icons";
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
import { createTeam } from "@/lib/actions/team";
import { useRouter } from "next/navigation";

export function CreateTeamDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createTeam(name);
      setOpen(false);
      setName("");
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="gap-2 rounded-full px-6 font-bold uppercase tracking-widest shadow-xl transition-all hover:scale-105">
            <HugeiconsIcon icon={Add01Icon} className="h-4 w-4" />
            Novo Time
          </Button>
        }
      />
      <DialogContent className="border-white/10 bg-slate-950/90 backdrop-blur-2xl sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-white">
            Criar <span className="text-primary">Novo Time</span>
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
            >
              Nome do Time
            </Label>
            <Input
              id="name"
              placeholder="Ex: Time Alpha"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-white/10 bg-white/5 font-medium text-white transition-all focus:border-primary focus:ring-primary/20"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleCreate}
            disabled={loading || !name.trim()}
            className="w-full font-bold uppercase tracking-widest"
          >
            {loading ? "Criando..." : "Confirmar Criação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
