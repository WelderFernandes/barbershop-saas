import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Scissor01Icon, 
  InstagramIcon, 
  TwitterIcon, 
  Facebook01Icon, 
  Mail01Icon 
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const footerLinks = [
  {
    title: "Produto",
    links: [
      { name: "Agendamento", href: "#" },
      { name: "Gestão", href: "#" },
      { name: "Finanças", href: "#" },
      { name: "Recursos", href: "#" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { name: "Sobre nós", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Carreiras", href: "#" },
      { name: "Contato", href: "#" },
    ],
  },
  {
    title: "Suporte",
    links: [
      { name: "Central de Ajuda", href: "#" },
      { name: "Termos de Uso", href: "#" },
      { name: "Privacidade", href: "#" },
      { name: "Segurança", href: "#" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-2 rounded-xl text-primary-foreground">
                <HugeiconsIcon icon={Scissor01Icon} size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight">
                BarberShop<span className="text-primary">SaaS</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              O ecossistema definitivo para barbeiros de alta performance. 
              Automatizando o dia a dia para você focar no que realmente 
              importa: a satisfação do seu cliente.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="hover:text-primary transition-colors hover:bg-primary/5 rounded-full">
                <HugeiconsIcon icon={InstagramIcon} size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary transition-colors hover:bg-primary/5 rounded-full">
                <HugeiconsIcon icon={TwitterIcon} size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary transition-colors hover:bg-primary/5 rounded-full">
                <HugeiconsIcon icon={Facebook01Icon} size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary transition-colors hover:bg-primary/5 rounded-full">
                <HugeiconsIcon icon={Mail01Icon} size={20} />
              </Button>
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col gap-4">
              <h4 className="font-bold text-lg">{section.title}</h4>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2 flex flex-col gap-6 lg:ml-auto">
            <div className="flex flex-col gap-2">
              <h4 className="font-bold text-lg">Assine nossa Newsletter</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Dicas de gestão, novidades e promoções exclusivas <br className="hidden md:block" /> enviadas diretamente para você.
              </p>
            </div>
            <div className="flex gap-2 max-w-sm">
              <Input placeholder="Seu melhor e-mail" className="h-12 bg-muted/50 border-border/50 text-foreground ring-offset-primary/10 transition-all rounded-xl" />
              <Button className="h-12 px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all rounded-xl">
                ASSINAR
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} BarberShop SaaS. Todos os direitos reservados.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary transition-all underline-offset-4 hover:underline">Políticas de Cookies</Link>
            <Link href="#" className="hover:text-primary transition-all underline-offset-4 hover:underline">Mapa do Site</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
