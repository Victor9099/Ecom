# Input Reconciliation — Final PRD vs Architecture Spine

## Sources

- **Input:** `_bmad-output/planning-artifacts/prds/prd-Ecom-2026-08-25/prd.md` (`status: final`)
- **Compared against:** `_bmad-output/planning-artifacts/architecture/architecture-Ecom-2026-08-25/ARCHITECTURE-SPINE.md` (`status: draft`)
- **Scope:** Load-bearing requirements, journeys, NFRs, compliance rules, launch gates, scope boundaries, and open architecture decisions only. This is reconciliation, not a general architecture review.

## Verdict

The spine preserves the central modular-monolith boundary model, separate commerce truths, immutable agreement snapshots, idempotent cross-module workflows, fail-closed regulated publication, hosted Payment boundary, server-side authorization/audit, operational evidence gates, and the MVP's anti-microservice scope. It is **not yet fully reconciled** with the final PRD: four high-impact gaps can produce behavior or release decisions that contradict the PRD, and four medium gaps leave independently built units without a unique contract.

The highest risks are that AD-13 operationalizes only LG-5–LG-7 despite the PRD requiring all seven launch gates, AD-7 permits stale search results where the PRD requires only sellable Products, and Reporting has no purpose boundary preventing sensitive health behavior from being reused for advertising. The PRD's Payment/Ledger ownership question also remains unanswered.

## Material gaps and contradictions

### 1. AD-13 drops the blocking effects of LG-1 through LG-4

- **Severity:** high
- **PRD evidence:** § 5.4 says "implementation cannot be called launch-ready until every gate has an accepted artifact." LG-1 blocks catalog seeding and the launch forecast; LG-2 blocks publication and Product sellability; LG-3 blocks provider-specific stories and production Checkout; LG-4 blocks end-to-end acceptance and production Orders.
- **Spine evidence:** Frontmatter claims `binds: [..., LG-1..LG-7]`, but AD-13 explicitly binds only `LG-5..LG-7`. Its Rule lists capacity, restore, replay, Order-to-Refund rehearsal, alerts, and security/privacy evidence, then calls that sufficient for "Production approval." AD-8, AD-9, and Deferred mention parts of LG-2/LG-3, but no rule requires the accepted LG-1–LG-4 artifacts before their PRD blocking effects lift.
- **Impact:** A delivery agent can follow the spine exactly and seed a catalog, publish/sell Products, implement provider stories, or approve production Orders without the PRD's assortment/economics, compliance, provider, and policy artifacts. This is a direct release-contract contradiction, not merely missing rationale.
- **Required disposition:** Make one executable release rule bind LG-1–LG-7 and preserve each gate's artifact and blocking effect. Operational evidence may remain grouped in AD-13, but LG-1–LG-4 must be referenced as mandatory predecessor gates for catalog seeding, publication/sellability, provider-specific Checkout, and production Orders.

### 2. The search projection can expose stale or regulatory-invalid Products

- **Severity:** high
- **PRD evidence:** FR-10 classifies missing, expired, suspended, withdrawn, or indeterminate evidence as not sellable; FR-13 says "Stock cannot make invalid evidence purchasable" and requires a refresh path; FR-16 says "Only sellable Products appear"; FR-17 requires filter counts and results to use the same sellability projection. UJ-7 requires emergency withdrawal to block new sales immediately.
- **Spine evidence:** AD-7 says search is an event-fed PostgreSQL projection and "Reads may be stale within an accepted projection SLO, but Checkout revalidates authoritative state." No projection SLO is defined in the PRD or spine. The Capability Map places the projection in a "Reporting adapter," but the ownership table has no Search owner and says Reporting owns acquisition and operational read models. AD-8 says invalidation events purge caches, but does not close the projection-delay window.
- **Impact:** Checkout revalidation prevents a completed invalid sale, but it does not satisfy the stronger PRD rule that an invalid Product must not appear in search/results or that an emergency withdrawal blocks promotion immediately. The undefined owner also conflicts with AD-1's "exactly one owning bounded context."
- **Required disposition:** Assign the search projection to one explicit owner and define fail-closed visibility behavior. At minimum, regulatory/sellability withdrawal needs an immediate tombstone/invalidation path that suppresses results and counts independently of ordinary projection lag; any tolerated non-safety staleness needs a named SLO accepted through LG-5.

### 3. Sensitive behavioral and query data has no architectural purpose boundary

- **Severity:** high
- **PRD evidence:** CR-7 says health-related behavior/history "cannot be repurposed for advertising without a validated lawful basis and explicit product decision"; FR-43 separates marketing and personalization purposes; FR-45 requires sensitive query text to be minimized and protected; FR-19 prohibits health-profile inference for recommendations. The Non-Goals also reject sensitive health profiles for advertising or automated Product selection.
- **Spine evidence:** AD-13 excludes payment and health-sensitive data only from "Logs and traces." Reporting owns acquisition/operational read models, Engagement owns Reviews/subscriptions/Notifications, and AD-7 defines search inputs, but no AD governs analytics-event minimization, purpose tagging, permitted joins, retention, or denial of Reporting/Engagement data reuse for advertising and recommendation.
- **Impact:** Modules can comply with every stated architecture rule while combining search, content, Product, Order, and repeat-purchase behavior into a health-interest profile or advertising audience. That violates a load-bearing compliance and product boundary.
- **Required disposition:** Add a binding sensitive-data/use-purpose invariant covering analytics and read models, not only telemetry. It should define minimization/redaction at event creation, purpose metadata, permitted consumers/joins, retention/erasure propagation, and a deny-by-default rule for advertising or Product-selection use unless Governance supplies the validated lawful basis and recorded product decision.

### 4. Payment/Ledger authority remains unresolved

- **Severity:** high
- **PRD evidence:** FR-46 says operational reports "do not replace the financial ledger as the authoritative record." § 10.2 explicitly asks Architecture to settle domain ownership for "Payment/Ledger." FR-29 requires reconciliation of provider settlement evidence with internal Payment and Order records.
- **Spine evidence:** AD-5 assigns provider evidence, Payment state, Reconciliation, and Refund execution to Payments. The ownership table says Payments publishes "financial events" and Reporting has read-only reports/exports, but no Ledger context, external accounting-system port, or deferred Ledger decision exists. Nothing identifies which record is the authoritative financial ledger or how reconciliation entries reach it.
- **Impact:** Independently built Payments, Reporting, and accounting/export work can each treat a different record as financial truth, undermining Reconciliation, Refund/accounting treatment, invoice/policy work, and FR-46's explicit authority boundary.
- **Required disposition:** Decide or explicitly defer with a blocking trigger whether the launch ledger is an external accounting system or an internal owned context. Define the authoritative record, Payments-to-Ledger contract, posting/reversal/idempotency semantics, settlement reconciliation boundary, and what Reporting may copy but never own.

### 5. PRD release sequencing is absent from the build substrate

- **Severity:** medium
- **PRD evidence:** § 7.3 distinguishes Launch-essential work from "Evidence-triggered MVP follow-on" capabilities and says coupons, related Products, account history, Reviews, Back-in-stock Subscription, enriched filters, and self-service returns "may not delay the first controlled sale unless LG-4 requires them." Later items require a new scope decision and are "not inherited automatically by Architecture or stories."
- **Spine evidence:** Frontmatter binds FR-1–FR-46 as one set; the Capability Map treats every functional cluster equivalently; AD-16 governs agent work but contains no release-class or first-controlled-sale constraint. Deferred correctly preserves the Later exclusions but says nothing about evidence-triggered follow-ons.
- **Impact:** Story decomposition from the spine can schedule Engagement, promotions, enriched discovery, and self-service returns as co-equal launch work, recreating the one-Operator overload and delaying the thesis test the PRD explicitly protects.
- **Required disposition:** Carry the three PRD release classes into the Capability Map or an agent-work rule. Scaffolding a later-needed boundary may be acceptable, but feature-complete follow-on implementation must require the PRD evidence trigger and cannot gate the first controlled sale except through LG-4.

### 6. Authority-response evidence has no cross-module owner or export contract

- **Severity:** medium
- **PRD evidence:** CR-9 requires retention of seller, Product, transaction, complaint, moderation, and policy evidence and support for authorized competent-authority requests "under an audited procedure." LG-4 requires an authority-response policy; § 10.1 leaves exact retention periods and procedures to LG-2/LG-4.
- **Spine evidence:** AD-2 makes each module's data private and forbids direct cross-module reads. Governance owns Audit Entry/Legal Policy Version/privacy requests; Reporting owns read-only exports. Deferred covers only retention periods/archive tiers. No context owns an authority-response case, legal hold, scoped evidence manifest, approval, or audited export assembled across Catalog, Orders, Payments, Engagement, and Governance.
- **Impact:** Accepting the LG-4 policy still leaves builders free to create incompatible or unauthorized cross-module extraction paths, or no workable path at all, for a mandatory legal operation.
- **Required disposition:** Name one owner for authority-response cases and a contract for authorized evidence collection/export from each source owner. Preserve source ownership, access approval, request scope, legal hold/retention override, export manifest/integrity, and Audit History; keep exact periods deferred to LG-2/LG-4.

### 7. Accessibility, responsive semantics, and interaction guardrails are only nominally bound

- **Severity:** medium
- **PRD evidence:** NFR-1 requires applicable WCAG 2.2 AA; NFR-2 fixes four responsive widths; § 5.3 requires page overrides before implementation, progressive disclosure, one semantic content source across breakpoints, and rejection of dark patterns, hidden terms, unlabeled advertising, and inaccessible icon-only controls.
- **Spine evidence:** The Capability Map groups `NFR-1..NFR-12` under AD-12, AD-13, AD-15, and AD-17, but none of those rules states an accessibility, semantic-source, or responsive-test invariant. The Structural Seed comments that `packages/ui` contains "accessible visual primitives," and Deferred assigns page overrides to UX before implementation, but no executable acceptance rule binds independently built Storefront/Admin slices to the PRD outcomes.
- **Impact:** Teams can conform structurally while diverging on server-rendered semantics, breakpoint behavior, keyboard/focus/error contracts, or unsafe interaction patterns. A shared component package alone does not enforce page/journey conformance.
- **Required disposition:** Add a UI-surface invariant or an explicit binding UX companion contract: one semantic source, progressive enhancement/no-JS indexed content, required page overrides, WCAG/responsive automated checks plus journey-level evidence, and no weakening of the PRD's disclosure/anti-dark-pattern rules.

### 8. Restricted customer-service notes do not have one owner

- **Severity:** medium
- **PRD evidence:** FR-39 requires restricted Order-linked customer service notes, guarantees they never appear to Customers, and requires support-triggered actions to remain separate audited commands.
- **Spine evidence:** The Capability Map places "Reviews, support, Notifications, FR-37..FR-40" in Engagement and Orders. The ownership table gives Engagement ownership of Review, Back-in-stock Subscription, Notification template/attempt and gives Orders ownership of Order snapshots; neither owns the customer-service note. AD-1 nevertheless requires exactly one owner per business concept.
- **Impact:** Two modules can independently store support notes or expose different access/mutation paths, weakening confidentiality and the audited-command boundary.
- **Required disposition:** Assign customer-service notes to exactly one context and define its Order-context query, restricted authorization, retention, audit event, and command contract. Other modules should receive only the minimal published fact they require.

## Confirmed as preserved

- **Product and deployment boundary:** The frontmatter scope and Deferred section preserve the Vietnam-first single Store, supplement-only MVP, and exclusion of marketplace, multi-warehouse, medicine, public API, dedicated search, data warehouse, and independent services. AD-12/AD-14 preserve "service count is not maturity."
- **Commerce truth and journeys:** AD-3 through AD-6 and the ownership table preserve UJ-1/UJ-5/UJ-6/UJ-7, FR-12, FR-22–FR-36, the PRD § 4.5.1 state separation, immutable snapshots, reservation ownership, idempotency, and separate Order/Payment/Inventory/Fulfillment/Return truths.
- **Regulated content and Catalog:** AD-8 preserves UJ-3/UJ-4, FR-1–FR-11, CR-1–CR-6, human-gated publication, evidence ownership, published versions, no-JavaScript SEO content, and invalidation of affected caches.
- **Provider and Payment security:** AD-9/AD-10 preserve hosted or redirected Payment UI, verified server-to-server evidence, browser-return non-authority, signature/replay/idempotency controls, and exclusion of account data from storage/logs/analytics. Exact providers correctly remain behind LG-3.
- **Authorization, audit, privacy workflow:** AD-11 makes authorization server-side, separates Governance audit evidence from source mutation, and carries actor/reason/outcome/correlation fields. The sensitive-data use-purpose gap above is narrower than this preserved control.
- **Operational NFR evidence:** AD-13, AD-15, the Structural Seed, and deployment envelope preserve capacity, restore, provider replay, Order-to-Refund rehearsal, observability/redaction, boundary testing, production-like environments, and evidence-led release for LG-5–LG-7.
- **Open architecture choices:** The Stack resolves the application-stack question; bounded-context ownership settles Product/Offer, Stock Position, and Order/Fulfillment. Exact infrastructure and provider vendors, retention periods, page-level UX overrides, and future service extraction are explicitly deferred with reasonable triggers. Payment/Ledger is the remaining ownership exception.
