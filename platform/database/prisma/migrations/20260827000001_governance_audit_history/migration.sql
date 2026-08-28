-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "governance_AuditActionClass" AS ENUM ('governance_content_publication', 'governance_content_withdrawal', 'governance_sku_classification', 'governance_reconciliation', 'governance_refund_execution', 'governance_regulatory_hold', 'governance_permission_change', 'governance_audit_access');

-- CreateEnum
CREATE TYPE "governance_AuditOutcome" AS ENUM ('success', 'failure', 'denied');

-- CreateEnum
CREATE TYPE "governance_ActorType" AS ENUM ('human', 'service', 'system');

-- CreateTable
CREATE TABLE "governance_AuditEntry" (
    "auditEntryId" UUID NOT NULL,
    "prevEntryHash" TEXT NOT NULL,
    "entryHash" TEXT NOT NULL,
    "actorType" "governance_ActorType" NOT NULL,
    "actorId" TEXT NOT NULL,
    "occurredAt" TEXT NOT NULL,
    "subjectType" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "actionClass" "governance_AuditActionClass" NOT NULL,
    "action" TEXT NOT NULL,
    "reasonCode" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "outcome" "governance_AuditOutcome" NOT NULL,
    "correlationId" TEXT NOT NULL,
    "causationId" TEXT NOT NULL,
    "producer" TEXT NOT NULL,
    "commandId" TEXT,
    "eventId" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "idempotencyHash" TEXT NOT NULL,
    "schemaVersion" TEXT NOT NULL,
    "detail" JSONB,

    CONSTRAINT "governance_AuditEntry_pkey" PRIMARY KEY ("auditEntryId")
);

-- CreateIndex
CREATE INDEX "governance_AuditEntry_occurredAt_auditEntryId_idx" ON "governance_AuditEntry"("occurredAt", "auditEntryId");

-- CreateIndex
CREATE INDEX "governance_AuditEntry_subjectType_subjectId_idx" ON "governance_AuditEntry"("subjectType", "subjectId");

-- CreateIndex
CREATE INDEX "governance_AuditEntry_correlationId_idx" ON "governance_AuditEntry"("correlationId");

-- CreateIndex
CREATE INDEX "governance_AuditEntry_actorType_actorId_idx" ON "governance_AuditEntry"("actorType", "actorId");

-- CreateIndex
CREATE INDEX "governance_AuditEntry_actionClass_occurredAt_idx" ON "governance_AuditEntry"("actionClass", "occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "governance_AuditEntry_producer_idempotencyKey_key" ON "governance_AuditEntry"("producer", "idempotencyKey");
