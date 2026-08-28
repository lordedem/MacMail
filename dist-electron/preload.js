"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    testAccountConnection: (account) => electron_1.ipcRenderer.invoke('mail:test-account', account),
    syncAccount: (account) => electron_1.ipcRenderer.invoke('mail:sync-account', account),
    sendEmail: (draft) => electron_1.ipcRenderer.invoke('mail:send-email', draft),
    showNotification: (title, body) => electron_1.ipcRenderer.invoke('app:show-notification', { title, body }),
    setBadgeCount: (count) => electron_1.ipcRenderer.invoke('app:set-badge-count', count),
    minimizeWindow: () => electron_1.ipcRenderer.invoke('window:minimize'),
    maximizeWindow: () => electron_1.ipcRenderer.invoke('window:maximize'),
    closeWindow: () => electron_1.ipcRenderer.invoke('window:close'),
    openExternalUrl: (url) => electron_1.shell.openExternal(url),
});
