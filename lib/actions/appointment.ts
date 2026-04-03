"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/tenant";
import { checkAvailability } from "./availability";

// ═══════════════════════════════════════════════════════
// Schemas de validação
// ═══════════════════════════════════════════════════════

const createAppointmentSchema = z.object({
  date: z.string().datetime(), // ISO string
  clientName: z.string().min(2, "Nome do cliente obrigatório"),
  clientPhone: z.string().optional(),
  barberId: z.string(),
  serviceId: z.string(),
  notes: z.string().optional(),
});

const updateStatusSchema = z.object({
  id: z.string(),
  status: z.enum([
    "SCHEDULED",
    "CONFIRMED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
    "NO_SHOW",
  ]),
});

// ═══════════════════════════════════════════════════════
// Actions
// ═══════════════════════════════════════════════════════

export async function getAppointments(filters?: {
  date?: string; // YYYY-MM-DD
  barberId?: string;
  status?: string;
}) {
  const { tenantId } = await requireTenant();

  const where: Record<string, unknown> = {
    barbershopId: tenantId,
  };

  if (filters?.date) {
    const start = new Date(filters.date);
    const end = new Date(filters.date);
    end.setDate(end.getDate() + 1);
    where.date = { gte: start, lt: end };
  }

  if (filters?.barberId) {
    where.barberId = filters.barberId;
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  return prisma.appointment.findMany({
    where,
    include: {
      barber: { select: { id: true, name: true, avatarUrl: true } },
      service: { select: { id: true, name: true, price: true, duration: true } },
    },
    orderBy: { date: "asc" },
  });
}

export async function getTodayAppointments() {
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];
  return getAppointments({ date: dateStr });
}

export async function createAppointment(
  input: z.infer<typeof createAppointmentSchema>
) {
  const { tenantId } = await requireTenant();
  const data = createAppointmentSchema.parse(input);

  // Validar que barbeiro e serviço pertencem ao tenant
  const [barber, service] = await Promise.all([
    prisma.barber.findFirst({
      where: { id: data.barberId, barbershopId: tenantId },
    }),
    prisma.service.findFirst({
      where: { id: data.serviceId, barbershopId: tenantId },
    }),
  ]);

  if (!barber) throw new Error("Barbeiro não encontrado");
  if (!service) throw new Error("Serviço não encontrado");

  // Validar disponibilidade real
  await checkAvailability({
    barberId: data.barberId,
    startTime: new Date(data.date),
    durationInMinutes: service.duration,
  });

  const appointment = await prisma.appointment.create({
    data: {
      date: new Date(data.date),
      clientName: data.clientName,
      clientPhone: data.clientPhone,
      notes: data.notes,
      barberId: data.barberId,
      serviceId: data.serviceId,
      barbershopId: tenantId,
    },
    include: {
      barber: { select: { id: true, name: true, avatarUrl: true } },
      service: { select: { id: true, name: true, price: true, duration: true } },
    },
  });

  return { success: true, appointment };
}

export async function updateAppointmentStatus(
  input: z.infer<typeof updateStatusSchema>
) {
  const { tenantId } = await requireTenant();
  const data = updateStatusSchema.parse(input);

  const existing = await prisma.appointment.findFirst({
    where: { id: data.id, barbershopId: tenantId },
  });
  if (!existing) throw new Error("Agendamento não encontrado");

  const appointment = await prisma.appointment.update({
    where: { id: data.id },
    data: { status: data.status },
  });

  return { success: true, appointment };
}

export async function deleteAppointment(id: string) {
  const { tenantId } = await requireTenant();

  const existing = await prisma.appointment.findFirst({
    where: { id, barbershopId: tenantId },
  });
  if (!existing) throw new Error("Agendamento não encontrado");

  await prisma.appointment.delete({ where: { id } });

  return { success: true };
}
