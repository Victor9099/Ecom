import type { AuditActionClass, ActorType, AuditEntry } from '../domain/audit-entry';
import { GENESIS_PREV_HASH } from '../domain/audit-entry';
import { decodeCursor, encodeCursor } from './cursor';
import type { AuditEntryStore } from './audit-entry-store';

export interface ListAuditEntriesRequest {
  limit?: number;
  cursor?: string;
  subjectType?: string;
  subjectId?: string;
  actionClass?: AuditActionClass;
  actorId?: string;
  actorType?: ActorType;
  producer?: string;
  correlationId?: string;
}

export interface ListAuditEntriesResult {
  rows: AuditEntry[];
  /** Running count of rows matching the filter (independent of pagination). */
  runningCount: number;
  /** Opaque cursor to fetch the next (older) page, or null when exhausted. */
  nextCursor: string | null;
  /** Terminal chain digest: the latest entryHash, or the genesis sentinel. */
  chainDigest: string;
}

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

/**
 * `ListAuditEntries` query (Story 1.5 AC3): stable opaque-cursor pagination
 * ordered by `occurredAt` (desc) with a UUIDv7 tie-breaker (`auditEntryId`
 * desc), returning rows + running count + terminal chain digest. Integrity
 * reconciliation then compares the row count against the producing module's
 * source event counts.
 */
export class ListAuditEntriesQueryHandler {
  constructor(private readonly store: AuditEntryStore) {}

  async handle(request: ListAuditEntriesRequest): Promise<ListAuditEntriesResult> {
    const limit = clampLimit(request.limit);
    const after = request.cursor ? decodeCursor(request.cursor) : null;

    const { rows, count } = await this.store.list({
      limit,
      after,
      subjectType: request.subjectType,
      subjectId: request.subjectId,
      actionClass: request.actionClass,
      actorId: request.actorId,
      actorType: request.actorType,
      producer: request.producer,
      correlationId: request.correlationId,
    });

    const nextCursor =
      rows.length === limit && rows.length > 0
        ? encodeCursor({
            occurredAt: rows[rows.length - 1]!.occurredAt,
            auditEntryId: rows[rows.length - 1]!.auditEntryId,
          })
        : null;

    const last = await this.store.findLastEntry();
    return {
      rows,
      runningCount: count,
      nextCursor,
      chainDigest: last?.entryHash ?? GENESIS_PREV_HASH,
    };
  }
}

function clampLimit(limit: number | undefined): number {
  if (limit === undefined) {
    return DEFAULT_LIMIT;
  }
  if (!Number.isInteger(limit)) {
    return DEFAULT_LIMIT;
  }
  return Math.min(Math.max(limit, 1), MAX_LIMIT);
}
