// Pure, in-memory Prisma schema ownership checks (AD-2 / AD-25).
//
// These helpers parse Prisma schema text and enforce the "exactly one
// owner-prefixed module per object" rule plus the "no cross-owner @relation /
// foreign-key navigation" rule. They have no filesystem dependencies so the
// ownership logic can be negative-tested against synthetic schema text without
// committing any business tables or model blocks.

export const MODULE_OWNERS = [
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

export type ModuleOwner = (typeof MODULE_OWNERS)[number];

export type PrismaBlockKind = 'model' | 'view' | 'enum' | 'type';

export interface PrismaBlock {
  kind: PrismaBlockKind;
  name: string;
  body: string;
  line: number;
}

export interface OwnerResolution {
  /** The single resolved owner, or null when there is zero or many matches. */
  owner: string | null;
  /** Every owner whose `<owner>_` prefix matched the name. */
  matches: string[];
  /** True when more than one owner prefix matched (ambiguous ownership). */
  ambiguous: boolean;
}

export interface CrossOwnerNavigation {
  model: string;
  modelOwner: string | null;
  fieldName: string;
  referencedModel: string;
  referencedOwner: string | null;
  line: number;
}

const BLOCK_RE = /^\s*(model|view|enum|type)\s+(\S+)\s*\{([\s\S]*?)\}/gm;

/**
 * Extracts `model` / `view` / `enum` / `type` blocks from Prisma schema text.
 * The current baseline carries only a `generator` and a `datasource` block, so
 * this returns `[]` today — a real assertion that documents AC5 rather than a
 * skip.
 */
export function parsePrismaBlocks(source: string): PrismaBlock[] {
  const blocks: PrismaBlock[] = [];
  let match: RegExpExecArray | null;
  BLOCK_RE.lastIndex = 0;
  while ((match = BLOCK_RE.exec(source)) !== null) {
    const kind = match[1];
    const name = match[2];
    const body = match[3];
    if (!kind || !name || body === undefined) {
      continue;
    }
    blocks.push({
      kind: kind as PrismaBlockKind,
      name,
      body,
      line: source.slice(0, match.index).split('\n').length,
    });
  }
  return blocks;
}

/**
 * Resolves the single owning module for a schema object name via the AD-2
 * owner prefix (`^<owner>_`). Returns `ambiguous: true` when more than one
 * owner prefix matches and `owner: null` when zero match.
 */
export function resolveOwner(
  name: string,
  owners: readonly string[] = MODULE_OWNERS,
): OwnerResolution {
  const matches = owners.filter((owner) => new RegExp(`^${owner}_`).test(name));
  return {
    owner: matches.length === 1 ? (matches[0] ?? null) : null,
    matches,
    ambiguous: matches.length > 1,
  };
}

/**
 * Strips a Prisma field type of its `[]` and `?` modifiers so it can be
 * compared against the set of declared model names.
 */
export function normalizeFieldType(rawType: string): string {
  return rawType.replace(/[?[\]]/g, '');
}

/**
 * Detects cross-owner navigation: a model/view field whose type references a
 * model owned by a different module. AD-2 forbids this — cross-boundary
 * references must be plain UUIDv7 scalars without ORM navigation.
 */
export function detectCrossOwnerNavigations(
  blocks: PrismaBlock[],
  owners: readonly string[] = MODULE_OWNERS,
): CrossOwnerNavigation[] {
  const violations: CrossOwnerNavigation[] = [];

  const modelNames = new Set(
    blocks.filter((b) => b.kind === 'model' || b.kind === 'view').map((b) => b.name),
  );

  for (const block of blocks) {
    if (block.kind !== 'model' && block.kind !== 'view') {
      continue;
    }
    const modelOwner = resolveOwner(block.name, owners).owner;
    const baseLine = block.line;
    const lines = block.body.split('\n');

    lines.forEach((rawLine, index) => {
      const line = rawLine.trim();
      if (line.length === 0 || line.startsWith('//') || line.startsWith('@@')) {
        return;
      }
      const tokens = line.split(/\s+/);
      const fieldName = tokens[0];
      const rawType = tokens[1];
      if (!fieldName || !rawType) {
        return;
      }
      const fieldType = normalizeFieldType(rawType);
      if (!modelNames.has(fieldType)) {
        return;
      }
      const referencedOwner = resolveOwner(fieldType, owners).owner;
      if (referencedOwner === null || referencedOwner === modelOwner) {
        // Self/same-owner navigation is allowed (AD-2 keeps FKs inside the
        // owner boundary); unknown owners are flagged by ownership checks.
        return;
      }
      violations.push({
        model: block.name,
        modelOwner,
        fieldName,
        referencedModel: fieldType,
        referencedOwner,
        line: baseLine + index,
      });
    });
  }

  return violations;
}

/**
 * Convenience wrapper returning every ownership + navigation violation for a
 * schema body, used by the real schema assertion and the negative unit tests.
 */
export function analyzeSchemaOwnership(
  source: string,
  owners: readonly string[] = MODULE_OWNERS,
): {
  blocks: PrismaBlock[];
  models: PrismaBlock[];
  unownedObjects: string[];
  ambiguousObjects: string[];
  crossOwnerNavigations: CrossOwnerNavigation[];
} {
  const blocks = parsePrismaBlocks(source);
  const models = blocks.filter((b) => b.kind === 'model');
  const unownedObjects: string[] = [];
  const ambiguousObjects: string[] = [];

  for (const block of blocks) {
    const resolution = resolveOwner(block.name, owners);
    if (resolution.ambiguous) {
      ambiguousObjects.push(block.name);
    } else if (resolution.owner === null) {
      unownedObjects.push(block.name);
    }
  }

  return {
    blocks,
    models,
    unownedObjects,
    ambiguousObjects,
    crossOwnerNavigations: detectCrossOwnerNavigations(blocks, owners),
  };
}
