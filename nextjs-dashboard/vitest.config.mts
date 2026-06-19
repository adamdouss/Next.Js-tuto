import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // tsconfigPaths() résout l'alias '@/*' -> './*' (tsconfig baseUrl '.') dans les tests.
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    // globals: true -> describe/it/expect/vi sans import + auto-cleanup RTL.
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // css: true -> les imports de styles (Tailwind / global) ne cassent pas.
    css: true,
  },
});
