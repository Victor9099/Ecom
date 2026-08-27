---
title: 'Configure Ecom Paseo-PI Governance and Model Routing'
type: 'chore'
created: '2026-08-26'
status: 'done'
review_loop_iteration: 0
baseline_commit: 'NO_VCS'
context:
  - '{project-root}/_bmad-output/specs/spec-ecom/SPEC.md'
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-Ecom-2026-08-25/ARCHITECTURE-SPINE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Ecom has no repository Workspace Protocol, and both local routing files currently send every class to Qwen. Governed Lead work requires explicit authority, isolation, review, acceptance, and model rules.

**Approach:** Perform only the one-time Human-side bootstrap: create a fail-closed protocol and synchronize both route sources. Keep the five-class schema: Supervisor uses DeepSeek/medium, fast reads and normal coding use Qwen, and high-risk reasoning/review use DeepSeek/high. Pin Lead bootstrap separately because the resolver has no Lead class. Stop after configuration validation; subsequent agent creation and all Epic/Story delivery flow through Supervisor → Lead → Peer.

## Boundaries & Constraints

**Always:** Preserve user-owned changes; use exact model IDs; keep both `local-windows` routes equal; verify runtime identity; allow one writer per scope; isolate writers and exact-SHA reviewers; reserve merge/deploy for Human; keep secrets out of the repository.

**Ask First:** Changes to model classes, role-pack code, credentials, topology, limits, git authority, dependencies, public contracts, irreversible data/schema operations, merge, deploy, or external services.

**Never:** Create Lead/Peer agents or start an Epic/Story in this bootstrap change; add an unsupported Lead route; silently fall back; let Peers choose models, spawn agents, merge, deploy, or self-accept; let Supervisor implement/accept; overwrite dirty worktrees; commit local Paseo config or secrets.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Governed bootstrap | Valid protocol/providers/routes | One `pi-lead/cliproxyapi/deepseek-v4-pro-0813`, thinking `medium`; identity verified | Missing/mismatched evidence blocks |
| Fast read | Lead selects `FAST_READ` | `pi-peer`, Qwen 3.7 Plus, thinking `low` | No alternate-model fallback |
| Ordinary implementation | Lead selects `CODING_MEDIUM` | `pi-peer`, Qwen 3.7 Plus, thinking `medium` | Block if exact runtime identity differs |
| Architecture/reasoning | `REASONING_HIGH` | `pi-peer`, DeepSeek V4 Pro/high | Block; do not downgrade |
| Independent review | `REVIEW_HIGH` | Fresh read-only `pi-peer`, DeepSeek/high, exact SHA | Refuse dirty/moving/mismatched candidate |

</frozen-after-approval>

## Status Snapshot

- Bootstrap configuration: execution complete; review corrections applied.
- Product implementation: not started.
- Lead runtime identity: deferred until the first Human-directed Supervisor bootstrap; work must stop unless runtimeInfo matches the approved tuple.
- Repository baseline: unavailable until the Human records and approves an exact initial SHA in BR.

## Code Map

- `.orchestration/WORKSPACE_PROTOCOL.md` -- new repository authority contract consumed by Lead/Supervisor; project-specific and commit-safe.
- `C:/Users/Pham Thang/.paseo-pi-team/model-routing.local.json` -- host-local five-class routes; never committed.
- `C:/Users/Pham Thang/.paseo-pi-team/cluster-routing.local.json` -- controller host/route truth; never committed.
- `.orchestration/validate-paseo-routing.ps1` -- repeatable Ecom-specific five-class matrix and local/cluster equality gate.
- `C:/Users/Pham Thang/.pi/agent/extensions/paseo-team-scripts/model-routing.mjs:20-26` -- read-only evidence that only five model classes are accepted.
- `C:/Users/Pham Thang/.pi/agent/extensions/prompts/lead.md:49-82` -- Lead routing, ownership, review, and acceptance invariants.
- `C:/Users/Pham Thang/.pi/agent/extensions/prompts/peer.md:6-28` -- Peer authority and no-model-switch boundary.
- `D:/1. Work/Project/1/paseo-pi-team/templates/WORKSPACE_PROTOCOL.example.md` -- source template; adapt rather than copy placeholders.

## Tasks & Acceptance

**Execution:**
- [x] `.orchestration/WORKSPACE_PROTOCOL.md` -- define identity, documents, verification, Human boundaries, models, topology, Git/worktree/review/evidence/recovery, and BR/BV rules.
- [x] `C:/Users/Pham Thang/.paseo-pi-team/model-routing.local.json` -- set Supervisor to DeepSeek/medium, retain Qwen low/medium for fast-read/coding, and set reasoning/review to DeepSeek/high.
- [x] `C:/Users/Pham Thang/.paseo-pi-team/cluster-routing.local.json` -- apply the same route map under `hosts.local-windows` without changing connection, capabilities, or limits.
- [x] `.orchestration/validate-paseo-routing.ps1` -- fail closed when either route source diverges from the approved Ecom matrix or from the other source.

**Acceptance Criteria:**
- Given the installed schema, when both files validate, then five required classes resolve with no unknown class.
- Given the approved policy, when routes resolve, then provider/model/thinking match the matrix in both files.
- Given a Lead bootstrap, when the runtime identity is inspected, then the observed provider, model, and thinking must be `pi-lead`, DeepSeek V4 Pro, and `medium`, respectively; otherwise, the bootstrap fails closed.
- Given an implementation candidate, when review begins, then the Reviewer runs in a new read-only session in a fresh, clean worktree at the exact candidate SHA.
- Given pre-scaffold verification, when a command does not exist, then report `NOT_AVAILABLE_PRE_SCAFFOLD`, never a fabricated pass.
- Given that this bootstrap change is complete, when delivery begins, then no product work has yet been performed, and the Human starts delivery by directing the configured Supervisor.

## Spec Change Log

- 2026-08-26: Completed bootstrap execution, synchronized five-class routing, and validated role providers, runtime prerequisites, route resolution, and semantic equality; final acceptance remains subject to review and an approved initial repository baseline.
- 2026-08-27: Applied review corrections for deterministic baseline approval, route precedence/drift detection, recovery, model-class selection, Lead/BR authority, V3 briefs, scope leases, reviewer evidence, frontend surface gates, and repeatable Ecom route validation.

## Design Notes

The resolver rejects unknown classes. The protocol therefore pins the Lead tuple separately and requires pre-validation plus runtime verification.

## Verification

**Commands:**
- `node "C:/Users/Pham Thang/.pi/agent/extensions/paseo-team-scripts/model-routing.mjs" validate` -- expected: host-local routing schema valid.
- `node "C:/Users/Pham Thang/.pi/agent/extensions/paseo-team-scripts/model-routing.mjs" resolve --class <CLASS> --json` for all five classes -- expected: exact approved tuple for every class.
- `node "D:/1. Work/Project/1/paseo-pi-team/scripts/preflight.mjs" --json` -- expected: routing/provider/model checks pass; dirty-tree observation may remain non-strict because the Human explicitly accepted current untracked work.
- PowerShell JSON comparison of both `local-windows` route objects -- expected: semantic equality.
- `powershell -NoProfile -ExecutionPolicy Bypass -File ".orchestration/validate-paseo-routing.ps1"` -- expected: all five approved tuples and semantic equality pass; any drift exits nonzero.

### Verification Evidence

| Executed (Asia/Bangkok) | Check | Exit | Material result |
|---|---|---:|---|
| 2026-08-26 | `model-routing.mjs validate` | 0 | Schema valid; host `local-windows`; exactly five supported classes. |
| 2026-08-26 | Five `resolve --class <CLASS> --json` invocations | 0 each | Every class resolved to its exact approved provider/model/thinking tuple. |
| 2026-08-26 | Local/cluster literal-matrix and semantic-equality assertions | 0 | Five rows passed; route objects were semantically equal. |
| 2026-08-26 | `paseo provider models pi-lead --json` | 0 | Exact DeepSeek model exposed; `medium` supported and default. This is inventory evidence, not launched-runtime identity. |
| 2026-08-26 | Elevated Paseo role-pack preflight | 0 | `ok: true`; daemon, providers, MCP adapter, browser runtime, local routes, and cluster routes passed. |
| 2026-08-27 | Post-review route validator, five resolves, and role-pack preflight | 0 each | Exact matrix/equality passed; daemon restarted; final preflight returned `ok: true`. |

Installed-version warnings remain explicit: Paseo `0.5.0` versus role-pack verified `0.2.5`; Pi `0.84.2` versus `0.83.0`; and adapter `2.28.0` versus pinned `2.19.0`. These warnings do not prove compatibility beyond the passing probes and require revalidation after any relevant upgrade. The dirty-repository warning remains gated by `INITIAL_BASELINE_UNAVAILABLE`.

Lead runtime identity has not been tested because this bootstrap intentionally created no Lead. At the first Human-directed Supervisor bootstrap, runtimeInfo evidence for provider/model/thinking is mandatory before the Lead may work.

Rollback sources are `model-routing.local.json.backup-ecom-20260826-214832` and `cluster-routing.local.json.backup-ecom-20260826-214832`. Restoration requires Human approval and must be followed by schema validation, literal-matrix validation, semantic equality, provider inventory, and preflight; the obsolete all-Qwen policy must not be reactivated silently.

## Suggested Review Order

**Activation and authority**

- Establishes the Human-approved baseline gate before any Writer can start.
  [`WORKSPACE_PROTOCOL.md:32`](../../.orchestration/WORKSPACE_PROTOCOL.md#L32)

- Separates Supervisor, Lead, and Peer authority with fail-closed handoff behavior.
  [`WORKSPACE_PROTOCOL.md:71`](../../.orchestration/WORKSPACE_PROTOCOL.md#L71)

**Routing policy**

- Defines route precedence, equality gating, rollback, and silent-fallback prohibition.
  [`WORKSPACE_PROTOCOL.md:123`](../../.orchestration/WORKSPACE_PROTOCOL.md#L123)

- Maps task disposition and risk to one deterministic model class.
  [`WORKSPACE_PROTOCOL.md:132`](../../.orchestration/WORKSPACE_PROTOCOL.md#L132)

- Enforces the literal five-class matrix and local/cluster semantic equality.
  [`validate-paseo-routing.ps1:29`](../../.orchestration/validate-paseo-routing.ps1#L29)

**Work isolation and review**

- Binds BR/BV operations to the Ecom repository and project store.
  [`WORKSPACE_PROTOCOL.md:153`](../../.orchestration/WORKSPACE_PROTOCOL.md#L153)

- Makes task authority, ownership, leases, and Git permissions explicit.
  [`WORKSPACE_PROTOCOL.md:176`](../../.orchestration/WORKSPACE_PROTOCOL.md#L176)

- Requires risk classification and exact-SHA independent-review evidence.
  [`WORKSPACE_PROTOCOL.md:188`](../../.orchestration/WORKSPACE_PROTOCOL.md#L188)

**Frontend and recovery gates**

- Pins seven UX surfaces, Impeccable, UI/UX Pro Max, GSAP, and browser evidence.
  [`WORKSPACE_PROTOCOL.md:206`](../../.orchestration/WORKSPACE_PROTOCOL.md#L206)

- Preserves Human work through quarantine and accepted-SHA recovery.
  [`WORKSPACE_PROTOCOL.md:235`](../../.orchestration/WORKSPACE_PROTOCOL.md#L235)

**Verification evidence**

- Records reproducible checks, limitations, version warnings, and rollback sources.
  [`spec-configure-paseo-team-governance.md:93`](spec-configure-paseo-team-governance.md#L93)
