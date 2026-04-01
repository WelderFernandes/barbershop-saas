import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Scissor01Icon, 
  ArrowRight01Icon, 
  Calendar01Icon, 
  ZapIcon 
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative min-h-[90svh] flex items-center pt-32 pb-16 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-8 max-w-2xl animate-in slide-in-from-left duration-700 fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium w-fit">
              <HugeiconsIcon icon={ZapIcon} size={16} />
              <span>A plataforma #1 para barbeiros modernos</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
              Transforme sua <span className="text-primary italic">Barbearia</span> em um <span className="underline decoration-primary underline-offset-8 decoration-4">Negócio de Elite</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Agendamentos inteligentes, gestão de clientes, controle financeiro e 
              marketing automatizado. Tudo o que você precisa para crescer sem dor de cabeça.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="h-14 px-8 text-lg font-bold shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all gap-3">
                  Começar Teste Grátis
                  <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
                </Button>
              </Link>
              <Link href="#demo">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold gap-3 border-2">
                  Ver Demonstração
                  <HugeiconsIcon icon={Calendar01Icon} size={20} />
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden relative">
                    <Image 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} 
                      alt="User avatar" 
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-bold">+2.500 barbeiros</p>
                <p className="text-muted-foreground">confiam no BarberShop SaaS</p>
              </div>
            </div>
          </div>

          <div className="relative aspect-square lg:aspect-video w-full rounded-3xl overflow-hidden border border-border shadow-2xl shadow-primary/10 group animate-in slide-in-from-right duration-1000 fade-in">
             <Image 
              src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop"
              alt="Barbearia Moderna"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" />
            
            {/* Floating UI Elements */}
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl flex items-center justify-between shadow-2xl animate-bounce-subtle">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
                  <HugeiconsIcon icon={Scissor01Icon} size={24} />
                </div>
                <div>
                  <p className="font-bold">Agendamento Realizado!</p>
                  <p className="text-xs text-muted-foreground">João Silva • Corte + Barba • 14:30</p>
                </div>
              </div>
              <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                HOJE
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
