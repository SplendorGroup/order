import path from 'path';

import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults, defineConfig } from 'vitest/config';

const aliases = ['infraestructure', 'domain', 'application'];

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: aliases.map((alias) => ({
      find: `@${alias}`,
      replacement: path.resolve(__dirname, `src/${alias}`),
    })),
  },
  test: {
    environment: 'node',
    globals: true,
    exclude: ['**/prisma/**', '**/dist/**', '**/node_modules/**', '**.module.ts'],
    coverage: {
      provider: 'v8',
      exclude: [
        '*/*.ts',
        '**/*.module.ts',
        '.eslintrc.js',
        '**/infraestructure/connections/**',
        '**/infraestructure/repositories/**',
        '**/domain/entities/**',
        '**/domain/enums/**',
        '**/domain/interfaces/**',
        '**/presentation/controllers/**',
        '**/presentation/gateways/**',
        '**/application/dtos/**',
        'prisma',
        '**/example/**',
        ...configDefaults.exclude,
      ],
    },
  },
});
