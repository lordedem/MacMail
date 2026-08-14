import { Account, EmailMessage, EmailThread } from '../types/mail';
import { INITIAL_ACCOUNTS, INITIAL_MESSAGES } from '../data/mockData';

const ACCOUNTS_STORAGE_KEY = 'macmail_accounts_v1';
const MESSAGES_STORAGE_KEY = 'macmail_messages_v1';
const SETTINGS_STORAGE_KEY = 'macmail_settings_v1';

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  snippetLines: number;
  soundEffects: boolean;
  notifications: boolean;
  confirmArchive: boolean;
  confirmDelete: boolean;
  defaultAccountId: string;
  syncIntervalMinutes: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  snippetLines: 2,
  soundEffects: true,
  notifications: true,
  confirmArchive: false,
  confirmDelete: false,
  defaultAccountId: 'acc_work',
  syncIntervalMinutes: 5,
};

export const storageService = {
  loadAccounts(): Account[] {
    try {
      const data = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error loading accounts from storage', e);
    }
    return INITIAL_ACCOUNTS;
  },

  saveAccounts(accounts: Account[]) {
    try {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error('Error saving accounts to storage', e);
    }
  },

  loadMessages(): EmailMessage[] {
    try {
      const data = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error loading messages from storage', e);
    }
    return INITIAL_MESSAGES;
  },

  saveMessages(messages: EmailMessage[]) {
    try {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving messages to storage', e);
    }
  },

  loadSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.error('Error loading settings from storage', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: AppSettings) {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings to storage', e);
    }
  },

  resetToDefault() {
    localStorage.removeItem(ACCOUNTS_STORAGE_KEY);
    localStorage.removeItem(MESSAGES_STORAGE_KEY);
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
  },
};
