import type { AuditActionClass, AuditEntry, AuditEntryIntake } from '../domain/audit-entry';

/**
 * Governance audit-intake contract (Story 1.5).
 *
 * This is the ONLY cross-module surface Governance publishes for producing
 * audit evidence (AD-1 / AD-11): producing modules submit a `RecordAuditEntry`
 * command through `AuditIntakePort` and observe a
 * `governance-audit-entry-recorded` event, without ever importing Governance's
 * domain, repository, ORM model, or adapter.
 */

export const RECORD_AUDIT_ENTRY_COMMAND_TYPE = 'RecordAuditEntry' as const;
export const AUDIT_ENTRY_RECORDED_EVENT_TYPE = 'governance-audit-entry-recorded' as const;
export const AUDIT_INTAKE_SCHEMA_VERSION = 'v1' as const;

/**
 * AD-25 command identity is `(owner, commandType, callerOrSubject, key)` plus a
 * canonical request hash. `callerOrSubject` is the actor/context that requested
 * the audited action; `key` is the idempotency key.
 */
export interface RecordAuditEntryCommand {
  owner: 'governance';
  commandType: typeof RECORD_AUDIT_ENTRY_COMMAND_TYPE;
  schemaVersion: string;
  callerOrSubject: string;
  key: string;
  actor: string;
  correlationId: string;
  causationId: string;
  time: string;
  intake: AuditEntryIntake;
}

export type RecordAuditEntryStatus = 'recorded' | 'replayed' | 'conflict' | 'rejected';

export interface RecordAuditEntrySuccess {
  status: 'recorded' | 'replayed';
  /** The canonical AD-25 request hash sha256 over the intake source facts. */
  requestHash: string;
  entry: AuditEntry;
  event: GovernanceAuditEntryRecordedEvent;
}

export interface RecordAuditEntryConflict {
  status: 'conflict';
  producer: string;
  idempotencyKey: string;
  /** Hash stored on the existing row (null when the row could not be read). */
  storedHash: string | null;
  receivedHash: string;
  reason: 'idempotency-hash-mismatch';
}

export interface RecordAuditEntryRejected {
  status: 'rejected';
  /** Producer from the intake when it was parseable, else null. */
  producer: string | null;
  reason: 'invalid-command';
  /** Human-readable validation failures (OCR-003). */
  errors: string[];
}

export type RecordAuditEntryResult =
  RecordAuditEntrySuccess | RecordAuditEntryConflict | RecordAuditEntryRejected;

export interface GovernanceAuditEntryRecordedEvent {
  eventId: string;
  eventType: typeof AUDIT_ENTRY_RECORDED_EVENT_TYPE;
  occurredAt: string;
  producer: 'governance';
  aggregateId: string;
  schemaVersion: string;
  correlationId: string;
  causationId: string;
  payload: GovernanceAuditEntryRecordedPayload;
}

export interface GovernanceAuditEntryRecordedPayload {
  auditEntryId: string;
  prevEntryHash: string;
  entryHash: string;
  producer: string;
  actionClass: AuditActionClass;
  subjectType: string;
  subjectId: string;
  idempotencyKey: string;
  idempotencyHash: string;
}

/** Builds the immutable event envelope for a recorded (or replayed) entry. */
export function auditEntryToRecordedEvent(entry: AuditEntry): GovernanceAuditEntryRecordedEvent {
  return {
    eventId: entry.auditEntryId,
    eventType: AUDIT_ENTRY_RECORDED_EVENT_TYPE,
    occurredAt: entry.occurredAt,
    producer: 'governance',
    aggregateId: entry.auditEntryId,
    schemaVersion: entry.schemaVersion,
    correlationId: entry.correlationId,
    causationId: entry.causationId,
    payload: {
      auditEntryId: entry.auditEntryId,
      prevEntryHash: entry.prevEntryHash,
      entryHash: entry.entryHash,
      producer: entry.producer,
      actionClass: entry.actionClass,
      subjectType: entry.subjectType,
      subjectId: entry.subjectId,
      idempotencyKey: entry.idempotencyKey,
      idempotencyHash: entry.idempotencyHash,
    },
  };
}

/**
 * The synchronous audit-intake port. Producing modules call it inside their own
 * transaction: a mandatory-intake failure must roll back the whole transaction
 * (write failure == business failure), while non-mandatory intake may surface a
 * recoverable exception and continue.
 */
export interface AuditIntakePort {
  recordAuditEntry(command: RecordAuditEntryCommand): Promise<RecordAuditEntryResult>;
}

/** True when a command carries the identity tuple Governance expects. */
export function isRecordAuditEntryCommand(value: unknown): value is RecordAuditEntryCommand {
  const record = value as Record<string, unknown> | null;
  return (
    typeof value === 'object' &&
    value !== null &&
    record !== null &&
    record.owner === 'governance' &&
    record.commandType === RECORD_AUDIT_ENTRY_COMMAND_TYPE &&
    typeof record.key === 'string' &&
    typeof record.callerOrSubject === 'string' &&
    typeof record.intake === 'object' &&
    record.intake !== null
  );
}
