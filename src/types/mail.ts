export type AccountProvider = 'gmail' | 'outlook' | 'icloud' | 'yahoo' | 'fastmail' | 'custom' | 'demo';

export interface ImapConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
}

export interface Account {
  id: string;
  name: string;
  email: string;
  provider: AccountProvider;
  color: string; // Hex color or badge color code
  badgeColor: string;
  imapConfig?: ImapConfig;
  smtpConfig?: SmtpConfig;
  isEnabled: boolean;
  unreadCount: number;
  lastSyncTime?: string;
  signature?: string;
  isDefault?: boolean;
}

export type FolderType = 'inbox' | 'sent' | 'drafts' | 'starred' | 'archive' | 'trash' | 'spam' | 'custom';

export interface Folder {
  id: string;
  name: string;
  type: FolderType;
  accountId: string;
  unreadCount: number;
  totalCount: number;
  icon?: string;
}

export interface EmailContact {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Attachment {
  id: string;
  filename: string;
  size: number; // in bytes
  contentType: string;
  url?: string;
  dataBase64?: string;
  isInline?: boolean;
  contentId?: string;
}

export type EmailCategory = 'primary' | 'updates' | 'receipts' | 'newsletters';

export interface EmailMessage {
  id: string;
  threadId: string;
  accountId: string;
  folderType: FolderType;
  from: EmailContact;
  to: EmailContact[];
  cc?: EmailContact[];
  bcc?: EmailContact[];
  replyTo?: EmailContact;
  subject: string;
  snippet: string;
  bodyText: string;
  bodyHtml: string;
  date: string; // ISO 8601 string
  isRead: boolean;
  isStarred: boolean;
  isPinned?: boolean;
  hasAttachments: boolean;
  attachments: Attachment[];
  labels: string[];
  category?: EmailCategory;
  priority?: 'high' | 'normal' | 'low';
  accountName?: string;
}

export interface EmailThread {
  id: string;
  accountId: string;
  accountName: string;
  accountColor: string;
  subject: string;
  lastMessageDate: string;
  messageCount: number;
  messages: EmailMessage[];
  participants: EmailContact[];
  isRead: boolean;
  isStarred: boolean;
  isPinned?: boolean;
  hasAttachments: boolean;
  labels: string[];
  snippet: string;
  folderType: FolderType;
  category?: EmailCategory;
}

export type ViewScope = 'all' | 'account' | 'category' | 'label';

export interface NavigationState {
  scope: ViewScope;
  folderType: FolderType;
  accountId?: string; // If scope === 'account', which account
  category?: EmailCategory;
  label?: string;
  title: string;
}

export interface SearchFilter {
  query: string;
  accountId?: string | 'all';
  folderType?: FolderType | 'all';
  hasAttachment?: boolean;
  isUnread?: boolean;
  isStarred?: boolean;
  from?: string;
  to?: string;
  category?: EmailCategory | 'all';
  dateRange?: 'all' | 'today' | 'week' | 'month' | 'year';
}

export interface ComposeState {
  isOpen: boolean;
  isMinimized?: boolean;
  mode: 'new' | 'reply' | 'reply-all' | 'forward';
  replyToMessage?: EmailMessage;
  threadId?: string;
  initialAccountId?: string;
  draft: {
    accountId: string;
    to: string[];
    cc: string[];
    bcc: string[];
    subject: string;
    bodyHtml: string;
    attachments: Attachment[];
  };
}

export interface ToastNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
}
