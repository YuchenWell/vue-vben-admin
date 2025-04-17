import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { BrowserWindow, screen } from 'electron';

import { logger } from '/@/utils';
import { isDev, isPackaged } from '/@/utils/';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** 获取预加载脚本路径 */
const getPreloadPath = () =>
  isPackaged
    ? join(__dirname, './preload/index.cjs')
    : join(__dirname, '../../preload/dist/index.cjs');

/** 获取应用页面URL */
const getPageUrl = () =>
  !isPackaged && import.meta.env.VITE_DEV_SERVER_URL !== undefined
    ? import.meta.env.VITE_DEV_SERVER_URL
    : `file://${join(__dirname, './web/index.html')}`;

/**
 * 创建新的浏览器窗口
 */
async function createWindow() {
  logger.info('创建主窗口');

  // 获取屏幕尺寸
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const browserWindow = new BrowserWindow({
    // 初始尺寸
    width: Math.min(1280, width * 0.9),
    height: Math.min(800, height * 0.9),
    // 窗口居中
    center: true,
    // 使用 'ready-to-show' 事件来显示窗口，避免白屏闪烁
    show: false,
    // 隐藏默认标题栏
    frame: true,
    // 允许窗口大小调整
    resizable: true,
    // 窗口背景色
    backgroundColor: '#ffffff',
    webPreferences: {
      // 注入预加载脚本
      preload: getPreloadPath(),
      // 安全考虑，禁用webview
      webviewTag: false,
      // 安全考虑，禁用node集成
      nodeIntegration: false,
      // 安全考虑，启用上下文隔离
      contextIsolation: true,
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

  try {
    const pageUrl = getPageUrl();
    await browserWindow.loadURL(pageUrl);
    logger.log(`页面加载成功: ${pageUrl}`);
  } catch (error) {
    logger.error('页面加载失败', error);
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
