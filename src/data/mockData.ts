import { Account, EmailMessage, EmailThread } from '../types/mail';

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'acc_edem_gmail',
    name: 'Edem (Gmail)',
    email: 'edem.ketika.yinzer@gmail.com',
    provider: 'gmail',
    color: '#2563eb',
    badgeColor: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
    isEnabled: true,
    unreadCount: 0,
    imapConfig: {
      host: 'imap.gmail.com',
      port: 993,
      secure: true,
      user: 'edem.ketika.yinzer@gmail.com',
      pass: 'vumMig-wuvqug-6zawqo',
    },
    smtpConfig: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      user: 'edem.ketika.yinzer@gmail.com',
      pass: 'vumMig-wuvqug-6zawqo',
    },
    signature: 'Best regards,\nEdem\nedem.ketika.yinzer@gmail.com',
    isDefault: true,
  },
];

// ZERO mock messages — only real synced emails from IMAP
export const INITIAL_MESSAGES: EmailMessage[] = [];

export function buildThreadsFromMessages(messages: EmailMessage[], accounts: Account[]): EmailThread[] {
  const threadMap = new Map<string, EmailMessage[]>();
  const accountMap = new Map<string, Account>();
  accounts.forEach(acc => accountMap.set(acc.id, acc));

  messages.forEach(msg => {
    const list = threadMap.get(msg.threadId) || [];
    list.push(msg);
    threadMap.set(msg.threadId, list);
  });

  const threads: EmailThread[] = [];

  threadMap.forEach((msgs, threadId) => {
    msgs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const lastMsg = msgs[msgs.length - 1];
    const acc = accountMap.get(lastMsg.accountId) || accounts[0];

    const participants: { name: string; email: string; avatarUrl?: string }[] = [];
    const seenEmails = new Set<string>();

    msgs.forEach(m => {
      if (!seenEmails.has(m.from.email)) {
        seenEmails.add(m.from.email);
        participants.push(m.from);
      }
    });

    const isRead = msgs.every(m => m.isRead);
    const isStarred = msgs.some(m => m.isStarred);
    const hasAttachments = msgs.some(m => m.hasAttachments);
    const allLabels = Array.from(new Set(msgs.flatMap(m => m.labels)));

    threads.push({
      id: threadId,
      accountId: lastMsg.accountId,
      accountName: acc?.name || 'Account',
      accountColor: acc?.color || '#2563eb',
      subject: lastMsg.subject.replace(/^Re:\s*/i, ''),
      lastMessageDate: lastMsg.date,
      messageCount: msgs.length,
      messages: msgs,
      participants,
      isRead,
      isStarred,
      hasAttachments,
      labels: allLabels,
      snippet: lastMsg.snippet,
      folderType: lastMsg.folderType,
      category: lastMsg.category,
    });
  });

  return threads.sort((a, b) => new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime());
}
