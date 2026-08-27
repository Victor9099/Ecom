#!/usr/bin/env node
/**
 * Story 1.1 smoke check — proves the dependency graph is executable.
 *
 *   1. Confirms build artifacts exist for Storefront + Admin (`next build`)
 *      and API + Worker (`nest build`).
 *   2. Boots the API (`node dist/main.js`) and asserts `GET /health` returns 200.
 *   3. Boots the Worker (`node dist/main.js`) and asserts it reaches "ready".
 *
 * No Docker, database, or testcontainers are involved (Docker daemon is DOWN on
 * the scaffold host and Story 1.1 forbids business tables).
 */
import { spawn } from 'node:child_process';
import { constants as fsConstants } from 'node:fs';
import { access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

let failures = 0;
const fail = (msg) => {
  failures += 1;
  console.error(`[smoke] FAIL: ${msg}`);
};
const ok = (msg) => console.log(`[smoke] OK: ${msg}`);

async function exists(rel) {
  try {
    await access(path.join(root, rel), fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function waitForOutput(child, predicate, timeoutMs) {
  return new Promise((resolve) => {
    let buffer = '';
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve({ matched: false, tail: buffer.slice(-500) });
      }
    }, timeoutMs);
    const onData = (chunk) => {
      buffer += chunk.toString();
      if (predicate(buffer)) {
        clearTimeout(timer);
        settled = true;
        resolve({ matched: true, tail: buffer.slice(-500) });
      }
    };
    child.stdout?.on('data', onData);
    child.stderr?.on('data', onData);
    child.once('exit', () => {
      if (!settled) {
        clearTimeout(timer);
        settled = true;
        resolve({ matched: false, tail: buffer.slice(-500) });
      }
    });
  });
}

async function pollHealth(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const body = await res.json().catch(() => ({}));
        return { ok: true, status: res.status, body };
      }
      return { ok: false, status: res.status, body: {} };
    } catch {
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  return { ok: false, status: 0, body: {} };
}

function spawnNode(cwd, args) {
  return spawn(process.execPath, args, {
    cwd: path.join(root, cwd),
    env: { ...process.env, NODE_ENV: 'test', PORT: '3100' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

// --- 1. Build artifacts ---
const artifacts = [
  ['Storefront next build', 'apps/storefront/.next/BUILD_ID'],
  ['Admin next build', 'apps/admin/.next/BUILD_ID'],
  ['API nest build', 'apps/api/dist/main.js'],
  ['Worker nest build', 'apps/worker/dist/main.js'],
];
for (const [label, rel] of artifacts) {
  if (await exists(rel)) ok(label);
  else fail(`${label} (missing ${rel} — run \`pnpm build\` first)`);
}

// --- 2. API boot + GET /health ---
{
  const api = spawnNode('apps/api', ['dist/main.js']);
  const health = await pollHealth('http://127.0.0.1:3100/health', 20000);
  if (health.ok && health.status === 200) ok(`API /health => ${health.status}`);
  else fail(`API /health => status ${health.status} (${JSON.stringify(health.body)})`);
  api.kill();
}

// --- 3. Worker boot ---
{
  const worker = spawnNode('apps/worker', ['dist/main.js']);
  const res = await waitForOutput(worker, (out) => out.includes('worker ready'), 20000);
  if (res.matched) ok(`Worker boot (${res.tail.split('\n').filter(Boolean).pop() ?? ''})`);
  else fail(`Worker boot never reached ready state: ${res.tail}`);
  worker.kill();
}

if (failures > 0) {
  console.error(`[smoke] ${failures} check(s) failed.`);
  process.exit(1);
}
console.log('[smoke] all checks passed.');
