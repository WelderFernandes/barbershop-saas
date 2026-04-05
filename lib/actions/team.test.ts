import { describe, it, expect, vi, beforeEach, type Mock } from "vitest"
import {
  createTeam,
  getTeams,
  addMemberToTeam,
  deleteTeam,
} from "@/lib/actions/team"
import { prisma } from "@/lib/prisma"
import { requireTenant } from "@/lib/tenant"

// Mock das dependências
vi.mock("@/lib/prisma", () => ({
  prisma: {
    team: {
      findMany: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
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

describe("Ações de Time (Team Actions)", () => {
  const mockTenantId = "barbershop-1"
  const mockOrgId = "org-1"

  beforeEach(() => {
    vi.clearAllMocks()
    ;(requireTenant as Mock).mockResolvedValue({
      session: { session: { activeOrganizationId: mockOrgId } },
      tenantId: mockTenantId,
    })
  })

  describe("getTeams", () => {
    it("deve carregar os times da organização ativa", async () => {
      const mockTeams = [
        { id: "team-1", name: "Time Alpha", organizationId: mockOrgId },
      ]
      ;(prisma.team.findMany as Mock).mockResolvedValue(mockTeams)

      const result = await getTeams()

      expect(prisma.team.findMany).toHaveBeenCalledWith({
        where: { organizationId: mockOrgId },
        include: { _count: { select: { members: true } } },
        orderBy: { createdAt: "desc" },
      })
      expect(result).toEqual(mockTeams)
    })
  })

  describe("createTeam", () => {
    it("deve criar um novo time com sucesso", async () => {
      const teamData = { name: "Novo Time" }
      ;(prisma.team.create as Mock).mockResolvedValue({
        id: "new-id",
        ...teamData,
        organizationId: mockOrgId,
      })

      const result = await createTeam(teamData.name)

      expect(prisma.team.create).toHaveBeenCalledWith({
        data: {
          name: teamData.name,
          organizationId: mockOrgId,
        },
      })
      expect(result.success).toBe(true)
    })

    it("deve falhar se o nome for muito curto", async () => {
      await expect(createTeam("a")).rejects.toThrow()
    })
  })

  describe("addMemberToTeam", () => {
    it("deve vincular um membro a um time com sucesso", async () => {
      const mockTeamId = "team-1"
      const mockMemberId = "member-1"

      // Mock do time existindo na mesma org
      ;(prisma.team.findFirst as Mock).mockResolvedValue({
        id: mockTeamId,
        organizationId: mockOrgId,
      })
      // Mock do membro existindo na mesma org
      ;(prisma.member.findFirst as Mock).mockResolvedValue({
        id: mockMemberId,
        organizationId: mockOrgId,
      })

      const result = await addMemberToTeam(mockTeamId, mockMemberId)

      expect(prisma.member.update).toHaveBeenCalledWith({
        where: { id: mockMemberId },
        data: { teamId: mockTeamId },
      })
      expect(result.success).toBe(true)
    })

    it("deve falhar se o time não pertencer à organização ativa (IDOR check)", async () => {
      ;(prisma.team.findFirst as Mock).mockResolvedValue(null)

      await expect(addMemberToTeam("wrong-team", "member-1")).rejects.toThrow(
        "Time não encontrado"
      )
    })
  })

  describe("deleteTeam", () => {
    it("deve deletar um time com sucesso", async () => {
      const mockTeamId = "team-1"
      ;(prisma.team.findFirst as Mock).mockResolvedValue({
        id: mockTeamId,
        organizationId: mockOrgId,
        _count: { members: 0 },
      })

      const result = await deleteTeam(mockTeamId)

      expect(prisma.team.delete).toHaveBeenCalledWith({
        where: { id: mockTeamId },
      })
      expect(result.success).toBe(true)
    })

    it("deve falhar se o time possuir membros", async () => {
      const mockTeamId = "team-1"
      ;(prisma.team.findFirst as Mock).mockResolvedValue({
        id: mockTeamId,
        organizationId: mockOrgId,
        _count: { members: 5 },
      })

      await expect(deleteTeam(mockTeamId)).rejects.toThrow(
        "Não é possível excluir um time que possui membros"
      )
    })
  })
})
