import React, { useState, useEffect, useRef } from 'react';
import { useMail } from '../../context/MailContext';
import {
  Search,
  Pencil,
  Inbox,
  Star,
  RefreshCw,
  Plus,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { AccountBadge } from '../Common/AccountBadge';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    filteredThreads,
    selectThread,
    openCompose,
    setNavigation,
    syncAllAccounts,
    setIsAddAccountOpen,
    setIsSettingsOpen,
    accounts,
    updateSettings,
  } = useMail();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const ACTIONS = [
    {
      id: 'act_compose',
      title: 'Compose new message',
      shortcut: 'c',
      icon: <Pencil className="w-4 h-4 text-[#0b57d0]" />,
      run: () => openCompose('new'),
    },
    {
      id: 'act_all_inboxes',
      title: 'Go to All inboxes',
      shortcut: '',
      icon: <Inbox className="w-4 h-4 text-[#0b57d0]" />,
      run: () => setNavigation({ scope: 'all', folderType: 'inbox', title: 'All inboxes' }),
    },
    {
      id: 'act_starred',
      title: 'Go to Starred',
      shortcut: '',
      icon: <Star className="w-4 h-4 text-[#fbbc04] fill-current" />,
      run: () => setNavigation({ scope: 'all', folderType: 'starred', title: 'Starred' }),
    },
    {
      id: 'act_sync',
      title: 'Sync all accounts',
      shortcut: '⌘R',
      icon: <RefreshCw className="w-4 h-4 text-[#34a853]" />,
      run: () => syncAllAccounts(),
    },
    {
      id: 'act_add_account',
      title: 'Add another account',
      shortcut: '',
      icon: <Plus className="w-4 h-4 text-[#0b57d0]" />,
      run: () => setIsAddAccountOpen(true),
    },
    {
      id: 'act_toggle_theme',
      title: 'Toggle Dark / Light theme',
      shortcut: '',
      icon: <Moon className="w-4 h-4 text-[#747775]" />,
      run: () => {
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
          document.documentElement.classList.remove('dark');
          updateSettings({ theme: 'light' });
        } else {
          document.documentElement.classList.add('dark');
          updateSettings({ theme: 'dark' });
        }
      },
    },
    {
      id: 'act_settings',
      title: 'Settings',
      shortcut: '',
      icon: <SettingsIcon className="w-4 h-4 text-[#747775]" />,
      run: () => setIsSettingsOpen(true),
    },
  ];

  const matchedActions = ACTIONS.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  const matchedEmails = query.trim()
    ? filteredThreads.slice(0, 6)
    : [];

  const totalItems = matchedActions.length + matchedEmails.length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (totalItems || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + (totalItems || 1)) % (totalItems || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex < matchedActions.length) {
        matchedActions[selectedIndex]?.run();
        setIsCommandPaletteOpen(false);
      } else {
        const emailIdx = selectedIndex - matchedActions.length;
        const thread = matchedEmails[emailIdx];
        if (thread) {
          selectThread(thread.id);
          setIsCommandPaletteOpen(false);
        }
      }
    } else if (e.key === 'Escape') {
      setIsCommandPaletteOpen(false);
    }
  };

  return (
    <div
      onClick={() => setIsCommandPaletteOpen(false)}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-20 px-4 select-none animate-in fade-in duration-150"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-xl bg-white dark:bg-[#1e1f20] border border-[#e0e3e7] dark:border-[#333538] rounded-3xl shadow-2xl overflow-hidden font-sans flex flex-col"
      >
        {/* Google Search input bar */}
        <div className="flex items-center px-5 py-4 border-b border-[#f2f2f2] dark:border-[#2b2c2e] gap-3.5 bg-[#f6f8fc] dark:bg-[#282a2c]">
          <Search className="w-5 h-5 text-[#0b57d0] dark:text-[#a8c7fa] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search all inboxes or jump to..."
            className="w-full bg-transparent text-sm text-[#1f1f1f] dark:text-[#e3e3e3] placeholder-[#747775] outline-none font-medium"
          />
          <kbd className="text-[10px] text-[#747775] bg-white dark:bg-[#1e1f20] border border-[#e0e3e7] dark:border-[#444746] px-2 py-0.5 rounded font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 scrollbar-thin">
          {matchedActions.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold text-[#747775] uppercase tracking-wider">
                Commands
              </div>
              {matchedActions.map((action, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <div
                    key={action.id}
                    onClick={() => {
                      action.run();
                      setIsCommandPaletteOpen(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#d3e3fd] text-[#041e49] dark:bg-[#004a77] dark:text-[#c2e7ff] font-bold'
                        : 'text-[#444746] dark:text-[#c4c7c5] hover:bg-[#f6f8fc] dark:hover:bg-[#28292a]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div>{action.icon}</div>
                      <span>{action.title}</span>
                    </div>

                    {action.shortcut && (
                      <kbd
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                          isSelected
                            ? 'bg-white/40 text-[#041e49]'
                            : 'bg-black/5 dark:bg-white/10 text-[#747775]'
                        }`}
                      >
                        {action.shortcut}
                      </kbd>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {matchedEmails.length > 0 && (
            <div className="mt-2 pt-2 border-t border-[#f2f2f2] dark:border-[#2b2c2e]">
              <div className="px-3 py-1 text-[10px] font-bold text-[#747775] uppercase tracking-wider">
                Matching Conversations (All Inboxes)
              </div>
              {matchedEmails.map((thread, i) => {
                const itemIndex = matchedActions.length + i;
                const isSelected = selectedIndex === itemIndex;
                const acc = accounts.find(a => a.id === thread.accountId);

                return (
                  <div
                    key={thread.id}
                    onClick={() => {
                      selectThread(thread.id);
                      setIsCommandPaletteOpen(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#d3e3fd] text-[#041e49] dark:bg-[#004a77] dark:text-[#c2e7ff] font-bold'
                        : 'text-[#444746] dark:text-[#c4c7c5] hover:bg-[#f6f8fc] dark:hover:bg-[#28292a]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Mail className="w-4 h-4 shrink-0 text-[#0b57d0]" />
                      <div className="min-w-0">
                        <p className="font-semibold truncate text-xs">{thread.subject}</p>
                        <p
                          className={`text-[11px] truncate ${
                            isSelected ? 'text-[#041e49]' : 'text-[#747775]'
                          }`}
                        >
                          {thread.snippet}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <AccountBadge account={acc} size="xs" />
                      <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {totalItems === 0 && (
            <div className="py-8 text-center text-xs text-[#747775]">
              No matching commands or emails found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
