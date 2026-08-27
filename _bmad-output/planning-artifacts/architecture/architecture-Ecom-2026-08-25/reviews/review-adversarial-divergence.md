# Adversarial Divergence Review — `ARCHITECTURE-SPINE.md`

**Lens:** Configured architecture adversary — construct two independently built units that obey every AD literally yet still clash.  
**Verdict:** **Gate fails.** Thirteen valid divergence pairs remain. The spine is strong on ownership and dependency direction, but several cross-owner protocols still permit incompatible shapes, transition authorities, migration behavior, frontend composition, or delivery handoffs.

## Findings

### 1. Catalog epic × Pricing epic — no owner of composed purchasability

- **Location:** AD-5, AD-7, AD-8; Bounded-Context Ownership rows for Catalog, Inventory, Pricing, and Discovery
- **Trigger condition:** Catalog independently exposes regulatory sellability, Pricing exposes an active Offer, and Inventory exposes Availability, but each chooses a different `sellable/purchasable/visible` shape and reason taxonomy. Discovery can combine them one way while Checkout revalidates them another; every module still owns only its own truth and uses published contracts.
- **Guard snippet:** Name one canonical `PurchaseEligibility` decision contract with versioned inputs, outcome, reason codes, and evaluation order. State whether Checkout or a named policy owner composes Catalog, Pricing, and Inventory truths, and require Discovery to project that same outcome rather than recreate the rule.
- **Potential consequence:** Search can display or notify for a Product that Checkout rejects, or Checkout can accept a combination Discovery correctly hid.

### 2. Checkout epic × Orders epic — order creation has no shared transaction protocol

- **Location:** AD-3, AD-5, AD-6; ownership rows for Checkout and Orders
- **Trigger condition:** Checkout reserves Inventory using a preallocated Order/line reference, while Orders independently creates its own Order/line identifiers and commercial snapshot only after validation. Both use owner commands and idempotency, but the spine fixes neither identifier allocation nor reserve/create/confirm/compensate ordering.
- **Guard snippet:** Define the Checkout-to-Orders protocol: who allocates Order and line IDs, the immutable `CreateOrder` input shape, reservation correlation, success boundary, and compensations for failure before and after Order persistence.
- **Potential consequence:** Orphan reservations, mismatched line references, duplicate Orders, or an Order whose snapshot does not correspond to the reserved stock.

### 3. Payments epic × Orders epic — two legal authorities can confirm an Order

- **Location:** AD-3 through AD-5, AD-9; PRD lifecycle binding in AD-5
- **Trigger condition:** Payments emits a verified `payment-succeeded` fact. An Orders consumer may translate it directly into `ConfirmOrder`, while Checkout's process manager may independently issue the same command after observing Payment status. Both paths obey owner mutation and idempotency, but no AD designates the sole transition orchestrator or canonical event-to-command mapping.
- **Guard snippet:** Assign exactly one process owner for Payment-to-Order transitions and publish a transition matrix covering succeeded, late, failed, canceled, contradictory, and reconciled evidence. Other units observe; they do not issue competing lifecycle commands.
- **Potential consequence:** Conflicting confirmation/cancellation races, divergent audit causation, or late success applied after a different path canceled the Order.

### 4. Payments epic × Finance epic — financial facts lack a posting identity

- **Location:** AD-10, AD-19; ownership rows for Payments and Finance; Event envelope convention
- **Trigger condition:** Payments publishes immutable captured/refunded/settlement facts using provider transaction IDs, while Finance independently expects one posting per Order, capture, settlement line, or accounting event. The generic event envelope supplies no posting identity, allocation, fee, gross/net, or reversal linkage contract.
- **Guard snippet:** Define a canonical financial-fact schema and idempotency identity: payment attempt, provider transaction, Order, currency, gross amount, fee, net amount, effective time, settlement reference, original-posting reference, and allocation lines. Finance alone maps that fact to ledger entries.
- **Potential consequence:** Duplicate or missing ledger postings, irreconcilable settlements, and Finance totals that disagree with Payments while both modules remain internally consistent.

### 5. Returns epic × Payments epic — partial Refund amounts can be computed twice

- **Location:** AD-5, AD-19; ownership rows for Returns, Payments, Finance, Pricing, and Orders
- **Trigger condition:** Returns approves an item quantity and reason, Payments independently computes a refundable monetary amount from captured Payment, and Finance independently allocates the reversal. No contract fixes whether discounts, delivery charges, tax/invoice adjustments, or prior partial Refunds are allocated by Returns, Orders/Pricing snapshot policy, Payments, or Finance.
- **Guard snippet:** Define one `ApprovedRefundInstruction` contract sourced from immutable Order/policy snapshots with item allocations, non-item adjustments, currency, maximum amount, prior-refund total, idempotency identity, and original financial references. Assign the calculation owner; Payments only executes the authorized amount and Finance posts it.
- **Potential consequence:** Over-refund, under-refund, inconsistent customer display, or a ledger reversal that cannot reconcile to returned items.

### 6. Merchant epic × Orders/Finance epics — Legal Seller snapshots can disagree

- **Location:** AD-19; ownership rows for Merchant, Orders, and Finance
- **Trigger condition:** Orders snapshots a Merchant record at Checkout commitment while Finance snapshots it at invoice creation or settlement. Both correctly reference `merchantPartyId` and snapshot the legal party, but the spine does not fix a version identifier, effective-time rule, or snapshot handoff.
- **Guard snippet:** Publish a versioned `MerchantPartySnapshot` contract and state which accepted version is captured at Order commitment. Orders carries that immutable version into financial/invoice commands; Finance may not independently re-resolve current Merchant state for the same agreement.
- **Potential consequence:** Order terms, invoice issuer identity, and accounting records can name different registrations or seller details for one purchase.

### 7. Catalog epic × Content epic — approved-claim versions have no cross-owner identity

- **Location:** AD-8; ownership rows for Catalog and Content
- **Trigger condition:** Catalog versions an Approved Claim by aggregate revision, while Content records an “exact version” as copied text plus its own Content Version. Both satisfy AD-8, yet a Catalog withdrawal event may carry an ID Content cannot correlate to its copied evidence, or Content may bind a version Catalog no longer recognizes.
- **Guard snippet:** Define canonical identifiers and immutable reference shapes for regulatory evidence, Approved Claim, Disclaimer, reviewer/approval decision, and advertising classification. Specify snapshot-versus-reference semantics and the correlation used for synchronous withdrawal propagation.
- **Potential consequence:** Withdrawal fails to suppress every affected page/CTA, or an audit cannot prove which approved source authorized published wording.

### 8. Governance epic × owner-module privacy epic — coordination contracts can be mutually incompatible

- **Location:** AD-20; AD-18; Bounded-Context Ownership
- **Trigger condition:** Governance builds asynchronous discover/export/erase/hold requests with per-owner callbacks, while Identity or Orders independently builds synchronous commands and final responses. Both publish “scoped” contracts as required, but no common case ID, state machine, deadline, partial-failure semantics, or evidence-result schema is fixed.
- **Guard snippet:** Define a common privacy/authority protocol envelope and lifecycle: case ID, subject selectors, legal basis, scope, requested operation, deadline, owner acknowledgement, partial/terminal result, retained-with-basis result, evidence digest, retries, and completion rule for the Governance integrity manifest.
- **Potential consequence:** Governance can mark a case complete while an owner is pending or retained data has no recorded basis; exports and holds can silently omit modules.

### 9. Catalog migration × Finance migration — private tables can still clash on shared database objects

- **Location:** AD-2, AD-12, AD-15; Database convention; Structural Seed database path
- **Trigger condition:** Catalog and Finance each own their tables and schema file, but independently create PostgreSQL enum/type/index/function names, extensions, or migration identifiers in the single ordered pipeline. AD-2 assigns table/model ownership, not ownership or namespacing of shared database objects; “one ordered pipeline” does not fix merge order or rollout compatibility.
- **Guard snippet:** Assign platform ownership for extensions/global functions, require module-qualified database object names, centrally order/rebase migrations, and require expand/contract compatibility across rolling API/Worker deployments. CI must apply all migrations from a clean database and from the previous production schema.
- **Potential consequence:** Merge-time naming collisions, one module dropping another's shared object, or new code running against an incompatible intermediate schema.

### 10. Content producer epic × Discovery consumer epic — event versioning has no rollout protocol

- **Location:** AD-4, AD-8, AD-10, AD-12; Event conventions
- **Trigger condition:** Content introduces event v2 and stops v1 in the same release while Discovery independently deploys a v2 consumer after old Worker instances or queued v1 events still exist. Both respect immutable schemas and create a new version; one release train does not eliminate rolling deployments or in-flight events.
- **Guard snippet:** Define event evolution rules: consumer-before-producer deployment, dual-read or dual-publish compatibility window, registry ownership, deprecation evidence, replay support, and a rule that queued old versions remain decodable until retention/drain is proven.
- **Potential consequence:** Projection gaps, poison messages, or missed fail-closed withdrawals during an otherwise compliant deployment.

### 11. Checkout caller epic × Orders command epic — idempotency means different things

- **Location:** AD-3, AD-6, AD-9; Commands convention
- **Trigger condition:** Checkout retries `CreateOrder` with the same idempotency key after correcting an address or quote and expects the latest payload to win, while Orders stores the first result and replays it for that key. Both implement an idempotent command, but key scope, request hashing, mismatch behavior, retention, and replayed result semantics are unspecified.
- **Guard snippet:** Standardize idempotency as `(owner, command type, caller/subject, key)` plus a canonical request hash. Same key/same hash replays the original result; same key/different hash is a stable conflict; define retention at least through the business retry/reconciliation horizon.
- **Potential consequence:** Silent acceptance of changed intent, duplicate side effects under key reuse, or callers treating a replayed stale result as a new transaction.

### 12. Product Detail epic × Editorial epic — both can fork the shared Storefront shell

- **Location:** AD-21; Structural Seed comments for `apps/storefront` and `packages/ui`; Deferred UX specifications
- **Trigger condition:** Product Detail and Editorial teams each use approved page specs and shared UI primitives, but independently implement their own header/search/cart/account/footer composition and shell data loader. The tree calls Storefront the shell owner, yet no AD states that routes must consume one exclusive shell contract or which data/state the shell owns.
- **Guard snippet:** Make the Storefront shell an enforceable boundary with one module/API, owned global regions, route slots, shared navigation/cart/account query contract, and a prohibition on page epics reimplementing global regions. Page specifications control slot composition, not shell ownership.
- **Potential consequence:** Divergent navigation/disclosures, duplicated cart/account fetching and state, inconsistent cache behavior, and page-to-page layout drift despite literal AD-21 compliance.

### 13. Catalog Lead × Discovery Lead — the contract issue can close without bilateral acceptance

- **Location:** AD-16; AD-10; `modules/<context>/src/contracts/`; Capability → Architecture Map
- **Trigger condition:** The Catalog Lead publishes a new catalog event contract and records a cross-module issue; the Discovery Lead independently publishes a consumer contract and records Lead review. Both follow AD-16, but the spine does not designate the producer contract as canonical, require consumer acceptance evidence, encode a BR dependency edge, or assign conflict resolution to the Supervisor before merge.
- **Guard snippet:** Define the handoff protocol: producer Lead owns the canonical contract; affected consumer Leads record compatibility acceptance or a blocking objection; BR carries producer→consumer dependency and version rollout tasks; Supervisor resolves unresolved contract conflict and alone approves a breaking exception before either side merges.
- **Potential consequence:** Parallel Peers finish locally valid stories that cannot integrate, while BR and Lead-review records falsely show the cross-module work as governed.

## Gate Summary

The thirteen holes cluster into four missing kinds of invariant:

1. **Composite decision ownership:** purchasability, lifecycle orchestration, Refund allocation, and Merchant snapshots.
2. **Canonical cross-owner shapes:** financial facts, regulated evidence references, privacy cases, and idempotency.
3. **Evolution mechanics:** database migrations and event-version rollout under rolling/in-flight conditions.
4. **Integration authority:** Storefront shell ownership and bilateral Supervisor–Lead–Peer contract acceptance.

Closing these does not require expanding the spine into full schemas. Each hole can be closed with a named owner, a minimal canonical contract, and an enforceable transition or rollout rule.
