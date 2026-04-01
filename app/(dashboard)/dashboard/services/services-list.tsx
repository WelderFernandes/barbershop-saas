"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createService,
  updateService,
  deleteService,
} from "@/lib/actions/service";
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

type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  isActive: boolean;
};

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function ServicesList({ services }: { services: Service[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleEdit(service: Service) {
    setEditingService(service);
    setOpen(true);
  }

  function handleNew() {
    setEditingService(null);
    setOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;
    startTransition(async () => {
      await deleteService(id);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Serviços</h1>
          <p className="text-sm text-muted-foreground">
            Serviços oferecidos pela barbearia
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button onClick={handleNew} />}>
            + Novo
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Editar serviço" : "Novo serviço"}
              </DialogTitle>
            </DialogHeader>
            <ServiceForm
              service={editingService}
              onSuccess={() => {
                setOpen(false);
                router.refresh();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {services.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Nenhum serviço cadastrado ainda.
            </p>
            <Button className="mt-4" onClick={handleNew}>
              Cadastrar primeiro serviço
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{service.name}</CardTitle>
                  <Badge variant={service.isActive ? "default" : "secondary"}>
                    {service.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                {service.description && (
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="flex gap-4 text-sm">
                  <span className="font-semibold text-primary">
                    {formatPrice(service.price)}
                  </span>
                  <span className="text-muted-foreground">
                    ⏱ {service.duration} min
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(service)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(service.id)}
                    disabled={isPending}
                  >
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ServiceForm({
  service,
  onSuccess,
}: {
  service: Service | null;
  onSuccess: () => void;
}) {
  const [name, setName] = useState(service?.name ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [priceDisplay, setPriceDisplay] = useState(
    service ? (service.price / 100).toFixed(2) : ""
  );
  const [duration, setDuration] = useState(
    service ? String(service.duration) : ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const priceInCents = Math.round(parseFloat(priceDisplay) * 100);
    const durationMin = parseInt(duration);

    if (isNaN(priceInCents) || priceInCents <= 0) {
      setError("Preço inválido");
      setLoading(false);
      return;
    }

    if (isNaN(durationMin) || durationMin < 5) {
      setError("Duração mínima de 5 minutos");
      setLoading(false);
      return;
    }

    try {
      if (service) {
        await updateService({
          id: service.id,
          name,
          description: description || undefined,
          price: priceInCents,
          duration: durationMin,
        });
      } else {
        await createService({
          name,
          description: description || undefined,
          price: priceInCents,
          duration: durationMin,
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
        <Label htmlFor="service-name">Nome</Label>
        <Input
          id="service-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Corte + Barba"
          required
          minLength={2}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="service-desc">
          Descrição <span className="text-muted-foreground">(opcional)</span>
        </Label>
        <Input
          id="service-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição breve do serviço"
          className="h-11"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="service-price">Preço (R$)</Label>
          <Input
            id="service-price"
            type="number"
            step="0.01"
            min="0.01"
            value={priceDisplay}
            onChange={(e) => setPriceDisplay(e.target.value)}
            placeholder="35.00"
            required
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="service-duration">Duração (min)</Label>
          <Input
            id="service-duration"
            type="number"
            min="5"
            step="5"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="30"
            required
            className="h-11"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="h-11 w-full font-semibold"
        disabled={loading}
      >
        {loading ? "Salvando..." : service ? "Salvar alterações" : "Cadastrar"}
      </Button>
    </form>
  );
}
