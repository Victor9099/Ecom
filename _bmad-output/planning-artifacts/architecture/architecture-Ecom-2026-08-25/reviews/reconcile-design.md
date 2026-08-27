# Architecture Input Reconciliation — Design System

**Source:** `design-system/ecom/MASTER.md`  
**Compared with:** `ARCHITECTURE-SPINE.md`  
**Verdict:** Partial landing. The spine correctly treats final brand tokens and page designs as UX-owned, preserves required SEO content without client JavaScript, and seeds a domain-free shared UI package. Five frontend invariants remain too implicit for independently built surfaces to converge. There is no direct contradiction, but the authority hierarchy between generated design guidance, approved page overrides, and PRD outcomes is unresolved.

## What Landed

- The design source is declared in spine frontmatter, preserving provenance.
- AD-8 requires Storefront rendering to preserve required SEO content without client JavaScript.
- The structural seed provides `packages/ui` for accessible visual primitives and explicitly excludes domain behavior.
- The Deferred section assigns page-level UI overrides and final brand tokens to UX rather than freezing them in architecture.
- Exact hex values, fonts, shadows, radii, GSAP/ScrollTrigger, transition timing, and sample CSS are correctly absent from the architecture spine; they are not load-bearing architecture decisions.

## Findings

### 1. High — Accessibility is seed commentary, not an invariant

**Source constraint:** Visible focus, keyboard-oriented focus treatment, contrast validation, reduced motion, and accessible interaction states are mandatory pre-delivery outcomes.

**Spine evidence:** `packages/ui` is described as “accessible visual primitives,” and AD-13/AD-15 provide generic evidence and enforcement rules, but no AD binds Storefront, Admin, and `packages/ui` to one accessibility contract. A directory comment is superseded once code exists and cannot prevent separate teams from choosing incompatible semantics, focus behavior, motion behavior, or color-state validation.

**Minimum reconciliation:** Add a frontend invariant that shared primitives own semantic roles and keyboard/focus/motion behavior; Storefront and Admin compose rather than fork those primitives; WCAG 2.2 AA evidence covers default and interactive states; generated token pairings are not accepted without contrast evidence; automated accessibility checks plus primary-journey keyboard testing participate in AD-13/AD-15 release evidence. Bind NFR-1 without freezing a component library or visual token value.

### 2. High — Token and page-override authority has no precedence rule

**Source constraint:** A page file overrides the generated Master file; otherwise the Master says to follow its global rules strictly.

**Spine evidence:** Deferred says final brand tokens and page-level overrides are UX-owned, but it does not state whether the generated Master values are defaults, requirements, or merely candidates, nor whether a page override may weaken accessibility or PRD guardrails. It also does not identify the code owner of accepted tokens.

**Minimum reconciliation:** Fix one authority chain: **PRD accessibility/compliance/responsive outcomes → approved page specification → approved global design tokens → generated Master candidates**. Accepted global primitives/tokens live behind `packages/ui`; applications do not create private competing token sets. Page overrides may change presentation but cannot weaken higher-order outcomes. This resolves the Master file's “strict” wording without adopting its generated values as architecture law.

### 3. High — The single-semantic-source responsive rule did not land

**Source constraint:** One semantic content source must serve all breakpoints; layout adapts without duplicated mobile and desktop content. The delivery widths are 375, 768, 1024, and 1440 px, with no horizontal scroll or content obscured by fixed navigation.

**Spine evidence:** Neither an AD nor the Structural Seed governs responsive rendering. Separate feature teams can implement parallel mobile/desktop DOM trees, duplicate data paths, or divergent disclosure content while still fitting the current app/package tree.

**Minimum reconciliation:** Add a frontend rendering invariant: each public route has one semantic content/data source and one authoritative disclosure tree across breakpoints; responsive behavior is a presentation concern using shared composition and CSS/layout primitives, not separate mobile/desktop business views. Validate the PRD widths and overflow/obscured-content conditions in system/UI evidence. Do not mandate specific breakpoints inside domain modules.

### 4. Medium — No-JS and motion fallback is only partially bound

**Source constraint:** Reveal effects must not make SEO content invisible by default without a no-JS fallback, and reduced-motion preferences must be respected.

**Spine evidence:** AD-8 protects “required SEO content without client JavaScript,” which is a strong partial landing, but it does not prevent a client motion layer from initially hiding rendered content or critical disclosures until hydration/animation succeeds. Reduced motion is not mentioned in a load-bearing rule.

**Minimum reconciliation:** Extend the frontend/AD-8 rule so public semantic content, Product evidence, disclosures, and primary navigation render visible by default; client animation is progressive enhancement and cannot gate visibility or crawlability; reduced-motion preferences suppress nonessential movement. Keep JavaScript-dependent transactional behavior outside this no-JS guarantee unless separately required.

### 5. Medium — Required page overrides and the shared Storefront shell have no implementation gate

**Source constraint:** Home, Category/Search, Product Detail, Cart/Checkout, Editorial Content, Account, and Admin require explicit page rules before implementation. The page pattern also defines a shared ecommerce shell: trust/header, search/category navigation, contextual cart/account access, content slot, and compliance/policy footer.

**Spine evidence:** The Deferred item names neither the required surfaces nor the condition that closes the deferral. The Structural Seed shows applications and primitives but does not establish ownership of the Storefront shell. Page teams can therefore start independently and embed incompatible headers, navigation, disclosure/footer composition, or page-local primitives.

**Minimum reconciliation:** Enumerate the seven required UX artifacts and define “approved before surface implementation” as their revisit/closure condition. Give `apps/storefront` one shared shell/composition owner and keep `packages/ui` limited to reusable primitives; page routes supply page content and page-specific composition. Bind structural shell ownership and override precedence, not the source's exact visual layout.

## Scope Judgment

The source's visual recommendations remain properly deferred: palette, typography, spacing, depth, icon set, hover transforms, animation library, and duration values should not become ADs. The load-bearing additions are authority, ownership, semantic rendering, accessibility enforcement, and progressive-enhancement rules—the constraints that multiple frontend units could otherwise implement incompatibly.
