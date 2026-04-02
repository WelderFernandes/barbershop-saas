"use server";

import { prisma } from "@/lib/prisma";
import { AppointmentStatus } from "@prisma/client";
import { z } from "zod";

/**
 * Busca os dados da barbearia pelo slug (usado no subdomínio)
 */
export async function getPublicBarbershopData(slug: string) {
  return await prisma.barbershop.findUnique({
    where: { slug },
    include: {
      services: {
        where: { isActive: true },
        orderBy: { name: "asc" },
      },
      barbers: {
        where: { isActive: true },
        orderBy: { name: "asc" },
      },
    },
  });
}

const bookingSchema = z.object({
  barbershopId: z.string(),
  serviceId: z.string(),
  barberId: z.string(),
  date: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
  clientName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  clientPhone: z.string().min(8, "Telefone inválido"),
});

/**
 * Cria um agendamento público (Guest Flow)
 */
export async function createPublicAppointment(formData: z.infer<typeof bookingSchema>) {
  const validated = bookingSchema.parse(formData);

  return await prisma.appointment.create({
    data: {
      barbershopId: validated.barbershopId,
      serviceId: validated.serviceId,
      barberId: validated.barberId,
      date: validated.date,
      clientName: validated.clientName,
      clientPhone: validated.clientPhone,
      status: AppointmentStatus.SCHEDULED,
    },
  });
}
