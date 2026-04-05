import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins";
import { prisma } from "./prisma";
import { sendInviteEmail } from "./mail";


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      sendInvitationEmail: async (data) => {
        // Buscar o convite no banco para ver se tem um time vinculado
        const invitation = await prisma.invitation.findUnique({
          where: { id: data.id },
          include: { team: true },
        });

        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/accept-invite/${data.id}`;

        await sendInviteEmail({
          email: data.email,
          orgName: data.organization.name,
          inviteLink,
          teamName: invitation?.team?.name,
        });
      },
    }),
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dias
    updateAge: 60 * 60 * 24, // Atualiza a cada 24h
  },
});
