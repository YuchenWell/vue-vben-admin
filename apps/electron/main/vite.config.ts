import type { UserConfig } from 'vite';

import { dirname, join } from 'node:path';
import { env } from 'node:process';
import { fileURLToPath } from 'node:url';

import { node } from './.electron-vendors.cache.json';

const PACKAGE_ROOT = dirname(fileURLToPath(import.meta.url));

const config: UserConfig = {
  root: PACKAGE_ROOT,
  envDir: PACKAGE_ROOT,
  build: {
    assetsDir: '.',
    emptyOutDir: true,
    lib: {
      entry: {
        index: join(PACKAGE_ROOT, 'src/index.ts'),
      },
      formats: ['cjs'],
    },
    minify: env.MODE !== 'development',
    outDir: 'dist',
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        chunkFileNames: '[name].cjs',
        entryFileNames: '[name].cjs',
      },
    },
    sourcemap: false,
    ssr: true,
    target: `node${node}`,
  },
  resolve: {
    alias: {
      '/@/': `${join(PACKAGE_ROOT, 'src')}/`,
    },
  },
};

export default config;
