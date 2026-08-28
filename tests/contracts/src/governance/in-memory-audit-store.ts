import type { AuditEntry } from '../../../../modules/governance/src/domain/audit-entry';
import type {
  AuditEntryStore,
  ListAuditEntriesPage,
  ListAuditEntriesQuery,
} from '../../../../modules/governance/src/application/audit-entry-store';

/**
 * In-memory fake of the append-only `AuditEntryStore` used by the Governance
 * unit tests (no live Postgres — AD-29 defers DB provisioning). It reproduces
 * the exact create + read contract of the Prisma adapter: `insertIfAbsent`
 * enforces the `(producer, idempotencyKey)` unique constraint equivalent, and
 * `list` orders by `occurredAt` (desc) with a UUIDv7 `auditEntryId` tie-breaker.
 */
export class InMemoryAuditEntryStore implements AuditEntryStore {
  private readonly entries: AuditEntry[] = [];

  async insertIfAbsent(entry: AuditEntry): Promise<{ inserted: boolean }> {
    const duplicate = this.entries.some(
      (existing) =>
        existing.auditEntryId === entry.auditEntryId ||
        (existing.producer === entry.producer && existing.idempotencyKey === entry.idempotencyKey),
    );
    if (duplicate) {
      return { inserted: false };
    }
    this.entries.push(entry);
    return { inserted: true };
  }

  async findByIdempotency(producer: string, idempotencyKey: string): Promise<AuditEntry | null> {
    return (
      this.entries.find(
        (entry) => entry.producer === producer && entry.idempotencyKey === idempotencyKey,
      ) ?? null
    );
  }

  async findById(auditEntryId: string): Promise<AuditEntry | null> {
    return this.entries.find((entry) => entry.auditEntryId === auditEntryId) ?? null;
  }

  async findLastEntry(): Promise<AuditEntry | null> {
    return this.sortedDesc()[0] ?? null;
  }

  async list(query: ListAuditEntriesQuery): Promise<ListAuditEntriesPage> {
    const filtered = this.entries.filter(
      (entry) =>
        (query.subjectType === undefined || entry.subjectType === query.subjectType) &&
        (query.subjectId === undefined || entry.subjectId === query.subjectId) &&
        (query.actionClass === undefined || entry.actionClass === query.actionClass) &&
        (query.actorId === undefined || entry.actorId === query.actorId) &&
        (query.actorType === undefined || entry.actorType === query.actorType) &&
        (query.producer === undefined || entry.producer === query.producer) &&
        (query.correlationId === undefined || entry.correlationId === query.correlationId),
    );

    const ordered = filtered.sort(compareDesc).filter((entry) => {
      if (query.after === null) {
        return true;
      }
      return (
        entry.occurredAt < query.after.occurredAt ||
        (entry.occurredAt === query.after.occurredAt &&
          entry.auditEntryId < query.after.auditEntryId)
      );
    });

    return { rows: ordered.slice(0, query.limit), count: filtered.length };
  }

  private sortedDesc(): AuditEntry[] {
    return [...this.entries].sort(compareDesc);
  }
}

function compareDesc(a: AuditEntry, b: AuditEntry): number {
  if (a.occurredAt !== b.occurredAt) {
    return a.occurredAt < b.occurredAt ? 1 : -1;
  }
  if (a.auditEntryId !== b.auditEntryId) {
    return a.auditEntryId < b.auditEntryId ? 1 : -1;
  }
  return 0;
}
