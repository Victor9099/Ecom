import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/dist/**',
      '**/coverage/**',
      '**/generated/**',
      '**/next-env.d.ts',
      '**/*.d.ts',
      '.beads/**',
      '.impeccable/**',
      '.orchestration/**',
      '_bmad-output/**',
      'design-system/**',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...js.configs.recommended,
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // Coarse AD-2/AD-25 Prisma ownership guard (built-in rule, no new dep).
    // Kept deliberately coarse: dependency-cruiser is the authoritative,
    // path-aware boundary engine; this complements it with a workspace-wide
    // prohibition for any file outside modules/<m>/src/adapters/** and
    // platform/database/**. A full 17-module eslint boundary matrix is out of
    // scope (lead decision).
    files: ['**/*.{ts,tsx,mts,cts}'],
    ignores: ['**/modules/*/src/adapters/**', '**/platform/database/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@prisma/client',
                '@prisma/client/*',
                '@prisma/adapter-pg',
                '@prisma/adapter-pg/*',
                '@ecom/platform-database',
                '@ecom/platform-database/*',
              ],
              message:
                'AD-2/AD-25: @prisma/client, @prisma/adapter-pg, and @ecom/platform-database may only be imported from modules/<m>/src/adapters/** or platform/database/**.',
            },
          ],
        },
      ],
    },
  },
);
