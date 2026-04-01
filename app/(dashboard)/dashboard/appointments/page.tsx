import { getAppointments } from "@/lib/actions/appointment";
import { getBarbers } from "@/lib/actions/barber";
import { getServices } from "@/lib/actions/service";
import { AppointmentsList } from "./appointments-list";

export default async function AppointmentsPage() {
  const [appointments, barbers, services] = await Promise.all([
    getAppointments(),
    getBarbers(),
    getServices(),
  ]);

  // Serialize dates for client component
  const serializedAppointments = appointments.map((apt) => ({
    ...apt,
    date: apt.date.toISOString(),
  }));

  return (
    <AppointmentsList
      appointments={serializedAppointments}
      barbers={barbers}
      services={services}
    />
  );
}
