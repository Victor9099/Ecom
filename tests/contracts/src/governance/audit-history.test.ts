import { describe, expect, it } from 'vitest';
import {
  GENESIS_PREV_HASH,
  buildAuditEntry,
  computeEntryHash,
  computeIntakeRequestHash,
  sha256Hex,
  stableStringify,
  uuidv7,
  type AuditEntry,
  type AuditEntryHashedFields,
  type AuditEntryIntake,
} from '../../../../modules/governance/src/domain/audit-entry';
import {
  AUDIT_ENTRY_RECORDED_EVENT_TYPE,
  type RecordAuditEntryCommand,
} from '../../../../modules/governance/src/contracts/audit-intake';
import { RecordAuditEntryHandler } from '../../../../modules/governance/src/application/record-audit-entry';
import { ListAuditEntriesQueryHandler } from '../../../../modules/governance/src/application/list-audit-entries';
import { InMemoryAuditEntryStore } from './in-memory-audit-store';

function makeIntake(overrides: Partial<AuditEntryIntake> = {}): AuditEntryIntake {
  return {
    producer: 'orders',
    actorType: 'service',
    actorId: 'checkout',
    occurredAt: '2026-08-27T15:30:00.000Z',
    subjectType: 'order',
    subjectId: 'order_1',
    actionClass: 'governance_refund_execution',
    action: 'refund-approved',
    reasonCode: 'FULL_REFUND',
    reason: 'Approved pre-fulfillment refund',
    outcome: 'success',
    correlationId: 'corr_1',
    causationId: 'caus_1',
    commandId: null,
    eventId: null,
    schemaVersion: 'v1',
    detail: { amountMinor: 100 },
    ...overrides,
  };
}

function makeCommand(overrides: Partial<RecordAuditEntryCommand> = {}): RecordAuditEntryCommand {
  return {
    owner: 'governance',
    commandType: 'RecordAuditEntry',
    schemaVersion: 'v1',
    callerOrSubject: 'orders:order_1',
    key: 'key-1',
    actor: 'system:checkout',
    correlationId: 'corr_1',
    causationId: 'caus_1',
    time: '2026-08-27T15:30:00.001Z',
    intake: makeIntake(),
    ...overrides,
  };
}

function hashedFieldsOf(entry: AuditEntry): AuditEntryHashedFields {
  const { auditEntryId: _auditEntryId, entryHash: _entryHash, ...fields } = entry;
  return fields;
}

function intakeIdentity(command: RecordAuditEntryCommand) {
  return {
    owner: command.owner,
    commandType: command.commandType,
    callerOrSubject: command.callerOrSubject,
  };
}

describe('AuditEntry domain — UUIDv7 and sha256 chain primitives', () => {
  it('generates RFC 9562 UUIDv7 values (version 7, RFC 4122 variant)', () => {
    const id = uuidv7();
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(id[14]).toBe('7');
    expect('89ab'.includes(id[19]!)).toBe(true);
    expect(uuidv7()).not.toBe(uuidv7());
  });

  it('orders UUIDv7 values chronologically by their embedded timestamp', () => {
    const earlier = uuidv7(1_700_000_000_000);
    const later = uuidv7(1_700_000_000_001);
    expect(earlier < later).toBe(true);
  });

  it('computes deterministic sha256 and stable canonical JSON', () => {
    expect(sha256Hex('a')).toBe(sha256Hex('a'));
    expect(sha256Hex('a')).not.toBe(sha256Hex('b'));
    expect(stableStringify({ b: 1, a: 2 })).toBe(stableStringify({ a: 2, b: 1 }));
    expect(stableStringify(undefined)).toBe('null');
    expect(stableStringify([3, 1, 2])).toBe('[3,1,2]');
  });

  it('binds every hashed entry field into the chain hash', () => {
    const base = {
      prevEntryHash: GENESIS_PREV_HASH,
      actorType: 'service' as const,
      actorId: 'checkout',
      occurredAt: '2026-08-27T15:30:00.000Z',
      subjectType: 'order',
      subjectId: 'order_1',
      actionClass: 'governance_refund_execution' as const,
      action: 'refund-approved',
      reasonCode: 'FULL_REFUND',
      reason: 'reason',
      outcome: 'success' as const,
      correlationId: 'corr',
      causationId: 'caus',
      producer: 'orders',
      commandId: null,
      eventId: null,
      idempotencyKey: 'k',
      idempotencyHash: 'h',
      schemaVersion: 'v1',
      detail: null,
    };
    const first = buildAuditEntry(base);
    expect(first.entryHash).toBe(computeEntryHash(base));
    expect(first.auditEntryId).toMatch(/^[0-9a-f-]{36}$/);

    // Changing the previous hash (the chain link) or any source field changes the hash.
    expect(computeEntryHash({ ...base, prevEntryHash: 'f'.repeat(64) })).not.toBe(first.entryHash);
    expect(computeEntryHash({ ...base, reason: 'changed' })).not.toBe(first.entryHash);
    expect(computeEntryHash({ ...base, detail: { changed: true } })).not.toBe(first.entryHash);
  });

  it('derives a stable canonical request hash bound to the AD-25 identity (OCR-002)', () => {
    const identity = {
      owner: 'governance',
      commandType: 'RecordAuditEntry',
      callerOrSubject: 'orders:order_1',
    };
    const intake = makeIntake();
    expect(computeIntakeRequestHash(intake, identity)).toBe(
      computeIntakeRequestHash(makeIntake(), identity),
    );
    expect(computeIntakeRequestHash(intake, identity)).not.toBe(
      computeIntakeRequestHash(makeIntake({ outcome: 'denied' }), identity),
    );
    expect(computeIntakeRequestHash(intake, identity)).not.toBe(
      computeIntakeRequestHash(makeIntake({ detail: { b: 2, a: 1 } }), identity),
    );
    // OCR-002: the identity segment is bound into the hash — a different
    // callerOrSubject or commandType changes the hash for the same intake.
    expect(computeIntakeRequestHash(intake, identity)).not.toBe(
      computeIntakeRequestHash(intake, { ...identity, callerOrSubject: 'catalog:sku-1' }),
    );
    expect(computeIntakeRequestHash(intake, identity)).not.toBe(
      computeIntakeRequestHash(intake, { ...identity, commandType: 'OtherCommand' }),
    );
  });
});

describe('RecordAuditEntry handler — append-only chain + AD-25 idempotency', () => {
  it('records the first entry against the genesis sentinel and emits the event', async () => {
    const store = new InMemoryAuditEntryStore();
    const handler = new RecordAuditEntryHandler(store);
    const result = await handler.recordAuditEntry(makeCommand());

    expect(result.status).toBe('recorded');
    if (result.status === 'recorded') {
      expect(result.entry.prevEntryHash).toBe(GENESIS_PREV_HASH);
      expect(result.entry.entryHash).toBe(computeEntryHash(hashedFieldsOf(result.entry)));
      expect(result.event.eventType).toBe(AUDIT_ENTRY_RECORDED_EVENT_TYPE);
      expect(result.event.producer).toBe('governance');
      expect(result.event.aggregateId).toBe(result.entry.auditEntryId);
      expect(result.requestHash).toBe(
        computeIntakeRequestHash(makeCommand().intake, intakeIdentity(makeCommand())),
      );
    }
  });

  it('replays the original result for the same key + same hash', async () => {
    const store = new InMemoryAuditEntryStore();
    const handler = new RecordAuditEntryHandler(store);
    const first = await handler.recordAuditEntry(makeCommand());
    const second = await handler.recordAuditEntry(makeCommand());

    expect(first.status).toBe('recorded');
    expect(second.status).toBe('replayed');
    if (first.status === 'recorded' && second.status === 'replayed') {
      expect(second.entry.auditEntryId).toBe(first.entry.auditEntryId);
      expect(second.entry.entryHash).toBe(first.entry.entryHash);
      expect(second.event.eventId).toBe(first.event.eventId);
    }
    expect(store.list({ limit: 10, after: null })).resolves.toMatchObject({ count: 1 });
  });

  it('returns a stable 409 conflict for the same key + different hash', async () => {
    const store = new InMemoryAuditEntryStore();
    const handler = new RecordAuditEntryHandler(store);
    const first = await handler.recordAuditEntry(makeCommand());
    const conflicting = makeCommand({ intake: makeIntake({ outcome: 'denied' }) });
    const second = await handler.recordAuditEntry(conflicting);

    expect(first.status).toBe('recorded');
    expect(second.status).toBe('conflict');
    if (first.status === 'recorded' && second.status === 'conflict') {
      expect(second.storedHash).toBe(first.requestHash);
      expect(second.receivedHash).toBe(
        computeIntakeRequestHash(conflicting.intake, intakeIdentity(conflicting)),
      );
      expect(second.reason).toBe('idempotency-hash-mismatch');
    }
    expect(store.list({ limit: 10, after: null })).resolves.toMatchObject({ count: 1 });
  });

  it('links a new entry to the terminal entry hash (append-only chain)', async () => {
    const store = new InMemoryAuditEntryStore();
    const handler = new RecordAuditEntryHandler(store);
    const first = await handler.recordAuditEntry(makeCommand({ key: 'k1' }));
    const second = await handler.recordAuditEntry(makeCommand({ key: 'k2' }));

    expect(first.status).toBe('recorded');
    expect(second.status).toBe('recorded');
    if (first.status === 'recorded' && second.status === 'recorded') {
      expect(second.entry.prevEntryHash).toBe(first.entry.entryHash);
      expect(second.entry.entryHash).toBe(computeEntryHash(hashedFieldsOf(second.entry)));
    }
  });

  it('serialises concurrent appends into ONE linear chain (OCR-001)', async () => {
    const store = new InMemoryAuditEntryStore();
    const handler = new RecordAuditEntryHandler(store);

    const results = await Promise.all([
      handler.recordAuditEntry(makeCommand({ key: 'race-a' })),
      handler.recordAuditEntry(makeCommand({ key: 'race-b' })),
      handler.recordAuditEntry(makeCommand({ key: 'race-c' })),
    ]);
    for (const result of results) {
      expect(result.status).toBe('recorded');
    }

    const page = await store.list({ limit: 100, after: null });
    const entries = page.rows;
    expect(entries).toHaveLength(3);

    // Follow prevEntryHash links (order-independent: concurrent same-ms UUIDv7
    // values have no guaranteed sort). Exactly one head against the genesis
    // sentinel, and one walk covers every entry — a fork would leave a stranded
    // entry and a chain shorter than 3.
    const byPrevEntryHash = new Map<string, AuditEntry>();
    for (const entry of entries) {
      byPrevEntryHash.set(entry.prevEntryHash, entry);
    }
    const heads = entries.filter((entry) => entry.prevEntryHash === GENESIS_PREV_HASH);
    expect(heads).toHaveLength(1);

    const chain: AuditEntry[] = [];
    let next: AuditEntry | undefined = heads[0];
    while (next !== undefined) {
      chain.push(next);
      next = byPrevEntryHash.get(next.entryHash);
    }
    expect(chain).toHaveLength(3);

    // Single terminal entry: exactly one entryHash is referenced by nobody.
    const referenced = new Set(entries.map((entry) => entry.prevEntryHash));
    const terminals = entries.filter((entry) => !referenced.has(entry.entryHash));
    expect(terminals).toHaveLength(1);
    expect(terminals[0]!.entryHash).toBe(chain[chain.length - 1]!.entryHash);
  });

  it('conflicts (not replays) when a key is reused under a different callerOrSubject (OCR-002)', async () => {
    const store = new InMemoryAuditEntryStore();
    const handler = new RecordAuditEntryHandler(store);
    const first = await handler.recordAuditEntry(makeCommand({ key: 'k' }));

    const reuseUnderDifferentSubject = await handler.recordAuditEntry(
      makeCommand({ key: 'k', callerOrSubject: 'catalog:sku-1' }),
    );

    expect(first.status).toBe('recorded');
    expect(reuseUnderDifferentSubject.status).toBe('conflict');
    expect(store.list({ limit: 10, after: null })).resolves.toMatchObject({ count: 1 });
  });

  it('rejects malformed input before any DB call with a structured failure (OCR-003)', async () => {
    const store = new InMemoryAuditEntryStore();
    const handler = new RecordAuditEntryHandler(store);

    const notUtc = await handler.recordAuditEntry(
      makeCommand({ intake: makeIntake({ occurredAt: '2026-08-27T15:30:00+07:00' }) }),
    );
    expect(notUtc.status).toBe('rejected');
    if (notUtc.status === 'rejected') {
      expect(notUtc.reason).toBe('invalid-command');
      expect(notUtc.errors).toEqual([
        'intake.occurredAt must be a UTC ISO-8601 instant ending in `Z`',
      ]);
      expect(notUtc.producer).toBe('orders');
    }

    const badOwner = await handler.recordAuditEntry({
      ...makeCommand(),
      owner: 'catalog',
    } as unknown as RecordAuditEntryCommand);
    expect(badOwner.status).toBe('rejected');

    const circular: Record<string, unknown> = {};
    circular.self = circular;
    const badDetail = await handler.recordAuditEntry(
      makeCommand({ intake: makeIntake({ detail: circular }) }),
    );
    expect(badDetail.status).toBe('rejected');
    if (badDetail.status === 'rejected') {
      expect(badDetail.errors.some((error) => error.includes('JSON-serializable'))).toBe(true);
    }

    // None of the rejected commands touched the store.
    expect(store.list({ limit: 10, after: null })).resolves.toMatchObject({ count: 0 });
  });
});

describe('ListAuditEntries query — pagination, count and chain digest', () => {
  it('returns rows + running count + terminal chain digest (empty -> genesis)', async () => {
    const store = new InMemoryAuditEntryStore();
    const query = new ListAuditEntriesQueryHandler(store);
    const page = await query.handle({});
    expect(page.rows).toEqual([]);
    expect(page.runningCount).toBe(0);
    expect(page.chainDigest).toBe(GENESIS_PREV_HASH);
    expect(page.nextCursor).toBeNull();
  });

  it('pages stably by occurredAt desc with a UUIDv7 tie-breaker', async () => {
    const store = new InMemoryAuditEntryStore();
    const handler = new RecordAuditEntryHandler(store);
    const times = [
      '2026-08-27T15:00:00.000Z',
      '2026-08-27T15:10:00.000Z',
      '2026-08-27T15:20:00.000Z',
    ];
    for (let i = 0; i < times.length; i += 1) {
      const result = await handler.recordAuditEntry(
        makeCommand({ key: `k${i}`, intake: makeIntake({ occurredAt: times[i]! }) }),
      );
      expect(result.status).toBe('recorded');
    }

    const query = new ListAuditEntriesQueryHandler(store);
    const page1 = await query.handle({ limit: 2 });
    expect(page1.rows.map((e) => e.occurredAt)).toEqual([times[2], times[1]]);
    expect(page1.runningCount).toBe(3);
    expect(page1.nextCursor).not.toBeNull();

    const page2 = await query.handle({ limit: 2, cursor: page1.nextCursor ?? undefined });
    expect(page2.rows.map((e) => e.occurredAt)).toEqual([times[0]]);
    expect(page2.nextCursor).toBeNull();

    const last = await store.findLastEntry();
    expect(page1.chainDigest).toBe(last?.entryHash);
  });

  it('reconciles the stored chain against the produced source-event count (integrity)', async () => {
    const store = new InMemoryAuditEntryStore();
    const handler = new RecordAuditEntryHandler(store);
    const count = 5;
    for (let i = 0; i < count; i += 1) {
      await handler.recordAuditEntry(
        makeCommand({
          key: `k${i}`,
          intake: makeIntake({
            subjectId: `order_${i}`,
            occurredAt: `2026-08-27T15:${String(i).padStart(2, '0')}:00.000Z`,
          }),
        }),
      );
    }

    const query = new ListAuditEntriesQueryHandler(store);
    const page = await query.handle({ limit: 100 });
    expect(page.runningCount).toBe(count);
    expect(page.rows).toHaveLength(count);

    // Walk the chain and recompute every entry hash from (prevHash + fields).
    // Chain walk must follow append order (oldest -> newest).
    let previousHash = GENESIS_PREV_HASH;
    for (const entry of [...page.rows].reverse()) {
      expect(entry.prevEntryHash).toBe(previousHash);
      expect(entry.entryHash).toBe(computeEntryHash(hashedFieldsOf(entry)));
      previousHash = entry.entryHash;
    }
    expect(page.chainDigest).toBe(page.rows[0]!.entryHash);
  });

  it('filters by subject and action class and reports the filtered count', async () => {
    const store = new InMemoryAuditEntryStore();
    const handler = new RecordAuditEntryHandler(store);
    await handler.recordAuditEntry(
      makeCommand({ key: 'a', intake: makeIntake({ actionClass: 'governance_audit_access' }) }),
    );
    await handler.recordAuditEntry(
      makeCommand({ key: 'b', intake: makeIntake({ actionClass: 'governance_refund_execution' }) }),
    );
    await handler.recordAuditEntry(
      makeCommand({ key: 'c', intake: makeIntake({ subjectId: 'order_9' }) }),
    );

    const query = new ListAuditEntriesQueryHandler(store);
    const bySubject = await query.handle({ subjectId: 'order_9' });
    expect(bySubject.runningCount).toBe(1);
    expect(bySubject.rows[0]!.subjectId).toBe('order_9');

    const byActionClass = await query.handle({ actionClass: 'governance_audit_access' });
    expect(byActionClass.runningCount).toBe(1);
    expect(byActionClass.rows[0]!.actionClass).toBe('governance_audit_access');
  });

  it('does not emit a trailing empty page when count is an exact multiple of limit (OCR-005)', async () => {
    const store = new InMemoryAuditEntryStore();
    const handler = new RecordAuditEntryHandler(store);
    const times = [
      '2026-08-27T15:00:00.000Z',
      '2026-08-27T15:10:00.000Z',
      '2026-08-27T15:20:00.000Z',
      '2026-08-27T15:30:00.000Z',
    ];
    for (let i = 0; i < times.length; i += 1) {
      const result = await handler.recordAuditEntry(
        makeCommand({ key: `k${i}`, intake: makeIntake({ occurredAt: times[i]! }) }),
      );
      expect(result.status).toBe('recorded');
    }

    const query = new ListAuditEntriesQueryHandler(store);
    const page1 = await query.handle({ limit: 2 });
    expect(page1.rows).toHaveLength(2);
    expect(page1.runningCount).toBe(4);
    expect(page1.nextCursor).not.toBeNull();

    const page2 = await query.handle({ limit: 2, cursor: page1.nextCursor ?? undefined });
    expect(page2.rows).toHaveLength(2);
    expect(page2.runningCount).toBe(4);
    expect(page2.nextCursor).toBeNull();
  });
});
