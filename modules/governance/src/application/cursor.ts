/**
 * Opaque cursor for `ListAuditEntries` pagination (AD-10 / Consistency
 * Conventions: opaque cursor, stable ordering with a UUIDv7 tie-breaker).
 *
 * The cursor is a base64url-encoded JSON tuple `{ occurredAt, auditEntryId }`.
 * Callers MUST treat it as opaque; the store uses it only to resume sorting
 * after (older-than) the last row of the previous page.
 */

export interface CursorPayload {
  occurredAt: string;
  auditEntryId: string;
}

export function encodeCursor(payload: CursorPayload): string {
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}

export function decodeCursor(cursor: string): CursorPayload | null {
  try {
    const parsed = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8')) as unknown;
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof (parsed as CursorPayload).occurredAt === 'string' &&
      typeof (parsed as CursorPayload).auditEntryId === 'string'
    ) {
      return parsed as CursorPayload;
    }
    return null;
  } catch {
    return null;
  }
}
