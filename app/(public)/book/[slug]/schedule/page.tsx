import { getPublicBarbershopData } from "@/lib/actions/public-booking"
import { notFound } from "next/navigation"
import { BookingClient } from "../booking-client"
import { buttonVariants } from "@/components/ui/button-variants"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export default async function BookingSchedulePage({
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
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <Link 
            href={`/book/${slug}`}
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}
        >
             <HugeiconsIcon icon={ArrowLeft01Icon} className="w-6 h-6" />
        </Link>
        <div>
            <h1 className="text-2xl font-black uppercase tracking-tight italic">Agendamento</h1>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{barbershop.name}</p>
        </div>
      </div>

      <BookingClient
        barbershop={barbershop}
        services={barbershop.services}
        barbers={barbershop.barbers}
      />
    </div>
  )
}
