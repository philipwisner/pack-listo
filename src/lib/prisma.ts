import "server-only";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const prismaClientSingleton = () => {
  const isProduction = process.env.NODE_ENV === "production";

  // Build the pool configuration explicitly by passing an object
  // instead of relying on the raw pg library to parse a URL string.
  const pool = new Pool({
    host: "aws-0-us-east-1.pooler.supabase.com",
    port: 6543,
    // Supavisor transaction routing requires the exact "user.project_ref" structure
    user: "postgres.fxuwqygjelkoqlbllvzy",
    password: "vUAnlmO0fCm2aSu2",
    database: "postgres",
    max: isProduction ? 10 : 1,
    idleTimeoutMillis: 30000,
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

export const prisma = globalThis.prisma ?? prismaClientSingleton();
export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
