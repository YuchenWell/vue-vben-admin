import { exit, platform } from 'node:process';

import { app } from 'electron';

import './ipc';

import { restoreOrCreateWindow } from '/@/mainWindow';

/**
 * 防止多实例
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  exit(1);
}

app.on('second-instance', restoreOrCreateWindow);

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

/**
 * @see https://www.electronjs.org/docs/v14-x-y/api/app#event-activate-macos Event: 'activate'
 */
app.on('activate', restoreOrCreateWindow);

/**
 * Create app window when background process will be ready
 */
app
  .whenReady()
  .then(restoreOrCreateWindow)
  .catch((error) => console.error('Failed create window:', error));
