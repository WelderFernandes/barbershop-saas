"use client";

import { authClient } from "@/lib/auth-client";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  ArrowDown01Icon, 
  Add01Icon, 
  Home01Icon 
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function OrganizationSwitcher() {
  const { data: session } = authClient.useSession();
  const { data: organizations, isPending } = authClient.useListOrganizations();
  const activeOrg = organizations?.find((org) => org.id === session?.session?.activeOrganizationId);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  async function handleSwitch(id: string) {
    await authClient.organization.setActive({ organizationId: id });
    router.refresh();
    setIsOpen(false);
  }

  if (isPending) {
    return (
      <div className="h-14 w-full animate-pulse bg-muted/20 border border-dashed border-border rounded-md" />
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        render={
          <Button 
            variant="outline" 
            className="w-full justify-between h-14 px-4 rounded-md border border-primary/20 bg-background hover:bg-accent transition-all font-mono text-[10px] uppercase tracking-widest group"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-primary bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <HugeiconsIcon icon={Home01Icon} className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start overflow-hidden">
                <span className="truncate font-bold tracking-tighter">
                  {activeOrg?.name ?? "Selecionar Unidade"}
                </span>
                <span className="text-[8px] opacity-50">Active Organization</span>
              </div>
            </div>
            <HugeiconsIcon icon={ArrowDown01Icon} className="w-3 h-3 opacity-50 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
          </Button>
        }
      />
      <DropdownMenuContent 
        align="start" 
        side="bottom"
        className="w-64 rounded-md border border-primary/20 bg-card p-1.5 font-mono text-[10px] uppercase tracking-widest shadow-xl animate-in fade-in zoom-in-95 duration-100"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-3 opacity-50 text-[8px] tracking-[0.2em]">Unidades Disponíveis</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-primary/20" />
          <div className="max-h-[200px] overflow-y-auto px-1">
            {organizations && organizations.length > 0 ? (
              organizations.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => handleSwitch(org.id)}
                  className={`rounded-md py-3 px-2 flex items-center justify-between cursor-pointer focus:bg-primary focus:text-primary-foreground ${
                  activeOrg?.id === org.id ? "bg-primary/5 border-l-4 border-primary" : ""
                }`}
                >
                  <span className="truncate font-bold">{org.name}</span>
                  {activeOrg?.id === org.id && (
                    <span className="flex items-center gap-1">
                      <span className="h-1 w-1 bg-emerald-500 rounded-md animate-pulse" />
                      <span className="text-[8px] font-black text-emerald-500">ONLINE</span>
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
          className="rounded-md py-3 px-2 cursor-pointer focus:bg-primary focus:text-primary-foreground"
          onClick={() => router.push("/dashboard/onboarding")}
        >
          <div className="flex h-5 w-5 items-center rounded-full justify-center border border-dashed border-current mr-2 ">
            <HugeiconsIcon icon={Add01Icon} className="w-3 h-3" />
          </div>
          Registrar Nova Unidade
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
