# Final Combined Architecture Review — `ARCHITECTURE-SPINE.md`

**Scope:** Rerun all 13 prior adversarial-divergence pairs against the amended spine, then inspect only remaining/new Critical or High regulated-commerce data-integrity and security holes.  
**Verdict:** **The 13 prior divergence findings are resolved. The final gate still fails on 1 Critical and 4 High new holes.** AD-22 through AD-28 close the earlier ownership/contract gaps, but the spine still lacks atomic concurrency rules for Refund and Stock Position, a valid terminal-state path for late Payment success, authorization coverage for non-HTTP commands, and a safety boundary for untrusted media.

## Prior Divergence Rerun

| # | Prior pair | Status | Closing rule/evidence |
| --- | --- | --- | --- |
| 1 | Catalog × Pricing — composed purchasability | **Resolved** | AD-22 makes Checkout owner of `PurchaseEligibility.v1`, fixes deny-first input order and reason codes, requires shared fixtures, and makes Discovery project the same contract. |
| 2 | Checkout × Orders — Order creation protocol | **Resolved** | AD-23 fixes Order/line ID allocation, quote/Merchant snapshot acquisition, reservation, `Pending Payment` Order creation, and Payment initiation order. |
| 3 | Payments × Orders — competing confirmation authority | **Resolved** | AD-23 makes Checkout the sole translator of verified Payment facts into Order/Inventory commands; other modules may only observe. |
| 4 | Payments × Finance — posting identity | **Resolved** | Amended AD-19 fixes the `FinancialFact` fields and assigns ledger mapping exclusively to Finance. |
| 5 | Returns × Payments — Refund calculation ownership | **Resolved for shape/ownership** | AD-24 assigns approval inputs to Returns, monetary calculation to Orders, execution to Payments, and posting/invoice adjustment to Finance. A new concurrency hole remains below. |
| 6 | Merchant × Orders/Finance — seller snapshot | **Resolved** | AD-19 establishes versioned `MerchantPartySnapshot`, captures it at Order commitment, and carries that same version into Finance/invoice commands. |
| 7 | Catalog × Content — regulated evidence identity | **Resolved** | Amended AD-8 requires canonical IDs/versions; AD-22 commits a synchronous safety denial with withdrawal and makes public responses/Notifications fail closed. |
| 8 | Governance × data owners — privacy/authority protocol | **Resolved** | AD-20 fixes the shared case envelope, owner operations, partial/terminal status, retained-with-basis result, digest, retries, and completion rule; AD-15 enforces complete owner contracts. |
| 9 | Catalog migration × Finance migration | **Resolved** | AD-25 assigns global objects/order to Platform, owner-prefixes module objects, mandates expand/migrate/contract, and tests clean plus previous-production schemas. |
| 10 | Content producer × Discovery consumer — event rollout | **Resolved** | AD-25 requires consumer-before-producer rollout, dual compatibility, drain evidence, and continued decoding of queued versions. |
| 11 | Checkout caller × Orders command — idempotency semantics | **Resolved** | AD-25 fixes key scope, canonical request hash, same/different-hash behavior, replay result, and retention horizon. |
| 12 | Product Detail × Editorial — Storefront shell | **Resolved** | AD-27 gives `apps/storefront` one exclusive shell contract/data-loader owner and prohibits route epics from reimplementing global regions. |
| 13 | Catalog Lead × Discovery Lead — contract handoff | **Resolved** | AD-28 requires producer ownership, bilateral consumer acceptance/tests, BR rollout dependencies, and Supervisor-only breaking exception approval. |

## Remaining/New Critical and High Findings

### Critical — Concurrent approved Refunds can exceed the captured balance

- **Pair:** Return Request A worker × Return Request B worker
- **Location:** AD-24, AD-19, AD-3; PRD FR-35 binding
- **Trigger condition:** Two distinct approved Return Requests for the same Order are processed concurrently. Each Orders handler reads the same prior Refund total, calculates an individually valid `ApprovedRefundInstruction`, and Payments executes each distinct instruction exactly once. Every named owner and idempotency rule is obeyed, yet the combined amount can exceed the eligible captured balance because no rule atomically reserves Refund entitlement or enforces a cumulative Payment cap.
- **Guard snippet:** Orders must atomically reserve refundable entitlement against an Order/payment version when issuing an instruction; concurrent instructions use compare-and-set or serialization. Payments must independently enforce `captured − already refunded − in-flight authorized` as a transactional cumulative cap. Finance postings and provider commands use unique instruction/posting identities.
- **Potential consequence:** Monetary loss, provider/ledger divergence, incorrect invoice reversals, and an FR-35 violation despite each Refund command being individually idempotent.

### High — Late Payment success conflicts with a terminal canceled Order

- **Pair:** Checkout timeout/cancel handler × late verified Payment-success handler
- **Location:** AD-23; AD-5 binding to PRD §4.5.1
- **Trigger condition:** Timeout cancels a `Pending Payment` Order and releases Stock Position; the provider later reports verified success. AD-23 says late evidence places the Order `On Hold`, while the normative lifecycle makes `Canceled` terminal. Orders may correctly reject the transition, leaving captured money without the required exception/refund path. A simultaneous cancel/success can also race because no aggregate expected-version rule is stated.
- **Guard snippet:** Keep the terminal Order immutable. Create a separately owned Payment/Reconciliation exception for success-after-cancel, block Fulfillment, and initiate the approved corrective Refund or audited correction path. Require expected aggregate version or row serialization for competing lifecycle commands and include aggregate version in emitted facts.
- **Potential consequence:** Captured funds attached to a canceled Order, unreserved stock paired with a paid purchase, ambiguous customer state, or accidental Fulfillment after cancellation.

### High — Distinct reservations are idempotent but not atomically capacity-safe

- **Pair:** Guest Checkout reservation × authenticated Checkout reservation
- **Location:** AD-6, AD-23; Inventory ownership
- **Trigger condition:** Two different Order IDs reserve the final unit concurrently. Inventory may read the same available quantity in two transactions and create two distinct, individually idempotent reservations. The formula “on-hand minus active reservations” and owner-only mutation remain true after the oversell; no AD requires atomic conditional reservation.
- **Guard snippet:** Inventory must enforce `available >= requested` and reservation creation in one serialized/locked or atomic compare-and-update transaction, with a database-backed nonnegative availability invariant. Confirm, expire, adjust, and release operations must use conditional state/version transitions; concurrency tests cover distinct commands, not only duplicate replay.
- **Potential consequence:** Oversell, contradictory Checkout acceptance, manual Order cancellation, and regulated-product Fulfillment promises that Stock Position cannot satisfy.

### High — Worker and scheduled commands can bypass authorization

- **Pair:** API command handler × Worker/schedule/event command handler
- **Location:** AD-3, AD-11, AD-12
- **Trigger condition:** The API path enforces RBAC/resource authorization as AD-11 states, while a Worker consumer or schedule invokes the same owner application command with a system actor and no equivalent capability/resource policy. Both carry actor/correlation/idempotency context and mutate through owner commands, so they obey AD-3 literally; AD-11 names API policies rather than every inbound adapter.
- **Guard snippet:** Enforce authorization in the owning application-command boundary for every inbound adapter. Define human, provider, service, and scheduled actor classes with least-privilege capabilities and resource scope; verified provider evidence authorizes only its mapped command. Architecture tests must prove consumers/schedules cannot invoke privileged Refund, hold, publication, role, or evidence transitions without the required policy.
- **Potential consequence:** Queue/job injection, misconfigured schedules, or an overprivileged Worker can publish regulated claims, issue Refunds, alter roles, or release holds while bypassing the server-side security boundary.

### High — Private object ownership does not prevent stored active-content attacks

- **Pair:** Review/Content media upload epic × Storefront/Admin media renderer
- **Location:** AD-26, AD-21, AD-11
- **Trigger condition:** An owner accepts SVG, HTML, malformed image, or infected document as a private object and later issues an authorized signed URL. A renderer embeds it inline under the application origin. Ownership, authorization, signed delivery, retention, and evidence export all obey AD-26, but no invariant covers content validation, quarantine, safe transformation, origin isolation, or response headers.
- **Guard snippet:** Introduce a binary-safety contract: quarantine before availability; allowlisted types and size limits; server-side MIME/magic-byte validation; malware scanning; raster/transcode user-visible images; never inline untrusted SVG/HTML/PDF; serve downloads from an isolated origin with restrictive CSP, `nosniff`, and safe `Content-Disposition`; preserve original regulated evidence immutably but expose only a safe view/download path.
- **Potential consequence:** Stored XSS, credential/session theft, malware delivery to Operators, or alteration of the perceived regulatory evidence and storefront content.

## Focused Regulated-Commerce Integrity and Security Result

| Area | Result | Evidence |
| --- | --- | --- |
| Regulatory publication/withdrawal | **Pass** | AD-8 canonical evidence versions plus AD-22 synchronous fail-closed Safety Denial Registry. |
| Public sellability consistency | **Pass** | AD-22 canonical eligibility, shared fixtures, owner-truth Checkout evaluation, and fail-closed denial query. |
| Seller, ledger, settlement, and invoice authority | **Pass with Refund-concurrency exception above** | AD-19 establishes Merchant snapshot and Finance authority; AD-24 fixes Refund responsibility split. |
| Payment/Order lifecycle integrity | **Fail — High** | Success-after-cancel and concurrent terminal transitions lack a valid exception/atomic version path. |
| Inventory integrity | **Fail — High** | Reservation idempotency does not guarantee atomic capacity enforcement across distinct commands. |
| Privacy, retention, hold, and evidence export | **Pass** | AD-18, AD-20, AD-26, and AD-15 define and enforce ownership, purpose, case, hold, and evidence contracts. |
| Inbound authorization | **Fail — High** | AD-11 does not explicitly bind Worker, schedule, and event-consumer command paths. |
| Payment/provider boundary | **Pass** | AD-9 and AD-10 require hosted/redirected UI, verified server evidence, signature/replay defense, idempotency, and payment-data exclusion. |
| Uploaded media/object security | **Fail — High** | AD-26 governs lifecycle and access but not active-content/malware safety. |
| Contract, event, schema, and migration evolution | **Pass** | AD-25 and AD-28 close compatibility, rollout, and bilateral acceptance holes. |

## Gate Summary

- Prior divergence pairs: **13 resolved, 0 unresolved**.
- New qualifying findings: **1 Critical, 4 High**.
- Final gate: **Fail until the five findings above are closed or explicitly accepted as launch blockers with owners and evidence gates.**
