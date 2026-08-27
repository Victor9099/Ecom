import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const fixturesDir = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..', 'fixtures');

describe('Story 1.1 contract test surface', () => {
  it('reserves the versioned contract fixtures location (populated in Story 1.2+)', () => {
    expect(existsSync(fixturesDir)).toBe(true);
  });
});
