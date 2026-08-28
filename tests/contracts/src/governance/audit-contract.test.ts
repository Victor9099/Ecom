import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  MODULE_OWNERS,
  schemaVersionMatchesDirectory,
  validateCommandEnvelope,
  validateEventEnvelope,
} from '../lib/envelopes';
import {
  isAuditActionClass,
  isActorType,
  isAuditOutcome,
  buildAuditEntry,
  GENESIS_PREV_HASH,
  type AuditEntryIntake,
} from '../../../../modules/governance/src/domain/audit-entry';
import {
  AUDIT_ENTRY_RECORDED_EVENT_TYPE,
  isRecordAuditEntryCommand,
  auditEntryToRecordedEvent,
  RECORD_AUDIT_ENTRY_COMMAND_TYPE,
  type RecordAuditEntryCommand,
} from '../../../../modules/governance/src/contracts/audit-intake';

const contractsRoot = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..');
const fixturePath = path.join(
  contractsRoot,
  'fixtures',
  'governance',
  'record-audit-entry',
  'v1',
  'fixtures',
  'recorded.json',
);

function loadFixture(): RecordAuditEntryCommand {
  return JSON.parse(readFileSync(fixturePath, 'utf8')) as RecordAuditEntryCommand;
}

describe('record-audit-entry/v1 contract — command + event envelope conformance', () => {
  it('accepts the released fixture command against the AD-3 command envelope', () => {
    const command = loadFixture();
    expect(command.owner).toBe('governance');
    expect(command.commandType).toBe(RECORD_AUDIT_ENTRY_COMMAND_TYPE);
    expect(schemaVersionMatchesDirectory(command.schemaVersion, 'v1')).toBe(true);
    expect(isRecordAuditEntryCommand(command)).toBe(true);
    expect(validateCommandEnvelope(command, MODULE_OWNERS)).toEqual([]);
  });

  it('rejects a RecordAuditEntry command missing its idempotency key', () => {
    const command = loadFixture() as unknown as Record<string, unknown>;
    const withoutKey = { ...command };
    delete withoutKey.key;
    const errors = validateCommandEnvelope(withoutKey, MODULE_OWNERS);
    expect(errors.some((error) => error.includes('requires a non-blank idempotencyKey'))).toBe(
      true,
    );
  });

  it('emits an AD-10-conformant governance-audit-entry-recorded event', () => {
    const intake: AuditEntryIntake = {
      producer: 'catalog',
      actorType: 'human',
      actorId: 'operator_1',
      occurredAt: '2026-08-27T16:00:00.000Z',
      subjectType: 'sku',
      subjectId: 'SKU-1',
      actionClass: 'governance_sku_classification',
      action: 'classified',
      reasonCode: 'REVIEW',
      reason: 'Regulatory classification reviewed',
      outcome: 'success',
      correlationId: 'corr',
      causationId: 'caus',
      commandId: null,
      eventId: null,
      schemaVersion: 'v1',
      detail: null,
    };
    const entry = buildAuditEntry({
      prevEntryHash: GENESIS_PREV_HASH,
      ...intake,
      idempotencyKey: 'key',
      idempotencyHash: 'hash',
    });
    const event = auditEntryToRecordedEvent(entry);

    expect(event.eventType).toBe(AUDIT_ENTRY_RECORDED_EVENT_TYPE);
    expect(validateEventEnvelope(event, MODULE_OWNERS)).toEqual([]);
    expect(event.payload.actionClass).toBe('governance_sku_classification');
    expect(event.aggregateId).toBe(entry.auditEntryId);
  });

  it('binds the sanctioned enum values into the fixture intake', () => {
    const command = loadFixture();
    const intake = command.intake;
    expect(isActorType(intake.actorType)).toBe(true);
    expect(isAuditOutcome(intake.outcome)).toBe(true);
    expect(isAuditActionClass(intake.actionClass)).toBe(true);
  });
});
