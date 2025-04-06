import type { LogLevel, ViteDevServer } from 'vite';

import { build } from 'vite';

/**
 * 设置 preload package 监听器
 * 当 preload package 文件发生变化时重新加载页面
 */
export const setupPreloadPackageWatcher = (options: {
  devServer: ViteDevServer;
  logLevel: LogLevel;
  mode: string;
}) => {
  const { devServer, logLevel, mode } = options;
  const { ws } = devServer;

  return build({
    build: {
      watch: {},
    },
    configFile: 'apps/electron/preload/vite.config.ts',
    logLevel,
    mode,
    plugins: [
      {
        name: 'reload-page-on-preload-package-change',
        writeBundle() {
          ws.send({
            type: 'full-reload',
          });

          console.warn('Preload 包已更新，正在重新加载页面');
        },
      },
    ],
  });
};
