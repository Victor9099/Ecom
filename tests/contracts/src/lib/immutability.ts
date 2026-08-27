// Merge-time sha256 immutability check (AD-10 — Story 1.2 correction OCR-003).
//
// This is the MISSING half of the AC3 contract-immutability story: previously
// `computeContractDigest` and a `historyFile()` path helper existed, but
// nothing actually READ a committed `history/<owner>/<contract>/v<N>.sha256`
// and rejected a mismatch. `verifyReleasedContractImmutability` closes that
// loop: for every released manifest entry it recomputes the canonical digest
// over `fixtures/<owner>/<contract>/v<N>/**` (schema + contract + fixtures,
// stable name-sorted) and asserts it equals the committed sha256.
//
// Dormant-safe: an empty manifest (the current baseline) yields `[]` — a real
// no-op pass, not a skip.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { computeContractDigest, type ContractManifest } from './manifest';

export interface ImmutabilityViolation {
  owner: string;
  contract: string;
  version: string;
  message: string;
  /** Hex string committed on disk (null when the file is absent). */
  committed: string | null;
  /** Hex string recomputed from the fixture tree (null when it is absent). */
  computed: string | null;
}

function toPosix(relativePath: string): string {
  // Normalise Windows separators so the committed digest does not depend on
  // the host OS. Newline differences (LF vs CRLF, e.g. core.autocrlf=true)
  // are a separate portability concern; the raw bytes are hashed as-is.
  return relativePath.split(path.sep).join('/');
}

/** Depth-first list of regular files under `dir`, as posix relative paths, sorted. */
export function listRegularFiles(dir: string): string[] {
  const out: string[] = [];
  const walk = (current: string, relative: string): void => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      const relPath = relative ? `${relative}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walk(full, relPath);
      } else if (entry.isFile()) {
        out.push(toPosix(relPath));
      }
    }
  };
  walk(dir, '');
  return out.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

/**
 * For every released contract manifest entry, recompute the canonical sha256
 * from the committed fixture tree and compare against the committed
 * `history/<owner>/<contract>/v<N>.sha256`. Returns a violation per entry that
 * is missing its version directory, missing its committed sha256, or whose
 * committed sha256 does not match. Empty manifest => `[]`.
 */
export function verifyReleasedContractImmutability(
  manifest: ContractManifest,
  fixturesDir: string,
  historyDir: string,
): ImmutabilityViolation[] {
  const violations: ImmutabilityViolation[] = [];

  for (const entry of manifest.contracts) {
    const versionDir = path.join(fixturesDir, entry.owner, entry.contract, entry.version);
    const historyPath = path.join(
      historyDir,
      entry.owner,
      entry.contract,
      `${entry.version}.sha256`,
    );

    if (!existsSync(versionDir)) {
      violations.push({
        owner: entry.owner,
        contract: entry.contract,
        version: entry.version,
        message: `missing fixture version directory: ${versionDir}`,
        committed: null,
        computed: null,
      });
      continue;
    }

    if (!existsSync(historyPath)) {
      violations.push({
        owner: entry.owner,
        contract: entry.contract,
        version: entry.version,
        message: `missing committed sha256 file: ${historyPath}`,
        committed: null,
        computed: null,
      });
      continue;
    }

    const committed = readFileSync(historyPath, 'utf8').trim();
    const computed = computeContractDigest(
      listRegularFiles(versionDir).map((name) => ({
        name,
        content: readFileSync(path.join(versionDir, ...name.split('/')), 'utf8'),
      })),
    );

    if (committed !== computed) {
      violations.push({
        owner: entry.owner,
        contract: entry.contract,
        version: entry.version,
        message: `sha256 mismatch for ${entry.owner}/${entry.contract}@${entry.version}`,
        committed,
        computed,
      });
    }
  }

  return violations;
}
