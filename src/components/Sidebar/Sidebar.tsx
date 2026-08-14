import React, { useState } from 'react';
import { useMail } from '../../context/MailContext';
import { FolderType, EmailCategory } from '../../types/mail';
import {
  Inbox,
  Star,
  Send,
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
  Sun,
  Moon,
  Pencil,
  Tag,
  Menu,
  Clock,
  AlertOctagon,
  FileText,
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
      <aside className="w-18 h-full flex flex-col items-center py-3 bg-[#f6f8fc] dark:bg-[#1e1f20] border-r border-[#e0e3e7] dark:border-[#333538] shrink-0 select-none justify-between transition-all">
        <div className="flex flex-col items-center gap-3 w-full">
          {/* Traffic lights spacer */}
          <div className="h-10 w-full app-drag-region" />

          {/* Menu button */}
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="p-2.5 text-[#444746] dark:text-[#c4c7c5] hover:bg-[#e9eef6] dark:hover:bg-[#28292a] rounded-full transition-colors cursor-pointer"
            title="Expand Main Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Gmail Compose Icon */}
          <button
            onClick={() => openCompose('new')}
            className="p-3 bg-[#c2e7ff] dark:bg-[#004a77] text-[#001d35] dark:text-[#c2e7ff] hover:shadow-md rounded-2xl transition-all active:scale-95 cursor-pointer shadow-xs"
            title="Compose"
          >
            <Pencil className="w-5 h-5" />
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
            className={`relative p-2.5 rounded-full transition-all cursor-pointer ${
              navigation.scope === 'all' && navigation.folderType === 'inbox'
                ? 'bg-[#d3e3fd] text-[#041e49] dark:bg-[#004a77] dark:text-[#c2e7ff] font-bold'
                : 'text-[#444746] dark:text-[#c4c7c5] hover:bg-[#e9eef6] dark:hover:bg-[#28292a]'
            }`}
            title="All Inboxes"
          >
            <Inbox className="w-5 h-5" />
            {unreadCounts.totalInbox > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#0b57d0] dark:bg-[#a8c7fa] rounded-full" />
            )}
          </button>

          {/* Starred */}
          <button
            onClick={() =>
              setNavigation({
                scope: 'all',
                folderType: 'starred',
                title: 'All Starred',
              })
            }
            className={`p-2.5 rounded-full transition-all cursor-pointer ${
              navigation.scope === 'all' && navigation.folderType === 'starred'
                ? 'bg-[#d3e3fd] text-[#041e49] dark:bg-[#004a77] dark:text-[#c2e7ff]'
                : 'text-[#444746] dark:text-[#c4c7c5] hover:bg-[#e9eef6] dark:hover:bg-[#28292a]'
            }`}
            title="Starred"
          >
            <Star className="w-5 h-5" />
          </button>

          <div className="w-6 h-[1px] bg-[#e0e3e7] dark:bg-[#333538] my-1" />

          {/* Accounts circles */}
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
              className="relative p-2 rounded-full hover:bg-[#e9eef6] dark:hover:bg-[#28292a] transition-all cursor-pointer"
              title={`${acc.name} (${acc.email})`}
            >
              <div
                className="w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-[#1e1f20]"
                style={{ backgroundColor: acc.color }}
              />
            </button>
          ))}
        </div>

        {/* Bottom items */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-[#444746] dark:text-[#c4c7c5] hover:bg-[#e9eef6] dark:hover:bg-[#28292a] rounded-full transition-colors cursor-pointer"
            title="Settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 h-full flex flex-col bg-[#f6f8fc] dark:bg-[#1e1f20] shrink-0 select-none text-[#1f1f1f] dark:text-[#e3e3e3] font-sans transition-all">
      {/* Top App Drag & Brand Header */}
      <div className="h-14 app-drag-region flex items-center justify-between pl-20 pr-4">
        <div className="flex items-center gap-2.5">
          <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
            />
          </svg>
          <span className="text-[17px] font-semibold tracking-tight text-[#444746] dark:text-[#e3e3e3]">
            MacMail
          </span>
        </div>

        <button
          onClick={() => setIsSidebarCollapsed(true)}
          className="p-1.5 text-[#444746] dark:text-[#c4c7c5] hover:bg-[#e9eef6] dark:hover:bg-[#28292a] rounded-full transition-colors no-drag cursor-pointer"
          title="Collapse main menu"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Gmail Iconic Compose Button */}
      <div className="px-4 py-2">
        <button
          onClick={() => openCompose('new')}
          className="flex items-center gap-3.5 px-5 py-3.5 bg-[#c2e7ff] hover:bg-[#b3e0fd] dark:bg-[#004a77] dark:hover:bg-[#005a91] text-[#001d35] dark:text-[#c2e7ff] text-sm font-semibold rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          <Pencil className="w-4 h-4 text-[#001d35] dark:text-[#c2e7ff]" />
          <span>Compose</span>
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto pr-3 pl-2 py-2 space-y-1 text-[13px] scrollbar-thin">
        {/* All Inboxes */}
        <button
          onClick={() =>
            setNavigation({
              scope: 'all',
              folderType: 'inbox',
              title: 'All inboxes',
            })
          }
          className={`flex items-center gap-4 w-full px-4 py-2.5 rounded-r-full font-medium transition-colors cursor-pointer ${
            isNavActive('all', 'inbox')
              ? 'bg-[#d3e3fd] text-[#041e49] dark:bg-[#004a77] dark:text-[#c2e7ff] font-bold'
              : 'text-[#444746] dark:text-[#c4c7c5] hover:bg-[#eaebef] dark:hover:bg-[#28292a]'
          }`}
        >
          <Inbox className="w-4 h-4 text-[#0b57d0] dark:text-[#a8c7fa] shrink-0" />
          <span className="truncate">All inboxes</span>
          {unreadCounts.totalInbox > 0 && (
            <span className="ml-auto text-xs font-bold text-[#041e49] dark:text-[#c2e7ff]">
              {unreadCounts.totalInbox}
            </span>
          )}
        </button>

        {/* Starred */}
        <button
          onClick={() =>
            setNavigation({
              scope: 'all',
              folderType: 'starred',
              title: 'Starred',
            })
          }
          className={`flex items-center gap-4 w-full px-4 py-2 rounded-r-full font-medium transition-colors cursor-pointer ${
            isNavActive('all', 'starred')
              ? 'bg-[#d3e3fd] text-[#041e49] dark:bg-[#004a77] dark:text-[#c2e7ff] font-bold'
              : 'text-[#444746] dark:text-[#c4c7c5] hover:bg-[#eaebef] dark:hover:bg-[#28292a]'
          }`}
        >
          <Star className="w-4 h-4 text-[#fbbc04] shrink-0 fill-current" />
          <span className="truncate">Starred</span>
          {unreadCounts.totalStarred > 0 && (
            <span className="ml-auto text-xs text-[#444746] dark:text-[#c4c7c5]">
              {unreadCounts.totalStarred}
            </span>
          )}
        </button>

        {/* Sent */}
        <button
          onClick={() =>
            setNavigation({
              scope: 'all',
              folderType: 'sent',
              title: 'Sent',
            })
          }
          className={`flex items-center gap-4 w-full px-4 py-2 rounded-r-full font-medium transition-colors cursor-pointer ${
            isNavActive('all', 'sent')
              ? 'bg-[#d3e3fd] text-[#041e49] dark:bg-[#004a77] dark:text-[#c2e7ff] font-bold'
              : 'text-[#444746] dark:text-[#c4c7c5] hover:bg-[#eaebef] dark:hover:bg-[#28292a]'
          }`}
        >
          <Send className="w-4 h-4 text-[#444746] dark:text-[#c4c7c5] shrink-0" />
          <span className="truncate">Sent</span>
        </button>

        {/* All Archive / All Mail */}
        <button
          onClick={() =>
            setNavigation({
              scope: 'all',
              folderType: 'archive',
              title: 'All Mail',
            })
          }
          className={`flex items-center gap-4 w-full px-4 py-2 rounded-r-full font-medium transition-colors cursor-pointer ${
            isNavActive('all', 'archive')
              ? 'bg-[#d3e3fd] text-[#041e49] dark:bg-[#004a77] dark:text-[#c2e7ff] font-bold'
              : 'text-[#444746] dark:text-[#c4c7c5] hover:bg-[#eaebef] dark:hover:bg-[#28292a]'
          }`}
        >
          <Archive className="w-4 h-4 text-[#444746] dark:text-[#c4c7c5] shrink-0" />
          <span className="truncate">All Mail</span>
        </button>

        {/* Trash */}
        <button
          onClick={() =>
            setNavigation({
              scope: 'all',
              folderType: 'trash',
              title: 'Trash',
            })
          }
          className={`flex items-center gap-4 w-full px-4 py-2 rounded-r-full font-medium transition-colors cursor-pointer ${
            isNavActive('all', 'trash')
              ? 'bg-[#d3e3fd] text-[#041e49] dark:bg-[#004a77] dark:text-[#c2e7ff] font-bold'
              : 'text-[#444746] dark:text-[#c4c7c5] hover:bg-[#eaebef] dark:hover:bg-[#28292a]'
          }`}
        >
          <Trash2 className="w-4 h-4 text-[#444746] dark:text-[#c4c7c5] shrink-0" />
          <span className="truncate">Trash</span>
        </button>

        {/* ACCOUNTS SECTION */}
        <div className="pt-4">
          <div className="px-4 pb-1.5 flex items-center justify-between text-xs font-bold text-[#444746] dark:text-[#c4c7c5] tracking-wide">
            <span>Accounts</span>
            <button
              onClick={() => setIsAddAccountOpen(true)}
              className="p-1 hover:bg-[#e9eef6] dark:hover:bg-[#28292a] rounded-full transition-colors text-[#0b57d0] dark:text-[#a8c7fa] cursor-pointer"
              title="Add another account"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-0.5">
            {accounts.map(acc => {
              const isExpanded = expandedAccounts[acc.id] ?? true;
              const accUnread = unreadCounts.byAccount[acc.id]?.inbox || 0;

              return (
                <div key={acc.id}>
                  {/* Account Row */}
                  <div
                    onClick={() =>
                      setNavigation({
                        scope: 'account',
                        accountId: acc.id,
                        folderType: 'inbox',
                        title: `${acc.name} - Inbox`,
                      })
                    }
                    className={`flex items-center gap-2.5 w-full px-3 py-1.5 rounded-r-full font-medium transition-colors cursor-pointer ${
                      navigation.scope === 'account' && navigation.accountId === acc.id
                        ? 'bg-[#d3e3fd] text-[#041e49] dark:bg-[#004a77] dark:text-[#c2e7ff] font-bold'
                        : 'text-[#444746] dark:text-[#c4c7c5] hover:bg-[#eaebef] dark:hover:bg-[#28292a]'
                    }`}
                  >
                    <button
                      onClick={e => toggleAccountExpand(acc.id, e)}
                      className="p-0.5 text-[#444746] dark:text-[#c4c7c5] transition-transform cursor-pointer"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: acc.color }}
                    />

                    <span className="truncate text-xs">{acc.name}</span>

                    {accUnread > 0 && (
                      <span className="ml-auto text-xs font-bold text-[#0b57d0] dark:text-[#a8c7fa]">
                        {accUnread}
                      </span>
                    )}
                  </div>

                  {/* Account Subfolders */}
                  {isExpanded && (
                    <div className="pl-8 pr-2 space-y-0.5">
                      <button
                        onClick={() =>
                          setNavigation({
                            scope: 'account',
                            accountId: acc.id,
                            folderType: 'inbox',
                            title: `${acc.name} - Inbox`,
                          })
                        }
                        className={`flex items-center gap-2 w-full px-3 py-1 rounded-r-full text-xs transition-colors cursor-pointer ${
                          isNavActive('account', 'inbox', acc.id)
                            ? 'bg-[#d3e3fd] text-[#041e49] dark:bg-[#004a77] dark:text-[#c2e7ff] font-bold'
                            : 'text-[#444746] dark:text-[#c4c7c5] hover:bg-[#eaebef] dark:hover:bg-[#28292a]'
                        }`}
                      >
                        <Inbox className="w-3.5 h-3.5" />
                        <span>Inbox</span>
                        {accUnread > 0 && (
                          <span className="ml-auto text-xs font-bold">
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
                        className={`flex items-center gap-2 w-full px-3 py-1 rounded-r-full text-xs transition-colors cursor-pointer ${
                          isNavActive('account', 'sent', acc.id)
                            ? 'bg-[#d3e3fd] text-[#041e49] dark:bg-[#004a77] dark:text-[#c2e7ff] font-bold'
                            : 'text-[#444746] dark:text-[#c4c7c5] hover:bg-[#eaebef] dark:hover:bg-[#28292a]'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Sent</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CATEGORIES / LABELS */}
        <div className="pt-3">
          <div className="px-4 pb-1.5 text-xs font-bold text-[#444746] dark:text-[#c4c7c5] tracking-wide">
            Categories
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() =>
                setNavigation({
                  scope: 'category',
                  folderType: 'inbox',
                  category: 'receipts',
                  title: 'Purchases & Receipts',
                })
              }
              className={`flex items-center gap-4 w-full px-4 py-1.5 rounded-r-full text-xs transition-colors cursor-pointer ${
                isNavActive('category', undefined, undefined, 'receipts')
                  ? 'bg-[#d3e3fd] text-[#041e49] dark:bg-[#004a77] dark:text-[#c2e7ff] font-bold'
                  : 'text-[#444746] dark:text-[#c4c7c5] hover:bg-[#eaebef] dark:hover:bg-[#28292a]'
              }`}
            >
              <Receipt className="w-4 h-4 text-[#34a853] shrink-0" />
              <span className="truncate">Purchases</span>
            </button>

            <button
              onClick={() =>
                setNavigation({
                  scope: 'category',
                  folderType: 'inbox',
                  category: 'updates',
                  title: 'Updates',
                })
              }
              className={`flex items-center gap-4 w-full px-4 py-1.5 rounded-r-full text-xs transition-colors cursor-pointer ${
                isNavActive('category', undefined, undefined, 'updates')
                  ? 'bg-[#d3e3fd] text-[#041e49] dark:bg-[#004a77] dark:text-[#c2e7ff] font-bold'
                  : 'text-[#444746] dark:text-[#c4c7c5] hover:bg-[#eaebef] dark:hover:bg-[#28292a]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#fbbc04] shrink-0" />
              <span className="truncate">Updates</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Status / Settings Bar */}
      <div className="p-3 border-t border-[#e0e3e7] dark:border-[#333538] flex items-center justify-between text-xs text-[#444746] dark:text-[#c4c7c5]">
        <button
          onClick={syncAllAccounts}
          disabled={isSyncing}
          className="flex items-center gap-2 hover:text-[#1f1f1f] dark:hover:text-[#e3e3e3] transition-colors cursor-pointer"
          title="Sync Mailboxes"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#0b57d0]' : ''}`} />
          <span className="text-xs font-medium">{isSyncing ? 'Syncing...' : 'Sync'}</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-1.5 hover:bg-[#e9eef6] dark:hover:bg-[#28292a] rounded-full transition-colors cursor-pointer"
            title="Toggle theme"
          >
            <Sun className="w-4 h-4 hidden dark:block" />
            <Moon className="w-4 h-4 block dark:hidden" />
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 hover:bg-[#e9eef6] dark:hover:bg-[#28292a] rounded-full transition-colors cursor-pointer"
            title="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
