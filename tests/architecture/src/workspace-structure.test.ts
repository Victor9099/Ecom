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

  it('keeps the Prisma schema free of business tables (datasource + generator only)', () => {
    const schema = readFileSync(
      path.join(repoRoot, 'platform', 'database', 'prisma', 'schema.prisma'),
      'utf8',
    );
    const modelBlocks = schema.split('\n').filter((line) => /^\s*model\s+\S+\s*{/.test(line));
    expect(modelBlocks).toHaveLength(0);
    expect(schema).toMatch(/datasource\s+db\s*{/);
    expect(schema).toMatch(/generator\s+client\s*{/);
  });
});
