import React from 'react';
import { EmailThread } from '../../types/mail';
import { useMail } from '../../context/MailContext';
import { AccountBadge } from '../Common/AccountBadge';
import { Star, Archive, Trash2, Mail, MailOpen, Paperclip } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';

interface MessageItemProps {
  thread: EmailThread;
  isSelected: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({ thread, isSelected }) => {
  const {
    selectThread,
    toggleStarThread,
    archiveThread,
    trashThread,
    markThreadRead,
    selectedMessageIds,
    setSelectedMessageIds,
    accounts,
  } = useMail();

  const isChecked = selectedMessageIds.has(thread.id);
  const account = accounts.find(a => a.id === thread.accountId) || {
    name: thread.accountName,
    color: thread.accountColor,
  };

  const formatThreadDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isToday(date)) return format(date, 'h:mm a');
      if (isYesterday(date)) return 'Yesterday';
      return format(date, 'MMM d');
    } catch {
      return '';
    }
  };

  const handleCheckboxToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMessageIds(prev => {
      const next = new Set(prev);
      if (next.has(thread.id)) next.delete(thread.id);
      else next.add(thread.id);
      return next;
    });
  };

  const handleStarToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleStarThread(thread.id);
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    archiveThread(thread.id);
  };

  const handleTrash = (e: React.MouseEvent) => {
    e.stopPropagation();
    trashThread(thread.id);
  };

  const handleToggleRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markThreadRead(thread.id, !thread.isRead);
  };

  const sender = thread.participants[0] || { name: 'Unknown', email: '' };
  const lastMsg = thread.messages[thread.messages.length - 1];

  return (
    <div
      onClick={() => selectThread(thread.id)}
      className={`group relative flex flex-col px-4 py-3 border-b border-[#f0f2f5] dark:border-[#28292a] transition-all cursor-pointer select-none text-xs ${
        isSelected
          ? 'bg-[#c2e7ff]/40 dark:bg-[#004a77]/35 border-l-4 border-l-[#0b57d0] dark:border-l-[#a8c7fa]'
          : thread.isRead
          ? 'bg-white dark:bg-[#131314] hover:bg-[#f6f8fc] dark:hover:bg-[#1e1f20]'
          : 'bg-[#f2f6fc] dark:bg-[#1a2230] hover:bg-[#eaf1fb] dark:hover:bg-[#1f2838]'
      }`}
    >
      {/* ROW 1: Checkbox + Star + Sender Name + Date / Hover Action Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <input
            type="checkbox"
            checked={isChecked}
            onClick={handleCheckboxToggle}
            onChange={() => {}}
            className="rounded text-[#0b57d0] cursor-pointer shrink-0"
          />

          <button
            onClick={handleStarToggle}
            className={`p-0.5 rounded cursor-pointer transition-colors shrink-0 ${
              thread.isStarred
                ? 'text-[#fbbc04] fill-[#fbbc04]'
                : 'text-[#c4c7c5] hover:text-[#444746]'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${thread.isStarred ? 'fill-current' : ''}`} />
          </button>

          <span
            className={`truncate text-xs ${
              !thread.isRead
                ? 'font-bold text-[#1f1f1f] dark:text-[#e3e3e3]'
                : 'font-medium text-[#444746] dark:text-[#c4c7c5]'
            }`}
          >
            {sender.name || sender.email}
          </span>

          {thread.messageCount > 1 && (
            <span className="text-[11px] text-[#747775] dark:text-[#8e918f] font-normal shrink-0">
              ({thread.messageCount})
            </span>
          )}
        </div>

        {/* Date & Hover Actions on Right */}
        <div className="relative shrink-0 flex items-center justify-end min-w-[70px]">
          {/* Default Date Text */}
          <time
            className={`group-hover:hidden text-[11px] text-right ${
              !thread.isRead
                ? 'font-bold text-[#1f1f1f] dark:text-[#e3e3e3]'
                : 'text-[#747775] dark:text-[#8e918f]'
            }`}
          >
            {formatThreadDate(thread.lastMessageDate)}
          </time>

          {/* Hover Actions Bar */}
          <div className="hidden group-hover:flex items-center gap-1 bg-white/90 dark:bg-[#1e1f20]/90 backdrop-blur-xs pl-1.5 rounded-lg">
            <button
              onClick={handleArchive}
              className="p-1 text-[#444746] dark:text-[#c4c7c5] hover:text-[#1f1f1f] dark:hover:text-white hover:bg-[#e0e2e6] dark:hover:bg-[#333538] rounded transition-colors cursor-pointer"
              title="Archive"
            >
              <Archive className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleTrash}
              className="p-1 text-[#444746] dark:text-[#c4c7c5] hover:text-[#ea4335] hover:bg-[#fce8e6] dark:hover:bg-[#3b2020] rounded transition-colors cursor-pointer"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleToggleRead}
              className="p-1 text-[#444746] dark:text-[#c4c7c5] hover:text-[#1f1f1f] dark:hover:text-white hover:bg-[#e0e2e6] dark:hover:bg-[#333538] rounded transition-colors cursor-pointer"
              title={thread.isRead ? 'Mark unread' : 'Mark read'}
            >
              {thread.isRead ? <Mail className="w-3.5 h-3.5" /> : <MailOpen className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ROW 2: Subject Line + Account Badge */}
      <div className="flex items-center justify-between gap-2 mt-1 pl-6">
        <span
          className={`truncate text-xs flex-1 ${
            !thread.isRead
              ? 'font-bold text-[#1f1f1f] dark:text-[#e3e3e3]'
              : 'font-normal text-[#1f1f1f] dark:text-[#c4c7c5]'
          }`}
        >
          {thread.subject || '(no subject)'}
        </span>

        <AccountBadge account={account} size="xs" />
      </div>

      {/* ROW 3: Snippet Preview */}
      <p className="text-[11px] text-[#5e5e5e] dark:text-[#8e918f] line-clamp-1 mt-0.5 pl-6 font-normal">
        {thread.snippet}
      </p>

      {/* ROW 4: Attachment Pills (Placed neatly below, NEVER overlapping date) */}
      {thread.hasAttachments && lastMsg?.attachments && lastMsg.attachments.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mt-1.5 pl-6">
          {lastMsg.attachments.slice(0, 2).map(att => (
            <span
              key={att.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#f0f4f9] dark:bg-[#282a2c] text-[#444746] dark:text-[#c4c7c5] rounded-md text-[10px] font-medium border border-[#e0e3e7] dark:border-[#444746] max-w-[150px] truncate"
            >
              <Paperclip className="w-2.5 h-2.5 text-[#0b57d0] dark:text-[#a8c7fa] shrink-0" />
              <span className="truncate">{att.filename}</span>
            </span>
          ))}
          {lastMsg.attachments.length > 2 && (
            <span className="text-[10px] text-[#747775] font-medium">
              +{lastMsg.attachments.length - 2} more
            </span>
          )}
        </div>
      )}
    </div>
  );
};
