import type { MainMessage, RenderMessage } from '@yyb-electron/preload';

import { IPCMain } from '@yyb-electron/preload/main';

export const ipcMain = new IPCMain<RenderMessage, MainMessage>();

ipcMain.on('getUsernameById', (userID) => {
  console.log('getUsernameById', `User ID: ${userID}`);
  return 'User Name';
});

setTimeout(() => {
  ipcMain.send('newUserJoin', 1);
}, 5000);
