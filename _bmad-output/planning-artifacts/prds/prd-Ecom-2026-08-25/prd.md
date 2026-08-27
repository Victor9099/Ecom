---
title: "Ecom"
status: final
created: 2026-08-25
updated: 2026-08-25
---

# PRD: Ecom

## 0. Document Purpose

This PRD defines the MVP requirements for Ecom, an owner-operated, SEO-led health-supplement store for Vietnam. It serves product, UX, architecture, implementation, operations, compliance review, and future Supervisor–Lead–Peer delivery workflows. The [final Product Brief](../../briefs/brief-Ecom-2026-08-25/brief.md) governs product intent; its [Addendum](../../briefs/brief-Ecom-2026-08-25/addendum.md) holds dated regulatory evidence and candidate breadth; `design-system/ecom/MASTER.md` holds provisional UI rules. This PRD specifies behavior and outcomes, not implementation architecture.

Requirements use stable `UJ`, `FR`, `NFR`, `CR`, and `SM` identifiers. `[ASSUMPTION]` marks accepted but unvalidated inputs. Glossary terms are normative.

## 1. Vision

Ecom connects trustworthy supplement education with a complete online purchase journey. A Customer can arrive through organic search, distinguish Editorial Content from Advertising Content, inspect current Product evidence and Approved Claims, and purchase without manipulative urgency or hidden conditions.

The first release serves one Legal Seller and one Operator. It must prove that governed SEO content can create qualified demand and that the Operator can manage the Regulated Catalog, content workflow, Order lifecycle, Payment reconciliation, Fulfillment, and customer support reliably. Expansion follows evidence: repeatable organic demand, stable operations, and compliance capacity must exist before adding warehouses, marketplace operations, or medicine. Independently deployed services are never a product goal by themselves.

## 2. Target Users

### 2.1 Jobs to Be Done

**Customer**

- Understand supplement options without confusing education with diagnosis or advertising.
- Verify Product identity, evidence, warnings, Availability, price, and seller credibility.
- Complete a mobile-friendly purchase and understand every post-payment state.
- Track, cancel, return, or request a Refund through transparent policies.

**Operator**

- Turn governed content into measurable organic demand.
- Prevent unsupported claims or incomplete Product records from reaching Customers.
- Maintain accurate Regulated Catalog, Stock Position, Order, Payment, Fulfillment, and Refund state.
- Learn which pages, needs, and Products create qualified demand without health profiling.

### 2.2 Non-Users in MVP

- External Sellers operating their own Store.
- Customers seeking prescription or non-prescription medicines.
- International Customers requiring multicurrency or cross-border fulfillment.
- Developers consuming a public commerce API.

### 2.3 Key User Journeys

**UJ-1 — Lan discovers and purchases responsibly.** Lan reaches an Editorial Page from a Vietnamese mobile search. She sees author, reviewer, sources, update date, and Advertising Markers. She opens a relevant Product, verifies disclosures, Approved Claims, Disclaimer, Variant, price, and Availability, then completes guest Checkout. She receives an authoritative Order confirmation; a pending Payment never appears successful.

**UJ-2 — Minh recovers from unavailability.** Minh finds an unavailable Variant, creates a Back-in-stock Subscription, receives one Notification when the Variant becomes sellable, returns to the correct Product, and may unsubscribe at any time.

**UJ-3 — Viktor publishes governed content.** Viktor drafts an Editorial Page, attaches evidence and review metadata, marks advertising, uses Approved Claims and Disclaimer components, obtains approval, publishes, and later revises or withdraws it without losing Audit History.

**UJ-4 — Viktor makes a SKU sellable.** Viktor creates a Product and Variant, assigns Regulatory Class, attaches Product-registration Documents, records validity and Approved Claims, sets price and Stock Position, and previews the page. Missing, expired, suspended, or withdrawn evidence blocks sale.

**UJ-5 — Viktor fulfills once.** An authenticated payment provider notification is processed idempotently and reconciled. Viktor picks, packs, dispatches, and records tracking. Replayed callbacks cannot capture or fulfill twice.

**UJ-6 — Lan requests cancellation, return, or Refund.** Lan sees policy eligibility and submits an item-level request. Viktor records an auditable decision and executes an eligible Refund. Lan sees each state and outcome.

**UJ-7 — Viktor performs an emergency withdrawal.** When evidence or content becomes invalid, Viktor suspends affected Products or pages, records the reason, blocks new sales, and routes existing Orders for explicit review without rewriting history.

**UJ-8 — Viktor learns from evidence.** Viktor reviews organic landing pages, article-to-Product progression, funnel, Orders, Refunds, support burden, and Stock accuracy to narrow future content and assortment without diagnosing Customers.

## 3. Glossary

- **Store** — The single MVP commerce operation owned by the Legal Seller.
- **Customer** — A visitor or purchaser using the Storefront.
- **Operator** — An authorized person managing Store content or operations.
- **Legal Seller** — The entity responsible for Products, policies, invoices, and commerce obligations.
- **Product** — The customer-facing identity of a health-supplement item.
- **Variant** — A purchasable Product configuration with its own SKU, price, and Stock Position.
- **SKU** — The stable seller identifier for one Variant.
- **Regulated Catalog** — Products, Variants, regulatory evidence, Approved Claims, prices, and Availability governed for sale.
- **Regulatory Class** — The legally relevant classification assigned to a SKU from authoritative evidence.
- **Product-registration Document** — Evidence required to circulate or sell a SKU, including validity and status.
- **Approved Claim** — Product communication authorized under applicable evidence and review.
- **Disclaimer** — Mandatory wording displayed with regulated Product or Advertising Content.
- **Editorial Content** — Educational material whose primary purpose is information.
- **Advertising Content** — Content identified as directly or indirectly promoting a Product.
- **Editorial Page** — A CMS-managed page containing Editorial Content and clearly separated Advertising Content where applicable.
- **Content Version** — An immutable published or withdrawn revision with authorship, review, dates, and evidence.
- **Advertising Marker** — A visible and machine-readable classification of Advertising Content.
- **Stock Position** — Quantity state for a Variant, including on-hand and reserved amounts.
- **Availability** — A projection of whether and how a Variant may be purchased.
- **Cart** — Revocable Customer intent that does not guarantee price, stock, or Payment.
- **Checkout** — Validation of Cart intent before an Order is created.
- **Order** — The commercial agreement snapshot and its controlled lifecycle.
- **Payment** — A provider-mediated attempt and outcome associated with an Order.
- **Reconciliation** — Comparison of provider evidence with internal Payment and Order records.
- **Fulfillment** — Operational work that prepares and dispatches Order Items.
- **Shipment** — A dispatched package and its tracking state.
- **Return Request** — A request to return an Order Item under policy.
- **Refund** — A monetary reversal executed from an approved outcome.
- **Notification** — A governed message for a defined event and purpose.
- **Back-in-stock Subscription** — Revocable permission to receive an Availability Notification.
- **Audit History** — Append-only evidence of sensitive actions.

## 4. Features and Functional Requirements

### 4.1 Governed Content and SEO

Realizes UJ-1, UJ-3, UJ-7, and UJ-8.

| ID | Requirement | Testable consequences |
| --- | --- | --- |
| **FR-1** | The Operator can manage Home, Category, Product, Editorial, policy, and SEO landing pages with canonical metadata and index controls. | Public pages expose crawlable semantic content; drafts are not publicly indexable. |
| **FR-2** | Editorial Pages move through Draft, Review, Approved, Published, Expired, and Withdrawn states under authorized transitions. | Missing review data blocks publication; every transition records actor, time, and reason. |
| **FR-3** | The Operator records sources, author/byline, reviewer, review date, effective date, and next-review date. | Required provenance is visible; later edits do not rewrite prior Content Versions. |
| **FR-4** | Commercial sections carry an Advertising Marker rendered clearly by the Storefront. | Advertising remains identifiable visually and structurally; templates cannot suppress the Marker. |
| **FR-5** | Regulated promotional content can use only active Approved Claims and required Disclaimer components. | Unsupported claims or a missing Disclaimer block publication; AI cannot auto-approve or auto-publish. |
| **FR-6** | Publishing an edit creates a Content Version; authorized Operators can schedule expiry or withdraw immediately. | Withdrawn content stops promotion while prior versions, reason, and evidence remain auditable. |
| **FR-7** | Editorial Pages can reference relevant Products without merging editorial and advertising roles. | Broken, withdrawn, or prohibited Product links are flagged before publication and during scheduled checks. |

### 4.2 Regulated Catalog and Inventory

Realizes UJ-1, UJ-2, UJ-4, and UJ-7.

| ID | Requirement | Testable consequences |
| --- | --- | --- |
| **FR-8** | The Operator can manage Products, Variants, SKUs, Categories, Brands, media, attributes, price, and publication state. | SKU uniqueness is enforced; removal does not erase historical Order snapshots. |
| **FR-9** | Each SKU records Regulatory Class, classification source, Product-registration Documents, validity, and review status. | Regulatory Class is never inferred from Product name or supplier copy; changes are audited. |
| **FR-10** | Ecom computes sellability from required evidence, Approved Claims, regulatory review, and Stock Position. | Missing, expired, suspended, withdrawn, or indeterminate evidence is classified as not sellable with an Operator-facing reason. |
| **FR-11** | Product Detail shows Product identity, Variant, attributes, price, Availability, required disclosures, Disclaimer, and approved information. | Prohibited treatment/cure claims do not render; data matches the selected Variant. |
| **FR-12** | The Operator records on-hand quantity and auditable adjustments; Checkout can reserve and release quantity. | Available quantity equals governed on-hand less active reservations; failed or expired Checkout releases holds. |
| **FR-13** | Storefront Availability derives from both sellability and Stock Position. | Stock cannot make invalid evidence purchasable; stale projections have a defined refresh path. |
| **FR-14** | A Customer can create or revoke a Back-in-stock Subscription for an unavailable Variant. | Notification occurs only after sellability and stock recover; duplicates do not produce duplicate messages. |

### 4.3 Discovery and Merchandising

Realizes UJ-1, UJ-2, and UJ-8.

| ID | Requirement | Testable consequences |
| --- | --- | --- |
| **FR-15** | Customers can browse indexable Categories and collections with paginated Product results. | Stable URLs and canonical rules prevent duplicate index content; empty states are explicit. |
| **FR-16** | Customers can search active Products by names and relevant attributes with basic autocomplete and typo tolerance. | Only sellable Products appear; unnecessary sensitive query text is not retained. |
| **FR-17** | Customers can filter by applicable Category, Brand, price, rating, attributes, and Availability and use defined sort options. | Filter counts and results use the same sellability projection; useful filter state is shareable. |
| **FR-18** | The Operator can schedule simple coupons, fixed/percentage discounts, and featured collections. | Checkout revalidates eligibility and expiry; presentation cannot hide conditions or fabricate scarcity. |
| **FR-19** | Storefront can show manually governed or deterministic related Products without health-profile inference. | Every recommendation is sellable, labeled, and traceable to an inspectable rule or relationship. |

### 4.4 Identity, Cart, and Checkout

Realizes UJ-1.

| ID | Requirement | Testable consequences |
| --- | --- | --- |
| **FR-20** | Customers can purchase as guests and can create or access a basic account through a verified email-based method. `[ASSUMPTION]` | Guest purchase does not require marketing consent; verification and recovery do not leak unrelated identity records. |
| **FR-21** | Ecom persists guest and authenticated Carts and merges them after sign-in. | Duplicate Variants merge deterministically; Cart merging cannot bypass sellability or quantity limits. |
| **FR-22** | Checkout revalidates sellability, Variant, price, promotion, Availability, delivery, and policy. | Changes are explained before commitment; partial failure cannot appear as success. |
| **FR-23** | Customers can enter and select domestic addresses and supported delivery methods. | Inputs support autofill and accessible validation; unsupported destinations fail before Payment. |
| **FR-24** | Customers can apply eligible coupons and see price breakdowns and rejection reasons. | Benefits respect configured bounds and usage limits; replay cannot consume one-time value twice. |
| **FR-25** | Customers can select an approved hosted or redirected Payment method. | Primary account numbers and verification values never enter Ecom logs, analytics, or storage. |
| **FR-26** | Ecom creates an Order with snapshots of Product, Variant, quantity, price, discount, seller, invoice inputs, delivery, policy, and disclosures. | Later source changes do not rewrite the agreement; if Order creation fails, Ecom releases reserved resources or records the failure for recovery. |
| **FR-27** | Checkout result reflects authoritative Order and Payment evidence. | Browser return alone cannot mark Payment successful; pending, failed, canceled, and successful are distinct. |

### 4.5 Order, Payment, Fulfillment, and Returns

Realizes UJ-5, UJ-6, and UJ-7.

| ID | Requirement | Testable consequences |
| --- | --- | --- |
| **FR-28** | Ecom verifies each payment provider notification's signature, Order identity, and amount, then processes the notification idempotently. | Duplicate notifications produce one outcome; invalid evidence cannot change Payment state. |
| **FR-29** | The Operator can reconcile provider query/settlement evidence with Payment and Order records. | Inconsistencies enter an exception queue; manual corrections require actor and reason. |
| **FR-30** | Orders use explicit states and transitions while Payment and Fulfillment states remain distinct. | Invalid transitions fail; terminal transitions, timeouts, and recovery actions are auditable. |
| **FR-31** | The Operator can create pick, pack, and dispatch work only for eligible Order Items. | Retries cannot duplicate Fulfillment; cancellations and regulatory holds block new dispatch. |
| **FR-32** | The Operator records carrier, tracking code, dispatch, and normalized tracking milestones. | Customer sees state and update time; carrier failure cannot erase prior evidence. |
| **FR-33** | Customers or Operators can request cancellation subject to policy and Fulfillment state. | Approval releases Stock Position and initiates any required Refund exactly once. |
| **FR-34** | Customers submit item-level Return Requests; Operators approve or reject them and, when approved, record receipt and disposition. | Eligibility uses the Order policy snapshot; exceptions require actor, reason, and evidence. |
| **FR-35** | The Operator issues full or partial Refunds from an approved outcome through supported provider flows. | Refund cannot exceed eligible captured Payment; callback/retry cannot refund twice. |
| **FR-36** | Authorized Operators can hold affected Products and unfulfilled Order Items during a regulatory event. | New sales stop immediately; existing Orders remain immutable and enter explicit review. |

#### 4.5.1 Normative lifecycle baseline

##### Aggregate lifecycle matrix

| Aggregate | Allowed lifecycle | Required guards |
| --- | --- | --- |
| **Order** | `Pending Payment → Confirmed → Processing → Dispatched → Delivered → Closed`; `Pending Payment/Confirmed/Processing → Canceled`; any nonterminal operational state may enter and leave `On Hold` by audited decision. | Payment success is authoritative before `Confirmed`; regulatory hold blocks dispatch; terminal states cannot reopen except through a separate Return Request or audited correction workflow. |
| **Payment** | `Initiated → Pending → Succeeded/Failed/Canceled`; `Succeeded → Partially Refunded → Refunded`. | Browser return is never authoritative; the amount and Order identity must match; capture and Refund commands are idempotent; total Refund cannot exceed captured amount. |
| **Fulfillment** | `Unallocated → Ready → Picking → Packed → Dispatched → Delivered`; any pre-dispatch state may become `Canceled` or `On Hold`. | Only eligible paid Order Items enter `Ready`; a Shipment transition requires carrier/tracking evidence; dispatched work cannot be canceled as unshipped. |
| **Return Request** | `Requested → Under Review → Approved/Rejected`; `Approved → In Transit/Received → Dispositioned → Closed`. | Eligibility uses the Order policy snapshot; item-level quantity cannot exceed fulfilled quantity; every exception records evidence. |

##### Cancellation and exception decision matrix

| Situation | Launch decision |
| --- | --- |
| Payment not succeeded | Customer or timeout may cancel; no Refund is due; reservations release once. |
| Payment succeeded, Fulfillment not started | Cancellation may auto-approve under the active policy and initiate one Refund. |
| Picking or packing started | Operator review is required; approval cancels remaining work and initiates eligible Refund. |
| Shipment dispatched | Cancellation is unavailable; Customer may use the Return Request path after delivery or carrier exception. |
| Partial-item request | Decision and Refund are item-level; unaffected Order Items retain their lifecycle. |
| Regulatory hold | No new dispatch; Operator applies the approved recall/hold SOP to each affected Order Item. |
| Duplicate callback or command | The original outcome is returned; no additional financial or physical action occurs. |

### 4.6 Trust, Support, and Notifications

Realizes UJ-2, UJ-5, and UJ-6.

| ID | Requirement | Testable consequences |
| --- | --- | --- |
| **FR-37** | Customers can submit ratings, text, and allowed media; Operators moderate Reviews. | Moderation is audited; verified-purchase labels appear only with Order evidence. |
| **FR-38** | Customers can report Reviews for policy or safety concerns under abuse controls. | Rate limits and duplicate-report controls apply; moderation never silently rewrites Customer text. |
| **FR-39** | Authorized Operators can view Order-linked support context and create restricted customer service notes. | Internal notes never appear to Customers; support-triggered actions remain separate audited commands. |
| **FR-40** | Ecom sends templated Order, Payment, Shipment, Refund, and Back-in-stock Notifications and records attempts. | Messages deduplicate by business event; transactional messages never imply promotional consent. |

### 4.7 Administration, Privacy, and Reporting

Realizes UJ-3 through UJ-8.

| ID | Requirement | Testable consequences |
| --- | --- | --- |
| **FR-41** | Explicit roles govern administration, content, customer service, fulfillment, and finance capabilities. | Least privilege applies server-side; sensitive grants are audited. |
| **FR-42** | Ecom records append-only Audit History for regulated, permission, Payment, Refund, hold, and override actions. | Entries include actor, time, subject, action, reason, and correlation identifier. |
| **FR-43** | The Operator manages consent/legal-basis records, retention, deletion requests, processors, and transfer assessments where applicable. | Marketing and personalization purposes remain separate; requests have status and evidence. |
| **FR-44** | Authorized Operators maintain versioned records of seller identity and of terms, privacy, delivery, cancellation, return, complaint, and invoice policies. | Checkout records applicable versions; edits do not rewrite prior Orders. |
| **FR-45** | Reports cover landing pages, qualified organic sessions, article-to-Product progression, Cart, Checkout, and attributable Orders. | Attribution windows are defined; sensitive query text is minimized and protected. |
| **FR-46** | Reports cover Product performance, repeat purchase, Order volume, Reconciliation exceptions, fulfillment accuracy, cancellations, Refund cycle time, Stock accuracy, and support burden. | Definitions are stable and exportable; operational reports do not replace the financial ledger as the authoritative record. |

## 5. Cross-Cutting Requirements and Guardrails

### 5.1 Non-Functional Requirements

- **NFR-1 Accessibility:** Primary Storefront and Operator journeys conform to the applicable WCAG 2.2 Level AA success criteria, including keyboard operation, visible focus, meaningful image alternatives, announced errors, labels, zoom support, and reduced motion.
- **NFR-2 Responsive UX:** Required journeys work at 375, 768, 1024, and 1440 px without horizontal scrolling or navigation covering content.
- **NFR-3 Performance and SEO:** On Home, Category/Search, Product Detail, Editorial Content, and Cart/Checkout templates, when sufficient field data exists, its 75th-percentile results must meet LCP ≤2.5 s, INP ≤200 ms, and CLS ≤0.1. Until then, use repeatable mobile lab evidence. Content required for indexing remains available without animation or JavaScript. `[ASSUMPTION]` Listing API p95 TTFB is ≤200 ms for cached reads and ≤500 ms for uncached reads under the workload approved through LG-5 from a Vietnam-region test client.
- **NFR-4 Security:** Production must satisfy the applicable OWASP ASVS 5.0 Level 2 controls, HTTPS, strong password hashing, secure session/token rotation, rate limits, anti-automation controls, least privilege, dependency/secret scanning, and threat-model review. LG-6 blocks release if any critical or high finding that affects the launch surface remains unresolved.
- **NFR-5 Payment Security:** Use PCI DSS v4.0.1 as baseline, minimize scope with hosted provider UI, keep account data outside Ecom, and validate SAQ/control scope with the acquirer or Qualified Security Assessor.
- **NFR-6 Reliability:** External adapters use timeouts, bounded retries, idempotency, exception handling, reconciliation, and circuit breakers where justified. Automated replay tests of at least 100 duplicate/reordered provider events per critical scenario must produce exactly one financial and Fulfillment outcome and no unresolved record divergence.
- **NFR-7 Auditability:** 100% of action classes named by FR-2, FR-6, FR-9, FR-29, FR-35, FR-36, FR-41, and FR-42 must record actor/system identity, time, subject, action, reason, outcome, and correlation identifier; evidence export must reconcile to the source event count.
- **NFR-8 Privacy:** Personal data collection is purpose-limited and supports applicable Vietnamese consent/legal-basis, retention, deletion, processor, data-subject, and transfer obligations.
- **NFR-9 Recovery:** Automated backup and restore verification are required. `[ASSUMPTION]` Launch RPO is ≤15 minutes and RTO is ≤4 hours, proven by a restore rehearsal against a production-like encrypted backup before approval.
- **NFR-10 Observability:** Production provides structured logs, metrics, alerts, and correlation identifiers for Checkout, Payment, Order, and Notification flows without prohibited payment or health-sensitive data. Synthetic or test events must prove that critical Checkout/Payment failure alerts fire within 5 minutes and identify the affected correlation ID.
- **NFR-11 Evolvability:** Modules expose explicit contracts and data ownership so future extraction is evidence-driven; this does not mandate microservices.
- **NFR-12 Capacity evidence:** LG-5 defines expected catalog, traffic, Checkout, and operations workload. Before production approval, a production-like test must sustain twice the initial forecast for 30 minutes while meeting NFR-3, keeping the critical-flow error rate below 1%, and ensuring that no resource exceeds its approved saturation threshold.

### 5.2 Compliance Requirements

- **CR-1 SKU evidence gate:** No SKU is published or sold without required current classification and documentation.
- **CR-2 Claim and warning gate:** Published Product or Advertising Content must exclude unsupported treatment or cure claims and medicine-replacement claims and must include any required Disclaimer.
- **CR-3 Advertising separation:** Advertising Content remains identifiable and separable from Editorial Content in presentation and structured metadata.
- **CR-4 Human approval:** AI may assist drafting but cannot approve or publish regulated health claims autonomously.
- **CR-5 Regulatory watch:** A named owner reviews food-safety, advertising, e-commerce, privacy, invoice, and payment changes before launch and at a defined recurring interval.
- **CR-6 SKU and template review:** Compliance approval occurs per SKU evidence set and per content/campaign template; this PRD is not legal approval.
- **CR-7 Sensitive data:** Health-related behavior or history is potentially sensitive and cannot be repurposed for advertising without a validated lawful basis and explicit product decision.
- **CR-8 Invoice baseline:** Invoice behavior follows rules in force at release, currently documented in the Addendum as Law 108/2025, Decree 254/2026, Circular 91/2026, and replacements.
- **CR-9 Platform records and cooperation:** Ecom retains legally required seller, Product, transaction, complaint, moderation, and policy evidence and supports authorized requests from competent authorities under an audited procedure.

### 5.3 Aesthetic and Interaction Guardrails

- Treat `design-system/ecom/MASTER.md` as provisional for visual tokens and binding only for accepted accessibility and interaction guardrails. Validate every production color pair rather than assuming generated tokens meet WCAG.
- Create page overrides before implementation for Home, Category/Search, Product Detail, Editorial Content, Cart/Checkout, Account, and Admin.
- Preserve trustworthy e-commerce character without implying diagnosis or institutional medical authority.
- Apply progressive disclosure: keep the primary task clear while making evidence, policies, and supporting detail available on demand.
- Use one semantic content source across breakpoints; do not duplicate mobile and desktop content.
- Do not use dark patterns, fabricated scarcity, hidden recurring terms, unlabeled advertising, or inaccessible icon-only controls.

### 5.4 Launch Gates

The PRD may proceed to UX and Architecture while these gates are open, but implementation cannot be called launch-ready until every gate has an accepted artifact.

| Gate | Owner | Required closure artifact | Blocking effect |
| --- | --- | --- | --- |
| **LG-1 Assortment and economics** | Owner/Operator | Initial SKU register with supplier/authenticity evidence, landed cost, price, margin floor, and stock plan | Blocks catalog seeding and launch forecast. |
| **LG-2 Compliance readiness** | Operator plus qualified legal/compliance reviewer | SKU evidence matrix, approved claim/disclaimer library, content-template decisions, regulatory-watch cadence, and named approver | Blocks publication and Product sellability. |
| **LG-3 Provider selection** | Product and Architecture | Approved Payment/logistics shortlist, contract assumptions, callback/refund/tracking capability matrix, and sandbox proof | Blocks provider-specific stories and production Checkout. |
| **LG-4 Policy and lifecycle** | Operator plus legal/accounting review where needed | Versioned delivery, cancellation, return, Refund, complaint, privacy, invoice, hold/recall, and authority-response policies aligned with §4.5.1 | Blocks end-to-end acceptance and production Orders. |
| **LG-5 SLO and capacity** | Architecture with Operator forecast | Forecast, SLO sheet, NFR test plan, results, saturation thresholds, and monitoring thresholds | Blocks production approval. |
| **LG-6 Security and privacy** | Security reviewer/Lead | Threat model, ASVS 5.0 L2 evidence, privacy data map, PCI scope decision, and confirmation that no critical or high launch-surface findings remain unresolved | Blocks production approval. |
| **LG-7 Operational rehearsal** | Operator | Restore drill, Payment/Reconciliation replay, test Order fulfillment/return/Refund, emergency withdrawal, and support escalation evidence | Blocks public launch. |

## 6. Non-Goals

- Ecom is not a diagnostic, treatment, telemedicine, or pharmacy service in MVP.
- Ecom is not a marketplace or merchant SaaS product in MVP.
- Ecom does not build sensitive health profiles for advertising or automated Product selection.
- Ecom does not autonomously publish regulated health content.
- Ecom does not use service count, a dedicated search engine, or distributed architecture as a maturity target.
- Ecom does not provide a public developer platform in MVP.

## 7. MVP Scope

### 7.1 In Scope

- A Vietnamese-language, Vietnam-first, VND-denominated Store with one Legal Seller. `[ASSUMPTION]`
- A Regulated Catalog limited to health supplements and one inventory location. `[ASSUMPTION]`
- Governed SEO CMS, Editorial Pages, Product pages, Categories, search, filters, and basic merchandising.
- Guest Cart, optional account, domestic address/delivery, coupon, hosted Payment, and Order creation.
- Payment verification and Reconciliation, Fulfillment, Shipment tracking, cancellation, Return Request, and Refund.
- Moderated Reviews, transactional Notifications, Back-in-stock Subscriptions, and support context.
- RBAC, Audit History, privacy workflows, acquisition reporting, and operational reporting.

### 7.2 Out of Scope for MVP

- Medicine, prescription, pharmacist consultation, or licensed-pharmacy workflows.
- Multi-vendor onboarding, Seller Portal, commissions, split Payment, and Settlement.
- Multiple warehouses, international delivery, multicurrency, and foreign tax complexity.
- Advanced loyalty, wallet, flash-sale engine, bundles, tiered pricing, and general-purpose promotion rules.
- AI chatbot, autonomous content publication, dynamic pricing, and machine-learned recommendations.
- Public API, dedicated search cluster, data warehouse, and independently deployed microservices.
- Social login, phone OTP, live chat, Product comparison, and review helpfulness voting are deferred unless evidence makes one a launch blocker. `[NOTE FOR PM]`

### 7.3 Release Sequencing

| Class | Capabilities | Rationale/gate |
| --- | --- | --- |
| **Launch-essential** | Governed CMS and SEO; Regulated Catalog; Product Detail; basic Category/Search; Cart/Checkout; authoritative Payment status and Reconciliation; Order/Fulfillment; policy/versioning; RBAC/Audit; core privacy and reporting | Required to realize UJ-1, UJ-3, UJ-4, UJ-5, and UJ-7 and to pass LG-2–LG-7. |
| **Evidence-triggered MVP follow-on** | Coupons, related Products, account history, Reviews, Back-in-stock Subscription, enriched filters, self-service returns | Add after the first end-to-end transaction path is stable or when measured demand/support load justifies the capability. These may not delay the first controlled sale unless LG-4 requires them. |
| **Later** | Every item in §7.2 plus additional warehouses, marketplace, medicine, ML personalization, public APIs, dedicated services | Requires explicit evidence and a new scope decision; not inherited automatically by Architecture or stories. |

## 8. Success Metrics

### Primary

- **SM-1 Regulated launch readiness:** 100% of sellable SKUs pass CR-1 and CR-2, and all governed pages pass the content workflow. Validates FR-2–FR-10 and FR-42.
- **SM-2 Organic demand proof:** `[ASSUMPTION]` within six months of indexation, achieve at least 30 attributable organic Orders per month for three consecutive months, organic visit-to-Order conversion ≥1.0%, and no CR-1/CR-2 breach. Validates FR-1, FR-7, FR-15–FR-19, and FR-45.
- **SM-3 Purchase integrity:** zero duplicate Payment capture or duplicate Fulfillment caused by retry/replay behavior. Validates FR-22, FR-26–FR-31, and NFR-6.

### Secondary

- **SM-4 Funnel baseline:** measure qualified organic sessions, Editorial-to-Product progression, add-to-Cart, Checkout completion, and repeat purchase under defined attribution. Validates FR-45.
- **SM-5 Content integrity:** zero knowingly published treatment/cure claims and complete Audit History for correction or withdrawal. Validates FR-3–FR-6, FR-42, and CR-2–CR-4.
- **SM-6 Operational health:** establish fulfillment accuracy, cancellation rate, Refund cycle time, Stock accuracy, Reconciliation exceptions, and support-burden baselines. Validates FR-12, FR-29–FR-35, and FR-46.
- **SM-6a Repeat behavior:** `[ASSUMPTION]` at least 10% of eligible first-time purchasers place a second Order within 90 days, measured only after a cohort of at least 100 Customers; counterchecked against Refund and complaint rates. Validates FR-40, FR-45, and FR-46.
- **SM-7 Experience quality:** primary Storefront journeys pass agreed WCAG 2.2 AA and Core Web Vitals evidence. Validates NFR-1–NFR-3.

### Counter-Metrics

- **SM-C1 Raw traffic:** do not optimize sessions without useful engagement, qualified Product discovery, or purchase; counterbalances SM-2.
- **SM-C2 Content volume:** do not increase publishing volume at the cost of review quality or compliance; counterbalances SM-2 and SM-5.
- **SM-C3 Conversion at any cost:** do not improve conversion through dark patterns, misleading urgency, hidden terms, or unsafe personalization; counterbalances SM-3 and SM-4.
- **SM-C4 Architecture activity:** do not treat infrastructure or service count as product progress.

## 9. Risks and Mitigations

- **Unknown beachhead:** the initial health need and Customer segment are unknown. Instrument search/content/commerce progression and narrow scope from evidence.
- **Trust deficit:** a new Store may lack credibility. Use transparent seller identity, governed evidence, policies, Reviews, and honest state communication.
- **Regulatory change:** rules are changing. Apply CR-5, dated evidence, release gates, and counsel review.
- **Invalid supplier evidence:** documentation may be incomplete or outdated. Classify the affected Product as not sellable and perform recurring validity checks.
- **Operational overload:** one Operator may be overwhelmed. Prioritize core workflows and exception queues; defer breadth.
- **Provider inconsistency:** callbacks may be late, duplicated, or contradictory. Apply NFR-6, authoritative evidence, and Reconciliation.
- **SEO without demand:** traffic may not convert. Use SM-C1 and evidence-led content/category narrowing rather than volume goals.

## 10. Open Questions

### 10.1 Launch-gate decisions

#### LG-1 — Assortment and economics

- Which supplement category and health need lead the initial assortment and content cluster?
- What sourcing, authenticity checks, margin floor, and inventory process apply? The return-policy portion closes through LG-4.

#### LG-2 and LG-4 — Compliance, policy, and lifecycle

- Who owns regulatory watch and content approval, and what review cadence applies?
- Which Store policies and invoice scenarios require external legal/accounting sign-off?
- What legally required retention periods and authority-response procedures apply to each evidence class?

#### LG-3 — Providers

- Which Payment methods/providers and logistics carriers are required for launch?

#### LG-5 — SLO and capacity

- Are the provisional RPO, RTO, Web Vitals, latency, capacity, and alert thresholds accepted after architecture costing and rehearsal?

LG-6 and LG-7 have no unresolved product-choice question; their evidence packages remain mandatory.

### 10.2 Ungated product and architecture decisions

- Is guest Checkout plus email account access sufficient, or are phone OTP/social login launch blockers?
- Does Product comparison materially help the launch assortment?
- Which application stack implements the provisional design system?
- Which domain ownership decisions must Architecture settle for Product/Offer, Stock Position, Order/Fulfillment, and Payment/Ledger?

## 11. Assumptions Index

- **A-1 Business model:** direct retail margin for one owner-operated Store; not merchant SaaS.
- **A-2 Customer:** Vietnamese adults arriving through supplement or wellness search.
- **A-3 Market:** Vietnam-first, Vietnamese-first, and VND-first.
- **A-4 Operations:** one Legal Seller, one inventory location, and domestic delivery.
- **A-5 Identity:** guest Checkout plus a basic Customer account are available.
- **A-6 Growth target:** Use the provisional growth thresholds stated in SM-2 and A-9.
- **A-7 Brand:** visual identity remains provisional; accessibility and interaction guardrails are stable.
- **A-8 Recovery:** provisional RPO and RTO must be accepted or replaced through LG-5 before production approval.
- **A-9 Repeatable demand:** 30 organic Orders/month for three months, ≥1.0% organic conversion, and ≥10% eligible 90-day repeat purchase are provisional validation thresholds.
- **A-10 Production baseline:** RPO ≤15 minutes, RTO ≤4 hours, Web Vitals good thresholds at p75, and the stated capacity/alert targets are provisional until LG-5 and LG-7 evidence accepts or replaces them.
