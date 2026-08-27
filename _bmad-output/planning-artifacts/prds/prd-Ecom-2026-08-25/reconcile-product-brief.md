# Input Reconciliation: Product Brief

## Source

- **Input:** `briefs/brief-Ecom-2026-08-25/brief.md`
- **Compared against:** `prds/prd-Ecom-2026-08-25/prd.md`
- **Verdict:** The PRD preserves the brief's central proposition, regulated-content model, single-store MVP boundary, compliance posture, SEO-to-commerce loop, operational integrity requirements, assumptions, risks, and counter-metrics. Four meaningful items were lost or weakened.

## Meaningful Gaps

### 1. Progressive disclosure was dropped as an experience principle

**Source intent:** Keep core storefront tasks simple while making supporting evidence and detail available to Customers who need it.

**PRD state:** The PRD retains accessibility, responsive behavior, trust cues, and anti-dark-pattern guardrails, but does not require progressive disclosure or test the balance between a concise purchase path and access to deeper regulated information.

**Why it matters:** Without this principle, UX can satisfy disclosure completeness by presenting every detail at once, weakening the brief's intended low-friction, confidence-building experience.

### 2. Basic Customer account scope was diluted

**Source intent:** Guest purchase plus basic account access for Orders, saved addresses, and tracking.

**PRD state:** FR-20 requires only that a Customer can create or access a basic account. FR-23 covers entering addresses during Checkout, and FR-32 exposes tracking state, but no functional requirement makes Order history, address management, or Shipment tracking available through the account.

**Why it matters:** A named MVP capability became an undefined container and is therefore not independently testable or reliably carried into UX and implementation.

### 3. Product and retention reporting are not operationalized

**Source intent:** Operational reporting covers traffic source, search landing pages, conversion, Orders, Products, and Inventory; repeat purchase is explicitly tracked.

**PRD state:** FR-45 covers acquisition and funnel reporting, and FR-46 covers Order and operating-health measures. Product-performance reporting is not explicit. SM-4 names repeat purchase, but neither FR-45 nor FR-46 requires a repeat-purchase measure or report.

**Why it matters:** The PRD retains the desired outcomes as prose or metrics without defining the reporting capability needed to observe two of them, weakening the evidence loop used to narrow content and assortment.

### 4. The evidence-gated north-star vision was flattened into technical evolvability

**Source intent:** If the first Store proves repeatable demand, Ecom may grow into a trusted health-commerce operating system through evidence-gated additions such as new supplement categories, retention programs, additional warehouses, and carefully governed personalization. Multi-vendor and medicine expansion have separate maturity, verification, liability, settlement, and licensing gates.

**PRD state:** NFR-11 preserves modular contracts and future extraction, and the MVP non-goals correctly exclude these capabilities. The product-level expansion logic, sequence, and distinct gates are otherwise absent.

**Why it matters:** The PRD preserves the option to evolve technically but loses what future evolution is for and the evidence and governance boundaries that must prevent premature scope inflation. This belongs in Vision or product boundaries, not as added MVP requirements.

## Confirmed as Preserved

No reconciliation is needed for the following source themes: owner-operated single Store; Vietnam/Vietnamese/VND launch envelope; supplements-only boundary; direct-retail assumption; broad initial audience pending evidence; education versus advertising separation; governed claims, evidence, and publication history; default-to-not-sellable compliance behavior; hosted/redirected Payment preference; idempotent Payment and Fulfillment; SEO and operating-health metrics; accessibility and Core Web Vitals expectations; no dark patterns; and exclusion of marketplace, medicine, sensitive health profiling, autonomous regulated publishing, public API, and premature distributed-system complexity.
