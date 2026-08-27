import { describe, expect, it } from 'vitest';
import {
  MODULE_OWNERS,
  isImmutableEventEnvelope,
  isRetryableCommand,
  schemaVersionMatchesDirectory,
  validateCommandEnvelope,
  validateEventEnvelope,
} from './lib/envelopes';

const wellFormedEvent = {
  eventId: '01J3Z0E7A00000000000000000',
  eventType: 'cart-item-added',
  occurredAt: '2026-08-27T15:30:00.000Z',
  producer: 'cart',
  aggregateId: '01J3Z0E7A00000000000000001',
  schemaVersion: 'v1',
  correlationId: '01J3Z0E7A00000000000000002',
  causationId: '01J3Z0E7A00000000000000003',
  payload: { cartId: '01J3Z0E7A00000000000000004', sku: 'SKU-1', quantity: 1 },
};

const wellFormedCommand = {
  owner: 'cart',
  commandType: 'AddCartItem',
  schemaVersion: 'v1',
  idempotencyKey: '01J3Z0E7A00000000000000005',
  actor: 'customer:u_123',
  correlationId: '01J3Z0E7A00000000000000006',
  causationId: '01J3Z0E7A00000000000000007',
  time: '2026-08-27T15:30:00.000Z',
};

function errorsInclude(errors: string[], phrase: string): boolean {
  return errors.some((error) => error.includes(phrase));
}

describe('Story 1.2 command/event fixture validation (AC4) — positive path', () => {
  it('accepts a well-formed immutable event envelope', () => {
    expect(validateEventEnvelope(wellFormedEvent, MODULE_OWNERS)).toEqual([]);
    expect(isImmutableEventEnvelope(wellFormedEvent, MODULE_OWNERS)).toBe(true);
  });

  it('accepts a well-formed retryable command envelope (idempotencyKey)', () => {
    expect(validateCommandEnvelope(wellFormedCommand, MODULE_OWNERS)).toEqual([]);
    expect(isRetryableCommand(wellFormedCommand, MODULE_OWNERS)).toBe(true);
  });

  it('accepts a retryable command that uses `key` in place of `idempotencyKey`', () => {
    const { idempotencyKey: _key, ...withKey } = wellFormedCommand;
    expect(validateCommandEnvelope({ ...withKey, key: 'key-123' }, MODULE_OWNERS)).toEqual([]);
  });

  it('binds the fixture schemaVersion to the versioned directory (v<N>)', () => {
    expect(schemaVersionMatchesDirectory('v1', 'v1')).toBe(true);
    expect(schemaVersionMatchesDirectory('v1', 'v2')).toBe(false);
    expect(schemaVersionMatchesDirectory('', 'v1')).toBe(false);
  });
});

describe('Story 1.2 command/event fixture validation (AC4) — negative units (rejected)', () => {
  it('rejects a non-object envelope', () => {
    expect(errorsInclude(validateEventEnvelope(null), 'must be a non-null object')).toBe(true);
    expect(
      errorsInclude(validateCommandEnvelope('not-an-object'), 'must be a non-null object'),
    ).toBe(true);
  });

  it('rejects an event missing a required identity field', () => {
    const missingField = { ...wellFormedEvent };
    delete (missingField as Record<string, unknown>).eventId;
    expect(
      errorsInclude(validateEventEnvelope(missingField, MODULE_OWNERS), 'eventId is required'),
    ).toBe(true);
  });

  it('rejects an unversioned event (missing/blank schemaVersion)', () => {
    expect(
      errorsInclude(
        validateEventEnvelope({ ...wellFormedEvent, schemaVersion: '' }, MODULE_OWNERS),
        'unversioned event envelopes are rejected',
      ),
    ).toBe(true);
    const missingVersion = { ...wellFormedEvent };
    delete (missingVersion as Record<string, unknown>).schemaVersion;
    expect(
      errorsInclude(
        validateEventEnvelope(missingVersion, MODULE_OWNERS),
        'unversioned event envelopes are rejected',
      ),
    ).toBe(true);
  });

  it('rejects an event whose schemaVersion is incompatible with its directory', () => {
    expect(schemaVersionMatchesDirectory('v2', 'v1')).toBe(false);
    expect(schemaVersionMatchesDirectory('v1', 'v1')).toBe(true);
  });

  it('rejects an event with a non-UTC or malformed occurredAt', () => {
    expect(
      errorsInclude(
        validateEventEnvelope(
          { ...wellFormedEvent, occurredAt: '2026-08-27T22:30:00+07:00' },
          MODULE_OWNERS,
        ),
        'occurredAt "2026-08-27T22:30:00+07:00" is not a UTC ISO-8601 timestamp',
      ),
    ).toBe(true);
    expect(
      errorsInclude(
        validateEventEnvelope({ ...wellFormedEvent, occurredAt: 'not-a-date' }, MODULE_OWNERS),
        'occurredAt "not-a-date" is not a UTC ISO-8601 timestamp',
      ),
    ).toBe(true);
  });

  it('rejects an event whose eventType is not owner-prefixed kebab-case', () => {
    expect(
      errorsInclude(
        validateEventEnvelope({ ...wellFormedEvent, eventType: 'ItemAdded' }, MODULE_OWNERS),
        'is not owner-prefixed lowercase kebab-case',
      ),
    ).toBe(true);
    expect(
      errorsInclude(
        validateEventEnvelope({ ...wellFormedEvent, eventType: 'item.added' }, MODULE_OWNERS),
        'is not owner-prefixed lowercase kebab-case',
      ),
    ).toBe(true);
  });

  it('rejects an event whose producer is not a recognised owner', () => {
    expect(
      errorsInclude(
        validateEventEnvelope({ ...wellFormedEvent, producer: 'billing' }, MODULE_OWNERS),
        'producer "billing" is not a recognised bounded-context owner',
      ),
    ).toBe(true);
  });

  it('rejects an event without a payload', () => {
    const noPayload = { ...wellFormedEvent };
    delete (noPayload as Record<string, unknown>).payload;
    expect(
      errorsInclude(
        validateEventEnvelope(noPayload, MODULE_OWNERS),
        'payload is required on an immutable event envelope',
      ),
    ).toBe(true);
  });

  it('rejects an unversioned command (missing/blank schemaVersion)', () => {
    expect(
      errorsInclude(
        validateCommandEnvelope({ ...wellFormedCommand, schemaVersion: '' }, MODULE_OWNERS),
        'unversioned command envelopes are rejected',
      ),
    ).toBe(true);
  });

  it('rejects a retryable command without idempotencyKey (or key)', () => {
    const noIdem = { ...wellFormedCommand };
    delete (noIdem as Record<string, unknown>).idempotencyKey;
    expect(
      errorsInclude(
        validateCommandEnvelope(noIdem, MODULE_OWNERS),
        'retryable command requires a non-blank idempotencyKey',
      ),
    ).toBe(true);
  });

  it('rejects a command with an unknown owner', () => {
    expect(
      errorsInclude(
        validateCommandEnvelope({ ...wellFormedCommand, owner: 'billing' }, MODULE_OWNERS),
        'owner "billing" is not a recognised bounded-context owner',
      ),
    ).toBe(true);
  });

  it('rejects a command with a whitespace-bearing commandType', () => {
    expect(
      errorsInclude(
        validateCommandEnvelope({ ...wellFormedCommand, commandType: 'add item' }, MODULE_OWNERS),
        'commandType "add item" must be a single imperative identifier',
      ),
    ).toBe(true);
  });

  it('rejects a command with a non-UTC time', () => {
    expect(
      errorsInclude(
        validateCommandEnvelope(
          { ...wellFormedCommand, time: '2026-08-27T22:30:00+07:00' },
          MODULE_OWNERS,
        ),
        'time "2026-08-27T22:30:00+07:00" is not a UTC ISO-8601 timestamp',
      ),
    ).toBe(true);
  });
});
