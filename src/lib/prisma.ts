import "server-only";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const prismaClientSingleton = () => {
  const connectionString =
    process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

  // Determine if we need to adjust SSL settings based on production flags
  const isProduction = process.env.NODE_ENV === "production";

  const pool = new Pool({
    connectionString,
    // CRITICAL: Inject the SSL config object directly into the pg pool.
    // This stops Node from throwing the self-signed certificate chain error.
    ssl: isProduction ? { rejectUnauthorized: false } : undefined,
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: !isProduction ? ["query", "error", "warn"] : ["error"],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// 1. Maintain the client instance across hot-reloads
export const prisma = globalThis.prisma ?? prismaClientSingleton();

// 2. EXPORT AS NAMED AND DEFAULT simultaneously
// This fixes the TypeScript 'prisma is possibly undefined' compilation error
export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
