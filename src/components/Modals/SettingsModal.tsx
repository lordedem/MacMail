import React, { useState } from 'react';
import { useMail } from '../../context/MailContext';
import {
  X,
  Users,
  Sliders,
  Keyboard,
  Trash2,
  Check,
  Moon,
  Sun,
  Laptop,
  Bell,
  Volume2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { AccountBadge } from '../Common/AccountBadge';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    accounts,
    removeAccount,
    updateAccount,
    settings,
    updateSettings,
    setIsAddAccountOpen,
  } = useMail();

  const [activeTab, setActiveTab] = useState<'accounts' | 'general' | 'shortcuts'>('accounts');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || '');
  const [signatureText, setSignatureText] = useState<string>('');

  if (!isSettingsOpen) return null;

  const currentSelectedAccount = accounts.find(a => a.id === selectedAccountId) || accounts[0];

  const handleSaveSignature = () => {
    if (currentSelectedAccount) {
      updateAccount(currentSelectedAccount.id, { signature: signatureText });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-[#191b22] border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans h-[560px]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-black/8 dark:border-white/8 flex items-center justify-between bg-[#fbfbfd] dark:bg-[#1e2029]">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Preferences</h3>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-black/4 dark:bg-white/6 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('accounts')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'accounts'
                  ? 'bg-white dark:bg-[#191b22] text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Accounts</span>
            </button>

            <button
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'general'
                  ? 'bg-white dark:bg-[#191b22] text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>General</span>
            </button>

            <button
              onClick={() => setActiveTab('shortcuts')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'shortcuts'
                  ? 'bg-white dark:bg-[#191b22] text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Shortcuts</span>
            </button>
          </div>

          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {/* TAB 1: ACCOUNTS */}
          {activeTab === 'accounts' && (
            <div className="grid grid-cols-3 gap-6 h-full">
              {/* Account list */}
              <div className="border-r border-black/8 dark:border-white/8 pr-4 space-y-1.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    Connected ({accounts.length})
                  </span>
                  <button
                    onClick={() => {
                      setIsSettingsOpen(false);
                      setIsAddAccountOpen(true);
                    }}
                    className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                  >
                    + Add
                  </button>
                </div>

                {accounts.map(acc => (
                  <button
                    key={acc.id}
                    onClick={() => {
                      setSelectedAccountId(acc.id);
                      setSignatureText(acc.signature || '');
                    }}
                    className={`flex items-center gap-2.5 w-full p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                      (selectedAccountId || accounts[0]?.id) === acc.id
                        ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'hover:bg-black/4 dark:hover:bg-white/4 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: acc.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate">{acc.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{acc.email}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Account Details & Signature */}
              <div className="col-span-2 space-y-4">
                {currentSelectedAccount ? (
                  <>
                    <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {currentSelectedAccount.name}
                        </h4>
                        <p className="text-xs text-slate-400">{currentSelectedAccount.email}</p>
                      </div>
                      <AccountBadge account={currentSelectedAccount} size="sm" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Email Signature
                      </label>
                      <textarea
                        defaultValue={currentSelectedAccount.signature || ''}
                        onChange={e => setSignatureText(e.target.value)}
                        rows={5}
                        placeholder="Best regards,\nYour Name"
                        className="w-full p-3 bg-black/4 dark:bg-white/4 border border-black/8 dark:border-white/8 focus:border-blue-500 rounded-xl text-xs text-slate-800 dark:text-slate-100 outline-none resize-none font-mono"
                      />
                      <button
                        onClick={handleSaveSignature}
                        className="mt-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer"
                      >
                        Save Signature
                      </button>
                    </div>

                    <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Remove from MacMail</span>
                      <button
                        onClick={() => {
                          if (confirm(`Remove account ${currentSelectedAccount.name}?`)) {
                            removeAccount(currentSelectedAccount.id);
                          }
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl font-semibold transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Account</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-slate-400">No account selected</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-6 max-w-lg">
              {/* Theme selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Theme Appearance
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    onClick={() => {
                      document.documentElement.classList.remove('dark');
                      updateSettings({ theme: 'light' });
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold cursor-pointer ${
                      settings.theme === 'light'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600'
                        : 'border-black/8 dark:border-white/8 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Sun className="w-5 h-5 text-amber-500" />
                    <span>Light Mode</span>
                  </button>

                  <button
                    onClick={() => {
                      document.documentElement.classList.add('dark');
                      updateSettings({ theme: 'dark' });
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold cursor-pointer ${
                      settings.theme === 'dark'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600'
                        : 'border-black/8 dark:border-white/8 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Moon className="w-5 h-5 text-indigo-400" />
                    <span>Dark Mode</span>
                  </button>

                  <button
                    onClick={() => updateSettings({ theme: 'system' })}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold cursor-pointer ${
                      settings.theme === 'system'
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600'
                        : 'border-black/8 dark:border-white/8 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Laptop className="w-5 h-5 text-slate-400" />
                    <span>System Theme</span>
                  </button>
                </div>
              </div>

              {/* Snippet Preview Lines */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Message Preview Lines
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map(lines => (
                    <button
                      key={lines}
                      onClick={() => updateSettings({ snippetLines: lines })}
                      className={`px-4 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                        settings.snippetLines === lines
                          ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                          : 'border-black/8 dark:border-white/8 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {lines} {lines === 1 ? 'Line' : 'Lines'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Sound Effects
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.soundEffects}
                    onChange={e => updateSettings({ soundEffects: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      System Notifications
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={e => updateSettings({ notifications: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: KEYBOARD SHORTCUTS */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                MacMail supports Superhuman & Apple Mail standard shortcuts for high-efficiency email triage.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-black/4 dark:bg-white/4 rounded-xl">
                  <span className="text-slate-700 dark:text-slate-300">Navigate down</span>
                  <kbd className="px-2 py-0.5 bg-white dark:bg-[#191b22] border border-black/10 dark:border-white/10 rounded font-mono font-bold shadow-2xs">
                    j or ↓
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-black/4 dark:bg-white/4 rounded-xl">
                  <span className="text-slate-700 dark:text-slate-300">Navigate up</span>
                  <kbd className="px-2 py-0.5 bg-white dark:bg-[#191b22] border border-black/10 dark:border-white/10 rounded font-mono font-bold shadow-2xs">
                    k or ↑
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-black/4 dark:bg-white/4 rounded-xl">
                  <span className="text-slate-700 dark:text-slate-300">Archive message</span>
                  <kbd className="px-2 py-0.5 bg-white dark:bg-[#191b22] border border-black/10 dark:border-white/10 rounded font-mono font-bold shadow-2xs">
                    e
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-black/4 dark:bg-white/4 rounded-xl">
                  <span className="text-slate-700 dark:text-slate-300">Delete / Trash</span>
                  <kbd className="px-2 py-0.5 bg-white dark:bg-[#191b22] border border-black/10 dark:border-white/10 rounded font-mono font-bold shadow-2xs">
                    # or ⌫
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-black/4 dark:bg-white/4 rounded-xl">
                  <span className="text-slate-700 dark:text-slate-300">Toggle Star / Flag</span>
                  <kbd className="px-2 py-0.5 bg-white dark:bg-[#191b22] border border-black/10 dark:border-white/10 rounded font-mono font-bold shadow-2xs">
                    s
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-black/4 dark:bg-white/4 rounded-xl">
                  <span className="text-slate-700 dark:text-slate-300">Mark Read / Unread</span>
                  <kbd className="px-2 py-0.5 bg-white dark:bg-[#191b22] border border-black/10 dark:border-white/10 rounded font-mono font-bold shadow-2xs">
                    u
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-black/4 dark:bg-white/4 rounded-xl">
                  <span className="text-slate-700 dark:text-slate-300">Compose New</span>
                  <kbd className="px-2 py-0.5 bg-white dark:bg-[#191b22] border border-black/10 dark:border-white/10 rounded font-mono font-bold shadow-2xs">
                    ⌘N or c
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-black/4 dark:bg-white/4 rounded-xl">
                  <span className="text-slate-700 dark:text-slate-300">Reply</span>
                  <kbd className="px-2 py-0.5 bg-white dark:bg-[#191b22] border border-black/10 dark:border-white/10 rounded font-mono font-bold shadow-2xs">
                    r
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-black/4 dark:bg-white/4 rounded-xl">
                  <span className="text-slate-700 dark:text-slate-300">Global Command Palette</span>
                  <kbd className="px-2 py-0.5 bg-white dark:bg-[#191b22] border border-black/10 dark:border-white/10 rounded font-mono font-bold shadow-2xs">
                    ⌘K
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-black/4 dark:bg-white/4 rounded-xl">
                  <span className="text-slate-700 dark:text-slate-300">Sync All Inboxes</span>
                  <kbd className="px-2 py-0.5 bg-white dark:bg-[#191b22] border border-black/10 dark:border-white/10 rounded font-mono font-bold shadow-2xs">
                    ⌘R
                  </kbd>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
