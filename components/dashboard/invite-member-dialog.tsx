"use client"

import { useState } from "react"

import {
  UserAdd01Icon,
  Mail01Icon,
  Tag01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createInvite } from "@/lib/actions/invite"
import { useRouter } from "next/navigation"

interface Team {
  id: string
  name: string
}

interface InviteMemberDialogProps {
  teams: Team[]
}

const inviteSchema = z.object({
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  role: z.enum(["admin", "member", "owner"]),
  teamId: z.string().optional(),
})

type InviteFormValues = z.infer<typeof inviteSchema>

export function InviteMemberDialog({ teams }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      role: "member",
      teamId: "none",
    },
  })

  const onSubmit = async (values: InviteFormValues) => {
    setLoading(true)
    try {
      await createInvite(
        values.email,
        values.role,
        values.teamId === "none" ? undefined : values.teamId
      )
      setOpen(false)
      form.reset()
      router.refresh()
      // TODO: Mostrar toast de sucesso
    } catch (error) {
      console.error(error)
      // TODO: Mostrar toast de erro
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val)
        if (!val) form.reset()
      }}
    >
      <DialogTrigger
        render={
          <Button className="gap-2 rounded-full px-6 font-bold tracking-widest uppercase shadow-xl transition-all hover:scale-105">
            <HugeiconsIcon icon={UserAdd01Icon} className="h-4 w-4" />
            Convidar Membro
          </Button>
        }
      />
      <DialogContent className="border-white/10 bg-slate-950/90 backdrop-blur-2xl sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tighter text-white uppercase">
            Convidar <span className="text-primary">Novo Membro</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* E-mail */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              <HugeiconsIcon icon={Mail01Icon} className="h-3 w-3" />
              E-mail do Convidado
            </Label>
            <Input
              placeholder="exemplo@email.com"
              {...form.register("email")}
              className="border-white/10 bg-white/5 font-medium text-white transition-all focus:border-primary focus:ring-primary/20"
            />
            {form.formState.errors.email && (
              <p className="text-[10px] font-bold tracking-widest text-destructive uppercase">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Papel (Role) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                <HugeiconsIcon icon={Tag01Icon} className="h-3 w-3" />
                Papel
              </Label>
              <Controller
                name="role"
                control={form.control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="border-white/10 bg-white/5 text-[10px] font-bold tracking-wider text-white uppercase">
                      <SelectValue placeholder="Selecione o papel" />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-slate-950/95 backdrop-blur-xl">
                      <SelectItem value="member">Membro</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="owner">Proprietário</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.role && (
                <p className="text-[10px] font-bold tracking-widest text-destructive uppercase">
                  {form.formState.errors.role.message}
                </p>
              )}
            </div>

            {/* Time (Team) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                <HugeiconsIcon icon={UserGroupIcon} className="h-3 w-3" />
                Time (Opcional)
              </Label>
              <Controller
                name="teamId"
                control={form.control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(v) => field.onChange(v || "none")}
                  >
                    <SelectTrigger className="border-white/10 bg-white/5 text-[10px] font-bold tracking-wider text-white uppercase">
                      <SelectValue placeholder="Selecione um time" />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-slate-950/95 backdrop-blur-xl">
                      <SelectItem value="none">Nenhum</SelectItem>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.teamId && (
                <p className="text-[10px] font-bold tracking-widest text-destructive uppercase">
                  {form.formState.errors.teamId.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={loading}
            className="w-full font-bold tracking-widest uppercase shadow-lg shadow-primary/20"
          >
            {loading ? "Enviando..." : "Enviar Convite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
