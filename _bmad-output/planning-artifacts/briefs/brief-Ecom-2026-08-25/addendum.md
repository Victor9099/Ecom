# Product Brief Addendum: Ecom

## Status and Downstream Use

| Topic | Status | Primary consumer | Gate |
| --- | --- | --- | --- |
| Supplement-only MVP | Decided | PRD | Preserve unless business scope changes |
| Functional breadth | Candidate inventory | PRD | Prioritize into MVP and later phases |
| Domain entities | Modeling hypotheses | Architecture | Validate ownership and aggregate boundaries |
| NFR targets | Provisional | PRD and architecture | Define measurement conditions and acceptance evidence |
| Regulatory evidence | Current as of 2026-08-25 | PRD, legal and operations | Counsel/SKU/template review before go-live |
| UX/UI baseline | Provisional source of truth | UX and implementation | Revisit brand and stack after product validation |
| Toolchain and Paseo/Pi model | Dated delivery direction | Delivery leads | See `delivery-operations.md` |

## Product Boundary and Regulatory Evidence

- **MVP boundary:** sell dietary and health supplements only. Medicines and prescription workflows are deferred to a later licensed expansion.
- **Acquisition boundary:** Blog and CMS are launch capabilities because SEO is the primary acquisition strategy.
- **Classification:** “Functional food” is not one uniform legal class. Each SKU must follow its actual category and documentation route. Source: [Ministry of Health Circular 43/2014](https://vfa.gov.vn/storage/upload/13-tt-so-43-2014-tt-byt-ngay-24-11-2014.pdf).
- **Current food-safety baseline:** Resolution 15/2026/NQ-CP temporarily suspends the newer implementation regime. Decree 15/2018 therefore remains in effect until replacement legislation takes effect. Sources: [Resolution 15/2026](https://vanban.chinhphu.vn/?classid=509&docid=217667&pageid=27160), [Government explanation](https://baochinhphu.vn/tiep-tuc-ap-dung-nghi-dinh-15-2018-nd-cp-ve-an-toan-thuc-pham-cho-den-khi-co-quy-dinh-moi-102260408123934123.htm).
- **Product and advertising records:** health supplements require accepted product-registration documentation before circulation. Advertising must be confirmed and remain within the approved content. Communications must not make treatment or cure claims, claim to replace medicine, or omit the required warning. Source: [Vietnam Food Administration guidance](https://vfa.gov.vn/tin-tuc/nguoi-dan-can-luu-y-cac-diem-sau-day-truoc-khi-mua-va-su-dung-thuc-pham-bao-ve-suc-khoe.html).
- **Online advertising:** Law 75/2025 and Decree 342/2025 require online advertising to be identifiable and separable from ordinary content. SEO pages with product links, calls to action, sponsorship or specific claims may fall within advertising rules and require template-level review. Sources: [Law 75/2025](https://vanban.chinhphu.vn/?classid=1&docid=214561&pageid=27160&typegroupid=3ypegroupid%3D3), [Decree 342/2025](https://vanban.chinhphu.vn/?docid=216403&pageid=27160).
- **Required content controls:** SKU regulatory class and document validity, an approved-claim library, a mandatory disclaimer, an editorial-versus-advertising marker, reviewer, byline, and source metadata, a draft-review-approve-publish workflow, scheduled expiration, emergency unpublishing, link and call-to-action (CTA) checks, and an immutable content-version audit trail. AI must not auto-publish health claims.
- **Medicine expansion:** a later phase must separately establish a licensed pharmacy operation, a permitted online assortment, mandatory consultation, and medicine-specific disclosures. Source: [Law 44/2024 amending the Pharmacy Law](https://vanban.chinhphu.vn/?docid=212466&pageid=27160).

## Architecture Directions

- Begin as a domain-driven modular monolith with independently owned module data and contracts.
- Preserve measurable paths for extracting capabilities such as search, payment, and inventory by using the strangler pattern.
- Plan for both single-store and multi-vendor operation without reducing marketplace support to a shared `seller_id` convention.

## Functional Breadth Supplied During Discovery

The following is captured as candidate product breadth, not yet as committed MVP scope.

### Customer Storefront

- CMS-driven home, collections, flash sales, category and SEO content pages.
- Faceted search, product details with variants and rich media, comparison, recently viewed, related and personalized recommendations.
- Persistent guest and authenticated carts with login merge, wishlist, multi-step checkout, shipping quotes, discounts and payment selection.
- Email, phone-based one-time password (OTP), and social authentication; account, address book, orders, tracking, and loyalty wallet.
- Reviews with media, voting and seller replies; back-in-stock alerts; live or AI-assisted customer support.
- Promotions including coupons, flash sales, bundles and quantity tiers; optional multilingual and multicurrency operation.

### Seller and Vendor Operations

- Store registration and business/KYC verification.
- Product CRUD, spreadsheet import and bulk updates; seller-scoped inventory.
- Order handling, label printing and packing confirmation.
- Revenue, commission and settlement dashboards; seller promotions and customer chat.

### Internal Administration and Operations

- Users, RBAC, taxonomy, attribute sets, brands and catalog governance.
- Multi-warehouse inventory, low-stock alerts, system-wide order operations, RMA, refunds and returns.
- Promotions, loyalty, shipping integrations and automated rate calculation.
- Payment reconciliation, refunds, seller liabilities and settlement.
- CMS, SEO metadata, reporting, conversion funnel and customer lifetime value.
- Review moderation, violation reports, VAT/e-invoice configuration and system-wide audit logs.

### Platform Capabilities

- Multichannel notifications; search, autocomplete, typo tolerance, and ranking; asynchronous jobs; and API caching.
- Rate limits and abuse controls, third-party webhooks, versioned public APIs and OpenAPI documentation.
- Centralized logging, distributed tracing readiness, automated backup and disaster recovery.

## Candidate Domain Model Inputs

- Initial entities named by the user: User, Product, ProductVariant, Category, Inventory, Cart, CartItem, Order, OrderItem, Payment, Promotion, Coupon, Review, Shipment and Notification.
- The supplied Prisma-like fields are hypotheses for downstream modeling, not yet authoritative aggregate boundaries.
- Architecture must revisit Product versus seller Offer, Variant versus Stock Position, Order versus Fulfillment, and Payment versus Ledger/Settlement before producing `PRISMA-SCHEMA.md`.

## Candidate Non-Functional Requirements

- Security: OWASP Top 10 controls, Argon2/bcrypt password storage, HTTPS, rotating session/token credentials and minimized PCI scope.
- Performance: CDN-backed media; server-side rendering (SSR) or incremental static regeneration (ISR), where appropriate; and a provisional time-to-first-byte (TTFB) target of less than 200 ms for the listing API, pending definitions of the measurement conditions and percentile.
- Scalability: stateless application nodes and a measured path to read replicas rather than mandatory day-one infrastructure.
- Reliability: bounded retries, timeouts, circuit breakers and idempotency for payment and logistics adapters.

## Current Compliance Baseline — Vietnam Launch

This section records discovery evidence as of 2026-08-25 and is not a substitute for legal or PCI assessment before go-live.

- Personal data: use Vietnam's Law on Personal Data Protection 91/2025/QH15 and Decree 356/2025/ND-CP as the current baseline; Decree 13/2023 is no longer the operative baseline. Candidate product implications include versioned consent/legal-basis records, data classification, data-subject request workflows, retention/deletion rules, processor records and cross-border transfer assessments. Sources: [official legal text](https://vbpl.vn/bocongan/Pages/vbpq-toanvan.aspx?ItemID=187276), [Government introduction](https://xaydungchinhsach.chinhphu.vn/quoc-hoi-da-thong-qua-luat-bao-ve-du-lieu-ca-nhan-119250626153701582.htm).
- E-commerce and marketplaces: from 2026-07-01, Law on E-Commerce 122/2025/QH15 and Decree 248/2026/ND-CP require stronger seller verification, platform rules, complaint handling, information retention and cooperation duties. Consumer-protection duties also affect seller transparency, reviews, moderation and algorithmic practices. Sources: [Law 122/2025](https://vanban.chinhphu.vn/?docid=216503&pageid=27160), [Decree 248/2026](https://vanban.chinhphu.vn/?docid=218747&orggroupid=2&pageid=27160), [Ministry of Industry and Trade summary](https://moit.gov.vn/tin-tuc/bo-cong-thuong-pho-bien-luat-thuong-mai-dien-tu-va-nghi-dinh-so-248-2026-nd-cp.html).
- Electronic invoices: do not base the requirement only on Decree 123/2020 or its amendment, Decree 70/2025. As of 2026-07-01, the baseline is Law on Tax Administration 108/2025/QH15, Decree 254/2026/ND-CP, Circular 91/2026/TT-BTC, and any subsequent replacements. Sources: [Law 108/2025](https://vanban.chinhphu.vn/?docid=216541&orggroupid=1&pageid=27160), [Decree 254/2026](https://vanban.chinhphu.vn/?docid=218689&pageid=27160), [Circular 91/2026](https://vanban.chinhphu.vn/?docid=219006&pageid=27160).
- Payment-card security: PCI DSS v4.0.1 is active. A hosted payment service provider (PSP) can reduce scope but does not automatically remove merchant obligations. The applicable Self-Assessment Questionnaire (SAQ) and controls depend on the integration and the determination of the acquirer or Qualified Security Assessor (QSA). Prefer hosted payment pages, and prevent primary account numbers (PANs) and card verification values (CVVs) from entering application logs, analytics, or storage. Sources: [PCI SSC v4.0.1 announcement](https://blog.pcisecuritystandards.org/just-published-pci-dss-v4-0-1), [PCI SSC document library](https://www.pcisecuritystandards.org/document_library/?class=pcidss&doc=pci_dss).
- Domestic payment integrations: browser return URLs do not provide authoritative payment status. VNPAY and MoMo both document authenticated server notifications; integrations need signature verification, idempotency, replay protection, status query, refund and reconciliation workflows. Sources: [VNPAY payment API](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html), [VNPAY query/refund](https://sandbox.vnpayment.vn/apis/docs/truy-van-hoan-tien/querydr%26refund.html), [MoMo payment API](https://developers.momo.vn/v3/docs/payment/api/collection-link/), [MoMo IPN handling](https://developers.momo.vn/v3/docs/payment/api/result-handling/notification/).

## Open Decisions and Evidence Gaps

- **PRD:** prioritize the discovery capability inventory into MVP and later phases; select payment methods, logistics providers, return policy and fulfillment model.
- **Architecture:** resolve Product versus seller Offer, Variant versus Stock Position, Order versus Fulfillment, and Payment versus Ledger/Settlement; define the listing-latency percentile, load and cache conditions.
- **Legal/compliance:** validate every SKU classification and document; review content and campaign templates; assign regulatory-watch ownership; replace unresolved discovery citation labels `[web:7]`, `[web:9]` and `[web:13]` with authoritative evidence or discard them.
- **UX/implementation:** confirm brand identity and implementation stack; `html-tailwind` remains a temporary planning fallback.

## UX/UI Baseline

- `design-system/ecom/MASTER.md` is the provisional visual source of truth. Preserve WCAG AA contrast, visible focus indicators, keyboard navigation, meaningful alternative text for images, announced form errors, and reduced-motion handling. Revisit the brand and temporary `html-tailwind` fallback when the implementation stack is selected.
