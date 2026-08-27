// Structural type guards for the AD-10 / AD-25 immutable event envelope and the
// AD-3 / AD-25 retryable command envelope (Consistency Conventions block).
//
// Dependency-free: these are plain TypeScript guards (no ajv — ajv is not in
// DEPENDENCY-CATALOG.md). They are used both by the contract-compatibility
// fixture test and by the negative in-memory unit tests that prove the
// harness is executable rather than vacuous.

export const MODULE_OWNERS = [
  'identity',
  'merchant',
  'content',
  'catalog',
  'inventory',
  'pricing',
  'discovery',
  'cart',
  'checkout',
  'orders',
  'payments',
  'finance',
  'fulfillment',
  'returns',
  'engagement',
  'governance',
  'reporting',
] as const;

export type ModuleOwner = (typeof MODULE_OWNERS)[number];

/** AD-10 immutable event envelope (immutable within a version). */
export interface EventEnvelope {
  eventId: string;
  eventType: string;
  occurredAt: string;
  producer: string;
  aggregateId: string;
  schemaVersion: string;
  correlationId: string;
  causationId: string;
  payload: unknown;
}

/**
 * AD-3 / AD-25 idempotent, retryable command envelope.
 *
 * AD-25 identity mapping note (OCR-008): the AD-25 identity is the tuple
 * `(owner, commandType, callerOrSubject, key)`. This envelope uses `actor` as
 * the stand-in for `callerOrSubject`; `idempotencyKey` (or `key`) is the
 * retry/identity key. Field names are stabilised here and will not drift
 * without a contract-level version change.
 */
export interface CommandEnvelope {
  owner: string;
  commandType: string;
  schemaVersion: string;
  idempotencyKey?: string;
  key?: string;
  actor: string;
  correlationId: string;
  causationId: string;
  time: string;
}

const KEBAB_CASE_RE = /^[a-z][a-z0-9]*(-[a-z][a-z0-9]*)+$/;
const UTC_ISO_8601_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,9})?Z$/;

function toRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export function isNonBlankString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isOwned(
  value: unknown,
  owners: readonly string[] = MODULE_OWNERS,
): value is string {
  return typeof value === 'string' && owners.includes(value);
}

/** UTC ISO-8601 timestamps only (mandatory `Z` suffix — no bare offsets). */
export function isUtcIso8601(value: unknown): value is string {
  return (
    typeof value === 'string' && UTC_ISO_8601_RE.test(value) && !Number.isNaN(Date.parse(value))
  );
}

/** Lowercase kebab-case with a recognised owner-prefixed first segment. */
export function isOwnerPrefixedKebab(
  value: unknown,
  owners: readonly string[] = MODULE_OWNERS,
): value is string {
  if (typeof value !== 'string' || !KEBAB_CASE_RE.test(value)) {
    return false;
  }
  const firstSegment = value.split('-')[0];
  return firstSegment !== undefined && owners.includes(firstSegment);
}

/** The fixture `schemaVersion` must equal the versioned directory name (`v<N>`). */
export function schemaVersionMatchesDirectory(
  schemaVersion: unknown,
  versionDirectory: string,
): boolean {
  return typeof schemaVersion === 'string' && schemaVersion === versionDirectory;
}

/**
 * Returns an array of violation messages; `[]` means the envelope adheres to
 * the immutable-event spine envelope:
 *   eventId, eventType, occurredAt, producer, aggregateId, schemaVersion,
 *   correlationId, causationId, payload.
 */
export function validateEventEnvelope(
  value: unknown,
  owners: readonly string[] = MODULE_OWNERS,
): string[] {
  const record = toRecord(value);
  if (!record) {
    return ['event envelope must be a non-null object'];
  }

  const errors: string[] = [];
  const requiredStrings = [
    'eventId',
    'eventType',
    'occurredAt',
    'producer',
    'aggregateId',
    'correlationId',
    'causationId',
  ] as const;

  for (const field of requiredStrings) {
    if (!isNonBlankString(record[field])) {
      errors.push(`${field} is required and must be a non-blank string`);
    }
  }

  if (!isNonBlankString(record.schemaVersion)) {
    errors.push('schemaVersion is missing or blank — unversioned event envelopes are rejected');
  }
  if (isNonBlankString(record.eventType) && !isOwnerPrefixedKebab(record.eventType, owners)) {
    errors.push(`eventType "${record.eventType}" is not owner-prefixed lowercase kebab-case`);
  }
  if (isNonBlankString(record.occurredAt) && !isUtcIso8601(record.occurredAt)) {
    errors.push(
      `occurredAt "${record.occurredAt}" is not a UTC ISO-8601 timestamp (Z suffix required)`,
    );
  }
  if (isNonBlankString(record.producer) && !isOwned(record.producer, owners)) {
    errors.push(`producer "${record.producer}" is not a recognised bounded-context owner`);
  }
  if (!Object.hasOwn(record, 'payload')) {
    errors.push('payload is required on an immutable event envelope');
  }

  return errors;
}

/**
 * Returns an array of violation messages; `[]` means the command adheres to the
 * retryable-command envelope:
 *   owner, commandType, schemaVersion, idempotencyKey|key, actor,
 *   correlationId, causationId, time.
 */
export function validateCommandEnvelope(
  value: unknown,
  owners: readonly string[] = MODULE_OWNERS,
): string[] {
  const record = toRecord(value);
  if (!record) {
    return ['command envelope must be a non-null object'];
  }

  const errors: string[] = [];
  const requiredStrings = [
    'owner',
    'commandType',
    'actor',
    'correlationId',
    'causationId',
    'time',
  ] as const;

  for (const field of requiredStrings) {
    if (!isNonBlankString(record[field])) {
      errors.push(`${field} is required and must be a non-blank string`);
    }
  }

  if (!isNonBlankString(record.schemaVersion)) {
    errors.push('schemaVersion is missing or blank — unversioned command envelopes are rejected');
  }
  if (!isNonBlankString(record.idempotencyKey) && !isNonBlankString(record.key)) {
    errors.push('a retryable command requires a non-blank idempotencyKey (or key)');
  }
  if (isNonBlankString(record.owner) && !isOwned(record.owner, owners)) {
    errors.push(`owner "${record.owner}" is not a recognised bounded-context owner`);
  }
  if (isNonBlankString(record.commandType) && /\s/.test(record.commandType)) {
    errors.push(
      `commandType "${record.commandType}" must be a single imperative identifier (no whitespace)`,
    );
  }
  if (isNonBlankString(record.time) && !isUtcIso8601(record.time)) {
    errors.push(`time "${record.time}" is not a UTC ISO-8601 timestamp (Z suffix required)`);
  }

  return errors;
}

export function isImmutableEventEnvelope(
  value: unknown,
  owners: readonly string[] = MODULE_OWNERS,
): value is EventEnvelope {
  return validateEventEnvelope(value, owners).length === 0;
}

export function isRetryableCommand(
  value: unknown,
  owners: readonly string[] = MODULE_OWNERS,
): value is CommandEnvelope {
  return validateCommandEnvelope(value, owners).length === 0;
}
