import React from 'react';
import { EmailThread } from '../../types/mail';
import { useMail } from '../../context/MailContext';
import { AccountBadge } from '../Common/AccountBadge';
import { format, isToday, isYesterday } from 'date-fns';

interface MessageItemProps {
  thread: EmailThread;
  isSelected: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({ thread, isSelected }) => {
  const { selectThread, accounts } = useMail();

  const account = accounts.find(a => a.id === thread.accountId) || {
    name: thread.accountName,
    color: thread.accountColor,
  };

  const formatThreadDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isToday(date)) return format(date, 'h:mm a');
      if (isYesterday(date)) return 'Yesterday';
      return format(date, 'd MMM');
    } catch {
      return '';
    }
  };

  const sender = thread.participants[0] || { name: 'Unknown', email: '' };
  const lastMsg = thread.messages[thread.messages.length - 1];

  return (
    <div
      onClick={() => selectThread(thread.id)}
      className={`relative px-4 py-3 border-b border-[#f1f5f9] dark:border-[#1e2026] cursor-pointer select-none transition-all ${
        isSelected
          ? 'bg-[#dbeafe] dark:bg-[#1a2b48]'
          : 'bg-white dark:bg-[#121316] hover:bg-[#f8fafc] dark:hover:bg-[#18191f]'
      }`}
    >
      {/* Row 1: Sender Name + Unread Indicator + Date / Time */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {!thread.isRead && (
            <div className="w-2 h-2 rounded-full bg-[#2563eb] shrink-0" />
          )}

          <span
            className={`truncate text-[13px] ${
              !thread.isRead
                ? 'font-bold text-[#0f172a] dark:text-[#f8fafc]'
                : 'font-bold text-[#0f172a] dark:text-[#f1f5f9]'
            }`}
          >
            {sender.name || sender.email}
          </span>
        </div>

        <time
          className={`text-xs shrink-0 ${
            !thread.isRead && isToday(new Date(thread.lastMessageDate))
              ? 'text-[#2563eb] dark:text-[#60a5fa] font-bold'
              : 'text-[#64748b] dark:text-[#94a3b8] font-normal'
          }`}
        >
          {formatThreadDate(thread.lastMessageDate)}
        </time>
      </div>

      {/* Row 2: Subject Line */}
      <div className="mt-0.5">
        <p
          className={`text-[13px] truncate ${
            !thread.isRead
              ? 'font-bold text-[#0f172a] dark:text-[#f8fafc]'
              : 'font-semibold text-[#1e293b] dark:text-[#e2e8f0]'
          }`}
        >
          {thread.subject || '(no subject)'}
        </p>
      </div>

      {/* Row 3: Snippet + Account Badge */}
      <div className="flex items-center justify-between gap-2 mt-1">
        <p className="text-xs text-[#64748b] dark:text-[#94a3b8] truncate font-normal flex-1">
          {thread.snippet}
        </p>

        <AccountBadge account={account} size="xs" />
      </div>
    </div>
  );
};
