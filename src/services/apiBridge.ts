import { Account, EmailMessage } from '../types/mail';

declare global {
  interface Window {
    electronAPI?: {
      testAccountConnection: (account: Partial<Account>) => Promise<{ success: boolean; error?: string }>;
      syncAccount: (accountId: string) => Promise<{ success: boolean; newMessages?: EmailMessage[] }>;
      sendEmail: (draft: any) => Promise<{ success: boolean; error?: string; messageId?: string }>;
      showNotification: (title: string, body: string) => void;
      setBadgeCount: (count: number) => void;
      minimizeWindow: () => void;
      maximizeWindow: () => void;
      closeWindow: () => void;
      openExternalUrl: (url: string) => void;
    };
  }
}

export const apiBridge = {
  isElectron(): boolean {
    return typeof window !== 'undefined' && Boolean(window.electronAPI);
  },

  async testAccountConnection(account: Partial<Account>): Promise<{ success: boolean; error?: string }> {
    if (window.electronAPI?.testAccountConnection) {
      return window.electronAPI.testAccountConnection(account);
    }
    // Web / Simulated response
    await new Promise(r => setTimeout(r, 900));
    if (account.email && (account.email.includes('@') || account.provider === 'demo')) {
      return { success: true };
    }
    return { success: false, error: 'Invalid server configuration or authentication failed.' };
  },

  async syncAccount(accountId: string): Promise<{ success: boolean; newMessages?: EmailMessage[] }> {
    if (window.electronAPI?.syncAccount) {
      return window.electronAPI.syncAccount(accountId);
    }
    await new Promise(r => setTimeout(r, 600));
    return { success: true };
  },

  async sendEmail(draft: any): Promise<{ success: boolean; error?: string; messageId?: string }> {
    if (window.electronAPI?.sendEmail) {
      return window.electronAPI.sendEmail(draft);
    }
    await new Promise(r => setTimeout(r, 500));
    return { success: true, messageId: `msg_${Date.now()}` };
  },

  showNotification(title: string, body: string) {
    if (window.electronAPI?.showNotification) {
      window.electronAPI.showNotification(title, body);
    } else if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  },

  setBadgeCount(count: number) {
    if (window.electronAPI?.setBadgeCount) {
      window.electronAPI.setBadgeCount(count);
    }
  },

  minimizeWindow() {
    window.electronAPI?.minimizeWindow?.();
  },

  maximizeWindow() {
    window.electronAPI?.maximizeWindow?.();
  },

  closeWindow() {
    window.electronAPI?.closeWindow?.();
  },

  openExternalUrl(url: string) {
    if (window.electronAPI?.openExternalUrl) {
      window.electronAPI.openExternalUrl(url);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
};
