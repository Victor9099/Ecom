import { createHash, randomBytes } from 'node:crypto';

/**
 * Governance — append-only audit evidence (Story 1.5, FR-42 / NFR-7 / AD-11).
 *
 * The `AuditEntry` aggregate is append-only: once written it is never updated
 * or deleted. Corrections are written as NEW entries. Integrity is guaranteed
 * by a sha256 chain — every entry hash covers the previous entry hash plus the
 * entry's canonical fields, so tampering anywhere in the chain is detectable.
 */

export const AUDIT_ACTION_CLASSES = [
  'governance_content_publication', // FR-2
  'governance_content_withdrawal', // FR-6
  'governance_sku_classification', // FR-9
  'governance_reconciliation', // FR-29
  'governance_refund_execution', // FR-35
  'governance_regulatory_hold', // FR-36
  'governance_permission_change', // FR-41
  'governance_audit_access', // FR-42
] as const;

export type AuditActionClass = (typeof AUDIT_ACTION_CLASSES)[number];

export const AUDIT_OUTCOMES = ['success', 'failure', 'denied'] as const;

export type AuditOutcome = (typeof AUDIT_OUTCOMES)[number];

export const ACTOR_TYPES = ['human', 'service', 'system'] as const;

export type ActorType = (typeof ACTOR_TYPES)[number];

export const AUDIT_SCHEMA_VERSION = 'v1' as const;

/** Append-only chain genesis sentinel: 32 zero bytes, hex-encoded (64 chars). */
export const GENESIS_PREV_HASH = '0'.repeat(64);

/** A fully materialised, immutable audit entry. */
export interface AuditEntry {
  auditEntryId: string;
  prevEntryHash: string;
  entryHash: string;
  actorType: ActorType;
  actorId: string;
  occurredAt: string;
  subjectType: string;
  subjectId: string;
  actionClass: AuditActionClass;
  action: string;
  reasonCode: string;
  reason: string;
  outcome: AuditOutcome;
  correlationId: string;
  causationId: string;
  producer: string;
  commandId: string | null;
  eventId: string | null;
  idempotencyKey: string;
  idempotencyHash: string;
  schemaVersion: string;
  detail: unknown;
}

/**
 * What a producing module submits on intake: the source fact it observed, plus
 * its producer identity. Governance derives `auditEntryId`, `prevEntryHash`,
 * `entryHash`, `idempotencyKey` and `idempotencyHash` — the submitting module
 * never controls those (AD-11: Governance stores but does not own the source
 * fact).
 */
export interface AuditEntryIntake {
  producer: string;
  actorType: ActorType;
  actorId: string;
  occurredAt: string;
  subjectType: string;
  subjectId: string;
  actionClass: AuditActionClass;
  action: string;
  reasonCode: string;
  reason: string;
  outcome: AuditOutcome;
  correlationId: string;
  causationId: string;
  commandId: string | null;
  eventId: string | null;
  schemaVersion: string;
  detail: unknown;
}

/**
 * Every entry field that participates in the sha256 chain, i.e. everything
 * except the generated `auditEntryId` and the derived `entryHash` itself.
 */
export type AuditEntryHashedFields = Omit<AuditEntry, 'auditEntryId' | 'entryHash'>;

export function sha256Hex(input: string): string {
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

/**
 * Generates a time-ordered UUIDv7 (RFC 9562) using only `node:crypto`. The
 * 48-bit unix-ms timestamp occupies the high bits, which makes lexicographic
 * ordering of the canonical string equal chronological ordering — this is the
 * pagination tie-breaker (AD-25 / Consistency Conventions: opaque cursor,
 * stable ordering with a UUIDv7 tie-breaker).
 */
export function uuidv7(now: number = Date.now()): string {
  const bytes = randomBytes(16);
  const ms = now;
  bytes[0] = Math.floor(ms / 2 ** 40) & 0xff;
  bytes[1] = Math.floor(ms / 2 ** 32) & 0xff;
  bytes[2] = Math.floor(ms / 2 ** 24) & 0xff;
  bytes[3] = Math.floor(ms / 2 ** 16) & 0xff;
  bytes[4] = Math.floor(ms / 2 ** 8) & 0xff;
  bytes[5] = ms & 0xff;
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x70; // version 7
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80; // RFC 4122 variant (10xx)
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * Deterministic JSON serialisation with recursively sorted object keys, so the
 * same `detail` value always produces the same canonical string regardless of
 * key insertion order. `undefined` is treated as `null` (a JSON value).
 */
export function stableStringify(value: unknown): string {
  if (value === undefined || value === null) {
    return 'null';
  }
  if (typeof value !== 'object') {
    return JSON.stringify(value) ?? 'null';
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(',')}}`;
}

type SourceFactFields = Pick<
  AuditEntryHashedFields,
  | 'actorType'
  | 'actorId'
  | 'occurredAt'
  | 'subjectType'
  | 'subjectId'
  | 'actionClass'
  | 'action'
  | 'reasonCode'
  | 'reason'
  | 'outcome'
  | 'correlationId'
  | 'causationId'
  | 'producer'
  | 'commandId'
  | 'eventId'
  | 'schemaVersion'
  | 'detail'
>;

/** Canonical serialisation of the source-fact fields (fixed order, unit-separator delimited). */
function canonicalSourceFactFields(source: SourceFactFields): string {
  return [
    source.actorType,
    source.actorId,
    source.occurredAt,
    source.subjectType,
    source.subjectId,
    source.actionClass,
    source.action,
    source.reasonCode,
    source.reason,
    source.outcome,
    source.correlationId,
    source.causationId,
    source.producer,
    source.commandId ?? '',
    source.eventId ?? '',
    source.schemaVersion,
    stableStringify(source.detail ?? null),
  ].join('\u001f');
}

/** Canonical serialisation of all hashed entry fields (prev hash + identity + source facts). */
export function canonicalAuditEntryFields(fields: AuditEntryHashedFields): string {
  return [
    fields.prevEntryHash,
    fields.idempotencyKey,
    fields.idempotencyHash,
    canonicalSourceFactFields(fields),
  ].join('\u001f');
}

export function computeEntryHash(fields: AuditEntryHashedFields): string {
  return sha256Hex(canonicalAuditEntryFields(fields));
}

/**
 * The AD-25 canonical request hash for an intake: a deterministic sha256 of the
 * source-fact fields. The same hash replayed under the same idempotency key
 * reproduces the original result; the same key with a different hash is a
 * stable conflict.
 */
export function computeIntakeRequestHash(intake: AuditEntryIntake): string {
  return sha256Hex(canonicalSourceFactFields(intake));
}

/** Materialises an append-only `AuditEntry` from its hashed fields. */
export function buildAuditEntry(
  fields: AuditEntryHashedFields,
  id: () => string = uuidv7,
): AuditEntry {
  return {
    auditEntryId: id(),
    entryHash: computeEntryHash(fields),
    ...fields,
  };
}

export function isAuditActionClass(value: unknown): value is AuditActionClass {
  return typeof value === 'string' && (AUDIT_ACTION_CLASSES as readonly string[]).includes(value);
}

export function isAuditOutcome(value: unknown): value is AuditOutcome {
  return typeof value === 'string' && (AUDIT_OUTCOMES as readonly string[]).includes(value);
}

export function isActorType(value: unknown): value is ActorType {
  return typeof value === 'string' && (ACTOR_TYPES as readonly string[]).includes(value);
}
