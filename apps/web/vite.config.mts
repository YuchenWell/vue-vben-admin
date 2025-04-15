import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      root: dirname(fileURLToPath(import.meta.url)),
    },
  };
}, 'application');
