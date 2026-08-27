# Ecom

Vietnam-first, single-store, owner-operated health-supplement commerce platform. Trust
through governed commerce: every product claim is verified, every SKU passes evidence
gates, and editorial and commercial content are separated by default.

This repository is the **TypeScript modular monolith** described by the Architecture Spine
(`_bmad-output/planning-artifacts/architecture/architecture-Ecom-2026-08-25/ARCHITECTURE-SPINE.md`).
Story 1.1 scaffolds the verified workspace and the dependency catalog. It creates **no business
tables and no speculative domain entities**.

## Pinned platform baseline

| Area | Pin | Verified via |
| --- | --- | --- |
| Node.js | `24.19.0` (`.nvmrc`) | `npm view` + engines field below |
| pnpm | `11.24.0` (`packageManager` field) | corepack-compatible manifest |
| TypeScript | `6.0.3` | `npm view typescript version` → `7.0.2` is `latest`; 6.0.3 is the compatibility hold |
| Next.js | `16.3.3` | `npm view next dist-tags.latest` → `16.3.3` (never below 16.3.3) |
| React / React DOM | `19.2.8` | `npm view react version` → `19.2.8` |
| NestJS | `11.2.3` (core packages) | `npm view @nestjs/core version` → `12.0.1` is `latest`; 11.2.3 is the Nest 11 baseline |
| Prisma ORM | `7.10.0` (+ `@prisma/client`, `@prisma/adapter-pg`) | `npm view prisma version` → `8.0.0-rc.12` is `latest`; 7.10.0 is the accepted baseline |
| PostgreSQL | `18.6` (`docker-compose.yml`, dev only) | registry + architecture baseline |

Exact, non-floating pins are enforced in `package.json` files and `pnpm-lock.yaml`.
`engines.node` documents `>=24.19.0 <25`; the pin lives in `.nvmrc`.

## Workspace layout

```text
apps/
  storefront/   # public Next.js surface, single shared shell (AD-27)
  admin/        # operator Next.js surface
  api/          # NestJS HTTP composition root (Express adapter)
  worker/       # NestJS outbox / durable-job composition root
modules/
  <context>/    # 17 bounded contexts; src/{contracts,application,domain,adapters}
platform/
  database/     # Prisma schema (datasource+generator only) + baseline migration
  messaging/    # outbox, inbox, event envelope (empty scaffold)
  observability/# logging, metrics, tracing, redaction (empty scaffold)
  security/     # authentication primitives and policy plumbing (empty scaffold)
packages/
  ui/           # accessible visual primitives; no domain behavior (empty scaffold)
  config/       # shared tsconfig baselines
tests/
  architecture/ # boundary and ownership checks (executable AD-15 surface)
  contracts/    # API, event, and provider compatibility
  system/       # end-to-end commerce and replay scenarios
```

The 17 bounded contexts are: `identity`, `merchant`, `content`, `catalog`, `inventory`,
`pricing`, `discovery`, `cart`, `checkout`, `orders`, `payments`, `finance`, `fulfillment`,
`returns`, `engagement`, `governance`, `reporting`. Each is an empty, private workspace package
whose `contracts`/`application`/`domain`/`adapters` surfaces are reserved but empty.

## Commands (CI-equivalent)

| Command | What it proves |
| --- | --- |
| `pnpm install` | lockfile-resolution install |
| `pnpm build` | `turbo run build` — Next builds, Nest builds, Prisma client generation |
| `pnpm typecheck` | `turbo run typecheck` — `tsc --noEmit` across the graph |
| `pnpm lint` | `eslint .` — one repo-wide ESLint flat-config pass |
| `pnpm test` | `vitest run` — unit + architecture/contract/system surface tests |
| `pnpm format:check` | `prettier --check .` |
| `pnpm smoke` | `node scripts/smoke.mjs` — boots API (`GET /health`) and Worker, checks Next/Nest artifacts |
| `pnpm verify` | build → typecheck → lint → test → format:check → smoke (FULL_TEST) |

The canonical task runner is **Turborepo** (`turbo.json`); it owns the build and typecheck
graph. Lint, format, and test run as single repo-wide passes so a violation can never fork
per package.

## Dependency catalog

Classification legend:

- **runtime** — needed at runtime in a deployed process.
- **development/test** — build/type-check/lint/test/format tooling only.
- **provider-specific** — an SDK/adapter for an external provider; installs only after the
  provider is selected (LG-3 / AD-9 / AD-29).
- **evidence-triggered** — installs only when a measured requirement or owning story fires.

Owner / purpose / version-policy / replacement-boundary are recorded below. Packages marked
**deferred** are intentionally **absent from the lockfile**; adding one requires the recorded
gate, and Prisma 8 cannot replace Prisma 7 without an updated Architecture Decision.

### Installed at Story 1.1

| Package | Class | Owner | Purpose | Version policy | Replacement boundary |
| --- | --- | --- | --- | --- | --- |
| `typescript` | development/test | Platform & Governance | single language + type system | exact `6.0.3`; `7.x` blocked until the monorepo build/test spike passes (AD-17) | TypeScript 7 replaces only after the recorded compatibility spike |
| `turbo` | development/test | Platform & Governance | canonical task runner | exact `2.10.12` | replaced only by an accepted task-runner decision |
| `@types/node` | development/test | Platform & Governance | Node 24 typings | exact `24.13.3` (matches Node 24 line) | track Node 24 LTS |
| `eslint`, `@eslint/js`, `typescript-eslint`, `globals` | development/test | Platform & Governance | lint baseline | exact (`9.39.5` / `8.68.0` / `16.4.0`) | replace only with an accepted lint-tooling decision |
| `prettier` | development/test | Platform & Governance | deterministic formatting | exact `3.9.6` | replace only with an accepted formatting decision |
| `vitest` | development/test | Platform & Governance | unit/architecture/contract/system test runner | exact `4.1.11` | replace only with an accepted test-runner decision |
| `next` | runtime | Growth & Trust (`apps/storefront`, `apps/admin`) | web framework | exact `16.3.3`; latest patched stable 16.x at scaffold; never below 16.3.3 | a future 16.x patch may advance; major change needs an AD |
| `react`, `react-dom` (+ `@types/react`, `@types/react-dom`) | runtime | Growth & Trust | UI runtime | exact `19.2.8` | React major bump needs an AD |
| `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express` | runtime | Platform & Governance (`apps/api`) | HTTP framework (Express adapter) | exact `11.2.3` | Nest 12 blocked while Prisma/TS/Nest compatibility is unverified |
| `@nestjs/config` | runtime | Platform & Governance | validated env at startup | exact `4.0.4` (Nest 11-compatible line) | align with NestJS line |
| `@nestjs/swagger` | runtime | Platform & Governance | OpenAPI transport source (AD-10) | exact `11.2.3` | generated clients (`openapi-typescript`/`openapi-fetch`) consume its output |
| `class-validator`, `class-transformer` | runtime | Platform & Governance | Nest DTO boundary validation | exact `0.14.4` / `0.5.1` | Zod owns forms/config; never validate both boundaries |
| `reflect-metadata`, `rxjs` | runtime | Platform & Governance | Nest DI + reactive core | exact `0.2.2` / `7.8.2` | track NestJS peer requirements |
| `prisma`, `@prisma/client`, `@prisma/adapter-pg` | runtime | Platform & Governance (`platform/database`) | ORM + PostgreSQL driver adapter (ESM) | exact `7.10.0` (never `latest` = 8.0.0-rc.12) | Prisma 8 replaces only after an accepted AD documents ESM/migration/PG 18.6/pool/transaction compatibility |
| `@nestjs/cli`, `@nestjs/testing` | development/test | Platform & Governance | Nest build/test tooling | exact `11.0.24` / `11.2.3` | track NestJS line |
| `@types/express` | development/test | Platform & Governance | Express 5 typings | exact `5.0.6` | track Express major used by platform-express |

### Approved — deferred (absent until the owning story fires)

| Package(s) | Class | Owner | Purpose | Adoption gate |
| --- | --- | --- | --- | --- |
| `tsx` | development/test | Platform & Governance | TS script execution | first script-execution story |
| `tailwindcss`, `@tailwindcss/postcss`, `tw-animate-css`, `@tailwindcss/typography` | runtime | Growth & Trust | styling | design-token story (1.13) |
| `class-variance-authority`, `clsx`, `tailwind-merge` | runtime | Growth & Trust | UI helpers | design-token story (1.13) |
| `lucide-react` | runtime | Growth & Trust | one SVG icon family | design-token story (1.13) |
| `react-hook-form`, `@hookform/resolvers`, `zod` | runtime | Growth & Trust | forms + client schemas | first Storefront form |
| `gsap` | runtime | Growth & Trust | bounded progressive motion | approved motion contract + surface story |
| `@tanstack/react-query`, `@tanstack/react-table` | runtime | Operations/Admin | Admin data workflows | first data-heavy Admin story |
| `@nestjs/terminus` | runtime | Platform & Governance | health endpoints | observability foundation story |
| `@nestjs/throttler` | runtime | Platform & Governance | rate limiting | Story 1.3 secure operator access |
| `pg`, `@types/pg` | runtime | Platform & Governance | direct Postgres access (if adapter needs it) | when native outbox implementation needs a bare driver |
| `openapi-typescript`, `openapi-fetch`, `@redocly/cli` | development/test + runtime | Platform & Governance | generated API clients (AD-10) | first API-consuming surface |
| `argon2`, `jose`, `helmet`, `cookie-parser` | runtime | Platform & Governance | security primitives | Story 1.3 / auth story |
| `pino`, `nestjs-pino`, `pino-pretty` | runtime | Platform & Governance | structured logging | observability foundation story |
| `@opentelemetry/api`, `@opentelemetry/sdk-node`, `@opentelemetry/auto-instrumentations-node`, `@opentelemetry/exporter-trace-otlp-http` | runtime | Platform & Governance | OTLP tracing | observability foundation story |
| `decimal.js` | runtime | Commerce | money/decimal math | Pricing/Finance story |
| `libphonenumber-js` | runtime | Identity | phone normalization | identity story |
| `date-fns`, `@date-fns/tz` | runtime | Commerce | date/time | first time-sensitive domain |
| `sharp`, `file-type` | runtime | Growth & Trust | media | binary-object story (AD-26) |
| `sanitize-html` | runtime | Growth & Trust | safe rendered content | CMS authoring story |
| `schema-dts`, `@sindresorhus/slugify` | runtime | Growth & Trust | structured data + slugs | SEO/content story |
| `@tanstack/…` (remainder), shadcn/Base UI | runtime | Growth & Trust | component primitives | design-token story (1.13) |
| `@vitest/coverage-v8`, `jsdom` | development/test | Platform & Governance | coverage + DOM env | when coverage/DOM tests are required |
| `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom` | development/test | Growth & Trust | component tests | design-token story |
| `supertest`, `@types/supertest` | development/test | Platform & Governance | HTTP API tests | first API contract |
| `@playwright/test`, `@axe-core/playwright` | development/test | Growth & Trust | e2e + a11y | first surface story (FRONTEND_POLICY) |
| `@testcontainers/postgresql` | development/test | Platform & Governance | integration DB | Story 1.2 (integration COMMAND) — Docker required |
| `fast-check`, `msw`, `@faker-js/faker` | development/test | Platform & Governance | property/fixtures/network mock | first property-heavy invariant |
| `eslint-config-next`, `eslint-plugin-jsx-a11y` | development/test | Growth & Trust | Next + a11y lint rules | first substantive frontend surface |
| `prettier-plugin-tailwindcss` | development/test | Growth & Trust | Tailwind class ordering | when Tailwind lands |
| `dependency-cruiser`, `knip`, `syncpack`, `@lhci/cli` | development/test | Platform & Governance | boundary enforcement + hygiene | Story 1.2 boundary checks |
| `@storybook/nextjs-vite`, `@storybook/addon-a11y` | development/test | Growth & Trust | design-system documentation | design-system story |
| `@react-email/components`, `@react-email/render`, `nodemailer` | runtime / provider-specific | Engagement | transactional email | LG-3 provider selection |
| `pg-boss` | runtime | Platform & Governance | PG-backed jobs | only if native outbox proves insufficient |

## Deferred capabilities (must be absent)

The following are **not installed and not modeled** in Story 1.1. Each requires the recorded
gate before it may enter the workspace:

| Capability | Candidate packages | Gate |
| --- | --- | --- |
| Redis / caches / queues | `redis`, `bullmq` | measured cache or async throughput requirement |
| Search engine | `meilisearch`, `@elastic/elasticsearch` | search benchmark + provider decision (AD-7) |
| Object storage | AWS SDK v3 clients | storage provider chosen (AD-26, AD-29) |
| Charts | charting libraries | Admin reporting UX specification |
| Rich-text editor | editor packages | CMS authoring spike + sanitization model |
| Payment / shipping / SMS / email SDKs | provider SDKs | LG-3 provider + adapter contract |
| Data warehouse / read replicas | warehouse + replica tooling | measured DB-read pressure + AD |
| Microservice framework | N/A | extraction only per AD-14 |

## Prisma baseline

`platform/database/prisma/schema.prisma` contains **only** the `datasource` and `generator`
blocks (zero `model` blocks). The baseline migration
(`prisma/migrations/20260827000000_baseline/migration.sql`) is intentionally empty. Prisma 8
was evaluated separately and remains **blocked** behind an updated Architecture Decision;
`prisma@7.10.0` and `@prisma/adapter-pg@7.10.0` are the accepted baseline (ESM, adapter-pg).