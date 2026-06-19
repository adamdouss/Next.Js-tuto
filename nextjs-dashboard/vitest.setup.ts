import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Démonte l'arbre React entre les tests (sûr quel que soit le réglage globals).
afterEach(() => {
  cleanup();
});
