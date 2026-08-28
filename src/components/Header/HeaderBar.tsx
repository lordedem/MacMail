import React, { useState, useRef, useEffect } from 'react';
import { useMail } from '../../context/MailContext';
import {
  Search,
  X,
  Settings as SettingsIcon,
  ChevronDown,
  Sun,
  Moon,
  Check,
} from 'lucide-react';

export const HeaderBar: React.FC = () => {
  const {
    navigation,
    setNavigation,
    searchFilter,
    setSearchFilter,
    clearSearch,
    accounts,
    setIsSettingsOpen,
    settings,
    updateSettings,
  } = useMail();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark') || settings.theme === 'dark';
    if (isDark) {
      root.classList.remove('dark');
      updateSettings({ theme: 'light' });
    } else {
      root.classList.add('dark');
      updateSettings({ theme: 'dark' });
    }
  };

  const handleSelectScope = (scope: 'all' | 'account', accountId?: string, name?: string) => {
    if (scope === 'all') {
      setNavigation({
        scope: 'all',
        folderType: 'inbox',
        title: 'All Inboxes',
      });
      setSearchFilter({ accountId: 'all' });
    } else if (accountId && name) {
      setNavigation({
        scope: 'account',
        accountId,
        folderType: 'inbox',
        title: `${name} - Inbox`,
      });
      setSearchFilter({ accountId });
    }
    setIsDropdownOpen(false);
  };

  const currentScopeLabel =
    navigation.scope === 'account' && navigation.accountId
      ? accounts.find(a => a.id === navigation.accountId)?.name || 'Account'
      : 'All inboxes';

  return (
    <header className="h-12 w-full flex items-center bg-white dark:bg-[#121316] border-b border-[#e5e7eb] dark:border-[#24262b] select-none shrink-0 transition-colors z-20">
      {/* 1. Left Brand / Window Controls (Width matching Sidebar) */}
      <div className="w-56 md:w-60 h-full flex items-center pl-20 pr-4 gap-2 border-r border-[#e5e7eb] dark:border-[#24262b] shrink-0 app-drag-region">
        {/* Brand Name */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[13.5px] font-bold tracking-tight text-[#1e293b] dark:text-[#f1f5f9] truncate">
            MacMail
          </span>
        </div>
      </div>

      {/* 2. Middle Search Bar */}
      <div className="flex-1 h-full flex items-center px-4 relative">
        <div className="flex items-center gap-2.5 w-full max-w-xl">
          <button
            onClick={() => {}}
            className="text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white transition-colors"
          >
            <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center shrink-0" />
          </button>

          <input
            type="text"
            value={searchFilter.query}
            onChange={e => setSearchFilter({ query: e.target.value })}
            placeholder="Search mail or jump to..."
            className="w-full bg-transparent text-[13px] text-[#0f172a] dark:text-[#f8fafc] placeholder-[#94a3b8] dark:placeholder-[#64748b] outline-none font-normal"
          />

          {searchFilter.query && (
            <button
              onClick={clearSearch}
              className="p-1 text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white rounded-full transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Right Action Tools */}
      <div className="h-full flex items-center pr-4 pl-2 gap-3 shrink-0 no-drag">
        {/* Inboxes Dropdown Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(prev => !prev)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#eef4ff] hover:bg-[#e0edff] dark:bg-[#1e293b] dark:hover:bg-[#283548] text-[#2563eb] dark:text-[#60a5fa] border border-[#bfdbfe] dark:border-[#334155] transition-all cursor-pointer shadow-2xs"
          >
            <span>{currentScopeLabel}</span>
            <ChevronDown className="w-3 h-3 text-[#2563eb] dark:text-[#60a5fa]" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1a1c22] border border-[#e2e8f0] dark:border-[#2e323b] rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in-50 zoom-in-95">
              <button
                onClick={() => handleSelectScope('all')}
                className="w-full px-3.5 py-2 text-left text-xs text-[#0f172a] dark:text-[#e2e8f0] hover:bg-[#f1f5f9] dark:hover:bg-[#252830] flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#2563eb]" />
                  <span className="font-medium">All inboxes</span>
                </div>
                {navigation.scope === 'all' && (
                  <Check className="w-3.5 h-3.5 text-[#2563eb] dark:text-[#60a5fa]" />
                )}
              </button>

              <div className="my-1 border-t border-[#f1f5f9] dark:border-[#2e323b]" />

              {accounts.map(acc => (
                <button
                  key={acc.id}
                  onClick={() => handleSelectScope('account', acc.id, acc.name)}
                  className="w-full px-3.5 py-2 text-left text-xs text-[#0f172a] dark:text-[#e2e8f0] hover:bg-[#f1f5f9] dark:hover:bg-[#252830] flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: acc.color }}
                    />
                    <span>{acc.name}</span>
                  </div>
                  {navigation.scope === 'account' && navigation.accountId === acc.id && (
                    <Check className="w-3.5 h-3.5 text-[#2563eb] dark:text-[#60a5fa]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="h-5 w-[1px] bg-[#e5e7eb] dark:border-r dark:border-[#2e323b]" />

        {/* Dark / Light Mode Switcher */}
        <button
          onClick={toggleTheme}
          className="p-1.5 text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white hover:bg-[#f1f5f9] dark:hover:bg-[#252830] rounded-lg transition-colors cursor-pointer"
          title={settings.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <Sun className="w-4 h-4 hidden dark:block text-[#f59e0b]" />
          <Moon className="w-4 h-4 block dark:hidden text-[#475569]" />
        </button>

        {/* Settings Gear */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-1.5 text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white hover:bg-[#f1f5f9] dark:hover:bg-[#252830] rounded-lg transition-colors cursor-pointer"
          title="Settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>

        {/* User Avatar Circle */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="w-7 h-7 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[11px] font-bold flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer shrink-0"
          title="Account profile (EK)"
        >
          EK
        </button>
      </div>
    </header>
  );
};
