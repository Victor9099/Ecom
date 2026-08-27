# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

TypeScript monorepo — confirmed:
- **Runtime:** Node.js 24.19.0, pnpm 11.24.0
- **Storefront + Admin:** Next.js ≥16.3.3
- **API + Worker:** NestJS 11.2.3
- **ORM:** Prisma 7.10.0 (ESM, `@prisma/adapter-pg`)
- **Database:** PostgreSQL 18.6
- **Frontend foundation:** Tailwind CSS, shadcn/Base UI, Lucide, and GSAP for bounded progressive enhancement
- **Structure:** `apps/storefront`, `apps/admin`, `apps/api`, `apps/worker`, `modules/<context>`, `platform/`, `packages/ui`, `packages/config`

## Users

**Primary:** Vietnamese health-conscious consumers researching and purchasing dietary supplements online. They arrive via organic search, expect Vietnamese-language content, VND pricing, and trustworthy product information backed by regulatory evidence. They range from first-time supplement buyers seeking guidance to experienced users comparing specific formulations.

**Secondary (operator):** Viktor — the owner-operator who manages the catalog, content, orders, compliance workflows, and business operations through an admin surface. He needs efficient tools for governed publishing (content approval, claim verification, SKU evidence gating) and operational visibility.

## Product Purpose

Ecom is a single-store, owner-operated e-commerce platform selling health and dietary supplements in Vietnam. It connects educational, SEO-optimized health content with a regulated product catalog — making discovery through organic search the primary acquisition channel, and trust through transparent, evidence-backed product information the conversion mechanism. Success means becoming a recognized, compliant destination for supplement buyers in Vietnam, with organic traffic as the dominant growth engine.

## Positioning

Trust through governed commerce. Unlike general marketplaces or unregulated supplement sellers, every product claim is verified against an approved claims library, every SKU passes evidence gates (Ministry of Health documentation), and editorial content is separated from commercial content with mandatory disclaimers. The mechanism — a compliance layer integrated into the publishing and catalog workflows — is the differentiator a neighboring product could not truthfully copy without building the same governance infrastructure.

## Operating Context

- **Discovery:** Organic search (Google) drives traffic. SEO content (articles, guides, ingredient explainers) funnels to product pages.
- **Purchase flow:** Browse/search → product detail → cart → checkout → hosted PSP payment → order confirmation → fulfillment tracking.
- **Compliance workflows:** Human content approval pipeline, SKU evidence gating, claim verification against Circular 43/2014 and Decree 15/2018, advertising/editorial separation, audit trails.
- **Regulatory environment:** Vietnam Ministry of Health regulations, Law 75/2025 (advertising), Law 122/2025 (e-commerce), Decree 248/2026, Law 91/2025 (personal data), PCI DSS v4.0.1, OWASP ASVS 5.0 L2.
- **Currency/Locale:** Vietnamese đồng (VND), Vietnamese language, Vietnam-first market.
- **Launch gates:** 7 gates (LG-1 through LG-7) must close before go-live.

## Capabilities and Constraints

**Confirmed capabilities (from PRD, 46 functional requirements):**
- Governed CMS/SEO publishing with approval workflows
- Regulated product catalog with evidence gates and approved claims library
- Product discovery (search, categories, filtering, merchandising)
- Cart, checkout, and hosted PSP payment integration
- Order management, fulfillment, and shipment visibility
- Returns and refunds with safety holds
- Customer accounts, support, and transactional communication
- RBAC, audit logging, and operator reporting
- Analytics and organic demand validation

**Hard constraints:**
- Supplements only — no medicine, no prescriptions
- Single store — not a marketplace, not SaaS
- Vietnam-first — Vietnamese language, VND currency, local regulatory compliance
- Hosted PSP for payments (no raw card handling)
- WCAG 2.2 AA accessibility
- Transactional outbox pattern for distributed consistency
- Every frontend surface must use both `ui-ux-pro-max` and `impeccable`; neither workflow may be silently skipped or replaced by ad-hoc styling.
- Before frontend implementation, read `PRODUCT.md`, `design-system/ecom/MASTER.md`, and the matching file under `design-system/ecom/pages/`. Create the page override with UI/UX Pro Max when it does not yet exist.
- Impeccable owns frontend product context, surface shaping, craft checks, and bounded visual verification. UI/UX Pro Max owns searchable design guidance, the persistent Master system, stack-specific rules, and page overrides.
- Frontend delivery is `code-first`. GSAP must respect reduced-motion preferences and must never make SEO, product evidence, compliance disclosures, navigation, or core actions depend on animation or client hydration.

**Explicitly deferred (not in MVP):**
- Marketplace / multi-vendor
- Multi-warehouse inventory
- AI chatbot / ML personalization
- Public API
- Microservices decomposition

## Brand Commitments

Provisional (pending category/audience validation):
- **Name:** Ecom (working name)
- **Fonts:** Rubik (headings), Nunito Sans (body) — from provisional design system
- **Primary color:** `#15803D` (pharmacy green)
- **Accent/CTA:** `#0369A1` (trust blue)
- **Mood:** Clean, trustworthy, health-oriented, conversion-focused
- No logo, no finalized visual identity, no brand guidelines beyond the provisional design system at `design-system/ecom/MASTER.md`

## Evidence on Hand

**Planning artifacts (all in `_bmad-output/`):**
- Product brief with regulatory addendum and delivery observations
- PRD with 46 functional requirements, 12 NFRs, 9 compliance requirements, 8 user journeys
- Architecture spine with 29 decisions, 17 bounded contexts, delivery topology
- Specification with 12 validated capabilities (CAP-1 through CAP-12)
- Requirements traceability matrix
- 9 epics with detailed story breakdowns
- 13 architecture review documents

**Design system:** Provisional design system at `design-system/ecom/MASTER.md` (colors, typography, spacing, shadows, breakpoints, motion guidelines).

**Absent:** No customer testimonials, no case studies, no real product data, no real content, no logo or finalized brand assets. Future work must not fabricate these.

## Product Principles

1. **Trust is the product.** Every surface decision — from product claims to checkout confirmation — must reinforce that this is a regulated, evidence-backed source. Compliance is not a constraint to work around; it is the value proposition.

2. **Organic first, always.** Discovery happens through search. Content and product surfaces must be built for crawlability, structured data, and informational intent. The SEO-content-to-product pipeline is the primary growth mechanism.

3. **Governed by default.** Publishing, catalog changes, and claim edits flow through approval workflows. The system makes the compliant path the easy path, and the non-compliant path impossible.

4. **Vietnam-native.** Not localized — native. Vietnamese language, VND pricing, local payment methods, local regulatory framework, local search behavior. This is not a translated international template.

5. **Monolith until proven otherwise.** A modular monolith with clear bounded contexts, not microservices. Decomposition happens only when a boundary proves it needs independent deployment, not before.

## Accessibility & Inclusion

- Meet WCAG 2.2 AA across Storefront and Admin surfaces.
- Support keyboard-only operation, visible focus, semantic structure, screen-reader labels, reduced motion, and 200% zoom without loss of content or function.
- Use Vietnamese-first copy and validation messages that remain understandable without relying on color, icons, or technical language alone.
