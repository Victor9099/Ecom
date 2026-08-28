// @ecom/module-governance — Governance bounded context (AD-1 single owner).
//
// Story 1.5 publishes the append-only audit-intake contract
// (RecordAuditEntry command, governance-audit-entry-recorded event,
// AuditIntakePort), the append-only AuditEntry aggregate, the RecordAuditEntry
// command handler, the ListAuditEntries query, and a create+read-only Prisma
// adapter. Only the `contracts/**` surface is consumable by other modules.
export * from './contracts';
export * from './domain';
export * from './application';
export * from './adapters';
