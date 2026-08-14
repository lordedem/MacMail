import React from 'react';
import { EmailThread } from '../../types/mail';
import { useMail } from '../../context/MailContext';
import { Avatar } from '../Common/Avatar';
import { AccountBadge } from '../Common/AccountBadge';
import { Paperclip, Star, Archive, Trash2, Mail, MailOpen, Check } from 'lucide-react';
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
    settings,
  } = useMail();

  const isChecked = selectedMessageIds.has(thread.id);
  const account = accounts.find(a => a.id === thread.accountId) || {
    name: thread.accountName,
    color: thread.accountColor,
  };

  // Format date
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

  return (
    <div
      onClick={() => selectThread(thread.id)}
      className={`group relative flex flex-col px-3.5 py-3 border-b border-black/5 dark:border-white/5 transition-all cursor-pointer select-none ${
        isSelected
          ? 'bg-blue-500/12 dark:bg-blue-600/20 shadow-xs'
          : thread.isRead
          ? 'bg-white/60 dark:bg-[#191b22]/40 hover:bg-black/4 dark:hover:bg-white/4'
          : 'bg-white dark:bg-[#1e2029] hover:bg-blue-50/40 dark:hover:bg-blue-950/20'
      }`}
    >
      {/* Active Left Indicator Bar */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 dark:bg-blue-500 rounded-r" />
      )}

      {/* Top Row: Sender Info, Badges, Date */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2 min-w-0">
          {/* Unread indicator dot */}
          {!thread.isRead && (
            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 shadow-xs ring-2 ring-blue-400/20" />
          )}

          {/* Sender Avatar */}
          <Avatar
            name={sender.name}
            email={sender.email}
            avatarUrl={sender.avatarUrl}
            size="sm"
            className="w-5 h-5 text-[10px]"
          />

          {/* Sender Name */}
          <span
            className={`truncate text-xs ${
              !thread.isRead
                ? 'font-bold text-slate-900 dark:text-white'
                : 'font-medium text-slate-700 dark:text-slate-300'
            }`}
          >
            {sender.name || sender.email}
          </span>

          {thread.messageCount > 1 && (
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-black/5 dark:bg-white/10 px-1.5 py-0.2 rounded-md">
              {thread.messageCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Account Badge in list */}
          <AccountBadge account={account} size="xs" showName={true} />

          {/* Date */}
          <span
            className={`text-[11px] ${
              !thread.isRead
                ? 'font-semibold text-blue-600 dark:text-blue-400'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {formatThreadDate(thread.lastMessageDate)}
          </span>
        </div>
      </div>

      {/* Middle Row: Subject */}
      <div className="flex items-center justify-between gap-2 mt-0.5">
        <h4
          className={`text-xs truncate ${
            !thread.isRead
              ? 'font-bold text-slate-900 dark:text-slate-100'
              : 'font-medium text-slate-800 dark:text-slate-200'
          }`}
        >
          {thread.subject || '(No Subject)'}
        </h4>

        {/* Icons (Attachments & Star) */}
        <div className="flex items-center gap-1 shrink-0">
          {thread.hasAttachments && (
            <Paperclip className="w-3 h-3 text-slate-400 shrink-0" />
          )}

          <button
            onClick={handleStarToggle}
            className={`p-0.5 rounded transition-colors cursor-pointer ${
              thread.isStarred
                ? 'text-amber-500 fill-amber-500'
                : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${thread.isStarred ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Bottom Row: Snippet */}
      <p
        className={`text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug ${
          settings.snippetLines === 1
            ? 'truncate'
            : settings.snippetLines === 3
            ? 'line-clamp-3'
            : 'line-clamp-2'
        }`}
      >
        {thread.snippet}
      </p>

      {/* Floating Hover Action Toolbar */}
      <div className="absolute right-2 bottom-2 hidden group-hover:flex items-center gap-0.5 bg-white/95 dark:bg-[#252834]/95 backdrop-blur-md px-1 py-0.5 rounded-lg border border-black/10 dark:border-white/10 shadow-md">
        <button
          onClick={handleArchive}
          className="p-1 hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 rounded transition-colors cursor-pointer"
          title="Archive (e)"
        >
          <Archive className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleTrash}
          className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 rounded transition-colors cursor-pointer"
          title="Delete (#)"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleToggleRead}
          className="p-1 hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 rounded transition-colors cursor-pointer"
          title={thread.isRead ? 'Mark Unread (u)' : 'Mark Read (u)'}
        >
          {thread.isRead ? <Mail className="w-3.5 h-3.5" /> : <MailOpen className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
