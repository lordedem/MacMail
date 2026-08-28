import React from 'react';
import { useMail } from '../../context/MailContext';
import { MessageItem } from './MessageItem';
import { Inbox, RefreshCw, Pencil } from 'lucide-react';

export const MessageList: React.FC = () => {
  const {
    filteredThreads,
    selectedThreadId,
    navigation,
    searchFilter,
    isSearching,
    accounts,
    syncAllAccounts,
    isSyncing,
    openCompose,
  } = useMail();

  // Header Title & Subtitle logic
  const getHeaderInfo = () => {
    if (isSearching && searchFilter.query) {
      const matchCount = filteredThreads.length;
      const matchedAccountNames = Array.from(
        new Set(filteredThreads.map(t => accounts.find(a => a.id === t.accountId)?.name || 'Account'))
      ).join(', ');

      return {
        title: 'Results in all inboxes',
        subtitle: `${matchCount} match${matchCount === 1 ? '' : 'es'} for "${searchFilter.query}"${matchedAccountNames ? ` · ${matchedAccountNames}` : ''}`,
      };
    }

    if (navigation.scope === 'account') {
      const acc = accounts.find(a => a.id === navigation.accountId);
      return {
        title: acc?.name || 'Account',
        subtitle: `${filteredThreads.length} message${filteredThreads.length === 1 ? '' : 's'}`,
      };
    }

    return {
      title: navigation.title || 'All inboxes',
      subtitle: `${filteredThreads.length} message${filteredThreads.length === 1 ? '' : 's'} · ${accounts.map(a => a.name).join(', ')}`,
    };
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <section className="w-80 md:w-88 lg:w-96 h-full flex flex-col bg-white dark:bg-[#121316] border-r border-[#e5e7eb] dark:border-[#24262b] shrink-0 select-none font-sans transition-colors">
      {/* Middle Column Header */}
      <div className="px-4 py-3 border-b border-[#e5e7eb] dark:border-[#24262b] flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-[14px] font-bold text-[#0f172a] dark:text-[#f8fafc] truncate">
            {title}
          </h2>
          <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mt-0.5 truncate">
            {subtitle}
          </p>
        </div>

        <button
          onClick={syncAllAccounts}
          disabled={isSyncing}
          className="p-1.5 text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white hover:bg-[#f1f5f9] dark:hover:bg-[#1e2026] rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
          title="Sync Mailbox"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#2563eb]' : ''}`} />
        </button>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-[#f1f5f9] dark:divide-[#1e2026]">
        {filteredThreads.length > 0 ? (
          filteredThreads.map(thread => (
            <MessageItem
              key={thread.id}
              thread={thread}
              isSelected={selectedThreadId === thread.id}
            />
          ))
        ) : (
          <div className="h-64 flex flex-col items-center justify-center p-6 text-center text-[#64748b] dark:text-[#94a3b8]">
            <Inbox className="w-9 h-9 mb-2 stroke-1 text-[#cbd5e1] dark:text-[#475569]" />
            <p className="text-sm font-semibold text-[#0f172a] dark:text-[#f8fafc]">
              No messages found
            </p>
            <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mt-1 mb-4">
              {isSearching ? 'No messages match your search filter.' : 'Your mailbox is currently empty.'}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={syncAllAccounts}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eff6ff] hover:bg-[#dbeafe] dark:bg-[#1e293b] dark:hover:bg-[#283548] text-[#2563eb] dark:text-[#60a5fa] rounded-full text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Mailbox'}</span>
              </button>

              <button
                onClick={() => openCompose('new')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1c1e24] hover:bg-[#f8fafc] dark:hover:bg-[#252830] border border-[#e2e8f0] dark:border-[#2e323b] text-[#334155] dark:text-[#cbd5e1] rounded-full text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                <Pencil className="w-3 h-3 text-[#ea4335]" />
                <span>Compose</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
