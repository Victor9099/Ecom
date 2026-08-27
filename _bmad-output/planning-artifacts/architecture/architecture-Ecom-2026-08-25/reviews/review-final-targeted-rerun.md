# Final Targeted Architecture Rerun — `ARCHITECTURE-SPINE.md`

**Scope:** Verify only the five findings from `review-final-combined.md` against amended AD-6, AD-11, AD-15, AD-23, AD-24, and AD-26; then scan those fixes for new Critical/High regression.  
**Verdict:** **All five targeted findings are resolved. One new High interaction regression remains; no new Critical issue was found.** The gate is not yet clean because AD-23's corrective Refund path has no valid approval source under AD-24 for a canceled, unfulfilled Order.

## Targeted Verification

| Prior finding | Status | Evidence |
| --- | --- | --- |
| Concurrent approved Refunds can exceed captured balance | **Resolved** | AD-24 makes Orders atomically reserve refundable entitlement using aggregate versioning/serialization and makes Payments transactionally enforce `captured − refunded − in-flight authorized`; AD-15 requires concurrent Refund invariant checks. |
| Late Payment success conflicts with terminal canceled Order | **Resolved as a state-integrity rule** | AD-23 keeps the canceled Order terminal, creates a Payments reconciliation exception, blocks Fulfillment, uses expected-version commands, and directs corrective Refund/audited correction instead of reopening or holding the Order. The Refund-path interaction regression is recorded below. |
| Distinct reservations can oversell | **Resolved** | AD-6 requires atomic availability check plus reservation creation, row serialization or conditional versioning, a database-backed nonnegative invariant, conditional transitions, and distinct-command concurrency tests; AD-15 enforces Stock concurrency evidence. |
| Non-HTTP command paths can bypass authorization | **Resolved** | AD-11 moves capability/resource authorization to the owning application-command boundary for every HTTP, Worker, schedule, event, provider, human, and service actor; AD-15 enforces all-adapter authorization. |
| Active-content uploads can produce stored attacks | **Resolved** | AD-26 requires quarantine, size/type allowlists, MIME/magic-byte validation, malware scanning, safe transformation, isolated-origin delivery, CSP, `nosniff`, safe disposition, and no inline untrusted SVG/HTML/PDF; AD-15 enforces upload safety behavior. |

## New High Regression

### AD-23 corrective Refund × AD-24 approval source — cancellation refunds have no authorized instruction producer

- **Location:** AD-23 and AD-24; AD-5 ownership; FR-33 through FR-35 binding
- **Trigger condition:** A verified Payment succeeds after Checkout has terminally canceled the Order. AD-23 correctly requires a Payments reconciliation exception and an approved corrective Refund. AD-24, however, states that Returns supplies the approved items, quantities, reasons, and evidence before Orders can calculate `ApprovedRefundInstruction`. A canceled, unfulfilled Order has no Return Request and Returns owns only Return Request decisions. Every module can obey its AD literally yet no module can supply the prerequisite approval without crossing ownership or fabricating a Return Request.
- **Guard snippet:** Generalize the input to a canonical `RefundApproval` with explicit sources: Returns for post-fulfillment returns; Orders for policy-approved pre-fulfillment cancellation; Payments/Reconciliation plus an authorized Operator for success-after-terminal-cancel or provider correction. Orders remains the sole monetary calculator and entitlement reserver; Payments remains the sole executor; Finance remains the sole ledger/invoice poster. Each source carries reason, evidence, actor/authority, eligible lines/charges, and idempotency identity.
- **Potential consequence:** Captured funds remain stranded against a canceled Order, Operators invent an invalid Return Request to unlock the Refund path, or an ad hoc Payments-side calculation bypasses AD-24's cap/allocation controls.

## Regression Scan Result

- **Critical:** 0 new findings.
- **High:** 1 new finding, the AD-23/AD-24 approval-source conflict above.
- The atomic reservation, cumulative Refund cap, all-adapter authorization, and media-safety amendments introduce no other Critical/High literal-compliance divergence found in this targeted pass.

## Gate Summary

- Targeted findings: **5 resolved, 0 unresolved**.
- Fix-induced regressions: **0 Critical, 1 High**.
- Final targeted gate: **Fail until the Refund approval-source rule is made compatible with cancellation and Payment-reconciliation refunds.**
