"use client"

import { authClient } from "@/lib/auth-client"
import Link from "next/link"

export function Widget() {
  const { data: activeOrganization } = authClient.useActiveOrganization()
  return (
    <div className="flex flex-col gap-4 rounded-md md:flex-row md:items-end md:justify-between">
      <div className="space-y-1">
        <h2 className="font-heading text-4xl font-black tracking-tighter uppercase italic">
          Painel de <span className="text-primary">Controle</span>
        </h2>
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
          Inteligência Operacional // {new Date().toLocaleDateString("pt-BR")}
        </p>
      </div>
      <Link
        href={`/book/${activeOrganization?.slug}`}
        className="cursor-pointer"
      >
        <div className="flex items-center gap-2 rounded-md border-2 border-primary p-1">
          <div className="rounded-md bg-primary px-4 py-2 font-mono text-[10px] font-bold tracking-widest text-primary-foreground uppercase">
            Site
          </div>
          <div className="px-4 font-mono text-[10px] font-black tracking-widest uppercase">
            {activeOrganization ? (
              <p>/{activeOrganization.slug}</p>
            ) : (
              <p>Selecione uma barbearia</p>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
