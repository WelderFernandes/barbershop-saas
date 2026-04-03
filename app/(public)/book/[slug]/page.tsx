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
    <div className="space-y-8">
      <div className="flex flex-col items-center space-y-2 text-center">
        {barbershop.logoUrl && (
          <Image
            src={barbershop.logoUrl}
            alt={barbershop.name}
            width={80}
            height={80}
            className="shadow-soft-xl h-20 w-20 rounded-full border-4 border-white object-cover"
          />
        )}
        <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase dark:text-white">
          {barbershop.name}
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Agende seu serviço em poucos passos
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
