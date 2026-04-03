import { getBarbershop } from "@/lib/actions/barbershop";
import { GeneralForm } from "./general-form";

export default async function SettingsGeneralPage() {
  const barbershop = await getBarbershop();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black uppercase tracking-tight">Informações Gerais</h2>
        <p className="text-muted-foreground font-medium">Atualize os dados básicos da sua barbearia para o público.</p>
      </div>

      <GeneralForm initialData={barbershop} />
    </div>
  );
}
