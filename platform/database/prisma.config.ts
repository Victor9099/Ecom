import { defineConfig } from 'prisma/config';

/**
 * Prisma 7 configuration.
 *
 * `prisma generate` does not require a database URL. `prisma migrate` / `db`
 * commands read `datasource.url` from `process.env.DATABASE_URL`; set it from
 * `.env.example` (e.g. `postgresql://postgres:postgres@localhost:5432/ecom`).
 * At runtime the PrismaClient is constructed with `@prisma/adapter-pg`, so the
 * schema datasource carries no URL.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
