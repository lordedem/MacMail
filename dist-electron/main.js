"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const imapService_1 = require("./services/imapService");
const smtpService_1 = require("./services/smtpService");
let mainWindow = null;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1240,
        height: 820,
        minWidth: 960,
        minHeight: 620,
        titleBarStyle: 'hiddenInset',
        trafficLightPosition: { x: 16, y: 14 },
        backgroundColor: '#191b22',
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false,
        },
    });
    const isDev = process.env.NODE_ENV === 'development' || !electron_1.app.isPackaged;
    if (isDev && process.env.VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    }
    else if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
    }
    else {
        mainWindow.loadFile(path_1.default.join(__dirname, '../dist/index.html'));
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    // Setup Mac Native Menu
    createAppMenu();
}
function createAppMenu() {
    const isMac = process.platform === 'darwin';
    const template = [
        ...(isMac
            ? [
                {
                    label: 'MacMail',
                    submenu: [
                        { role: 'about' },
                        { type: 'separator' },
                        {
                            label: 'Preferences...',
                            accelerator: 'Cmd+,',
                            click: () => mainWindow?.webContents.send('menu:open-settings'),
                        },
                        { type: 'separator' },
                        { role: 'services' },
                        { type: 'separator' },
                        { role: 'hide' },
                        { role: 'hideOthers' },
                        { role: 'unhide' },
                        { type: 'separator' },
                        { role: 'quit' },
                    ],
                },
            ]
            : []),
        {
            label: 'File',
            submenu: [
                {
                    label: 'New Message',
                    accelerator: 'Cmd+N',
                    click: () => mainWindow?.webContents.send('menu:compose'),
                },
                {
                    label: 'Sync All Accounts',
                    accelerator: 'Cmd+R',
                    click: () => mainWindow?.webContents.send('menu:sync'),
                },
                { type: 'separator' },
                isMac ? { role: 'close' } : { role: 'quit' },
            ],
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'selectAll' },
            ],
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Command Palette',
                    accelerator: 'Cmd+K',
                    click: () => mainWindow?.webContents.send('menu:command-palette'),
                },
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' },
            ],
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac
                    ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }]
                    : [{ role: 'close' }]),
            ],
        },
    ];
    const menu = electron_1.Menu.buildFromTemplate(template);
    electron_1.Menu.setApplicationMenu(menu);
}
// IPC Handlers
electron_1.ipcMain.handle('mail:test-account', async (_, account) => {
    if (account.imapConfig && account.imapConfig.host) {
        return imapService_1.imapService.testConnection({
            host: account.imapConfig.host,
            port: account.imapConfig.port || 993,
            secure: account.imapConfig.secure ?? true,
            user: account.imapConfig.user || account.email,
            pass: account.imapConfig.pass || '',
        });
    }
    return { success: true };
});
electron_1.ipcMain.handle('mail:sync-account', async (_, account) => {
    if (!account || !account.imapConfig || !account.imapConfig.host) {
        return { success: true, newMessages: [] };
    }
    const result = await imapService_1.imapService.fetchRecentMessages(account, 'INBOX', 50);
    return {
        success: result.success,
        newMessages: result.messages,
        error: result.error,
    };
});
electron_1.ipcMain.handle('mail:send-email', async (_, draft) => {
    const smtpConfig = draft.smtpConfig || (draft.account && draft.account.smtpConfig);
    if (smtpConfig && smtpConfig.host) {
        return smtpService_1.smtpService.sendEmail({
            host: smtpConfig.host,
            port: smtpConfig.port || 465,
            secure: smtpConfig.secure ?? (smtpConfig.port === 465),
            user: smtpConfig.user || draft.from,
            pass: smtpConfig.pass || '',
            from: draft.from,
            to: draft.to,
            cc: draft.cc,
            bcc: draft.bcc,
            subject: draft.subject,
            text: draft.bodyText,
            html: draft.bodyHtml,
        });
    }
    return { success: true, messageId: `msg_${Date.now()}` };
});
electron_1.ipcMain.handle('app:set-badge-count', (_, count) => {
    if (process.platform === 'darwin' && electron_1.app.dock) {
        electron_1.app.dock.setBadge(count > 0 ? String(count) : '');
    }
});
electron_1.ipcMain.handle('app:show-notification', (_, { title, body }) => {
    if (electron_1.Notification.isSupported()) {
        new electron_1.Notification({ title, body }).show();
    }
});
electron_1.ipcMain.handle('window:minimize', () => {
    mainWindow?.minimize();
});
electron_1.ipcMain.handle('window:maximize', () => {
    if (mainWindow?.isMaximized()) {
        mainWindow.unmaximize();
    }
    else {
        mainWindow?.maximize();
    }
});
electron_1.ipcMain.handle('window:close', () => {
    mainWindow?.close();
});
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
