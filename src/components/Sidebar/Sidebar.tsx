import React, { useState } from 'react';
import { useMail } from '../../context/MailContext';
import { FolderType, EmailCategory } from '../../types/mail';
import {
  Inbox,
  Star,
  Send,
  FileEdit,
  Archive,
  Trash2,
  Plus,
  Settings as SettingsIcon,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronRight,
  Receipt,
  Sparkles,
  Tag,
  Sun,
  Moon,
  PenSquare,
  Layers,
  ChevronLeft,
  Mail,
} from 'lucide-react';
import { AccountBadge } from '../Common/AccountBadge';

export const Sidebar: React.FC = () => {
  const {
    accounts,
    navigation,
    setNavigation,
    unreadCounts,
    openCompose,
    syncAllAccounts,
    isSyncing,
    setIsAddAccountOpen,
    setIsSettingsOpen,
    setIsCommandPaletteOpen,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    settings,
    updateSettings,
  } = useMail();

  // Collapsed states for each account in sidebar
  const [expandedAccounts, setExpandedAccounts] = useState<Record<string, boolean>>({
    acc_work: true,
    acc_personal: true,
    acc_consulting: true,
  });

  const toggleAccountExpand = (accountId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedAccounts(prev => ({
      ...prev,
      [accountId]: !prev[accountId],
    }));
  };

  const isNavActive = (
    scope: 'all' | 'account' | 'category',
    folderType?: FolderType,
    accountId?: string,
    category?: EmailCategory
  ) => {
    if (scope === 'all') {
      return navigation.scope === 'all' && navigation.folderType === folderType;
    }
    if (scope === 'account') {
      return navigation.scope === 'account' && navigation.accountId === accountId && navigation.folderType === folderType;
    }
    if (scope === 'category') {
      return navigation.scope === 'category' && navigation.category === category;
    }
    return false;
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      updateSettings({ theme: 'light' });
    } else {
      document.documentElement.classList.add('dark');
      updateSettings({ theme: 'dark' });
    }
  };

  if (isSidebarCollapsed) {
    return (
      <aside className="w-16 h-full flex flex-col items-center py-3 bg-[#f0f1f5] dark:bg-[#16171d] border-r border-black/8 dark:border-white/8 shrink-0 select-none justify-between transition-all">
        <div className="flex flex-col items-center gap-3 w-full">
          {/* Traffic lights spacer */}
          <div className="h-10 w-full app-drag-region" />

          {/* Expand Sidebar Button */}
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            title="Expand Sidebar"
          >
            <Layers className="w-5 h-5" />
          </button>

          {/* Compose Icon */}
          <button
            onClick={() => openCompose('new')}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 transition-transform active:scale-95 cursor-pointer"
            title="Compose New Email (Cmd+N)"
          >
            <PenSquare className="w-4 h-4" />
          </button>

          {/* Unified All Inboxes */}
          <button
            onClick={() =>
              setNavigation({
                scope: 'all',
                folderType: 'inbox',
                title: 'All Inboxes',
              })
            }
            className={`relative p-2.5 rounded-xl transition-all cursor-pointer ${
              navigation.scope === 'all' && navigation.folderType === 'inbox'
                ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            title="All Inboxes"
          >
            <Inbox className="w-5 h-5" />
            {unreadCounts.totalInbox > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white dark:ring-[#16171d]" />
            )}
          </button>

          {/* All Starred */}
          <button
            onClick={() =>
              setNavigation({
                scope: 'all',
                folderType: 'starred',
                title: 'All Starred',
              })
            }
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              navigation.scope === 'all' && navigation.folderType === 'starred'
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            title="Starred"
          >
            <Star className="w-5 h-5" />
          </button>

          {/* Accounts icons */}
          <div className="w-8 h-[1px] bg-black/10 dark:bg-white/10 my-1" />

          {accounts.map(acc => (
            <button
              key={acc.id}
              onClick={() =>
                setNavigation({
                  scope: 'account',
                  accountId: acc.id,
                  folderType: 'inbox',
                  title: `${acc.name} - Inbox`,
                })
              }
              className="relative p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
              title={`${acc.name} (${acc.email})`}
            >
              <div
                className="w-4 h-4 rounded-full border border-white dark:border-[#16171d] shadow-xs"
                style={{ backgroundColor: acc.color }}
              />
              {unreadCounts.byAccount[acc.id]?.inbox > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Bottom items */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            title="Settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 h-full flex flex-col bg-[#eceef2]/80 dark:bg-[#16171d]/90 backdrop-blur-2xl border-r border-black/8 dark:border-white/8 shrink-0 select-none text-slate-700 dark:text-slate-300 font-sans transition-all duration-200">
      {/* Top Window Bar Area with Mac Traffic Lights Spacing */}
      <div className="h-12 app-drag-region flex items-center justify-between pl-20 pr-3 pt-1">
        <span className="text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
          MacMail
        </span>
        <button
          onClick={() => setIsSidebarCollapsed(true)}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors no-drag cursor-pointer"
          title="Collapse Sidebar"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Main Action Buttons */}
      <div className="px-3 pb-3 pt-1 flex flex-col gap-2">
        <button
          onClick={() => openCompose('new')}
          className="flex items-center justify-center gap-2 w-full py-2 px-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-semibold rounded-xl shadow-sm shadow-blue-600/25 transition-all cursor-pointer"
        >
          <PenSquare className="w-3.5 h-3.5" />
          <span>New Message</span>
          <span className="ml-auto text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">⌘N</span>
        </button>

        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2 w-full py-1.5 px-3 bg-black/4 dark:bg-white/4 hover:bg-black/8 dark:hover:bg-white/8 text-slate-500 dark:text-slate-400 text-xs rounded-xl transition-all border border-black/5 dark:border-white/5 cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 dark:text-slate-400">Search all mail...</span>
          <span className="ml-auto text-[10px] text-slate-400 font-mono">⌘K</span>
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2 space-y-4 text-xs scrollbar-thin">
        {/* UNIFIED FOLDERS */}
        <div>
          <div className="px-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <span>Unified Mail</span>
          </div>

          <div className="space-y-0.5">
            {/* All Inboxes */}
            <button
              onClick={() =>
                setNavigation({
                  scope: 'all',
                  folderType: 'inbox',
                  title: 'All Inboxes',
                })
              }
              className={`flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                isNavActive('all', 'inbox')
                  ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Inbox className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="truncate">All Inboxes</span>
              {unreadCounts.totalInbox > 0 && (
                <span className="ml-auto px-2 py-0.5 text-[11px] font-bold rounded-full bg-blue-600 text-white shadow-xs">
                  {unreadCounts.totalInbox}
                </span>
              )}
            </button>

            {/* All Starred */}
            <button
              onClick={() =>
                setNavigation({
                  scope: 'all',
                  folderType: 'starred',
                  title: 'All Starred',
                })
              }
              className={`flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                isNavActive('all', 'starred')
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Star className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="truncate">Starred</span>
              {unreadCounts.totalStarred > 0 && (
                <span className="ml-auto text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                  {unreadCounts.totalStarred}
                </span>
              )}
            </button>

            {/* All Sent */}
            <button
              onClick={() =>
                setNavigation({
                  scope: 'all',
                  folderType: 'sent',
                  title: 'All Sent',
                })
              }
              className={`flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                isNavActive('all', 'sent')
                  ? 'bg-slate-500/15 text-slate-900 dark:text-slate-100 font-semibold'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Send className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">Sent</span>
            </button>

            {/* All Archive */}
            <button
              onClick={() =>
                setNavigation({
                  scope: 'all',
                  folderType: 'archive',
                  title: 'All Archive',
                })
              }
              className={`flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                isNavActive('all', 'archive')
                  ? 'bg-slate-500/15 text-slate-900 dark:text-slate-100 font-semibold'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Archive className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">Archive</span>
            </button>

            {/* All Trash */}
            <button
              onClick={() =>
                setNavigation({
                  scope: 'all',
                  folderType: 'trash',
                  title: 'All Trash',
                })
              }
              className={`flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                isNavActive('all', 'trash')
                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 font-semibold'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Trash2 className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="truncate">Trash</span>
            </button>
          </div>
        </div>

        {/* INDIVIDUAL ACCOUNTS */}
        <div>
          <div className="px-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <span>Accounts</span>
            <button
              onClick={() => setIsAddAccountOpen(true)}
              className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors text-slate-500 hover:text-blue-600 cursor-pointer"
              title="Add New Email Account"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5">
            {accounts.map(acc => {
              const isExpanded = expandedAccounts[acc.id] ?? true;
              const accUnread = unreadCounts.byAccount[acc.id]?.inbox || 0;

              return (
                <div key={acc.id} className="rounded-xl overflow-hidden">
                  {/* Account Header Item */}
                  <div
                    onClick={() =>
                      setNavigation({
                        scope: 'account',
                        accountId: acc.id,
                        folderType: 'inbox',
                        title: `${acc.name} - Inbox`,
                      })
                    }
                    className={`group flex items-center gap-2 w-full px-2 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                      navigation.scope === 'account' && navigation.accountId === acc.id
                        ? 'bg-black/6 dark:bg-white/6 font-semibold'
                        : 'hover:bg-black/4 dark:hover:bg-white/4'
                    }`}
                  >
                    <button
                      onClick={e => toggleAccountExpand(acc.id, e)}
                      className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-transform cursor-pointer"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: acc.color }}
                    />

                    <span className="truncate font-semibold text-[12px]">{acc.name}</span>

                    {accUnread > 0 && (
                      <span
                        className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${acc.color}20`,
                          color: acc.color,
                        }}
                      >
                        {accUnread}
                      </span>
                    )}
                  </div>

                  {/* Sub-folders when expanded */}
                  {isExpanded && (
                    <div className="pl-6 pr-1 py-0.5 space-y-0.5 border-l border-black/5 dark:border-white/5 ml-3.5 mt-0.5">
                      <button
                        onClick={() =>
                          setNavigation({
                            scope: 'account',
                            accountId: acc.id,
                            folderType: 'inbox',
                            title: `${acc.name} - Inbox`,
                          })
                        }
                        className={`flex items-center gap-2 w-full px-2 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                          isNavActive('account', 'inbox', acc.id)
                            ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <Inbox className="w-3.5 h-3.5" />
                        <span>Inbox</span>
                        {accUnread > 0 && (
                          <span className="ml-auto text-[10px] font-bold text-blue-600 dark:text-blue-400">
                            {accUnread}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() =>
                          setNavigation({
                            scope: 'account',
                            accountId: acc.id,
                            folderType: 'sent',
                            title: `${acc.name} - Sent`,
                          })
                        }
                        className={`flex items-center gap-2 w-full px-2 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                          isNavActive('account', 'sent', acc.id)
                            ? 'bg-slate-500/15 text-slate-900 dark:text-slate-100 font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Sent</span>
                      </button>

                      <button
                        onClick={() =>
                          setNavigation({
                            scope: 'account',
                            accountId: acc.id,
                            folderType: 'archive',
                            title: `${acc.name} - Archive`,
                          })
                        }
                        className={`flex items-center gap-2 w-full px-2 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                          isNavActive('account', 'archive', acc.id)
                            ? 'bg-slate-500/15 text-slate-900 dark:text-slate-100 font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <Archive className="w-3.5 h-3.5" />
                        <span>Archive</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SMART VIEWS / CATEGORIES */}
        <div>
          <div className="px-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <span>Smart Categories</span>
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() =>
                setNavigation({
                  scope: 'category',
                  folderType: 'inbox',
                  category: 'receipts',
                  title: 'Receipts & Invoices',
                })
              }
              className={`flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                isNavActive('category', undefined, undefined, 'receipts')
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Receipt className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="truncate">Receipts & Bills</span>
            </button>

            <button
              onClick={() =>
                setNavigation({
                  scope: 'category',
                  folderType: 'inbox',
                  category: 'updates',
                  title: 'Updates & News',
                })
              }
              className={`flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                isNavActive('category', undefined, undefined, 'updates')
                  ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 font-semibold'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
              <span className="truncate">Updates & Alerts</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="p-3 border-t border-black/8 dark:border-white/8 flex items-center justify-between text-xs bg-black/2 dark:bg-white/2">
        <button
          onClick={syncAllAccounts}
          disabled={isSyncing}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          title="Fetch latest mail across all accounts (Cmd+R)"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-500' : ''}`} />
          <span className="text-[11px] font-medium">{isSyncing ? 'Syncing...' : 'Sync Mail'}</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            title="Toggle Dark/Light Mode"
          >
            <Sun className="w-4 h-4 hidden dark:block" />
            <Moon className="w-4 h-4 block dark:hidden" />
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            title="Preferences & Accounts"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
