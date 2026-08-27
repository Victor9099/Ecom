// AC1 regression harness (Story 1.2 correction, OCR-001/OCR-002).
//
// Runs dependency-cruiser's real `cruise()` programmatic API over synthetic
// source files in a throwaway temp directory, so every forbidden rule in
// .dependency-cruiser.cjs is exercised deterministically — including the
// @ecom/module-* / @ecom/<app> / @ecom/platform-database PACKAGE-NAME import
// forms that previously failed open (the resolved value for an unresolvable
// @ecom package is the bare specifier, which `to.path` must match).
//
// The synthetic sources are written below tests/ (nothing under modules/,
// apps/, platform/ or packages/ is touched — the temp dir only mirrors those
// paths under a baseDir that dependency-cruiser treats as the repo root).

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import { cruise, type IConfiguration } from 'dependency-cruiser';

const require = createRequire(import.meta.url);
const config = require('../../../.dependency-cruiser.cjs') as IConfiguration;

interface RuleViolation {
  type: string;
  from: string;
  to: string;
  rule: { name: string };
}

interface CruiseResultJson {
  summary: { violations: RuleViolation[] };
  modules: Array<{
    source: string;
    dependencies: Array<{ module: string; valid: boolean; rules?: { name: string }[] }>;
  }>;
}

function writeTree(base: string, files: Record<string, string>): void {
  for (const [rel, content] of Object.entries(files)) {
    const full = path.join(base, ...rel.split('/'));
    mkdirSync(path.dirname(full), { recursive: true });
    writeFileSync(full, content);
  }
}

async function cruiseSynthetic(files: Record<string, string>): Promise<CruiseResultJson> {
  const base = mkdtempSync(path.join(tmpdir(), 'ecom-dcruise-'));
  try {
    writeTree(base, files);
    const report = await cruise(['modules', 'apps'], {
      ruleSet: { forbidden: config.forbidden },
      validate: true,
      outputType: 'json',
      baseDir: base,
      tsPreCompilationDeps: true,
      doNotFollow: config.options?.doNotFollow,
      exclude: config.options?.exclude,
      enhancedResolveOptions: config.options?.enhancedResolveOptions,
    });
    if (typeof report.output !== 'string') {
      throw new Error('expected the json reporter to return a string');
    }
    return JSON.parse(report.output) as CruiseResultJson;
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
}

/** The synthetic tree every assertion in this suite is derived from. */
function syntheticTree(): Record<string, string> {
  return {
    'modules/cart/src/domain/cart.ts': "import '../application/use-case';\n",
    'modules/cart/src/adapters/prisma.ts':
      "import '@prisma/client';\nimport '@ecom/platform-database';\n",
    'modules/cart/src/application/use-case.ts':
      "import '../domain/cart';\n" +
      "import '../adapters/prisma';\n" +
      "import '@ecom/module-orders';\n" +
      "import '@ecom/module-orders/src/domain/order';\n" +
      "import '@ecom/module-orders/src/contracts/order-events';\n" +
      "import '@prisma/client';\n" +
      "import '@ecom/platform-database';\n" +
      "import '@ecom/api';\n",
    'apps/api/src/main.ts':
      "import '@ecom/module-orders/src/domain/order';\n" +
      "import '@ecom/module-orders/src/contracts/order-events';\n" +
      "import '@ecom/module-cart';\n",
  };
}

describe('AC1 dependency-cruiser forbidden rules — regression (OCR-001/OCR-002)', () => {
  it('rejects every forbidden edge and permits every allowed edge (package + relative forms)', async () => {
    const result = await cruiseSynthetic(syntheticTree());

    const actual = new Map<string, string[]>();
    for (const violation of result.summary.violations) {
      const key = `${violation.from} -> ${violation.to}`;
      const rules = actual.get(key) ?? [];
      rules.push(violation.rule.name);
      actual.set(key, rules);
    }

    // Exact expected violation set: only these 9 package-name / relative edges
    // may violate, and each violates exactly one rule.
    const expected = new Map<string, string[]>([
      ['apps/api/src/main.ts -> @ecom/module-cart', ['apps-reach-modules-via-contracts']],
      [
        'apps/api/src/main.ts -> @ecom/module-orders/src/domain/order',
        ['apps-reach-modules-via-contracts'],
      ],
      [
        'modules/cart/src/application/use-case.ts -> modules/cart/src/adapters/prisma.ts',
        ['no-application-imports-adapters'],
      ],
      [
        'modules/cart/src/application/use-case.ts -> @ecom/module-orders',
        ['no-cross-module-internals'],
      ],
      [
        'modules/cart/src/application/use-case.ts -> @ecom/module-orders/src/domain/order',
        ['no-cross-module-internals'],
      ],
      ['modules/cart/src/application/use-case.ts -> @ecom/api', ['no-module-imports-apps']],
      [
        'modules/cart/src/application/use-case.ts -> @ecom/platform-database',
        ['no-prisma-client-outside-owner-adapters'],
      ],
      [
        'modules/cart/src/application/use-case.ts -> @prisma/client',
        ['no-prisma-client-outside-owner-adapters'],
      ],
      [
        'modules/cart/src/domain/cart.ts -> modules/cart/src/application/use-case.ts',
        ['no-domain-imports-application-or-adapters'],
      ],
    ]);

    expect(Object.fromEntries([...actual].sort())).toEqual(
      Object.fromEntries([...expected].sort()),
    );

    // Allowed edges must be present as valid (unviolated) dependencies — this
    // proves they were actually analysed rather than silently dropped.
    const allowedEdges = [
      'apps/api/src/main.ts -> @ecom/module-orders/src/contracts/order-events',
      'modules/cart/src/adapters/prisma.ts -> @ecom/platform-database',
      'modules/cart/src/adapters/prisma.ts -> @prisma/client',
      'modules/cart/src/application/use-case.ts -> ../domain/cart',
      'modules/cart/src/application/use-case.ts -> @ecom/module-orders/src/contracts/order-events',
    ];
    const present = new Set<string>();
    for (const mod of result.modules) {
      for (const dep of mod.dependencies) {
        const key = `${mod.source} -> ${dep.module}`;
        if (allowedEdges.includes(key)) {
          present.add(key);
          expect(dep.valid, `${key} must be valid (allowed)`).toBe(true);
          expect(dep.rules ?? []).toEqual([]);
        }
      }
    }
    expect([...present].sort()).toEqual([...allowedEdges].sort());
  });

  it('covers all six forbidden rules in .dependency-cruiser.cjs', async () => {
    const result = await cruiseSynthetic(syntheticTree());
    const exercised = new Set(result.summary.violations.map((violation) => violation.rule.name));

    const declared = new Set((config.forbidden ?? []).map((rule) => rule.name));

    // The synthetic tree must exercise every declared rule — a rule that never
    // fires is the exact silent "cannot fail" gap OCR-001/OCR-002 rejected.
    expect([...exercised].sort()).toEqual([...declared].sort());
  });
});
