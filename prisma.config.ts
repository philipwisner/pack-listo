import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // 1. Fall back to local Docker string if Supabase vars aren't present
    url: process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL,

    // 2. Map the non-pooling URL for migrations (Prisma v7 looks for this here)
    // @ts-expect-error - Prisma 7 type definitions don't explicitly type directUrl here yet
    directUrl: process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL,
  },
});
