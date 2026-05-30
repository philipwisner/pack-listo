import "server-only";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const prismaClientSingleton = () => {
  const isProduction = process.env.NODE_ENV === "production";

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing in environment variables.");
  }

  // Pass the connection string directly so pg parses the correct host automatically
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
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
