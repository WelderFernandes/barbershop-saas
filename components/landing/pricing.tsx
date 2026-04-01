"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Tick01Icon, ZapIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const pricingTiers = [
  {
    name: "Starter",
    price: { monthly: 49, yearly: 39 },
    description: "Ideal para barbeiros individuais iniciando sua jornada.",
    features: [
      "Até 100 agendamentos/mês",
      "Gestão de 1 Barbeira",
      "Histórico de Clientes básico",
      "Lembretes via Push e E-mail",
      "Suporte via Chat",
    ],
    cta: "Começar Agora",
    popular: false,
  },
  {
    name: "Professional",
    price: { monthly: 99, yearly: 79 },
    description: "Perfeito para barbearias em crescimento com equipe.",
    features: [
      "Agendamentos Ilimitados",
      "Até 5 Barbeiros",
      "Controle de Estoque completo",
      "Relatórios Financeiros avançados",
      "Lembretes via WhatsApp",
      "Fidelidade de Clientes",
      "Suporte Prioritário",
    ],
    cta: "Escolher Professional",
    popular: true,
  },
  {
    name: "Enterprise",
    price: { monthly: 199, yearly: 159 },
    description: "A solução completa para redes de barbearias e grandes centros.",
    features: [
      "Barbeiros Ilimitados",
      "Multifiliais (até 3)",
      "Marketing Automatizado",
      "App Customizado (Branded)",
      "API de Integração",
      "Treinamento VIP da Equipe",
      "Gerente de Conta Dedicado",
    ],
    cta: "Falar com Consultor",
    popular: false,
  },
]

export function Pricing() {
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">("monthly")

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <Badge variant="outline" className="px-4 py-1 text-primary border-primary/20 bg-primary/5 uppercase tracking-widest font-bold">
             Nossos Planos
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
            O preço certo para o seu momento
          </h2>
          <p className="text-muted-foreground text-lg max-w-[600px]">
            Seja você um profissional solo ou dono de uma grande franquia, 
            temos o plano ideal para impulsionar seu sucesso.
          </p>

          <div className="flex items-center gap-4 mt-8 bg-muted p-1 rounded-full border border-border/50">
            <Button
              variant={billingCycle === "monthly" ? "default" : "ghost"}
              className={cn("rounded-full h-8 px-6 text-sm font-bold", billingCycle === "monthly" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground")}
              onClick={() => setBillingCycle("monthly")}
            >
              Mensal
            </Button>
            <Button
              variant={billingCycle === "yearly" ? "default" : "ghost"}
              className={cn("rounded-full h-8 px-6 text-sm font-bold flex gap-2 items-center", billingCycle === "yearly" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground")}
              onClick={() => setBillingCycle("yearly")}
            >
              Anual
              <span className="text-[10px] bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded-full uppercase tracking-tighter font-black">
                -20%
              </span>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {pricingTiers.map((tier, index) => (
            <div 
              key={index} 
              className={cn(
                "relative flex flex-col p-8 rounded-3xl border transition-all duration-500 hover:scale-[1.02]",
                tier.popular 
                  ? "bg-card border-primary ring-2 ring-primary/20 shadow-2xl shadow-primary/20" 
                  : "bg-background border-border hover:border-primary/30"
              )}
            >
              {tier.popular && (
                <div className="absolute top-0 right-8 -translate-y-1/2">
                   <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-1">
                     <HugeiconsIcon icon={ZapIcon} size={14} />
                     Mais Popular
                   </div>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {tier.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tight">R${billingCycle === "monthly" ? tier.price.monthly : tier.price.yearly}</span>
                  <span className="text-muted-foreground font-medium">/mês</span>
                </div>
                {billingCycle === "yearly" && (
                   <p className="text-xs text-green-500 font-bold mt-1">Faturado anualmente (Economia de R${(tier.price.monthly - tier.price.yearly) * 12}/ano)</p>
                )}
              </div>

              <div className="space-y-4 mb-10 grow">
                {tier.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm group/feature">
                    <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors", tier.popular ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground group-hover/feature:bg-primary/20 group-hover/feature:text-primary")}>
                       <HugeiconsIcon icon={Tick01Icon} size={14} />
                    </div>
                    <span className="text-foreground/90 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                variant={tier.popular ? "default" : "outline"} 
                className={cn(
                  "w-full h-14 text-lg font-bold rounded-2xl transition-all shadow-lg",
                  tier.popular ? "shadow-primary/40 hover:shadow-primary/60" : "hover:bg-primary/5 hover:border-primary/50"
                )}
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
