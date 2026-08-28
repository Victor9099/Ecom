// AC3 merge-time sha256 immutability — executable negative/positive units
// (Story 1.2 correction OCR-003).
//
// Proves the full loop: a released manifest entry's committed
// `history/<owner>/<contract>/v<N>.sha256` is READ and compared against the
// canonical digest of every file under `fixtures/<owner>/<contract>/v<N>/**`
// (schema + contract + fixtures, stable name-sorted). Tampering any released
// byte yields a violation.

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { computeContractDigest, type ContractEntry, type ContractManifest } from './lib/manifest';
import { listRegularFiles, verifyReleasedContractImmutability } from './lib/immutability';

const contractsRoot = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..');

const releasedEntry: ContractEntry = {
  owner: 'cart',
  contract: 'cart-item-added',
  version: 'v1',
  kind: 'event',
  consumers: ['checkout'],
};

interface TempContract {
  base: string;
  fixturesDir: string;
  historyDir: string;
  manifest: ContractManifest;
  cleanup: () => void;
}

function writeFile(segments: string[], content: string): void {
  const full = path.join(...segments);
  mkdirSync(path.dirname(full), { recursive: true });
  writeFileSync(full, content);
}

/** Builds a released contract tree; writes a committed .sha256 unless told otherwise. */
function makeTempContract(options?: {
  omitSha256?: boolean;
  omitVersionDir?: boolean;
}): TempContract {
  const base = mkdtempSync(path.join(tmpdir(), 'ecom-contract-'));
  const fixturesDir = path.join(base, 'fixtures');
  const historyDir = path.join(base, 'history');

  if (!options?.omitVersionDir) {
    const versionDir = path.join(
      fixturesDir,
      releasedEntry.owner,
      releasedEntry.contract,
      releasedEntry.version,
    );
    writeFile(
      [versionDir, 'schema.json'],
      '{"type":"object","properties":{"cartId":{"type":"string"}}}',
    );
    writeFile(
      [versionDir, 'contract.json'],
      '{"owner":"cart","contract":"cart-item-added","version":"v1","kind":"event","consumers":["checkout"]}',
    );
    writeFile([versionDir, 'fixtures', 'added.json'], '{"cartId":"c_1","sku":"SKU-1"}');

    if (!options?.omitSha256) {
      const digest = computeContractDigest(
        listRegularFiles(versionDir).map((name) => ({
          name,
          content: readFileSync(path.join(versionDir, ...name.split('/')), 'utf8'),
        })),
      );
      writeFile(
        [
          historyDir,
          releasedEntry.owner,
          releasedEntry.contract,
          `${releasedEntry.version}.sha256`,
        ],
        `${digest}\n`,
      );
    }
  }

  return {
    base,
    fixturesDir,
    historyDir,
    manifest: { version: 1, contracts: [{ ...releasedEntry }] },
    cleanup: () => rmSync(base, { recursive: true, force: true }),
  };
}

describe('AC3 sha256 immutability — merge-time check (OCR-003)', () => {
  it('verifies the real released record-audit-entry/v1 contract immutability (not a skip)', () => {
    const raw = readFileSync(path.join(contractsRoot, 'manifest.json'), 'utf8');
    const manifest = JSON.parse(raw) as ContractManifest;

    expect(
      verifyReleasedContractImmutability(
        manifest,
        path.join(contractsRoot, 'fixtures'),
        path.join(contractsRoot, 'history'),
      ),
    ).toEqual([]);
  });

  it('accepts a released version whose committed sha256 matches its files', () => {
    const temp = makeTempContract();
    try {
      expect(
        verifyReleasedContractImmutability(temp.manifest, temp.fixturesDir, temp.historyDir),
      ).toEqual([]);
    } finally {
      temp.cleanup();
    }
  });

  it('rejects a tampered schema (immutability violation)', () => {
    const temp = makeTempContract();
    try {
      const versionDir = path.join(
        temp.fixturesDir,
        releasedEntry.owner,
        releasedEntry.contract,
        releasedEntry.version,
      );
      // Tamper a single byte of the released schema in place.
      writeFileSync(
        path.join(versionDir, 'schema.json'),
        '{"type":"object","properties":{"cartId":{"type":"string"},"qty":{"type":"number"}}}',
      );

      const violations = verifyReleasedContractImmutability(
        temp.manifest,
        temp.fixturesDir,
        temp.historyDir,
      );
      expect(violations).toHaveLength(1);
      expect(violations[0]).toMatchObject({
        owner: 'cart',
        contract: 'cart-item-added',
        version: 'v1',
      });
      expect(violations[0]?.message).toContain('sha256 mismatch');
      expect(violations[0]?.committed).not.toBe(violations[0]?.computed);
    } finally {
      temp.cleanup();
    }
  });

  it('rejects a tampered fixture payload (immutability violation)', () => {
    const temp = makeTempContract();
    try {
      const versionDir = path.join(
        temp.fixturesDir,
        releasedEntry.owner,
        releasedEntry.contract,
        releasedEntry.version,
      );
      writeFileSync(
        path.join(versionDir, 'fixtures', 'added.json'),
        '{"cartId":"c_2","sku":"SKU-2"}',
      );

      const violations = verifyReleasedContractImmutability(
        temp.manifest,
        temp.fixturesDir,
        temp.historyDir,
      );
      expect(violations).toHaveLength(1);
      expect(violations[0]?.message).toContain('sha256 mismatch');
      expect(violations[0]?.committed).not.toBe(violations[0]?.computed);
    } finally {
      temp.cleanup();
    }
  });

  it('rejects a released entry whose committed sha256 file is missing (fail-closed)', () => {
    const temp = makeTempContract({ omitSha256: true });
    try {
      const violations = verifyReleasedContractImmutability(
        temp.manifest,
        temp.fixturesDir,
        temp.historyDir,
      );
      expect(violations).toHaveLength(1);
      expect(violations[0]?.message).toContain('missing committed sha256 file');
    } finally {
      temp.cleanup();
    }
  });

  it('rejects a released entry whose fixture version directory is missing (fail-closed)', () => {
    const temp = makeTempContract({ omitVersionDir: true });
    try {
      const violations = verifyReleasedContractImmutability(
        temp.manifest,
        temp.fixturesDir,
        temp.historyDir,
      );
      expect(violations).toHaveLength(1);
      expect(violations[0]?.message).toContain('missing fixture version directory');
    } finally {
      temp.cleanup();
    }
  });
});
