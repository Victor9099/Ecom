# PRD Critical/High Finding Rerun — Ecom

## Overall verdict

All five prior Critical/High PRD-quality findings are resolved in the updated draft. The underlying launch decisions and evidence are not all complete, but § 5.4 now makes them explicit, owned gates with closure artifacts and blocking effects; the PRD no longer presents them as settled or allows the affected launch claim to pass silently. No new critical or high regression was introduced by the fixes.

## Finding verification

### 1. Foundational launch contract is still open — resolved

- **Prior severity:** critical
- **Exact evidence:** § 5.4 states, "implementation cannot be called launch-ready until every gate has an accepted artifact." LG-1 through LG-7 then name an owner, required closure artifact, and blocking effect for assortment/economics, compliance, providers, policy/lifecycle, SLO/capacity, security/privacy, and operational rehearsal. § 10 Questions 1–6 are now explicitly mapped to LG-1 through LG-5, while Question 11 maps retention and authority-response work to LG-2/LG-4.
- **Judgment:** The unanswered matters remain real launch blockers, but they are no longer an unbounded PRD defect: LG-1 blocks catalog seeding, LG-2 blocks publication/sellability, LG-3 blocks provider-specific stories and production Checkout, LG-4 blocks end-to-end acceptance and production Orders, and LG-5–LG-7 block production/public launch.
- **Remaining minimum action:** Complete and accept each listed gate artifact before claiming the corresponding implementation or launch state; no further critical/high PRD edit is required.

### 2. MVP breadth is not sequenced by the evidence thesis — resolved

- **Prior severity:** high
- **Exact evidence:** § 7.3 now separates **Launch-essential**, **Evidence-triggered MVP follow-on**, and **Later** capabilities. It ties the launch-essential set to UJ-1, UJ-3, UJ-4, UJ-5, UJ-7 and LG-2–LG-7; places coupons, related Products, account history, Reviews, Back-in-stock Subscription, enriched filters, and returns self-service after the stable transaction path or measured demand/support evidence; and says those follow-ons "may not delay the first controlled sale unless LG-4 requires them."
- **Judgment:** The one-Operator/unknown-beachhead constraint now produces an actionable release sequence rather than an undifferentiated feature commitment, and the later class requires "explicit evidence and a new scope decision."
- **Remaining minimum action:** Preserve § 7.3 classifications when Architecture and story planning decompose FRs; no critical/high PRD edit is required.

### 3. Success metrics do not prove the product's core claim — resolved

- **Prior severity:** high
- **Exact evidence:** SM-2 now requires, within six months, "at least 30 attributable organic Orders per month for three consecutive months," organic visit-to-Order conversion `≥1.0%`, and no CR-1/CR-2 breach. SM-6a adds `≥10%` eligible 90-day repeat purchase after at least 100 Customers, counterchecked against Refund and complaint rates. A-9 records all three values as provisional validation thresholds.
- **Judgment:** The thesis of repeatable, qualified organic demand now has a time-bound pass condition, a conversion-quality threshold, a repeat-behavior check, and a compliance countercondition rather than merely a first event and descriptive baseline.
- **Remaining minimum action:** Accept or replace the provisional A-9 thresholds through product review before using them for an expansion decision; no critical/high PRD edit is required.

### 4. Production NFR gates lack measurable pass conditions — resolved

- **Prior severity:** high
- **Exact evidence:** NFR-3 defines p75 LCP `≤2.5 s`, INP `≤200 ms`, CLS `≤0.1`, and assumed cached/uncached listing p95 TTFB under LG-5; NFR-4 uses applicable OWASP ASVS 5.0 L2 controls and LG-6's zero unresolved critical/high rule; NFR-6 requires 100 duplicate/reordered events per critical scenario with exactly one outcome; NFR-7 requires 100% coverage and event-count reconciliation; NFR-9 sets assumed RPO `≤15 minutes` and RTO `≤4 hours` with a restore rehearsal; NFR-10 requires critical alerts within 5 minutes with a correlation ID; NFR-12 requires twice-forecast load for 30 minutes, NFR-3 compliance, error rate `<1%`, and approved saturation bounds. LG-5, LG-6, and LG-7 name the acceptance artifacts and blocking effects.
- **Judgment:** The production qualities now have measurable targets, test contexts, evidence packages, owners, and explicit release consequences. Provisional values are controlled assumptions subject to gate acceptance rather than undefined adjectives.
- **Remaining minimum action:** LG-5/LG-7 must accept or replace provisional performance/recovery values and LG-6 must accept the security/privacy evidence before production approval; no critical/high PRD edit is required.

### 5. Lifecycle and policy contracts are missing — resolved

- **Prior severity:** high
- **Exact evidence:** § 4.5.1 defines allowed Order, Payment, Fulfillment, and Return Request lifecycles and their guards, including `On Hold`, terminal behavior, authoritative Payment, Refund caps, Shipment evidence, and item-level quantity bounds. Its launch-decision table covers unpaid cancellation, paid/pre-Fulfillment cancellation, picking/packing review, post-dispatch returns, partial items, regulatory holds, and duplicate commands. LG-4 requires versioned delivery, cancellation, return, Refund, complaint, privacy, invoice, hold/recall, and authority-response policies aligned with § 4.5.1 and blocks production Orders until accepted.
- **Judgment:** Valid transitions and policy-dependent outcomes are now source-extractable and testable, while policy content that must be supplied externally is bound to a named closure gate.
- **Remaining minimum action:** Approve the LG-4 policy package and verify it against the § 4.5.1 state/decision tables; no critical/high PRD edit is required.

## New critical/high regression scan

None found. The new release sequencing, launch gates, numerical assumptions, lifecycle baseline, and metric thresholds reinforce rather than contradict the five fixes at critical/high severity.
