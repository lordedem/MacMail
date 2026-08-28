import { contextBridge, ipcRenderer, shell } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  testAccountConnection: (account: any) => ipcRenderer.invoke('mail:test-account', account),
  syncAccount: (account: any) => ipcRenderer.invoke('mail:sync-account', account),
  sendEmail: (draft: any) => ipcRenderer.invoke('mail:send-email', draft),
  showNotification: (title: string, body: string) => ipcRenderer.invoke('app:show-notification', { title, body }),
  setBadgeCount: (count: number) => ipcRenderer.invoke('app:set-badge-count', count),
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  openExternalUrl: (url: string) => shell.openExternal(url),
});
