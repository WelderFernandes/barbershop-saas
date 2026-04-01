"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} from "@/lib/actions/appointment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type Barber = { id: string; name: string };
type Service = { id: string; name: string; price: number; duration: number };
type Appointment = {
  id: string;
  date: string;
  status: string;
  clientName: string;
  clientPhone: string | null;
  notes: string | null;
  barber: { id: string; name: string };
  service: { id: string; name: string; price: number; duration: number };
};

const statusLabels: Record<string, string> = {
  SCHEDULED: "Agendado",
  CONFIRMED: "Confirmado",
  IN_PROGRESS: "Em atendimento",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
  NO_SHOW: "Não compareceu",
};

const statusColors: Record<string, string> = {
  SCHEDULED: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  CONFIRMED: "bg-green-500/10 text-green-700 dark:text-green-400",
  IN_PROGRESS: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  COMPLETED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  CANCELLED: "bg-red-500/10 text-red-700 dark:text-red-400",
  NO_SHOW: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
};

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function AppointmentsList({
  appointments,
  barbers,
  services,
}: {
  appointments: Appointment[];
  barbers: Barber[];
  services: Service[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleStatusChange(
    id: string,
    status: string
  ) {
    startTransition(async () => {
      await updateAppointmentStatus({
        id,
        status: status as "SCHEDULED" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "NO_SHOW",
      });
      router.refresh();
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este agendamento?")) return;
    startTransition(async () => {
      await deleteAppointment(id);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agenda</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie seus agendamentos
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}>
            + Novo
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Novo agendamento</DialogTitle>
            </DialogHeader>
            <AppointmentForm
              barbers={barbers}
              services={services}
              onSuccess={() => {
                setOpen(false);
                router.refresh();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {appointments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Nenhum agendamento encontrado.
            </p>
            <Button className="mt-4" onClick={() => setOpen(true)}>
              Criar primeiro agendamento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => (
            <Card key={apt.id}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{apt.clientName}</p>
                      <Badge
                        variant="secondary"
                        className={statusColors[apt.status] ?? ""}
                      >
                        {statusLabels[apt.status] ?? apt.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      📅{" "}
                      {new Date(apt.date).toLocaleDateString("pt-BR", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                      })}{" "}
                      às{" "}
                      {new Date(apt.date).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ✂️ {apt.service.name} · 💈 {apt.barber.name} ·{" "}
                      {formatPrice(apt.service.price)}
                    </p>
                    {apt.clientPhone && (
                      <p className="text-sm text-muted-foreground">
                        📱 {apt.clientPhone}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {apt.status === "SCHEDULED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleStatusChange(apt.id, "CONFIRMED")
                        }
                        disabled={isPending}
                      >
                        Confirmar
                      </Button>
                    )}
                    {apt.status === "CONFIRMED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleStatusChange(apt.id, "IN_PROGRESS")
                        }
                        disabled={isPending}
                      >
                        Iniciar
                      </Button>
                    )}
                    {apt.status === "IN_PROGRESS" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          handleStatusChange(apt.id, "COMPLETED")
                        }
                        disabled={isPending}
                      >
                        Concluir
                      </Button>
                    )}
                    {(apt.status === "SCHEDULED" ||
                      apt.status === "CONFIRMED") && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() =>
                          handleStatusChange(apt.id, "CANCELLED")
                        }
                        disabled={isPending}
                      >
                        Cancelar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(apt.id)}
                      disabled={isPending}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function AppointmentForm({
  barbers,
  services,
  onSuccess,
}: {
  barbers: Barber[];
  services: Service[];
  onSuccess: () => void;
}) {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [barberId, setBarberId] = useState(barbers[0]?.id ?? "");
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!date || !time) {
      setError("Data e hora são obrigatórios");
      setLoading(false);
      return;
    }

    const dateTime = new Date(`${date}T${time}:00`);

    try {
      await createAppointment({
        date: dateTime.toISOString(),
        clientName,
        clientPhone: clientPhone || undefined,
        barberId,
        serviceId,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao agendar");
    } finally {
      setLoading(false);
    }
  }

  if (barbers.length === 0 || services.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        <p>Cadastre pelo menos um barbeiro e um serviço antes de agendar.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="apt-client">Nome do cliente</Label>
        <Input
          id="apt-client"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Nome do cliente"
          required
          minLength={2}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="apt-phone">
          Telefone <span className="text-muted-foreground">(opcional)</span>
        </Label>
        <Input
          id="apt-phone"
          type="tel"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
          placeholder="(11) 99999-9999"
          className="h-11"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="apt-date">Data</Label>
          <Input
            id="apt-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apt-time">Hora</Label>
          <Input
            id="apt-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="h-11"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="apt-barber">Barbeiro</Label>
        <select
          id="apt-barber"
          value={barberId}
          onChange={(e) => setBarberId(e.target.value)}
          className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {barbers.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="apt-service">Serviço</Label>
        <select
          id="apt-service"
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {formatPrice(s.price)} ({s.duration}min)
            </option>
          ))}
        </select>
      </div>

      <Button
        type="submit"
        className="h-11 w-full font-semibold"
        disabled={loading}
      >
        {loading ? "Agendando..." : "Agendar"}
      </Button>
    </form>
  );
}
