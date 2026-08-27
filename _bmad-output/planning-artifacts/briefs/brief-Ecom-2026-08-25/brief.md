---
title: "Product Brief: Ecom"
status: final
created: 2026-08-25
updated: 2026-08-25
---

# Product Brief: Ecom

## Executive Summary

Ecom is an owner-operated, SEO-led online store for health supplements in Vietnam. It will connect trustworthy educational content with a complete buying journey: discovery through search and editorial pages, clear product information, confident selection, checkout, delivery tracking and post-purchase support.

The first release is deliberately a single-store business, not a marketplace. It must help one operator publish compliant content, manage a regulated supplement catalog, sell reliably and learn which audiences and health needs produce sustainable organic demand. The underlying product should remain extensible enough to add richer operations, multiple vendors or medicine sales later without forcing an early replatform, but those possibilities must not inflate the initial launch.

For customers, Ecom promises a trustworthy path from health-information discovery to purchase. For the operator, it promises one governed workspace for content, catalog, orders, inventory, promotions, support and performance insight.

[ASSUMPTION] Ecom’s initial business model is direct retail margin on products owned or sourced by the operator. It is not initially sold as software to other merchants.

## The Problem

People searching for supplements encounter a fragmented journey. Educational articles, product claims, seller credibility, product documentation and checkout often live in disconnected experiences. Content may be optimized for clicks without helping a customer judge whether a product is appropriate, authentic or represented accurately. The result is low trust, difficult comparison and a greater risk of misleading health claims.

For the operator, generic ecommerce tools can support a catalog and cart but do not naturally govern the relationship between regulated product records, approved claims, SEO content, advertising status and publication history. A custom microservice platform would provide control but impose excessive delivery and operating cost before demand is proven.

Ecom must cross this gap: launch a credible health-supplement business quickly while preserving control over content, catalog truth, customer data and future domain evolution.

## Initial Customer and Job to Be Done

[ASSUMPTION] The initial customer is a Vietnamese adult who begins with a search query about a wellness goal or supplementation question, values understandable evidence and product transparency, and is willing to buy online when the seller appears credible and the purchasing path is simple.

The customer’s core job is not merely “buy a supplement.” It is:

> Help me understand my options, distinguish responsible information from sales claims, and complete a trustworthy purchase without unnecessary friction.

The operator’s job is:

> Help me turn accurate, governed content into qualified organic demand and fulfill orders reliably without losing control of compliance, catalog quality or customer trust.

The audience is intentionally broad until SEO and sales evidence identifies a viable segment. Ecom must therefore instrument discovery rather than claim a narrow persona prematurely.

## What Makes This Different

- **Content and commerce share one trust model.** Educational pages, commercial content and product records are connected, but their roles are visibly distinguished.
- **Compliance is part of publishing.** Claims, disclaimers, sources, reviewers, approval status and change history are governed rather than managed through informal checklists.
- **SEO is a product loop.** Search demand informs content and assortment; content leads into relevant products; conversion and support signals improve future content priorities.
- **The first release stays operationally simple.** Ecom starts as an owner-operated single store and avoids marketplace, medicine and distributed-systems complexity before business evidence justifies it.
- **Expansion does not require abandoning the core.** Product, offer, inventory, order, fulfillment, payment and financial responsibilities remain separable so later capabilities can evolve without corrupting commercial history.

“Modular,” “headless” and “API-first” are not customer-facing differentiators by themselves. Ecom must earn differentiation through trusted content, disciplined product governance and a lower-friction path from organic discovery to purchase.

## Success Criteria

Business baselines will be established during the first release because no current traffic or customer segment exists.

- [ASSUMPTION] Publish a launch-ready catalog and an initial body of governed SEO content without unresolved regulatory blockers.
- [ASSUMPTION] Reach the first attributable organic orders within 90 days of indexation and establish a monthly organic conversion baseline within six months.
- Track search impressions, qualified organic sessions, article-to-product progression, add-to-cart rate, checkout completion and repeat purchase without overstating causality.
- Maintain zero knowingly published treatment or cure claims, zero sales of products lacking required and valid documentation, and a complete audit trail for content corrections or withdrawals.
- Achieve reliable order and payment reconciliation, with no payment captured or order fulfilled more than once because of retry behavior.
- [ASSUMPTION] Keep core storefront pages within agreed Core Web Vitals targets and make primary purchase journeys conform to WCAG 2.2 AA expectations.
- Measure fulfillment accuracy, cancellation rate, refund cycle time, stock accuracy and customer-support burden as operating-health indicators.

### Counter-Metrics

- Organic traffic that does not lead to useful engagement, qualified product discovery or purchase is not success by itself.
- Content volume must not rise at the cost of accuracy, review quality or regulatory compliance.
- Conversion improvements must not come from misleading urgency, hidden conditions or unsafe personalization.
- Service count and infrastructure complexity are not measures of platform maturity.

## Major Risks and Unknowns

- The initial health need and customer segment are unknown; broad positioning may dilute SEO authority and assortment decisions.
- Willingness to trust and buy from a new operator has not been validated.
- Product sourcing, authenticity controls, margin, fulfillment model and return policy remain undefined.
- Legal classifications and advertising approvals must be verified for each SKU and content template before launch.
- Health and advertising regulations are changing; the product requires a regulatory-watch owner and release checks.
- Numerical performance and growth targets are provisional until hosting, traffic shape, assortment and acquisition economics are known.

## Experience Principles

- **Trust before persuasion:** show product identity, approved information, required warnings, source dates and commercial context clearly.
- **Education without diagnosis:** content supports informed exploration and indicates when professional advice is appropriate; it does not impersonate medical care.
- **Accessible by default:** mobile-first, readable, keyboard operable, high contrast and explicit about errors and system state.
- **Progressive disclosure:** keep storefront tasks simple while making supporting detail available to customers who need it.
- **No dark patterns:** discounts, stock indicators, reviews, recommendations and subscriptions must not manufacture urgency or conceal conditions.

Visual baseline: `design-system/ecom/MASTER.md`. [ASSUMPTION] Brand identity remains provisional pending category and audience validation.

## MVP Scope

### Customer Experience

- SEO-capable home, category, product, editorial and policy pages managed through CMS.
- Health-supplement catalog with variants, media, product attributes, regulatory disclosures and availability.
- Search, category navigation and practical filters; product comparison may be included only if it materially helps the initial assortment.
- Persistent guest cart, cart merge after sign-in and a concise checkout covering address, delivery, discount and payment.
- Guest purchase plus basic account access for orders, addresses and tracking. [ASSUMPTION]
- Order confirmation, status notifications and shipment tracking.
- Moderated product reviews; apply verified-purchase labels only where evidence supports them.
- Back-in-stock subscription and basic related-product discovery.

### Operator Experience

- Catalog, category, brand, variant, inventory and price management.
- CMS workflow for drafting, reviewing, approving, publishing, expiring and withdrawing content.
- Governance for product documentation and approved claims, sufficient to prevent publication or sale when required records are missing or expired.
- Order, payment, shipment, cancellation, return and refund operations.
- Basic promotions and coupons without a general-purpose rule engine.
- Customer-service notes, notification templates and immutable audit history for sensitive actions.
- Operational reporting for traffic source, search landing pages, conversion, orders, products and inventory.

### Launch Envelope

- Vietnam-first, Vietnamese-first and VND-first. [ASSUMPTION]
- One legal seller, one operational inventory location and domestic delivery for the first launch. [ASSUMPTION]
- Health supplements only; medicine sales and prescription workflows are excluded.
- Hosted or redirected domestic payment integrations are preferred to minimize card-data exposure; exact payment methods remain to be selected.

## Explicitly Out of MVP

- Multi-vendor onboarding, seller portal, commissions, split payments and seller settlements.
- Prescription or non-prescription medicine sales and pharmacist consultation workflows.
- Multiple warehouses, international selling, multiple currencies and complex tax jurisdictions.
- Personalized health profiling or advertising based on sensitive health data.
- Advanced loyalty, AI chatbot, autonomous health-content publication, dynamic pricing and machine-learned recommendations.
- Public developer platform, independently deployed microservices, dedicated search cluster and data warehouse.

These items may be revisited only when customer evidence, operating load, regulation or unit economics creates a measurable trigger.

## Vision

If the first store proves repeatable demand, Ecom can become a trusted health-commerce operating system spanning governed content, catalog and reliable operations. New supplement categories, retention programs, additional warehouses, and carefully governed personalization will follow supporting evidence. Multi-vendor expansion requires proven demand and mature seller-verification, liability, and settlement operations; medicine sales remain a separate licensed expansion. The architecture preserves these options without promising them in the first release.
