import React from 'react';
import { useMail } from '../../context/MailContext';
import { FolderType } from '../../types/mail';

export const Sidebar: React.FC = () => {
  const {
    accounts,
    navigation,
    setNavigation,
    unreadCounts,
    openCompose,
    clearSearch,
    threads,
  } = useMail();

  // Counts calculations
  const draftsCount = threads.filter(t => t.folderType === 'drafts').length || 2;

  const handleSelectScope = (
    scope: 'all' | 'account',
    folderType: FolderType,
    accountId?: string,
    title?: string
  ) => {
    clearSearch();
    if (scope === 'all') {
      setNavigation({
        scope: 'all',
        folderType,
        title: title || (folderType === 'inbox' ? 'All inboxes' : folderType.charAt(0).toUpperCase() + folderType.slice(1)),
      });
    } else if (accountId) {
      const acc = accounts.find(a => a.id === accountId);
      setNavigation({
        scope: 'account',
        accountId,
        folderType,
        title: `${acc?.name || 'Account'} - ${folderType.charAt(0).toUpperCase() + folderType.slice(1)}`,
      });
    }
  };

  const isItemActive = (scope: 'all' | 'account', folderType: FolderType, accountId?: string) => {
    if (scope === 'all') {
      return navigation.scope === 'all' && navigation.folderType === folderType;
    }
    if (scope === 'account') {
      return navigation.scope === 'account' && navigation.accountId === accountId && navigation.folderType === folderType;
    }
    return false;
  };

  return (
    <aside className="w-56 md:w-60 h-full flex flex-col bg-[#fafafa] dark:bg-[#121316] border-r border-[#e5e7eb] dark:border-[#24262b] shrink-0 select-none p-3 font-sans transition-colors overflow-y-auto scrollbar-thin">
      {/* Top Compose Button */}
      <div className="mb-4">
        <button
          onClick={() => openCompose('new')}
          className="w-full py-2.5 px-3.5 bg-white dark:bg-[#1c1e24] hover:bg-[#f8fafc] dark:hover:bg-[#252830] border border-[#e2e8f0] dark:border-[#2e323b] rounded-xl shadow-2xs flex items-center gap-3 text-[13.5px] font-semibold text-[#0f172a] dark:text-[#f1f5f9] transition-all active:scale-[0.99] cursor-pointer"
        >
          <div className="w-5 h-5 rounded-md bg-[#ea4335] flex items-center justify-center text-white shrink-0 shadow-2xs">
            <svg
              className="w-3 h-3 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </div>
          <span>Compose</span>
        </button>
      </div>

      {/* SECTION 1: MAILBOXES */}
      <div className="space-y-0.5">
        <div className="px-3 pb-1 text-[11px] font-bold text-[#94a3b8] dark:text-[#64748b] tracking-wider uppercase">
          Mailboxes
        </div>

        {/* All Inboxes */}
        <button
          onClick={() => handleSelectScope('all', 'inbox', undefined, 'All inboxes')}
          className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-[13px] transition-colors cursor-pointer ${
            isItemActive('all', 'inbox')
              ? 'bg-[#dbeafe] text-[#1d4ed8] dark:bg-[#1e293b] dark:text-[#60a5fa] font-bold shadow-2xs'
              : 'text-[#334155] dark:text-[#cbd5e1] hover:bg-[#f1f5f9] dark:hover:bg-[#1c1e24] font-medium'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-2 h-2 rounded-full bg-[#2563eb] shrink-0" />
            <span className="truncate">All inboxes</span>
          </div>
          {unreadCounts.totalInbox > 0 && (
            <span
              className={`text-xs ${
                isItemActive('all', 'inbox')
                  ? 'font-bold text-[#1d4ed8] dark:text-[#60a5fa]'
                  : 'text-[#2563eb] dark:text-[#60a5fa] font-semibold'
              }`}
            >
              {unreadCounts.totalInbox}
            </span>
          )}
        </button>

        {/* Accounts List (Gmail, Work, iCloud) */}
        {accounts.map(acc => {
          const count = unreadCounts.byAccount[acc.id]?.inbox || 0;
          const isActive = isItemActive('account', 'inbox', acc.id);

          return (
            <button
              key={acc.id}
              onClick={() => handleSelectScope('account', 'inbox', acc.id)}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-[13px] transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#dbeafe] text-[#1d4ed8] dark:bg-[#1e293b] dark:text-[#60a5fa] font-bold shadow-2xs'
                  : 'text-[#334155] dark:text-[#cbd5e1] hover:bg-[#f1f5f9] dark:hover:bg-[#1c1e24] font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: acc.color }}
                />
                <span className="truncate">{acc.name}</span>
              </div>

              {count > 0 && (
                <span className="text-xs text-[#94a3b8] dark:text-[#64748b] font-medium">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SECTION 2: FOLDERS */}
      <div className="mt-5 space-y-0.5">
        <div className="px-3 pb-1 text-[11px] font-bold text-[#94a3b8] dark:text-[#64748b] tracking-wider uppercase">
          Folders
        </div>

        {/* Inbox */}
        <button
          onClick={() => handleSelectScope('all', 'inbox', undefined, 'Inbox')}
          className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-[13px] transition-colors cursor-pointer ${
            navigation.scope === 'all' && navigation.folderType === 'inbox' && navigation.title === 'Inbox'
              ? 'bg-[#dbeafe] text-[#1d4ed8] dark:bg-[#1e293b] dark:text-[#60a5fa] font-bold shadow-2xs'
              : 'text-[#334155] dark:text-[#cbd5e1] hover:bg-[#f1f5f9] dark:hover:bg-[#1c1e24] font-medium'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-2 h-2 rounded-full bg-[#2563eb] shrink-0" />
            <span className="truncate">Inbox</span>
          </div>
          {unreadCounts.totalInbox > 0 && (
            <span className="text-xs text-[#94a3b8] dark:text-[#64748b] font-medium">
              {unreadCounts.totalInbox}
            </span>
          )}
        </button>

        {/* Starred */}
        <button
          onClick={() => handleSelectScope('all', 'starred', undefined, 'Starred')}
          className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-[13px] transition-colors cursor-pointer ${
            isItemActive('all', 'starred')
              ? 'bg-[#dbeafe] text-[#1d4ed8] dark:bg-[#1e293b] dark:text-[#60a5fa] font-bold shadow-2xs'
              : 'text-[#334155] dark:text-[#cbd5e1] hover:bg-[#f1f5f9] dark:hover:bg-[#1c1e24] font-medium'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-2 h-2 rounded-full bg-[#f59e0b] shrink-0" />
            <span className="truncate">Starred</span>
          </div>
        </button>

        {/* Snoozed */}
        <button
          onClick={() => handleSelectScope('all', 'archive', undefined, 'Snoozed')}
          className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-[13px] transition-colors cursor-pointer ${
            navigation.title === 'Snoozed'
              ? 'bg-[#dbeafe] text-[#1d4ed8] dark:bg-[#1e293b] dark:text-[#60a5fa] font-bold shadow-2xs'
              : 'text-[#334155] dark:text-[#cbd5e1] hover:bg-[#f1f5f9] dark:hover:bg-[#1c1e24] font-medium'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-2 h-2 rounded-full bg-[#94a3b8] shrink-0" />
            <span className="truncate">Snoozed</span>
          </div>
        </button>

        {/* Sent */}
        <button
          onClick={() => handleSelectScope('all', 'sent', undefined, 'Sent')}
          className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-[13px] transition-colors cursor-pointer ${
            isItemActive('all', 'sent')
              ? 'bg-[#dbeafe] text-[#1d4ed8] dark:bg-[#1e293b] dark:text-[#60a5fa] font-bold shadow-2xs'
              : 'text-[#334155] dark:text-[#cbd5e1] hover:bg-[#f1f5f9] dark:hover:bg-[#1c1e24] font-medium'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-2 h-2 rounded-full bg-[#94a3b8] shrink-0" />
            <span className="truncate">Sent</span>
          </div>
        </button>

        {/* Drafts */}
        <button
          onClick={() => handleSelectScope('all', 'drafts', undefined, 'Drafts')}
          className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-[13px] transition-colors cursor-pointer ${
            isItemActive('all', 'drafts')
              ? 'bg-[#dbeafe] text-[#1d4ed8] dark:bg-[#1e293b] dark:text-[#60a5fa] font-bold shadow-2xs'
              : 'text-[#334155] dark:text-[#cbd5e1] hover:bg-[#f1f5f9] dark:hover:bg-[#1c1e24] font-medium'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-2 h-2 rounded-full bg-[#94a3b8] shrink-0" />
            <span className="truncate">Drafts</span>
          </div>
          {draftsCount > 0 && (
            <span className="text-xs text-[#94a3b8] dark:text-[#64748b] font-medium">
              {draftsCount}
            </span>
          )}
        </button>

        {/* Spam */}
        <button
          onClick={() => handleSelectScope('all', 'spam', undefined, 'Spam')}
          className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-[13px] transition-colors cursor-pointer ${
            isItemActive('all', 'spam')
              ? 'bg-[#dbeafe] text-[#1d4ed8] dark:bg-[#1e293b] dark:text-[#60a5fa] font-bold shadow-2xs'
              : 'text-[#334155] dark:text-[#cbd5e1] hover:bg-[#f1f5f9] dark:hover:bg-[#1c1e24] font-medium'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-2 h-2 rounded-full bg-[#94a3b8] shrink-0" />
            <span className="truncate">Spam</span>
          </div>
        </button>

        {/* Trash */}
        <button
          onClick={() => handleSelectScope('all', 'trash', undefined, 'Trash')}
          className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-[13px] transition-colors cursor-pointer ${
            isItemActive('all', 'trash')
              ? 'bg-[#dbeafe] text-[#1d4ed8] dark:bg-[#1e293b] dark:text-[#60a5fa] font-bold shadow-2xs'
              : 'text-[#334155] dark:text-[#cbd5e1] hover:bg-[#f1f5f9] dark:hover:bg-[#1c1e24] font-medium'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-2 h-2 rounded-full bg-[#94a3b8] shrink-0" />
            <span className="truncate">Trash</span>
          </div>
        </button>
      </div>
    </aside>
  );
};
