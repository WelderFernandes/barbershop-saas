"use client"

import { useTransition } from "react"
import { deleteInvitationAction } from "@/lib/actions/invite"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface InviteRowActionsProps {
  invitationId: string
}

export function InviteRowActions({ invitationId }: InviteRowActionsProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    if (!confirm("Deseja realmente revogar este convite?")) return

    startTransition(async () => {
      try {
        await deleteInvitationAction(invitationId)
        router.refresh()
      } catch (error) {
        console.error("Erro ao deletar convite:", error)
        alert("Falha ao revogar convite. Tente novamente.")
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={isPending}
      className="h-7 w-7 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
    >
      {isPending ? (
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      ) : (
        <HugeiconsIcon icon={Delete01Icon} className="h-3.5 w-3.5" />
      )}
    </Button>
  )
}
