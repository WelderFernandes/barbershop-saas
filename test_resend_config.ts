import "dotenv/config";
import { Resend } from "resend";

async function diagnostic() {
  console.log("🔍 Iniciando diagnóstico do Resend...");

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";

  if (!apiKey) {
    console.error("❌ ERRO: RESEND_API_KEY não encontrada no .env");
    return;
  }

  console.log(`✅ API Key encontrada: ${apiKey.slice(0, 10)}...`);
  console.log(`📧 E-mail remetente configurado: ${fromEmail}`);

  const resend = new Resend(apiKey);

  try {
    console.log("📡 Testando conexão com a API do Resend...");
    const domains = await resend.domains.list();
    
    if (domains.error) {
      console.error("❌ ERRO DA API Resend:", domains.error);
    } else {
      console.log("✅ Conexão estabelecida com sucesso!");
      console.log(`📦 Domínios configurados: ${domains.data?.data.length || 0}`);
      
      const isVerified = domains.data?.data.some((d: any) => fromEmail.includes(d.name));
      if (domains.data?.data.length === 0 && !fromEmail.includes("resend.dev")) {
        console.warn("⚠️ AVISO: Você está tentando usar um e-mail customizado mas o domínio não parece verificado no Resend.");
      } else if (!isVerified && !fromEmail.includes("resend.dev")) {
        console.warn(`⚠️ AVISO: O domínio do e-mail '${fromEmail}' não está verificado em sua conta Resend.`);
      }
    }
  } catch (error: any) {
    console.error("💥 Falha crítica ao conectar com Resend:", error.message);
  }
}

diagnostic();
