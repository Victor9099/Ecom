// Contract registry + immutability / new-version gate helpers (AD-10 / AD-28).
//
// The manifest is a JSON registry of *released* contracts. It starts EMPTY in
// Story 1.2 (nothing has been released yet) — the registry shape, the sha256
// immutability check, and the v>1 bilateral-acceptance gate are all real and
// are exercised by in-memory negative unit tests so the harness is executable
// rather than vacuous.

import { createHash } from 'node:crypto';

export const CONTRACT_KINDS = ['command', 'event', 'api'] as const;
export type ContractKind = (typeof CONTRACT_KINDS)[number];

export interface ContractEntry {
  owner: string;
  contract: string;
  /** Versioned directory token, lowercase `v<N>` (e.g. "v1"). */
  version: string;
  kind: ContractKind;
  /** Every module Lead (owning context) that consumes this contract. */
  consumers: string[];
  /** Set true when this version is a breaking change vs. the previous one. */
  breaking?: boolean;
}

export interface ContractManifest {
  version: number;
  contracts: ContractEntry[];
}

function toRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export const VERSION_TOKEN_RE = /^v\d+$/;

/** The manifest itself must be an object with a numeric `version` and a `contracts` array. */
export function validateManifestShape(value: unknown): string[] {
  const record = toRecord(value);
  if (!record) {
    return ['contract manifest must be a JSON object'];
  }
  const errors: string[] = [];
  if (typeof record.version !== 'number') {
    errors.push('manifest.version must be a number');
  }
  if (!Array.isArray(record.contracts)) {
    errors.push('manifest.contracts must be an array');
  }
  return errors;
}

/** Each released contract entry must carry owner/version/kind/consumers. */
export function validateContractEntry(value: unknown): string[] {
  const record = toRecord(value);
  if (!record) {
    return ['contract entry must be an object'];
  }
  const errors: string[] = [];

  if (typeof record.owner !== 'string' || record.owner.trim().length === 0) {
    errors.push('contract.owner is required and must be a non-blank owner name');
  }
  if (typeof record.contract !== 'string' || record.contract.trim().length === 0) {
    errors.push('contract.contract is required and must be a non-blank contract name');
  }
  if (typeof record.version !== 'string' || !VERSION_TOKEN_RE.test(record.version)) {
    errors.push(`contract.version is required and must be v<N> (got "${String(record.version)}")`);
  }
  if (
    typeof record.kind !== 'string' ||
    !(CONTRACT_KINDS as readonly string[]).includes(record.kind)
  ) {
    errors.push(`contract.kind is required and must be one of ${CONTRACT_KINDS.join('|')}`);
  }
  if (!Array.isArray(record.consumers)) {
    errors.push('contract.consumers is required and must be an array of consumer owner names');
  } else if (
    record.consumers.some(
      (consumer) => typeof consumer !== 'string' || consumer.trim().length === 0,
    )
  ) {
    errors.push('contract.consumers must contain only non-blank consumer owner names');
  } else if (new Set(record.consumers).size !== record.consumers.length) {
    errors.push('contract.consumers must not contain duplicate consumer names');
  }

  return errors;
}

export function sha256Hex(input: string): string {
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

/**
 * Canonical sha256 digest of a released contract version: its schema.json plus
 * contract.json plus every fixture file, in a stable (name-sorted) order.
 */
export function computeContractDigest(
  parts: ReadonlyArray<{ name: string; content: string }>,
): string {
  // Stable, locale-independent byte-order sort (localeCompare varies by
  // environment/locale and must not leak into a committed sha256).
  const canonical = parts
    .slice()
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    .map((part) => `${part.name}\n${part.content}`)
    .join('\n---\n');
  return sha256Hex(canonical);
}

/** True when a version token is `v2` or higher (the new-version gate applies). */
export function isNewVersion(version: string): boolean {
  const numeric = Number.parseInt(version.replace(/^v/, ''), 10);
  return VERSION_TOKEN_RE.test(version) && Number.isInteger(numeric) && numeric > 1;
}

/**
 * AD-28 new-version gate: any v>1 release requires a recorded bilateral
 * acceptance that names the producer and every affected consumer, and carries a
 * supervisorException reference when the version is a breaking change.
 */
export function validateNewVersionGate(entry: ContractEntry, acceptance: unknown): string[] {
  if (!isNewVersion(entry.version)) {
    return [];
  }

  const record = toRecord(acceptance);
  const errors: string[] = [];

  if (!record) {
    return [
      `contract ${entry.owner}/${entry.contract}@${entry.version} is a new version and requires a bilateral acceptance record`,
    ];
  }
  if (record.producer !== entry.owner) {
    errors.push(`acceptance.producer must name the producer "${entry.owner}"`);
  }
  const acceptedConsumers = Array.isArray(record.consumers) ? record.consumers : [];
  for (const consumer of entry.consumers) {
    if (!acceptedConsumers.includes(consumer)) {
      errors.push(`acceptance.consumers is missing affected consumer "${consumer}"`);
    }
  }
  if (entry.breaking && !isNonBlank(record.supervisorException)) {
    errors.push(
      `contract ${entry.owner}/${entry.contract}@${entry.version} is a breaking change and requires a supervisorException reference`,
    );
  }

  return errors;
}

function isNonBlank(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}
