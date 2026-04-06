"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireTenant } from "@/lib/tenant"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

// ═══════════════════════════════════════════════════════
// Schemas de validação
// ═══════════════════════════════════════════════════════

const inviteSchema = z.object({
  email: z.string().email("E-mail inválido"),
  role: z.enum(["admin", "member", "owner"]),
  teamId: z.string().optional(),
})

// ═══════════════════════════════════════════════════════
// Actions
// ═══════════════════════════════════════════════════════

export async function createInvite(
  email: string,
  role: "admin" | "member" | "owner",
  teamId?: string
) {
  const { session } = await requireTenant()
  const organizationId = session.session.activeOrganizationId
  const userId = session.user.id

  if (!organizationId) throw new Error("Organização não ativa")

  // Verificar permissão (Apenas Owner/Admin podem convidar)
  const inviterMember = await prisma.member.findFirst({
    where: {
      userId,
      organizationId: organizationId as string,
      role: { in: ["admin", "owner"] },
    },
  })

  if (!inviterMember) throw new Error("Permissão insuficiente")

  const validated = inviteSchema.parse({ email, role, teamId })

  // 1. Criar convite no Better Auth (ele processa o e-mail via auth.ts)
  // Nota: Usamos auth.api.inviteMember conforme documentação oficial do plugin de organização
  const invitation = await auth.api.createInvitation({
    body: {
      email: validated.email,
      role: validated.role,
      organizationId: organizationId as string,
    },
    headers: await headers(),
  })

  if (!invitation || !invitation.id) {
    throw new Error("Erro ao criar convite no Better Auth")
  }

  // 2. Vincular o time no Prisma (Better Auth cria o registro na tabela Invitation)
  if (validated.teamId) {
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { teamId: validated.teamId },
    })
  }

  return { success: true, invitation }
}

export async function acceptInvitationAction(invitationId: string) {
  // 1. Buscar o convite antes de ser processado pelo Better Auth para saber o time
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
  })

  if (!invitation) throw new Error("Convite não encontrado ou já expirado")

  // 2. Aceitar no Better Auth (isso cria o registro Member)
  try {
    await auth.api.acceptInvitation({
      body: { invitationId },
      headers: await headers(),
    })
  } catch (error) {
    console.error("Erro no acceptInvite do Better Auth:", error)
    throw new Error("Falha ao aceitar convite no sistema de autenticação")
  }

  // 3. Vincular ao time no Prisma se houver um teamId
  if (invitation.teamId) {
    const member = await prisma.member.findFirst({
      where: {
        organizationId: invitation.organizationId,
        user: { email: invitation.email },
      },
    })

    if (member) {
      await prisma.member.update({
        where: { id: member.id },
        data: { teamId: invitation.teamId },
      })
    }
  }

  return { success: true }
}

export async function deleteInvitationAction(invitationId: string) {
  const { session } = await requireTenant()
  const organizationId = session.session.activeOrganizationId
  const userId = session.user.id

  if (!organizationId) throw new Error("Organização não ativa")

  // Verificar permissão (Apenas Owner/Admin podem deletar/cancelar convites)
  const inviterMember = await prisma.member.findFirst({
    where: {
      userId,
      organizationId: organizationId as string,
      role: { in: ["admin", "owner"] },
    },
  })

  if (!inviterMember) throw new Error("Permissão insuficiente")

  // Cancelar no Better Auth
  try {
    await auth.api.cancelInvitation({
      body: { invitationId },
      headers: await headers(),
    })
  } catch (error) {
    console.error("Erro ao cancelar convite:", error)
    throw new Error("Falha ao revogar convite")
  }

  // Opcional: Se queremos deleção física, poderíamos fazer prisma.invitation.delete aqui.
  // Como o Better Auth apenas muda o status por padrão, vamos deixar assim para manter auditoria,
  // mas o 'listInvitations' filtrará.

  return { success: true }
}

export async function listInvitations() {

  const { session } = await requireTenant()
  const organizationId = session.session.activeOrganizationId

  if (!organizationId) throw new Error("Organização não ativa")

  return prisma.invitation.findMany({
    where: { 
      organizationId: organizationId as string,
      status: "pending" 
    },
    include: { team: true },
    orderBy: { createdAt: "desc" },
  })
}

