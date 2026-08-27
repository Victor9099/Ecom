// Ecom — executable architecture boundaries (Story 1.2 correction, AD-15
// enforcement).
//
// dependency-cruiser 18.2.0 (exact pin). The root package.json is
// "type": "module", so this config is CommonJS (.cjs).
//
// Matching semantics (verified empirically against dependency-cruiser 18.2.0
// and this repo's pnpm layout):
//   - `from.path`       is tested against the importing module's source path.
//   - `to.path`/`to.pathNot` are tested against the dependency's *resolved*
//     path. Resolution is NOT deterministic for the @ecom workspace packages:
//       * when a @ecom package resolves (pnpm symlink followed), `resolved`
//         is the real source path (modules/<m>/…, apps/…, platform/…);
//       * when it does NOT resolve (this baseline has no per-package
//         `exports`/`main` and no node_modules symlink until a consumer
//         depends on it), `resolved` is the BARE package specifier — e.g.
//         `@ecom/module-orders` or `@ecom/platform-database`.
//     The forbidden rules below therefore match BOTH the real-source paths
//     (`^modules/…`, `^apps/…`, `^platform/database/…`) AND the package-name
//     forms (`@ecom/module-…`, `@ecom/<app>`, `@ecom/platform-database`), so a
//     violation can never silently fail to match just because pnpm resolution
//     changed.
//   - Capture groups in `from.path` are made available in `to.path` /
//     `to.pathNot` as `$1`, `$2`, … (NOT backreferences). A rule must
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
      // published contracts surface (modules/<m>/src/contracts/** — or the
      // equivalent @ecom/module-<m>/src/contracts/** package subpath).
      // Same-module internal imports are out of scope here (governed by the
      // hexagonal rules below); cross-module imports outside src/contracts are
      // rejected whether they are written as relative paths or package names.
      name: 'no-cross-module-internals',
      severity: 'error',
      comment:
        'AD-1/AD-16: a bounded context may import another context only through modules/<m>/src/contracts/** ' +
        "(or @ecom/module-<m>/src/contracts/**). Direct imports of another module's domain, application, " +
        'adapter, internal or barrel files — as relative paths or @ecom package names — fail the build.',
      from: { path: '^modules/([^/]+)/src/' },
      to: {
        path: '(^modules/[^/]+/src/|^@ecom/module-[^/]+)',
        pathNot:
          '(^modules/$1/src/|^@ecom/module-$1(/|$)|^modules/[^/]+/src/contracts/|^@ecom/module-[^/]+/src/contracts/)',
      },
    },
    {
      // AD-1: applications (composition roots) consume modules only through
      // their published contracts surface.
      name: 'apps-reach-modules-via-contracts',
      severity: 'error',
      comment:
        'AD-1: apps/** may import a module only through modules/<m>/src/contracts/** ' +
        '(or @ecom/module-<m>/src/contracts/**).',
      from: { path: '^apps/[^/]+/' },
      to: {
        path: '(^modules/[^/]+/|^@ecom/module-[^/]+)',
        pathNot: '(^modules/[^/]+/src/contracts/|^@ecom/module-[^/]+/src/contracts/)',
      },
    },
    {
      // Modules must not reach up into an application composition root — via a
      // relative path into apps/ or via the @ecom/<app> package name.
      name: 'no-module-imports-apps',
      severity: 'error',
      comment: 'A bounded context must not import from an application (apps/** or @ecom/<app>).',
      from: { path: '^modules/[^/]+/' },
      to: { path: '(^apps/|^@ecom/(admin|api|storefront|worker)(/|$))' },
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
      to: { path: '(@prisma/(client|adapter-pg)|^platform/database/|@ecom/platform-database)' },
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
      path: '(^|/)([.]next|[.]turbo|[.]cache|dist|generated|coverage|playwright-report|test-results|blob-report)(/|$)',
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
