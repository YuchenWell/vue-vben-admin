import type { LogLevel, ViteDevServer } from 'vite';

import path from 'node:path';

import { build } from 'vite';

import { ElectronAppManager } from '../electron-app-manager';

/**
 * 设置 main package 监听器
 * 当 main package 文件发生变化时重启 Electron 应用
 */
export const setupMainPackageWatcher = (options: {
  devServer: ViteDevServer;
  electronAppManager: ElectronAppManager;
  logLevel: LogLevel;
  mode: string;
  watch: boolean;
}) => {
  const { devServer, electronAppManager, logLevel, mode, watch } = options;
  const { resolvedUrls } = devServer;

  process.env.VITE_DEV_SERVER_URL = resolvedUrls?.local[0];

  return build({
    build: {
      watch: watch ? {} : null,
    },
    configFile: 'apps/electron/main/vite.config.ts',
    logLevel,
    mode,
    plugins: [
      {
        name: 'reload-app-on-main-package-change',
        writeBundle() {
          electronAppManager.launch(
            path.resolve(process.cwd(), './apps/electron/main'),
          );
        },
      },
    ],
  });
};
