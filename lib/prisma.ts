import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as pg from "pg";

const prismaClientSingleton = () => {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var prisma_v2: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Singleton Versionado (v2) para contornar cache do Turbopack
// Mudando a chave global forçamos o Next.js a criar uma nova instância limpa.
const prisma = globalThis.prisma_v2 ?? prismaClientSingleton();

export default prisma;
export { prisma };

if (process.env.NODE_ENV !== "production") globalThis.prisma_v2 = prisma;