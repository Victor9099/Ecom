// Ecom — executable architecture boundaries (Story 1.2, AD-15 enforcement).
//
// dependency-cruiser 18.2.0 (exact pin). The root package.json is
// "type": "module", so this config is CommonJS (.cjs).
//
// Matching semantics used below (verified against dependency-cruiser 18.2.0):
//   - `from.path`       is tested against the importing module's source path.
//   - `to.path`/`to.pathNot` are tested against the dependency's *resolved*
//     path (symlinks followed; pnpm real paths live under the .pnpm store).
//   - Capture groups in `from.path` are made available in `to.path` /
//     `to.pathNot` as `$1`, `$2`, … (NOT `\1` backreferences). A rule must
//     therefore use a single-string pattern (no arrays) when it uses `$N`.
//   - `doNotFollow.path` and `exclude.path` both remove a path from the
//     initial source scan; `doNotFollow.dependencyTypes` stops transitively
//     following npm dependencies once resolved.
//
// d.ts/resolution note: there is intentionally no root tsconfig.json, so we do
// NOT set `options.tsConfig.fileName` (dependency-cruiser would throw on a
// missing file). `tsPreCompilationDeps: true` selects the TypeScript parser so
// .ts/.tsx imports are extracted with compiler semantics; `paths` aliases are
// absent from this workspace (cross-module reach is via @ecom/module-* package
// names + relative paths), so no tsconfig is required.

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      // AD-1 / AD-16: a module may reach another module ONLY through its
      // published contracts surface (modules/<m>/src/contracts/**). Same-module
      // internal imports are out of scope here (governed by the hexagonal
      // rules below); cross-module imports outside src/contracts are rejected.
      name: 'no-cross-module-internals',
      severity: 'error',
      comment:
        'AD-1/AD-16: a bounded context may import another context only through modules/<m>/src/contracts/**. ' +
        "Direct imports of another module's domain, application, adapter, or internal files fail the build.",
      from: { path: '^modules/([^/]+)/src/' },
      to: {
        path: '^modules/[^/]+/src/',
        pathNot: '(^modules/$1/src/|^modules/[^/]+/src/contracts/)',
      },
    },
    {
      // AD-1: applications (composition roots) consume modules only through
      // their published contracts surface.
      name: 'apps-reach-modules-via-contracts',
      severity: 'error',
      comment: 'AD-1: apps/** may import a module only through modules/<m>/src/contracts/**.',
      from: { path: '^apps/[^/]+/' },
      to: { path: '^modules/[^/]+/', pathNot: '^modules/[^/]+/src/contracts/' },
    },
    {
      // Modules must not reach up into an application composition root.
      name: 'no-module-imports-apps',
      severity: 'error',
      comment: 'A bounded context must not import from an application (apps/**).',
      from: { path: '^modules/[^/]+/' },
      to: { path: '^apps/' },
    },
    {
      // AD-2 / AD-25: the Prisma client, the pg driver adapter, and the
      // @ecom/platform-database package are owned at the persistence edge.
      // Only a module's adapter (modules/<m>/src/adapters/**) or the platform
      // database package itself may reach them.
      name: 'no-prisma-client-outside-owner-adapters',
      severity: 'error',
      comment:
        'AD-2/AD-25: @prisma/client, @prisma/adapter-pg and @ecom/platform-database may only be imported ' +
        'from modules/<m>/src/adapters/** or platform/database/**.',
      from: { pathNot: '(^modules/[^/]+/src/adapters/|^platform/database/)' },
      to: { path: '(@prisma/(client|adapter-pg)|^platform/database/)' },
    },
    {
      // AD-3 (hexagonal inward): domain is at the core and must not depend on
      // application services or adapters.
      name: 'no-domain-imports-application-or-adapters',
      severity: 'error',
      comment: 'AD-3: modules/<m>/src/domain/** must not import application or adapters.',
      from: { path: '^modules/[^/]+/src/domain/' },
      to: { path: '^modules/[^/]+/src/(application|adapters)/' },
    },
    {
      // AD-3 (hexagonal inward): application orchestrates through ports and
      // must not depend directly on adapter implementations.
      name: 'no-application-imports-adapters',
      severity: 'error',
      comment: 'AD-3: modules/<m>/src/application/** must not import adapters.',
      from: { path: '^modules/[^/]+/src/application/' },
      to: { path: '^modules/[^/]+/src/adapters/' },
    },
  ],
  options: {
    // Never traverse dependency stores or build/generated output. npm
    // dependencies are still recorded as (rule-matched) edges; they are just
    // not crawled further.
    doNotFollow: {
      path: 'node_modules',
      dependencyTypes: [
        'npm',
        'npm-dev',
        'npm-optional',
        'npm-peer',
        'npm-bundled',
        'npm-no-pkg',
        'npm-unknown',
      ],
    },
    exclude: {
      path: '(^|/)(\\.next|\\.turbo|\\.cache|dist|generated|coverage|playwright-report|test-results|blob-report)(/|$)',
    },
    // No root tsconfig; the TypeScript parser is used without `paths` aliases.
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
      mainFields: ['main', 'types', 'typings'],
      extensions: ['.ts', '.tsx', '.d.ts', '.js', '.jsx', '.mjs', '.cjs', '.json'],
    },
  },
};
