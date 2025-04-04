/**
 * @module preload
 */

import type { MainMessage, RenderMessage } from './types';

import { contextBridge } from 'electron';

import { IPCRenderer } from './ipcRenderer';

export * from './types';

const ipcRenderer = new IPCRenderer<RenderMessage, MainMessage>();

const electronAPI = {
  // eslint-disable-next-line n/prefer-global/process
  versions: process.versions,
  send: ipcRenderer.send,
  on: ipcRenderer.on,
} as const;

export type ElectronAPI = typeof electronAPI;

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
