"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Settings02Icon,
  Clock01Icon,
  UserGroupIcon,
  CreditCardIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

const SETTINGS_TABS = [
  {
    id: "general",
    label: "Geral",
    href: "/dashboard/settings",
    icon: Settings02Icon,
  },
  {
    id: "hours",
    label: "Horários & Agenda",
    href: "/dashboard/settings/hours",
    icon: Clock01Icon,
  },
  {
    id: "team",
    label: "Equipe",
    href: "/dashboard/settings/team",
    icon: UserGroupIcon,
  },
  {
    id: "members",
    label: "Membros",
    href: "/dashboard/settings/members",
    icon: UserGroupIcon,
  },
  {
    id: "billing",
    label: "Plano & Cobrança",
    href: "/dashboard/settings/billing",
    icon: CreditCardIcon,
  },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex animate-in flex-col gap-10 duration-700 fade-in slide-in-from-bottom-4 lg:flex-row">
      {/* Menu Lateral Interno Glassmorphic */}
      <aside className="w-full shrink-0 lg:w-64">
        <div className="sticky top-24 space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter uppercase">
              Configurações
            </h1>
            <p className="text-[10px] leading-relaxed font-bold tracking-widest text-muted-foreground uppercase">
              Gestão da Barbearia
            </p>
          </div>

          <nav className="flex flex-col gap-1.5 rounded-[32px] border border-white/20 bg-white/40 p-1.5 shadow-2xl shadow-accent/5 backdrop-blur-xl dark:border-slate-800/20 dark:bg-slate-900/40">
            {SETTINGS_TABS.map((tab) => {
              const isActive = pathname === tab.href
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={cn(
                    "group relative flex items-center gap-3 overflow-hidden rounded-3xl px-5 py-3.5 text-[10px] font-black tracking-widest uppercase transition-all",
                    isActive
                      ? "bg-white text-accent-foreground shadow-xl ring-1 ring-border/20 dark:bg-slate-900"
                      : "text-muted-foreground hover:bg-white/50 hover:text-foreground dark:hover:bg-slate-800/50"
                  )}
                >
                  <HugeiconsIcon
                    icon={tab.icon}
                    className={cn(
                      "h-4 w-4 transition-transform group-hover:scale-110",
                      isActive && "text-foreground"
                    )}
                    strokeWidth={2.5}
                  />
                  {tab.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <div className="relative flex-1">
        <div className="absolute -top-24 -right-24 -z-10 h-96 w-96 animate-pulse rounded-full bg-accent/5 blur-[120px]" />
        {children}
      </div>
    </div>
  )
}
