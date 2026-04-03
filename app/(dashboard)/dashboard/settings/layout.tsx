"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  Settings02Icon, 
  Clock01Icon, 
  UserGroupIcon, 
  CreditCardIcon 
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const SETTINGS_TABS = [
  { id: "general", label: "Geral", href: "/dashboard/settings", icon: Settings02Icon },
  { id: "hours", label: "Horários & Agenda", href: "/dashboard/settings/hours", icon: Clock01Icon },
  { id: "team", label: "Equipe", href: "/dashboard/settings/team", icon: UserGroupIcon },
  { id: "billing", label: "Plano & Cobrança", href: "/dashboard/settings/billing", icon: CreditCardIcon },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col lg:flex-row gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Menu Lateral Interno Glassmorphic */}
      <aside className="w-full lg:w-64 shrink-0">
        <div className="sticky top-24 space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black uppercase tracking-tighter">Configurações</h1>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed">
              Gestão da Barbearia
            </p>
          </div>

          <nav className="flex flex-col gap-1.5 p-1.5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[32px] border border-white/20 dark:border-slate-800/20 shadow-2xl shadow-accent/5">
            {SETTINGS_TABS.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={cn(
                    "relative flex items-center gap-3 px-5 py-3.5 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all group overflow-hidden",
                    isActive 
                      ? "text-accent-foreground bg-white dark:bg-slate-900 shadow-xl ring-1 ring-border/20" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-slate-800/50"
                  )}
                >
                  <HugeiconsIcon 
                     icon={tab.icon} 
                     className={cn("w-4 h-4 transition-transform group-hover:scale-110", isActive && "text-accent")} 
                     strokeWidth={2.5}
                  />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 relative">
        <div className="absolute -top-24 -right-24 h-96 w-96 bg-accent/5 blur-[120px] rounded-full -z-10 animate-pulse" />
        {children}
      </div>
    </div>
  );
}
