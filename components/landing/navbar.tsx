"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Scissor01Icon, Menu01Icon, ZapIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler"

const navItems = [
  { title: "Benefícios", href: "#benefits" },
  { title: "Recursos", href: "#features" },
  { title: "Preços", href: "#pricing" },
  { title: "FAQ", href: "#faq" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b transition-all duration-300",
        isScrolled
          ? "border-border bg-background/80 py-3 backdrop-blur-md"
          : "border-transparent bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2">
            <div className="rounded-xl bg-primary p-2 text-primary-foreground transition-transform group-hover:scale-110">
              <HugeiconsIcon icon={Scissor01Icon} size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">
              BarberShop<span className="text-primary">SaaS</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink
                    render={
                      <Link
                        href={item.href}
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "bg-transparent transition-colors hover:bg-accent/50"
                        )}
                      />
                    }
                  >
                    {item.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-4">
            <AnimatedThemeToggler />
            <Link href="/login" className="hidden md:block">
              <Button variant="ghost" className="font-medium">
                Entrar
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="gap-2 font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40">
                Começar agora
                <HugeiconsIcon icon={ZapIcon} size={18} />
              </Button>
            </Link>

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="md:hidden" />
                }
              >
                <HugeiconsIcon icon={Menu01Icon} size={24} />
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col gap-8 pt-12">
                <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                <div className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
                <div className="mt-auto flex flex-col gap-4 pb-8">
                  <Link href="/login">
                    <Button variant="outline" className="w-full">
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full">Começar agora</Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
