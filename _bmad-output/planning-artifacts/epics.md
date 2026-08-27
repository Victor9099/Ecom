---
stepsCompleted:
  - 1
  - 2
inputDocuments:
  - ../specs/spec-ecom/SPEC.md
  - ../specs/spec-ecom/requirements-map.md
  - prds/prd-Ecom-2026-08-25/prd.md
  - architecture/architecture-Ecom-2026-08-25/ARCHITECTURE-SPINE.md
  - architecture/architecture-Ecom-2026-08-25/DELIVERY-TOPOLOGY.md
  - ../../design-system/ecom/MASTER.md
---

# Ecom - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Ecom, decomposing the preservation-validated SPEC, PRD, architecture, delivery topology, and provisional design-system requirements into implementable stories. A finalized bmad-ux DESIGN/EXPERIENCE pair does not yet exist; the seven surface contracts are retained below and must be refined before implementation of each affected surface.

## Requirements Inventory

### Functional Requirements

- FR-1: Manage Home, Category, Product, Editorial, policy, and SEO landing pages with canonical metadata and index controls.
- FR-2: Govern Editorial Pages through Draft, Review, Approved, Published, Expired, and Withdrawn transitions.
- FR-3: Record source, author, reviewer, and review/effective/next-review dates without rewriting prior versions.
- FR-4: Render non-suppressible visual and structural Advertising Markers on commercial sections.
- FR-5: Permit only active Approved Claims and required Disclaimers; AI cannot approve or publish regulated content.
- FR-6: Create immutable Content Versions and support scheduled expiry or immediate audited withdrawal.
- FR-7: Link Editorial Pages to Products without merging editorial and advertising roles and flag unsafe links.
- FR-8: Manage Products, Variants, unique SKUs, Categories, Brands, media, attributes, price, and publication state.
- FR-9: Record SKU Regulatory Class, classification source, registration documents, validity, and review status.
- FR-10: Compute fail-closed sellability from evidence, Approved Claims, regulatory review, and Stock Position.
- FR-11: Present variant-correct identity, attributes, price, availability, disclosures, Disclaimer, and approved information.
- FR-12: Record on-hand stock and auditable adjustments and reserve/release Checkout quantity.
- FR-13: Derive Storefront Availability from sellability and Stock Position with a defined projection-refresh path.
- FR-14: Create and revoke deduplicated Back-in-stock Subscriptions that notify only after safety and stock recover.
- FR-15: Browse indexable Categories and collections through stable canonical paginated results and explicit empty states.
- FR-16: Search active sellable Products with basic autocomplete and typo tolerance while minimizing sensitive queries.
- FR-17: Filter by applicable Category, Brand, price, rating, attributes, and Availability with consistent counts and shareable state.
- FR-18: Schedule simple coupons, fixed/percentage discounts, and featured collections with transparent conditions and Checkout revalidation.
- FR-19: Show labeled, inspectable, manually governed or deterministic related Products without health-profile inference.
- FR-20: Support guest purchase and basic verified-email account access without forced marketing consent or identity leakage.
- FR-21: Persist guest/authenticated Carts and merge duplicate Variants deterministically without bypassing safety or quantity limits.
- FR-22: Revalidate sellability, Variant, price, promotion, Availability, delivery, and policy before commitment.
- FR-23: Accept accessible domestic addresses and supported delivery methods and reject unsupported destinations before Payment.
- FR-24: Apply eligible coupons with visible breakdown/rejection reasons, bounded benefits, usage limits, and replay safety.
- FR-25: Select approved hosted or redirected Payment while keeping primary account data outside Ecom.
- FR-26: Create an immutable Order snapshot or safely recover all reserved resources from commitment failure.
- FR-27: Derive Checkout result from authoritative Order and Payment evidence with distinct pending, failed, canceled, and successful states.
- FR-28: Verify provider signature, Order identity, and amount and process every notification idempotently.
- FR-29: Reconcile provider query/settlement evidence and route inconsistencies to an audited exception queue.
- FR-30: Keep explicit Order, Payment, and Fulfillment lifecycles distinct with guarded, audited transitions and recovery.
- FR-31: Create pick, pack, and dispatch work only for eligible items without retry, cancellation, or hold bypass.
- FR-32: Record carrier, tracking code, dispatch, normalized milestones, update time, and retained evidence.
- FR-33: Permit policy- and fulfillment-aware cancellation that releases stock and initiates any Refund exactly once.
- FR-34: Process item-level Return Requests using the accepted Order policy and evidence-backed disposition.
- FR-35: Execute approved full or partial provider Refunds without exceeding eligible captured value or duplicating execution.
- FR-36: Hold affected Products and unfulfilled Order Items during regulatory events without mutating historical Orders.
- FR-37: Accept ratings, text, and allowed media and audit moderation and verified-purchase evidence.
- FR-38: Let Customers report Reviews under rate, spam, and duplicate controls without silently rewriting text.
- FR-39: Expose restricted Order-linked support context and separate audited support actions from internal notes.
- FR-40: Send deduplicated templated Order, Payment, Shipment, Refund, and Back-in-stock Notifications and record attempts.
- FR-41: Govern admin, content, customer service, fulfillment, and finance through explicit least-privilege roles.
- FR-42: Record append-only Audit History for regulated, permission, Payment, Refund, hold, and override actions.
- FR-43: Manage legal basis, consent, retention, deletion, processors, transfers, and evidenced privacy-request status.
- FR-44: Maintain versioned Legal Seller identity and terms, privacy, delivery, cancellation, return, complaint, and invoice policies.
- FR-45: Report landing, organic, editorial-to-Product, Cart, Checkout, and attributable Order funnels with protected queries.
- FR-46: Report Product, repeat purchase, Order, reconciliation, fulfillment, cancellation, Refund, stock, and support measures with stable exportable definitions.

### NonFunctional Requirements

- NFR-1: Primary Storefront and Operator journeys meet applicable WCAG 2.2 AA, including keyboard, focus, alternatives, errors, labels, zoom, and reduced motion.
- NFR-2: Required journeys work at 375, 768, 1024, and 1440 pixels without horizontal scroll or navigation covering content.
- NFR-3: Public templates target p75 LCP <= 2.5 s, INP <= 200 ms, and CLS <= 0.1; index content works without JavaScript; provisional cached listing p95 TTFB <= 200 ms and uncached <= 500 ms under LG-5 workload.
- NFR-4: Apply OWASP ASVS 5.0 L2, HTTPS, strong hashing, session/token rotation, anti-automation, least privilege, scanning, threat modeling, and zero unresolved critical/high launch-surface findings.
- NFR-5: Use PCI DSS v4.0.1 baseline, hosted provider UI, minimal scope, and validated SAQ/control scope.
- NFR-6: Provider adapters use timeouts, bounded retries, idempotency, exceptions, reconciliation, and justified circuit breakers; 100 duplicate/reordered events yield one financial and physical outcome.
- NFR-7: All named regulated and sensitive action classes produce complete audit evidence for actor, time, subject, action, reason, outcome, and correlation.
- NFR-8: Personal data is purpose-limited and supports applicable Vietnamese legal-basis, consent, retention, deletion, processor, subject, and transfer duties.
- NFR-9: Backups are automated and restore-tested; provisional launch RPO <= 15 minutes and RTO <= 4 hours.
- NFR-10: Structured logs, metrics, alerts, and correlations cover critical flows without prohibited data; test alerts fire within five minutes and identify correlation.
- NFR-11: Explicit module contracts and ownership enable evidence-driven extraction without mandating microservices.
- NFR-12: A production-like test sustains 2x the LG-5 forecast for 30 minutes while meeting NFR-3, staying below 1% critical-flow errors and approved saturation thresholds.

### Additional Requirements

- AR-1 / AD-1: Assign exactly one authoritative module owner to every business concept and reject duplicate authority.
- AR-2 / AD-2: Keep module data private; other modules use published contracts rather than direct table, ORM, or internal-domain access.
- AR-3 / AD-3: Mutate owner state only through owner commands with validation, authorization, idempotency, and audit behavior.
- AR-4 / AD-4: Publish cross-module effects through a transactional outbox/inbox model; derived consumers tolerate replay and reordering.
- AR-5 / AD-5: Keep Product, Offer, Stock Position, Order, Payment, Finance, Fulfillment, and Return truths separate.
- AR-6 / AD-6: Model Inventory reservations explicitly with atomic reserve, confirm, release, expiry, and replay-safe commands.
- AR-7 / AD-7: Treat search as a disposable projection that can rebuild from owners and cannot authorize purchase.
- AR-8 / AD-8: Make regulated publication, sellability, withdrawal, and outbound Product communication fail closed.
- AR-9 / AD-9: Place Payment, carrier, messaging, and other providers behind owner-defined ports with contract tests and exception handling.
- AR-10 / AD-10: Version public HTTP, internal command/event, webhook, and provider contracts with stable RFC 9457 errors.
- AR-11 / AD-11: Enforce authorization, separation of duties, and append-only audit server-side rather than relying on UI visibility.
- AR-12 / AD-12: Use one release train with independently scalable Storefront, Admin, API, and Worker processes.
- AR-13 / AD-13: Gate production with repeatable accessibility, performance, security, privacy, recovery, replay, and capacity evidence.
- AR-14 / AD-14: Extract a service only after a measured bottleneck and an accepted strangler decision define boundary, migration, rollback, and observability.
- AR-15 / AD-15: Encode architecture invariants as automated boundary, ownership, contract, migration, and replay tests.
- AR-16 / AD-16: Organize agent work by bounded-context ownership with explicit dependencies and no silent cross-module edits.
- AR-17 / AD-17: At scaffold, pin and prove Node 24.19.0, pnpm 11.24.0, TypeScript 6.0.3 compatibility hold, Next.js >= 16.3.3 within patched 16.x, NestJS 11.2.3, Prisma 7.10.0 with ESM/adapter-pg, and PostgreSQL 18.6.
- AR-18 / AD-18: Purpose-bind sensitive behavior and prevent health-related signals from entering general advertising or unrestricted analytics.
- AR-19 / AD-19: Make Merchant the Legal Seller authority and Finance the ledger, settlement, and electronic-invoice authority.
- AR-20 / AD-20: Let Governance coordinate consent, privacy, retention, legal hold, and authority cases while source modules retain data ownership.
- AR-21 / AD-21: Make semantic accessibility, compliance, responsive behavior, and approved page specifications outrank generated styling.
- AR-22 / AD-22: Publish one canonical PurchaseEligibility contract and synchronously enforce Catalog Safety Denial on public Product/Content and Product Notifications.
- AR-23 / AD-23: Let Checkout alone orchestrate quote, IDs, Inventory reservation, Pending Payment Order, Payment initiation, success, timeout, cancellation, and recovery.
- AR-24 / AD-24: Separate RefundApproval, immutable Order allocation/cap calculation, Payment execution, and Finance posting.
- AR-25 / AD-25: Evolve commands, events, idempotency records, and database migrations compatibly through consumer-first and expand/migrate/contract rollout.
- AR-26 / AD-26: Keep binary-object lifecycle with its domain owner and enforce quarantine, validation, malware scanning, safe isolated delivery, immutability, retention, erase, and legal hold.
- AR-27 / AD-27: Build one Storefront shell for trust/header, search/category navigation, Cart/account access, content slots, and compliance/policy footer.
- AR-28 / AD-28: Require producer and consumer Leads to accept shared contract fixtures before merge; only Supervisor may approve a breaking exception.
- AR-29 / AD-29: Block environment and CI/CD provisioning until cloud, region, runtime, managed services, residency, backup, cost, operating owner, and exit assumptions are accepted.
- AR-30 / Structural Seed: Epic 1 Story 1 must scaffold a pnpm TypeScript monorepo with apps/storefront, apps/admin, apps/api, apps/worker, modules/<context>, platform/database, platform/messaging, platform/observability, platform/security, packages/ui, packages/config, and architecture/contract/system test suites.
- AR-31: PostgreSQL with transactional outbox/durable jobs is the MVP baseline; Redis, BullMQ, read replicas, a broker, or dedicated search require measured evidence and a new accepted decision.
- AR-32: Use UUIDv7, UTC, integer minor currency units plus ISO 4217, VND for MVP, opaque-cursor pagination, owner-prefixed schema objects, validated startup configuration, managed secrets, and redacted OTLP telemetry.
- AR-33: Deploy immutable stateless containers across local, test, staging, and production; place production near Vietnamese users and verify managed PostgreSQL, object storage/CDN, secrets, backups, and telemetry after AD-29 closure.
- AR-34: Preserve normative Order, Payment, Fulfillment, Return Request, cancellation, regulatory-hold, late-success, and duplicate-command lifecycle behavior from the SPEC companion.
- AR-35: BR must record producer-consumer dependencies, rollout tasks, gate blockers, ownership, acceptance fixtures, and evidence; BV may expose only unblocked ready work.
- AR-36: Each story handoff must identify scope/owner, inputs and outputs, API/event/schema impact, dependencies, acceptance criteria, tests, observability, migration/rollback, and unresolved decisions.

### UX Design Requirements

- UX-DR-1: Implement semantic design tokens for Primary #15803D, Accent/CTA #0369A1, Background #F0FDF4, Foreground #14532D, borders, muted, destructive, focus-ring, and on-colors; verify normal-text contrast >= 4.5:1.
- UX-DR-2: Implement Rubik headings and Nunito Sans body typography with resilient system fallbacks, readable Vietnamese glyphs, zoom support, and no layout dependency on remote-font success.
- UX-DR-3: Implement shared 4/8/16/24/32/48/64 px spacing tokens and constrained shadow/radius tokens; pages may not create private visual token systems.
- UX-DR-4: Provide accessible shared Button, Card, Input, Modal, focus, status, validation, loading, empty, and error primitives in packages/ui.
- UX-DR-5: Build one composable Storefront shell with trust strip/header, search/category navigation, contextual Cart/account access, page slots, and compliance/policy footer.
- UX-DR-6: Preserve product/content trust, evidence, conditions, comparison context, and disclosures before conversion pressure; prohibit fabricated scarcity and dark patterns.
- UX-DR-7: Use one semantic content source that adapts at 375, 768, 1024, and 1440 pixels without duplicated mobile/desktop meaning, horizontal scroll, or fixed-navigation occlusion.
- UX-DR-8: Create explicit approved page overrides for Home, Category/Search, Product Detail, Editorial Content, Cart/Checkout, Account, and Admin before implementing each surface.
- UX-DR-9: Keep crawlable headings, body copy, navigation, Product evidence, and disclosures present without animation or client JavaScript.
- UX-DR-10: Limit optional reveal motion to subtle 8–16 px/300–400 ms behavior, provide no-JS visibility, and disable nonessential motion under prefers-reduced-motion.
- UX-DR-11: Use a single SVG icon family such as Lucide or Heroicons, never emoji as functional icons, and give icon-only controls accessible names.
- UX-DR-12: Give every interactive control visible keyboard focus, correct pointer affordance, 150–300 ms state transitions, and hover/focus treatments that do not shift layout.
- UX-DR-13: Home must specify CMS-slot loading/fallback, trust, category/collection, editorial, featured-Product, unavailable-Product, and governed promotion states.
- UX-DR-14: Category/Search must specify query, filter, sort, pagination, canonical URL, results count, loading, no-result, error, and safety-removal behavior.
- UX-DR-15: Product Detail must specify Variant selection, price, evidence/disclosures, Availability, quantity/purchase, related content/Product separation, Back-in-stock, stale-state, and denial behavior.
- UX-DR-16: Editorial Content must specify provenance, freshness, advertising separation, Disclaimer, safe Product references, correction, expiry, withdrawal, and crawlable semantics.
- UX-DR-17: Cart/Checkout must specify merge and revalidation messaging, accessible address/delivery/payment steps, transparent totals, commitment progress, authoritative pending/failure/success, retry, and recovery.
- UX-DR-18: Account must specify verified access, Order/Payment/Fulfillment/Refund timelines, addresses, privacy requests, subscriptions/notifications, and support entry.
- UX-DR-19: Admin must specify role-aware navigation and work queues for content, catalog evidence, inventory, Orders, reconciliation, fulfillment/returns, governance, reporting, exceptions, and immutable audit context.
- UX-DR-20: A finalized bmad-ux DESIGN.md and EXPERIENCE.md pair must supersede provisional styling details without weakening SPEC, PRD, AD-21, or the requirements above.

### FR Coverage Map

- FR-1: Epic 3 — Govern public and SEO pages.
- FR-2: Epic 3 — Enforce Editorial lifecycle.
- FR-3: Epic 3 — Preserve content provenance and review dates.
- FR-4: Epic 3 — Identify Advertising Content.
- FR-5: Epic 3 — Restrict regulated claims and require Disclaimers.
- FR-6: Epic 3 — Version, expire, and withdraw Content.
- FR-7: Epic 3 — Reference Products safely from Editorial Content.
- FR-8: Epic 2 — Manage Product, Variant, SKU, taxonomy, media, price, and publication.
- FR-9: Epic 2 — Maintain classification and regulatory evidence.
- FR-10: Epic 2 — Compute fail-closed sellability.
- FR-11: Epic 2 — Present approved variant-correct Product Detail.
- FR-12: Epic 2 — Adjust, reserve, and release Stock.
- FR-13: Epic 2 — Derive Availability from safety and Stock Position.
- FR-14: Epic 8 — Manage and fulfill Back-in-stock Subscriptions.
- FR-15: Epic 4 — Browse indexable Categories and collections.
- FR-16: Epic 4 — Search sellable Products.
- FR-17: Epic 4 — Filter and sort through consistent shareable state.
- FR-18: Epic 4 — Govern simple promotions and collections.
- FR-19: Epic 4 — Present transparent deterministic related Products.
- FR-20: Epic 5 — Purchase as guest or through a verified basic account.
- FR-21: Epic 5 — Persist and deterministically merge Carts.
- FR-22: Epic 5 — Revalidate every Checkout commitment input.
- FR-23: Epic 5 — Capture supported domestic address and delivery.
- FR-24: Epic 5 — Apply and explain eligible coupons.
- FR-25: Epic 5 — Use hosted or redirected Payment.
- FR-26: Epic 5 — Commit an immutable Order snapshot safely.
- FR-27: Epic 5 — Present authoritative Checkout results.
- FR-28: Epic 5 — Verify and idempotently process provider notifications.
- FR-29: Epic 5 — Reconcile provider and settlement evidence.
- FR-30: Epic 5 — Enforce distinct Order, Payment, and Fulfillment lifecycles.
- FR-31: Epic 6 — Execute eligible pick, pack, and dispatch work once.
- FR-32: Epic 6 — Record Shipment and tracking evidence.
- FR-33: Epic 7 — Process policy-aware cancellation.
- FR-34: Epic 7 — Process item-level Return Requests and disposition.
- FR-35: Epic 7 — Execute capped, approved Refunds once.
- FR-36: Epic 7 — Hold affected Products and unfulfilled items during regulatory events.
- FR-37: Epic 8 — Submit and moderate evidence-backed Reviews.
- FR-38: Epic 8 — Report Reviews under abuse controls.
- FR-39: Epic 8 — Provide restricted support context and audited actions.
- FR-40: Epic 8 — Send deduplicated transactional Notifications.
- FR-41: Epic 1 — Enforce explicit least-privilege roles.
- FR-42: Epic 1 — Record append-only Audit History.
- FR-43: Epic 1 — Coordinate consent, privacy, retention, and deletion cases.
- FR-44: Epic 1 — Version Legal Seller identity and Store policies.
- FR-45: Epic 9 — Measure the organic acquisition and purchase funnel.
- FR-46: Epic 9 — Measure stable operational and commercial outcomes.

## Epic List

### Epic 1: Governed Store Operations

The Operator can establish and administer one auditable Legal Seller, explicit roles, versioned Store policies, and privacy/governance workflows so later commerce operates inside known authority and policy boundaries.

**FRs covered:** FR-41, FR-42, FR-43, FR-44

**Natural dependencies:** None. This epic establishes authority for later epics.

**Implementation notes:** Includes the structural monorepo seed, exact dependency catalog and compatibility spikes, server-side authorization, audit intake, Governance owner contracts, architecture tests, and AD-29/LG evidence preparation. Infrastructure provisioning remains blocked until AD-29 closure.

### Epic 2: Safe and Sellable Supplement Catalog

The Operator can govern supplement Products, Variants, evidence, claims, prices, and inventory, while Customers can view only variant-correct Products whose safety and Availability permit sale.

**FRs covered:** FR-8, FR-9, FR-10, FR-11, FR-12, FR-13

**Natural dependencies:** Epic 1 for roles, seller identity, policy, and audit.

**Implementation notes:** Coordinates Merchant, Catalog, Pricing, Inventory, object-storage safety, PurchaseEligibility, and Safety Denial contracts. Product Detail UX approval is required before its interface stories become ready.

### Epic 3: Trustworthy Health Content and SEO Publishing

The Operator can create and human-review credible Vietnamese supplement content, publish it with crawlable SEO metadata and explicit advertising separation, and correct or withdraw it without losing evidence.

**FRs covered:** FR-1, FR-2, FR-3, FR-4, FR-5, FR-6, FR-7

**Natural dependencies:** Epic 1 for authority/audit and Epic 2 for safe Product references.

**Implementation notes:** Coordinates Content, Catalog, Discovery, Storefront shell, approved claims and Disclaimers. Home and Editorial Content UX approvals are required before interface stories become ready.

### Epic 4: Product Discovery and Transparent Merchandising

Customers can browse, search, filter, sort, and navigate sellable Products and governed collections through stable SEO URLs and transparent merchandising rules.

**FRs covered:** FR-15, FR-16, FR-17, FR-18, FR-19

**Natural dependencies:** Epic 2 for canonical Product eligibility; Epic 3 supplies optional governed editorial entry points.

**Implementation notes:** PostgreSQL-backed Discovery projection is the MVP baseline. A dedicated search service, Redis cache, or generalized promotion engine requires measured evidence and a new decision. Category/Search UX approval is required before interface stories become ready.

### Epic 5: Safe Purchase, Payment, and Order Commitment

Customers can purchase supplements as guests or verified account holders through a persistent Cart, accessible domestic Checkout, hosted Payment, and an authoritative Order result; Operators can reconcile every financial exception.

**FRs covered:** FR-20, FR-21, FR-22, FR-23, FR-24, FR-25, FR-26, FR-27, FR-28, FR-29, FR-30

**Natural dependencies:** Epic 1 for identity, seller, policies, roles, privacy, and audit; Epic 2 for price, safety, and Stock truth. Discovery from Epic 4 is not required to commit a known Product.

**Implementation notes:** Coordinates Identity, Cart, Pricing, Checkout, Inventory, Orders, Payments, Finance, and Governance through bilateral versioned contracts. Provider-specific work is blocked by LG-3. Cart/Checkout and Account UX approvals are required before interface stories become ready.

### Epic 6: Fulfillment and Shipment Visibility

Operators can pick, pack, and dispatch eligible Order Items exactly once, while Customers can see retained carrier and tracking milestones with clear update time.

**FRs covered:** FR-31, FR-32

**Natural dependencies:** Epic 5 for authoritative paid Order Items and reserved Stock.

**Implementation notes:** Coordinates Inventory, Fulfillment, Orders, provider ports, transactional outbox jobs, replay tests, and hold/cancellation guards. Carrier-specific work is blocked by LG-3; Admin and Account UX approval applies.

### Epic 7: After-Sales Resolution and Safety Holds

Customers and Operators can resolve cancellation, item-level returns, Refunds, and regulatory events under the policy accepted at purchase without duplicate financial or physical effects.

**FRs covered:** FR-33, FR-34, FR-35, FR-36

**Natural dependencies:** Epic 5 for Orders, Payment/Finance, policy snapshots, and Inventory; Epic 6 for Fulfillment and dispatch evidence.

**Implementation notes:** Coordinates Orders, Returns, Payments, Finance, Catalog, Inventory, Fulfillment, and Governance. Preserves RefundApproval separation, cumulative Refund cap, immutable Order history, regulatory holds, late-success recovery, and Admin/Account UX dependencies.

### Epic 8: Customer Trust, Support, and Transactional Communication

Customers can request safe back-in-stock alerts, contribute moderated Reviews, report unsafe content, receive relevant transactional messages, and obtain support with controlled Order context.

**FRs covered:** FR-14, FR-37, FR-38, FR-39, FR-40

**Natural dependencies:** Epic 2 for Product eligibility and subscriptions; Epic 5 for Order and Payment events; Epics 6 and 7 for Shipment and Refund events.

**Implementation notes:** Coordinates Engagement with Catalog, Discovery, Orders, Fulfillment, Returns, and Governance. Messaging-provider work is blocked by LG-3. Reviews and Back-in-stock are evidence-triggered follow-on capabilities unless policy or support evidence promotes them.

### Epic 9: Operational Insight and Organic Demand Validation

The Operator can connect qualified SEO acquisition to Product discovery and attributable Orders, then monitor repeat purchase, stock, fulfillment, reconciliation, Refund, and support outcomes through stable purpose-bound reports.

**FRs covered:** FR-45, FR-46

**Natural dependencies:** Consumes owner-approved facts from completed preceding epics without becoming their source of truth.

**Implementation notes:** Reporting uses purpose-bound projections and stable definitions, minimizes sensitive query data, and never replaces Finance ledger truth. A data warehouse remains deferred. Home, Editorial, Category/Search, Account, and Admin UX specifications define how metrics and status are presented.

## Epic 1: Governed Store Operations

The Operator can establish and administer one auditable Legal Seller, explicit roles, versioned Store policies, and privacy/governance workflows so later commerce operates inside known authority and policy boundaries.

### Story 1.1: Verified Monorepo Scaffold and Dependency Catalog

As a delivery team,
I want a verified monorepo scaffold with an approved dependency catalog,
So that every Lead and Peer can build compatible modules without introducing premature infrastructure choices.

**Acceptance Criteria:**

**Given** the approved Architecture Spine and an empty source workspace
**When** the project scaffold is created
**Then** the pnpm workspace contains Storefront, Admin, API, Worker, bounded-context modules, platform packages, shared UI/config packages, and architecture/contract/system test locations
**And** no business tables or speculative domain entities are created.

**Given** the architecture version baseline
**When** dependencies are installed
**Then** Node, pnpm, TypeScript, Next.js, NestJS, Prisma, and PostgreSQL compatibility are pinned and documented
**And** Next.js uses the latest security-patched stable 16.x available at scaffold time, never below 16.3.3.

**Given** Prisma 7.10.0 is the accepted baseline
**When** Prisma 8 is evaluated
**Then** it is tested separately for ESM, migrations, PostgreSQL 18.6, pool timeout, and transaction compatibility
**And** it cannot replace Prisma 7 without an updated Architecture Decision.

**Given** the approved dependency catalog at `architecture/architecture-Ecom-2026-08-25/DEPENDENCY-CATALOG.md`
**When** a package is proposed
**Then** it is classified as runtime, development/test, provider-specific, or evidence-triggered
**And** its owner, purpose, version policy, and replacement boundary are recorded
**And** the initial candidate catalog evaluates TypeScript/tsx/Turbo; Next.js/React/Tailwind; shadcn/Base UI/Lucide/GSAP; Zod/React Hook Form/shared UI helpers; NestJS HTTP/config/OpenAPI/health/rate-limit packages; Prisma/adapter-pg/pg; Argon2/JOSE/Helmet; Pino/OpenTelemetry; Vitest/Playwright/axe/Testing Library/Supertest/Testcontainers/fast-check/MSW; ESLint/Prettier/boundary enforcement; and Sharp/file-type/sanitization/schema-dts.

**Given** deferred architecture decisions
**When** the workspace is installed
**Then** Redis, BullMQ, Elasticsearch/Meilisearch, provider SDKs, read-replica tooling, data-warehouse packages, rich-text editor packages, and charting packages are absent
**And** adding one requires the corresponding evidence, provider/UX choice, and Architecture Decision.

**Given** a clean checkout
**When** CI-equivalent workspace commands run
**Then** install, build, type-check, lint, and test pass
**And** Storefront, Admin, API, and Worker smoke checks prove the dependency graph is executable.

### Story 1.2: Executable Architecture Boundaries

As a Supervisor or module Lead,
I want architecture boundaries enforced by automated checks,
So that parallel agents cannot silently violate domain ownership or merge incompatible contracts.

**Acceptance Criteria:**

**Given** the bounded-context workspace
**When** an architecture check analyzes imports
**Then** one module may import another module only through its published contracts surface
**And** imports from another module's domain, application, adapter, Prisma client, or internal files fail with an actionable error.

**Given** database ownership rules
**When** Prisma schema files and generated-client imports are checked
**Then** every table and schema object has exactly one owner-prefixed module
**And** a module cannot directly query or mutate another module's private tables.

**Given** a versioned command, event, or public API contract
**When** producer and consumer compatibility tests run
**Then** its canonical schema, version, fixtures, owner, and affected consumers are identifiable
**And** a breaking change fails unless bilateral acceptance and a Supervisor-approved exception are recorded.

**Given** a retryable command or immutable event
**When** its fixture is validated
**Then** required identity, version, correlation, causation, idempotency, time, and owner fields are enforced
**And** an incompatible or unversioned fixture is rejected before merge.

**Given** a local or CI quality-gate run
**When** lint, architecture, contract, and ownership checks execute
**Then** any violation identifies the responsible producer and consumer modules
**And** this story creates no business tables or speculative domain behavior.

### Story 1.3: Secure Operator Access and Accessible Admin Shell

As an authorized Operator,
I want to sign in to one accessible Admin shell,
So that I can reach only the operational capabilities assigned to me.

**Acceptance Criteria:**

**Given** an active Operator credential
**When** the Operator signs in with valid evidence
**Then** the server establishes a protected, rotating session and an Actor Context
**And** the credential secret is strongly hashed and never logged.

**Given** invalid, disabled, or repeatedly abused credentials
**When** access is attempted
**Then** authentication fails without disclosing whether unrelated identities exist
**And** rate limiting, audit evidence, and safe recovery behavior apply.

**Given** an authenticated Operator
**When** the Admin application loads
**Then** one semantic shell presents role-aware navigation, identity, sign-out, status, and content regions
**And** authorization is rechecked server-side for every protected request.

**Given** the Admin UX specification is not approved
**When** BR evaluates the interface portion of this story
**Then** that portion remains blocked while authentication and shell contracts may be prepared
**And** implementation cannot weaken WCAG 2.2 AA, responsive, focus, zoom, reduced-motion, or disclosure requirements.

### Story 1.4: Role and Permission Administration

As a Store Administrator,
I want to assign explicit operational roles and permissions,
So that content, customer service, fulfillment, finance, and governance duties remain least-privileged.

**Acceptance Criteria:**

**Given** the canonical permission catalog
**When** an Administrator creates or changes a role assignment
**Then** only allowlisted capabilities can be granted
**And** sensitive grants require an authorized actor, reason, effective time, and Audit History.

**Given** a role assignment is inactive, expired, revoked, or insufficient
**When** its actor invokes a protected command or query
**Then** the server denies access using a stable problem response
**And** hiding or exposing a UI control does not change the authorization outcome.

**Given** an Administrator attempts to grant a permission they do not possess or violates separation of duties
**When** the command is evaluated
**Then** it is rejected without changing assignments
**And** the attempted action is auditable.

**Given** role data is queried
**When** an authorized Administrator reviews an Operator
**Then** current and historical assignments, source, effective interval, and revocation evidence are distinguishable
**And** credentials or prohibited personal data are not exposed.

### Story 1.5: Append-only Audit History

As a Compliance or Operations reviewer,
I want immutable audit evidence for regulated and sensitive actions,
So that I can reconstruct who did what, why, when, and with which outcome.

**Acceptance Criteria:**

**Given** an action class named by FR-2, FR-6, FR-9, FR-29, FR-35, FR-36, FR-41, or FR-42
**When** the action succeeds, fails, or is denied
**Then** an append-only entry records actor/system identity, time, subject, action, reason, outcome, and correlation identifier
**And** later corrections create new entries rather than editing history.

**Given** an owner module commits a sensitive state change
**When** its transaction completes
**Then** the required audit intake is committed consistently with owner state or enters a visible recoverable exception
**And** a missing mandatory audit record blocks the protected action where policy requires it.

**Given** an authorized reviewer filters or exports Audit History
**When** a subject, action class, actor, time interval, or correlation identifier is supplied
**Then** results are stable, paginated, and integrity-checkable against source event counts
**And** access to the evidence is itself audited.

### Story 1.6: Legal Seller and Store Policy Versioning

As the Store Operator,
I want to maintain versioned Legal Seller evidence and Store policies,
So that every publication and Order can retain the authority and terms that applied at the time.

**Acceptance Criteria:**

**Given** an authorized Operator
**When** Legal Seller identity, registration, contact, or fiscal evidence is created or updated
**Then** Merchant records a new immutable version with source, reviewer, validity, effective interval, and evidence references
**And** prior accepted versions remain available for historical snapshots.

**Given** a delivery, cancellation, return, Refund, complaint, privacy, invoice, hold/recall, or authority-response policy
**When** it moves from Draft to Approved and Effective
**Then** required reviewer, reason, effective date, version, and policy content are captured
**And** an incomplete or overlapping invalid version cannot become effective.

**Given** a policy version has been accepted by an Order or governed publication
**When** a later version is approved, retired, or corrected
**Then** the historical reference is not rewritten
**And** new commitments use the version effective at their commitment time.

### Story 1.7: Privacy, Retention, and Authority Case Coordination

As a Governance Operator,
I want to coordinate privacy, retention, legal-hold, and authority-response cases across data owners,
So that requests are resolved lawfully without bypassing module ownership.

**Acceptance Criteria:**

**Given** a consent, access, correction, deletion, retention, legal-hold, processor/transfer, or authority request
**When** Governance opens a case
**Then** the case records basis, scope, subject selectors, deadline, owner tasks, approvals, and correlation
**And** marketing, personalization, transaction, and regulatory purposes remain separate.

**Given** a case requires data-owner action
**When** Governance dispatches discover, export, correct, erase/anonymize, hold, or evidence commands
**Then** each owner returns an acknowledged, partial, blocked, or terminal evidence result
**And** Governance cannot directly mutate the owner's private data.

**Given** deletion conflicts with a legal or regulatory obligation
**When** the owner retains data
**Then** the retained subset, legal basis, disposition, reviewer, and expiry/review condition are recorded
**And** unrelated data is still erased or anonymized where required.

**Given** all owner responses satisfy the completion rule
**When** the case closes
**Then** Governance creates an integrity manifest and auditable outcome
**And** overdue, partial, or failed cases remain visible rather than appearing complete.

### Story 1.8: Architecture and Launch-Gate Evidence Register

As the Supervisor,
I want a visible register of architecture decisions and launch-gate evidence,
So that Leads and Peers cannot start or release work whose governing decisions remain open.

**Acceptance Criteria:**

**Given** LG-1 through LG-7 and the AD-29 infrastructure precursor
**When** the register is initialized
**Then** each item records owner, required artifact, status, dependencies, review decision, accepted evidence, and blocking effect
**And** an open gate cannot be represented as accepted or launch-ready.

**Given** cloud, region, runtime, managed service, residency, backup, cost, operating owner, or exit assumptions are absent
**When** environment or CI/CD provisioning work is evaluated
**Then** AD-29 marks it blocked
**And** local architecture and product work that does not depend on the provider may continue.

**Given** a Lead proposes a provider-specific or production-ready story
**When** its prerequisites are checked
**Then** the relevant LG and Architecture decisions must have accepted artifacts
**And** BR receives the explicit blocker/dependency information required for BV readiness.

**Given** a measured bottleneck in Discovery, Payments, Inventory, or another module
**When** a separate service is proposed
**Then** the decision must define evidence, boundary, data migration, compatibility, observability, rollback, and strangler cutover
**And** service count or architectural activity alone cannot justify extraction.

**Given** evidence is replaced or expires
**When** its owner updates the register
**Then** prior decisions remain auditable and affected work is re-evaluated
**And** the Supervisor alone approves a breaking exception.

### Story 1.9: Correlated Observability with Data Redaction

As an Operations Lead,
I want structured logs, metrics, traces, and alerts for critical commerce flows,
So that incidents can be detected and diagnosed without exposing prohibited data.

**Acceptance Criteria:**

**Given** Storefront, Admin, API, Worker, and provider-adapter activity
**When** telemetry is emitted
**Then** service/process, environment, owner, operation, outcome, duration, correlation, and causation fields follow one versioned convention
**And** Payment account data, credentials, raw health-sensitive behavior, and unnecessary personal data are redacted or rejected.

**Given** Checkout, Payment, Order, or Notification failure
**When** a synthetic/test scenario crosses the critical threshold
**Then** the alert fires within five minutes and identifies the affected correlation and safe operational context
**And** alert delivery failure is independently visible.

**Given** OpenTelemetry JavaScript logging remains less mature than traces/metrics
**When** the platform is configured
**Then** stable structured application logs use the approved logger while OTLP traces/metrics use supported SDKs/exporters
**And** backend choice remains replaceable behind platform configuration.

### Story 1.10: Security and Privacy Control Baseline

As a Security reviewer,
I want automated and evidenced launch-surface controls,
So that critical or high security/privacy risks block production instead of becoming deferred defects.

**Acceptance Criteria:**

**Given** the launch surface and data-flow inventory
**When** threat modeling and privacy mapping run
**Then** assets, actors, trust boundaries, abuse cases, purposes, legal bases, processors/transfers, retention, and mitigations are recorded
**And** Payment and potentially sensitive health-related behavior receive explicit treatment.

**Given** application and dependency changes
**When** CI security checks run
**Then** secret, dependency, static-analysis, authorization, rate-limit, and relevant OWASP ASVS 5.0 L2 evidence is produced
**And** unresolved critical/high launch-surface findings fail LG-6.

**Given** hosted Payment and provider integration design
**When** PCI scope is reviewed
**Then** account data boundaries, SAQ/control assumptions, logs, analytics, and incident responsibilities are documented
**And** implementation cannot expand scope without renewed approval.

### Story 1.11: Backup, Restore, and Capacity Evidence

As the Supervisor and Operations Lead,
I want production-like recovery and load evidence,
So that launch approval reflects proven service behavior rather than configuration claims.

**Acceptance Criteria:**

**Given** an AD-29-approved data and backup platform
**When** automated encrypted backups and restore rehearsal run
**Then** integrity, access control, retention, restore steps, achieved RPO/RTO, operator, and evidence are recorded
**And** provisional RPO <= 15 minutes and RTO <= 4 hours must be accepted or replaced through LG-5/LG-7.

**Given** the LG-5 forecast and production-like environment
**When** capacity testing sustains twice the initial forecast for 30 minutes
**Then** accepted Web Vitals/API thresholds hold, critical-flow error rate remains below 1%, and no resource exceeds its approved saturation threshold
**And** results identify workload, dataset, version, region, and bottleneck evidence.

**Given** a restore, capacity, or alert test fails
**When** launch readiness is evaluated
**Then** the affected gate remains blocked with an owner and corrective evidence requirement
**And** no manual status override can hide the failed result.

### Story 1.12: Compatible Migration and Release Pipeline

As a Delivery Lead,
I want version-compatible migrations and repeatable releases,
So that Storefront, Admin, API, and Worker can roll forward or recover without corrupting contracts or queued work.

**Acceptance Criteria:**

**Given** a schema, command, or event change
**When** release artifacts are prepared
**Then** consumer-before-producer and expand/migrate/contract sequencing is explicit
**And** clean and previous-production schemas, queued versions, and rollback compatibility are tested.

**Given** old API/Worker processes or messages remain
**When** rollout proceeds
**Then** old consumers can decode the compatible contract, leases/messages are drained under evidence, and destructive contraction waits at least one accepted release
**And** reused idempotency keys with changed payloads remain conflicts.

**Given** AD-29 is accepted
**When** deployment pipelines provision local, test, staging, and production targets
**Then** Storefront, Admin, API, and Worker use immutable stateless artifacts with validated configuration and managed secrets
**And** production placement, database, object storage, backup, and telemetry match the accepted decision.

**Given** AD-29 remains open
**When** production provisioning is requested
**Then** the story's provider-specific deployment portion remains blocked
**And** local build, migration, compatibility, and artifact tests may still complete.

### Story 1.13: Implement Approved Design Tokens and Accessible UI Primitives

As a Storefront and Admin delivery team,
I want one approved token system and accessible component foundation,
So that feature surfaces remain visually consistent without forking semantic behavior.

**Acceptance Criteria:**

**Given** the finalized UX DESIGN and EXPERIENCE contracts
**When** shared visual tokens are implemented
**Then** semantic color, on-color, typography/fallback, spacing, radius, shadow, focus, destructive, and motion tokens are exported from packages/ui
**And** page overrides may specialize approved tokens without weakening contrast, semantics, or disclosure requirements.

**Given** the provisional green/blue candidate remains approved
**When** contrast evidence runs
**Then** primary, accent, background, foreground, muted, border, destructive, and focus combinations meet the required normal-text contrast
**And** Rubik/Nunito Sans failure falls back without hiding content or breaking Vietnamese text and zoom.

**Given** shared Button, Card, Input, Modal/Dialog, status, validation, loading, empty, and error primitives
**When** keyboard, screen-reader, focus, pointer, reduced-motion, and responsive tests run
**Then** roles, names, states, focus trap/return, error announcement, and interaction affordances pass
**And** hover/focus transitions do not shift layout.

**Given** icons and motion
**When** UI primitives render
**Then** one SVG icon family is used, icon-only controls have accessible names, and emoji is not used as a functional icon
**And** nonessential motion is disabled under prefers-reduced-motion.

### Story 1.14: Build One Composable Storefront Shell

As a Customer,
I want consistent Store navigation, trust, Cart, account, and policy access,
So that every public route feels coherent and preserves essential information.

**Acceptance Criteria:**

**Given** the approved cross-surface UX contract
**When** the Storefront shell renders
**Then** trust/header, search and Category navigation, contextual Cart/account access, page-content slots, and compliance/policy footer have one semantic implementation
**And** route epics compose slots rather than reimplementing global regions or loaders.

**Given** a guest or authenticated Customer moves between routes
**When** shell state updates
**Then** Cart/account context remains consistent and server-authorized
**And** stale or failed contextual data uses an explicit safe fallback.

**Given** JavaScript, animation, or optional enhancement is unavailable
**When** a public route loads
**Then** primary navigation, trust, policy links, content slots, evidence, and disclosures remain present and operable
**And** hydration cannot replace them with semantically different content.

**Given** the 375, 768, 1024, and 1440 pixel breakpoints
**When** the shell is tested
**Then** one content source adapts without horizontal scroll, duplicate meaning, or navigation covering content
**And** keyboard focus order and skip/navigation landmarks remain predictable.

## Epic 2: Safe and Sellable Supplement Catalog

The Operator can govern supplement Products, Variants, evidence, claims, prices, and inventory, while Customers can view only variant-correct Products whose safety and Availability permit sale.

### Story 2.1: Govern Categories, Brands, and Attribute Sets

As a Catalog Operator,
I want to manage reusable taxonomy and attribute definitions,
So that supplement Products are classified consistently for administration, discovery, and presentation.

**Acceptance Criteria:**

**Given** an authorized Catalog Operator
**When** a Category, Brand, attribute set, or allowed attribute value is created or changed
**Then** identity, slug/code, display state, ordering, applicable Product types, and audit evidence are recorded
**And** Category parent relationships cannot contain a cycle.

**Given** a taxonomy item is referenced by a Product or historical Order snapshot
**When** the Operator retires it
**Then** it becomes unavailable for new assignment without deleting historical identity
**And** affected active Products are reported for review.

**Given** a Category URL or attribute code already exists in the applicable namespace
**When** a duplicate is submitted
**Then** the command fails with a stable conflict response
**And** no partial taxonomy change is persisted.

### Story 2.2: Manage Product, Variant, SKU, and Safe Media Drafts

As a Catalog Operator,
I want to create Product and Variant drafts with controlled media,
So that I can prepare complete supplement listings without making them prematurely sellable.

**Acceptance Criteria:**

**Given** a valid Category, Brand, and attribute set
**When** the Operator creates or edits a Product and its Variants
**Then** names, slugs, SKUs, attributes, units, descriptions, media references, and draft status are validated
**And** every SKU is unique and every Variant value conforms to its Product attribute set.

**Given** an uploaded Product image or document
**When** Catalog receives it
**Then** the object remains private and quarantined until size/type, MIME and magic bytes, malware status, and required image processing pass
**And** unsafe SVG, HTML, or PDF is never rendered inline.

**Given** a Product or Variant was included in an Order
**When** the source record is changed, retired, or removed from public view
**Then** the historical Order snapshot remains unchanged
**And** the Catalog change records actor, reason, version, and correlation.

### Story 2.3: Maintain SKU Classification and Regulatory Evidence

As a Regulatory Catalog Operator,
I want to attach reviewed classification and documentation to each SKU,
So that no supplement can be sold using inferred or expired evidence.

**Acceptance Criteria:**

**Given** a Product Variant SKU
**When** classification evidence is submitted
**Then** Regulatory Class, classification source, document identity/version, issuer, validity dates, reviewer, review status, and evidence object are required
**And** classification is never inferred from Product name, marketing copy, or supplier text.

**Given** evidence is missing, expired, rejected, suspended, withdrawn, or indeterminate
**When** Catalog evaluates the SKU
**Then** the regulatory evidence result is not eligible with a stable Operator-facing reason code
**And** public publication and purchase remain blocked.

**Given** accepted evidence is replaced or corrected
**When** the new version becomes effective
**Then** prior versions remain immutable and auditable
**And** affected sellability, public projections, Notifications, and unfulfilled-item review are triggered.

### Story 2.4: Approve Claims and Required Disclaimers

As an authorized Compliance reviewer,
I want to approve versioned claims and Disclaimer components,
So that Product and Advertising Content can use only supported human-reviewed statements.

**Acceptance Criteria:**

**Given** a proposed claim or Disclaimer
**When** a reviewer evaluates it
**Then** source evidence, applicable Products/classes/templates, wording, restrictions, effective/expiry dates, decision, reviewer, and reason are recorded
**And** the submitter cannot self-approve where separation of duties applies.

**Given** AI-assisted or supplier-provided wording
**When** it is submitted
**Then** it remains Draft until an authorized human approval
**And** treatment, cure, medicine-replacement, or otherwise prohibited claims are rejected.

**Given** an Approved Claim or Disclaimer expires, is suspended, or is withdrawn
**When** Catalog applies the decision
**Then** new publication and sale eligibility fail closed where the component is required
**And** affected public content and unfulfilled Orders enter the defined review paths.

### Story 2.5: Compute Canonical Sellability and Safety Denial

As a Customer and Operator,
I want one authoritative purchase-eligibility result,
So that every surface consistently prevents unsafe or unavailable supplement sales.

**Acceptance Criteria:**

**Given** a Product Variant
**When** PurchaseEligibility is evaluated
**Then** Catalog evidence/version, Approved Claims/Disclaimers, regulatory state, Offer validity, Stock availability, and policy limits are checked in the canonical deny-first order
**And** the result includes contract version, stable outcome, reasons, owner evidence versions, and evaluation time.

**Given** Catalog records an emergency suspension or withdrawal
**When** the Safety Denial Registry commits the denial
**Then** public Product/Content responses, Checkout, Discovery, and outbound Product Notifications synchronously fail closed
**And** derived projections are cleaned asynchronously without being treated as the safety authority.

**Given** Safety Denial is unavailable or times out
**When** a protected public response or Product communication is requested
**Then** the request denies or suppresses the Product safely
**And** an alert and correlation identifier are recorded without leaking sensitive data.

**Given** a consumer module implements PurchaseEligibility
**When** shared conformance fixtures run
**Then** identical inputs produce the same allow/deny outcome and reason order
**And** a divergent consumer implementation cannot merge.

### Story 2.6: Govern Product Offers and Prices

As a Commercial Operator,
I want to maintain versioned Product Offers,
So that Customers see and commit only valid prices from the correct Legal Seller.

**Acceptance Criteria:**

**Given** an eligible Product Variant and accepted Merchant party
**When** an Operator creates an Offer
**Then** price and optional compare-at price use integer minor units and VND, with effective interval, status, seller reference, quantity bounds, and audit evidence
**And** invalid negative, overlapping, or misleading compare-at values are rejected.

**Given** an Offer becomes effective, expires, is suspended, or changes
**When** Pricing publishes its versioned fact
**Then** Discovery and Product Detail refresh derived prices
**And** active Checkout quotes retain their immutable accepted price until their defined expiry.

**Given** no valid Offer exists
**When** PurchaseEligibility or Product Detail evaluates the Variant
**Then** it is not purchasable with an explicit state
**And** no stale cache can authorize the sale.

### Story 2.7: Adjust Stock and Manage Reservation Lifecycles

As an Inventory Operator,
I want auditable Stock Positions and atomic reservations,
So that available quantities remain accurate under concurrent Checkout attempts and failures.

**Acceptance Criteria:**

**Given** an inventory location and Variant
**When** an authorized adjustment is posted
**Then** Inventory records quantity delta, reason, source reference, actor, time, resulting on-hand quantity, and correlation
**And** the adjustment cannot produce an invalid Stock Position.

**Given** concurrent valid reservation commands for limited stock
**When** Inventory serializes them
**Then** accepted reservations never exceed available quantity
**And** duplicate idempotency keys return the original outcome without reserving twice.

**Given** a reserved Checkout succeeds, fails, cancels, or expires
**When** the corresponding versioned command is received
**Then** Inventory confirms or releases the reservation exactly once
**And** stale, contradictory, or reused commands return stable conflict or replay outcomes.

**Given** on-hand or reservation state changes
**When** Availability is projected
**Then** available quantity equals governed on-hand minus active reservations
**And** public Availability still requires canonical sellability rather than stock alone.

### Story 2.8: Present a Compliant Product Detail Surface

As a Customer,
I want a clear and trustworthy Product Detail page,
So that I can understand the selected supplement Variant and whether it can be purchased safely.

**Acceptance Criteria:**

**Given** an active Product and selected Variant
**When** the Product Detail page renders
**Then** identity, media, attributes, price, Availability, approved information, required disclosures, Disclaimer, seller, and Variant selection are mutually consistent
**And** unsupported treatment/cure claims never render.

**Given** a Variant is unavailable, denied, stale, or awaiting evidence
**When** the page renders or the Customer changes Variant
**Then** purchase controls reflect the canonical reason without fabricating urgency
**And** only eligible Back-in-stock entry points are offered.

**Given** the Product Detail UX specification is approved
**When** the page is tested at 375, 768, 1024, and 1440 pixels
**Then** content has one semantic source, keyboard/focus/zoom/reduced-motion behavior passes, and no navigation covers content
**And** required evidence and disclosures remain available without animation or client JavaScript.

**Given** production-like Product field data
**When** performance and SEO evidence runs
**Then** canonical metadata and structured Product data are valid and index controls match state
**And** the page targets p75 LCP <= 2.5 seconds, INP <= 200 milliseconds, and CLS <= 0.1.

## Epic 3: Trustworthy Health Content and SEO Publishing

The Operator can create and human-review credible Vietnamese supplement content, publish it with crawlable SEO metadata and explicit advertising separation, and correct or withdraw it without losing evidence.

### Story 3.1: Create Versioned Governed Content Drafts

As a Content Author,
I want to create structured Editorial, Advertising, policy, and SEO page drafts,
So that every page begins with explicit purpose, ownership, and governance metadata.

**Acceptance Criteria:**

**Given** an authorized Content Author
**When** a page draft is created
**Then** its content type, purpose, slug, locale, title, structured blocks, author/byline, sources, effective date, next-review date, and Draft state are recorded
**And** the draft is not publicly indexable or accessible through published routes.

**Given** an existing draft or returned Review item
**When** the Author saves changes
**Then** validation preserves block identity and required provenance
**And** no published Content Version is overwritten.

**Given** raw HTML, script, unsafe embed, or an unapproved block type
**When** it is submitted
**Then** Content rejects or sanitizes it according to the allowlist
**And** the action cannot suppress required advertising, provenance, or Disclaimer regions.

### Story 3.2: Submit Content for Human Review

As a Content Author,
I want to submit a complete draft for review,
So that a qualified reviewer can evaluate its evidence, claims, and presentation before publication.

**Acceptance Criteria:**

**Given** a Draft page
**When** submission is requested
**Then** Content validates required sources, attribution, dates, links, claims, Disclaimers, Advertising Markers, and template fields
**And** missing or invalid items return actionable field/block errors without changing state.

**Given** all submission requirements pass
**When** the Author submits the page
**Then** the page enters Review with an immutable review candidate and assigned reviewer/queue
**And** the transition records actor, time, reason, and correlation.

**Given** the Author or AI drafting assistant
**When** approval or publication is attempted without reviewer authority
**Then** the command is denied
**And** AI assistance remains distinguishable from human approval evidence.

### Story 3.3: Review and Approve Governed Content

As an authorized Content or Compliance reviewer,
I want to approve, reject, or return governed content with evidence,
So that only supported and policy-compliant information can proceed to publication.

**Acceptance Criteria:**

**Given** an immutable review candidate
**When** the reviewer evaluates it
**Then** sources, Approved Claim versions, required Disclaimers, advertising classification, Product links, review freshness, and policy/template rules are visible
**And** the reviewer can approve, reject, or return it with a required reason.

**Given** a claim is unsupported, expired, prohibited, or outside its approved scope
**When** approval is attempted
**Then** approval fails closed with the affected block and claim reason
**And** the page remains non-publishable.

**Given** approval succeeds
**When** Content records the decision
**Then** state becomes Approved with reviewer, decision version, time, evidence digest, and candidate hash
**And** a later content edit returns the changed version to Draft.

### Story 3.4: Enforce Editorial and Advertising Separation

As a Customer,
I want commercial content to be clearly distinguishable from independent editorial information,
So that I can understand when content is intended to promote a Product.

**Acceptance Criteria:**

**Given** an Advertising Page or commercial section
**When** it is rendered or serialized to structured metadata
**Then** an Advertising Marker and any required Disclaimer are present visually and structurally
**And** templates, authors, or personalization rules cannot suppress them.

**Given** an Editorial Page references a Product or commercial block
**When** Content validates the page
**Then** editorial and advertising roles remain separate and labeled
**And** commercial placement does not change provenance, reviewer, or editorial body meaning.

**Given** a template or content migration
**When** separation conformance fixtures run
**Then** missing labels, reordered hidden disclosures, or misleading prominence fail the gate
**And** the same semantic result is preserved across responsive layouts.

### Story 3.5: Publish and Schedule Crawlable Content

As a Content Publisher,
I want to publish or schedule approved pages with controlled SEO metadata,
So that trustworthy content becomes discoverable at the intended URL and time.

**Acceptance Criteria:**

**Given** an Approved page with valid evidence and policy
**When** immediate or scheduled publication executes
**Then** Content creates an immutable Content Version and moves the page to Published at the effective time
**And** canonical URL, title, description, index/follow directives, structured metadata, and sitemap eligibility match the publication state.

**Given** evidence, claims, required links, or Disclaimer validity changes before a scheduled publication
**When** the job revalidates the page
**Then** publication is blocked or canceled with an Operator-visible reason
**And** the page never appears publicly as partially published.

**Given** JavaScript or animation is unavailable
**When** a crawler or Customer loads a Published page
**Then** headings, body, provenance, disclosures, links, and primary navigation remain present and usable
**And** drafts, expired pages, and withdrawn pages remain non-indexable.

### Story 3.6: Govern Product References from Content

As a Content Author,
I want to reference relevant sellable Products from Editorial Content,
So that Customers can continue their research without unsafe or misleading links.

**Acceptance Criteria:**

**Given** a Product reference block
**When** it is added to a page
**Then** the referenced Product/Variant identity, relationship purpose, advertising classification, and display rule are recorded
**And** Content does not copy Product safety or price authority into its own records.

**Given** a Product is denied, retired, withdrawn, broken, or no longer linkable
**When** pre-publication or scheduled integrity checks run
**Then** publication is blocked or the public reference is safely suppressed according to policy
**And** the affected page enters an Operator review queue with the reason.

**Given** Product price or Availability changes
**When** a published reference renders
**Then** live commercial facts come from owner-approved projections
**And** editorial prose and historical Content Version remain unchanged.

### Story 3.7: Expire, Correct, and Withdraw Published Content

As an authorized Content Operator,
I want to expire, correct, or immediately withdraw published content,
So that obsolete or unsafe information stops promotion while its history remains auditable.

**Acceptance Criteria:**

**Given** a Published page reaches its expiry or next-review policy
**When** the lifecycle job evaluates it
**Then** it enters Expired or a required Review state according to policy
**And** public indexing and promotion behavior change atomically with the accepted transition.

**Given** an urgent safety or compliance reason
**When** an authorized Operator withdraws the page
**Then** public promotion stops immediately and a safe withdrawn/not-found response applies
**And** actor, reason, evidence, prior version, affected links, and correlation remain auditable.

**Given** a correction is needed
**When** a corrected version is approved and published
**Then** a new Content Version becomes current without rewriting the prior version
**And** any required correction notice is presented consistently.

### Story 3.8: Compose the Governed Home Surface

As a Customer,
I want a trustworthy Home page with useful Product and editorial entry points,
So that I can understand the Store and begin shopping without misleading promotion.

**Acceptance Criteria:**

**Given** approved Home UX and CMS slot specifications
**When** an authorized Operator composes Home
**Then** only allowed trust, category, collection, editorial, Product, banner, and policy components can be placed
**And** every commercial component preserves its Advertising Marker, conditions, safety denial, and publication rules.

**Given** a slot source is empty, stale, denied, expired, or unavailable
**When** Home renders
**Then** the slot uses its approved empty/fallback behavior without layout collapse or fabricated content
**And** one component failure does not hide primary navigation, trust, or policy regions.

**Given** Home is tested at required breakpoints and without JavaScript
**When** accessibility, SEO, and performance evidence runs
**Then** semantic headings, links, focus order, disclosures, and crawlable content remain correct
**And** the page targets the accepted Web Vitals and no-horizontal-scroll thresholds.

### Story 3.9: Present the Governed Editorial Surface

As a Customer,
I want to read clearly sourced and reviewed supplement content,
So that I can distinguish reliable education, commercial references, and current safety information.

**Acceptance Criteria:**

**Given** a Published Editorial Page
**When** it renders
**Then** title, author/byline, reviewer, sources, effective/review dates, body structure, advertising separation, Disclaimer, and safe Product references are accessible
**And** structured metadata matches the visible content and publication state.

**Given** content is corrected, expired, withdrawn, or awaiting required review
**When** the route is requested
**Then** the approved correction, expiry, withdrawal, or unavailability state is shown
**And** stale cached content cannot bypass the current lifecycle decision.

**Given** the Editorial UX specification
**When** keyboard, screen-reader, zoom, reduced-motion, no-JavaScript, and responsive tests run
**Then** all required information and navigation remain operable
**And** visual styling never weakens provenance, advertising labels, or required disclosures.

## Epic 4: Product Discovery and Transparent Merchandising

Customers can browse, search, filter, sort, and navigate sellable Products and governed collections through stable SEO URLs and transparent merchandising rules.

### Story 4.1: Build a Rebuildable Commercial Discovery Projection

As a Customer,
I want discovery results to reflect current sellable Products,
So that search and navigation do not lead me toward denied or unavailable items.

**Acceptance Criteria:**

**Given** versioned Catalog, Pricing, Inventory, Review-summary, and merchandising events
**When** Discovery consumes them
**Then** it creates an owner-independent projection with source versions, freshness, and canonical PurchaseEligibility outcome
**And** replay or reordering converges without duplicate result records.

**Given** a Catalog safety denial or withdrawal
**When** Discovery receives or detects it
**Then** the Product is tombstoned from public results before asynchronous cleanup completes
**And** failure to refresh cannot make the Product purchasable.

**Given** the projection is empty, corrupt, or needs a schema change
**When** a rebuild runs from owner contracts
**Then** results can be recreated without treating the old index as authoritative
**And** the active projection swaps only after completeness and conformance checks pass.

### Story 4.2: Browse Categories and Governed Collections

As a Customer,
I want to browse Categories and curated collections,
So that I can explore relevant sellable supplements through stable crawlable navigation.

**Acceptance Criteria:**

**Given** an active Category or collection
**When** its route is requested
**Then** the response includes governed heading/content, canonical URL, breadcrumbs, paginated eligible Products, count, and applicable navigation
**And** only current sellable Products appear.

**Given** a retired, empty, invalid, or out-of-range route
**When** it is requested
**Then** the approved empty, redirect, or not-found behavior applies
**And** canonical/index rules do not create duplicate or thin index pages.

**Given** pagination is used
**When** the Customer moves between pages
**Then** ordering is stable with an opaque cursor or approved SEO pagination contract
**And** duplicate or missing Products do not appear under unchanged source data.

### Story 4.3: Search with Safe Autocomplete and Typo Tolerance

As a Customer,
I want to search Product names and relevant attributes,
So that minor typing errors do not prevent me from finding sellable supplements.

**Acceptance Criteria:**

**Given** a supported search query
**When** Discovery evaluates it
**Then** active sellable Products are ranked using documented name and attribute rules
**And** results never use diagnosis, inferred health profile, or prohibited personalization.

**Given** a partial or slightly misspelled query
**When** autocomplete or typo tolerance runs
**Then** suggestions are deterministic, bounded, and limited to eligible Products or approved taxonomy
**And** a suggestion cannot bypass Safety Denial.

**Given** sensitive, abusive, empty, or excessively long query input
**When** the request is processed
**Then** validation and rate limits apply with safe feedback
**And** unnecessary raw sensitive query text is not retained in logs or general analytics.

### Story 4.4: Filter, Sort, and Share Discovery State

As a Customer,
I want to filter and sort Product results,
So that I can narrow a large assortment while retaining a shareable and understandable result state.

**Acceptance Criteria:**

**Given** a Category or search result
**When** applicable Brand, price, rating, attribute, Availability, or sort controls are used
**Then** Product results and facet counts use the same eligible projection and filter semantics
**And** invalid or inapplicable filters are ignored or rejected through documented behavior.

**Given** a useful filter/sort state
**When** its URL is copied or reloaded
**Then** the state is restored through stable canonical parameters
**And** crawl/index rules prevent unbounded duplicate URL combinations.

**Given** the underlying eligible set changes
**When** the result refreshes
**Then** unavailable or denied Products disappear with an understandable update
**And** paging state recovers to a valid result rather than showing a false success.

### Story 4.5: Schedule Simple Promotions and Featured Collections

As a Commercial Operator,
I want to schedule bounded discounts and featured collections,
So that I can merchandise Products transparently without building a general-purpose promotion engine.

**Acceptance Criteria:**

**Given** eligible Products or Variants
**When** a fixed/percentage discount, coupon definition, or featured collection is created
**Then** scope, conditions, value, usage bounds, effective interval, stacking rule, display terms, and owner approval are validated
**And** benefits cannot create negative totals or exceed configured bounds.

**Given** a promotion is scheduled, active, expired, suspended, or exhausted
**When** Storefront presents it
**Then** the visible price/benefit and conditions match the current governed projection
**And** presentation cannot fabricate scarcity or hide eligibility limitations.

**Given** a Customer later reaches Checkout
**When** the benefit is evaluated
**Then** Pricing revalidates it against authoritative time, scope, usage, and quote inputs
**And** Discovery presentation is never treated as commitment authority.

### Story 4.6: Present Deterministic Related Products

As a Customer,
I want to see transparent related Products,
So that I can explore reasonable alternatives without opaque health profiling.

**Acceptance Criteria:**

**Given** a Product or governed content context
**When** related Products are requested
**Then** results come from an inspectable manual relationship or deterministic Category/attribute rule
**And** every result is currently eligible and labeled as related or recommended.

**Given** a relationship becomes invalid, denied, or unavailable
**When** the projection refreshes or the response is served
**Then** the affected Product is removed safely
**And** the remaining order remains deterministic.

**Given** no valid related Products exist
**When** the component renders
**Then** it uses the approved empty behavior
**And** it does not infer or expose a health profile to fill the space.

### Story 4.7: Deliver the Category and Search Experience

As a Customer,
I want one accessible Category/Search experience,
So that I can navigate, query, refine, and recover from discovery states on any supported device.

**Acceptance Criteria:**

**Given** the approved Category/Search UX specification
**When** the surface renders
**Then** query, heading, result count, filters, applied-filter summary, sort, Products, pagination, and reset controls have semantic labels and predictable focus order
**And** mobile adaptation does not duplicate or change the meaning of desktop content.

**Given** loading, no-result, invalid-filter, stale, safety-removal, partial, or system-error state
**When** it occurs
**Then** a distinct accessible status and recovery action is shown
**And** prior or ineligible results are not presented as current success.

**Given** keyboard, screen-reader, zoom, no-JavaScript, responsive, and performance tests
**When** evidence runs against realistic result data
**Then** primary browsing and crawlable content remain usable and no horizontal scrolling occurs
**And** the surface targets the accepted Web Vitals and listing API latency thresholds.

## Epic 5: Safe Purchase, Payment, and Order Commitment

Customers can purchase supplements as guests or verified account holders through a persistent Cart, accessible domestic Checkout, hosted Payment, and an authoritative Order result; Operators can reconcile every financial exception.

### Story 5.1: Guest Identity and Verified Email Account Access

As a Customer,
I want to shop as a guest or use a basic verified-email account,
So that I can purchase without unnecessary registration while retaining optional account access.

**Acceptance Criteria:**

**Given** a new browser session
**When** a Customer shops without signing in
**Then** Identity issues a non-guessable guest identity suitable for Cart and Checkout correlation
**And** guest purchase does not require marketing consent.

**Given** a Customer submits an email account registration, verification, sign-in, or recovery request
**When** Identity processes it
**Then** tokens are single-purpose, time-bounded, stored safely, and rotated or consumed once
**And** responses do not disclose unrelated identity records.

**Given** valid account access
**When** a session is established or refreshed
**Then** the session is protected, revocable, and bound to the Customer actor context
**And** strong password hashing applies if a password credential is enabled.

**Given** suspicious or repeated access attempts
**When** abuse thresholds are reached
**Then** rate limiting and safe challenge/recovery behavior apply
**And** logs contain correlation but no credential or prohibited health data.

### Story 5.2: Persist and Manage Shopping Carts

As a Customer,
I want my Cart to persist while I add, change, or remove Products,
So that I can prepare a purchase across visits without retaining invalid items as purchasable.

**Acceptance Criteria:**

**Given** a guest or authenticated Customer
**When** a sellable Variant is added
**Then** Cart records Variant identity, requested quantity, source context, and update time
**And** duplicate Variant additions combine deterministically within configured quantity limits.

**Given** quantity is changed or an item is removed
**When** the command is applied
**Then** Cart returns the updated items, estimated totals, eligibility status, and version
**And** a stale expected version produces a recoverable conflict rather than lost updates.

**Given** price, Availability, evidence, or policy changes after an item was added
**When** Cart is read
**Then** the item shows a current provisional state and reason
**And** cached Cart data never guarantees Checkout acceptance.

### Story 5.3: Merge Guest and Account Carts Deterministically

As a Customer,
I want my guest Cart merged when I sign in,
So that I keep my shopping intent without duplicating items or bypassing limits.

**Acceptance Criteria:**

**Given** a guest Cart and an existing account Cart
**When** sign-in completes
**Then** identical Variants merge under the documented quantity rule and distinct items are retained in stable order
**And** the result has one account Cart identity and version.

**Given** a merged item exceeds a quantity limit or becomes ineligible
**When** Cart validates the merge
**Then** it caps, flags, or removes the item according to the approved rule with an explicit message
**And** it never bypasses PurchaseEligibility or Stock rules.

**Given** the merge command is retried
**When** the same identity and request hash are received
**Then** the original result is returned
**And** a changed request under the same key produces a stable conflict.

### Story 5.4: Start Checkout with an Immutable Quote

As a Customer,
I want Checkout to revalidate my intended purchase,
So that I understand current price, safety, stock, and policy before committing.

**Acceptance Criteria:**

**Given** a non-empty Cart
**When** Checkout starts
**Then** each item is evaluated against canonical Product/Variant, PurchaseEligibility, Offer, Stock, quantity, and current policy inputs
**And** an immutable time-bounded quote records item prices, discounts, totals, currency, evidence versions, and rejection reasons.

**Given** one or more items changed since Cart display
**When** Checkout creates the quote
**Then** changes are shown distinctly and require Customer acknowledgement where material
**And** ineligible items cannot silently proceed.

**Given** a quote expires or owner evidence changes
**When** commitment is attempted
**Then** Checkout requires revalidation and a new quote
**And** the expired quote remains traceable but cannot authorize an Order.

### Story 5.5: Capture Domestic Address and Delivery Selection

As a Customer,
I want to provide a Vietnamese delivery address and choose a supported delivery method,
So that delivery feasibility and cost are known before Payment.

**Acceptance Criteria:**

**Given** Checkout address entry
**When** the Customer submits recipient, phone, province/city, district, ward, street, and optional instructions
**Then** required fields are normalized and validated without losing Vietnamese characters
**And** errors are associated with accessible field labels and summaries.

**Given** a valid address and eligible Cart
**When** delivery methods are requested
**Then** provider-neutral options expose service, fee, estimate, conditions, and quote expiry
**And** an unsupported destination fails before Payment.

**Given** a delivery method is selected
**When** the Checkout quote is updated
**Then** delivery facts and cost become part of the immutable quote
**And** provider-specific behavior remains blocked until LG-3 acceptance.

### Story 5.6: Apply Coupons and Explain Totals

As a Customer,
I want to apply an eligible coupon and understand every charge and discount,
So that I know the exact commercial terms before purchase.

**Acceptance Criteria:**

**Given** a coupon code and current Checkout inputs
**When** Pricing evaluates it
**Then** scope, effective interval, usage bounds, stacking, quantity, Customer eligibility, and quote version are checked authoritatively
**And** acceptance or rejection returns a stable reason.

**Given** a valid benefit
**When** totals render
**Then** item subtotal, discounts, delivery, tax/invoice-relevant amount, and final VND total are explicit
**And** rounding and allocation are deterministic in integer minor units.

**Given** a one-time or limited benefit
**When** commitment or replay occurs
**Then** usage is reserved and consumed exactly once with the Order outcome
**And** failed or expired commitment releases any held benefit safely.

### Story 5.7: Commit One Pending-Payment Order

As a Customer,
I want one Order created from the terms I accepted,
So that my purchase agreement is durable even if later source data changes.

**Acceptance Criteria:**

**Given** an acknowledged valid quote, address, delivery method, and policy set
**When** Checkout commits
**Then** it allocates Order and line UUIDv7 identities, captures the MerchantPartySnapshot, and reserves Inventory against those identities
**And** Orders creates one Pending Payment Order with immutable Product, Variant, quantity, price, discount, seller, invoice, delivery, policy, and disclosure snapshots.

**Given** any step before durable Order creation fails
**When** Checkout recovers
**Then** reservations and benefit holds are released once or a visible recovery record is created
**And** the Customer cannot receive a false success.

**Given** the commitment command is duplicated
**When** the same canonical request hash is replayed
**Then** the original Order result is returned
**And** a different request under the same idempotency identity is rejected.

### Story 5.8: Initiate Hosted or Redirected Payment

As a Customer,
I want to pay through an approved hosted provider experience,
So that I can complete payment without Ecom handling sensitive account data.

**Acceptance Criteria:**

**Given** a Pending Payment Order and an LG-3-approved provider adapter
**When** Checkout initiates Payment
**Then** Payments creates one attempt with Order identity, amount, currency, expiry, provider reference, callback correlation, and idempotency identity
**And** the Customer receives only the approved hosted/redirect instruction.

**Given** Payment account numbers, verification values, or equivalent secrets
**When** provider UI and telemetry are inspected
**Then** those values never enter Ecom forms, storage, logs, analytics, or traces
**And** the documented PCI scope evidence matches the implemented flow.

**Given** provider initiation times out or returns an ambiguous response
**When** the adapter handles it
**Then** Payment remains Pending or enters a reconciliation exception according to evidence
**And** bounded retry cannot create a second provider charge attempt.

### Story 5.9: Verify Provider Payment Notifications Idempotently

As the Store Operator,
I want provider callbacks verified and processed exactly once,
So that forged, duplicated, or reordered notifications cannot corrupt Orders or money.

**Acceptance Criteria:**

**Given** an inbound provider notification
**When** Payments receives it
**Then** raw evidence is safely retained and signature, provider identity, Order/payment reference, amount, currency, and timestamp/replay rules are verified
**And** invalid evidence cannot change Payment state.

**Given** the same valid callback arrives repeatedly or out of order
**When** inbox/idempotency processing runs
**Then** one authoritative Payment fact is produced and the original outcome is replayed
**And** no additional capture, Order transition, Inventory action, or Notification occurs.

**Given** valid evidence conflicts with current records
**When** it cannot be applied safely
**Then** a reconciliation exception is created with correlation and evidence digest
**And** the system does not guess a successful state.

### Story 5.10: Resolve Authoritative Checkout and Order State

As a Customer,
I want Checkout status based on authoritative payment evidence,
So that a browser redirect or network interruption cannot misreport my purchase.

**Acceptance Criteria:**

**Given** a provider browser return
**When** the Customer returns to Ecom
**Then** Checkout queries authoritative Order and Payment state
**And** pending, failed, canceled, successful, and on-hold outcomes are distinct with safe next actions.

**Given** verified Payment success for a nonterminal Pending Payment Order
**When** Checkout applies the fact
**Then** the Order becomes Confirmed and Inventory reservation is confirmed exactly once
**And** other modules observe but cannot issue competing lifecycle commands.

**Given** verified failure, cancellation, or timeout
**When** Checkout applies the fact
**Then** the Pending Order cancels and Inventory and promotion holds release once
**And** later duplicates replay the same outcome.

**Given** success arrives after terminal cancellation
**When** it is processed
**Then** the Order does not reopen, Fulfillment remains blocked, and a reconciliation exception starts the approved corrective path
**And** the Customer receives no false fulfillment promise.

### Story 5.11: Reconcile Payment and Settlement Exceptions

As a Finance Operator,
I want to reconcile provider query and settlement evidence,
So that ambiguous or inconsistent payments are resolved without silent financial mutation.

**Acceptance Criteria:**

**Given** a Payment attempt, provider query, callback, or settlement row
**When** reconciliation compares them
**Then** identity, amount, currency, status, effective time, fees, net, and references are matched under provider-specific rules
**And** consistent items close with evidence while mismatches enter an exception queue.

**Given** an exception
**When** an authorized Operator investigates
**Then** source evidence, related Order/Payment, prior actions, recommended safe commands, and separation-of-duty requirements are visible
**And** free-form record editing is unavailable.

**Given** a manual corrective action is approved
**When** it executes
**Then** actor, authority, reason, evidence, idempotency identity, financial facts, and resulting state are recorded
**And** replay cannot apply the correction twice.

### Story 5.12: Post Financial Facts and Invoice Evidence

As a Finance Operator,
I want authoritative ledger and invoice records derived from accepted commerce facts,
So that operational Payment records do not become an informal accounting truth.

**Acceptance Criteria:**

**Given** a unique captured, settled, fee, refund, or reversal FinancialFact
**When** Finance accepts it
**Then** append-only balanced postings record Order, Payment attempt/provider transaction, currency, gross, fee, net, effective time, settlement, allocations, and original-posting references
**And** the same fact cannot post twice.

**Given** an Order commitment or later financial adjustment
**When** invoice rules require a record
**Then** Finance creates versioned electronic-invoice command/evidence linked to the accepted Merchant and Order snapshots
**And** applicable legal baseline and provider outcome remain auditable.

**Given** operational Payment/Reconciliation data differs from Finance
**When** reports or corrections run
**Then** Finance remains ledger authority and the discrepancy enters an exception path
**And** no report overwrites ledger truth.

### Story 5.13: Deliver the Cart and Checkout Experience

As a Customer,
I want an accessible multi-step Cart and Checkout experience,
So that I can understand and recover from every change before committing Payment.

**Acceptance Criteria:**

**Given** the approved Cart/Checkout UX specification
**When** the Customer proceeds through Cart, identity, address, delivery, discount, review, and Payment
**Then** progress, editable prior steps, totals, terms, required disclosures, primary action, and focus management are clear
**And** a fixed navigation region never covers content or validation errors.

**Given** Cart merge, revalidation change, unavailable item, coupon rejection, address error, provider redirect, pending result, failure, cancellation, or recoverable exception
**When** it occurs
**Then** a distinct accessible status explains what changed, what remains safe, and the next action
**And** duplicate submission controls prevent repeated commitment.

**Given** responsive, keyboard, screen-reader, zoom, reduced-motion, no-JavaScript, and performance tests
**When** the primary journey is exercised
**Then** semantic content and required disclosures remain available and no horizontal scroll occurs
**And** the accepted Web Vitals and alert evidence apply to the launch path.

### Story 5.14: Deliver Basic Customer Account and Order Summary

As a verified Customer,
I want to manage basic account details and see my Orders,
So that I can return to purchase evidence without contacting support.

**Acceptance Criteria:**

**Given** a verified authenticated Customer
**When** Account loads
**Then** only that Customer's profile, saved domestic addresses, Orders, current Payment state, accepted totals, policy versions, and support entry are visible
**And** server-side ownership checks prevent identifier-based cross-account access.

**Given** a Customer adds, edits, selects, or removes an address
**When** the command executes
**Then** accessible validation and optimistic-concurrency rules apply
**And** historical Order delivery snapshots are unchanged.

**Given** an Order has pending, failed, canceled, confirmed, or on-hold evidence
**When** the summary renders
**Then** the authoritative state, update time, and permitted next action are explicit
**And** later Fulfillment, Return, Refund, and Notification stories can extend the timeline without replacing this contract.

**Given** the approved Account UX specification
**When** responsive and accessibility evidence runs
**Then** sign-in, recovery, address, Order summary, privacy, and support navigation are operable at all required breakpoints
**And** sensitive data is minimized in browser storage and telemetry.

## Epic 6: Fulfillment and Shipment Visibility

Operators can pick, pack, and dispatch eligible Order Items exactly once, while Customers can see retained carrier and tracking milestones with clear update time.

### Story 6.1: Allocate Eligible Fulfillment Work

As a Fulfillment Operator,
I want paid and eligible Order Items allocated to work,
So that warehouse activity never starts for canceled, unpaid, denied, or held items.

**Acceptance Criteria:**

**Given** a Confirmed Order with eligible items and confirmed Inventory reservation
**When** Fulfillment receives the owner facts
**Then** one Fulfillment record per eligible Order Item enters Ready with source versions and idempotency identity
**And** duplicate or reordered events do not create duplicate work.

**Given** an Order Item is unpaid, canceled, already fulfilled, regulatory-held, or otherwise ineligible
**When** allocation is requested
**Then** the command is denied with a stable reason
**And** no physical work or Stock movement occurs.

**Given** partially eligible Order Items
**When** allocation runs
**Then** only eligible items are allocated and exceptions remain item-specific
**And** unaffected Order Items retain their lifecycle.

### Story 6.2: Pick Allocated Order Items

As a Fulfillment Operator,
I want to pick the exact allocated SKUs and quantities,
So that Order contents remain accurate and traceable.

**Acceptance Criteria:**

**Given** Ready Fulfillment work
**When** the Operator starts and confirms picking
**Then** expected SKU, Variant, quantity, location, operator, time, and result are recorded
**And** state progresses through Picking only under the allowed expected version.

**Given** a missing, damaged, mismatched, or insufficient item
**When** the Operator records the exception
**Then** affected quantity enters a visible exception/hold path with evidence
**And** the system does not substitute a Product silently.

**Given** the same pick confirmation is retried
**When** Fulfillment processes it
**Then** the original outcome is returned
**And** Inventory or work quantity is not decremented twice.

### Story 6.3: Pack and Verify Fulfillment

As a Fulfillment Operator,
I want to verify and pack picked items,
So that dispatch contains the correct Products, quantities, and required documents.

**Acceptance Criteria:**

**Given** completely picked eligible work
**When** packing begins
**Then** the Operator verifies item identity, quantity, package count, weight/dimensions, required inserts, and condition
**And** mismatches return the affected work to an explicit exception rather than Packed.

**Given** packing completes
**When** the Operator confirms it
**Then** Fulfillment enters Packed with operator, time, package evidence, and expected version
**And** retry cannot create another package or completion.

**Given** a cancellation or regulatory hold arrives before dispatch
**When** Fulfillment processes it
**Then** new dispatch is blocked and the work enters the approved cancel/hold review state
**And** already captured pick/pack evidence remains intact.

### Story 6.4: Create and Dispatch a Shipment

As a Fulfillment Operator,
I want to create one carrier Shipment for packed eligible work,
So that handoff to delivery is documented and cannot be duplicated.

**Acceptance Criteria:**

**Given** Packed work and an LG-3-approved carrier adapter
**When** Shipment creation is requested
**Then** carrier/service, recipient snapshot, package facts, provider reference, tracking code, label evidence, and idempotency identity are recorded
**And** provider retry cannot buy or create a second Shipment.

**Given** valid carrier acceptance and physical handoff evidence
**When** dispatch is confirmed
**Then** Fulfillment and Shipment enter Dispatched with time and correlation
**And** dispatched work cannot be canceled as unshipped.

**Given** carrier creation times out or returns ambiguous evidence
**When** the adapter recovers
**Then** the work remains safely non-dispatched or enters a provider exception
**And** bounded query/retry resolves the original request before any replacement attempt.

### Story 6.5: Normalize Shipment Tracking Milestones

As a Customer and Fulfillment Operator,
I want carrier tracking updates normalized,
So that delivery progress remains understandable even when providers use different statuses.

**Acceptance Criteria:**

**Given** a signed callback or authorized carrier query result
**When** tracking evidence is received
**Then** carrier identity, tracking code, provider milestone, normalized milestone, event time, received time, location summary, and evidence digest are recorded
**And** duplicates or reordered milestones converge without erasing prior evidence.

**Given** an invalid signature, unknown Shipment, impossible transition, or conflicting milestone
**When** the update is evaluated
**Then** Shipment state does not change and an exception is recorded
**And** the Customer does not see fabricated progress.

**Given** a terminal Delivered milestone
**When** it is accepted
**Then** Fulfillment and eligible Order Item state advance consistently through owner commands
**And** later callbacks cannot regress the terminal state.

### Story 6.6: Operate the Admin Fulfillment Queue

As a Fulfillment Lead,
I want a role-aware queue for allocation, picking, packing, dispatch, and exceptions,
So that the team can process Orders efficiently without bypassing guards.

**Acceptance Criteria:**

**Given** the approved Admin UX specification
**When** a Fulfillment Operator opens the queue
**Then** work is grouped by actionable state, age, delivery priority, hold/exception, and assigned operator
**And** each action exposes only server-authorized transitions.

**Given** an Operator opens a work item
**When** its detail renders
**Then** immutable Order snapshot, eligible items, current fulfillment version, relevant payment/hold evidence, and allowed commands are visible
**And** unrelated sensitive Customer or Finance data is hidden.

**Given** a command succeeds, conflicts, is retried, or fails
**When** the queue updates
**Then** the result and correlation are announced accessibly without losing filter/focus context
**And** bulk actions cannot skip per-item validation.

### Story 6.7: Show Customer Shipment Progress

As a Customer,
I want to see Shipment progress and tracking evidence in my Account,
So that I know when my Order was dispatched and its latest delivery state.

**Acceptance Criteria:**

**Given** an owned Order with a Shipment
**When** the Account timeline loads
**Then** carrier, tracking code/link policy, dispatch time, normalized milestones, latest update time, and delivery state are shown
**And** internal provider evidence and restricted notes remain hidden.

**Given** tracking is delayed, unavailable, conflicting, or in exception
**When** the Customer views the timeline
**Then** the page distinguishes last-known evidence from current uncertainty and offers the approved support action
**And** it does not imply a delivery event that lacks evidence.

**Given** responsive, keyboard, screen-reader, and zoom tests
**When** the Shipment timeline is exercised
**Then** milestones, state changes, and support navigation are understandable without color or animation alone
**And** focus remains predictable after updates.

## Epic 7: After-Sales Resolution and Safety Holds

Customers and Operators can resolve cancellation, item-level returns, Refunds, and regulatory events under the policy accepted at purchase without duplicate financial or physical effects.

### Story 7.1: Evaluate Order Cancellation Eligibility

As a Customer or authorized Operator,
I want to know whether an Order or item can be canceled,
So that the request follows the accepted policy and current Fulfillment evidence.

**Acceptance Criteria:**

**Given** an Order and requested items/quantities
**When** cancellation eligibility is evaluated
**Then** Orders uses the immutable policy snapshot, Payment state, Fulfillment state, prior cancellations/Refunds, requester authority, and regulatory hold
**And** the outcome identifies auto-approve, Operator review, unavailable, or no-Refund cancellation with stable reasons.

**Given** Payment has not succeeded
**When** an eligible cancellation is requested
**Then** no Refund is due and reserved resources are marked for one release
**And** a duplicate request returns the same decision.

**Given** Shipment is Dispatched
**When** ordinary cancellation is requested
**Then** it is unavailable and the approved Return path after delivery or carrier exception is explained
**And** Fulfillment state is not rewritten.

### Story 7.2: Execute Approved Cancellation Once

As an Operations Operator,
I want approved cancellations applied consistently,
So that Order, Inventory, Fulfillment, promotion, and Refund effects occur once.

**Acceptance Criteria:**

**Given** an approved pre-fulfillment cancellation
**When** Orders applies it
**Then** eligible items enter Canceled, remaining work is blocked/canceled through owner commands, and Inventory/promotion holds release once
**And** unaffected Order Items retain their lifecycle.

**Given** Payment succeeded and an eligible Refund is due
**When** cancellation completes
**Then** Orders emits one canonical RefundApproval with source, reason, evidence, actor/authority, lines, and idempotency identity
**And** cancellation does not execute provider Refund directly.

**Given** the cancellation command is duplicated, stale, or conflicts with dispatch
**When** it is processed
**Then** the original result or stable conflict is returned
**And** no additional financial or physical effect occurs.

### Story 7.3: Submit an Item-level Return Request

As a Customer,
I want to request a return for selected delivered items,
So that my issue can be evaluated under the policy I accepted at purchase.

**Acceptance Criteria:**

**Given** an owned Order with fulfilled items
**When** the Customer selects items, quantities, reason, requested resolution, and allowed evidence
**Then** Returns validates the Order policy snapshot, delivery/exception time, eligible quantity, prior returns, and required fields
**And** requested quantity cannot exceed fulfilled quantity.

**Given** the request is eligible for review
**When** it is submitted
**Then** one Return Request enters Requested with immutable item/policy references and evidence
**And** a duplicate submission returns the original request.

**Given** the request is ineligible or incomplete
**When** submission is attempted
**Then** no Return Request is opened and an accessible reason/next action is returned
**And** support escalation remains available where policy permits.

### Story 7.4: Review and Decide a Return Request

As a Returns Operator,
I want to review Return Requests with complete Order and policy context,
So that approval or rejection is consistent and evidenced.

**Acceptance Criteria:**

**Given** a Requested Return
**When** an authorized Operator begins review
**Then** the request enters Under Review and shows immutable Order/item/policy snapshots, fulfillment evidence, Customer evidence, and prior related outcomes
**And** restricted data remains role-protected.

**Given** the Operator decides
**When** approval or rejection is submitted
**Then** decision, eligible quantities, return instructions, expected evidence, reason, actor, and time are required
**And** invalid or conflicting quantities and stale versions are rejected.

**Given** an approved Return requires physical receipt
**When** the decision completes
**Then** the request enters the approved In Transit or awaiting-receipt path
**And** no Refund is executed merely from approval unless the accepted policy explicitly permits it.

### Story 7.5: Receive and Dispose Returned Items

As a Returns Operator,
I want to record receipt and disposition of returned items,
So that stock, safety, and Refund eligibility reflect what was actually received.

**Acceptance Criteria:**

**Given** an Approved Return
**When** an allowed receipt is recorded
**Then** received item identity, quantity, condition, package/evidence, operator, and time are captured
**And** excess, mismatched, or damaged items enter an explicit exception.

**Given** received items
**When** disposition is chosen
**Then** restock, quarantine, destroy, supplier-return, or other approved outcome requires policy, reason, and evidence
**And** only Inventory may apply any resulting Stock adjustment.

**Given** return conditions satisfy the approved resolution
**When** disposition completes
**Then** Returns produces one canonical RefundApproval or nonfinancial closure outcome
**And** the Return lifecycle advances without directly mutating Payment or Finance.

### Story 7.6: Calculate and Reserve Refund Entitlement

As an Order service,
I want to convert approved outcomes into one immutable Refund instruction,
So that item, delivery, tax, and discount allocations cannot be recalculated inconsistently.

**Acceptance Criteria:**

**Given** an authorized RefundApproval from Returns, Orders cancellation, or Payment Reconciliation
**When** Orders evaluates it
**Then** immutable Order/policy snapshots determine eligible lines, delivery/tax/discount adjustments, currency, original financial references, prior Refund total, and maximum amount
**And** an unrecognized source or insufficient authority is rejected.

**Given** concurrent full or partial Refund approvals
**When** refundable entitlement is reserved
**Then** aggregate versioning or serialization prevents the total of refunded plus in-flight authorized value from exceeding eligible captured value
**And** each accepted approval produces one ApprovedRefundInstruction.

**Given** the same approval is replayed
**When** the request hash matches
**Then** the original instruction is returned
**And** a changed payload under the same identity produces a stable conflict.

### Story 7.7: Execute Refund and Post Financial Adjustment

As a Finance Operator,
I want an approved Refund executed and posted exactly once,
So that Customer money, settlement, ledger, and invoice evidence remain consistent.

**Acceptance Criteria:**

**Given** an ApprovedRefundInstruction and supported provider
**When** Payments executes it
**Then** the provider command uses the instruction identity and independently enforces captured minus refunded minus in-flight authorized as the cumulative cap
**And** callback, retry, or timeout cannot Refund twice.

**Given** a definitive provider Refund outcome
**When** Payments emits the FinancialFact
**Then** Finance posts the unique reversal/adjustment and any required invoice adjustment
**And** Order/Return status updates through versioned owner commands.

**Given** the outcome is ambiguous, failed, or conflicts with settlement
**When** recovery runs
**Then** the instruction enters a reconciliation exception without releasing entitlement prematurely
**And** the Customer sees a truthful pending/failure state rather than false completion.

### Story 7.8: Apply Regulatory Product and Order Holds

As an authorized Safety Operator,
I want to hold affected Products and unfulfilled Order Items,
So that a regulatory event stops new sales and dispatch while preserving existing agreements.

**Acceptance Criteria:**

**Given** credible withdrawal, recall, or safety evidence
**When** an authorized Operator commits a regulatory hold
**Then** Catalog Safety Denial activates synchronously for affected Products/Variants
**And** new publication, purchase, dispatch, and Product Notifications fail closed.

**Given** affected nonterminal Orders
**When** the hold is coordinated
**Then** each unfulfilled item enters explicit review/On Hold through owner commands
**And** immutable Order snapshots and already dispatched evidence are not rewritten.

**Given** the approved recall/hold SOP
**When** Operators resolve affected items
**Then** contact, cancellation, Return, Refund, disposal, authority, and closure actions remain item-specific and auditable
**And** releasing the hold requires authorized evidence and revalidation rather than a direct UI toggle.

### Story 7.9: Deliver Customer and Admin After-Sales Experiences

As a Customer or Returns Operator,
I want clear cancellation, Return, Refund, and hold workflows,
So that I can understand eligibility, evidence, progress, and next actions.

**Acceptance Criteria:**

**Given** approved Account and Admin UX specifications
**When** a Customer opens an eligible Order
**Then** available cancellation/Return actions, item quantities, policy summary, evidence upload, status timeline, Refund amount/status, and support path are accessible
**And** unavailable actions explain why without exposing internal-only data.

**Given** an Operator opens an after-sales queue
**When** requests, exceptions, or holds are listed
**Then** state, age, policy version, financial exposure, evidence completeness, assignment, and permitted commands are visible
**And** bulk operations cannot bypass item-level guards or separation of duties.

**Given** pending, rejected, approved, in-transit, received, dispositioned, refund-processing, refunded, failed, or held state
**When** either surface updates
**Then** the current authoritative state, update time, and next responsible party are announced clearly
**And** focus, responsive layout, zoom, and reduced-motion requirements remain satisfied.

## Epic 8: Customer Trust, Support, and Transactional Communication

Customers can request safe back-in-stock alerts, contribute moderated Reviews, report unsafe content, receive relevant transactional messages, and obtain support with controlled Order context.

### Story 8.1: Manage Back-in-stock Subscriptions Safely

As a Customer,
I want to subscribe to or revoke a Variant back-in-stock alert,
So that I am contacted only when the Product becomes both safe and available.

**Acceptance Criteria:**

**Given** an unavailable but subscription-eligible Variant
**When** a guest or Customer submits a supported destination and consent for this transactional purpose
**Then** Engagement creates or returns one deduplicated active subscription
**And** verification, expiry, privacy, and rate-limit rules apply.

**Given** an active subscription
**When** the Customer revokes it or its retention period expires
**Then** it becomes inactive and cannot trigger future messages
**And** the lifecycle change is auditable without retaining unnecessary destination data.

**Given** Stock becomes available
**When** a notification candidate is evaluated
**Then** current Safety Denial and PurchaseEligibility must also allow communication
**And** denial, timeout, or later unavailability suppresses the message.

**Given** the same recovery event is replayed
**When** notification candidates are generated
**Then** each eligible subscription produces at most one intended message
**And** duplicates cannot create duplicate delivery attempts.

### Story 8.2: Govern Transactional Notification Templates

As an Engagement Operator,
I want versioned transactional message templates,
So that Order, Payment, Shipment, Refund, and stock communications remain accurate and approved.

**Acceptance Criteria:**

**Given** a supported business event and channel
**When** a template is created or revised
**Then** purpose, locale, subject/title, structured body, required variables, prohibited variables, sender identity, approval state, effective interval, and version are validated
**And** transaction templates cannot include unapproved promotional claims.

**Given** a template references Product, Order, Payment, Shipment, Refund, or policy data
**When** preview and contract fixtures run
**Then** every variable has an authoritative source, safe fallback, escaping rule, and data classification
**And** payment secrets and health-sensitive behavior are prohibited.

**Given** an approved template is replaced or retired
**When** a message is rendered
**Then** the attempt records the exact template version used
**And** historical message evidence is not rewritten.

### Story 8.3: Deliver Transactional Notifications Idempotently

As a Customer,
I want timely and nonduplicated transactional notifications,
So that I can follow important commerce events without being treated as a marketing subscriber.

**Acceptance Criteria:**

**Given** an eligible Order, Payment, Shipment, Refund, or Back-in-stock business event
**When** Engagement creates a Notification
**Then** event identity, recipient, channel, template version, purpose, payload reference, and deduplication key are recorded
**And** transactional delivery does not require or imply marketing consent.

**Given** an LG-3-approved messaging adapter
**When** a delivery attempt executes
**Then** timeout, bounded retry, provider reference, response classification, next attempt, and terminal outcome are recorded
**And** replay cannot create an unintended duplicate message.

**Given** delivery is rejected, delayed, ambiguous, or permanently failed
**When** recovery evaluates it
**Then** the attempt remains visible in an exception/retry state with safe Operator action
**And** provider failure cannot erase prior evidence or block the authoritative commerce transition.

### Story 8.4: Submit Product Reviews with Allowed Media

As a Customer,
I want to submit a rating, text, and allowed media for a Product,
So that I can share a genuine experience under clear safety and moderation rules.

**Acceptance Criteria:**

**Given** a Customer and active Product
**When** a Review is submitted
**Then** rating bounds, text length/content rules, Product identity, Customer identity, disclosure/consent, and rate limits are validated
**And** the Review enters the configured moderation state rather than publishing through client choice.

**Given** Review media is uploaded
**When** Engagement processes it
**Then** private quarantine, size/type verification, magic-byte validation, malware scan, metadata handling, and safe derivative rules apply
**And** unsafe media never renders publicly.

**Given** the Customer edits or withdraws a Review where policy allows
**When** the command executes
**Then** a new moderated version or withdrawal state is created
**And** prior text is not silently rewritten by an Operator.

### Story 8.5: Moderate Reviews and Prove Verified Purchase

As a Review Moderator,
I want to approve, reject, or remove Reviews with evidence,
So that unsafe content is controlled without fabricating Customer speech or purchase status.

**Acceptance Criteria:**

**Given** a Review awaiting moderation
**When** the Moderator evaluates it
**Then** text/media, policy indicators, Product context, prior versions, reports, and permitted actions are visible
**And** the decision requires actor, reason, time, outcome, and correlation.

**Given** a verified-purchase label is evaluated
**When** Engagement queries Order evidence
**Then** the label appears only for an eligible fulfilled purchase by the reviewing Customer under the approved rule
**And** the public response reveals no Order details.

**Given** moderation changes publication state
**When** the decision commits
**Then** Discovery/Product Detail projections update through versioned events
**And** the original Customer text and evidence remain auditable.

### Story 8.6: Report Reviews under Abuse Controls

As a Customer,
I want to report a Review for policy or safety concerns,
So that harmful content can be examined without enabling report spam.

**Acceptance Criteria:**

**Given** a published Review
**When** a Customer submits a report category and allowed explanation
**Then** Engagement records one report per reporter/reason policy with time and Review version
**And** rate, automation, and duplicate-report controls apply.

**Given** a threshold or critical safety category is reached
**When** triage runs
**Then** the Review receives the approved visibility/review treatment and enters the moderation queue
**And** a report alone does not silently rewrite Customer text.

**Given** a Moderator resolves reports
**When** the decision is recorded
**Then** linked reports receive an evidenced outcome without exposing reporter identity publicly
**And** repeated abuse by a reporter or Review author follows a separate governed action.

### Story 8.7: Provide Restricted Order-linked Support Context

As a Customer Service Operator,
I want a limited Order-linked support workspace,
So that I can help Customers without accessing or mutating unrelated domain data.

**Acceptance Criteria:**

**Given** an authorized support actor and Customer/Order selector
**When** support context is requested
**Then** owner-approved summaries expose only necessary Order, Payment, Shipment, Return/Refund, Notification, policy, and prior-contact facts
**And** Finance internals, credentials, health-sensitive signals, and unrelated Customer records remain hidden.

**Given** the Operator adds an internal note
**When** it is saved
**Then** the note is restricted, purpose-bound, retained under policy, and linked to actor, subject, time, and correlation
**And** it never appears to the Customer.

**Given** support requests a cancellation, resend, correction, escalation, or other action
**When** it is initiated
**Then** a separate owner command enforces authorization, lifecycle, idempotency, reason, and audit
**And** editing a note cannot cause a business action.

### Story 8.8: Deliver Customer Trust and Support Experiences

As a Customer,
I want accessible Review, subscription, notification, and support controls,
So that I can participate and get help with clear privacy and status feedback.

**Acceptance Criteria:**

**Given** approved Product Detail and Account UX specifications
**When** Review and Back-in-stock controls render
**Then** eligibility, verification, moderation, consent purpose, media requirements, revoke/edit paths, and status are understandable
**And** controls remain keyboard-operable with visible focus and accessible errors.

**Given** transactional Notifications and support history
**When** the Customer opens Account
**Then** current purpose, delivery status, relevant commerce link, preference/revocation controls, and support entry are presented without exposing internal notes
**And** transactional and marketing purposes remain visually and structurally separate.

**Given** loading, duplicate, rate-limited, moderation-pending, rejected, delivery-failed, or system-error state
**When** it occurs
**Then** the interface announces a truthful state and safe next action
**And** responsive layout, zoom, reduced motion, and non-color status cues remain valid.

## Epic 9: Operational Insight and Organic Demand Validation

The Operator can connect qualified SEO acquisition to Product discovery and attributable Orders, then monitor repeat purchase, stock, fulfillment, reconciliation, Refund, and support outcomes through stable purpose-bound reports.

### Story 9.1: Build Purpose-bound Reporting Facts

As a Reporting Lead,
I want stable read-only reporting facts from domain owners,
So that analysis can evolve without becoming another source of commerce or financial truth.

**Acceptance Criteria:**

**Given** versioned owner events and approved queries
**When** Reporting consumes them
**Then** each fact records source owner, source identity/version, event/effective time, purpose, correlation, and projection version
**And** replay or reordering converges without duplicate measures.

**Given** a requested reporting field
**When** its purpose and data classification are evaluated
**Then** only necessary fields with accepted retention and access rules are admitted
**And** raw sensitive search/health behavior, credentials, and Payment account data are rejected.

**Given** Reporting differs from an owner or Finance ledger
**When** reconciliation detects the mismatch
**Then** the projection is rebuilt or an exception is raised
**And** Reporting cannot mutate owner state or overwrite ledger truth.

### Story 9.2: Measure Organic Acquisition and Purchase Funnel

As the Store Operator,
I want to measure qualified organic journeys from landing content to attributable Orders,
So that I can determine whether SEO creates useful demand rather than empty traffic.

**Acceptance Criteria:**

**Given** an approved attribution window and purpose
**When** a Customer moves through landing/Editorial, Product, Cart, Checkout, and Order events
**Then** Reporting computes qualified sessions, Editorial-to-Product progression, add-to-Cart, Checkout completion, attributable Orders, and conversion
**And** identity stitching respects consent, guest boundaries, minimization, and retention rules.

**Given** bots, internal traffic, duplicate events, canceled/failed Orders, or Refund policy exclusions
**When** funnel measures are calculated
**Then** documented qualification and exclusion rules apply consistently
**And** raw sessions cannot be presented as validated demand.

**Given** a metric definition or attribution rule changes
**When** a new version becomes effective
**Then** reports identify the definition/version and comparison limitations
**And** historical numbers are not silently recomputed as though definitions never changed.

### Story 9.3: Measure Product and Repeat-purchase Outcomes

As the Store Operator,
I want Product and repeat-purchase performance under stable definitions,
So that assortment and content decisions use commercial outcomes without unsafe profiling.

**Acceptance Criteria:**

**Given** Product, Order, Return/Refund, and Customer facts
**When** Product performance is calculated
**Then** views/progression where allowed, units, gross/net attributable value, cancellation, Return/Refund, and complaint context are available by approved dimensions
**And** withdrawn Products and historical snapshots remain distinguishable.

**Given** an eligible first-time Customer cohort
**When** 90-day repeat behavior is measured
**Then** cohort definition, minimum size, eligibility, second-Order rule, Refund/complaint countercheck, and observation completeness are explicit
**And** no sensitive health profile is created for advertising or recommendation.

**Given** fewer than 100 eligible Customers or an incomplete observation window
**When** the repeat report renders
**Then** it shows insufficient/preliminary evidence rather than claiming the 10% threshold passed or failed
**And** the underlying count remains privacy-protected.

### Story 9.4: Measure Operational Health

As an Operations Lead,
I want stable fulfillment, stock, reconciliation, Refund, and support measures,
So that bottlenecks and integrity risks become visible before they harm Customers.

**Acceptance Criteria:**

**Given** owner-approved operational facts
**When** reports calculate metrics
**Then** Order volume, fulfillment accuracy/time, cancellation rate, Refund cycle time, Stock accuracy, reconciliation exceptions/age, notification failure, and support burden use documented definitions
**And** each aggregate can trace to permitted source evidence.

**Given** a state is pending, held, exceptional, or incomplete
**When** the metric window closes
**Then** it is classified according to the definition rather than silently counted as success
**And** late-arriving facts update through versioned correction behavior.

**Given** a metric breaches an accepted operational threshold
**When** monitoring evaluates it
**Then** the responsible owner, affected scope, time window, and safe drill-down are available
**And** reports do not expose restricted Customer notes or financial internals.

### Story 9.5: Deliver Role-aware Dashboards and Exports

As an authorized Operator,
I want dashboards and exports appropriate to my role,
So that I can act on acquisition and operational evidence without receiving unrelated sensitive data.

**Acceptance Criteria:**

**Given** the approved Admin UX specification and an authenticated role
**When** a dashboard loads
**Then** permitted KPI definitions, time/filter context, freshness, comparison basis, uncertainty, and drill-down actions are visible
**And** unauthorized measures or dimensions are not returned by the server.

**Given** loading, no-data, preliminary, stale, partial, error, or threshold-breach state
**When** a report component renders
**Then** the state is distinguishable without color alone and offers the approved recovery/explanation
**And** charts have accessible tabular summaries and meaningful labels.

**Given** an authorized export request
**When** the asynchronous export runs
**Then** filter/definition versions, requestor, purpose, generated time, row count, integrity digest, expiry, and delivery status are recorded
**And** the private export is access-controlled, rate-limited, and retained only as required.

### Story 9.6: Evaluate Launch Success and Counter-metrics

As the Store Owner,
I want a decision view for compliance, purchase integrity, organic demand, and counter-metrics,
So that I can judge whether the MVP deserves continued investment without optimizing harmful proxies.

**Acceptance Criteria:**

**Given** sellable SKUs and governed pages
**When** launch readiness is evaluated
**Then** 100% CR-1/CR-2 SKU compliance, content-workflow completion, zero unresolved required gates, and replay evidence are shown
**And** a breach prevents the regulated launch-ready signal.

**Given** at least six months from indexation or available interim data
**When** organic demand is evaluated
**Then** attributable organic Orders/month, consecutive qualifying months, conversion, and compliance countercheck are calculated against the versioned SM-2 definition
**And** preliminary data is not presented as validation.

**Given** an eligible 90-day cohort of at least 100 Customers
**When** repeat behavior is evaluated
**Then** the >=10% threshold is counterchecked against Refund and complaint rates
**And** smaller/incomplete cohorts remain explicitly inconclusive.

**Given** traffic, content volume, conversion, or architecture activity rises
**When** qualified demand, compliance, Customer welfare, or operational integrity worsens
**Then** the decision view highlights the counter-metric conflict
**And** it cannot label the outcome successful from the proxy alone.
