import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon, RocketIcon, ZapIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden bg-primary px-4 md:px-0">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container mx-auto max-w-5xl bg-primary-foreground text-primary p-8 md:p-16 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col items-center text-center gap-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/20 to-transparent" />
        
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary rotate-3 hover:rotate-0 transition-transform duration-500 shadow-xl shadow-primary/5 border border-primary/10">
          <HugeiconsIcon icon={RocketIcon} size={40} />
        </div>

        <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
          Pronto para ser a maior referência na sua região?
        </h2>

        <p className="text-xl md:text-2xl text-primary/80 font-medium max-w-2xl leading-relaxed">
          Mais de 2.500 barbeiros de elite já automatizaram seus negócios. 
          Você está a um clique de distância do próximo nível.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full h-16 px-10 text-xl font-black bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl shadow-primary/30 gap-3 group rounded-2xl">
              Criar minha conta grátis
              <HugeiconsIcon icon={ArrowRight01Icon} size={24} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-primary font-bold">
            <HugeiconsIcon icon={ZapIcon} size={24} />
            <span>Sem cartão necessário</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 w-full border-t border-primary/5 mt-8">
           {[
             { label: "Check-in Online", icon: "✓" },
             { label: "Fidelidade", icon: "✓" },
             { label: "Agenda 24h", icon: "✓" },
             { label: "Seguro & Cloud", icon: "✓" }
           ].map((item, i) => (
             <div key={i} className="flex items-center justify-center gap-2 text-primary font-black uppercase tracking-tighter text-xs">
                <span className="text-primary font-black">{item.icon}</span>
                {item.label}
             </div>
           ))}
        </div>
      </div>
    </section>
  )
}
