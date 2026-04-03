import { getPublicBarbershopData } from "@/lib/actions/public-booking"
import { notFound } from "next/navigation"
import { BookingClient } from "./booking-client"
import Image from "next/image"

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

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      {/* Header Branding Glassmorphic */}
      <div className="relative group overflow-hidden rounded-[40px] border border-white/20 shadow-2xl">
        <div className="relative h-48 sm:h-64 w-full bg-muted/20">
          {barbershop.coverUrl ? (
             <Image
                src={barbershop.coverUrl}
                alt={barbershop.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
             />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-accent/20 via-background to-accent/5 opacity-50" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Logo Overlap */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 sm:left-12 sm:translate-x-0">
          <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-[32px] overflow-hidden border-4 border-background bg-muted shadow-2xl ring-1 ring-white/20">
            {barbershop.logoUrl ? (
              <Image
                src={barbershop.logoUrl}
                alt={barbershop.name}
                fill
                className="object-cover"
              />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-accent/10">
                   <span className="text-2xl font-black text-accent">{barbershop.name[0]}</span>
                </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-6 right-8 hidden sm:block">
            <span className="bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white">
                Verificado ✓
            </span>
        </div>
      </div>

      <div className="pt-8 flex flex-col items-center sm:items-start space-y-2 text-center sm:text-left sm:pl-12">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-900 uppercase dark:text-white">
          {barbershop.name}
        </h1>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest opacity-60">
          Agende seu estilo em poucos passos
        </p>
      </div>

      <BookingClient
        barbershop={barbershop}
        services={barbershop.services}
        barbers={barbershop.barbers}
      />
    </div>
  )
}
