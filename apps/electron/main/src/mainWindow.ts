import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { BrowserWindow } from 'electron';

import { isDev, isPackaged } from '/@/utils/';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function createWindow() {
  const browserWindow = new BrowserWindow({
    // Use 'ready-to-show' event to show window
    show: false,
    webPreferences: {
      preload: isPackaged
        ? join(__dirname, './electron-preload/index.cjs')
        : join(__dirname, '../../electron-preload/dist/index.cjs'),
      webviewTag: false,
    },
  });

  /**
   * @see https://github.com/electron/electron/issues/25012
   */
  browserWindow.on('ready-to-show', () => {
    browserWindow?.show();

    if (isDev) {
      browserWindow?.webContents.openDevTools();
    }
  });

  const pageUrl =
    isDev && import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL
      : `file://${join(__dirname, './web/index.html')}`;

  await browserWindow.loadURL(pageUrl);

  return browserWindow;
}

/**
 * 恢复现有的浏览器窗口或创建新的浏览器窗口
 */
export async function restoreOrCreateWindow() {
  let window = BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());

  if (window === undefined) {
    window = await createWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
}
