import {
  buildAuditEntry,
  computeIntakeRequestHash,
  GENESIS_PREV_HASH,
  type AuditEntryHashedFields,
} from '../domain/audit-entry';
import {
  auditEntryToRecordedEvent,
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
 *     callerOrSubject, key)` plus the canonical request hash sha256 over the
 *     intake source facts.
 *   - Same key + same hash  -> replays the original result (no new row).
 *   - Same key + different hash -> stable conflict (maps to HTTP 409).
 *   - New key              -> appends a new chain entry and emits the event.
 *
 * The chain is append-only: each entry's `prevEntryHash` is the terminal
 * `entryHash` before it (or the genesis sentinel for the first entry).
 */
export class RecordAuditEntryHandler implements AuditIntakePort {
  constructor(private readonly store: AuditEntryStore) {}

  async recordAuditEntry(command: RecordAuditEntryCommand): Promise<RecordAuditEntryResult> {
    const requestHash = computeIntakeRequestHash(command.intake);
    const producer = command.intake.producer;
    const idempotencyKey = command.key;

    const existing = await this.store.findByIdempotency(producer, idempotencyKey);
    if (existing !== null) {
      // The key is already taken: identical hash replays, otherwise conflict.
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

    const last = await this.store.findLastEntry();
    const fields: AuditEntryHashedFields = {
      prevEntryHash: last?.entryHash ?? GENESIS_PREV_HASH,
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
    const entry = buildAuditEntry(fields);

    const { inserted } = await this.store.insertIfAbsent(entry);
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
