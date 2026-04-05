import { getPublicBarbershopData } from "@/lib/actions/public-booking"
import { notFound } from "next/navigation"
import { BookingClient } from "./booking-client"
import Image from "next/image"

const DEFAULT_COVER = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1500&auto=format&fit=crop";
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=400&h=400&auto=format&fit=crop";

export default async function PublicBookingPage({
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
    <div className="space-y-10 animate-in fade-in duration-1000 pb-20">
      {/* Hero Branding Section */}
      <div className="relative group overflow-hidden rounded-[48px] border border-white/20 shadow-2xl h-[300px] sm:h-[400px]">
        <Image
          src={coverImage}
          alt={barbershop.name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Logo & Basic Info Overlap */}
        <div className="absolute -bottom-1 left-0 right-0 p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
                <div className="relative h-28 w-28 sm:h-40 sm:w-40 rounded-[40px] overflow-hidden border-4 border-background bg-muted shadow-2xl ring-1 ring-white/20 shrink-0">
                    <Image
                        src={logoImage}
                        alt={barbershop.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="text-center sm:text-left space-y-2 mb-2">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                         <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white uppercase italic">
                            {barbershop.name}
                        </h1>
                    </div>
                   <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                        <span className="bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white">
                            Selo de Qualidade ✓
                        </span>
                        {barbershop.phone && (
                            <span className="text-white/60 text-xs font-bold font-mono tracking-widest">{barbershop.phone}</span>
                        )}
                   </div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Lado Esquerdo: Descrição e Agendamento */}
        <div className="lg:col-span-8 space-y-10">
            {/* Seção Sobre */}
            <div className="space-y-4">
                 <div className="flex items-center gap-2 text-accent font-bold tracking-widest text-[10px] uppercase">
                    <span className="h-1 w-8 bg-accent rounded-full" />
                    Sobre a Barbearia
                </div>
                <p className="text-xl sm:text-2xl font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                    {barbershop.description || "Bem-vindo ao espaço onde estilo e tradição se encontram. Profissionais qualificados prontos para transformar seu visual com o melhor atendimento da região."}
                </p>
            </div>

            {/* Componente de Agendamento */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                 <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-[10px] uppercase mb-8">
                    <span className="h-1 w-8 bg-primary rounded-full" />
                    Agende Seu Horário
                </div>
                <BookingClient
                    barbershop={barbershop}
                    services={barbershop.services}
                    barbers={barbershop.barbers}
                />
            </div>
        </div>

        {/* Lado Direito: Informações Fixas (Localização / Horários) */}
        <div className="lg:col-span-4 space-y-6">
            <div className="p-8 rounded-[40px] bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/20 dark:border-slate-800/20 shadow-2xl">
                <h3 className="font-black uppercase tracking-widest text-xs mb-6 text-muted-foreground italic flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Estamos Próximos de Você
                </h3>
                <div className="space-y-1">
                    <p className="text-xl font-bold leading-tight">{barbershop.address || "Endereço não informado"}</p>
                    <p className="text-xs text-muted-foreground font-mono">Consulte o mapa para direções</p>
                </div>
                
                <div className="mt-8 pt-8 border-t border-border/50 space-y-4">
                     <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Suporte Direto</p>
                     <p className="text-sm font-black italic">{barbershop.phone || "(00) 00000-0000"}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
