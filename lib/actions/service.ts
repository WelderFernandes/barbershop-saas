"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/tenant";

// ═══════════════════════════════════════════════════════
// Schemas de validação
// ═══════════════════════════════════════════════════════

const createServiceSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  price: z.number().int().positive("Preço deve ser positivo"), // em centavos
  duration: z.number().int().min(5, "Duração mínima de 5 minutos"),
});

const updateServiceSchema = z.object({
  id: z.string(),
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.number().int().positive().optional(),
  duration: z.number().int().min(5).optional(),
  isActive: z.boolean().optional(),
});

// ═══════════════════════════════════════════════════════
// Actions
// ═══════════════════════════════════════════════════════

export async function getServices() {
  const { tenantId } = await requireTenant();

  return prisma.service.findMany({
    where: { barbershopId: tenantId },
    orderBy: { name: "asc" },
  });
}

export async function createService(
  input: z.infer<typeof createServiceSchema>
) {
  const { tenantId } = await requireTenant();
  const data = createServiceSchema.parse(input);

  const service = await prisma.service.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      duration: data.duration,
      barbershopId: tenantId,
    },
  });

  return { success: true, service };
}

export async function updateService(
  input: z.infer<typeof updateServiceSchema>
) {
  const { tenantId } = await requireTenant();
  const data = updateServiceSchema.parse(input);

  const existing = await prisma.service.findFirst({
    where: { id: data.id, barbershopId: tenantId },
  });
  if (!existing) throw new Error("Serviço não encontrado");

  const service = await prisma.service.update({
    where: { id: data.id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description !== undefined && {
        description: data.description,
      }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.duration !== undefined && { duration: data.duration }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });

  return { success: true, service };
}

export async function deleteService(id: string) {
  const { tenantId } = await requireTenant();

  const existing = await prisma.service.findFirst({
    where: { id, barbershopId: tenantId },
  });
  if (!existing) throw new Error("Serviço não encontrado");

  await prisma.service.delete({ where: { id } });

  return { success: true };
}
