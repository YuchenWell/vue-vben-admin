import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      root: dirname(fileURLToPath(import.meta.url)),
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            // rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://10.1.1.14:8090/',
            // target: 'http://172.26.2.58:9005/',
            ws: true,
          },
        },
      },
    },
  };
}, 'application');
