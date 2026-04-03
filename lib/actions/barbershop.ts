"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession, requireTenant } from "@/lib/tenant";

// ═══════════════════════════════════════════════════════
// Schemas de validação
// ═══════════════════════════════════════════════════════

const updateBarbershopSchema = z.object({
  id: z.string(),
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  logoUrl: z.string().optional(),
  coverUrl: z.string().optional(),
});

// ═══════════════════════════════════════════════════════
// Actions
// ═══════════════════════════════════════════════════════

/**
 * Cria uma nova barbearia + organização no Better Auth.
 * Chamado durante o onboarding do owner.
 */
export async function getBarbershop() {
  const { tenantId } = await requireTenant();
  
  const barbershop = await prisma.barbershop.findUnique({
    where: { id: tenantId },
  });

  if (!barbershop) throw new Error("Barbearia não encontrada");

  return barbershop;
}

/**
 * Cria uma nova barbearia + organização no Better Auth.
  input: z.infer<typeof createBarbershopSchema>
) {
  const session = await getSession();
  if (!session?.user) throw new Error("Não autorizado");

  const data = createBarbershopSchema.parse(input);

  // Gerar slug a partir do nome
  const slug = data.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Verificar se slug já existe
  const existingSlug = await prisma.barbershop.findUnique({
    where: { slug },
  });
  const finalSlug = existingSlug
    ? `${slug}-${Date.now().toString(36)}`
    : slug;

  // Criar organização no Better Auth
  const org = await auth.api.createOrganization({
    headers: await headers(),
    body: {
      name: data.name,
      slug: finalSlug,
    },
  });

  // Criar barbearia vinculada à organização
  const barbershop = await prisma.barbershop.create({
    data: {
      name: data.name,
      slug: finalSlug,
      phone: data.phone,
      address: data.address,
      ownerId: session.user.id,
      organizationId: org.id,
    },
  });

  // Definir a organização como ativa na sessão
  await auth.api.setActiveOrganization({
    headers: await headers(),
    body: {
      organizationId: org.id,
    },
  });

  return { success: true, barbershop };
}

/**
 * Atualiza dados de uma barbearia existente.
 */
export async function updateBarbershop(
  input: z.infer<typeof updateBarbershopSchema>
) {
  const session = await getSession();
  if (!session?.user) throw new Error("Não autorizado");

  const data = updateBarbershopSchema.parse(input);

  // Verificar que a barbearia pertence ao owner
  const barbershop = await prisma.barbershop.findFirst({
    where: {
      id: data.id,
      ownerId: session.user.id,
    },
  });

  if (!barbershop) throw new Error("Barbearia não encontrada");

  const updated = await prisma.barbershop.update({
    where: { id: data.id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
      ...(data.coverUrl !== undefined && { coverUrl: data.coverUrl }),
    },
  });

  return { success: true, barbershop: updated };
}
