import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Account,
  EmailMessage,
  EmailThread,
  FolderType,
  NavigationState,
  SearchFilter,
  ComposeState,
  ToastNotification,
  EmailCategory,
} from '../types/mail';
import { INITIAL_ACCOUNTS, INITIAL_MESSAGES, buildThreadsFromMessages } from '../data/mockData';
import { storageService, AppSettings, DEFAULT_SETTINGS } from '../services/storage';
import { globalSearchEngine } from '../services/searchEngine';
import { apiBridge } from '../services/apiBridge';

interface MailContextType {
  accounts: Account[];
  activeAccount: Account | null; // null => All Accounts / All Inboxes
  messages: EmailMessage[];
  threads: EmailThread[];
  filteredThreads: EmailThread[];
  selectedThreadId: string | null;
  selectedThread: EmailThread | null;
  selectedMessageIds: Set<string>;
  setSelectedMessageIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  navigation: NavigationState;
  setNavigation: (nav: NavigationState) => void;
  searchFilter: SearchFilter;
  setSearchFilter: (filter: Partial<SearchFilter> | ((prev: SearchFilter) => SearchFilter)) => void;
  clearSearch: () => void;
  isSearching: boolean;
  searchResultsCount: number;

  // Actions
  selectThread: (threadId: string | null) => void;
  markThreadRead: (threadId: string, isRead?: boolean) => void;
  toggleStarThread: (threadId: string) => void;
  archiveThread: (threadId: string) => void;
  trashThread: (threadId: string) => void;
  moveThreadToFolder: (threadId: string, targetFolder: FolderType) => void;

  // Batch
  batchArchive: () => void;
  batchTrash: () => void;
  batchMarkRead: (isRead: boolean) => void;
  batchStar: (isStarred: boolean) => void;
  selectAllInCurrentView: () => void;
  clearSelection: () => void;

  // Compose
  composeState: ComposeState;
  openCompose: (mode?: 'new' | 'reply' | 'reply-all' | 'forward', targetMessage?: EmailMessage) => void;
  updateDraft: (draftUpdates: Partial<ComposeState['draft']>) => void;
  closeCompose: () => void;
  sendEmail: () => Promise<boolean>;

  // Account Management
  addAccount: (accountData: Omit<Account, 'id' | 'unreadCount'>) => Account;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  removeAccount: (id: string) => void;
  syncAllAccounts: () => Promise<void>;
  isSyncing: boolean;

  // Modals & UI
  isAddAccountOpen: boolean;
  setIsAddAccountOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;

  // Toasts
  toasts: ToastNotification[];
  showToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;

  // Computed Counters
  unreadCounts: {
    totalInbox: number;
    totalStarred: number;
    byAccount: Record<string, { inbox: number; starred: number; total: number }>;
  };
}

const MailContext = createContext<MailContextType | null>(null);

export const MailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>(() => storageService.loadAccounts());
  const [messages, setMessages] = useState<EmailMessage[]>(() => storageService.loadMessages());
  const [settings, setSettings] = useState<AppSettings>(() => storageService.loadSettings());

  const [navigation, setNavigation] = useState<NavigationState>({
    scope: 'all',
    folderType: 'inbox',
    title: 'All Inboxes',
  });

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [selectedMessageIds, setSelectedMessageIds] = useState<Set<string>>(new Set());

  const [searchFilter, setSearchFilterState] = useState<SearchFilter>({
    query: '',
    accountId: 'all',
    folderType: 'all',
    hasAttachment: undefined,
    isUnread: undefined,
    isStarred: undefined,
    dateRange: 'all',
    category: 'all',
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Compose state
  const [composeState, setComposeState] = useState<ComposeState>({
    isOpen: false,
    mode: 'new',
    draft: {
      accountId: accounts[0]?.id || 'acc_work',
      to: [],
      cc: [],
      bcc: [],
      subject: '',
      bodyHtml: '',
      attachments: [],
    },
  });

  // Save to persistent storage on changes
  useEffect(() => {
    storageService.saveAccounts(accounts);
  }, [accounts]);

  useEffect(() => {
    storageService.saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    storageService.saveSettings(settings);
  }, [settings]);

  // Sync Search Engine index
  useEffect(() => {
    const accountMap = new Map<string, string>();
    accounts.forEach(a => accountMap.set(a.id, a.name));
    globalSearchEngine.indexAll(messages, accountMap);
  }, [messages, accounts]);

  // Sync Dock Badge Count
  const totalUnread = useMemo(() => {
    return messages.filter(m => m.folderType === 'inbox' && !m.isRead).length;
  }, [messages]);

  useEffect(() => {
    apiBridge.setBadgeCount(totalUnread);
  }, [totalUnread]);

  // Compute threads
  const threads = useMemo(() => {
    return buildThreadsFromMessages(messages, accounts);
  }, [messages, accounts]);

  // Active account from navigation
  const activeAccount = useMemo(() => {
    if (navigation.scope === 'account' && navigation.accountId) {
      return accounts.find(a => a.id === navigation.accountId) || null;
    }
    return null;
  }, [navigation, accounts]);

  // Unread counts breakdown
  const unreadCounts = useMemo(() => {
    const byAccount: Record<string, { inbox: number; starred: number; total: number }> = {};
    let totalInbox = 0;
    let totalStarred = 0;

    accounts.forEach(acc => {
      byAccount[acc.id] = { inbox: 0, starred: 0, total: 0 };
    });

    messages.forEach(msg => {
      const acc = byAccount[msg.accountId];
      if (acc) {
        acc.total++;
        if (!msg.isRead && msg.folderType === 'inbox') {
          acc.inbox++;
          totalInbox++;
        }
        if (msg.isStarred) {
          acc.starred++;
        }
      }
      if (msg.isStarred) {
        totalStarred++;
      }
    });

    return { totalInbox, totalStarred, byAccount };
  }, [messages, accounts]);

  // Global search & filtering logic
  const isSearching = useMemo(() => {
    return Boolean(
      searchFilter.query.trim() ||
      searchFilter.hasAttachment !== undefined ||
      searchFilter.isUnread !== undefined ||
      searchFilter.isStarred !== undefined ||
      (searchFilter.accountId && searchFilter.accountId !== 'all') ||
      (searchFilter.category && searchFilter.category !== 'all') ||
      (searchFilter.dateRange && searchFilter.dateRange !== 'all')
    );
  }, [searchFilter]);

  const searchResults = useMemo(() => {
    if (!isSearching) return null;
    return globalSearchEngine.search(searchFilter);
  }, [isSearching, searchFilter]);

  const searchResultsCount = searchResults?.matchedCount || 0;

  // Filtered threads for current view
  const filteredThreads = useMemo(() => {
    let result = threads;

    if (isSearching && searchResults) {
      // Filter threads that have at least one message matching the search
      result = result.filter(th => {
        return th.messages.some((m: EmailMessage) => searchResults.messageIds.has(m.id));
      });
      return result;
    }

    // Regular navigation filters
    if (navigation.scope === 'all') {
      if (navigation.folderType === 'starred') {
        result = result.filter(t => t.isStarred);
      } else {
        result = result.filter(t => t.folderType === navigation.folderType);
      }
    } else if (navigation.scope === 'account' && navigation.accountId) {
      result = result.filter(t => t.accountId === navigation.accountId);
      if (navigation.folderType === 'starred') {
        result = result.filter(t => t.isStarred);
      } else {
        result = result.filter(t => t.folderType === navigation.folderType);
      }
    } else if (navigation.scope === 'category' && navigation.category) {
      result = result.filter(t => t.category === navigation.category && t.folderType !== 'trash');
    } else if (navigation.scope === 'label' && navigation.label) {
      result = result.filter(t => t.labels.includes(navigation.label!) && t.folderType !== 'trash');
    }

    return result;
  }, [threads, isSearching, searchResults, navigation]);

  // Selected thread object
  const selectedThread = useMemo(() => {
    if (!selectedThreadId) return null;
    return threads.find(t => t.id === selectedThreadId) || null;
  }, [threads, selectedThreadId]);

  // Auto-select first thread if nothing selected or current selected thread is no longer visible
  useEffect(() => {
    if (filteredThreads.length > 0) {
      if (!selectedThreadId || !filteredThreads.some(t => t.id === selectedThreadId)) {
        setSelectedThreadId(filteredThreads[0].id);
      }
    } else {
      setSelectedThreadId(null);
    }
  }, [filteredThreads, selectedThreadId]);

  // Toast helper
  const showToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const newToast: ToastNotification = { id, duration: 5000, ...toast };
    setToasts(prev => [newToast, ...prev].slice(0, 5));

    if (newToast.duration) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, newToast.duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Search filter setters
  const setSearchFilter = useCallback((updater: Partial<SearchFilter> | ((prev: SearchFilter) => SearchFilter)) => {
    setSearchFilterState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return next;
    });
  }, []);

  const clearSearch = useCallback(() => {
    setSearchFilterState({
      query: '',
      accountId: 'all',
      folderType: 'all',
      hasAttachment: undefined,
      isUnread: undefined,
      isStarred: undefined,
      dateRange: 'all',
      category: 'all',
    });
  }, []);

  // Thread actions
  const selectThread = useCallback((threadId: string | null) => {
    setSelectedThreadId(threadId);
    if (threadId) {
      // Automatically mark as read when selecting
      setMessages(prev =>
        prev.map(m => (m.threadId === threadId && !m.isRead ? { ...m, isRead: true } : m))
      );
    }
  }, []);

  const markThreadRead = useCallback((threadId: string, isRead: boolean = true) => {
    setMessages(prev =>
      prev.map(m => (m.threadId === threadId ? { ...m, isRead } : m))
    );
  }, []);

  const toggleStarThread = useCallback((threadId: string) => {
    setMessages(prev => {
      const targetThread = prev.filter(m => m.threadId === threadId);
      const willStar = !targetThread.some(m => m.isStarred);
      return prev.map(m => (m.threadId === threadId ? { ...m, isStarred: willStar } : m));
    });
  }, []);

  const archiveThread = useCallback((threadId: string) => {
    const previousMessages = [...messages];
    setMessages(prev =>
      prev.map(m => (m.threadId === threadId ? { ...m, folderType: 'archive' } : m))
    );

    showToast({
      type: 'info',
      title: 'Conversation archived',
      actionLabel: 'Undo',
      onAction: () => {
        setMessages(previousMessages);
      },
    });
  }, [messages, showToast]);

  const trashThread = useCallback((threadId: string) => {
    const previousMessages = [...messages];
    setMessages(prev =>
      prev.map(m => (m.threadId === threadId ? { ...m, folderType: 'trash' } : m))
    );

    showToast({
      type: 'warning',
      title: 'Moved to Trash',
      actionLabel: 'Undo',
      onAction: () => {
        setMessages(previousMessages);
      },
    });
  }, [messages, showToast]);

  const moveThreadToFolder = useCallback((threadId: string, targetFolder: FolderType) => {
    setMessages(prev =>
      prev.map(m => (m.threadId === threadId ? { ...m, folderType: targetFolder } : m))
    );
    showToast({
      type: 'success',
      title: `Moved to ${targetFolder.charAt(0).toUpperCase() + targetFolder.slice(1)}`,
    });
  }, [showToast]);

  // Batch actions
  const selectAllInCurrentView = useCallback(() => {
    const allIds = new Set(filteredThreads.map(t => t.id));
    setSelectedMessageIds(allIds);
  }, [filteredThreads]);

  const clearSelection = useCallback(() => {
    setSelectedMessageIds(new Set());
  }, []);

  const batchArchive = useCallback(() => {
    if (selectedMessageIds.size === 0) return;
    const previousMessages = [...messages];
    const ids = new Set(selectedMessageIds);
    setMessages(prev =>
      prev.map(m => (ids.has(m.threadId) ? { ...m, folderType: 'archive' } : m))
    );
    showToast({
      type: 'info',
      title: `Archived ${ids.size} conversation${ids.size > 1 ? 's' : ''}`,
      actionLabel: 'Undo',
      onAction: () => setMessages(previousMessages),
    });
    clearSelection();
  }, [selectedMessageIds, messages, showToast, clearSelection]);

  const batchTrash = useCallback(() => {
    if (selectedMessageIds.size === 0) return;
    const previousMessages = [...messages];
    const ids = new Set(selectedMessageIds);
    setMessages(prev =>
      prev.map(m => (ids.has(m.threadId) ? { ...m, folderType: 'trash' } : m))
    );
    showToast({
      type: 'warning',
      title: `Moved ${ids.size} conversation${ids.size > 1 ? 's' : ''} to Trash`,
      actionLabel: 'Undo',
      onAction: () => setMessages(previousMessages),
    });
    clearSelection();
  }, [selectedMessageIds, messages, showToast, clearSelection]);

  const batchMarkRead = useCallback((isRead: boolean) => {
    if (selectedMessageIds.size === 0) return;
    const ids = new Set(selectedMessageIds);
    setMessages(prev =>
      prev.map(m => (ids.has(m.threadId) ? { ...m, isRead } : m))
    );
    clearSelection();
  }, [selectedMessageIds, clearSelection]);

  const batchStar = useCallback((isStarred: boolean) => {
    if (selectedMessageIds.size === 0) return;
    const ids = new Set(selectedMessageIds);
    setMessages(prev =>
      prev.map(m => (ids.has(m.threadId) ? { ...m, isStarred } : m))
    );
    clearSelection();
  }, [selectedMessageIds, clearSelection]);

  // Compose modal helpers
  const openCompose = useCallback((mode: 'new' | 'reply' | 'reply-all' | 'forward' = 'new', targetMessage?: EmailMessage) => {
    const defaultAccId = activeAccount ? activeAccount.id : (accounts[0]?.id || 'acc_work');
    const selectedAcc = accounts.find(a => a.id === defaultAccId) || accounts[0];

    if (mode === 'new' || !targetMessage) {
      setComposeState({
        isOpen: true,
        mode: 'new',
        draft: {
          accountId: defaultAccId,
          to: [],
          cc: [],
          bcc: [],
          subject: '',
          bodyHtml: selectedAcc?.signature ? `<br/><br/>--<br/>${selectedAcc.signature.replace(/\n/g, '<br/>')}` : '',
          attachments: [],
        },
      });
      return;
    }

    const replySubject = targetMessage.subject.startsWith('Re:') ? targetMessage.subject : `Re: ${targetMessage.subject}`;
    const fwdSubject = targetMessage.subject.startsWith('Fwd:') ? targetMessage.subject : `Fwd: ${targetMessage.subject}`;

    const quoteHeader = `<br/><br/>On ${new Date(targetMessage.date).toLocaleString()}, ${targetMessage.from.name} &lt;${targetMessage.from.email}&gt; wrote:<br/><blockquote style="border-left: 2px solid #cbd5e1; padding-left: 12px; margin-left: 0; color: #475569;">${targetMessage.bodyHtml || targetMessage.bodyText}</blockquote>`;

    if (mode === 'reply') {
      setComposeState({
        isOpen: true,
        mode: 'reply',
        replyToMessage: targetMessage,
        threadId: targetMessage.threadId,
        draft: {
          accountId: targetMessage.accountId,
          to: [targetMessage.from.email],
          cc: [],
          bcc: [],
          subject: replySubject,
          bodyHtml: quoteHeader,
          attachments: [],
        },
      });
    } else if (mode === 'reply-all') {
      const allTo = [targetMessage.from.email, ...(targetMessage.to || []).map(t => t.email)].filter(
        e => e !== selectedAcc?.email
      );
      const allCc = (targetMessage.cc || []).map(c => c.email).filter(e => e !== selectedAcc?.email);

      setComposeState({
        isOpen: true,
        mode: 'reply-all',
        replyToMessage: targetMessage,
        threadId: targetMessage.threadId,
        draft: {
          accountId: targetMessage.accountId,
          to: Array.from(new Set(allTo)),
          cc: Array.from(new Set(allCc)),
          bcc: [],
          subject: replySubject,
          bodyHtml: quoteHeader,
          attachments: [],
        },
      });
    } else if (mode === 'forward') {
      setComposeState({
        isOpen: true,
        mode: 'forward',
        replyToMessage: targetMessage,
        draft: {
          accountId: targetMessage.accountId,
          to: [],
          cc: [],
          bcc: [],
          subject: fwdSubject,
          bodyHtml: `<br/><br/>---------- Forwarded message ---------<br/>From: ${targetMessage.from.name} &lt;${targetMessage.from.email}&gt;<br/>Date: ${new Date(targetMessage.date).toLocaleString()}<br/>Subject: ${targetMessage.subject}<br/>To: ${targetMessage.to.map(t => t.email).join(', ')}<br/><br/>${targetMessage.bodyHtml || targetMessage.bodyText}`,
          attachments: [...targetMessage.attachments],
        },
      });
    }
  }, [accounts, activeAccount]);

  const updateDraft = useCallback((draftUpdates: Partial<ComposeState['draft']>) => {
    setComposeState(prev => ({
      ...prev,
      draft: {
        ...prev.draft,
        ...draftUpdates,
      },
    }));
  }, []);

  const closeCompose = useCallback(() => {
    setComposeState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const sendEmail = useCallback(async (): Promise<boolean> => {
    const { draft, mode, threadId, replyToMessage } = composeState;
    if (draft.to.length === 0) {
      showToast({ type: 'error', title: 'Please specify at least one recipient' });
      return false;
    }

    const senderAccount = accounts.find(a => a.id === draft.accountId) || accounts[0];
    const newMsgId = `msg_${Date.now()}`;
    const newThreadId = threadId || `th_${Date.now()}`;

    const newSentMessage: EmailMessage = {
      id: newMsgId,
      threadId: newThreadId,
      accountId: senderAccount.id,
      folderType: 'sent',
      from: { name: senderAccount.name, email: senderAccount.email },
      to: draft.to.map(e => ({ name: e.split('@')[0], email: e })),
      cc: draft.cc.map(e => ({ name: e.split('@')[0], email: e })),
      bcc: draft.bcc.map(e => ({ name: e.split('@')[0], email: e })),
      subject: draft.subject || '(No Subject)',
      snippet: draft.bodyHtml.replace(/<[^>]*>?/gm, '').slice(0, 140),
      bodyText: draft.bodyHtml.replace(/<[^>]*>?/gm, ''),
      bodyHtml: draft.bodyHtml,
      date: new Date().toISOString(),
      isRead: true,
      isStarred: false,
      hasAttachments: draft.attachments.length > 0,
      attachments: draft.attachments,
      labels: ['Sent'],
      category: 'primary',
    };

    setMessages(prev => [newSentMessage, ...prev]);
    closeCompose();

    showToast({
      type: 'success',
      title: 'Message sent',
      message: `Sent from ${senderAccount.name} (${senderAccount.email})`,
    });

    // Invoke API bridge to send via SMTP if configured
    apiBridge.sendEmail({
      ...draft,
      from: senderAccount.email,
      smtpConfig: senderAccount.smtpConfig,
      account: senderAccount,
    });

    return true;
  }, [composeState, accounts, closeCompose, showToast]);

  // Account Management
  const addAccount = useCallback((accountData: Omit<Account, 'id' | 'unreadCount'>): Account => {
    const newId = `acc_${Date.now()}`;
    const newAccount: Account = {
      ...accountData,
      id: newId,
      unreadCount: 0,
      lastSyncTime: new Date().toISOString(),
    };

    setAccounts(prev => [...prev, newAccount]);

    showToast({
      type: 'success',
      title: 'Account Added',
      message: `Connected ${newAccount.name} (${newAccount.email})`,
    });

    // Trigger immediate IMAP sync in background
    apiBridge.syncAccount(newAccount).then(res => {
      if (res.success && res.newMessages && res.newMessages.length > 0) {
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const newToAdd = res.newMessages!.filter(m => !existingIds.has(m.id));
          return [...newToAdd, ...prev];
        });
      } else if (!res.success && res.error) {
        showToast({
          type: 'warning',
          title: `IMAP Sync Notice`,
          message: `${newAccount.name}: ${res.error}`,
        });
      }
    });

    return newAccount;
  }, [showToast]);

  const updateAccount = useCallback((id: string, updates: Partial<Account>) => {
    setAccounts(prev => prev.map(a => (a.id === id ? { ...a, ...updates } : a)));
    showToast({ type: 'info', title: 'Account updated' });
  }, [showToast]);

  const removeAccount = useCallback((id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    setMessages(prev => prev.filter(m => m.accountId !== id));
    showToast({ type: 'warning', title: 'Account removed' });
  }, [showToast]);

  const syncAllAccounts = useCallback(async () => {
    setIsSyncing(true);
    try {
      let totalNewFetched = 0;
      const errors: string[] = [];

      for (const acc of accounts) {
        const res = await apiBridge.syncAccount(acc);
        if (res.success && res.newMessages && res.newMessages.length > 0) {
          setMessages(prev => {
            const existingIds = new Set(prev.map(m => m.id));
            const newToAdd = res.newMessages!.filter(m => !existingIds.has(m.id));
            totalNewFetched += newToAdd.length;
            return [...newToAdd, ...prev];
          });
        } else if (!res.success && res.error) {
          errors.push(`${acc.name}: ${res.error}`);
        }
      }

      setAccounts(prev =>
        prev.map(a => ({ ...a, lastSyncTime: new Date().toISOString() }))
      );

      if (errors.length > 0) {
        showToast({
          type: 'warning',
          title: 'Sync completed with warnings',
          message: errors.join('; '),
        });
      } else {
        showToast({
          type: 'info',
          title: 'All Inboxes Synced',
          message: totalNewFetched > 0
            ? `Fetched ${totalNewFetched} new message${totalNewFetched > 1 ? 's' : ''}`
            : `Mailboxes are up to date`,
        });
      }
    } catch (e: any) {
      showToast({ type: 'error', title: 'Sync failed', message: e?.message || '' });
    } finally {
      setIsSyncing(false);
    }
  }, [accounts, showToast]);

  // Initial auto-sync on launch
  useEffect(() => {
    if (apiBridge.isElectron()) {
      syncAllAccounts();
    }
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast({ type: 'info', title: 'Settings saved' });
  }, [showToast]);

  return (
    <MailContext.Provider
      value={{
        accounts,
        activeAccount,
        messages,
        threads,
        filteredThreads,
        selectedThreadId,
        selectedThread,
        selectedMessageIds,
        setSelectedMessageIds,
        navigation,
        setNavigation,
        searchFilter,
        setSearchFilter,
        clearSearch,
        isSearching,
        searchResultsCount,
        selectThread,
        markThreadRead,
        toggleStarThread,
        archiveThread,
        trashThread,
        moveThreadToFolder,
        batchArchive,
        batchTrash,
        batchMarkRead,
        batchStar,
        selectAllInCurrentView,
        clearSelection,
        composeState,
        openCompose,
        updateDraft,
        closeCompose,
        sendEmail,
        addAccount,
        updateAccount,
        removeAccount,
        syncAllAccounts,
        isSyncing,
        isAddAccountOpen,
        setIsAddAccountOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toasts,
        showToast,
        removeToast,
        settings,
        updateSettings,
        unreadCounts,
      }}
    >
      {children}
    </MailContext.Provider>
  );
};

export const useMail = () => {
  const context = useContext(MailContext);
  if (!context) {
    throw new Error('useMail must be used within a MailProvider');
  }
  return context;
};
