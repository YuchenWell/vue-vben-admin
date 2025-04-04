import { platform } from 'node:process';

import { app } from 'electron';

/** 是否处于开发环境 */
export const isDev = import.meta.env.DEV;
/** 是否处于生产环境 */
export const isProd = import.meta.env.PROD;
/** 是否处于打包状态 */
export const isPackaged = app.isPackaged;

export const isMac = platform === 'darwin';
export const isWindows = platform === 'win32';
