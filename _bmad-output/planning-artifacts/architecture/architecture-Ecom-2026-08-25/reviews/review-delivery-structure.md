# Structure Review — `DELIVERY-TOPOLOGY.md`

**Purpose/audience read:** This companion exists to help Supervisors, Leads, and Peers convert the architecture spine into parallel, ownership-safe delivery work and hand it off with enough evidence to merge and release.

**Structure model:** Prompt/Task Definition (Functional), with reference tables for roles, ownership, handoff, and tools.

**Verdict:** **Needs structural revision before it can serve as the complete delivery assignment map.** The hierarchy and workflow order are concise, all bounded contexts appear in a Lead group, and the bilateral contract flow faithfully reflects AD-28. However, shared application/platform surfaces are unassigned, requirement ownership is overlapping and incomplete, and AD-16's non-launch-essential intake paths are absent. These are coverage/navigability gaps, not prose defects.

| Pass | Original Text | Revised Text | Changes |
| --- | --- | --- | --- |
| structure | **§Initial Lead Groups, lines 21–28 — `Modules` column** | **QUESTION:** Add a **Shared delivery surfaces** table immediately after the Lead-group table: `Surface | Owning Lead group | Published/coordination boundary`. Assign exactly one Lead group to `apps/storefront` including the AD-27 shell, `apps/admin`, `apps/api`, `apps/worker`, `packages/ui`, and the database, messaging, observability, and security platform surfaces. | The bounded contexts are fully covered, but the spine's application composition roots, shared UI package, shell, and platform owners are not. “Platform adapters” is too broad for BR assignment and allows two Leads to claim or ignore a shared surface. Adds ~55–80 words. |
| structure | **§Initial Lead Groups, lines 23–27 — `Primary PRD areas`** | **GROUP:** Replace the unqualified range column with `Accountable requirements | Supporting requirements | Gates/cross-cutting ADs`, or add an adjacent compact coverage matrix. Give every repeated ID one accountable Lead and list other groups as supporting. Explicitly place CR-7–CR-9, LG-1–LG-4, and the cross-group AD-22–AD-29 handoffs. | FR-12–FR-14, FR-33, FR-35, FR-44, and FR-46 currently appear under multiple groups without accountability semantics, while CR-7–CR-9 and LG-1–LG-4 do not appear. The current ranges therefore look exhaustive but are neither MECE nor sufficient for assignment. Approximately neutral to +40 words if the ranges are replaced rather than duplicated. |
| structure | **§Work Contract, line 42, step 1** | **QUESTION:** Insert a three-row **Release-class intake** table before §Work Contract: `Launch-essential — Supervisor creates/gates epics`; `Evidence-triggered follow-on — requires cited evidence and cannot gate first sale unless LG-4`; `Later — requires a PRD scope decision before BR work`. | The workflow starts only with launch-essential epics, while spine AD-16 defines three release classes and different authorization/gating behavior for each. Without this branch, follow-on and Later work have no legitimate entry path. Adds ~35–50 words. |
| structure | **§Tool Policy, lines 60–65, after every operational use of BR/BV/Srcwalk/UBS** | **MOVE:** Place §Tool Policy after §Initial Lead Groups and before §Work Contract. Keep its table unchanged. | BR appears in §Roles and the flow, and BV/Srcwalk/UBS appear in the numbered contract before readers reach their definitions. Moving the existing 59-word table makes the execution sequence dependency-first. Saves/adds 0 words. |
| structure | **§Work Contract diagram, lines 32–40 — `ISSUE --> LEAD`** | **CONDENSE:** Replace the single `LEAD` target on the cross-module branch with `Producer Lead → Consumer Lead acceptance/tests → BR dependency + rollout → Supervisor exception/merge gate`; alternatively remove that branch and label the numbered steps as authoritative. | The prose in steps 5–6 correctly implements AD-28, but the diagram implies one Lead can close a contract issue. The visual should not contradict the workflow it summarizes. Adds ~8–15 diagram words. |

## Coverage and Shape Notes

- **Preserve** §Roles, the numbered §Work Contract, and §Story Handoff Minimum as separate layers. They are not duplicate content: they answer who owns, how work flows, and what evidence crosses the boundary.
- **Preserve** the authority statement under the title and the compact Mermaid workflow; both provide useful orientation for human readers.
- Bounded-context coverage is complete across the four current Lead groups: Identity, Merchant, Content, Catalog, Inventory, Pricing, Discovery, Cart, Checkout, Orders, Payments, Finance, Fulfillment, Returns, Engagement, Governance, and Reporting all appear once.
- Spine fidelity is strong for AD-16 Peer ownership, BR/BV authority, Srcwalk/UBS use, and AD-28 bilateral contract acceptance once the diagram is corrected.

## Summary

- Recommendations: **5 exact structural fixes**.
- No length target was provided. The source is 554 words; accepting all fixes adds approximately 100–170 words (about 18–31%) because missing ownership/intake scaffolding must be added rather than prose cut.
- No comprehension trade-off is expected. The document remains under ~725 words and gains a complete assignment map, dependency-first tool definitions, and a workflow visual consistent with its text.
