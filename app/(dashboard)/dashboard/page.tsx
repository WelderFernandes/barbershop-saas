import { getTodayAppointments } from "@/lib/actions/appointment";
import { getSession, getTenantId } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const tenantId = await getTenantId();

  // Se não tem barbearia, redireciona para onboarding
  if (!tenantId) redirect("/onboarding");

  // Buscar dados do dashboard
  const [todayAppointments, barbersCount, servicesCount] = await Promise.all([
    getTodayAppointments(),
    prisma.barber.count({ where: { barbershopId: tenantId } }),
    prisma.service.count({ where: { barbershopId: tenantId } }),
  ]);

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

  return (
    <div className="space-y-6">
      {/* Saudação */}
      <div>
        <h1 className="text-2xl font-bold">
          Olá, {session.user.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground">
          Veja o resumo do dia na sua barbearia
        </p>
      </div>

      {/* Cards de métricas — mobile: empilhados, desktop: grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Agendamentos hoje</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {todayAppointments.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Barbeiros ativos</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {barbersCount}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Serviços cadastrados</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {servicesCount}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Agenda do dia */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📅 Agenda de hoje</CardTitle>
          <CardDescription>
            {todayAppointments.length > 0
              ? `${todayAppointments.length} agendamento(s)`
              : "Nenhum agendamento para hoje"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todayAppointments.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhum agendamento para hoje. Aproveite para cadastrar serviços e barbeiros!
            </p>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{apt.clientName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(apt.date).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      · {apt.service.name} · {apt.barber.name}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={statusColors[apt.status] ?? ""}
                  >
                    {statusLabels[apt.status] ?? apt.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
