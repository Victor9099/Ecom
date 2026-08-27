# Ecom Surface Overrides

This directory contains page-specific overrides to `../MASTER.md`. An override changes only the named surface; every unspecified rule continues to come from the Master design system.

## Mandatory frontend workflow

For every frontend story:

1. Run Impeccable context once for the session and use its command appropriate to the task (`shape`, new work, audit, polish, harden, or another explicitly requested command).
2. Read `PRODUCT.md` and `design-system/ecom/MASTER.md`.
3. Read the matching override below. If it does not exist, use UI/UX Pro Max to research and create it before implementation.
4. Query UI/UX Pro Max for the detected stack (`nextjs`) and for any surface-specific accessibility, interaction, form, navigation, chart, or performance concern.
5. Implement from shared semantic content and tokens; do not introduce raw component-level color values or a competing visual system.
6. Finish with the UI/UX Pro Max pre-delivery checklist and the bounded Impeccable verification pass.

## Required surface files

- `home.md` — Storefront home and governed merchandising
- `discovery.md` — Category, search, filters, sorting, and empty states
- `product-detail.md` — Product evidence, variants, claims, availability, and purchase entry
- `cart-checkout.md` — Cart, address, delivery, coupon, payment, and authoritative outcome
- `editorial.md` — Blog, guide, ingredient content, SEO metadata, and commercial separation
- `account-support.md` — Account, orders, tracking, returns, reviews, notifications, and support
- `admin-operations.md` — Catalog, CMS, order, fulfillment, finance, compliance, and reporting operations

The seven overrides are required before their corresponding surfaces enter implementation. They must contain resolved surface decisions rather than empty templates.

## Current initialization status

- Master design system: initialized at `design-system/ecom/MASTER.md`
- Impeccable product context: initialized at `PRODUCT.md`
- Impeccable build path: `code-first`, persisted in `.impeccable/config.json`
- Surface overrides: pending surface-specific shaping and owner review
