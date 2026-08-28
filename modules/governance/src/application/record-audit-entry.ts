import {
  buildAuditEntry,
  computeIntakeRequestHash,
  isActorType,
  isAuditActionClass,
  isAuditOutcome,
  isJsonSerializable,
  isUtcIso8601Z,
  type AuditEntryHashedFields,
} from '../domain/audit-entry';
import {
  auditEntryToRecordedEvent,
  RECORD_AUDIT_ENTRY_COMMAND_TYPE,
  type AuditIntakePort,
  type RecordAuditEntryCommand,
  type RecordAuditEntryResult,
} from '../contracts/audit-intake';
import type { AuditEntryStore } from './audit-entry-store';

/**
 * `RecordAuditEntry` command handler (AD-3 / AD-25).
 *
 * Idempotency contract:
 *   - AD-25 identity = `(owner=governance, commandType=RecordAuditEntry,
 *     callerOrSubject, key)` plus the canonical request hash: a sha256 over the
 *     identity tuple + the intake source facts.
 *   - Same key + same hash  -> replays the original result (no new row).
 *   - Same key + different hash (incl. a different callerOrSubject or
 *     commandType) -> stable conflict (maps to HTTP 409).
 *   - New key              -> appends a new chain entry and emits the event.
 *   - Malformed input      -> structured `rejected` result (no DB call).
 *
 * The chain is append-only and strictly linear: read-terminal + insert runs as
 * ONE serialised store operation (`store.append`), so concurrent producers
 * cannot fork the chain (OCR-001).
 */
export class RecordAuditEntryHandler implements AuditIntakePort {
  constructor(private readonly store: AuditEntryStore) {}

  async recordAuditEntry(command: RecordAuditEntryCommand): Promise<RecordAuditEntryResult> {
    // OCR-003: validate BEFORE any store call so malformed input returns a
    // structured `rejected` result instead of a raw DB cast/serialization error
    // propagating and rolling back the producer's transaction.
    const errors = validateRecordAuditEntryCommand(command);
    if (errors.length > 0) {
      return {
        status: 'rejected',
        producer: producerOfIntake(command.intake),
        reason: 'invalid-command',
        errors,
      };
    }

    const producer = command.intake.producer;
    const idempotencyKey = command.key;

    // OCR-002: bind owner, commandType and callerOrSubject into the canonical
    // request hash — a key reused under a different identity conflicts instead
    // of silently conflating.
    const requestHash = computeIntakeRequestHash(command.intake, {
      owner: command.owner,
      commandType: command.commandType,
      callerOrSubject: command.callerOrSubject,
    });

    const existing = await this.store.findByIdempotency(producer, idempotencyKey);
    if (existing !== null) {
      if (existing.idempotencyHash === requestHash) {
        return {
          status: 'replayed',
          requestHash,
          entry: existing,
          event: auditEntryToRecordedEvent(existing),
        };
      }
      return {
        status: 'conflict',
        producer,
        idempotencyKey,
        storedHash: existing.idempotencyHash,
        receivedHash: requestHash,
        reason: 'idempotency-hash-mismatch',
      };
    }

    // OCR-001: serialised read-last + insert. The entry is built with the true
    // terminal prevEntryHash inside the store's critical section.
    const { inserted, entry } = await this.store.append((prevEntryHash) =>
      buildAuditEntry(
        buildHashedFields(command, requestHash, prevEntryHash, producer, idempotencyKey),
      ),
    );

    if (inserted) {
      return {
        status: 'recorded',
        requestHash,
        entry,
        event: auditEntryToRecordedEvent(entry),
      };
    }

    // Lost the insert race: re-read the winning row and apply replay/conflict.
    const winner = await this.store.findByIdempotency(producer, idempotencyKey);
    if (winner !== null && winner.idempotencyHash === requestHash) {
      return {
        status: 'replayed',
        requestHash,
        entry: winner,
        event: auditEntryToRecordedEvent(winner),
      };
    }
    return {
      status: 'conflict',
      producer,
      idempotencyKey,
      storedHash: winner?.idempotencyHash ?? null,
      receivedHash: requestHash,
      reason: 'idempotency-hash-mismatch',
    };
  }
}

function buildHashedFields(
  command: RecordAuditEntryCommand,
  requestHash: string,
  prevEntryHash: string,
  producer: string,
  idempotencyKey: string,
): AuditEntryHashedFields {
  return {
    prevEntryHash,
    actorType: command.intake.actorType,
    actorId: command.intake.actorId,
    occurredAt: command.intake.occurredAt,
    subjectType: command.intake.subjectType,
    subjectId: command.intake.subjectId,
    actionClass: command.intake.actionClass,
    action: command.intake.action,
    reasonCode: command.intake.reasonCode,
    reason: command.intake.reason,
    outcome: command.intake.outcome,
    correlationId: command.intake.correlationId,
    causationId: command.intake.causationId,
    producer,
    commandId: command.intake.commandId ?? null,
    eventId: command.intake.eventId ?? null,
    idempotencyKey,
    idempotencyHash: requestHash,
    schemaVersion: command.intake.schemaVersion,
    detail: command.intake.detail ?? null,
  };
}

function producerOfIntake(intake: unknown): string | null {
  if (typeof intake !== 'object' || intake === null) {
    return null;
  }
  const producer = (intake as { producer?: unknown }).producer;
  return typeof producer === 'string' ? producer : null;
}

function requireNonBlank(value: unknown, field: string, errors: string[]): void {
  if (typeof value !== 'string' || value.trim().length === 0) {
    errors.push(`${field} must be a non-blank string`);
  }
}

/**
 * OCR-003 input validation. Reuses the sanctioned domain guards
 * (`isAuditActionClass` / `isAuditOutcome` / `isActorType`) and additionally
 * requires a UTC ISO-8601 `Z` occurredAt, a present `schemaVersion`, and a
 * JSON-serializable `detail`. Runs before any DB call and returns a list of
 * human-readable failures (empty when the command is well-formed).
 */
export function validateRecordAuditEntryCommand(command: RecordAuditEntryCommand): string[] {
  const errors: string[] = [];

  // OCR-002: runtime-verify the AD-25 identity before processing.
  if (command.owner !== 'governance') {
    errors.push(`owner must be 'governance' (received ${JSON.stringify(command.owner)})`);
  }
  if (command.commandType !== RECORD_AUDIT_ENTRY_COMMAND_TYPE) {
    errors.push(
      `commandType must be '${RECORD_AUDIT_ENTRY_COMMAND_TYPE}' (received ${JSON.stringify(
        command.commandType,
      )})`,
    );
  }
  requireNonBlank(command.callerOrSubject, 'callerOrSubject', errors);
  requireNonBlank(command.key, 'key', errors);

  const intake: unknown = command.intake;
  if (typeof intake !== 'object' || intake === null) {
    errors.push('intake must be an object');
    return errors;
  }

  const rec = intake as Record<string, unknown>;
  requireNonBlank(rec.producer, 'intake.producer', errors);
  if (!isActorType(rec.actorType)) {
    errors.push(`intake.actorType is invalid (received ${JSON.stringify(rec.actorType)})`);
  }
  requireNonBlank(rec.actorId, 'intake.actorId', errors);
  if (!isUtcIso8601Z(rec.occurredAt)) {
    errors.push('intake.occurredAt must be a UTC ISO-8601 instant ending in `Z`');
  }
  requireNonBlank(rec.subjectType, 'intake.subjectType', errors);
  requireNonBlank(rec.subjectId, 'intake.subjectId', errors);
  if (!isAuditActionClass(rec.actionClass)) {
    errors.push(`intake.actionClass is invalid (received ${JSON.stringify(rec.actionClass)})`);
  }
  requireNonBlank(rec.action, 'intake.action', errors);
  requireNonBlank(rec.reasonCode, 'intake.reasonCode', errors);
  requireNonBlank(rec.reason, 'intake.reason', errors);
  if (!isAuditOutcome(rec.outcome)) {
    errors.push(`intake.outcome is invalid (received ${JSON.stringify(rec.outcome)})`);
  }
  requireNonBlank(rec.correlationId, 'intake.correlationId', errors);
  requireNonBlank(rec.causationId, 'intake.causationId', errors);
  requireNonBlank(rec.schemaVersion, 'intake.schemaVersion', errors);
  if (rec.commandId !== null && rec.commandId !== undefined && typeof rec.commandId !== 'string') {
    errors.push('intake.commandId must be a string or null');
  }
  if (rec.eventId !== null && rec.eventId !== undefined && typeof rec.eventId !== 'string') {
    errors.push('intake.eventId must be a string or null');
  }
  if (rec.detail !== undefined && !isJsonSerializable(rec.detail)) {
    errors.push('intake.detail must be JSON-serializable (no circular references or BigInt)');
  }

  return errors;
}
