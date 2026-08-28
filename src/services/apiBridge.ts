import { Account, EmailMessage } from '../types/mail';

declare global {
  interface Window {
    electronAPI?: {
      testAccountConnection: (account: Partial<Account>) => Promise<{ success: boolean; error?: string }>;
      syncAccount: (account: Account) => Promise<{ success: boolean; newMessages?: EmailMessage[]; error?: string }>;
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

    try {
      const res = await fetch('/api/mail/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account }),
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to connect to local mail service.' };
    }
  },

  async syncAccount(account: Account): Promise<{ success: boolean; newMessages?: EmailMessage[]; error?: string }> {
    if (window.electronAPI?.syncAccount) {
      return window.electronAPI.syncAccount(account);
    }

    try {
      const res = await fetch('/api/mail/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account }),
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      return { success: false, newMessages: [], error: err.message || 'Failed to sync with mail service.' };
    }
  },

  async sendEmail(draft: any): Promise<{ success: boolean; error?: string; messageId?: string }> {
    if (window.electronAPI?.sendEmail) {
      return window.electronAPI.sendEmail(draft);
    }

    try {
      const res = await fetch('/api/mail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft }),
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send message via mail service.' };
    }
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
  },
};
