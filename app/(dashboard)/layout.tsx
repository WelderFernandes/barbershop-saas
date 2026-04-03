import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-md transition-all">
          <SidebarTrigger className="-ml-1 h-9 w-9 rounded-none hover:bg-accent" />
          <Separator
            orientation="vertical"
            className="h-6 w-[1.5px] bg-border"
          />
          <div className="flex flex-1 items-center justify-between">
            <h1 className="font-heading text-lg font-black tracking-widest text-primary uppercase">
              Barber <span className="text-foreground">Shop</span>
            </h1>
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-tighter text-muted-foreground uppercase">
              <span className="h-2 w-2 animate-pulse bg-emerald-500" />
              Sistema Online
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
