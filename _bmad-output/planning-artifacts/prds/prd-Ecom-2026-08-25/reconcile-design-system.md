# Input Reconciliation — `design-system/ecom/MASTER.md`

**Compared with:** `prd.md`  
**Source provenance:** Generated 2026-08-25; global design-system baseline with page-level overrides explicitly taking precedence.  
**Verdict:** Substantially represented, with responsive and accessibility outcomes carried into the PRD without copying implementation CSS. Four gaps should be resolved before the design source is treated as authoritative downstream.

## Coverage Assessment

| Concern | Reconciliation |
| --- | --- |
| Accessibility | **Partially captured.** NFR-1 preserves WCAG 2.2 AA, keyboard operation, visible focus, image alternatives, announced errors, labels, zoom, and reduced motion. The source's contrast and focus intent is therefore present, but its generated palette has not been evidenced as compliant across every token pairing and state. |
| Interaction | **Partially captured.** The PRD rejects dark patterns and inaccessible icon-only controls and requires reduced motion. Exact hover transforms, transition durations, cursor rules, component CSS, icon-library choices, and GSAP are correctly not promoted to product requirements. The source's no-JS/visibility safeguard for reveal motion is only implicit in NFR-3. |
| Responsive behavior | **Well captured.** NFR-2 carries the four source widths (375, 768, 1024, and 1440 px), no horizontal scrolling, and protection from navigation covering content. Section 5.3 also preserves a single semantic content source across breakpoints. |
| Design provenance and authority | **Mostly captured.** Document Purpose labels the Master file provisional; A-7 says the visual identity is provisional; page-specific overrides are required. However, the PRD's instruction to “use” its global tokens sits beside the source's “strictly follow” wording, leaving ambiguity over whether generated tokens are recommendations or binding product requirements. |
| Recommendation scope | **Generally correct.** The PRD does not freeze hex values, fonts, spacing, shadows, radii, GSAP, or sample CSS. Stable product outcomes are separated from implementation. The remaining ambiguity is which parts of the generated source may change during UX validation. |

## Gaps to Resolve

### 1. Generated color tokens lack an accessibility evidence gate

The Master file claims accessibility focus and a 4.5:1 text-contrast minimum, but provides no pairing/state matrix proving that every generated foreground, background, border, disabled, hover, focus, and error combination meets WCAG 2.2 AA. The PRD both requires WCAG conformance and points downstream teams to the global tokens, which could be misread as approval of the palette.

**Recommended disposition:** Treat the hex values as candidates. Before UX sign-off, validate text contrast, non-text contrast, focus indicators, and interactive states; allow tokens to change wherever evidence fails. Preserve the WCAG outcome, not the generated values.

### 2. Source authority remains ambiguous

The PRD correctly calls the design source provisional, but the source instructs implementers to follow it strictly when no page override exists, while PRD section 5.3 directs them to use its global tokens. A-7 also says “accessibility and interaction guardrails are stable” without separating stable outcomes from provisional styling rules. That combination could freeze generated fonts, timing, hover behavior, cursor rules, or component CSS unintentionally.

**Recommended disposition:** State in the UX/design handoff that the Master file is a generated baseline and source of candidates, not a product contract. WCAG outcomes, responsive usability, semantic parity, visible focus, reduced-motion support, and anti-dark-pattern rules are normative; palette, typography, spacing, shadows, radii, icon set, transition timing, animation library, and sample CSS remain subject to UX validation and page context.

### 3. Required page overrides are not enumerated

PRD section 5.3 requires page-specific overrides but does not retain the source's named surfaces: Home, Category/Search, Product Detail, Cart/Checkout, Editorial Content, Account, and Admin. Without the list or an equivalent completion gate, high-risk transactional and operator surfaces could reach implementation using only generic component examples.

**Recommended disposition:** Make an approved page-level UX specification a pre-implementation handoff for those seven surfaces, plus policy/SEO surfaces where their behavior is distinct. Page overrides may refine presentation but must not weaken PRD accessibility, compliance, disclosure, or responsive outcomes. Keep this as a downstream design-completeness gate rather than seven frozen layouts in the PRD.

### 4. Motion fallback is not explicit enough

The Master file warns against rendering SEO or task content invisible by default without a no-JS fallback. NFR-1 requires reduced motion and NFR-3 requires crawlable semantic content, but neither explicitly requires primary content and actions to remain visible and usable when animation, JavaScript, or the motion library fails.

**Recommended disposition:** Add a UX acceptance criterion or refine the relevant NFR during finalization: reveal motion must be progressive enhancement; primary content and actions remain visible, operable, and crawlable without animation; reduced-motion preferences suppress nonessential movement. Do not mandate GSAP, ScrollTrigger, the sample easing, or the 300–400 ms recommendation.

## Items Correctly Left Outside the PRD

- Exact palette, font imports, spacing and shadow tokens, radii, and component CSS.
- Specific hover translations and universal transition timing.
- Heroicons/Lucide selection and `cursor:pointer` as implementation conventions.
- GSAP/ScrollTrigger and the sample reveal code.
- Optional 3D/360 media, which the source already scopes to evidence-backed Product Detail use rather than a global requirement.

These belong in the design-system/UX layer and may be tested or replaced without changing product intent, provided the PRD's accessibility, trust, compliance, responsive, and interaction outcomes remain satisfied.
