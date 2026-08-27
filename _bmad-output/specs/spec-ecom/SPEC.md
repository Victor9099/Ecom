---
id: SPEC-ecom
companions:
  - requirements-map.md
  - ../../planning-artifacts/architecture/architecture-Ecom-2026-08-25/ARCHITECTURE-SPINE.md
  - ../../planning-artifacts/architecture/architecture-Ecom-2026-08-25/DELIVERY-TOPOLOGY.md
  - ../../../design-system/ecom/MASTER.md
sources:
  - ../../planning-artifacts/briefs/brief-Ecom-2026-08-25/brief.md
  - ../../planning-artifacts/prds/prd-Ecom-2026-08-25/prd.md
---

> **Canonical contract.** This SPEC and the files in companions are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability; downstream work reads the companions, not the source narratives.

# Ecom Regulated Health-Supplement Commerce Platform

## Why

Ecom realizes the vision of an owner-operated Vietnamese online store that earns demand through trustworthy supplement information and converts that demand into safe, auditable purchases. It combines a commercial opportunity with a regulatory mandate: customers need clear product and editorial evidence, while the Operator needs controlled publication, reliable commerce, fulfillment, financial reconciliation, and proof that unsafe or unsupported claims cannot reach sale.

## Capabilities

- **CAP-1 — Governed Content and SEO**
  - **intent:** Operators can create, review, publish, expire, correct, and withdraw crawlable editorial, advertising, policy, and SEO content with provenance and human approval.
  - **success:** Every public governed page has an allowed lifecycle state, immutable version, required attribution and disclosure, valid approved claims, canonical/index rules, and an auditable transition; drafts and withdrawn content are not promoted or indexed.

- **CAP-2 — Regulated Catalog and Safety**
  - **intent:** Operators can manage supplement products, variants, evidence, price inputs, stock, and sellability while the system fails closed when safety evidence is missing or uncertain.
  - **success:** Every sellable SKU passes current classification, documentation, claim, disclaimer, review, offer, and availability gates; an expiry, suspension, withdrawal, or denial removes purchase and product-notification eligibility without erasing historical order evidence.

- **CAP-3 — Discovery and Merchandising**
  - **intent:** Customers can find suitable sellable products through indexable navigation, search, filters, sorting, collections, and transparent deterministic merchandising.
  - **success:** Category, search, filter counts, autocomplete, promotions, and related products use the same canonical eligibility projection, expose stable shareable URLs and explicit empty states, and never infer a sensitive health profile.

- **CAP-4 — Identity, Cart, and Checkout**
  - **intent:** Customers can purchase as guests or through a basic verified account using a persistent cart, domestic delivery, validated discounts, and hosted payment.
  - **success:** Cart merge is deterministic; checkout revalidates product, variant, price, promotion, availability, address, delivery, and policy; one immutable order snapshot is committed or all reservations are safely released; browser return alone never declares payment success.

- **CAP-5 — Order, Payment, and Finance Integrity**
  - **intent:** Operators can run explicit order and payment lifecycles, verify provider evidence, reconcile exceptions, post financial facts, and retain settlement and invoice evidence.
  - **success:** Duplicate or reordered commands and callbacks cause one financial and order outcome; payment and fulfillment states remain distinct; refund totals cannot exceed captured value; every mismatch is recoverable through an audited exception rather than silent mutation.

- **CAP-6 — Inventory, Fulfillment, and Shipment**
  - **intent:** Operators can reserve and adjust stock, then pick, pack, dispatch, and track only eligible paid order items.
  - **success:** Available stock equals governed on-hand less active reservations; retries cannot duplicate a physical action; regulatory holds and cancellations block new dispatch; tracking records retain carrier evidence, milestones, and update time.

- **CAP-7 — Cancellation, Returns, Refunds, and Holds**
  - **intent:** Customers and Operators can resolve cancellations, item-level returns, refunds, and regulatory events under the policy accepted at order commitment.
  - **success:** Each decision observes the normative lifecycle and order policy snapshot, preserves evidence and actor reason, releases stock once, separates refund approval from execution, and cannot reopen terminal orders or refund twice.

- **CAP-8 — Trust, Support, and Notifications**
  - **intent:** Customers can contribute moderated reviews and receive relevant transactional support and notifications without promotional-consent leakage.
  - **success:** Review provenance and moderation are auditable, abuse and duplicates are controlled, support notes stay restricted, and each business event yields at most one intended notification attempt per channel and recipient.

- **CAP-9 — Administration, Governance, Privacy, and Policy**
  - **intent:** Authorized Operators can administer roles, legal-seller evidence, policies, audit history, consent, privacy cases, retention, legal holds, and authority cooperation.
  - **success:** Least privilege is enforced server-side; sensitive grants and regulated actions are append-only auditable; accepted seller and policy versions remain attached to orders; privacy and authority cases coordinate all data owners with evidence of outcome.

- **CAP-10 — Reporting and Demand Validation**
  - **intent:** The Operator can measure the organic acquisition funnel and commerce operations using stable, purpose-bound definitions.
  - **success:** Reports connect qualified landing and editorial activity to product, cart, checkout, attributable order, repeat purchase, stock, fulfillment, reconciliation, refund, and support outcomes while minimizing sensitive queries and never replacing ledger truth.

- **CAP-11 — Secure, Reliable, Accessible, and Evolvable Platform**
  - **intent:** The platform can run safely as an accessible DDD modular monolith and evolve through measured extraction without sacrificing owner truth.
  - **success:** Primary journeys meet the accepted accessibility, responsive, performance, security, replay, recovery, observability, and capacity evidence; module ownership and published contracts are enforced; a service is extracted only after an evidence-backed architecture decision.

- **CAP-12 — Supervisor–Lead–Peer Delivery Contract**
  - **intent:** A paseo-pi-style team can decompose, select, implement, and review work without crossing domain ownership or merging incompatible contracts.
  - **success:** BR records epic, story, producer-consumer dependency, gate, owner, and acceptance evidence; BV exposes only unblocked ready work; both affected Leads accept cross-module compatibility tests; only the Supervisor approves a breaking exception.

## Constraints

- MVP is one owner-operated Legal Seller, Vietnamese-first, Vietnam-first, VND-first, domestic delivery, one inventory location, and supplements only.
- No SKU or regulated promotional content becomes sellable or publishable without current evidence, approved claims and disclaimers, human approval, and audit evidence. Uncertainty denies publication, purchase, dispatch, or product notification.
- Architecture follows the adopted DDD modular-monolith spine: one owner per business datum, hexagonal boundaries, contracts as the only cross-module import surface, transactional owner writes plus outbox, and evidence-driven strangler extraction.
- Checkout owns order commitment; authoritative owners retain order, payment, finance, inventory, fulfillment, return, catalog-safety, identity, governance, and reporting truth as defined by the Architecture Spine.
- Launch readiness requires accepted LG-1 through LG-7 artifacts. An epic may prepare evidence while a gate is open, but a blocked production state cannot be labeled ready.
- The seven UX surfaces—Home, Category/Search, Product Detail, Editorial Content, Cart/Checkout, Account, and Admin—share one semantic shell and one content source across 375, 768, 1024, and 1440 pixels.
- Public index content, navigation, required evidence, and disclosures remain usable without animation or client-side JavaScript; WCAG 2.2 AA outcomes and reduced motion outrank generated styling.
- Payment account data stays outside Ecom through hosted or redirected provider UI; prohibited payment and health-sensitive data never enter logs, analytics, telemetry, or general advertising profiles.
- Provider and infrastructure choices remain adapter decisions until LG-3 and AD-29 closure; Redis, BullMQ, a search cluster, read replicas, and separate services require measured evidence.

## Non-goals

- Medicine, prescription, licensed-pharmacy, pharmacist consultation, diagnosis, treatment, and telemedicine workflows.
- Marketplace and merchant-SaaS functions: multi-vendor onboarding, Seller Portal, commissions, split payment, and seller settlement.
- Multiple warehouses, international delivery, multicurrency, foreign-tax complexity, or multi-region operation.
- Advanced loyalty or wallet, a general promotion engine, flash sales, bundles, tiered pricing, dynamic pricing, or machine-learned personalization.
- Autonomous publication of regulated content, AI chatbot, social login, phone OTP, live chat, product comparison, and review helpfulness voting in the committed MVP.
- Public developer API, dedicated search cluster, data warehouse, service-count targets, or independently deployed microservices.

## Success signal

- A controlled public launch completes with 100% of sellable SKUs passing CR-1 and CR-2, every governed page passing its workflow, zero duplicate payment capture or fulfillment under replay tests, and all LG-1 through LG-7 evidence accepted.
- Demand is validated when attributable organic orders reach at least 30 per month for three consecutive months within six months of indexation, organic visit-to-order conversion is at least 1.0%, and eligible 90-day repeat purchase reaches at least 10% after a cohort of 100 customers, without a compliance breach or harmful counter-metric movement.

## Assumptions

- The business is a direct-retail-margin store for Vietnamese adults arriving from supplement or wellness search, not merchant SaaS.
- Guest checkout and a basic verified-email account are sufficient unless an evidence-backed decision makes another method a launch blocker.
- The provisional brand palette may evolve, but accessibility, semantic interaction, and disclosure constraints are stable.
- RPO at most 15 minutes, RTO at most 4 hours, the stated Web Vitals, API latency, alert, and capacity thresholds remain provisional until LG-5 and LG-7 accept or replace them.
- The demand thresholds in the success signal are validation hypotheses, not promises of market performance.

## Open Questions

- Which supplement category and health need lead the initial assortment and SEO content cluster, and what authenticity, sourcing, margin-floor, and stock plan closes LG-1?
- Who owns recurring regulatory watch and human content approval, and which evidence retention, policy, invoice, recall, and authority-response decisions close LG-2 and LG-4?
- Which payment, logistics, and messaging providers pass the LG-3 capability, contract, callback, refund, tracking, and sandbox tests?
- Which cloud, region, runtime, managed-service classes, cost envelope, and operating owner satisfy AD-29 before provisioning?
- Which workload and operational thresholds accept or replace the provisional latency, Web Vitals, RPO, RTO, capacity, saturation, and alert assumptions at LG-5?
- Does product comparison become valuable enough to admit through a future evidence-backed scope decision?

