"use client"

import { authClient } from "@/lib/auth-client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  ArrowDown01Icon,
  Add01Icon,
  Home01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"

export function OrganizationSwitcher({ logoUrl }: { logoUrl?: string | null }) {
  const { data: session } = authClient.useSession()
  const { data: organizations, isPending } = authClient.useListOrganizations()
  const activeOrg = organizations?.find(
    (org) => org.id === session?.session?.activeOrganizationId
  )
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  async function handleSwitch(id: string) {
    await authClient.organization.setActive({ organizationId: id })
    router.refresh()
    setIsOpen(false)
  }

  if (isPending) {
    return (
      <div className="h-14 w-full animate-pulse rounded-md border border-dashed border-border bg-muted/20" />
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            className="group h-14 w-full justify-between rounded-lg border border-primary/20 bg-background px-4 font-mono text-[10px] tracking-widest uppercase transition-all hover:bg-accent"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary/20 bg-primary/5 text-primary transition-all group-hover:border-primary/40 group-hover:bg-primary/10">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <HugeiconsIcon icon={Home01Icon} className="h-4 w-4" />
                )}
              </div>
              <div className="flex flex-col items-start overflow-hidden">
                <span className="truncate text-[11px] font-black uppercase tracking-tighter">
                  {activeOrg?.name ?? "Selecionar Unidade"}
                </span>
                <span className="text-[8px] font-bold uppercase tracking-widest opacity-40">
                  Unidade Ativa
                </span>
              </div>
            </div>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              className="h-3 w-3 shrink-0 opacity-50 transition-transform group-data-[state=open]:rotate-180"
            />
          </Button>
        }
      />
      <DropdownMenuContent
        align="start"
        side="bottom"
        className="w-64 animate-in rounded-md border border-primary/20 bg-card p-1.5 font-mono text-[10px] tracking-widest uppercase shadow-xl duration-100 zoom-in-95 fade-in"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-3 text-[8px] tracking-[0.2em] opacity-50">
            Unidades Disponíveis
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-primary/20" />
          <div className="max-h-[200px] overflow-y-auto px-1">
            {organizations && organizations.length > 0 ? (
              organizations.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => handleSwitch(org.id)}
                  className={`flex cursor-pointer items-center justify-between rounded-md px-2 py-3 focus:bg-primary focus:text-primary-foreground ${
                    activeOrg?.id === org.id
                      ? "border-l-4 border-primary bg-primary/5"
                      : ""
                  }`}
                >
                  <span className="truncate font-bold">{org.name}</span>
                  {activeOrg?.id === org.id && (
                    <span className="flex items-center gap-1">
                      <span className="h-1 w-1 animate-pulse rounded-md bg-emerald-500" />
                      <span className="text-[8px] font-black text-emerald-500">
                        ONLINE
                      </span>
                    </span>
                  )}
                </DropdownMenuItem>
              ))
            ) : (
              <div className="px-2 py-4 text-center text-muted-foreground italic">
                Nenhuma unidade encontrada
              </div>
            )}
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-primary/20" />
        <DropdownMenuItem
          className="cursor-pointer rounded-md px-2 py-3 focus:bg-primary focus:text-primary-foreground"
          onClick={() => router.push("/dashboard/onboarding")}
        >
          <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full border border-dashed border-current">
            <HugeiconsIcon icon={Add01Icon} className="h-3 w-3" />
          </div>
          Registrar Nova Unidade
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
