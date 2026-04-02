import { getPublicBarbershopData } from "@/lib/actions/public-booking";
import { notFound } from "next/navigation";
import { BookingClient } from "./booking-client";
import Image from "next/image";

export default async function PublicBookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const barbershop = await getPublicBarbershopData(slug);

  if (!barbershop) {
    return notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center text-center space-y-2">
        {barbershop.logoUrl && (
          <Image
            src={barbershop.logoUrl}
            alt={barbershop.name}
            width={80}
            height={80}
            className="w-20 h-20 rounded-full border-4 border-white shadow-soft-xl object-cover"
          />
        )}
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
          {barbershop.name}
        </h1>
        <p className="text-slate-500 text-sm font-medium">Agende seu serviço em poucos passos</p>
      </div>

      <BookingClient 
        barbershop={barbershop} 
        services={barbershop.services} 
        barbers={barbershop.barbers} 
      />
    </div>
  );
}
