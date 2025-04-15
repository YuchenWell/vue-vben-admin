import { exit, platform } from 'node:process';

import { app } from 'electron';

import { restoreOrCreateWindow } from './main-window';
import { logger } from './utils/logger';

import './ipc';

/**
 * 防止多实例
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  logger.info('应用已在运行，退出当前实例');
  app.quit();
  exit(1);
}

app.on('second-instance', restoreOrCreateWindow);

/**
 * 当所有窗口关闭时退出后台进程
 */
app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    logger.info('所有窗口已关闭，应用退出');
    app.quit();
  }
});

/**
 * macOS 下点击 dock 图标时重新打开窗口
 * @see https://www.electronjs.org/docs/latest/api/app#event-activate-macos
 */
app.on('activate', restoreOrCreateWindow);

/**
 * 当后台进程准备就绪时创建应用窗口
 */
app
  .whenReady()
  .then(() => {
    logger.info('应用启动');
    return restoreOrCreateWindow();
  })
  .catch((error) => logger.error(`创建窗口失败: ${error}`));
