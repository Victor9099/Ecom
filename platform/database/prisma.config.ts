import { defineConfig } from 'prisma/config';

/**
 * Prisma 7 configuration.
 *
 * `schema` points at a FOLDER: Prisma 7.10.0 recursively searches it for
 * `*.prisma` files (folder mode is GA — verified against
 * @prisma/config@7.10.0, no preview flag). This enables the per-module schema
 * split required by AD-2 / AD-25:
 *   - prisma/schema/schema.prisma   (platform-owned anchor: generator + datasource)
 *   - prisma/schema/governance.prisma (Governance-owned audit models/enums)
 *
 * `prisma generate` does not require a database URL. `prisma migrate` / `db`
 * commands read `datasource.url` from `process.env.DATABASE_URL`; set it from
 * `.env.example` (e.g. `postgresql://postgres:postgres@localhost:5432/ecom`).
 * The runtime `PrismaClient` is constructed with `@prisma/adapter-pg`, so the
 * schema datasource carries no URL.
 */
export default defineConfig({
  schema: 'prisma/schema',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
