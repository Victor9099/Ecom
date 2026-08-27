# Good-Spine Review — Ecom

## Verdict

**Needs revision before handoff.** The spine now covers the final PRD well and fixes the real initiative-level divergence points across domain ownership, commerce state, compliance, privacy, finance, UX, release gates, and delivery sequencing. The deterministic lint passes with zero findings, and all eight prior PRD reconciliation gaps have landed. Three high-impact issues remain: the synchronous fail-closed rule conflicts with the spine's own at-least-once outbox invariant, the supposedly verified stack seed is stale and unsafe ahead of a scheduled critical Next.js release, and the live deployment/migration compatibility model is silent.

## Checklist judgments

| Checklist dimension | Judgment | Basis |
| --- | --- | --- |
| Real divergence points | **adequate** | AD-1–AD-21 capture most non-obvious ownership, consistency, release, privacy, finance, and UX choices; object storage and live rollout remain uncovered. |
| Enforceable ADs | **thin** | Most Rules are testable, but AD-7/AD-8 cannot both be satisfied under AD-4 as written, and AD-15 does not yet make several newer evidence/data-purpose rules executable. |
| Deferred safety | **adequate** | Providers, retention, broker/cache, replicas, future services, and UX specifications have sensible triggers; infrastructure/vendor deferral needs an earlier blocking decision point. |
| Current technology | **broken** | AD-17 calls the table a verified 2026-08-25 seed, but multiple versions are already behind supported patched releases, and the Next.js branch claim conflicts with the announced critical security release plan. |
| PRD coverage | **strong** | All eight earlier reconciliation gaps are substantively addressed; the fail-closed correction created the AD-4 conflict described below. |
| Inherited conflict | **n/a** | This is an initiative spine and declares no inherited parent spine. No inherited-AD conflict was found. |
| Owned dimensions | **thin** | Boundaries, data, contracts, runtime topology, environments, observability, recovery, and provider strategy are addressed; rolling deployment/schema compatibility and object-storage ownership are silent. |

## Findings

### 1. Fail-closed withdrawal contradicts the asynchronous consistency invariant

- **Severity:** high
- **Location:** AD-4, AD-7, AD-8
- **Evidence:** AD-4 requires the owner to commit state plus an outbox event and says delivery is "at least once." AD-7 says a regulatory withdrawal writes an "immediate fail-closed tombstone" across search results, counts, related Products, caches, and availability Notifications. AD-8 goes further: "Withdrawal synchronously fails closed through Content, Discovery, Storefront caches, links/CTAs, and Engagement availability Notifications."
- **Why it fails the checklist:** Content/Catalog, Discovery, Storefront caches, and Engagement are separate owners. At-least-once outbox delivery cannot guarantee synchronous cross-owner suppression without a second consistency mechanism. A builder must either violate AD-4 with direct/distributed writes or violate AD-7/AD-8 with a propagation window. The Rule therefore does not enforceably prevent the stated regulatory divergence.
- **Minimum correction:** Choose and state one compatible fail-closed mechanism. For example, give a single owner a synchronously queried denial/withdrawal authority used at every public visibility and Notification send boundary, while ordinary projections remain asynchronous; or define an acknowledged withdrawal process whose completion is not reported until every required suppression owner durably records the tombstone. Specify failure/timeout behavior and add a system test proving no public or Notification path bypasses it.

### 2. The "verified" stack seed is not current or security-safe

- **Severity:** high
- **Location:** AD-17; Stack; Deferred
- **Evidence:** The table pins Node.js 24.16.0, Next.js 16.2.11, NestJS 11.1.24, and Prisma 7.9.0, and AD-17 calls it "the verified 2026-08-25 cold-start seed." Official primary sources show:
  - Node.js lists **24.19.0** as Latest LTS; 24.17.0 was a security release that fixed multiple High CVEs, so 24.16.0 predates known security fixes. [Node.js releases](https://nodejs.org/en/about/previous-releases), [24.17.0 security release](https://nodejs.org/en/blog/release/v24.17.0)
  - Next.js announced an **August 26 critical security release for 16.3 and 15.5**, not a new 16.2.x patch. The spine nevertheless says to "re-pin to the patched 16.2.x release available at scaffold." [Next.js release notice](https://nextjs.org/blog)
  - NestJS lists **11.2.1** as latest, ahead of 11.1.24. [NestJS releases](https://github.com/nestjs/nest/releases)
  - Prisma released **7.9.1** after 7.9.0 to address a transitive security advisory. [Prisma releases](https://github.com/prisma/prisma/releases)
  - TypeScript **7.0.2** is stable; 6.0.3 may still be a defensible compatibility baseline because TypeScript 7.0 lacks the prior programmatic API, but that trade-off is not named. [TypeScript 7.0 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)
  - PostgreSQL 18.6 is current and correctly represented. [PostgreSQL release notes](https://www.postgresql.org/docs/release/)
- **Why it fails the checklist:** "Re-verify at scaffold" is a good safety rule, but it does not make a known-stale table verified-current today. The Next.js instruction is specifically unsafe: the announced critical fix targets a different active branch.
- **Minimum correction:** Do not finalize or scaffold the web runtime before the August 26 advisory publishes. Then pin the patched supported Next.js line named by the advisory, Node 24.19.0 or newer supported LTS patch, Prisma 7.9.1 or newer accepted stable patch, and a current compatible NestJS release. Record TypeScript 6 versus 7 as an explicit ecosystem/API compatibility decision and retain AD-17's lockfile re-verification rule.

### 3. Live deployment and database migration compatibility are undecided

- **Severity:** high
- **Location:** AD-12, AD-15, Consistency Conventions → Database, Structural Seed deployment paragraph
- **Evidence:** AD-12 says Storefront, Admin, API, and Worker share one compatibility version but "may scale independently." The deployment paragraph uses immutable stateless containers, and the database convention provides "one ordered migration pipeline." No Rule chooses rolling versus stop-the-world deployment, defines the overlap window between old/new API and Worker processes, constrains expand/contract migrations, or establishes rollback behavior after a schema/event/job change.
- **Why it fails the checklist:** Independent scaling guarantees version overlap during ordinary rolling replacement unless deployment is explicitly quiesced. Old workers can consume new outbox/job shapes or new code can meet an old schema. Two delivery units can choose incompatible migration order and rollback assumptions, especially dangerous for Payment, Refund, inventory reservation, and regulatory events.
- **Minimum correction:** Add a deployment-compatibility AD or explicit Deferred decision with a pre-deployment blocker. Choose either quiesced atomic releases or a compatibility window. For rolling releases, require expand/migrate/contract sequencing, backward-compatible event/job/API readers for at least one release, worker drain/lease rules, migration ownership, deploy order, health/rollback gates, and a rule that destructive contraction occurs only after old processes and messages are gone.

### 4. Object-storage ownership and lifecycle are silent

- **Severity:** medium
- **Location:** AD-1, AD-2, Bounded-Context Ownership, Structural Seed diagram/deployment paragraph
- **Evidence:** Catalog owns Product media and regulatory evidence, Content owns page evidence/versions, and Engagement owns Review media, while the topology exposes one generic Object storage capability. AD-2 protects only PostgreSQL tables and Prisma models. No invariant assigns object-key namespace, metadata, read authorization, immutability/versioning, deletion/hold behavior, or source-owner responsibility.
- **Why it fails the checklist:** Catalog, Content, Engagement, and Governance can independently choose incompatible shared buckets, mutable keys, public access, deletion behavior, and retention semantics. That can break CR-9 evidence holds, Content Version reproducibility, restricted moderation, and AD-20 privacy/authority workflows.
- **Minimum correction:** Extend ownership to object metadata and blobs: one source owner per object, owner-scoped opaque keys/namespaces, private-by-default access through owner ports, immutable/versioned regulatory evidence where required, and owner-handled erase/hold/export results coordinated through AD-20. Defer vendor/bucket layout, not ownership or lifecycle semantics.

### 5. AD-15 does not make the newer compliance and UX invariants executable

- **Severity:** medium
- **Location:** AD-13, AD-15, AD-18, AD-20, AD-21
- **Evidence:** AD-15 lists automated checks for imports, public contracts, tables, event schemas, adapter mutation, and provider replay. AD-18 depends on approved purpose/retention classes and purpose-allowed joins; AD-20 requires every owner to implement discover/export/correct/erase-or-anonymize/hold/evidence-result contracts; AD-21 says WCAG/contrast and keyboard evidence "participate in AD-13 and AD-15." AD-15 does not name a purpose registry/schema check, owner coverage check for Governance contracts, UI test/evidence manifest, or launch-gate evidence validation.
- **Why it fails the checklist:** The newer ADs state enforceable outcomes but leave independent teams free to define evidence formats, omit an owner's mandatory Governance contract, or claim tests outside a machine-verifiable gate. The "Architecture is executable" promise is therefore incomplete.
- **Minimum correction:** Define a versioned gate/evidence manifest and extend CI coverage: registered purpose/retention enums in analytics contracts, deny tests for prohibited joins/consumers, completeness tests for every AD-20 owner contract, WCAG/contrast/keyboard artifact checks for required routes, and validation that LG dependencies and evidence links exist before the corresponding release state.

### 6. Infrastructure deferral can be reached too late

- **Severity:** medium
- **Location:** Deferred — "Exact cloud, region, container platform... decide during LG-3/LG-5 costing"
- **Evidence:** The item defers cloud, region, container platform, managed PostgreSQL, object storage/CDN, secrets, backups, and telemetry together. LG-3 is the PRD's Payment/logistics provider gate; LG-5 blocks production approval, not the start of environment or CI/CD implementation.
- **Why it fails the checklist:** Two infrastructure units can begin staging, secrets, backup, or observability work using incompatible vendors/regions before the vaguely combined LG-3/LG-5 decision occurs. Exact vendors are safe to defer; the owner, required decision artifact, and last responsible moment are not.
- **Minimum correction:** Move infrastructure/vendor selection under an Architecture-owned LG-5 precursor and block environment-provisioning/CI-CD stories until an accepted deployment decision records cloud/region, runtime, managed-service classes, data-residency fit, backup/restore compatibility, cost envelope, and exit assumptions. Keep Payment/logistics provider selection under LG-3.

## Previous PRD reconciliation recheck

| Prior gap | Latest status | Evidence |
| --- | --- | --- |
| LG-1–LG-4 blocking effects absent | **resolved** | AD-13 now binds LG-1–LG-7 and preserves every gate's blocking effect. |
| Search stale/unowned | **covered, with new internal conflict** | AD-7 assigns Discovery and adds fail-closed tombstones; its synchronous guarantee conflicts with AD-4 as Finding 1 explains. |
| Sensitive data purpose boundary absent | **resolved** | AD-18 binds CR-7/FR-19/FR-43/FR-45 and denies advertising/audience/Product-selection reuse by default. |
| Payment/Ledger authority unresolved | **resolved** | AD-19 and Finance assign ledger, settlement, invoice, reversal, and accounting-export authority. |
| Release sequencing absent | **resolved** | AD-16 and the Capability Map preserve Launch-essential, Evidence-triggered follow-on, and Later behavior. |
| Authority-response owner absent | **resolved** | AD-20 assigns Governance coordination and mandatory owner-held evidence contracts. |
| Accessibility/responsive guardrails nominal | **resolved semantically** | AD-21 fixes semantic ownership, authority order, breakpoints, progressive enhancement, and required evidence; CI integration remains incomplete under Finding 5. |
| Restricted support-note owner absent | **resolved** | Engagement explicitly owns the restricted customer service note and support-note commands. |

## Mechanical and coverage notes

- `lint_spine.py` completed successfully with `total_findings: 0`: no placeholders, duplicate AD IDs, missing Binds/Prevents/Rule fields, or unpinned Stack entries.
- The design paradigm is named and consistently projected through ownership, contract, data, and structural seed sections.
- Deferred broker/cache, read-replica, provider, retention, future-service, and UX decisions have meaningful evidence or gate triggers.
- The environment set, managed-capability posture, recovery/observability evidence, and single-release-train position are present; the live rollout compatibility gap is narrower than a missing operational envelope, but still load-bearing.
- No parent/inherited spine is declared, so inherited-conflict review is not applicable.
