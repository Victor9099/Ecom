# Dependency Catalog — Ecom

**Status:** Owner-approved package direction; exact versions and peer compatibility must be verified and pinned in Story 1.1.  
**Decision date:** 2026-08-26  
**Delivery model:** TypeScript modular monolith, pnpm workspace, code-first frontend.

This catalog records what the project is allowed to adopt and when. Approval here does not mean every package is installed on day one. A dependency enters the lockfile only when its owning story needs it.

## Confirmed platform baseline

| Area | Selection | Target |
|---|---|---|
| Runtime | Node.js | 24.19.0 |
| Package manager | pnpm | 11.24.0 |
| Language | TypeScript | 6.0.3; hold TypeScript 7 until a compatibility spike passes |
| Web | Next.js | 16.x, at least 16.3.3 |
| API and worker | NestJS | 11.2.3, Express adapter |
| ORM | Prisma | 7.10.0, ESM with PostgreSQL driver adapter |
| Database | PostgreSQL | 18.6 |

Versions above are compatibility targets, not permission to bypass registry, security, license, peer-dependency, or release-note checks at scaffold time.

## Approved dependency set

### Workspace and toolchain

- `typescript`, `tsx`, `turbo`, `@types/node`
- `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-config-next`, `eslint-plugin-jsx-a11y`
- `prettier`, `prettier-plugin-tailwindcss`
- `dependency-cruiser`, `knip`, `syncpack`, `@lhci/cli`

### Storefront, Admin, and shared UI

- Runtime: `next`, `react`, `react-dom`
- Styling: `tailwindcss`, `@tailwindcss/postcss`, `tw-animate-css`, `@tailwindcss/typography`
- Components: `shadcn`, Base UI components generated through shadcn, `class-variance-authority`, `clsx`, `tailwind-merge`
- Icons: `lucide-react`
- Forms and client schemas: `react-hook-form`, `@hookform/resolvers`, `zod`
- Motion: `gsap`

`@tanstack/react-query` and `@tanstack/react-table` are approved for Admin workflows when the first data-heavy Admin story starts. Storefront server data should use Next.js server primitives by default; React Query is not a blanket Storefront dependency.

### API and worker

- `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`
- `@nestjs/config`, `@nestjs/swagger`, `@nestjs/terminus`, `@nestjs/throttler`
- `reflect-metadata`, `rxjs`
- DTO validation: `class-validator`, `class-transformer`

Zod owns frontend forms, environment/config parsing, and small shared value schemas. Nest DTO boundaries use `class-validator` and `class-transformer`. Do not validate the same boundary twice without a documented reason.

### Database and transactional consistency

- `prisma`, `@prisma/client`, `@prisma/adapter-pg`
- `pg`, `@types/pg`
- Native PostgreSQL transactional outbox first

`pg-boss` is approved only when a story demonstrates that the native outbox polling/claiming implementation needs a PostgreSQL-backed job abstraction.

### API contract generation

- `openapi-typescript`, `openapi-fetch`, `@redocly/cli`

NestJS OpenAPI is the transport contract source. Generated clients are consumed by Storefront and Admin; handwritten duplicate request/response interfaces are not allowed.

### Security and identity

- `argon2`, `jose`, `helmet`, `cookie-parser`
- Story-triggered: `otpauth`, `csrf-csrf`, `libphonenumber-js`

Payment card data must remain with the hosted payment provider. No package choice may expand the platform into raw card handling.

### Commerce, content, media, and SEO

- Money and decimal math: `decimal.js`
- Phone normalization: `libphonenumber-js`
- Date/time: `date-fns`, `@date-fns/tz`
- Media: `sharp`, `file-type`
- Safe rendered content: `sanitize-html`
- Structured data and slugs: `schema-dts`, `@sindresorhus/slugify`

### Observability

- Logging: `pino`, `nestjs-pino`, `pino-pretty`
- Tracing: `@opentelemetry/api`, `@opentelemetry/sdk-node`, `@opentelemetry/auto-instrumentations-node`, `@opentelemetry/exporter-trace-otlp-http`

Install these with the observability foundation story rather than coupling them to the initial hello-world scaffold.

### Testing

- Unit/component: `vitest`, `@vitest/coverage-v8`, `jsdom`
- UI: `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`
- API: `supertest`, `@types/supertest`
- End-to-end/accessibility: `@playwright/test`, `@axe-core/playwright`
- Integration/property/fixtures: `@testcontainers/postgresql`, `fast-check`, `msw`, `@faker-js/faker`

### Design-system documentation

- `@storybook/nextjs-vite`, `@storybook/addon-a11y`

Install Storybook with the design-system story, not before shared primitives exist.

### Transactional email

- `@react-email/components`, `@react-email/render`
- `nodemailer` only if the selected email provider requires SMTP

## GSAP implementation contract

GSAP is approved for purposeful, bounded motion—not as a global visual dependency.

- Prefer subtle motion: 300–400 ms, small 8–16 px offsets, transform/opacity properties.
- Honor `prefers-reduced-motion`; the reduced-motion path must remain complete and usable.
- Never initialize critical SEO copy, product evidence, compliance disclosures, navigation, price, availability, or primary actions as hidden.
- Keep GSAP inside explicit client boundaries; do not convert an otherwise server-rendered page into a client component solely for animation.
- Register plugins such as `ScrollTrigger` once and load them only on surfaces that use them.
- Scope animations to a component and revert/kill timelines and triggers during unmount.
- Avoid long stagger chains, text splitting, scroll hijacking, and routine pinned sections. Paid GSAP plugins require a separate license decision.
- Test motion on mid-tier mobile hardware and include a no-JavaScript rendering check for public Storefront pages.

The Master design system remains authoritative for motion intensity. A page override may further reduce motion but cannot silently increase it.

## Deferred until evidence or provider selection

| Capability | Candidate packages | Adoption gate |
|---|---|---|
| Redis/cache/queues | `redis`, `bullmq` | Measured cache or async throughput requirement |
| Search engine | `meilisearch` or `@elastic/elasticsearch` | Search benchmark and provider decision |
| Object storage | selected AWS SDK v3 clients | Storage provider chosen |
| Internationalization | `next-intl` | Scope expands beyond Vietnam-first Vietnamese MVP |
| Charts | choose against actual Admin reporting needs | Reporting surface UX specification |
| Rich-text editor | choose against governed CMS schema | CMS authoring spike and sanitization model |
| Payment/shipping/SMS/email SDKs | provider-specific SDKs | Provider selected and adapter contract approved |
| Advanced job orchestration | `pg-boss` | Native outbox proves insufficient |

No Elasticsearch/OpenSearch, Redis/BullMQ, chart library, rich editor, provider SDK, or microservice framework belongs in the initial scaffold without its adoption gate.

## Installation and ownership rules

1. Install a package in the narrowest workspace that owns it; avoid root runtime dependencies.
2. Record the owning module, purpose, license, and replacement boundary in the implementing story or ADR.
3. Pin exact versions in the lockfile after compatibility and security checks; do not use floating ranges for production builds.
4. One library owns each concern unless an explicit migration or boundary requires coexistence.
5. Use dynamic import for heavy browser-only behavior that is absent from the initial viewport.
6. Run dependency boundary checks, typecheck, unit tests, production build, and relevant Playwright/a11y checks before accepting a new runtime dependency.

## Confirmed decisions

- Express adapter for NestJS.
- shadcn with Base UI primitives and Lucide icons.
- `class-validator`/`class-transformer` for Nest DTOs; Zod for forms, config, and shared value schemas.
- OpenAPI-generated clients through `openapi-typescript` and `openapi-fetch`.
- Native transactional outbox before a queue framework.
- Storefront favors server data primitives; TanStack Query/Table starts with Admin needs.
- Storybook begins with the shared design-system story.
- Frontend is Impeccable `code-first` and must also follow UI/UX Pro Max Master/page specifications.
- GSAP is included with the bounded motion contract above.
