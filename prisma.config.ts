import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Detect if we are explicitly pushing to production via your package.json script
const isProdPush =
  process.env.DATABASE_URL === process.env.PRODUCTION_DATABASE_URL;

// Select the non-pooling URL for production migrations, fallback to standard behavior for dev/Docker
const databaseUrl = isProdPush
  ? process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL
  : process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Prisma 7 uses this single URL for both client generation AND migrations
    url: databaseUrl,
  },
});
