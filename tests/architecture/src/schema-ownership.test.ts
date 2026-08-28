// AC2 enforcement ceiling (residual risk — honest statement, OCR-005).
//
// The cross-module query/mutation boundary is enforced TODAY at:
//   1. the import boundary (dependency-cruiser rule
//      `no-prisma-client-outside-owner-adapters` + eslint
//      `no-restricted-imports`), and
//   2. the schema-prefix / ownership level (exactly one owner prefix per
//      schema object; no cross-owner @relation/FK navigation).
//
// Story 1.5 adds the first business table (governance_AuditEntry): this file
// now advances from the Story 1.2 "zero models" state to the sanctioned
// `governance_*` model + enum set, still enforcing the same AD-2 / AD-25 rules
// for real (never skipping).

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  MODULE_OWNERS,
  analyzeSchemaOwnership,
  detectCrossOwnerNavigations,
  parsePrismaBlocks,
  resolveOwner,
} from './lib/prisma-schema';

const repoRoot = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..', '..');

const PRISMA_DIR = path.join(repoRoot, 'platform', 'database', 'prisma');

/**
 * Reads every `.prisma` file under platform/database/prisma, including the
 * Story 1.5 multi-file layout (platform/database/prisma/schema/*.prisma) that
 * AD-25 / the Prisma 7 folder-discovery mode enable.
 */
function readPrismaSources(): { fileName: string; source: string }[] {
  const collect = (dir: string): string[] => {
    if (!existsSync(dir)) {
      return [];
    }
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return collect(full);
      }
      return entry.name.endsWith('.prisma') ? [full] : [];
    });
  };
  return collect(PRISMA_DIR)
    .map((fileName) => ({ fileName, source: readFileSync(fileName, 'utf8') }))
    .sort((a, b) => a.fileName.localeCompare(b.fileName));
}

describe('Story 1.5 schema ownership (AD-2 / AD-25)', () => {
  it('declares exactly the sanctioned governance_* model and enum set (real assertion)', () => {
    const sources = readPrismaSources();
    expect(sources.length).toBeGreaterThan(0);

    const blocks = sources.flatMap(({ source }) => parsePrismaBlocks(source));
    const modelNames = blocks.filter((b) => b.kind === 'model').map((b) => b.name);
    const enumNames = blocks.filter((b) => b.kind === 'enum').map((b) => b.name);
    const typeNames = blocks.filter((b) => b.kind === 'type').map((b) => b.name);
    const viewNames = blocks.filter((b) => b.kind === 'view').map((b) => b.name);

    expect(modelNames).toEqual(['governance_AuditEntry']);
    expect([...enumNames].sort()).toEqual([
      'governance_ActorType',
      'governance_AuditActionClass',
      'governance_AuditOutcome',
    ]);
    expect(typeNames).toEqual([]);
    expect(viewNames).toEqual([]);

    // The platform-owned anchor still carries exactly ONE generator + datasource.
    const combined = sources.map((s) => s.source).join('\n');
    expect(combined.split('datasource db {').length - 1).toBe(1);
    expect(combined.split('generator client {').length - 1).toBe(1);
  });

  it('keeps the AuditEntry model append-only scalar-shaped (no @relation navigation)', () => {
    const sources = readPrismaSources();
    const governance = sources.find(({ fileName }) => fileName.endsWith('governance.prisma'));
    expect(governance).toBeDefined();
    const model = parsePrismaBlocks(governance!.source).find(
      (b) => b.name === 'governance_AuditEntry',
    );
    expect(model).toBeDefined();
    // Append-only: no @relation / FK navigation on the audit entry (AD-2).
    expect(model!.body).not.toMatch(/@relation/);
    // The idempotency unique constraint is present (AD-25).
    expect(model!.body.includes('@@unique([producer, idempotencyKey])')).toBe(true);
  });

  it('enforces exactly one owner-prefixed module per schema object (AD-2)', () => {
    const sources = readPrismaSources();
    for (const { fileName, source } of sources) {
      const { unownedObjects, ambiguousObjects } = analyzeSchemaOwnership(source, MODULE_OWNERS);
      expect(unownedObjects, `${fileName}: objects without an owner prefix`).toEqual([]);
      expect(ambiguousObjects, `${fileName}: objects with ambiguous ownership`).toEqual([]);
    }
  });

  it('forbids cross-owner @relation / foreign-key navigation (AD-2)', () => {
    const sources = readPrismaSources();
    for (const { fileName, source } of sources) {
      const violations = detectCrossOwnerNavigations(parsePrismaBlocks(source), MODULE_OWNERS);
      expect(violations, `${fileName}: cross-owner navigations`).toEqual([]);
    }
  });
});

describe('schema ownership helpers — executable negative/positive units', () => {
  it('resolves a single owner from a well-formed owner prefix', () => {
    expect(resolveOwner('cart_CartItem', MODULE_OWNERS)).toMatchObject({
      owner: 'cart',
      ambiguous: false,
      matches: ['cart'],
    });
  });

  it('rejects an object with no owner prefix', () => {
    expect(resolveOwner('CartItem', MODULE_OWNERS)).toMatchObject({ owner: null });
  });

  it('rejects ambiguous ownership when two owner prefixes match', () => {
    // Synthetic overlapping owners prove the ambiguity guard is executable;
    // the real 17-module list contains no prefix-of-another (asserted below).
    const overlapping = ['cart', 'cart_admin'];
    expect(resolveOwner('cart_admin_Note', overlapping)).toMatchObject({
      owner: null,
      ambiguous: true,
      matches: ['cart', 'cart_admin'],
    });
  });

  it('the real 17 owners contain no prefix-of-another (no latent ambiguity)', () => {
    for (const a of MODULE_OWNERS) {
      for (const b of MODULE_OWNERS) {
        if (a !== b) {
          expect(a.startsWith(b), `owner "${a}" starts with "${b}"`).toBe(false);
        }
      }
    }
  });

  it('flags a cross-owner navigation and allows same-owner/self navigation', () => {
    const schema = `
model cart_CartItem {
  id      String       @id
  cartId  String
  cart    cart_Cart    @relation(fields: [cartId], references: [id])
  orderId String
  order   orders_Order? @relation(fields: [orderId], references: [id])
}
model cart_Cart {
  id     String         @id
  items  cart_CartItem[]
}
model orders_Order {
  id String @id
}
`;
    const blocks = parsePrismaBlocks(schema);
    const violations = detectCrossOwnerNavigations(blocks, MODULE_OWNERS);

    expect(violations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          model: 'cart_CartItem',
          modelOwner: 'cart',
          referencedModel: 'orders_Order',
          referencedOwner: 'orders',
        }),
      ]),
    );
    // Only the cart->orders field is cross-owner; cart_CartItem.cart and
    // cart_Cart.items are same-owner and must stay allowed.
    expect(violations.length).toBe(1);
  });

  it('parses enum/type/model/view blocks but not generator/datasource blocks', () => {
    const schema = `
generator client { provider = "prisma-client" }
datasource db { provider = "postgresql" }
enum cart_Status { ACTIVE INACTIVE }
type finance_Money { amount Int currency String }
view reporting_OrdersByDay { id String }
model orders_Order { id String @id }
`;
    const blocks = parsePrismaBlocks(schema);
    expect(blocks.map((b) => `${b.kind}:${b.name}`)).toEqual([
      'enum:cart_Status',
      'type:finance_Money',
      'view:reporting_OrdersByDay',
      'model:orders_Order',
    ]);
  });
});
