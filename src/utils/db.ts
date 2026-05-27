import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prisma: PrismaClient;

if (globalForPrisma.prisma) {
  prisma = globalForPrisma.prisma;
} else {
  // Check for Supabase pooler URL first (Vercel), fallback to DATABASE_URL (Docker)
  const connectionString =
    process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

  if (connectionString) {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  } else {
    // Fallback block just to satisfy TypeScript/Prisma validation safety,
    // but passing an empty configuration object to satisfy Prisma 7 if string is missing
    prisma = new PrismaClient({
      // @ts-expect-error
      datasource: {
        url: "",
      },
    });
  }

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }
}

export { prisma };
