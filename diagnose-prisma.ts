import { prisma } from "./lib/prisma";

async function diagnose() {
  try {
    console.log("Checking DB connection...");
    const count = await prisma.barbershop.count();
    console.log("Success! Barbershops count:", count);
  } catch (e: any) {
    console.error("DB Error:", e);
  }
}

diagnose();
