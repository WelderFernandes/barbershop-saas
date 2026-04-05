"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/tenant";

// ═══════════════════════════════════════════════════════
// Schemas de validação
// ═══════════════════════════════════════════════════════

const teamSchema = z.object({
  name: z.string().min(2, "Nome do time deve ter no mínimo 2 caracteres"),
});

// ═══════════════════════════════════════════════════════
// Actions
// ═══════════════════════════════════════════════════════

export async function getTeams() {
  const { session } = await requireTenant();
  const organizationId = session.session.activeOrganizationId;

  if (!organizationId) throw new Error("Organização não ativa");

  return prisma.team.findMany({
    where: { organizationId: organizationId as string },

    include: {
      _count: {
        select: { members: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createTeam(name: string) {
  const { session } = await requireTenant();
  const organizationId = session.session.activeOrganizationId;

  if (!organizationId) throw new Error("Organização não ativa");

  const validated = teamSchema.parse({ name });

  const team = await prisma.team.create({
    data: {
      name: validated.name,
      organizationId,
    },
  });

  return { success: true, team };
}

export async function updateTeam(id: string, name: string) {
  const { session } = await requireTenant();
  const organizationId = session.session.activeOrganizationId;

  const validated = teamSchema.parse({ name });

  // Verificar se o time pertence à organização
  const existing = await prisma.team.findFirst({
    where: { id, organizationId: organizationId as string },
  });

  if (!existing) throw new Error("Time não encontrado");

  await prisma.team.update({
    where: { id },
    data: { name: validated.name },
  });

  return { success: true };
}

export async function deleteTeam(id: string) {
  const { session } = await requireTenant();
  const organizationId = session.session.activeOrganizationId;

  // Verificar se o time pertence à organização e se possui membros
  const existing = await prisma.team.findFirst({
    where: { id, organizationId: organizationId as string },
    include: {
      _count: {
        select: { members: true },
      },
    },
  });

  if (!existing) throw new Error("Time não encontrado");
  if (existing._count.members > 0) {
    throw new Error("Não é possível excluir um time que possui membros");
  }

  await prisma.team.delete({
    where: { id },
  });

  return { success: true };
}


export async function addMemberToTeam(teamId: string, memberId: string) {
  const { session } = await requireTenant();
  const organizationId = session.session.activeOrganizationId;

  // Validar time (IDOR check)
  const team = await prisma.team.findFirst({
    where: { id: teamId, organizationId: organizationId as string },
  });
  if (!team) throw new Error("Time não encontrado");

  // Validar membro
  const member = await prisma.member.findFirst({
    where: { id: memberId, organizationId: organizationId as string },
  });

  if (!member) throw new Error("Membro não encontrado na organização");

  await prisma.member.update({
    where: { id: memberId },
    data: { teamId },
  });

  return { success: true };
}

export async function removeMemberFromTeam(memberId: string) {
  const { session } = await requireTenant();
  const organizationId = session.session.activeOrganizationId;

  const member = await prisma.member.findFirst({
    where: { id: memberId, organizationId: organizationId as string },
  });

  if (!member) throw new Error("Membro não encontrado");

  await prisma.member.update({
    where: { id: memberId },
    data: { teamId: null },
  });

  return { success: true };
}

export async function getOrganizationMembers() {
  const { session } = await requireTenant();
  const organizationId = session.session.activeOrganizationId;

  if (!organizationId) throw new Error("Organização não ativa");

  return prisma.member.findMany({
    where: { organizationId: organizationId as string },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

