# PRD Quality Review — Ecom

## Overall verdict

Ecom has a specific product thesis, unusually strong regulated-content and transaction-integrity safeguards, named journeys, stable requirement IDs, and useful testable consequences. It is not green-light ready: foundational launch choices remain open, the broad MVP is not prioritized against the one-Operator constraint or the unknown beachhead, and several success and production acceptance gates do not yet define a pass condition. The document is useful for bounded UX and architecture exploration, but unsafe as an unconditional build contract until the critical and high findings are closed.

## Decision-readiness — broken

The PRD states several consequential decisions clearly: one Legal Seller and Operator (§ 1), supplements rather than medicine (§ 6), a hosted/redirected Payment boundary (FR-25), and default-to-not-sellable compliance behavior (FR-10). It also names trade-offs such as "Expansion follows evidence" and "Independently deployed services are never a product goal by themselves" (§ 1).

However, the current draft leaves the product beachhead, commercial viability, operating model, launch providers, compliance ownership, policy approval, and production service levels unresolved. These questions determine whether the declared MVP can be bought, sold, operated, approved, and supported; they are not residual implementation details. CR-5 and CR-6 require named/actual approval, while § 10 still asks who owns it and what must receive sign-off.

### Findings

- **critical** Foundational launch contract is still open (§ 10 Open Questions 1–7; CR-5–CR-6) — The PRD still asks "Which supplement category and health need lead," what "sourcing, authenticity checks, margin threshold, return policy, and inventory process apply," which Payment/logistics providers launch, who owns regulatory review, and what production availability/latency conditions apply. Those answers control assortment, economics, policies, integrations, compliance release authority, and production acceptance. *Fix:* Mark these as phase-blocking decisions, assign an owner and closure artifact/date to each, and either resolve them before final status or explicitly carve the affected requirements out of the build-ready contract.

## Substance over theater — adequate

Most content is earned. The Vision is particular to governed SEO-led supplement commerce; Lan, Minh, and Viktor drive concrete Customer and Operator journeys; and the compliance and money-flow requirements use product-specific failure behavior rather than generic aspirations. The latest PRD also incorporates material reconciliation corrections: progressive disclosure (§ 5.3), Product/retention reporting (FR-46), evidence-gated expansion (§ 1), no-JavaScript content availability (NFR-3), capacity evidence (NFR-12), and platform-record cooperation (CR-9).

The weakest material is in NFR-4, NFR-6, and NFR-10, where phrases such as "current OWASP guidance," "circuit breakers where justified," and "structured logs, metrics, alerts" name good practice but not all of the evidence required to show this product is ready. That deficiency is captured under Done-ness rather than repeated here.

### Findings

No additional findings.

## Strategic coherence — thin

The thesis is coherent: governed education should generate qualified organic demand, while compliance capacity and stable operations constrain expansion. Counter-metrics are a genuine strength; SM-C1 through SM-C4 explicitly resist raw traffic, content volume, conversion-at-any-cost, and architecture theater.

The feature portfolio and proof model do not yet fully follow that thesis. The product admits that its initial need/segment is unknown, yet commits a wide storefront and operating surface without showing which capabilities are indispensable to the SEO-to-commerce experiment. Its primary demand metric establishes activity, not repeatability.

### Findings

- **high** MVP breadth is not sequenced by the stated evidence thesis (§ 1; § 7.1; § 9 "Operational overload") — The PRD says "Expansion follows evidence" and acknowledges that one Operator may be overwhelmed, with the mitigation "Prioritize core workflows and exception queues; defer breadth." Yet the same MVP unconditionally includes search and filters, coupons, related Products, cart merge, returns/refunds, Reviews, Back-in-stock Subscriptions, privacy workflows, and broad reporting. The reconciliation record also identifies much of this as candidate breadth that was promoted without cluster-level rationale. *Fix:* Rank feature clusters as launch-essential, evidence-triggered, or later; tie every launch-essential cluster to UJ-1/UJ-3/UJ-4/UJ-5 or a named compliance/operational gate; record the trade-off for promoted candidate clusters.
- **high** Success metrics do not prove the product's core claim (§ 1; SM-2; SM-4) — The Vision says the release "must prove" governed SEO can create qualified demand and that expansion requires "repeatable organic demand." SM-2 requires only a first attributable organic Order and "a monthly organic conversion baseline"; SM-4 asks merely to "measure" the funnel and repeat purchase. A first event and a baseline have no pass/fail threshold for repeatability or quality. *Fix:* Define a decision threshold and observation window for qualified organic conversion/repeat behavior, plus the minimum compliance and operating-health conditions under which the thesis counts as proven.

## Done-ness clarity — adequate

The 46 FRs are generally stronger than ordinary PRD requirements because each includes at least one observable consequence. Examples include "Duplicate notifications produce one outcome" (FR-28), "Refund cannot exceed eligible captured Payment" (FR-35), and publication blocking for unsupported claims (FR-5). Accessibility breakpoints, no-JavaScript content availability, payment scope, and zero duplicate money/Fulfillment outcomes also provide useful bounds.

Done-ness falls away around production qualities and lifecycle policies. Some of this is honestly marked open, but a downstream team still cannot produce final acceptance tests for those portions from the current PRD alone.

### Findings

- **high** Production NFR gates lack measurable pass conditions (§ 5.1 NFR-3, NFR-4, NFR-6–NFR-10, NFR-12; § 10 Questions 6–7) — The listing TTFB target remains "provisional," numerical RPO/RTO remain open, capacity must demonstrate "agreed service objectives," reliability uses "circuit breakers where justified," and security/observability mostly enumerate practices. Availability, load, percentile, geography, recovery objectives, alert coverage, audit-tamper evidence, and acceptance artifacts are not fixed. *Fix:* Add a production-readiness table with metric, threshold, workload/environment, evidence, owner, and blocking effect; where a value is deliberately deferred, state the exact approval gate that must set it.
- **high** Order/Fulfillment and policy-dependent requirements omit the normative state and policy contracts (§ 4.5 FR-30, FR-33–FR-35; § 10 Question 2) — FR-30 says Orders use "explicit states and transitions" and that invalid transitions fail, but the valid Order, Payment, and Fulfillment states/transitions are not named. Cancellation and Return eligibility depend on a policy snapshot while the return policy is still open. Teams cannot distinguish a correct transition or eligible outcome from an invalid one. *Fix:* Supply or link normative lifecycle/state tables and the launch cancellation/return decision table, including terminal, timeout, manual-review, regulatory-hold, partial-item, and retry behavior.

## Scope honesty — adequate

The PRD is candid about major exclusions and uses a real Non-Goals section: medicine, marketplace operation, health profiling, autonomous regulated publishing, public APIs, and infrastructure-as-maturity are explicitly outside MVP. It also centralizes twelve Open Questions and surfaces the unknown beachhead and one-Operator overload as risks rather than hiding them.

Scope is not strong because feature deferral is not operationalized and assumption provenance cannot be cleanly audited. The latter is recorded in Mechanical notes because it is primarily a roundtrip defect.

### Findings

- **medium** Conditional deferrals lack an accountable revisit rule (§ 7.2) — "Social login, phone OTP, live chat, Product comparison, and review helpfulness voting are deferred unless evidence makes one a launch blocker" is a real scope decision, but `[NOTE FOR PM]` does not name the owner, evidence threshold, or last responsible decision point. This permits silent scope re-entry. *Fix:* Add an owner, explicit trigger, and deadline/revisit gate for the deferred cluster; otherwise make the deferral unconditional for MVP.

## Downstream usability — adequate

This chain-top PRD is mostly extractable: UJ, FR, NFR, CR, and SM identifiers are contiguous; the eight journeys have named protagonists; feature groups point to journeys; and the glossary stabilizes most regulated-commerce nouns. The FR table structure is well suited to story decomposition.

Two capability areas do not carry enough source context into UX/stories, and one metric cross-reference is incomplete. These are bounded rather than systemic, so the dimension remains adequate.

### Findings

- **medium** "Basic account" is an undefined downstream container (§ 4.4 FR-20; § 5.3; UJ-1) — FR-20 only provides creation/access, while § 5.3 requires an Account page override and the product-brief reconciliation records intended Order history, saved addresses, and tracking. No journey or FR states which account jobs are MVP. UX and story generation can therefore invent incompatible Account scope. *Fix:* Define the account jobs and consequences explicitly (or remove Account as an MVP surface); distinguish them from guest Order access.
- **medium** Review requirements have no supporting journey and an inaccurate journey claim (§ 4.6; FR-37–FR-38; UJ-2, UJ-5, UJ-6) — The section says it realizes UJ-2, UJ-5, and UJ-6, but none describes submitting, moderating, displaying, or reporting a Review. "Allowed media," moderation outcomes, report resolution, and Customer visibility consequently have no narrated context. *Fix:* Add a compact named Review/moderation journey or defer Reviews; then map FR-37–FR-38 to it and define the visible outcomes.
- **low** Repeat-purchase metric cross-reference is incomplete (SM-4; FR-45–FR-46) — SM-4 includes repeat purchase but says only "Validates FR-45"; repeat-purchase reporting is in FR-46. *Fix:* Add FR-46 to the SM-4 validation reference.

## Shape fit — strong

The shape fits a consumer, meaningful-UX, multi-stakeholder regulated commerce product. Customer and Operator journeys are load-bearing rather than persona furniture; compliance, regulated content, Catalog, money, and fulfillment concerns receive dedicated capability clusters; and cross-cutting qualities sit outside the functional backlog. The document also avoids forcing architecture choices into product requirements and correctly retains a modular-monolith/evidence-driven evolution stance rather than prescribing microservices.

### Findings

No additional findings.

## Mechanical notes

- **ID continuity:** UJ-1–UJ-8, FR-1–FR-46, NFR-1–NFR-12, CR-1–CR-9, and SM-1–SM-7 are contiguous and unique. Counter-metrics use a distinct SM-C1–SM-C4 namespace.
- **Assumptions Index roundtrip:** The body has five substantive inline markers (FR-20, NFR-9, two bullets in § 7.1, and SM-2), while the index has A-1–A-8. Bare `[ASSUMPTION]` markers carry no A-ID, and A-1, A-2, and A-7 do not have explicit inline tagged counterparts, so the claimed roundtrip cannot be verified mechanically.
- **Glossary drift:** Capitalized domain terms including `Storefront`, `Payment Provider`, `Order Item`, `Review`, and `Content Workflow` are used normatively but are absent from the Glossary. `Content Workflow` is especially material because SM-1 requires all governed pages to "pass" it without defining that aggregate gate.
- **Cross-references:** Feature-to-UJ references resolve syntactically, but § 4.6 does not semantically support its Review requirements, and SM-4 omits FR-46 as noted above.
- **UJ protagonist naming:** All eight UJs have named protagonists (Lan, Minh, or Viktor).
- **Required shape:** Vision, users/jobs, named journeys, glossary, grouped FRs, NFRs, compliance requirements, Non-Goals, MVP scope, success and counter-metrics, risks, Open Questions, and an Assumptions Index are present for the stated launch/chain-top stakes.
