import React, { useState } from 'react';
import { useMail } from '../../context/MailContext';
import { MessageItem } from './MessageItem';
import {
  Search,
  X,
  SlidersHorizontal,
  Paperclip,
  Star,
  Mail,
  Archive,
  Trash2,
  CheckSquare,
  Square,
  ArrowUpDown,
  Filter,
  Inbox,
  Sparkles,
} from 'lucide-react';
import { AccountBadge } from '../Common/AccountBadge';

export const MessageList: React.FC = () => {
  const {
    filteredThreads,
    selectedThreadId,
    navigation,
    searchFilter,
    setSearchFilter,
    clearSearch,
    isSearching,
    searchResultsCount,
    accounts,
    selectedMessageIds,
    selectAllInCurrentView,
    clearSelection,
    batchArchive,
    batchTrash,
    batchMarkRead,
    batchStar,
  } = useMail();

  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Sorted threads
  const sortedThreads = [...filteredThreads].sort((a, b) => {
    const timeA = new Date(a.lastMessageDate).getTime();
    const timeB = new Date(b.lastMessageDate).getTime();
    return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
  });

  const isAllSelected =
    filteredThreads.length > 0 && selectedMessageIds.size === filteredThreads.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAllInCurrentView();
    }
  };

  return (
    <section className="w-80 md:w-96 h-full flex flex-col bg-[#fbfbfd] dark:bg-[#191b22] border-r border-black/8 dark:border-white/8 shrink-0 select-none">
      {/* Header Bar */}
      <div className="pt-3 px-4 pb-2 border-b border-black/5 dark:border-white/5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {navigation.title}
            </h2>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              ({sortedThreads.length})
            </span>
          </div>

          {/* Sort order toggle */}
          <button
            onClick={() => setSortOrder(prev => (prev === 'newest' ? 'oldest' : 'newest'))}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            title={`Sort: ${sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Global Instant Search Input */}
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchFilter.query}
            onChange={e => setSearchFilter({ query: e.target.value })}
            placeholder={
              navigation.scope === 'all'
                ? 'Search all connected inboxes...'
                : `Search in ${navigation.title}...`
            }
            className="w-full pl-8 pr-8 py-1.5 bg-black/4 dark:bg-white/5 hover:bg-black/6 dark:hover:bg-white/8 focus:bg-white dark:focus:bg-[#20232e] border border-black/8 dark:border-white/8 focus:border-blue-500 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all"
          />
          {searchFilter.query && (
            <button
              onClick={() => setSearchFilter({ query: '' })}
              className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Instant Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          {/* Unread Filter */}
          <button
            onClick={() =>
              setSearchFilter({
                isUnread: searchFilter.isUnread === true ? undefined : true,
              })
            }
            className={`px-2 py-0.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
              searchFilter.isUnread === true
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-black/4 dark:bg-white/6 text-slate-600 dark:text-slate-400 hover:bg-black/8 dark:hover:bg-white/10'
            }`}
          >
            Unread
          </button>

          {/* Starred Filter */}
          <button
            onClick={() =>
              setSearchFilter({
                isStarred: searchFilter.isStarred === true ? undefined : true,
              })
            }
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
              searchFilter.isStarred === true
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-black/4 dark:bg-white/6 text-slate-600 dark:text-slate-400 hover:bg-black/8 dark:hover:bg-white/10'
            }`}
          >
            <Star className="w-3 h-3" />
            <span>Starred</span>
          </button>

          {/* Has Attachment Filter */}
          <button
            onClick={() =>
              setSearchFilter({
                hasAttachment: searchFilter.hasAttachment === true ? undefined : true,
              })
            }
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
              searchFilter.hasAttachment === true
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-black/4 dark:bg-white/6 text-slate-600 dark:text-slate-400 hover:bg-black/8 dark:hover:bg-white/10'
            }`}
          >
            <Paperclip className="w-3 h-3" />
            <span>Files</span>
          </button>

          {/* Account Filter (when in All Inboxes) */}
          {navigation.scope === 'all' && (
            <select
              value={searchFilter.accountId || 'all'}
              onChange={e => setSearchFilter({ accountId: e.target.value })}
              className="bg-black/4 dark:bg-white/6 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full text-[11px] outline-none cursor-pointer hover:bg-black/8 dark:hover:bg-white/10"
            >
              <option value="all">All Accounts</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          )}

          {isSearching && (
            <button
              onClick={clearSearch}
              className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold hover:underline shrink-0 ml-auto cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        {/* Bulk Action Toolbar */}
        {selectedMessageIds.size > 0 && (
          <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950/40 p-2 rounded-xl border border-blue-200 dark:border-blue-800 text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSelectAll}
                className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer"
              >
                {isAllSelected ? 'Deselect All' : 'Select All'}
              </button>
              <span className="text-slate-500 font-medium">({selectedMessageIds.size} selected)</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={batchArchive}
                className="p-1 hover:bg-blue-200/50 dark:hover:bg-blue-900/50 text-slate-700 dark:text-slate-200 rounded cursor-pointer"
                title="Archive selected"
              >
                <Archive className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={batchTrash}
                className="p-1 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 rounded cursor-pointer"
                title="Delete selected"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => batchMarkRead(true)}
                className="p-1 hover:bg-blue-200/50 dark:hover:bg-blue-900/50 text-slate-700 dark:text-slate-200 rounded cursor-pointer"
                title="Mark selected as read"
              >
                <Mail className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Messages Scroll List */}
      <div className="flex-1 overflow-y-auto divide-y divide-black/5 dark:divide-white/5 scrollbar-thin">
        {sortedThreads.length > 0 ? (
          sortedThreads.map(thread => (
            <MessageItem
              key={thread.id}
              thread={thread}
              isSelected={selectedThreadId === thread.id}
            />
          ))
        ) : (
          <div className="h-64 flex flex-col items-center justify-center p-6 text-center text-slate-400 dark:text-slate-500">
            {isSearching ? (
              <>
                <Search className="w-8 h-8 mb-2 stroke-1 text-slate-300 dark:text-slate-600" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  No matching emails found
                </p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                  Try searching across other inboxes or clearing active filters.
                </p>
                <button
                  onClick={clearSearch}
                  className="mt-3 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <Inbox className="w-8 h-8 mb-2 stroke-1 text-slate-300 dark:text-slate-600" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  All caught up!
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  No conversations in this folder.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
