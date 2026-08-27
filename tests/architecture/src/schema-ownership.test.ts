// AC2 enforcement ceiling (residual risk — honest statement, OCR-005).
//
// The cross-module query/mutation boundary is enforced TODAY only at:
//   1. the import boundary (dependency-cruiser rule
//      `no-prisma-client-outside-owner-adapters` + eslint
//      `no-restricted-imports`), and
//   2. the schema-prefix / ownership level (exactly one owner prefix per
//      schema object; no cross-owner @relation/FK navigation).
//
// There is NO runtime table-level isolation yet, because no business tables
// exist in this baseline (the Prisma schema carries only a generator and a
// datasource). This check MUST be strengthened — to full table/row-level
// ownership isolation — when the first models arrive. Until then this ceiling
// is deliberately documented, not silently claimed as complete.

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
 * Reads every `.prisma` file under platform/database/prisma, tolerating the
 * future multi-file layout (platform/database/prisma/schema/*.prisma) described
 * by AD-25 without creating it today.
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

describe('Story 1.2 schema ownership (AD-2 / AD-25)', () => {
  it('declares ZERO model blocks today (real AC5 assertion, not a skip)', () => {
    const sources = readPrismaSources();
    expect(sources.length).toBeGreaterThan(0);

    const allModels = sources
      .flatMap(({ source }) => parsePrismaBlocks(source))
      .filter((b) => b.kind === 'model');
    expect(allModels.map((m) => m.name)).toEqual([]);

    // The baseline still carries the datasource + generator only.
    const combined = sources.map((s) => s.source).join('\n');
    expect(combined).toMatch(/datasource\s+db\s*{/);
    expect(combined).toMatch(/generator\s+client\s*{/);
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
