# @ecom/config — shared configuration

Owns the shared **compile** baselines referenced by every workspace package via
relative `extends`. Lint (ESLint flat config), formatting (Prettier), and test
(Vitest) config live at the repository root so a single repo-wide pass is
deterministic and never forks per package.

- `tsconfig/base.json` — shared strictness, target, and interop flags.
- `tsconfig/library.json` — modular/browser-package baseline (no emit, bundler resolution).