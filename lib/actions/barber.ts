"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/tenant";

// ═══════════════════════════════════════════════════════
// Schemas de validação
// ═══════════════════════════════════════════════════════

const createBarberSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z.string().optional(),
});

const updateBarberSchema = z.object({
  id: z.string(),
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  isActive: z.boolean().optional(),
});

// ═══════════════════════════════════════════════════════
// Actions
// ═══════════════════════════════════════════════════════

export async function getBarbers() {
  const { tenantId } = await requireTenant();

  return prisma.barber.findMany({
    where: { barbershopId: tenantId },
    orderBy: { name: "asc" },
  });
}

export async function createBarber(
  input: z.infer<typeof createBarberSchema>
) {
  const { tenantId } = await requireTenant();
  const data = createBarberSchema.parse(input);

  const barber = await prisma.barber.create({
    data: {
      name: data.name,
      phone: data.phone,
      barbershopId: tenantId,
    },
  });

  return { success: true, barber };
}

export async function updateBarber(
  input: z.infer<typeof updateBarberSchema>
) {
  const { tenantId } = await requireTenant();
  const data = updateBarberSchema.parse(input);

  // Garantir que o barbeiro pertence ao tenant
  const existing = await prisma.barber.findFirst({
    where: { id: data.id, barbershopId: tenantId },
  });
  if (!existing) throw new Error("Barbeiro não encontrado");

  const barber = await prisma.barber.update({
    where: { id: data.id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });

  return { success: true, barber };
}

export async function deleteBarber(id: string) {
  const { tenantId } = await requireTenant();

  // Garantir que o barbeiro pertence ao tenant
  const existing = await prisma.barber.findFirst({
    where: { id, barbershopId: tenantId },
  });
  if (!existing) throw new Error("Barbeiro não encontrado");

  await prisma.barber.delete({ where: { id } });

  return { success: true };
}
