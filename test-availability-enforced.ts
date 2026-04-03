import { createAppointment } from "./lib/actions/appointment";
import { prisma } from "./lib/prisma";

async function testEnforcement() {
  console.log("🚀 Iniciando teste de imposição de regras de agenda...");
  
  // 1. Setup: Garantir que temos um tenant e um barbeiro
  const tenant = await prisma.barbershop.findFirst();
  if (!tenant) return console.error("❌ Nenhum tenant encontrado");
  
  const barber = await prisma.barber.findFirst({ where: { barbershopId: tenant.id } });
  const service = await prisma.service.findFirst({ where: { barbershopId: tenant.id } });
  
  if (!barber || !service) return console.error("❌ Barbeiro ou Serviço não encontrado");

  // 2. Teste: Agendar em um dia fechado (Domingo - Day 0)
  const sundayApt = new Date();
  sundayApt.setDate(sundayApt.getDate() + (7 - sundayApt.getDay())); // Próximo domingo
  sundayApt.setHours(10, 0, 0, 0);

  console.log(`\n📅 Testando agendamento para Domingo (Fechado): ${sundayApt.toISOString()}`);
  
  try {
    // Forçar domingo como inativo no banco para o teste
    await prisma.businessHour.upsert({
      where: { id: `test-sunday-${tenant.id}` },
      create: { dayOfWeek: 0, isActive: false, barbershopId: tenant.id },
      update: { isActive: false }
    });

    await createAppointment({
      date: sundayApt.toISOString(),
      clientName: "Teste Domingo",
      barberId: barber.id,
      serviceId: service.id,
    });
    console.error("❌ ERRO: O sistema permitiu agendar no domingo fechado!");
  } catch (e: any) {
    console.log(`✅ Sucesso: Sistema bloqueou corretamente. Erro: "${e.message}"`);
  }

  // 3. Teste: Agendar em horário com Bloqueio Manual
  const blockedTime = new Date();
  blockedTime.setDate(blockedTime.getDate() + 1);
  blockedTime.setHours(14, 0, 0, 0);

  console.log(`\n🚫 Testando agendamento em horário Bloqueado: ${blockedTime.toISOString()}`);

  try {
    await prisma.blockedSlot.create({
      data: {
        startTime: blockedTime,
        endTime: new Date(blockedTime.getTime() + 60 * 60000),
        reason: "Almoço Teste",
        recurrence: "NONE",
        barbershopId: tenant.id,
        barberId: barber.id
      }
    });

    await createAppointment({
      date: blockedTime.toISOString(),
      clientName: "Teste Bloqueio",
      barberId: barber.id,
      serviceId: service.id,
    });
    console.error("❌ ERRO: O sistema permitiu agendar em horário bloqueado!");
  } catch (e: any) {
    console.log(`✅ Sucesso: Sistema bloqueou corretamente. Erro: "${e.message}"`);
  }

  console.log("\n✨ Testes concluídos.");
}

testEnforcement();
