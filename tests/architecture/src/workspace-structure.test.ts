import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const repoRoot = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..', '..');

const REQUIRED_MODULES = [
  'identity',
  'merchant',
  'content',
  'catalog',
  'inventory',
  'pricing',
  'discovery',
  'cart',
  'checkout',
  'orders',
  'payments',
  'finance',
  'fulfillment',
  'returns',
  'engagement',
  'governance',
  'reporting',
] as const;

describe('Story 1.1 workspace structure', () => {
  it('declares the four applications', () => {
    for (const app of ['storefront', 'admin', 'api', 'worker']) {
      expect(existsSync(path.join(repoRoot, 'apps', app, 'package.json')), `apps/${app}`).toBe(
        true,
      );
    }
  });

  it('declares exactly the 17 bounded contexts', () => {
    const entries = readdirSync(path.join(repoRoot, 'modules')).filter((d) => !d.startsWith('.'));
    expect(entries).toHaveLength(17);
    for (const moduleName of REQUIRED_MODULES) {
      expect(entries, `modules/${moduleName}`).toContain(moduleName);
    }
  });

  it('splits Prisma schema per module (anchor + governance) with ONE forward-only migration', () => {
    const anchor = readFileSync(
      path.join(repoRoot, 'platform', 'database', 'prisma', 'schema', 'schema.prisma'),
      'utf8',
    );
    // The platform-owned anchor carries generator + datasource only (no model).
    expect(anchor.includes('generator client {')).toBe(true);
    expect(anchor.includes('datasource db {')).toBe(true);
    expect(anchor.split('model ').length - 1).toBe(0);

    const governance = readFileSync(
      path.join(repoRoot, 'platform', 'database', 'prisma', 'schema', 'governance.prisma'),
      'utf8',
    );
    // Governance owns the append-only audit model + the three additive-only enums.
    expect(governance.includes('model governance_AuditEntry {')).toBe(true);
    expect(governance.includes('enum governance_AuditActionClass {')).toBe(true);
    expect(governance.includes('enum governance_AuditOutcome {')).toBe(true);
    expect(governance.includes('enum governance_ActorType {')).toBe(true);

    // EXACTLY one new forward-only migration (CREATE TABLE, no destructive DDL).
    const migrationsDir = path.join(repoRoot, 'platform', 'database', 'prisma', 'migrations');
    const migrationDirs = readdirSync(migrationsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
    expect(migrationDirs).toEqual([
      '20260827000000_baseline',
      '20260827000001_governance_audit_history',
    ]);

    const migrationSql = readFileSync(
      path.join(migrationsDir, '20260827000001_governance_audit_history', 'migration.sql'),
      'utf8',
    );
    expect(migrationSql.includes('CREATE TABLE "governance_AuditEntry"')).toBe(true);
    expect(
      migrationSql.includes(
        'CREATE UNIQUE INDEX "governance_AuditEntry_producer_idempotencyKey_key"',
      ),
    ).toBe(true);
    expect(migrationSql).not.toMatch(/(DROP|ALTER|DELETE|UPDATE)/);
  });
});
