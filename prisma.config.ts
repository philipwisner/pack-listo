import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // 1. Fall back to local Docker string if Supabase vars aren't present
    url: env("POSTGRES_PRISMA_URL") || env("DATABASE_URL"),

    // 2. Map the non-pooling URL for migrations (Prisma v7 looks for this here)
    // @ts-expect-error - Prisma 7 type definitions don't explicitly type directUrl here yet
    directUrl: env("POSTGRES_URL_NON_POOLING") || (env("DATABASE_URL") as any),
  },
});
