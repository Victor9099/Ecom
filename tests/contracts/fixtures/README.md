# Versioned contract fixtures (Story 1.2 — executable architecture boundaries)

Reserved for versioned command / event / API contract fixtures (AD-10 / AD-28).
The registry (`tests/contracts/manifest.json`) starts EMPTY: nothing has been
released yet, so there are deliberately no business fixtures committed here.

## Layout

```text
tests/contracts/
  manifest.json                         # released-contract registry (starts with "contracts": [])
  fixtures/<owner>/<contract>/v<N>/
    schema.json                         # canonical JSON Schema for this version
    contract.json                       # owner/version/kind/consumers + producer metadata
    fixtures/*.json                     # representative + conformance fixture payloads
  acceptances/<owner>/<contract>/v<N>.json   # AD-28 bilateral acceptance (producer + every consumer)
  history/<owner>/<contract>/v<N>.sha256     # immutable sha256 of the released schema+contract+fixtures
```

## Rules enforced by `tests/contracts/src/contract-compatibility.test.ts`

1. Every registry entry carries `owner`, `contract`, `version` (`v<N>`), `kind`
   (`command` | `event` | `api`), and `consumers` (array of consumer owner names).
2. A released version's schema + contract + fixtures digest (`history/…/v<N>.sha256`)
   is immutable. A changed digest is a breaking change and must become `v<N+1>`.
   This is ENFORCED (not aspirational) by the merge-time check in
   `tests/contracts/src/lib/immutability.ts`, exercised by
   `tests/contracts/src/immutability.test.ts` (positive + tamper-negative units).
3. Any `v>1` release requires a recorded bilateral acceptance
   (`acceptances/…/v<N>.json`) naming the producer and every affected consumer;
   a `breaking: true` version additionally requires a `supervisorException` ref.

Command/event fixture envelopes are validated by
`tests/contracts/src/fixture-validation.test.ts` against the immutable-event and
retryable-command spine envelopes (see `src/lib/envelopes.ts`).

## Deferred (documented, not claimed as implemented)

- **Envelope directory-walk harness (OCR-006).** A dormant, empty-tolerant scan
  of `fixtures/<owner>/<contract>/v<N>/fixtures/*.json` that validates every
  payload against the owner/kind envelope guards is not implemented yet —
  there are no released fixtures to walk. Add it in the story that introduces
  the first released contract, alongside the `history/…/v<N>.sha256` committed
  alongside that release.