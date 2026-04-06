import { describe, it, expect, vi, beforeEach, type Mock } from "vitest"
import { createInvite, deleteInvitationAction } from "@/lib/actions/invite"
import { prisma } from "@/lib/prisma"
import { requireTenant } from "@/lib/tenant"

// Mock das dependências
vi.mock("@/lib/prisma", () => ({
  prisma: {
    invitation: {
      update: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    member: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}))

vi.mock("@/lib/tenant", () => ({
  requireTenant: vi.fn(),
}))

// Mock do auth de Better Auth
vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      createInvitation: vi.fn(),
      acceptInvitation: vi.fn(),
      cancelInvitation: vi.fn(),
    },
  },
}))

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue({}),
}))

describe("Ações de Convite (Invite Actions)", () => {
  const mockOrgId = "org-1"
  const mockInviterId = "user-1"

  beforeEach(() => {
    vi.clearAllMocks()
    ;(requireTenant as Mock).mockResolvedValue({
      session: {
        session: { activeOrganizationId: mockOrgId },
        user: { id: mockInviterId },
      },
      tenantId: "barber-1",
    })
  })

  describe("createInvite", () => {
    it("deve criar um convite e vincular ao time no Prisma", async () => {
      const mockInviteData = {
        email: "test@example.com",
        role: "member" as const,
        teamId: "team-1",
      }
      const mockInvitationId = "invite-123"

      // Mock de permissão de admin
      ;(prisma.member.findFirst as Mock).mockResolvedValue({
        id: "admin-1",
        role: "admin",
      })

      const { auth } = await import("@/lib/auth")
      ;(auth.api.createInvitation as unknown as Mock).mockResolvedValue({
        id: mockInvitationId,
      })


      const result = await createInvite(
        mockInviteData.email,
        mockInviteData.role,
        mockInviteData.teamId
      )

      // Verificando chamada ao Better Auth
      expect(auth.api.createInvitation).toHaveBeenCalled()

      // Verificando vinculação do time no Prisma
      expect(prisma.invitation.update).toHaveBeenCalledWith({
        where: { id: mockInvitationId },
        data: { teamId: mockInviteData.teamId },
      })

      expect(result.success).toBe(true)
    })

    it("deve lançar erro se o convidador não tiver permissão (Owner/Admin)", async () => {
      ;(prisma.member.findFirst as Mock).mockResolvedValue(null)
      await expect(createInvite("test@example.com", "member")).rejects.toThrow(
        "Permissão insuficiente"
      )
    })
  });

  describe("deleteInvitationAction", () => {
    it("deve cancelar o convite no Better Auth", async () => {
      const mockInvitationId = "invite-123"

      // Mock de permissão de admin
      ;(prisma.member.findFirst as Mock).mockResolvedValue({
        id: "admin-1",
        role: "admin",
      })

      const { auth } = await import("@/lib/auth")
      ;(auth.api.cancelInvitation as unknown as Mock).mockResolvedValue({ success: true })

      const result = await deleteInvitationAction(mockInvitationId)


      // Verificando chamada ao Better Auth
      expect(auth.api.cancelInvitation).toHaveBeenCalledWith({
        body: { invitationId: mockInvitationId },
        headers: expect.anything(),
      })

      expect(result.success).toBe(true)
    })
  })
})
