#!/usr/bin/env node

import { createServer } from 'vite';

import { getConfig } from './lib/config';
import { ElectronAppManager } from './lib/electron-app-manager';
import { setupMainPackageWatcher } from './lib/watchers/main-package';
import { setupPreloadPackageWatcher } from './lib/watchers/preload-package';

const log = console.log;

// 创建 Electron 应用管理器实例
const electronAppManager = new ElectronAppManager();

/**
 * 启动开发服务器和各种监听器
 */
async function main() {
  try {
    const { logLevel, mode, watch } = getConfig();

    log('正在启动开发服务器...');

    // 启动渲染器开发服务器
    const rendererDevServer = await createServer({
      configFile: 'apps/web/vite.config.mts',
      logLevel,
      mode,
    });

    const rendererWatchServer = await rendererDevServer.listen();
    log('开发服务器启动成功');

    // 设置 preload 包监听器
    await setupPreloadPackageWatcher({
      devServer: rendererWatchServer,
      logLevel,
      mode,
    });

    // 设置 main 包监听器
    await setupMainPackageWatcher({
      devServer: rendererWatchServer,
      electronAppManager,
      logLevel,
      mode,
      watch,
    });
  } catch (error) {
    console.error('启动失败:', error);
    process.exit(1);
  }
}

// 全局异常处理
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('未处理的 Promise 拒绝:', reason);
});

// 启动应用
main();
