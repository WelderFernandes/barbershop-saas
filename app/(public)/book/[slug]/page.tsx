import { getPublicBarbershopData } from "@/lib/actions/public-booking"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar01Icon, Location01Icon, SmartPhone01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

const DEFAULT_COVER = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1500&auto=format&fit=crop";
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=400&h=400&auto=format&fit=crop";

export default async function PublicBarbershopLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const barbershop = await getPublicBarbershopData(slug)

  if (!barbershop) {
    return notFound()
  }

  const coverImage = barbershop.coverUrl || DEFAULT_COVER;
  const logoImage = barbershop.logoUrl || DEFAULT_AVATAR;

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20 max-w-[1400px] mx-auto">
      {/* Hero Branding Section - Fluid & Impactful */}
      <div className="relative group overflow-hidden rounded-[32px] sm:rounded-[60px] border border-white/20 shadow-2xl min-h-[350px] sm:h-[450px] lg:h-[600px]">
        <Image
          src={coverImage}
          alt={barbershop.name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />
        
        {/* Floating Info Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-12 lg:p-20">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-10">
                <div className="relative h-28 w-28 sm:h-40 sm:w-40 lg:h-52 lg:w-52 rounded-[40px] sm:rounded-[50px] overflow-hidden border-4 border-background bg-muted shadow-2xl ring-2 ring-white/20 shrink-0 transform -rotate-3 transition-transform hover:rotate-0">
                    <Image
                        src={logoImage}
                        alt={barbershop.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="text-center sm:text-left space-y-2 sm:space-y-4 mb-2 max-w-2xl">
                    <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter text-white uppercase italic leading-[0.8] wrap-break-word drop-shadow-2xl">
                        {barbershop.name}
                    </h1>
                   <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4">
                        <span className="bg-white px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-black shadow-xl">
                            Qualidade Premium ✓
                        </span>
                        {barbershop.phone && (
                            <span className="text-white/80 text-xs sm:text-sm font-bold font-mono tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 uppercase">
                                {barbershop.phone}
                            </span>
                        )}
                   </div>
                </div>
            </div>
        </div>
      </div>

      {/* Main Content: Asymmetric Layout (70/30) */}
      <div className="grid lg:grid-cols-10 gap-12 lg:gap-20 items-start">
        
        {/* Left Column: Vision & About (70%) */}
        <div className="lg:col-span-6 space-y-16 order-2 lg:order-1">
            <div className="space-y-6">
                 <div className="flex items-center gap-3 text-primary font-black tracking-[0.3em] text-[10px] uppercase">
                    <span className="h-[2px] w-12 bg-primary" />
                    Nossa Visão
                </div>
                <p className="text-2xl sm:text-4xl lg:text-5xl font-black leading-[1.1] tracking-tight text-slate-800 dark:text-white uppercase italic">
                    {barbershop.description || "Transformamos estilo em tradição com o melhor atendimento da região."}
                </p>
                <div className="pt-8 border-t border-slate-200 dark:border-slate-800 grid sm:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <h4 className="font-black uppercase text-xs tracking-widest opacity-50">Localização</h4>
                        <p className="font-bold flex items-center gap-2">
                            <HugeiconsIcon icon={Location01Icon} className="w-4 h-4 text-primary" />
                            {barbershop.address || "Rua Barber, 123 - Centro"}
                        </p>
                     </div>
                     <div className="space-y-2">
                        <h4 className="font-black uppercase text-xs tracking-widest opacity-50">Atendimento</h4>
                        <p className="font-bold flex items-center gap-2">
                            <HugeiconsIcon icon={SmartPhone01Icon} className="w-4 h-4 text-primary" />
                            {barbershop.phone || "(00) 00000-0000"}
                        </p>
                     </div>
                </div>
            </div>

            {/* Visual Section / Social Proof */}
            <div className="relative rounded-[40px] overflow-hidden aspect-video group shadow-3xl">
                 <Image
                    src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1471&auto=format&fit=crop"
                    alt="Barbershop Atmosphere"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            </div>
        </div>

        {/* Right Column: Sticky CTA Card (30%) */}
        <div className="lg:col-span-4 lg:sticky lg:top-12 order-1 lg:order-2">
            <div className="p-8 sm:p-12 rounded-[40px] sm:rounded-[60px] bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.2)] space-y-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Agenda Aberta
                    </div>
                    <h2 className="text-4xl font-black uppercase italic leading-none tracking-tighter">
                        Pronto para o próximo <span className="text-primary underline decoration-4 underline-offset-8">nível</span>?
                    </h2>
                </div>

                <div className="space-y-6">
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Escolha seu serviço e barbeiro preferido agora mesmo.</p>
                    <Link 
                        href={`/book/${slug}/schedule`}
                        className={cn(
                            "w-full h-16 sm:h-20 rounded-2xl sm:rounded-[40px] text-lg sm:text-xl font-black uppercase tracking-widest shadow-[0_15px_30px_-10px_rgba(var(--primary-rgb),0.5)] active:scale-95 transition-all group overflow-hidden relative inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                    >
                        <span className="relative z-10 flex items-center gap-4">
                            <HugeiconsIcon icon={Calendar01Icon} className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            Agendar Agora
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </Link>
                </div>

                <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Membro da Comunidade</p>
                     <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map((i) => (
                             <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 overflow-hidden bg-slate-200">
                                <Image 
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User${i}`} 
                                    alt="User" 
                                    width={40} 
                                    height={40} 
                                />
                             </div>
                        ))}
                        <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 flex items-center justify-center text-[10px] font-black italic">
                            +50
                        </div>
                     </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  )
}
