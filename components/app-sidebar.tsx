"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrganizationSwitcher } from "./organization-switcher";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: "📊" },
  { title: "Agenda", href: "/dashboard/appointments", icon: "📅" },
  { title: "Barbeiros", href: "/dashboard/barbers", icon: "💈" },
  { title: "Serviços", href: "/dashboard/services", icon: "✂️" },
  { title: "Configurações", href: "/dashboard/settings", icon: "⚙️" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "U";

  function handleSignOut() {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  }

  return (
    <Sidebar className="border-r-0 ring-1 ring-border">
      <SidebarHeader className="border-b border-border/50 bg-sidebar px-4 pb-4 pt-6">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="flex h-10 w-10 items-center justify-center border-2 border-primary bg-transparent text-xl font-bold">
            B
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-sm font-black uppercase tracking-tighter text-primary">BarberPro</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 line-through decoration-primary/50 decoration-2">Management</span>
          </div>
        </div>
        <OrganizationSwitcher />
      </SidebarHeader>

      <SidebarContent className="bg-sidebar px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">
            <SidebarMenu className="gap-1">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} className="flex items-center gap-3" />}
                    isActive={pathname === item.href}
                    className="h-12 rounded-none px-4 font-mono text-[11px] uppercase tracking-widest transition-all hover:bg-primary hover:text-primary-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                  >
                    <span className="text-base grayscale group-hover:grayscale-0">{item.icon}</span>
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 bg-sidebar p-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-3 border border-border/50 bg-transparent px-3 py-3 text-sm transition-all hover:border-primary">
            <div className="flex h-8 w-8 items-center justify-center border border-primary bg-primary/10 font-mono text-xs font-bold text-primary">
              {initials}
            </div>
            <div className="flex flex-1 flex-col items-start overflow-hidden text-[10px] uppercase tracking-widest">
              <span className="truncate font-bold italic">{session?.user?.name ?? "Usuário"}</span>
              <span className="text-[8px] opacity-50">Authorized Personnel</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56 rounded-none border-2 border-primary bg-card p-1 font-mono text-[10px] uppercase tracking-widest">
            <DropdownMenuItem
              onClick={handleSignOut}
              className="rounded-none py-2 focus:bg-destructive focus:text-destructive-foreground"
            >
              Terminate Session [ESC]
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
