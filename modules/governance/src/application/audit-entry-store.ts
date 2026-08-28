import type { AuditActionClass, ActorType, AuditEntry } from '../domain/audit-entry';

/**
 * The append-only audit store port. Deliberately exposes CREATE + READ ONLY —
 * there is no update/delete method on this port (AD-11: audit evidence is never
 * rewritten). `insertIfAbsent` backs the AD-25 idempotency contract with
 * `INSERT ... ON CONFLICT DO NOTHING` semantics.
 */
export interface AuditEntryStore {
  /** Insert if `(producer, idempotencyKey)` is absent; `inserted` is false on conflict. */
  insertIfAbsent(entry: AuditEntry): Promise<{ inserted: boolean }>;
  findByIdempotency(producer: string, idempotencyKey: string): Promise<AuditEntry | null>;
  findById(auditEntryId: string): Promise<AuditEntry | null>;
  /** The terminal (latest by occurredAt + auditEntryId) entry, or null when empty. */
  findLastEntry(): Promise<AuditEntry | null>;
  list(query: ListAuditEntriesQuery): Promise<ListAuditEntriesPage>;
}

export interface ListAuditEntriesQuery {
  limit: number;
  /** Resume point for opaque-cursor pagination (null on the first page). */
  after: { occurredAt: string; auditEntryId: string } | null;
  subjectType?: string;
  subjectId?: string;
  actionClass?: AuditActionClass;
  actorId?: string;
  actorType?: ActorType;
  producer?: string;
  correlationId?: string;
}

export interface ListAuditEntriesPage {
  rows: AuditEntry[];
  /** Total number of rows matching the filter (independent of the limit). */
  count: number;
}
