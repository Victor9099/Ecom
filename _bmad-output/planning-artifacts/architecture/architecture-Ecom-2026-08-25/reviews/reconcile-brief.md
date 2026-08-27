# Input Reconciliation: Product Brief and Addendum vs Architecture Spine

**Sources reviewed**

- `briefs/brief-Ecom-2026-08-25/brief.md` (`status: final`)
- `briefs/brief-Ecom-2026-08-25/addendum.md`
- `architecture/architecture-Ecom-2026-08-25/ARCHITECTURE-SPINE.md` (`status: draft`)

**Scope:** Architecture-input reconciliation only. This review does not validate the cited laws, reopen product scope, or edit the spine.

## Verdict

**Needs reconciliation before the spine is final.** The spine preserves the major direction—DDD modular monolith, private module data, distinct commerce truths, fail-closed publication, idempotent provider handling, evidence-led extraction, and a supplement-only single-store MVP. However, several quiet regulatory and future-evolution constraints stop at feature language and do not become cross-context invariants. Four ownership/seam gaps are material enough that independently built modules could make incompatible choices: regulated publication dependencies, privacy/authority-response orchestration, Legal Seller/marketplace evolution, and invoice/ledger ownership.

## Findings

### 1. High — Privacy, retention, and authority-response workflows have no enforceable cross-module contract

**Source constraint:** The Addendum's “Current Compliance Baseline — Vietnam Launch” calls for data classification, data-subject workflows, retention/deletion rules, processor records, cross-border transfer assessments, legally required information retention, and cooperation with competent authorities. The final Brief also promises control over customer data.

**Spine state:** AD-2 makes each module's data private. AD-11 says Governance stores privacy workflows but cannot mutate another module's record. The ownership table gives Governance consent and privacy requests, while the Deferred section postpones only retention periods and archive tiers.

**Gap/contradiction:** The privacy coordinator is prohibited from directly changing owned records, but the spine does not require each owner to expose classification, discovery/export, correction, deletion/anonymization, retention-hold, or evidence-return contracts. Processor/transfer records and audited authority-response exports have no owner. A team can comply with AD-2 and AD-11 yet build a privacy request that cannot complete across Identity, Orders, Engagement, Reporting, and provider-held data.

**Required reconciliation:** Fix an invariant that Governance coordinates but every data-owning module must publish privacy/retention commands and evidence contracts; name ownership for processor/transfer registers and authority requests; define how legal retention or holds override deletion without silently abandoning the request.

### 2. High — The regulated-publication seam is too weak for the Brief's content controls

**Source constraint:** The Addendum requires approved-claim and Disclaimer controls, editorial-versus-advertising markers, reviewer/byline/source metadata, human approval, scheduled expiration, emergency unpublishing, link/CTA checks, immutable versions, and a ban on AI auto-publishing health claims. Product-document or claim invalidation must prevent publication or sale.

**Spine state:** AD-8 assigns Product claims/evidence to Catalog and pages to Content, requires an approved workflow result, uses published versions, and purges caches on invalidation.

**Gap:** AD-8 does not bind the cross-context dependency contract: how a Content Version records the exact Catalog evidence/claim/Disclaimer versions it used, who owns advertising classification and required markers, whether approval must be human, or how document/claim withdrawal forces dependent pages, CTAs, search entries, and caches out of circulation. “Approved workflow result” is broad enough for incompatible implementations, including an automated approver or a page that remains public after its referenced claim is withdrawn.

**Required reconciliation:** Add a narrow publication invariant covering immutable dependency references, human authorization for regulated approval, required Disclaimer/advertising metadata, and fail-closed propagation from withdrawn evidence or claims to Content, Storefront, search, and caches. Detailed screens and workflow steps can remain outside the spine.

### 3. High — Legal Seller and marketplace evolution are not preserved as a domain seam

**Source constraint:** The final Brief requires a single Legal Seller now but says later multi-vendor expansion must not force replatforming. The Addendum explicitly says marketplace support must not be reduced to a shared `seller_id` convention.

**Spine state:** Product and Offer are correctly separated between Catalog and Pricing, and marketplace scope is deferred. However, no context owns Legal Seller, merchant identity, seller verification, or the relationship between a merchant and an Offer. Orders owns an unspecified commercial snapshot; Identity owns Users and roles.

**Gap:** This leaves builders free to encode the MVP seller as a global constant, an Operator/User role, a field inside Pricing, or a generic `seller_id`. Each complies with the written spine but creates a different migration path. Deferring marketplace functionality does not preserve the business boundary required by the Brief.

**Required reconciliation:** Name the MVP owner and contract for Legal Seller identity and require Orders/invoices to snapshot that legal party. State that Offer ownership is party-based and must not infer a future marketplace boundary from User or a shared `seller_id`; leave seller onboarding, KYC, liability, commissions, and settlement behavior deferred.

### 4. High — Payment versus Ledger/Settlement and electronic-invoice ownership remains unresolved

**Source constraint:** The Addendum explicitly requires Architecture to resolve Payment versus Ledger/Settlement before schema work. It separately identifies current electronic-invoice obligations and warns against an obsolete regulatory baseline. The final Brief expects reliable payment reconciliation and commercially durable history.

**Spine state:** Payments owns provider evidence, reconciliation entries, and Refund execution; Orders owns commercial snapshots; Governance owns Legal Policy Version. No context owns invoice issuance/configuration, invoice evidence, accounting export, ledger entries, liabilities, or settlement. Ledger/Settlement is not listed as deferred.

**Gap:** AD-1 requires one owner per concept, but the fiscal and accounting concepts most likely to be split across Orders, Payments, Reporting, and Governance are silent. “Reconciliation entry” can also be mistaken for ledger truth, which the Brief/Addendum deliberately keep separable.

**Required reconciliation:** Decide the MVP owner and published contract for invoice facts/evidence and state whether financial ledger and settlement are explicitly deferred domains. Keep Payment/provider reconciliation non-ledger unless a later decision promotes it; preserve immutable links among Order, Payment, Refund, Legal Seller, and invoice evidence.

### 5. High — Regulatory withdrawal does not clearly override ordinary projection staleness or notification timing

**Source constraint:** The Addendum requires emergency unpublishing and link/CTA checks. The Brief's Back-in-stock Subscription and trusted discovery promise imply that a Product becomes discoverable or notifiable only when both regulatory sellability and stock permit it.

**Spine state:** AD-7 permits stale search reads within an accepted SLO and relies on Checkout revalidation. AD-8 says invalidation events purge affected caches. Engagement owns Back-in-stock Subscriptions and notification attempts, while the capability map links Reviews/support/Notifications only to Engagement and Orders.

**Gap:** Checkout revalidation prevents a sale but does not prevent withdrawn Product promotion, stale regulated claims, or a Back-in-stock message triggered solely by Inventory. The spine does not say that regulatory invalidation has stricter precedence than ordinary price/stock projection staleness, nor that Engagement consumes a combined sellability-and-stock fact.

**Required reconciliation:** State that regulatory withdrawal bypasses the normal projection-staleness allowance and fails closed across Content, search, related Products, caches, and outbound notifications. Define one owned combined-availability projection/event for discovery and Back-in-stock, while Checkout continues to revalidate authoritative owners.

### 6. Medium — The stated Search extraction path is not cleanly represented

**Source constraint:** The Addendum calls for measurable strangler paths for Search, Payments, and Inventory; the final Brief rejects service count as a maturity measure.

**Spine state:** AD-7 describes Search as a disposable PostgreSQL projection. The Capability Map places that projection in a “Reporting adapter,” while Reporting owns acquisition and operational read models. AD-14 then names Search as the first extraction candidate even though extraction is said to be bottleneck-led.

**Gap/contradiction:** Search has no unambiguous owner or port: it is simultaneously a storefront-critical read model, a Reporting adapter, and a future extraction target. Predetermining “Search, then Payments, then Inventory” also weakens the stated evidence-first rule; the Addendum names candidates, not an order.

**Required reconciliation:** Give the discovery/search projection an explicit owned contract separate from analytics reporting, even if both use PostgreSQL in MVP. Treat all three extraction candidates as unordered until an accepted bottleneck record selects one.

### 7. Medium — Candidate capabilities and operational complexity are hardened without an explicit status decision

**Source constraint:** The final Brief excludes a public developer platform and independently deployed microservices and prioritizes low operating burden. The Addendum labels multichannel notifications, asynchronous jobs, and API caching as candidate breadth rather than committed MVP capability.

**Spine state:** AD-10 binds “public HTTP surfaces” to `/api/v1` and OpenAPI; AD-9 names SMS integrations; AD-12 and the Stack/Topology seed API and Worker processes plus Redis/BullMQ as independently scalable runtime pieces.

**Gap/possible contradiction:** “Public HTTP surfaces” can be read as the explicitly excluded public developer API. SMS is treated as a committed provider seam despite no selected launch channel. Redis/BullMQ and four deployable processes may be justified by outbox, scheduling, and provider work, but the spine does not reconcile that fixed operating surface with the Brief's simplicity constraint or the candidate status of asynchronous platform breadth.

**Required reconciliation:** Clarify that `/api/v1` and OpenAPI govern application-facing interfaces, not a public developer product. Keep notification channels provider-neutral until LG-3. Record why Redis/BullMQ and the separate Worker are mandatory launch seed, or defer them behind a simpler job/outbox implementation if evidence does not require them.

### 8. Medium — Stateless scaling and the read-replica path are neither decided nor deferred

**Source constraint:** The Addendum's provisional NFR direction calls for stateless application nodes and a measured path to read replicas rather than mandatory day-one replicas.

**Spine state:** AD-12 permits processes to scale independently, and AD-13 requires capacity evidence. Neither rule requires stateless processes or defines a future read-only routing seam. The Deferred list does not name this open architecture direction.

**Gap:** “May scale independently” does not prevent session, scheduler, or local job state from making horizontal scaling unsafe. A later read replica can also become a cross-module query shortcut unless its allowed use is reconciled with AD-2 and authoritative-command rules.

**Required reconciliation:** Decide or explicitly defer statelessness and replica routing. If preserved, restrict replicas to owned/derived reads with bounded staleness; authoritative commands and Checkout validation must remain on owner truth.

### 9. Low — The Addendum is not listed as a spine source

**Source constraint:** The Addendum declares Architecture as the primary consumer for domain hypotheses and contains the architecture directions and regulatory evidence above.

**Spine state:** Frontmatter lists the PRD, final Brief, and design system, but not the Addendum.

**Gap:** This weakens provenance and makes later maintainers less likely to revisit dated regulatory evidence, candidate status, or unresolved ownership questions when updating an AD.

**Required reconciliation:** Add the Addendum to source provenance when the spine is next edited; continue treating its regulatory citations as dated evidence requiring counsel review, not as architectural legal approval.

## Correctly Preserved

- Supplement-only, one-store, one-inventory-location MVP; marketplace, medicine, multi-warehouse, and public developer platform remain outside launch scope.
- DDD modular monolith, module-owned data/contracts, and strangler-compatible events align with the Addendum's architecture direction.
- Product versus Offer, Variant versus Stock Position, and Order versus Fulfillment are materially separated.
- Orders, Payments, Inventory, Fulfillment, and Returns remain distinct truths, with idempotent commands and provider replay defenses.
- Browser returns are non-authoritative; server evidence, reconciliation, Refund bounds, and prohibited card-data handling are preserved.
- Content/Catalog fail-closed intent, immutable versions, audit facts, cache invalidation, accessibility source, provisional brand, and evidence-gated production are represented.
- Exact providers, cloud vendor, retention periods, marketplace, medicine, multi-region, page overrides, and final brand tokens are properly deferred.

## Reconciliation Gate

Before final status, resolve Findings 1–5 as explicit invariants or explicit deferred ownership decisions with revisit conditions. Findings 6–8 require clarification so the build seed does not silently commit an incompatible boundary or operating model. Finding 9 is provenance hygiene but should be corrected during the same finalization pass.
