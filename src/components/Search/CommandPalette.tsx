import React, { useState, useEffect, useRef } from 'react';
import { useMail } from '../../context/MailContext';
import {
  Search,
  PenSquare,
  Inbox,
  Star,
  RefreshCw,
  Plus,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Mail,
  ArrowRight,
  Sparkles,
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
    settings,
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

  // Actions list
  const ACTIONS = [
    {
      id: 'act_compose',
      title: 'Compose New Email',
      shortcut: '⌘N',
      icon: <PenSquare className="w-4 h-4 text-blue-500" />,
      run: () => openCompose('new'),
    },
    {
      id: 'act_all_inboxes',
      title: 'Go to All Inboxes',
      shortcut: '⌘1',
      icon: <Inbox className="w-4 h-4 text-blue-500" />,
      run: () => setNavigation({ scope: 'all', folderType: 'inbox', title: 'All Inboxes' }),
    },
    {
      id: 'act_starred',
      title: 'Go to Starred',
      shortcut: '⌘2',
      icon: <Star className="w-4 h-4 text-amber-500" />,
      run: () => setNavigation({ scope: 'all', folderType: 'starred', title: 'All Starred' }),
    },
    {
      id: 'act_sync',
      title: 'Sync All Mailboxes Now',
      shortcut: '⌘R',
      icon: <RefreshCw className="w-4 h-4 text-emerald-500" />,
      run: () => syncAllAccounts(),
    },
    {
      id: 'act_add_account',
      title: 'Connect New Account...',
      shortcut: '',
      icon: <Plus className="w-4 h-4 text-purple-500" />,
      run: () => setIsAddAccountOpen(true),
    },
    {
      id: 'act_toggle_theme',
      title: 'Toggle Dark / Light Theme',
      shortcut: '⌘D',
      icon: <Moon className="w-4 h-4 text-indigo-400" />,
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
      title: 'Preferences & Settings...',
      shortcut: '⌘,',
      icon: <SettingsIcon className="w-4 h-4 text-slate-400" />,
      run: () => setIsSettingsOpen(true),
    },
  ];

  const matchedActions = ACTIONS.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  const matchedEmails = query.trim()
    ? filteredThreads.slice(0, 5)
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
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-start justify-center pt-24 px-4 select-none animate-in fade-in duration-150"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-xl bg-white/95 dark:bg-[#191b22]/95 backdrop-blur-2xl border border-black/12 dark:border-white/12 rounded-2xl shadow-2xl overflow-hidden font-sans flex flex-col"
      >
        {/* Search input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-black/8 dark:border-white/8 gap-3">
          <Search className="w-4 h-4 text-blue-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search all inboxes..."
            className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none"
          />
          <kbd className="text-[10px] text-slate-400 bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 scrollbar-thin">
          {/* Actions Section */}
          {matchedActions.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Quick Actions
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
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-black/4 dark:hover:bg-white/4'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={isSelected ? 'text-white' : ''}>{action.icon}</div>
                      <span>{action.title}</span>
                    </div>

                    {action.shortcut && (
                      <kbd
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-black/5 dark:bg-white/10 text-slate-400'
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

          {/* Email Results Section */}
          {matchedEmails.length > 0 && (
            <div className="mt-2 pt-2 border-t border-black/5 dark:border-white/5">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
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
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-black/4 dark:hover:bg-white/4'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold truncate text-xs">{thread.subject}</p>
                        <p
                          className={`text-[11px] truncate ${
                            isSelected ? 'text-blue-100' : 'text-slate-400'
                          }`}
                        >
                          {thread.snippet}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <AccountBadge account={acc} size="xs" />
                      <ArrowRight className="w-3 h-3 opacity-60" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {totalItems === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching commands or emails found.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-400 bg-slate-50/50 dark:bg-white/2">
          <span>Navigate with ↑ ↓, press Enter to select</span>
          <span className="font-semibold text-blue-500">MacMail Universal Command</span>
        </div>
      </div>
    </div>
  );
};
