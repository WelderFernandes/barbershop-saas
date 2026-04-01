import { getBarbers } from "@/lib/actions/barber";
import { BarbersList } from "./barbers-list";

export default async function BarbersPage() {
  const barbers = await getBarbers();

  return <BarbersList barbers={barbers} />;
}
