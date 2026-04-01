import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  CalendarAdd01Icon, 
  UserGroupIcon, 
  PackageIcon, 
  ChartBarLineIcon, 
  Notification01Icon, 
  Wallet01Icon 
} from "@hugeicons/core-free-icons"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const features = [
  {
    title: "Agendamento Online 24/7",
    description: "Seu cliente agenda o horário perfeito sem precisar ligar. Reduza faltas com lembretes automáticos.",
    icon: CalendarAdd01Icon,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Gestão de Clientes",
    description: "Histórico completo de serviços, preferências e datas importantes. Fidelize quem importa.",
    icon: UserGroupIcon,
    color: "bg-green-500/10 text-green-500",
  },
  {
    title: "Controle de Estoque",
    description: "Nunca fique sem seus produtos favoritos. Alertas automáticos de reposição e validade.",
    icon: PackageIcon,
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    title: "Relatórios Financeiros",
    description: "Visão clara do seu lucro, gastos e comissões. Tome decisões baseadas em dados reais.",
    icon: ChartBarLineIcon,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    title: "Notificações Inteligentes",
    description: "Envie promoções, avisos e lembretes via WhatsApp e Push de forma automatizada.",
    icon: Notification01Icon,
    color: "bg-red-500/10 text-red-500",
  },
  {
    title: "Pagamentos Integrados",
    description: "Aceite cartões, PIX e assinaturas direto pela plataforma. Fluxo de caixa em tempo real.",
    icon: Wallet01Icon,
    color: "bg-cyan-500/10 text-cyan-500",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/30 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            Recursos Premium
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
            Tudo o que você precisa para <br className="hidden md:block" /> escalar seu negócio
          </h2>
          <h2 className="sr-only">Recursos da Plataforma</h2>
          <p className="text-muted-foreground text-lg max-w-[600px]">
            Desenvolvido por barbeiros para barbeiros. Uma solução completa, 
            intuitiva e poderosa para o seu dia a dia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 bg-background/50 backdrop-blur-sm border-border/50 overflow-hidden">
              <CardHeader>
                <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <HugeiconsIcon icon={feature.icon} size={24} />
                </div>
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 relative">
                {/* Subtle Decorative Gradient */}
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
