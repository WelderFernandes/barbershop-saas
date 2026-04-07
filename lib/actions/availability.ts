"use server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/tenant";

// ═══════════════════════════════════════════════════════
// Schemas de validação
// ═══════════════════════════════════════════════════════

const businessHourSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  openTime: z.string().nullable(), // HH:mm ou null para fechado
  closeTime: z.string().nullable(),
  isActive: z.boolean(),
});

const updateBusinessHoursSchema = z.array(businessHourSchema);

const recurrenceTypeEnum = z.enum(["NONE", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"]);

const createBlockedSlotSchema = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  reason: z.string().optional(),
  recurrence: recurrenceTypeEnum,
  recurringUntil: z.string().datetime().nullable().optional(),
  barberId: z.string().optional(), // opcional - se nulo, bloqueia a loja toda
});

// ═══════════════════════════════════════════════════════
// Actions - Horário de Funcionamento
// ═══════════════════════════════════════════════════════

export async function getBusinessHours() {
  const { tenantId } = await requireTenant();

  return prisma.businessHour.findMany({
    where: { barbershopId: tenantId },
    orderBy: { dayOfWeek: "asc" },
  });
}

export async function updateBusinessHours(
  input: z.infer<typeof updateBusinessHoursSchema>
) {
  const { tenantId } = await requireTenant();
  const data = updateBusinessHoursSchema.parse(input);

  // Usando transação para garantir atomicidade no update/upsert
  await prisma.$transaction(
    data.map((hour) =>
      prisma.businessHour.upsert({
        where: {
          // No schema, poderíamos ter um índice único [barbershopId, dayOfWeek] 
          // mas para simplificar usaremos a busca manual ou baseada no ID se soubermos
          // Como o schema define dayOfWeek e barbershopId, vamos fazer um updateMany ou upsert se houver ID.
          // Para este caso, vamos deletar os antigos e salvar os novos para simplificar a gestão.
          id: `legacy-logic-avoidance-${tenantId}-${hour.dayOfWeek}`, // Placeholder ou busca
        },
        update: {
          openTime: hour.openTime,
          closeTime: hour.closeTime,
          isActive: hour.isActive,
        },
        create: {
          dayOfWeek: hour.dayOfWeek,
          openTime: hour.openTime,
          closeTime: hour.closeTime,
          isActive: hour.isActive,
          barbershopId: tenantId,
        },
      })
    )
  );

  // Refatoração baseada no schema real: Como não defini Unique no schema, faremos o delete/create
  await prisma.businessHour.deleteMany({
    where: { barbershopId: tenantId },
  });

  const businessHours = await prisma.businessHour.createMany({
    data: data.map((hour) => ({
      ...hour,
      barbershopId: tenantId,
    })),
  });

  return { success: true, businessHours };
}

// ═══════════════════════════════════════════════════════
// Actions - Bloqueios de Agenda
// ═══════════════════════════════════════════════════════

export async function getBlockedSlots() {
  const { tenantId } = await requireTenant();

  return prisma.blockedSlot.findMany({
    where: { barbershopId: tenantId },
    include: {
      barber: { select: { id: true, name: true } },
    },
    orderBy: { startTime: "asc" },
  });
}

export async function createBlockedSlot(
  input: z.infer<typeof createBlockedSlotSchema>
) {
  const { tenantId } = await requireTenant();
  const data = createBlockedSlotSchema.parse(input);

  const start = new Date(data.startTime);
  const end = new Date(data.endTime);

  if (start >= end) {
    throw new Error("O horário de início deve ser anterior ao de término");
  }

  // 1.b - Validar conflitos com agendamentos existentes
  const conflicts = await prisma.appointment.findMany({
    where: {
      barbershopId: tenantId,
      ...(data.barberId && { barberId: data.barberId }),
      date: {
        gte: start,
        lt: end,
      },
      status: { notIn: ["CANCELLED"] },
    },
    include: {
      service: { select: { name: true } },
      barber: { select: { name: true } },
    },
  });

  if (conflicts.length > 0) {
    const list = conflicts
      .map((c: any) => `${c.clientName} (${c.service.name}) com ${c.barber.name}`)
      .join(", ");
    throw new Error(`Conflito com agendamentos existentes: ${list}. Resolva-os antes de bloquear.`);
  }

  const blockedSlot = await prisma.blockedSlot.create({
    data: {
      startTime: start,
      endTime: end,
      reason: data.reason,
      recurrence: data.recurrence,
      recurringUntil: data.recurringUntil ? new Date(data.recurringUntil) : null,
      barberId: data.barberId || null,
      barbershopId: tenantId,
    },
  });

  return { success: true, blockedSlot };
}

export async function deleteBlockedSlot(id: string) {
  const { tenantId } = await requireTenant();

  const existing = await prisma.blockedSlot.findFirst({
    where: { id, barbershopId: tenantId },
  });
  if (!existing) throw new Error("Bloqueio não encontrado");

  await prisma.blockedSlot.delete({ where: { id } });

  return { success: true };
}

// ═══════════════════════════════════════════════════════
// Lógica de Disponibilidade (Availability Engine)
// ═══════════════════════════════════════════════════════

export async function getAvailableSlots(params: {
  barbershopId: string;
  barberId: string;
  date: Date;
}) {
  const { barbershopId, barberId, date } = params;
  const dayOfWeek = date.getDay();

  // 1. Buscar Horário de Funcionamento para o dia da semana
  const businessHour = await prisma.businessHour.findFirst({
    where: {
      barbershopId,
      dayOfWeek,
      isActive: true,
    },
  });

  if (!businessHour || !businessHour.openTime || !businessHour.closeTime) {
    return []; // Estabelecimento fechado neste dia
  }

  // 2. Buscar agendamentos e bloqueios existentes para o dia
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const [appointments, blockedSlots] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        barbershopId,
        barberId,
        date: { gte: startOfDay, lte: endOfDay },
        status: { notIn: ["CANCELLED"] },
      },
      select: { date: true },
    }),
    prisma.blockedSlot.findMany({
      where: {
        barbershopId,
        AND: [
          { OR: [{ barberId: null }, { barberId }] },
          {
            OR: [
              { recurrence: "NONE", endTime: { gte: startOfDay } },
              {
                recurrence: { not: "NONE" },
                OR: [
                  { recurringUntil: null },
                  { recurringUntil: { gte: startOfDay } },
                ],
              },
            ],
          },
        ],
        startTime: { lte: endOfDay },
      },
    }),
  ]);

  // 3. Gerar slots de 30 em 30 minutos (ajustável) dentro do horário de abertura
  const slots: string[] = [];
  const [openH, openM] = businessHour.openTime.split(":").map(Number);
  const [closeH, closeM] = businessHour.closeTime.split(":").map(Number);

  const currentTime = new Date(date);
  currentTime.setHours(openH, openM, 0, 0);

  const endTime = new Date(date);
  endTime.setHours(closeH, closeM, 0, 0);

  while (currentTime < endTime) {
    const timeString = currentTime.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    // Validar se o slot está livre de agendamentos
    const isAppointed = appointments.some(
      (app: any) => app.date.getHours() === currentTime.getHours() && app.date.getMinutes() === currentTime.getMinutes()
    );

    // Validar se o slot está livre de bloqueios (simplificado)
    const isBlocked = blockedSlots.some((slot: any) => {
      const slotStart = new Date(currentTime);
      const slotEnd = new Date(currentTime);
      slotEnd.setMinutes(slotEnd.getMinutes() + 30);

      // Verificação básica de sobreposição para bloqueios pontuais
      if (slot.recurrence === "NONE") {
        return slot.startTime < slotEnd && slot.endTime > slotStart;
      }
      
      // Para recorrência (Ex: Semanal), verificamos apenas o horário se o dia bate
      const blockStartH = slot.startTime.getHours();
      const blockStartM = slot.startTime.getMinutes();
      const blockEndH = slot.endTime.getHours();
      const blockEndM = slot.endTime.getMinutes();

      const currentH = currentTime.getHours();
      const currentM = currentTime.getMinutes();

      const blockTimeStart = blockStartH * 60 + blockStartM;
      const blockTimeEnd = blockEndH * 60 + blockEndM;
      const currentTimeVal = currentH * 60 + currentM;

      return currentTimeVal >= blockTimeStart && currentTimeVal < blockTimeEnd;
    });

    if (!isAppointed && !isBlocked) {
      slots.push(timeString);
    }

    currentTime.setMinutes(currentTime.getMinutes() + 30);
  }

  return slots;
}

/**
 * Motor de Validação Centralizado
 * Lança um erro se o horário não estiver disponível.
 */
export async function checkAvailability(params: {
  barberId: string;
  startTime: Date;
  durationInMinutes: number;
}) {
  const { tenantId } = await requireTenant();
  const { barberId, startTime, durationInMinutes } = params;
  
  const endTime = new Date(startTime.getTime() + durationInMinutes * 60000);
  const dayOfWeek = startTime.getDay();

  // 1. Validar Horário de Funcionamento
  const businessHour = await prisma.businessHour.findFirst({
    where: {
      barbershopId: tenantId,
      dayOfWeek,
      isActive: true,
    },
  });

  if (!businessHour || !businessHour.openTime || !businessHour.closeTime) {
    throw new Error("A barbearia está fechada neste dia.");
  }

  // Converter horários para minutos desde 00:00 para comparação fácil
  const [openH, openM] = businessHour.openTime.split(":").map(Number);
  const [closeH, closeM] = businessHour.closeTime.split(":").map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
  const endMinutes = endTime.getHours() * 60 + endTime.getMinutes();

  if (startMinutes < openMinutes || endMinutes > closeMinutes) {
    throw new Error(`Fora do horário de funcionamento (${businessHour.openTime} - ${businessHour.closeTime}).`);
  }

  // 2. Validar Bloqueios (BlockedSlot)
  const blockedSlots = await prisma.blockedSlot.findMany({
    where: {
      barbershopId: tenantId,
      AND: [
        { OR: [{ barberId: null }, { barberId }] },
        {
          OR: [
            { recurrence: "NONE", endTime: { gte: startTime } },
            {
              recurrence: { not: "NONE" },
              OR: [
                { recurringUntil: null },
                { recurringUntil: { gte: startTime } },
              ],
            },
          ],
        },
      ],
      startTime: { lte: endTime },
    },
  });

  for (const slot of blockedSlots) {
    if (slot.recurrence === "NONE") {
      if (slot.startTime < endTime && slot.endTime > startTime) {
        throw new Error(`Este horário está bloqueado: ${slot.reason || "Bloqueio manual"}.`);
      }
    } else {
      // Validação simplificada de recorrência (mesmo horário do dia)
      const blockStartH = slot.startTime.getHours();
      const blockStartM = slot.startTime.getMinutes();
      const blockEndH = slot.endTime.getHours();
      const blockEndM = slot.endTime.getMinutes();

      const blockTimeStart = blockStartH * 60 + blockStartM;
      const blockTimeEnd = blockEndH * 60 + blockEndM;

      if (startMinutes < blockTimeEnd && endMinutes > blockTimeStart) {
        throw new Error(`Este horário possui um bloqueio recorrente: ${slot.reason || "Bloqueio de rotina"}.`);
      }
    }
  }

  // 3. Validar Sobreposição de Agendamentos (Double Booking)
  const overlappingAppointment = await prisma.appointment.findFirst({
    where: {
      barberId,
      barbershopId: tenantId,
      status: { notIn: ["CANCELLED"] },
      date: {
        gte: new Date(startTime.getTime() - 60 * 60000), // margem de segurança de 1h antes para busca otimizada
        lte: new Date(endTime.getTime() + 60 * 60000),  // margem de segurança de 1h depois
      },
    },
    include: { service: { select: { duration: true } } }
  });

  if (overlappingAppointment) {
    const aptStart = overlappingAppointment.date;
    const aptEnd = new Date(aptStart.getTime() + overlappingAppointment.service.duration * 60000);

    if (aptStart < endTime && aptEnd > startTime) {
      throw new Error(`O barbeiro selecionado já possui um agendamento das ${aptStart.toLocaleTimeString("pt-BR", {hour: "2-digit", minute: "2-digit"})} às ${aptEnd.toLocaleTimeString("pt-BR", {hour: "2-digit", minute: "2-digit"})}.`);
    }
  }
}
