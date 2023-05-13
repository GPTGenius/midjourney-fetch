import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 2 * 60 * 1000,
  },
  esbuild: {
    target: 'node16',
  },
});
