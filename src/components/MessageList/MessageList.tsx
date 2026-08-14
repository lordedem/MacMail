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
  RefreshCw,
  ArrowUpDown,
  Inbox,
} from 'lucide-react';

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
    unreadCounts,
    selectedMessageIds,
    selectAllInCurrentView,
    clearSelection,
    batchArchive,
    batchTrash,
    batchMarkRead,
    syncAllAccounts,
    isSyncing,
  } = useMail();

  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

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
    <section className="w-80 md:w-96 lg:w-[420px] h-full flex flex-col bg-white dark:bg-[#131314] border-r border-[#e0e3e7] dark:border-[#333538] shrink-0 select-none">
      {/* Top Gmail Search Pill Header */}
      <div className="pt-3 px-3 pb-2 flex flex-col gap-2.5">
        {/* Google Iconic Rounded Search Bar */}
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-[#444746] dark:text-[#c4c7c5]">
            <Search className="w-4 h-4" />
          </div>

          <input
            type="text"
            value={searchFilter.query}
            onChange={e => setSearchFilter({ query: e.target.value })}
            placeholder={
              navigation.scope === 'all'
                ? 'Search in all inboxes'
                : `Search in ${navigation.title}`
            }
            className="w-full pl-10 pr-9 py-2.5 bg-[#eaf1fb] dark:bg-[#282a2c] hover:bg-[#e1e9f5] dark:hover:bg-[#333538] focus:bg-white dark:focus:bg-[#1f2022] text-[#1f1f1f] dark:text-[#e3e3e3] placeholder-[#747775] text-xs rounded-full outline-none transition-all border border-transparent focus:border-[#c2e7ff] dark:focus:border-[#004a77] focus:shadow-md"
          />

          {searchFilter.query ? (
            <button
              onClick={() => setSearchFilter({ query: '' })}
              className="absolute right-3 p-1 text-[#444746] hover:text-[#1f1f1f] dark:hover:text-white rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="absolute right-3.5 text-[#444746] dark:text-[#c4c7c5]">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* Gmail Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[12px]">
          {/* Account Filter (when in All Inboxes) */}
          {navigation.scope === 'all' && (
            <select
              value={searchFilter.accountId || 'all'}
              onChange={e => setSearchFilter({ accountId: e.target.value })}
              className="px-2.5 py-1 bg-white dark:bg-[#282a2c] border border-[#747775]/30 hover:border-[#1f1f1f] dark:hover:border-[#c4c7c5] text-[#444746] dark:text-[#c4c7c5] rounded-lg text-xs outline-none cursor-pointer shrink-0"
            >
              <option value="all">All inboxes</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          )}

          {/* Has Attachment Chip */}
          <button
            onClick={() =>
              setSearchFilter({
                hasAttachment: searchFilter.hasAttachment === true ? undefined : true,
              })
            }
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer shrink-0 ${
              searchFilter.hasAttachment === true
                ? 'bg-[#c2e7ff] dark:bg-[#004a77] text-[#001d35] dark:text-[#c2e7ff] border-[#0b57d0]'
                : 'bg-white dark:bg-[#282a2c] border-[#747775]/30 text-[#444746] dark:text-[#c4c7c5] hover:bg-[#f6f8fc]'
            }`}
          >
            <Paperclip className="w-3.5 h-3.5" />
            <span>Has attachment</span>
          </button>

          {/* Unread Chip */}
          <button
            onClick={() =>
              setSearchFilter({
                isUnread: searchFilter.isUnread === true ? undefined : true,
              })
            }
            className={`px-3 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer shrink-0 ${
              searchFilter.isUnread === true
                ? 'bg-[#c2e7ff] dark:bg-[#004a77] text-[#001d35] dark:text-[#c2e7ff] border-[#0b57d0]'
                : 'bg-white dark:bg-[#282a2c] border-[#747775]/30 text-[#444746] dark:text-[#c4c7c5] hover:bg-[#f6f8fc]'
            }`}
          >
            Unread
          </button>

          {/* Starred Chip */}
          <button
            onClick={() =>
              setSearchFilter({
                isStarred: searchFilter.isStarred === true ? undefined : true,
              })
            }
            className={`flex items-center gap-1 px-3 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer shrink-0 ${
              searchFilter.isStarred === true
                ? 'bg-[#c2e7ff] dark:bg-[#004a77] text-[#001d35] dark:text-[#c2e7ff] border-[#0b57d0]'
                : 'bg-white dark:bg-[#282a2c] border-[#747775]/30 text-[#444746] dark:text-[#c4c7c5] hover:bg-[#f6f8fc]'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-[#fbbc04] fill-current" />
            <span>Starred</span>
          </button>

          {isSearching && (
            <button
              onClick={clearSearch}
              className="text-xs text-[#0b57d0] dark:text-[#a8c7fa] font-bold hover:underline shrink-0 ml-auto cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Gmail Main Action Toolbar */}
        <div className="flex items-center justify-between pt-1.5 border-t border-[#f2f2f2] dark:border-[#2b2c2e] text-[#444746] dark:text-[#c4c7c5]">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={toggleSelectAll}
              className="rounded text-[#0b57d0] cursor-pointer ml-1"
              title="Select all"
            />

            <button
              onClick={syncAllAccounts}
              disabled={isSyncing}
              className="p-1.5 hover:bg-[#f2f2f2] dark:hover:bg-[#28292a] rounded-full transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-[#0b57d0]' : ''}`} />
            </button>

            {selectedMessageIds.size > 0 && (
              <>
                <button
                  onClick={batchArchive}
                  className="p-1.5 hover:bg-[#f2f2f2] dark:hover:bg-[#28292a] rounded-full transition-colors cursor-pointer"
                  title="Archive selected"
                >
                  <Archive className="w-4 h-4" />
                </button>
                <button
                  onClick={batchTrash}
                  className="p-1.5 hover:bg-[#fce8e6] dark:hover:bg-[#3b2020] text-[#ea4335] rounded-full transition-colors cursor-pointer"
                  title="Delete selected"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => batchMarkRead(true)}
                  className="p-1.5 hover:bg-[#f2f2f2] dark:hover:bg-[#28292a] rounded-full transition-colors cursor-pointer"
                  title="Mark as read"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#747775] dark:text-[#8e918f]">
              {sortedThreads.length > 0 ? `1–${sortedThreads.length} of ${sortedThreads.length}` : '0 of 0'}
            </span>

            <button
              onClick={() => setSortOrder(prev => (prev === 'newest' ? 'oldest' : 'newest'))}
              className="p-1.5 hover:bg-[#f2f2f2] dark:hover:bg-[#28292a] rounded-full transition-colors cursor-pointer"
              title={`Sort: ${sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Message Rows Feed */}
      <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-[#f2f2f2] dark:divide-[#2b2c2e]">
        {sortedThreads.length > 0 ? (
          sortedThreads.map(thread => (
            <MessageItem
              key={thread.id}
              thread={thread}
              isSelected={selectedThreadId === thread.id}
            />
          ))
        ) : (
          <div className="h-64 flex flex-col items-center justify-center p-6 text-center text-[#747775] dark:text-[#8e918f]">
            <Inbox className="w-10 h-10 mb-2 stroke-1 text-[#c4c7c5]" />
            <p className="text-sm font-medium text-[#1f1f1f] dark:text-[#e3e3e3]">
              Your inbox is empty
            </p>
            <p className="text-xs text-[#747775] mt-1">
              {isSearching ? 'No messages matched your search query.' : 'Messages you receive will show up here.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
