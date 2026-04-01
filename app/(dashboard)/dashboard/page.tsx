import { getTodayAppointments } from "@/lib/actions/appointment";
import { getSession, getTenantId } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/generated/prisma/client";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const tenantId = await getTenantId();

  // Se não tem barbearia, redireciona para onboarding
  if (!tenantId) redirect("/onboarding");

  // Buscar dados do dashboard
  const [todayAppointments, totalBarbers, totalServices, totalAppointments] = await Promise.all([
    getTodayAppointments(),
    prisma.barber.count({ where: { barbershopId: tenantId } }),
    prisma.service.count({ where: { barbershopId: tenantId } }),
    prisma.appointment.count({ where: { barbershopId: tenantId } }),
  ]);

  const appointments = todayAppointments;

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h2 className="font-heading text-4xl font-black uppercase tracking-tighter italic">
            Command <span className="text-primary">Center</span>
          </h2>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Operational Intelligence // {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
        <div className="flex items-center gap-2 border-2 border-primary p-1">
          <div className="bg-primary px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
            Status
          </div>
          <div className="px-4 font-mono text-[10px] font-black uppercase tracking-widest">
            Optimal Performance
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Agendamentos", value: totalAppointments, icon: "📅", label: "01 // Vol" },
          { title: "Agendamentos Hoje", value: todayAppointments.length, icon: "⚡", label: "02 // Now" },
          { title: "Geral Barbeiros", value: totalBarbers, icon: "💈", label: "03 // Op" },
          { title: "Geral Serviços", value: totalServices, icon: "✂️", label: "04 // Svc" },
        ].map((stat) => (
          <div key={stat.title} className="group relative border border-border bg-card p-6 transition-all hover:border-primary">
            <div className="absolute top-0 right-0 p-2 font-mono text-[8px] font-bold text-muted-foreground/30">
              {stat.label}
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-primary">
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

      <div className="border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="space-y-1">
            <h3 className="font-heading text-2xl font-black uppercase tracking-tighter">
              Active Queue
            </h3>
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              Recent Appointments Log
            </p>
          </div>
          <Button variant="outline" className="rounded-none border-2 font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground">
            View All Records
          </Button>
        </div>

        <div className="divide-y divide-border/50">
          {appointments.length > 0 ? (
            appointments.map((appointment: any) => (
              <div
                key={appointment.id}
                className="group flex flex-col items-start gap-4 p-6 transition-colors hover:bg-muted/30 md:flex-row md:items-center"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-primary bg-primary/5 font-heading text-xl font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  {appointment.clientName?.[0] || "C"}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading text-lg font-bold uppercase tracking-tight">
                      {appointment.clientName}
                    </h4>
                    <span className="border border-border px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                      {appointment.service?.name}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                    Operador: {appointment.barber?.name} // Ref: {appointment.id.slice(0, 8)}
                  </p>
                </div>

                <div className="flex w-full flex-col items-start gap-4 md:w-auto md:flex-row md:items-center md:gap-8">
                  <div className="flex flex-col md:text-right">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest">
                      {new Date(appointment.date).toLocaleDateString("pt-BR")}
                    </span>
                    <span className="font-heading text-xl font-black text-primary">
                      {new Date(appointment.date).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  
                  <div className={`border px-4 py-1 font-mono text-[10px] font-black uppercase tracking-widest ${
                    appointment.status === "COMPLETED"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                      : appointment.status === "CONFIRMED"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-muted-foreground bg-muted text-muted-foreground"
                  }`}>
                    {appointment.status}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-40 items-center justify-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {/* No Active Operations Found */}
              // No Active Operations Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
