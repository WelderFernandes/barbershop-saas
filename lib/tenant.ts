import { headers } from "next/headers";
import { auth } from "./auth";
import { prisma } from "./prisma";

/**
 * Obtém a sessão do usuário autenticado no server-side.
 * Retorna null se não houver sessão ativa.
 */
export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

/**
 * Obtém o tenantId (barbershopId) a partir da organização ativa na sessão.
 * Retorna null se não houver organização ativa ou barbearia vinculada.
 */
export async function getTenantId(): Promise<string | null> {
  const session = await getSession();
  if (!session?.session?.activeOrganizationId) return null;

  const barbershop = await prisma.barbershop.findUnique({
    where: { organizationId: session.session.activeOrganizationId },
    select: { id: true },
  });

  return barbershop?.id ?? null;
}

/**
 * Exige tenant autenticado. Lança erro se não houver sessão ou tenant.
 * Retorna { session, tenantId } para uso em Server Actions.
 */
export async function requireTenant() {
  const session = await getSession();

  if (!session?.user) {
    throw new Error("Não autorizado");
  }

  const tenantId = await getTenantId();

  if (!tenantId) {
    throw new Error("Nenhuma barbearia selecionada");
  }

  return { session, tenantId };
}
