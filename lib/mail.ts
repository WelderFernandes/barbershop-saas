import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInviteEmail({
  email,
  orgName,
  inviteLink,
  teamName,
}: {
  email: string;
  orgName: string;
  inviteLink: string;
  teamName?: string;
}) {
  const from = process.env.EMAIL_FROM || "onboarding@resend.dev";
  
  const { data, error } = await resend.emails.send({
    from,
    to: [email],
    subject: `Convite para participar da ${orgName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Você foi convidado!</h1>
        <p>Você recebeu um convite para participar da organização <strong>${orgName}</strong> no Barbershop SaaS.</p>
        ${teamName ? `<p>Você será vinculado ao time: <strong>${teamName}</strong></p>` : ""}
        <div style="margin-top: 30px;">
          <a href="${inviteLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Aceitar Convite
          </a>
        </div>
        <p style="margin-top: 40px; color: #666; font-size: 14px;">
          Se o botão não funcionar, copie e cole o link abaixo no seu navegador: <br/>
          <span style="color: #007bff;">${inviteLink}</span>
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Erro ao enviar e-mail: ${error.message}`);
  }

  return data;
}
