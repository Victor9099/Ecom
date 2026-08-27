# Input Reconciliation: Product Brief Addendum vs PRD

**Source:** `briefs/brief-Ecom-2026-08-25/addendum.md`  
**Compared with:** `prds/prd-Ecom-2026-08-25/prd.md`  
**Purpose:** Finalize-time source reconciliation only; this file does not modify or approve the PRD.

## Verdict

The PRD preserves the addendum's central product boundary and most of its regulatory safeguards: supplement-only MVP, launch-critical SEO/CMS, SKU evidence and claim gates, advertising separation, human approval, payment callback integrity, privacy controls, and architecture questions. The meaningful reconciliation work is primarily about **status and closure evidence**, not lost product intent. Candidate features and provisional NFRs have sometimes become firm MVP requirements without a visible decision trail, one scope statement is internally contradictory, and a few legal/operational gates are not stated strongly enough to close before launch.

## Material Gaps or Distortions

### 1. Candidate breadth is promoted to MVP without preserving its candidate status

The addendum explicitly labels all of “Functional Breadth Supplied During Discovery” as candidate inventory that still requires prioritization. The PRD makes many of those items unconditional MVP requirements, including typo-tolerant search and autocomplete (FR-16), coupons and featured collections (FR-18), related-product recommendations (FR-19), cart merge (FR-21), returns/refunds (FR-33–FR-35), reviews with media/helpfulness voting (FR-37–FR-38), back-in-stock notifications (FR-14/FR-40), and broad reporting (FR-45–FR-46).

This may be a valid later product decision, but the addendum alone does not support the status change. Before finalization, each promoted cluster needs either a recorded MVP decision or a move to later scope. The strongest direct contradiction is **FR-38**, which commits helpfulness voting, while §7.2 says “rich review voting may be deferred.” An item cannot simultaneously be an unconditional functional requirement and a deferrable out-of-scope candidate.

### 2. Provisional NFR inputs are partly treated as settled, while acceptance evidence remains underspecified

The addendum marks NFR targets provisional and explicitly requires measurement conditions and acceptance evidence. The PRD correctly preserves the listing TTFB target as provisional (NFR-3/Open Question 7) and keeps RPO/RTO open (NFR-9/Open Question 6). Other NFRs are promoted to firm requirements without equivalent acceptance criteria: “current OWASP guidance” and “strong password hashing” (NFR-4), circuit breakers “where justified” (NFR-6), tamper-evident audit history (NFR-7), and production observability (NFR-10) lack named verification evidence or thresholds.

The addendum's scalability concern is also not represented as a product-level outcome. Its implementation suggestions—stateless nodes and a measured path to read replicas—can properly remain in the addendum/architecture, but the PRD should either define a measurable launch/load objective or explicitly defer scalability acceptance. NFR-11 addresses modular extraction, not capacity or scale behavior.

### 3. Current e-commerce compliance implications are only partially translated into requirements

The PRD strongly covers regulated content, SKU evidence, seller/policy versioning, complaints, reviews, auditability, privacy, invoice baseline, and regulatory watch. It does not explicitly translate the addendum's current e-commerce-law implications for **required information retention** and **cooperation with competent authorities**. Privacy retention in FR-43 is not necessarily the same obligation, and order snapshots/audit history do not define retention scope, period, retrieval, hold, or disclosure controls.

Because the MVP is a single Legal Seller rather than a marketplace, multi-seller verification duties can remain outside MVP. However, the applicable single-seller/platform retention and cooperation obligations need either concrete requirements or a legal determination that they are fully satisfied by FR-42–FR-44 and existing operational procedures.

### 4. Several addendum gates are referenced but not expressed as closable finalization gates

CR-5, CR-6, the regulatory-change risk, and Open Questions 4–5 preserve the intent of counsel/SKU/template review, but the PRD does not define the release evidence needed to close them: named approver, approval artifact, scope, review date, expiry/review cadence, and blocking effect. The addendum says counsel/SKU/template review is required before go-live; finalization should not turn that into a general future concern.

The addendum's remaining open decisions are mostly carried forward, but the **fulfillment model** is not explicitly asked in Open Questions 2–3, and the source's citation-cleanup gate for unresolved labels `[web:7]`, `[web:9]`, and `[web:13]` is absent. The labels should be traced to their originating artifact and replaced with authoritative evidence or formally discarded before the regulatory evidence pack is treated as closed.

## Correctly Preserved or Appropriately Externalized

- The supplement-only MVP and medicine/pharmacy deferral are clear in Vision, Non-Goals, and MVP Scope. Medicine-specific licensing and consultation detail appropriately remains downstream rather than becoming an MVP requirement.
- Blog/CMS as a launch acquisition capability is fully represented by UJ-1/UJ-3, FR-1–FR-7, discovery requirements, and organic-demand metrics.
- The addendum's regulatory content controls are substantially preserved: classification source, document validity, Approved Claims, Disclaimer, advertising markers, provenance, review workflow, expiry/withdrawal, link checks, immutable versions, human approval, and emergency holds.
- Payment evidence implications are preserved in FR-25 and FR-27–FR-29 plus NFR-5/NFR-6: hosted payment scope reduction, no card data in Ecom, authenticated notifications, idempotency, authoritative status, refunds, and reconciliation.
- Domain entities are not mistaken for authoritative aggregates. Open Question 11 retains Product/Offer, Stock Position, Order/Fulfillment, and Payment/Ledger decisions for Architecture. The modular-monolith, strangler, hashing, CDN, SSR/ISR, stateless-node, and read-replica details appropriately stay outside the capability-oriented PRD.
- The listing-latency definition, RPO/RTO, regulatory owner/cadence, payment/logistics selection, return/inventory policy, brand status, and implementation stack remain visibly open.

## Recommended Finalization Disposition

1. Confirm or defer each candidate feature cluster that the PRD promoted to MVP; resolve FR-38 versus §7.2 explicitly.
2. Add acceptance evidence or explicit deferral for security, reliability, auditability, observability, scalability, availability, RPO/RTO, and listing latency.
3. Obtain a legal determination for e-commerce retention and authority-cooperation duties and translate any applicable duties into testable requirements/operating controls.
4. Convert counsel, per-SKU, and per-template review into a release checklist with owner and evidence; close the fulfillment-model and unresolved-citation items.

Until those items are resolved or deliberately deferred with owner and revisit condition, the PRD is directionally reconciled but not fully closure-ready.
