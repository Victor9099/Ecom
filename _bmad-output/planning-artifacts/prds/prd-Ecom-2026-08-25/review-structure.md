# Structure Review — `prd.md`

**Purpose/audience read:** This PRD exists to help product, UX, architecture, implementation, operations, and compliance readers agree on an MVP contract and derive launch work from it.

**Structure model:** Strategic/Context (Pyramid), with reference-style requirement tables.

**Gate statement:** No blocking structural issue remains. The document has a coherent requirements spine, stable section hierarchy, and consistently shaped FR tables. The findings below improve sequencing, grouping, and scanability without changing product content.

| Severity | Exact location | Tag | Structural finding | Minimum fix | Word impact |
| --- | --- | --- | --- | --- | --- |
| High | §§6–7, lines 267–305, after all FRs, NFRs, compliance rules, and launch gates | **MOVE** | MVP boundaries and release sequencing arrive after the detailed contract. Readers must interpret 46 FRs before learning which capabilities are launch-essential versus evidence-triggered follow-ons; §7's “MVP Scope” heading also contains a “Later” class. | Move the scope/sequencing block immediately after §2 Target Users and before the glossary/requirements. Rename it **Scope and Release Sequencing**. Preserve its three-way classification. | 0 words |
| Medium | §6 Non-Goals, lines 267–274, and §7.2 Out of Scope for MVP, lines 288–296 | **MERGE** | The two exclusion lists repeat medicine/pharmacy, marketplace, autonomous content/AI, public API, and architecture exclusions, splitting one boundary across adjacent sections. | Merge into one **Scope Boundaries** section with two subgroups only if the distinction matters: **Not this product** and **Deferred from MVP**. | Saves ~50–70 words |
| Medium | §3 Glossary, lines 65–97 | **MOVE** | The 390-word reference block interrupts the progression from users/journeys to scope and requirements, while many terms are already used in §§1–2 before being defined. It functions as random-access reference, not narrative scaffolding. | Move the glossary to the end as a reference section; retain one short pointer after §0 stating that capitalized terms are normative and linked there. | Approximately neutral |
| Medium | §5.4 Launch Gates, lines 253–265, and §10 Open Questions, lines 339–351 | **GROUP** | Gate-linked decisions are split between the gate table and a flat end-of-document question list. LG labels help, but readers must manually reconstruct each gate's unresolved decisions. | Keep §10 as the action list, but group questions under **LG-1–LG-7** and **Ungated product/architecture decisions**; do not repeat gate artifact text. | 0–15 words saved |
| Low | §4.5.1 Normative lifecycle baseline, lines 172–189 | **SPLIT** | Two adjacent tables have different schemas—aggregate lifecycles and situation-specific launch decisions—but share one heading, weakening table-level navigation and citation. | Add short subordinate labels/headings: **Aggregate lifecycle matrix** and **Cancellation and exception decision matrix**. | Adds ~8 words |

## Summary

- Recommendations: 5 (1 high, 3 medium, 1 low); none blocking.
- If all are accepted, estimated net reduction is ~45–75 words, about 0.9–1.5% of the 5,145-word document.
- No comprehension trade-off is expected: the glossary remains available, the scope distinction remains explicit, and no requirement content is removed.
- Preserve the Assumptions Index and the repeated `Realizes UJ-*` lines: they are useful navigation aids, not redundant narrative.
