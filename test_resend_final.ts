import "dotenv/config";
import { Resend } from "resend";

async function diagnostic() {
  console.log("🔍 Reiniciando diagnóstico do Resend...");

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
      
      const isTestEmail = fromEmail.includes("resend.dev");
      if (isTestEmail) {
        console.log("🚀 CONFIGURAÇÃO DE TESTE VALIDADA!");
        console.log("💡 Nota: Agora você pode enviar convites, mas eles só chegarão no seu próprio e-mail de conta Resend.");
      } else {
        const isVerified = domains.data?.data.some((d: any) => fromEmail.includes(d.name));
        if (isVerified) {
          console.log("🚀 CONFIGURAÇÃO DE PRODUÇÃO VALIDADA!");
        } else {
          console.warn("⚠️ AVISO: Domínio ainda não verificado.");
        }
      }
    }
  } catch (error: any) {
    console.error("💥 Falha crítica:", error.message);
  }
}

diagnostic();
