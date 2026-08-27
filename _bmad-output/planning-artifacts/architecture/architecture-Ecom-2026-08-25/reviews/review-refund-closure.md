# Refund Approval Closure Review — `ARCHITECTURE-SPINE.md`

**Scope:** Verify only whether amended AD-24 closes the AD-23/AD-24 Refund-approval-source conflict and whether that amendment creates a new Critical/High regression.  
**Verdict:** **Pass. The conflict is resolved, with no new Critical or High regression found.**

## Closure Evidence

The amended AD-24 now defines one canonical `RefundApproval` and explicitly names every required source:

| Scenario | Approval source | Calculation/reservation | Execution cap | Financial record |
| --- | --- | --- | --- | --- |
| Post-fulfillment return | Returns | Orders converts the approval from immutable Order/policy snapshots and atomically reserves entitlement | Payments executes once and transactionally enforces the cumulative captured balance | Finance posts the unique fact and invoice adjustment |
| Policy-approved pre-fulfillment cancellation | Orders | Orders calculates and reserves under the same canonical contract | Payments applies the same exactly-once and cumulative-cap rules | Finance remains sole ledger/invoice owner |
| Success after terminal cancellation | Payments Reconciliation plus an authorized Operator | Orders calculates and reserves without reopening the canceled Order | Payments executes the corrective Refund under the same cap | Finance posts the resulting correction |
| Provider correction | Payments Reconciliation plus an authorized Operator | Orders calculates and reserves from the immutable commercial snapshot | Payments executes once under the transactional cap | Finance posts the resulting correction |

This closes the previous hole because a canceled, unfulfilled Order no longer needs a fabricated Return Request. The `RefundApproval` carries source, reason, evidence, actor/authority, eligible lines/charges, and idempotency identity before Orders produces `ApprovedRefundInstruction`.

## Interaction Check

- **AD-23 remains coherent:** Checkout still alone translates verified Payment facts into expected-version Order/Inventory commands. Payments may own the reconciliation exception without mutating or reopening the terminal Order.
- **AD-5 ownership remains coherent:** Returns owns Return Request decisions; Orders owns cancellation and the commercial snapshot; Payments owns reconciliation and Refund execution; Finance owns ledger/invoice truth.
- **AD-24 preserves separation of duties:** Approval source, monetary calculation/entitlement reservation, provider execution, and ledger posting remain distinct responsibilities.
- **Concurrency safeguards remain intact:** Orders atomically reserves entitlement, while Payments independently enforces `captured − refunded − in-flight authorized` transactionally.
- **Authorization/audit remains intact:** The exceptional Payment-reconciliation source requires an authorized Operator and carries authority/evidence fields; AD-11 applies authorization at the owning command boundary.

## Regression Result

- New Critical findings: **0**.
- New High findings: **0**.
- Closure status: **Accepted; the targeted architecture review gate is clean.**
