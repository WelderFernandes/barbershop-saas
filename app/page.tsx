import Image from "next/image"
import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Pricing } from "@/components/landing/pricing"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/30 selection:text-primary-foreground">
      <Navbar />
      <main className="grow">
        <Hero />
        <Features />
        
        {/* Benefits Section - Proactively adding a centered testimonial/vision section */}
        <section id="benefits" className="py-24 bg-background relative border-y border-border/50">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
          <div className="container mx-auto px-4 md:px-6 text-center">
             <div className="max-w-3xl mx-auto flex flex-col gap-8">
               <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
                 &quot;O BarberShop SaaS mudou completamente o jogo. <br className="hidden md:block" /> 
                 Recuperei 10h da minha semana!&quot;
               </h2>
               <div className="flex flex-col items-center gap-4">
                 <div className="w-20 h-20 rounded-full border-4 border-primary/20 overflow-hidden shadow-2xl relative">
                    <Image 
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                      alt="Barbeiro de Elite" 
                      fill
                      className="object-cover"
                    />
                 </div>
                 <div>
                   <p className="font-black text-xl">Lucas &apos;The King&apos; Silva</p>
                   <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Proprietário da King&apos;s Cut • São Paulo</p>
                 </div>
               </div>
             </div>
          </div>
        </section>

        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
