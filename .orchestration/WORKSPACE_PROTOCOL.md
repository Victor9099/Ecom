# Ecom Workspace Protocol

This repository contract governs Paseo-managed Supervisor, Lead, and Peer work for Ecom. Role prompts define durable role invariants; this file defines repository-specific authority and evidence. If the role prompts conflict with this file, the more restrictive rule wins, and the Lead escalates the conflict to the Human.

```text
WORKSPACE_PROTOCOL_VERSION: 1

PROJECT_ID: ecom
PROJECT_CRITICALITY: high
DEFAULT_BRANCH: master
REPOSITORY_REMOTE: https://github.com/Victor9099/Ecom.git
CONTROL_PLANE: Paseo only
ISSUE_AUTHORITY: BR
DEPENDENCY_VIEW: BV read-only

LEAD_WRITE_POLICY: denied
MERGE_OWNER: human
DEPLOY_OWNER: human
BREAKING_CONTRACT_POLICY: Supervisor workflow approval plus Human approval

REQUIRED_DOCUMENTS:
- PRODUCT.md
- _bmad-output/specs/spec-ecom/SPEC.md
- _bmad-output/specs/spec-ecom/requirements-map.md
- _bmad-output/planning-artifacts/epics.md
- _bmad-output/planning-artifacts/architecture/architecture-Ecom-2026-08-25/ARCHITECTURE-SPINE.md
- _bmad-output/planning-artifacts/architecture/architecture-Ecom-2026-08-25/DELIVERY-TOPOLOGY.md
- _bmad-output/planning-artifacts/architecture/architecture-Ecom-2026-08-25/DEPENDENCY-CATALOG.md
- design-system/ecom/MASTER.md
- design-system/ecom/pages/<surface>.md for every frontend surface in scope

REPOSITORY_BASELINE:
- Human must create and approve the initial repository commit before any Writer Peer starts.
- Existing untracked files are Human-owned and must never be overwritten, deleted, reset, or absorbed into a Peer task implicitly.
- Until an approved initial commit exists, Writer creation is BLOCKED: INITIAL_BASELINE_UNAVAILABLE.
- Approval evidence must be recorded in a BR project-level issue with the exact initial SHA, Human approver, approval timestamp, repository remote, and tracked REQUIRED_DOCUMENTS list.
- Lead clears INITIAL_BASELINE_UNAVAILABLE only when HEAD exists, the recorded SHA is reachable, the repository remote and BR project match Ecom, and every required document is readable and tracked at that SHA.

DELIVERY_START:
- This bootstrap protocol and route validation do not start product implementation.
- Product delivery begins only when the Human directs the configured Supervisor.
- Supervisor bootstraps one authoritative Lead; Lead uses BR/BV and delegates bounded work to Peers.

TEST_COMMANDS_CURRENT_STATE:
FAST_TEST: COMMAND: pnpm test
FULL_TEST: COMMAND: pnpm verify
TYPECHECK: COMMAND: pnpm typecheck
LINT: COMMAND: pnpm lint
FORMAT_CHECK: COMMAND: pnpm format:check
INTEGRATION_TEST: COMMAND: pnpm run architecture:check && pnpm run contracts:check

TEST_COMMAND_ACTIVATION:
- Story 1.1 must atomically replace every NOT_AVAILABLE_PRE_SCAFFOLD value when manifests and the lockfile land.
- Each slot becomes either COMMAND: <exact workspace command> or NOT_APPLICABLE: <specific rationale and Lead approval>; high-risk omissions also require Human approval.
- Missing commands and NOT_APPLICABLE entries are evidence states, never passed checks.
- Verification must be proportional to changed risk and include every acceptance criterion.

HUMAN_DECISION_BOUNDARIES:
- product behavior, scope, launch priority, and regulated-content policy
- public or cross-module contract break
- dependency outside DEPENDENCY-CATALOG.md
- irreversible schema migration, data mutation, or data deletion
- security, authentication, payment, privacy, health-sensitive data, credentials, or secrets
- payment, carrier, messaging, cloud, region, or managed-service provider selection
- host/model policy or concurrency-limit change
- commit or push authority outside this protocol
- force-push, merge, deployment, release, or external communication
- cost-bearing action or purchase
- unresolved conflict between Architecture Spine, SPEC, PRD, UX, and implementation evidence

ROLE_AUTHORITY:
SUPERVISOR:
- observes workflow, evidence, gates, drift, bias, stalled work, and recovery
- relays Human decisions and ensures that at most one pi-lead holds orchestration authority
- during recovery, a successor may exist only in HANDOFF_READ_ONLY until authority transfers atomically and the predecessor is archived
- does not implement, create Peers, accept candidates, merge, push, deploy, or mutate the repository

LEAD:
- owns project framing, BR/BV selection, task topology, MODEL_CLASS, Peer routing, dependencies, integration, and candidate acceptance
- reads this protocol and loads paseo-team-lead before orchestration
- does not implement product work or silently fall back on model, host, workspace, or evidence
- may mutate BR issue state and evidence only for project ecom and the accepted task scope; repository/worktree writes remain denied

PEER:
- owns one bounded outcome under one V3 task brief
- may challenge a premise and return REOPEN_REQUEST, DEPENDENCY_REQUEST, BLOCKED, AUTHORITY_MISMATCH, MODEL_MISMATCH, or SCOPE_CONFLICT
- does not orchestrate agents, choose a model/host, expand scope, self-accept, merge, or deploy

LEAD_BOOTSTRAP_POLICY:
PASEO_PROVIDER: pi-lead
MODEL: cliproxyapi/deepseek-v4-pro-0813
THINKING: medium
PURPOSE: bootstrap or recovery
RECOVERY_FOR: ecom
- This tuple is a Human-approved role bootstrap policy, not a sixth MODEL_CLASS.
- Before create_agent, verify provider health, exact model inventory, and supported thinking.
- After launch, verify observed provider, model, and thinking from Paseo runtimeInfo.
- Missing runtime identity blocks startup; observed mismatch blocks work and must not silently fall back.
- Missing, malformed, or mismatched runtimeInfo requires quarantine/cancellation evidence before another authoritative Lead can start.

MODEL_POLICY:
MONITOR_ECONOMY:
  PASEO_PROVIDER: pi-supervisor
  MODEL: cliproxyapi/deepseek-v4-pro-0813
  THINKING: medium
FAST_READ:
  PASEO_PROVIDER: pi-peer
  MODEL: cliproxyapi/qwen3.7-plus
  THINKING: low
CODING_MEDIUM:
  PASEO_PROVIDER: pi-peer
  MODEL: cliproxyapi/qwen3.7-plus
  THINKING: medium
REASONING_HIGH:
  PASEO_PROVIDER: pi-peer
  MODEL: cliproxyapi/deepseek-v4-pro-0813
  THINKING: high
REVIEW_HIGH:
  PASEO_PROVIDER: pi-peer
  MODEL: cliproxyapi/deepseek-v4-pro-0813
  THINKING: high

MODEL_ROUTING_RULES:
- Lead chooses MODEL_CLASS from task risk and disposition; Peer never chooses it.
- The controller-local cluster route is authoritative; model-routing.local.json is a compatibility mirror.
- Before every create_agent, run `.orchestration/validate-paseo-routing.ps1`; any source divergence or approved-matrix mismatch blocks with ROUTE_SOURCE_DIVERGENCE.
- Requested and observed provider/model/thinking must match.
- Unavailable or mismatched routes fail closed; no model, thinking, host, or provider downgrade is allowed.
- Any change to this model policy requires Human approval and synchronized local plus cluster routing files.
- Route updates must validate both temporary candidates before replacement; a partial write or failed validation restores the matched backups only with Human approval, then reruns schema, matrix, and equality checks.

MODEL_CLASS_DECISION:
- FAST_READ: read-only discovery, inventory, navigation, or bounded evidence collection with no architecture decision.
- CODING_MEDIUM: ordinary implementation inside an approved contract and owned path set.
- REASONING_HIGH: architecture, cross-module, ambiguous, security-sensitive, regulated, migration, concurrency, or other HIGH_RISK analysis/implementation.
- REVIEW_HIGH: every required independent review.
- An unset, unknown, or ambiguous class blocks and escalates; it never defaults downward.

MACHINE_TOPOLOGY:
PRIMARY_HOST: local-windows
REVIEW_HOST: local-windows
CONNECTION_TYPE: local
MAX_CONCURRENT_WRITERS: 1
MAX_CONCURRENT_READERS: 3

HOST_CAPABILITY_REQUIREMENTS:
- writers require git-write and focused-test
- reviewers require git-read and independent-review
- Docker tasks require docker
- integration tasks require integration-test
- Advertised capability is routing metadata, not proof; Lead must record a task-specific probe before dispatching work that depends on Docker or integration-test.

BR_BV_POLICY:
- BR_STORE: <repository-root>/.beads; PROJECT_ID: ecom; REPOSITORY_REMOTE must match the identity block before selection or mutation.
- BR is authoritative for issue state, ownership, dependency, gate, and acceptance evidence.
- BV is read-only and selects work through dependency-aware robot output.
- Lead begins with bv --robot-next or bv --robot-triage and confirms the selected issue in BR.
- A story is ready only when open, unblocked, correctly owned, gate-compatible, and supported by required UX/architecture/provider decisions.
- Labels such as needs-ux, needs-ad29, and needs-lg3 require evidence that the named gate is closed before claim.
- Lead updates BR state and evidence; Peer does not mutate unrelated issues.
- Cross-module work requires an explicit producer-consumer dependency and compatibility acceptance from every affected Lead.
- A breaking contract requires Supervisor workflow approval and Human approval before merge.

GIT_POLICY:
ONE_WRITER_PER_MOVING_SCOPE: true
WRITER_WORKTREE_REQUIRED: true
TASK_BRANCH_PATTERN: agent/<task-id>
EXPECTED_BASE_SHA_REQUIRED: true
COMMIT_AUTHORITY: allowed only by the current valid V3 task brief in an isolated task branch
PUSH_TASK_BRANCH_AUTHORITY: denied by default; Human must explicitly grant it for the current V3 brief
FORCE_PUSH: denied
COMMIT_AMEND: denied
PEER_MERGE: denied
PEER_DEPLOY: denied

V3_TASK_BRIEF_REQUIRED_FIELDS:
- task_id, project_id, issuer, issued_at, expires_at, expected_base_sha, normalized_owned_paths, dependency_outputs, MODEL_CLASS, risk, acceptance_criteria, verification_commands, commit_allowed, push_allowed, and revocation_state
- Before Writer creation, Lead acquires a BR-backed lease over normalized_owned_paths and declared dependency_outputs; overlap with an active lease blocks dispatch.

WRITER_HANDOFF:
- format and run required tests before commit
- inspect the complete diff
- create a new commit without amend
- prove git status --porcelain is empty
- report candidate SHA, branch, changed files, verification output, push state, and residual risks
- corrections return to the same Engineer and create a new commit SHA

REVIEW_POLICY:
LOW_RISK: Lead verification; independent review optional only for non-semantic documentation or formatting
MEDIUM_RISK: independent Reviewer required
HIGH_RISK: read-only Architect or Challenger before implementation and independent Reviewer after implementation
EXACT_SHA_REQUIRED: true
FRESH_REVIEW_WORKSPACE: true
REVIEWER_MUST_BE_NEW_SESSION: true
REVIEWER_MODE: read-only
REVIEWER_MODEL_CLASS: REVIEW_HIGH
- Lead records LOW_RISK, MEDIUM_RISK, or HIGH_RISK plus rationale before implementation; an absent or invalid value blocks dispatch.
- Before review, evidence must record reviewer session ID, fresh worktree path, read-only enforcement, candidate SHA, `git rev-parse HEAD`, and empty `git status --porcelain`.

HIGH_RISK_ALWAYS_INCLUDES:
- architecture or cross-module contract changes
- lifecycle, ownership, concurrency, idempotency, migration, or security behavior
- authentication, authorization, payments, refunds, finance, privacy, regulated content, safety denial, or health-sensitive data
- dependency, provider, infrastructure, CI/CD, deployment, or public API behavior

FRONTEND_POLICY:
- every frontend story uses Impeccable code-first and UI/UX Pro Max
- read PRODUCT.md, design-system/ecom/MASTER.md, and the matching page override before implementation
- `design-system/ecom/pages/README.md` is the authoritative seven-surface manifest: home.md, discovery.md, product-detail.md, cart-checkout.md, editorial.md, account-support.md, and admin-operations.md
- a missing or unapproved page override blocks that surface; approval evidence belongs in the governing BR issue
- WCAG 2.2 AA, semantic HTML, keyboard operation, reduced motion, and public no-JavaScript content outrank generated styling
- each frontend V3 brief records Impeccable and UI/UX Pro Max evidence plus browser, keyboard, accessibility, reduced-motion, no-JavaScript, and performance checks
- GSAP is bounded progressive enhancement and must not hide SEO, product evidence, disclosures, navigation, price, availability, or primary actions; each affected story defines and verifies its animation and performance budget
- browser/MCP access must be explicitly granted in the V3 brief with allowed targets, read/write mode, and required retained evidence; otherwise it is denied

ACCEPTANCE_EVIDENCE:
- BR issue and accepted scope
- owned files and dependency map
- expected base SHA and initial clean worktree
- exact candidate SHA and final clean worktree
- complete changed-file list and diff inspection
- required command names, exit status, and material output
- every acceptance criterion mapped to evidence
- independent review when required, bound to the exact SHA
- bilateral compatibility acceptance for cross-module contracts
- residual risks and unresolved Human decisions
- route-policy validation output when agent routing is involved

ACCEPTANCE_AUTHORITY:
- Peer verifies its work but never accepts it.
- Reviewer recommends PASS, CHANGES_REQUIRED, or BLOCKED but never accepts it.
- Lead accepts or rejects the project candidate within this protocol.
- Human alone authorizes push when not already granted, merge, release, and deploy.

FAILURE_RECOVERY:
- do not reassign a Writer until the old workspace and Git state are known
- idle, finished, stale, timeout, or exit code zero is a signal, not acceptance or failure proof
- inspect agent activity, permissions, daemon health, workspace, branch, diff, and commits before recovery
- do not cancel or archive the old Lead before a successor acknowledges the handoff
- never restore in place: quarantine the old workspace, capture branch/status/diff/commits, and create a new isolated worktree from the last Lead-accepted SHA
- when no accepted SHA exists, remain at INITIAL_BASELINE_UNAVAILABLE and require Human baseline recovery; never reset, checkout, delete, or absorb Human-owned changes
- never infer credentials, secret values, remote endpoints, provider state, or missing evidence
- repeated failure after one correction requires Human escalation
```
