"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBarber, updateBarber, deleteBarber } from "@/lib/actions/barber";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type Barber = {
  id: string;
  name: string;
  phone: string | null;
  isActive: boolean;
  userId?: string | null;
};

export function BarbersList({ barbers }: { barbers: Barber[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleEdit(barber: Barber) {
    setEditingBarber(barber);
    setOpen(true);
  }

  function handleNew() {
    setEditingBarber(null);
    setOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este barbeiro?")) return;
    startTransition(async () => {
      await deleteBarber(id);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Barbeiros</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie a equipe da sua barbearia
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button onClick={handleNew} className="rounded-md px-6">
                + Novo
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingBarber ? "Editar barbeiro" : "Novo barbeiro"}
              </DialogTitle>
            </DialogHeader>
            <BarberForm
              barber={editingBarber}
              onSuccess={() => {
                setOpen(false);
                router.refresh();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {barbers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Nenhum barbeiro cadastrado ainda.
            </p>
            <Button className="mt-4" onClick={handleNew}>
              Cadastrar primeiro barbeiro
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {barbers.map((barber) => (
            <Card key={barber.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{barber.name}</CardTitle>
                    {barber.phone && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        📱 {barber.phone}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={barber.isActive ? "default" : "secondary"}>
                      {barber.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                    {barber.userId && (
                      <Badge variant="outline" className="border-primary text-primary text-[8px] uppercase tracking-widest font-black rounded-full px-2">
                        Membro do Time
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex gap-2 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => handleEdit(barber)}
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(barber.id)}
                  disabled={isPending}
                >
                  Excluir
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function BarberForm({
  barber,
  onSuccess,
}: {
  barber: Barber | null;
  onSuccess: () => void;
}) {
  const [name, setName] = useState(barber?.name ?? "");
  const [phone, setPhone] = useState(barber?.phone ?? "");
  const [userId, setUserId] = useState(barber?.userId ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (barber) {
        await updateBarber({
          id: barber.id,
          name,
          phone: phone || undefined,
          userId: userId || undefined,
        });
      } else {
        await createBarber({
          name,
          phone: phone || undefined,
          userId: userId || undefined,
        });
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="barber-name">Nome</Label>
        <Input
          id="barber-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          className="h-11 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="barber-phone">
          Telefone <span className="text-muted-foreground">(opcional)</span>
        </Label>
        <Input
          id="barber-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-11 rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="barber-userId">
          ID do Usuário <span className="text-muted-foreground">(vincula conta ao time)</span>
        </Label>
        <Input
          id="barber-userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="user_id..."
          className="h-11 font-mono text-xs rounded-xl"
        />
        <p className="text-[10px] text-muted-foreground italic">
          Opcional: vincule este barbeiro a uma conta de usuário existente.
        </p>
      </div>

      <Button
        type="submit"
        className="h-11 w-full font-semibold rounded-xl"
        disabled={loading}
      >
        {loading ? "Salvando..." : barber ? "Salvar alterações" : "Cadastrar"}
      </Button>
    </form>
  );
}
