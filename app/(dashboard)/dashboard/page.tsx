import { getTodayAppointments } from "@/lib/actions/appointment"
import { getSession, getTenantId } from "@/lib/tenant"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Widget } from "./_components/widget"

export default async function DashboardPage() {
  const session = await getSession()
  if (!session?.user) redirect("/login")

  const tenantId = await getTenantId()

  // Se não tem barbearia, redireciona para onboarding
  if (!tenantId) redirect("/onboarding")

  type AppointmentWithRelations = Awaited<
    ReturnType<typeof getTodayAppointments>
  >[number]

  // Buscar dados do dashboard
  const [todayAppointments, totalBarbers, totalServices, totalAppointments] =
    await Promise.all([
      getTodayAppointments(),
      prisma.barber.count({ where: { barbershopId: tenantId } }),
      prisma.service.count({ where: { barbershopId: tenantId } }),
      prisma.appointment.count({ where: { barbershopId: tenantId } }),
    ])

  const appointments = todayAppointments

  return (
    <div className="space-y-10">
      <Widget />

      <div className="grid gap-6 rounded-md md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Agendamentos",
            value: totalAppointments,
            icon: "📅",
            label: "01 // Vol",
          },
          {
            title: "Agendamentos Hoje",
            value: todayAppointments.length,
            icon: "⚡",
            label: "02 // Now",
          },
          {
            title: "Geral Barbeiros",
            value: totalBarbers,
            icon: "💈",
            label: "03 // Op",
          },
          {
            title: "Geral Serviços",
            value: totalServices,
            icon: "✂️",
            label: "04 // Svc",
          },
        ].map((stat) => (
          <div
            key={stat.title}
            className="group relative rounded-md border border-border bg-card p-6 transition-all hover:cursor-pointer hover:border-primary"
          >
            <div className="absolute top-0 right-0 p-2 font-mono text-[8px] font-bold text-muted-foreground/30">
              {stat.label}
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase transition-colors group-hover:text-primary">
                {stat.title}
              </span>
              <span className="text-xl grayscale transition-all group-hover:scale-110 group-hover:grayscale-0">
                {stat.icon}
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-heading text-4xl font-black tracking-tighter">
                {stat.value}
              </span>
              <div className="h-1 w-8 bg-primary/20 transition-all group-hover:w-16 group-hover:bg-primary" />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-md border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="space-y-1">
            <h3 className="font-heading text-xl font-semibold tracking-tighter uppercase">
              Agenda de Hoje
            </h3>
            <p className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
              Atividades recentes
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-md border-2 font-mono text-[10px] font-bold tracking-widest uppercase hover:bg-primary hover:text-primary-foreground"
          >
            Ver Todos os Registros
          </Button>
        </div>

        <div className="divide-y divide-border/50">
          {appointments.length > 0 ? (
            appointments.map((appointment: AppointmentWithRelations) => (
              <div
                key={appointment.id}
                className="group flex flex-col items-start gap-4 p-6 transition-colors hover:bg-muted/30 md:flex-row md:items-center"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-primary bg-primary/5 font-heading text-xl font-bold text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                  {appointment.clientName?.[0] || "C"}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading text-lg font-bold tracking-tight uppercase">
                      {appointment.clientName}
                    </h4>
                    <span className="border border-border px-2 py-0.5 font-mono text-[8px] font-bold tracking-widest text-muted-foreground uppercase">
                      {appointment.service?.name}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] tracking-widest text-muted-foreground/60 uppercase">
                    Operador: {appointment.barber?.name} {"//"} Ref:{" "}
                    {appointment.id.slice(0, 8)}
                  </p>
                </div>

                <div className="flex w-full flex-col items-start gap-4 md:w-auto md:flex-row md:items-center md:gap-8">
                  <div className="flex flex-col md:text-right">
                    <span className="font-mono text-[10px] font-bold tracking-widest uppercase">
                      {new Date(appointment.date).toLocaleDateString("pt-BR")}
                    </span>
                    <span className="font-heading text-xl font-black text-primary">
                      {new Date(appointment.date).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div
                    className={`border px-4 py-1 font-mono text-[10px] font-black tracking-widest uppercase ${
                      appointment.status === "COMPLETED"
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                        : appointment.status === "CONFIRMED"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-muted-foreground bg-muted text-muted-foreground"
                    }`}
                  >
                    {appointment.status}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-40 items-center justify-center font-mono text-xs tracking-widest text-muted-foreground uppercase">
              {/* No Active Operations Found */}
              Nenhum Agendamento Encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
