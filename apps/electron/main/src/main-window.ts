import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { BrowserWindow } from 'electron';

import { logger } from './utils/logger';

import { isDev, isPackaged } from '/@/utils/';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * 创建新的浏览器窗口
 */
async function createWindow() {
  logger.info('创建主窗口');

  const browserWindow = new BrowserWindow({
    // 使用 'ready-to-show' 事件来显示窗口
    show: false,
    webPreferences: {
      preload: isPackaged
        ? join(__dirname, './preload/index.cjs')
        : join(__dirname, '../../preload/dist/index.cjs'),
      webviewTag: false,
    },
  });

  /**
   * 当窗口准备好显示时触发
   * @see https://github.com/electron/electron/issues/25012
   */
  browserWindow.on('ready-to-show', () => {
    browserWindow?.show();
    browserWindow?.maximize();
    logger.info('窗口已显示并最大化');

    if (isDev) {
      browserWindow?.webContents.openDevTools();
      logger.info('开发模式：已打开开发者工具');
    }
  });

  const pageUrl =
    isDev && import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL
      : `file://${join(__dirname, './web/index.html')}`;

  try {
    await browserWindow.loadURL(pageUrl);
    logger.info(`已加载页面: ${pageUrl}`);
  } catch (error) {
    logger.error(`加载页面失败: ${error}`);
  }

  return browserWindow;
}

/**
 * 恢复现有的浏览器窗口或创建新的浏览器窗口
 */
export async function restoreOrCreateWindow() {
  let window = BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());

  if (window === undefined) {
    logger.info('未找到可用窗口，创建新窗口');
    window = await createWindow();
  } else {
    logger.info('恢复现有窗口');
  }

  if (window.isMinimized()) {
    window.restore();
    logger.info('窗口已从最小化状态恢复');
  }

  window.focus();
  return window;
}
