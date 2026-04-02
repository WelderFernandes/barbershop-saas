"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

const onboardingSchema = z.object({
  name: z.string().min(3, "Nome da barbearia deve ter pelo menos 3 caracteres"),
  slug: z.string().min(3, "Slug deve ter pelo menos 3 caracteres"),
});

export async function completeOnboarding(input: z.infer<typeof onboardingSchema>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Não autorizado");
  }

  const data = onboardingSchema.parse(input);

  // 1. Criar a Organização no Better Auth
  const org = await auth.api.createOrganization({
    headers: await headers(),
    body: {
      name: data.name,
      slug: data.slug,
    },
  });

  if (!org) {
    throw new Error("Erro ao criar organização");
  }

  // 2. Criar a Barbearia vinculada no nosso Banco
  await prisma.barbershop.create({
    data: {
      name: data.name,
      slug: data.slug,
      ownerId: session.user.id,
      organizationId: org.id,
    },
  });

  // 3. Definir como organização ativa
  await auth.api.setActiveOrganization({
    headers: await headers(),
    body: {
      organizationId: org.id,
    },
  });

  return { success: true };
}
