# Ecom Requirements and Delivery Map

This companion preserves the detailed contract behind SPEC-ecom. Downstream epics, stories, UX specifications, tests, BR records, and BV readiness decisions must retain these IDs.

## Capability traceability

| Capability | Requirement coverage | Primary architecture ownership |
| --- | --- | --- |
| CAP-1 | FR-1..FR-7; CR-2..CR-6; NFR-1..NFR-3; SM-1, SM-2, SM-5 | Content, Catalog, Discovery, Storefront |
| CAP-2 | FR-8..FR-14; CR-1, CR-2, CR-6; SM-1, SM-6 | Merchant, Catalog, Pricing, Inventory |
| CAP-3 | FR-15..FR-19; NFR-3; SM-2, SM-4 | Discovery, Storefront |
| CAP-4 | FR-20..FR-27; CR-7; NFR-1..NFR-6 | Identity, Cart, Pricing, Checkout, Orders |
| CAP-5 | FR-26..FR-30, FR-35; CR-8; NFR-5..NFR-7, NFR-10; SM-3, SM-6 | Orders, Payments, Finance, Checkout |
| CAP-6 | FR-12, FR-13, FR-30..FR-32; NFR-6, NFR-10; SM-3, SM-6 | Inventory, Fulfillment |
| CAP-7 | FR-30, FR-33..FR-36; CR-9; NFR-6, NFR-7; SM-6 | Orders, Returns, Payments, Finance, Catalog, Fulfillment |
| CAP-8 | FR-14, FR-37..FR-40; CR-7; NFR-4, NFR-8 | Engagement, Orders, Discovery |
| CAP-9 | FR-41..FR-44; CR-4..CR-9; NFR-4, NFR-7..NFR-9 | Identity, Merchant, Governance, all data owners |
| CAP-10 | FR-45, FR-46; CR-7; NFR-8; SM-2, SM-4, SM-6, SM-6a | Reporting, owner-approved read models |
| CAP-11 | NFR-1..NFR-12; LG-5..LG-7; all Architecture Decisions | All modules and platform adapters |
| CAP-12 | AD-13, AD-15, AD-16, AD-28, AD-29; all epic dependencies and launch gates | Supervisor, producer Leads, consumer Leads, Peers |

## Functional requirements

| ID | Preserved outcome | Capability |
| --- | --- | --- |
| FR-1 | Manage Home, Category, Product, Editorial, policy, and SEO landing pages with canonical metadata and index controls. | CAP-1 |
| FR-2 | Govern Editorial Pages through Draft, Review, Approved, Published, Expired, and Withdrawn transitions. | CAP-1 |
| FR-3 | Record source, author, reviewer, and review/effective/next-review dates without rewriting prior versions. | CAP-1 |
| FR-4 | Render non-suppressible visual and structural Advertising Markers on commercial sections. | CAP-1 |
| FR-5 | Permit only active Approved Claims and required Disclaimers; AI cannot approve or publish. | CAP-1 |
| FR-6 | Create immutable Content Versions and support scheduled expiry or immediate audited withdrawal. | CAP-1 |
| FR-7 | Link Editorial Pages to Products without merging editorial and advertising roles; flag unsafe links. | CAP-1 |
| FR-8 | Manage Products, Variants, unique SKUs, Categories, Brands, media, attributes, price, and publication state. | CAP-2 |
| FR-9 | Record SKU Regulatory Class, classification source, registration documents, validity, and review status. | CAP-2 |
| FR-10 | Compute fail-closed sellability from evidence, Approved Claims, regulatory review, and Stock Position. | CAP-2 |
| FR-11 | Present variant-correct identity, attributes, price, availability, disclosures, disclaimer, and approved information. | CAP-2 |
| FR-12 | Record on-hand stock and auditable adjustments; reserve and release checkout quantity. | CAP-2, CAP-6 |
| FR-13 | Derive storefront availability from both sellability and Stock Position with a refresh path. | CAP-2, CAP-3 |
| FR-14 | Create and revoke deduplicated back-in-stock subscriptions that notify only after safety and stock recover. | CAP-2, CAP-8 |
| FR-15 | Browse indexable Categories and collections through stable canonical paginated results and explicit empty states. | CAP-3 |
| FR-16 | Search active sellable Products with basic autocomplete and typo tolerance while minimizing sensitive queries. | CAP-3 |
| FR-17 | Filter by applicable Category, Brand, price, rating, attributes, and Availability with consistent counts and shareable state. | CAP-3 |
| FR-18 | Schedule simple coupons, fixed/percentage discounts, and featured collections with checkout revalidation and transparent conditions. | CAP-3, CAP-4 |
| FR-19 | Show labeled, inspectable, manually governed or deterministic related Products without health-profile inference. | CAP-3 |
| FR-20 | Support guest purchase and basic verified-email account access without forced marketing consent or identity leakage. | CAP-4 |
| FR-21 | Persist guest and authenticated Carts and merge duplicate Variants deterministically without bypassing safety or quantity limits. | CAP-4 |
| FR-22 | Revalidate sellability, Variant, price, promotion, availability, delivery, and policy before commitment. | CAP-4 |
| FR-23 | Accept accessible domestic addresses and supported delivery methods; reject unsupported destinations before Payment. | CAP-4 |
| FR-24 | Apply eligible coupons with visible breakdown and rejection reasons, bounded benefits, and replay safety. | CAP-4 |
| FR-25 | Select approved hosted or redirected Payment while keeping account data outside Ecom. | CAP-4, CAP-5 |
| FR-26 | Create an Order with immutable product, price, seller, invoice, delivery, policy, and disclosure snapshots or safely recover resources. | CAP-4, CAP-5 |
| FR-27 | Derive checkout result from authoritative Order and Payment evidence, with distinct pending, failed, canceled, and successful states. | CAP-4, CAP-5 |
| FR-28 | Verify provider signature, Order identity, and amount and process every notification idempotently. | CAP-5 |
| FR-29 | Reconcile provider query and settlement evidence; route inconsistencies to an audited exception queue. | CAP-5 |
| FR-30 | Keep explicit Order, Payment, and Fulfillment lifecycles distinct with guarded audited transitions and recovery. | CAP-5, CAP-6, CAP-7 |
| FR-31 | Create pick, pack, and dispatch work only for eligible items; retries, cancellation, and holds cannot duplicate or bypass it. | CAP-6 |
| FR-32 | Record carrier, tracking code, dispatch, normalized milestones, update time, and retained evidence. | CAP-6 |
| FR-33 | Permit policy- and fulfillment-aware cancellation that releases stock and initiates any Refund exactly once. | CAP-7 |
| FR-34 | Process item-level Return Requests using the accepted Order policy and evidence-backed disposition. | CAP-7 |
| FR-35 | Execute approved full or partial provider Refunds without exceeding eligible captured value or duplicating execution. | CAP-5, CAP-7 |
| FR-36 | Hold affected Products and unfulfilled items during regulatory events without mutating historical Orders. | CAP-2, CAP-6, CAP-7 |
| FR-37 | Accept rating, text, and allowed media; audit moderation and prove verified-purchase labels. | CAP-8 |
| FR-38 | Let customers report reviews under rate, spam, and duplicate controls without silently rewriting text. | CAP-8 |
| FR-39 | Expose restricted Order-linked support context and separate audited support commands from internal notes. | CAP-8 |
| FR-40 | Send deduplicated templated Order, Payment, Shipment, Refund, and Back-in-stock notifications and record attempts. | CAP-8 |
| FR-41 | Govern admin, content, service, fulfillment, and finance capabilities through explicit least-privilege roles. | CAP-9 |
| FR-42 | Record append-only Audit History for regulated, permission, Payment, Refund, hold, and override actions. | CAP-9 |
| FR-43 | Manage legal basis, consent, retention, deletion, processors, transfers, and evidenced privacy-request status. | CAP-9 |
| FR-44 | Maintain versioned legal-seller identity and terms, privacy, delivery, cancellation, return, complaint, and invoice policies. | CAP-9 |
| FR-45 | Report landing, organic, editorial-to-product, Cart, Checkout, and attributable Order funnels with protected queries. | CAP-10 |
| FR-46 | Report product, repeat, order, reconciliation, fulfillment, cancellation, Refund, stock, and support measures with stable exportable definitions. | CAP-10 |

## Normative lifecycle and exception baseline

| Aggregate | Required lifecycle and guard |
| --- | --- |
| Order | Pending Payment → Confirmed → Processing → Dispatched → Delivered → Closed; eligible pre-dispatch states may cancel; nonterminal operational states may enter audited On Hold. Payment success is authoritative; terminal Orders do not reopen. |
| Payment | Initiated → Pending → Succeeded, Failed, or Canceled; Succeeded → Partially Refunded → Refunded. Browser return is non-authoritative; identity and amount must match; cumulative Refund cannot exceed capture. |
| Fulfillment | Unallocated → Ready → Picking → Packed → Dispatched → Delivered; pre-dispatch work may cancel or hold. Only eligible paid items enter Ready and Shipment transition requires carrier evidence. |
| Return Request | Requested → Under Review → Approved or Rejected; Approved → In Transit or Received → Dispositioned → Closed. Eligibility uses the Order policy snapshot and quantity cannot exceed fulfillment. |

Cancellation is refund-free before payment success; may auto-approve after payment but before fulfillment; requires Operator review during pick/pack; becomes a Return path after dispatch; operates item-by-item for partial requests; blocks dispatch under regulatory hold; and treats duplicate callbacks or commands as a replay of the original outcome.

## Non-functional requirements

| ID | Preserved acceptance boundary |
| --- | --- |
| NFR-1 | Primary Storefront and Operator journeys meet applicable WCAG 2.2 AA, including keyboard, focus, alternatives, errors, labels, zoom, and reduced motion. |
| NFR-2 | Required journeys work at 375, 768, 1024, and 1440 pixels without horizontal scroll or navigation occlusion. |
| NFR-3 | Public templates target p75 LCP at most 2.5 s, INP at most 200 ms, CLS at most 0.1; index content works without JS; provisional cached listing p95 TTFB at most 200 ms and uncached at most 500 ms under LG-5 workload. |
| NFR-4 | Apply OWASP ASVS 5.0 L2, HTTPS, strong hashing, token/session rotation, anti-automation, least privilege, scanning, threat modeling, and no unresolved critical/high launch-surface finding. |
| NFR-5 | Use PCI DSS v4.0.1 baseline, hosted provider UI, minimal scope, and validated SAQ/control scope. |
| NFR-6 | Provider adapters use timeouts, bounded retries, idempotency, exceptions, reconciliation, and justified circuit breakers; 100 duplicate/reordered events yield one financial and physical outcome. |
| NFR-7 | All named regulated and sensitive action classes produce complete auditable actor, time, subject, action, reason, outcome, and correlation evidence. |
| NFR-8 | Personal data is purpose-limited and supports applicable Vietnamese legal-basis, retention, deletion, processor, subject, and transfer duties. |
| NFR-9 | Backups are automated and restore-tested; provisional launch RPO is at most 15 minutes and RTO at most 4 hours. |
| NFR-10 | Structured logs, metrics, alerts, and correlations cover critical flows without prohibited data; test alerts fire within 5 minutes and identify correlation. |
| NFR-11 | Explicit module contracts and ownership enable evidence-driven extraction without mandating microservices. |
| NFR-12 | A production-like test sustains twice the LG-5 forecast for 30 minutes while meeting NFR-3, staying below 1% critical-flow errors and approved saturation thresholds. |

## Compliance requirements

| ID | Preserved gate |
| --- | --- |
| CR-1 | No SKU publishes or sells without required current classification and documentation. |
| CR-2 | Product and Advertising Content exclude unsupported treatment, cure, or medicine-replacement claims and include required Disclaimer. |
| CR-3 | Advertising remains identifiable and separable from Editorial Content visually and structurally. |
| CR-4 | AI may draft but never autonomously approve or publish regulated claims. |
| CR-5 | A named owner reviews food-safety, advertising, e-commerce, privacy, invoice, and payment changes before launch and recurrently. |
| CR-6 | Compliance approval occurs per SKU evidence set and per content or campaign template; this product contract is not legal approval. |
| CR-7 | Health-related behavior is potentially sensitive and cannot be repurposed for advertising without validated lawful basis and an explicit product decision. |
| CR-8 | Invoice behavior follows the rules in force at release and retains evidence of the applicable legal baseline. |
| CR-9 | Retain required seller, Product, transaction, complaint, moderation, and policy evidence and support audited competent-authority requests. |

## Launch gates and dependency effect

| Gate | Closure evidence | Blocks |
| --- | --- | --- |
| LG-1 Assortment and economics | SKU register, supplier/authenticity evidence, landed cost, price, margin floor, stock plan | Catalog seed and launch forecast |
| LG-2 Compliance readiness | SKU evidence matrix, approved claim/disclaimer library, template decisions, regulatory cadence, named approver | Publication and sellability |
| LG-3 Provider selection | Payment/logistics shortlist, contract assumptions, callback/refund/tracking matrix, sandbox proof | Provider-specific stories and production Checkout |
| LG-4 Policy and lifecycle | Versioned delivery, cancellation, return, Refund, complaint, privacy, invoice, hold/recall, authority-response policies | End-to-end acceptance and production Orders |
| LG-5 SLO and capacity | Forecast, SLO sheet, NFR plan/results, saturation and monitoring thresholds | Production approval |
| LG-6 Security and privacy | Threat model, ASVS evidence, privacy map, PCI scope, zero unresolved critical/high launch-surface findings | Production approval |
| LG-7 Operational rehearsal | Restore, replay, fulfillment/return/Refund, withdrawal, and support-escalation evidence | Public launch |

AD-29 adds an Architecture-owned precursor: cloud, region, runtime, managed-service classes, Vietnamese data-residency fit, backup compatibility, cost, operating owner, and exit assumptions must be accepted before environment or CI/CD provisioning.

## Release classes

| Class | Included outcome |
| --- | --- |
| Launch-essential | Governed CMS/SEO, regulated Catalog, Product Detail, basic Category/Search, Cart/Checkout, authoritative Payment/Reconciliation, Order/Fulfillment, policy/versioning, RBAC/Audit, core privacy, and reporting. |
| Evidence-triggered follow-on | Coupons, related Products, account history, Reviews, Back-in-stock, enriched filters, and self-service returns after the first stable end-to-end transaction or measured demand/support evidence. |
| Later | Medicine, marketplace, multi-warehouse, international/multicurrency, advanced promotion/loyalty, AI/chat/personalization, public APIs, dedicated services, and other explicit non-goals. |

## Success and counter-metrics

- SM-1: 100% of sellable SKUs pass CR-1 and CR-2; all governed pages pass workflow.
- SM-2: within six months of indexation, at least 30 attributable organic Orders per month for three consecutive months, at least 1.0% organic conversion, and no CR-1/CR-2 breach.
- SM-3: zero duplicate Payment capture or duplicate Fulfillment caused by replay.
- SM-4: measure the qualified organic → editorial/product → Cart → Checkout → Order funnel.
- SM-5: zero knowingly published treatment/cure claims and complete correction/withdrawal audit.
- SM-6: establish fulfillment, cancellation, Refund, stock, reconciliation, and support baselines.
- SM-6a: at least 10% eligible 90-day repeat purchase after at least 100 customers, counterchecked against Refund and complaint rates.
- SM-7: primary journeys pass accepted WCAG 2.2 AA and Core Web Vitals evidence.
- Never optimize raw traffic, content volume, conversion, or architecture activity at the expense of qualified demand, compliance, customer welfare, or actual product outcomes.

## Seven UX surfaces

| Surface | Minimum contract |
| --- | --- |
| Home | Trust-first shared shell, governed CMS slots, collection/editorial entry, safe featured products, crawlable content, and explicit empty/fallback states. |
| Category/Search | Stable SEO navigation, query and filters, canonical eligibility, result count, sorting, pagination, loading, no-result, error, and safety-removal states. |
| Product Detail | Variant-consistent commercial facts, evidence and disclosures, availability, purchase action, editorial separation, related content/products, and back-in-stock state. |
| Editorial Content | Provenance, review freshness, advertising separation, safe Product references, policy/disclaimer blocks, correction/withdrawal state, and crawlable semantics. |
| Cart/Checkout | Persistent cart, deterministic merge messaging, revalidation, accessible address/delivery/payment forms, transparent totals, authoritative pending/failure/success states, and recovery. |
| Account | Verified access, order/payment/fulfillment/refund timeline, addresses, privacy controls, notification/subscription management, and support entry. |
| Admin | Role-aware work queues for content, catalog evidence, inventory, orders, payment/reconciliation, fulfillment/returns, governance, reporting, exceptions, and immutable audit context. |

## Delivery authority

- Architecture invariants, module ownership, contract schemas, rollout rules, and stack baseline come from the adopted Architecture Spine and Delivery Topology.
- UX semantics and compliance outcomes outrank the provisional visual candidate in design-system/ecom/MASTER.md.
- BR must encode producer-to-consumer edges, launch-gate blockers, and rollout work. BV may mark a story ready only when required upstream contracts, decisions, fixtures, and gate evidence are present.
- Any later artifact that drops an ID in this map fails preservation review.
