import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: import.meta.dirname,
    include: ['**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['release/lib.ts'],
      reporter: ['text-summary'],
      thresholds: { 100: true },
    },
  },
});
