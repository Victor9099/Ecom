import { Prisma, type PrismaClient } from '../../../../platform/database/generated/prisma/client';
import type { AuditEntry, ActorType, AuditActionClass, AuditOutcome } from '../domain/audit-entry';
import type {
  AuditEntryStore,
  ListAuditEntriesPage,
  ListAuditEntriesQuery,
} from '../application/audit-entry-store';

/**
 * Prisma adapter for the append-only audit store (AD-2 / AD-11 / AD-25).
 *
 * CREATE + READ ONLY: this class implements `AuditEntryStore`, whose port has no
 * update/delete method, and it maps only to `INSERT ... ON CONFLICT DO NOTHING`
 * and `SELECT` statements. There is no update/delete SQL anywhere in Governance.
 *
 * Idempotency is enforced by the database: the unique index
 * `governance_AuditEntry_producer_idempotencyKey_key` plus
 * `INSERT ... ON CONFLICT ("producer", "idempotencyKey") DO NOTHING` — a
 * conflicting insert affects zero rows and the handler replays the existing row
 * (same hash) or reports a stable conflict (different hash).
 */

type AuditablePrismaClient = Pick<PrismaClient, 'governance_AuditEntry' | '$executeRaw'>;

interface GovernanceAuditEntryRow {
  auditEntryId: string;
  prevEntryHash: string;
  entryHash: string;
  actorType: ActorType;
  actorId: string;
  occurredAt: string;
  subjectType: string;
  subjectId: string;
  actionClass: AuditActionClass;
  action: string;
  reasonCode: string;
  reason: string;
  outcome: AuditOutcome;
  correlationId: string;
  causationId: string;
  producer: string;
  commandId: string | null;
  eventId: string | null;
  idempotencyKey: string;
  idempotencyHash: string;
  schemaVersion: string;
  detail: unknown;
}

function mapRow(row: GovernanceAuditEntryRow): AuditEntry {
  return {
    auditEntryId: row.auditEntryId,
    prevEntryHash: row.prevEntryHash,
    entryHash: row.entryHash,
    actorType: row.actorType,
    actorId: row.actorId,
    occurredAt: row.occurredAt,
    subjectType: row.subjectType,
    subjectId: row.subjectId,
    actionClass: row.actionClass,
    action: row.action,
    reasonCode: row.reasonCode,
    reason: row.reason,
    outcome: row.outcome,
    correlationId: row.correlationId,
    causationId: row.causationId,
    producer: row.producer,
    commandId: row.commandId,
    eventId: row.eventId,
    idempotencyKey: row.idempotencyKey,
    idempotencyHash: row.idempotencyHash,
    schemaVersion: row.schemaVersion,
    detail: row.detail ?? null,
  };
}

export class PrismaAuditEntryStore implements AuditEntryStore {
  constructor(private readonly client: AuditablePrismaClient) {}

  async insertIfAbsent(entry: AuditEntry): Promise<{ inserted: boolean }> {
    const affected = await this.client.$executeRaw(Prisma.sql`
      INSERT INTO "governance_AuditEntry" (
        "auditEntryId", "prevEntryHash", "entryHash", "actorType", "actorId",
        "occurredAt", "subjectType", "subjectId", "actionClass", "action",
        "reasonCode", "reason", "outcome", "correlationId", "causationId",
        "producer", "commandId", "eventId", "idempotencyKey", "idempotencyHash",
        "schemaVersion", "detail"
      ) VALUES (
        ${entry.auditEntryId}::uuid,
        ${entry.prevEntryHash},
        ${entry.entryHash},
        ${entry.actorType}::"governance_ActorType",
        ${entry.actorId},
        ${entry.occurredAt},
        ${entry.subjectType},
        ${entry.subjectId},
        ${entry.actionClass}::"governance_AuditActionClass",
        ${entry.action},
        ${entry.reasonCode},
        ${entry.reason},
        ${entry.outcome}::"governance_AuditOutcome",
        ${entry.correlationId},
        ${entry.causationId},
        ${entry.producer},
        ${entry.commandId},
        ${entry.eventId},
        ${entry.idempotencyKey},
        ${entry.idempotencyHash},
        ${entry.schemaVersion},
        ${JSON.stringify(entry.detail ?? null)}::jsonb
      )
      ON CONFLICT ("producer", "idempotencyKey") DO NOTHING
    `);
    return { inserted: affected === 1 };
  }

  async findByIdempotency(producer: string, idempotencyKey: string): Promise<AuditEntry | null> {
    const row = await this.client.governance_AuditEntry.findFirst({
      where: { producer, idempotencyKey },
    });
    return row ? mapRow(row) : null;
  }

  async findById(auditEntryId: string): Promise<AuditEntry | null> {
    const row = await this.client.governance_AuditEntry.findUnique({
      where: { auditEntryId },
    });
    return row ? mapRow(row) : null;
  }

  async findLastEntry(): Promise<AuditEntry | null> {
    const row = await this.client.governance_AuditEntry.findFirst({
      orderBy: [{ occurredAt: 'desc' }, { auditEntryId: 'desc' }],
    });
    return row ? mapRow(row) : null;
  }

  async list(query: ListAuditEntriesQuery): Promise<ListAuditEntriesPage> {
    const conditions: Prisma.governance_AuditEntryWhereInput[] = [];
    if (query.subjectType !== undefined) conditions.push({ subjectType: query.subjectType });
    if (query.subjectId !== undefined) conditions.push({ subjectId: query.subjectId });
    if (query.actionClass !== undefined) conditions.push({ actionClass: query.actionClass });
    if (query.actorId !== undefined) conditions.push({ actorId: query.actorId });
    if (query.actorType !== undefined) conditions.push({ actorType: query.actorType });
    if (query.producer !== undefined) conditions.push({ producer: query.producer });
    if (query.correlationId !== undefined) conditions.push({ correlationId: query.correlationId });
    if (query.after !== null) {
      conditions.push({
        OR: [
          { occurredAt: { lt: query.after.occurredAt } },
          {
            occurredAt: query.after.occurredAt,
            auditEntryId: { lt: query.after.auditEntryId },
          },
        ],
      });
    }

    const where: Prisma.governance_AuditEntryWhereInput =
      conditions.length > 0 ? { AND: conditions } : {};

    const [rows, count] = await Promise.all([
      this.client.governance_AuditEntry.findMany({
        where,
        orderBy: [{ occurredAt: 'desc' }, { auditEntryId: 'desc' }],
        take: query.limit,
      }),
      this.client.governance_AuditEntry.count({ where }),
    ]);

    return { rows: rows.map(mapRow), count };
  }
}
