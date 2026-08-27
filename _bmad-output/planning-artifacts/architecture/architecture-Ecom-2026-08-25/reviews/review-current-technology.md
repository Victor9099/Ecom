# Current-Technology Review — Architecture Spine

**Artifact:** `ARCHITECTURE-SPINE.md`  
**Lens:** configured current-technology / live-starter / security reality  
**Verified:** 2026-08-25 (Asia/Bangkok)  
**Sources:** official vendor, standards-body, and project-maintainer sources only

## Verdict

**FAIL — do not scaffold from the current Stack table.** The Next.js seed and its deferred release instruction are invalidated by the official August 25 security release, and AD-17's claim that the table is a verified 2026-08-25 cold-start seed is not supportable: Node.js, pnpm, NestJS, Prisma, and TypeScript all have newer official stable releases or a materially changed current-starter reality. PostgreSQL 18.6 and the principal cited standards remain valid.

No named version in the table is nonexistent. The failure is currency, security, and missing compatibility/starter decisions—not fabricated versions.

## Blocking and high-priority findings

### 1. CRITICAL — Next.js 16.2.11 and the August 26/16.2.x instruction are unsafe and factually stale

**Locations:** Stack, line 212; Deferred, line 295; AD-17, line 139.

The spine says `16.2.11`, directs scaffolding to a patched `16.2.x`, and says to wait for an announced 2026-08-26 release. On August 25, Next.js moved the security release forward to August 25 and announced **16.3.3**, addressing **two critical-severity vulnerabilities**. Next.js 16.3 has also been the current stable minor since August 3. The support policy confirms that the **16.x major** is Active LTS; it does not make 16.2.11 the current secure patch.

Required disposition: replace both occurrences with an exact security-patched stable release verified at scaffold time, with **16.3.3 as today's minimum evidenced target**. Do not retain the `16.2.x` constraint or the August 26 wait instruction.

Sources: [official Next.js August 25 security update](https://nextjs.org/blog), [official Next.js support policy](https://nextjs.org/support-policy), [official Next.js 16 upgrade/runtime requirements](https://nextjs.org/docs/app/guides/upgrading/version-16).

Suggested replacement wording:

> Next.js Active LTS | 16.3.3 security baseline as of 2026-08-25; scaffold must re-verify and pin the latest patched stable 16.x release.

### 2. HIGH — AD-17's “verified 2026-08-25 cold-start seed” assertion is contradicted by official release state

**Locations:** AD-17, lines 136–139; Stack, lines 209–215.

The exact pins are not merely a little old; five are behind the official current stable or active line as of this review:

| Technology | Spine pin | Official reality on 2026-08-25 | Assessment |
| --- | --- | --- | --- |
| Node.js | 24.16.0 | 24.19.0 is latest v24 LTS | Existing pin is real and compatible, but three releases behind the selected LTS line. |
| pnpm | 11.4.0 | 11.24.0 is latest stable v11; v12 remains RC | Real but materially stale. Use current stable v11 unless consciously accepting a prerelease. |
| TypeScript | 6.0.3 | 7.0.2 is latest stable | Real but now a previous major. Retention needs an explicit framework/tooling compatibility reason. |
| NestJS | 11.1.24 | 11.2.3 is latest, released August 25 | Real and Node-compatible, but not a current seed. |
| Prisma ORM | 7.9.0 | 7.10.0 is the current stable v7 release; official quickstart is transitioning to Prisma 8 | Real and supported, but stale and no longer representative of the live starter without a deliberate hold. |
| PostgreSQL | 18.6 | 18.6 is current, released August 13 | Pass. |

Required disposition: either re-pin the table immediately from current official releases or change AD-17 so it does not claim the table was verified on this date. “Scaffold will re-verify later” is a useful safety net but does not make an already-stale dated assertion true.

Sources: [Node.js v24 archive](https://nodejs.org/en/download/archive/v24), [pnpm official releases](https://github.com/pnpm/pnpm/releases), [TypeScript official releases](https://github.com/microsoft/TypeScript/releases), [NestJS official releases](https://github.com/nestjs/nest/releases), [Prisma official releases](https://github.com/prisma/prisma/releases), [PostgreSQL 18.6 release notes](https://www.postgresql.org/docs/release/18.6/).

### 3. HIGH — Prisma 7's required runtime shape is absent from the structural seed, and the live starter is in transition

**Locations:** Stack, line 214; Structural Seed, lines 231 and 233; Deferred, line 296.

Prisma 7 is compatible with Node 24 and PostgreSQL 18, but it is not a drop-in version label. Official Prisma guidance requires ESM, a database driver adapter for direct relational connections (for PostgreSQL, `@prisma/adapter-pg`), and deliberate pool/timeout configuration because adapter defaults differ from Prisma 6. The structural seed names only “Prisma” and does not preserve these scaffold-critical requirements. This can produce divergent or non-working NestJS module setups even if the migration/transaction spike passes.

There is also a same-day source transition: the official release feed exposes 7.10.0 as stable and Prisma 8 release candidates, while the official PostgreSQL quickstart now calls Prisma 8 the current release and `create-prisma@latest` the current starter. Treat that discrepancy as a moving release gate: verify the package registry and stable release notes at scaffold time. Do not silently let `create-prisma@latest` choose a different major.

Required disposition:

- If retaining Prisma 7, seed **7.10.0/current supported v7**, ESM, `@prisma/adapter-pg`, and explicit connection/transaction timeout checks.
- If adopting Prisma 8, record a new accepted replacement only after its stable registry/release status and NestJS/TypeScript compatibility are proven.

Sources: [Prisma 7 upgrade requirements](https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7), [Prisma system requirements](https://docs.prisma.io/docs/orm/reference/system-requirements), [Prisma supported databases](https://docs.prisma.io/docs/orm/reference/supported-databases), [Prisma PostgreSQL connector and pool defaults](https://docs.prisma.io/docs/orm/core-concepts/supported-databases/postgresql), [official Prisma releases](https://github.com/prisma/prisma/releases), [official current PostgreSQL quickstart](https://docs.prisma.io/docs/prisma-orm/quickstart/postgresql).

### 4. HIGH — TypeScript 6.0.3 is valid but no longer the current compiler line, and the compatibility hold is undocumented

**Location:** Stack, line 211.

TypeScript 7.0.2 is the current stable release. TypeScript 6 was explicitly a transition release: options deprecated in 6 may be removed in 7. A greenfield scaffold can reasonably stay on 6 temporarily, but only as an explicit compatibility hold with a testable exit condition; calling it the current verified seed is unjustified. Node 24 satisfies Next.js 16, NestJS 11, and Prisma 7 runtime requirements, while the framework and ORM sources do not by themselves prove the whole monorepo toolchain on TypeScript 7.

Required disposition: either prove TypeScript 7.0.2 with Next/Nest/Prisma builds and tests, or record why 6.0.3 is retained and require a TS 7 adoption spike. In either case, use ESM-compatible compiler settings demanded by Prisma 7 and avoid deprecated TS 6 options.

Sources: [TypeScript official releases](https://github.com/microsoft/TypeScript/releases), [TypeScript 6 transition and deprecations](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html), [NestJS 11 Node requirement](https://docs.nestjs.com/migration-guide), [Next.js 16 runtime requirements](https://nextjs.org/docs/app/guides/upgrading/version-16), [Prisma system requirements](https://docs.prisma.io/docs/orm/reference/system-requirements).

## Medium-priority findings

### 5. MEDIUM — OpenAPI is contract-binding but unversioned

**Location:** AD-10, line 97.

The current published OpenAPI Specification is 3.2.0. Saying only “OpenAPI” lets independent API and code-generation units choose 3.0, 3.1, or 3.2, whose schemas and tooling behavior differ. That undercuts AD-10's stated purpose of preventing incompatible shapes.

Required disposition: pin the contract dialect, e.g. `OpenAPI 3.2.0`, or explicitly select an older tooling-compatible baseline with an exit condition.

Source: [official OpenAPI Specification 3.2.0](https://spec.openapis.org/oas/v3.2.0.html).

### 6. MEDIUM — inherited ASVS naming should be exact when evidence identifiers are recorded

**Locations:** AD-13 binding to PRD NFR-4/LG-6; PRD NFR-4 and LG-6 use “ASVS 5.0.”

OWASP identifies **5.0.0** as the latest stable ASVS and recommends version-qualified requirement IDs because identifiers can change. “ASVS 5.0 Level 2” is directionally correct, but release evidence should use `v5.0.0-<requirement-id>`.

Required disposition: architecture does not need to enumerate controls, but the LG-6 evidence convention should pin ASVS 5.0.0 and version-qualified IDs.

Source: [official OWASP ASVS project](https://owasp.org/www-project-application-security-verification-standard/).

## Candidate technologies correctly remain deferred

**Location:** Deferred, line 298.

Redis and BullMQ are not committed stack entries; they are evidence-triggered candidates, while PostgreSQL outbox/jobs remain MVP. That status is correctly preserved and should not be interpreted as a version pin.

If a gate later promotes either candidate, the scaffold check must start from current security reality:

- Redis Open Source **8.10.1** is the current release and is explicitly a security update fixing memory-corruption, RCE, and authentication-bypass classes. Do not adopt 8.10.0. Redis 8 also carries a tri-license choice that must be compatible with the selected managed/self-hosted model.
- BullMQ **6.2.1** is the current release as of August 25. Do not seed an older v5 API by habit; v6 is a breaking major and must be evaluated against the chosen durable-job model.

Sources: [Redis official releases](https://github.com/redis/redis/releases), [Redis official repository/license statement](https://github.com/redis/redis), [BullMQ official releases](https://github.com/taskforcesh/bullmq/releases).

## Passing compatibility and standards checks

- **PostgreSQL 18.6:** current and supported by Prisma. Its release notes include security-related configuration and cleanup guidance (`output_plugin_libraries`, possible extension reindexing); managed-service acceptance must confirm those operational actions. Sources: [PostgreSQL 18.6 release notes](https://www.postgresql.org/docs/release/18.6/), [Prisma supported databases](https://docs.prisma.io/docs/orm/reference/supported-databases).
- **Node.js 24 major:** still an LTS line and satisfies Next.js 16 (Node 20.9+), NestJS 11 (Node 20+), and Prisma (supported Node 24 line). The issue is the old exact 24.16.0 pin, not major-line compatibility. Sources: [Node release status](https://nodejs.org/en/about/previous-releases), [Next.js 16 requirements](https://nextjs.org/docs/app/guides/upgrading/version-16), [NestJS 11 migration guide](https://docs.nestjs.com/migration-guide), [Prisma system requirements](https://docs.prisma.io/docs/orm/reference/system-requirements).
- **RFC 9457:** current Standards Track problem-details RFC and correctly supersedes RFC 7807. Source: [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html).
- **UUIDv7:** standardized by RFC 9562. The convention is valid. Source: [RFC 9562](https://www.rfc-editor.org/rfc/rfc9562.html).
- **ISO 8601 / ISO 4217:** UTC timestamp usage is conventional; ISO 4217:2015 remains current and supports the stated currency/minor-unit representation. Sources: [ISO 8601-1:2019](https://www.iso.org/standard/70907.html), [ISO 4217:2015](https://www.iso.org/standard/64758.html).
- **OTLP:** the protocol is live and current; the official page is at OTLP 1.11.0. Because the spine binds only the transport convention and AD-17 hands exact packages to the lockfile, this is not blocking, though telemetry SDK/exporter versions must be pinned at scaffold. Source: [OTLP 1.11.0](https://opentelemetry.io/docs/specs/otlp/).
- **WCAG 2.2 AA:** current W3C Recommendation and correctly inherited through NFR-1/AD-21. Source: [WCAG 2.2](https://www.w3.org/TR/WCAG22/).
- **PCI DSS v4.0.1:** current active PCI DSS baseline; PCI SSC states v4.0.1 became the only active supported version after v4.0 retired. Source: [PCI SSC v4.0.1 notice](https://blog.pcisecuritystandards.org/just-published-pci-dss-v4-0-1).

## Gate closure criteria

This reviewer gate can pass when all of the following are true:

1. Next.js is moved off 16.2.11/16.2.x to a verified patched stable 16.x release no older than 16.3.3, and the obsolete August 26 instruction is removed.
2. AD-17 and the Stack table are made truthful as of their stated verification date, with accepted reasons recorded for any deliberately older major or minor.
3. Prisma's chosen major is explicit; the scaffold preserves ESM, the PostgreSQL driver adapter, and timeout/pool behavior, and does not allow `latest` to select a different major silently.
4. TypeScript 7 compatibility is either proven or explicitly deferred by a compatibility hold with an exit condition.
5. The OpenAPI dialect and ASVS evidence version are exact.
