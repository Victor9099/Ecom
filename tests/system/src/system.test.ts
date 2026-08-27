import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const repoRoot = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..', '..');

describe('Story 1.1 system test surface', () => {
  it('exposes the smoke entrypoint that proves the graph is executable', () => {
    expect(existsSync(path.join(repoRoot, 'scripts', 'smoke.mjs'))).toBe(true);
  });
});
