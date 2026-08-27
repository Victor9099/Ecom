import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  computeContractDigest,
  sha256Hex,
  validateContractEntry,
  validateManifestShape,
  validateNewVersionGate,
  type ContractEntry,
  type ContractManifest,
} from './lib/manifest';

const contractsRoot = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..');

const manifestPath = path.join(contractsRoot, 'manifest.json');
const fixturesDir = path.join(contractsRoot, 'fixtures');
const acceptancesDir = path.join(contractsRoot, 'acceptances');
const historyDir = path.join(contractsRoot, 'history');

/** Path helpers mirroring the versioned layout (kept explicit for unit tests). */
function versionDirectory(entry: Pick<ContractEntry, 'owner' | 'contract' | 'version'>): string {
  return path.join(fixturesDir, entry.owner, entry.contract, entry.version);
}

function historyFile(entry: Pick<ContractEntry, 'owner' | 'contract' | 'version'>): string {
  return path.join(historyDir, entry.owner, entry.contract, `${entry.version}.sha256`);
}

function acceptanceFile(entry: Pick<ContractEntry, 'owner' | 'contract' | 'version'>): string {
  return path.join(acceptancesDir, entry.owner, entry.contract, `${entry.version}.json`);
}

describe('Story 1.2 contract compatibility (AC3) — registry', () => {
  it('declares the versioned fixture layout (identifiable, merge-friendly)', () => {
    expect(existsSync(manifestPath)).toBe(true);
    expect(existsSync(fixturesDir)).toBe(true);
    expect(existsSync(acceptancesDir)).toBe(true);
    expect(existsSync(historyDir)).toBe(true);
  });

  it('the manifest starts EMPTY (nothing released yet — real AC5 assertion)', () => {
    const raw = readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(raw) as unknown;

    expect(validateManifestShape(manifest)).toEqual([]);
    const contracts = (manifest as ContractManifest).contracts;
    expect(Array.isArray(contracts)).toBe(true);
    expect(contracts).toEqual([]);
  });

  it('resolves versioned fixture/history/acceptance paths from a contract entry', () => {
    const entry = { owner: 'cart', contract: 'cart-item-added', version: 'v2' };
    expect(versionDirectory(entry)).toBe(path.join(fixturesDir, 'cart', 'cart-item-added', 'v2'));
    expect(historyFile(entry)).toBe(path.join(historyDir, 'cart', 'cart-item-added', 'v2.sha256'));
    expect(acceptanceFile(entry)).toBe(
      path.join(acceptancesDir, 'cart', 'cart-item-added', 'v2.json'),
    );
  });
});

describe('Story 1.2 contract compatibility (AC3) — executable negative/positive units', () => {
  it('rejects contract entries missing owner/version/kind/consumers', () => {
    expect(validateContractEntry({})).toEqual(
      expect.arrayContaining([
        'contract.owner is required and must be a non-blank owner name',
        'contract.contract is required and must be a non-blank contract name',
        'contract.version is required and must be v<N> (got "undefined")',
        'contract.kind is required and must be one of command|event|api',
        'contract.consumers is required and must be an array of consumer owner names',
      ]),
    );
  });

  it('rejects a malformed version token, kind, or duplicate consumers', () => {
    expect(
      validateContractEntry({
        owner: 'cart',
        contract: 'item-added',
        version: '1',
        kind: 'envelope',
        consumers: ['checkout', 'checkout'],
      }),
    ).toEqual(
      expect.arrayContaining([
        'contract.version is required and must be v<N> (got "1")',
        'contract.kind is required and must be one of command|event|api',
        'contract.consumers must not contain duplicate consumer names',
      ]),
    );
  });

  it('accepts a well-formed contract entry', () => {
    expect(
      validateContractEntry({
        owner: 'cart',
        contract: 'cart-item-added',
        version: 'v1',
        kind: 'event',
        consumers: ['checkout', 'orders'],
      }),
    ).toEqual([]);
  });

  it('treats a changed schema+contract digest as a breaking immutability violation', () => {
    const releasedDigest = computeContractDigest([
      { name: 'schema.json', content: '{"type":"object"}' },
      { name: 'contract.json', content: '{"owner":"cart","contract":"cart-item-added"}' },
    ]);

    // Any change to a released version's schema or contract must change the digest.
    const tamperedDigest = computeContractDigest([
      { name: 'schema.json', content: '{"type":"object","additionalProperties":true}' },
      { name: 'contract.json', content: '{"owner":"cart","contract":"cart-item-added"}' },
    ]);
    expect(tamperedDigest).not.toBe(releasedDigest);

    // The stored history file is a plain sha256 hex string.
    expect(sha256Hex('stable-content')).toBe(sha256Hex('stable-content'));
    expect(sha256Hex('stable-content')).not.toBe(sha256Hex('changed-content'));
  });

  it('gates any v>1 release on a bilateral acceptance naming producer + consumers', () => {
    const v2: ContractEntry = {
      owner: 'cart',
      contract: 'cart-item-added',
      version: 'v2',
      kind: 'event',
      consumers: ['checkout', 'orders'],
    };

    // No acceptance record -> fail.
    expect(
      validateNewVersionGate(v2, null).some((e) =>
        e.includes('requires a bilateral acceptance record'),
      ),
    ).toBe(true);

    // Acceptance must name the producer and every affected consumer.
    expect(validateNewVersionGate(v2, { producer: 'billing', consumers: ['checkout'] })).toEqual(
      expect.arrayContaining([
        'acceptance.producer must name the producer "cart"',
        'acceptance.consumers is missing affected consumer "orders"',
      ]),
    );

    // Complete, non-breaking acceptance -> pass.
    expect(
      validateNewVersionGate(v2, { producer: 'cart', consumers: ['checkout', 'orders'] }),
    ).toEqual([]);
  });

  it('requires a supervisorException reference when a v>1 release is breaking', () => {
    const breakingV2: ContractEntry = {
      owner: 'cart',
      contract: 'cart-item-added',
      version: 'v2',
      kind: 'event',
      consumers: ['checkout', 'orders'],
      breaking: true,
    };

    expect(
      validateNewVersionGate(breakingV2, {
        producer: 'cart',
        consumers: ['checkout', 'orders'],
      }).some((e) => e.includes('requires a supervisorException reference')),
    ).toBe(true);

    expect(
      validateNewVersionGate(breakingV2, {
        producer: 'cart',
        consumers: ['checkout', 'orders'],
        supervisorException: 'SUP-2026-08-27-001',
      }),
    ).toEqual([]);
  });
});
