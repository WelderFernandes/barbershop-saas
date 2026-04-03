import { getAppointments } from "@/lib/actions/appointment";
import { getBarbers } from "@/lib/actions/barber";
import { getServices } from "@/lib/actions/service";
import { getBusinessHours, getBlockedSlots } from "@/lib/actions/availability";
import { AppointmentsList } from "./appointments-list";

export default async function AppointmentsPage() {
  const [appointments, barbers, services, businessHours, blockedSlots] = await Promise.all([
    getAppointments(),
    getBarbers(),
    getServices(),
    getBusinessHours(),
    getBlockedSlots(),
  ]);

  // Serialize dates for client component
  const serializedAppointments = appointments.map((apt) => ({
    ...apt,
    date: apt.date.toISOString(),
    createdAt: apt.createdAt.toISOString(),
    updatedAt: apt.updatedAt.toISOString(),
  }));

  const serializedBarbers = barbers.map((b) => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  }));

  const serializedServices = services.map((s) => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }));

  const serializedBlockedSlots = blockedSlots.map((s) => ({
    ...s,
    startTime: s.startTime.toISOString(),
    endTime: s.endTime.toISOString(),
  }));

  const serializedBusinessHours = businessHours.map((bh) => ({
    ...bh,
  }));

  return (
    <AppointmentsList
      appointments={serializedAppointments}
      barbers={serializedBarbers}
      services={serializedServices}
      businessHours={serializedBusinessHours}
      blockedSlots={serializedBlockedSlots}
    />
  );
}
