# Current-Technology Closure — 2026-08-26

## Verdict

Pass for architecture finalization. Scaffolding still applies AD-17 re-verification and lockfile pinning.

## Closed findings

| Prior finding | Closure |
| --- | --- |
| Next.js 16.2.11 was unsafe/stale | Stack now uses Next.js 16.3.3, the Active LTS security release addressing two Critical vulnerabilities. |
| Node, pnpm, NestJS, and Prisma pins were stale | Stack now records Node.js 24.19.0 LTS, pnpm 11.24.0, NestJS 11.2.3, and Prisma 7.10.0. |
| Prisma runtime requirements were missing | The spine binds ESM, `@prisma/adapter-pg`, pool limits, connection/transaction timeouts, and an acceptance spike. |
| TypeScript 6/7 choice was unexplained | TypeScript 6.0.3 is an explicit compatibility hold with a TypeScript 7.0.2 monorepo build/test exit condition. |
| Contract/security dialects were imprecise | AD-10 pins OpenAPI 3.2.0; AD-13 pins OWASP ASVS 5.0.0 evidence identifiers. |

## Primary sources

- [Next.js August 2026 Security Release](https://nextjs.org/blog)
- [Node.js release status](https://nodejs.org/en/about/previous-releases)
- [pnpm releases](https://github.com/pnpm/pnpm/releases)
- [TypeScript releases](https://github.com/microsoft/TypeScript/releases)
- [NestJS releases](https://github.com/nestjs/nest/releases)
- [Prisma releases](https://github.com/prisma/prisma/releases)
- [PostgreSQL 18.6 release notes](https://www.postgresql.org/docs/release/18.6/)
- [OpenAPI 3.2.0](https://spec.openapis.org/oas/v3.2.0.html)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
