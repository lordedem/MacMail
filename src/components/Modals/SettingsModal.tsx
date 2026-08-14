import React, { useState } from 'react';
import { useMail } from '../../context/MailContext';
import {
  X,
  Users,
  Sliders,
  Keyboard,
  Trash2,
  Moon,
  Sun,
  Laptop,
  Bell,
  Volume2,
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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-[#1e1f20] border border-[#e0e3e7] dark:border-[#333538] rounded-3xl shadow-2xl overflow-hidden flex flex-col font-sans h-[560px]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#f2f2f2] dark:border-[#2b2c2e] flex items-center justify-between">
          <h3 className="text-base font-medium text-[#1f1f1f] dark:text-[#e3e3e3]">Settings</h3>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-[#f0f4f9] dark:bg-[#282a2c] p-1 rounded-full">
            <button
              onClick={() => setActiveTab('accounts')}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                activeTab === 'accounts'
                  ? 'bg-white dark:bg-[#1e1f20] text-[#0b57d0] dark:text-[#a8c7fa] shadow-xs'
                  : 'text-[#444746] dark:text-[#c4c7c5] hover:text-[#1f1f1f]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Accounts</span>
            </button>

            <button
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                activeTab === 'general'
                  ? 'bg-white dark:bg-[#1e1f20] text-[#0b57d0] dark:text-[#a8c7fa] shadow-xs'
                  : 'text-[#444746] dark:text-[#c4c7c5] hover:text-[#1f1f1f]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>General</span>
            </button>

            <button
              onClick={() => setActiveTab('shortcuts')}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                activeTab === 'shortcuts'
                  ? 'bg-white dark:bg-[#1e1f20] text-[#0b57d0] dark:text-[#a8c7fa] shadow-xs'
                  : 'text-[#444746] dark:text-[#c4c7c5] hover:text-[#1f1f1f]'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Shortcuts</span>
            </button>
          </div>

          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 text-[#444746] hover:bg-[#f2f2f2] dark:hover:bg-[#28292a] rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {/* TAB 1: ACCOUNTS */}
          {activeTab === 'accounts' && (
            <div className="grid grid-cols-3 gap-6 h-full">
              {/* Account list */}
              <div className="border-r border-[#e0e3e7] dark:border-[#333538] pr-4 space-y-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#747775] uppercase">
                    Accounts ({accounts.length})
                  </span>
                  <button
                    onClick={() => {
                      setIsSettingsOpen(false);
                      setIsAddAccountOpen(true);
                    }}
                    className="text-xs text-[#0b57d0] dark:text-[#a8c7fa] font-bold hover:underline cursor-pointer"
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
                        ? 'bg-[#d3e3fd] dark:bg-[#004a77] text-[#041e49] dark:text-[#c2e7ff] font-bold'
                        : 'hover:bg-[#f2f2f2] dark:hover:bg-[#28292a] text-[#444746] dark:text-[#c4c7c5]'
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: acc.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate">{acc.name}</p>
                      <p className="text-[10px] text-[#747775] truncate">{acc.email}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Account Details & Signature */}
              <div className="col-span-2 space-y-4">
                {currentSelectedAccount ? (
                  <>
                    <div className="flex items-center justify-between pb-3 border-b border-[#f2f2f2] dark:border-[#2b2c2e]">
                      <div>
                        <h4 className="text-sm font-bold text-[#1f1f1f] dark:text-[#e3e3e3]">
                          {currentSelectedAccount.name}
                        </h4>
                        <p className="text-xs text-[#747775]">{currentSelectedAccount.email}</p>
                      </div>
                      <AccountBadge account={currentSelectedAccount} size="sm" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#444746] dark:text-[#c4c7c5] mb-1.5">
                        Signature
                      </label>
                      <textarea
                        defaultValue={currentSelectedAccount.signature || ''}
                        onChange={e => setSignatureText(e.target.value)}
                        rows={5}
                        placeholder="Best regards,\nYour Name"
                        className="w-full p-3 bg-white dark:bg-[#282a2c] border border-[#747775]/40 focus:border-[#0b57d0] rounded-xl text-xs text-[#1f1f1f] dark:text-[#e3e3e3] outline-none resize-none font-sans"
                      />
                      <button
                        onClick={handleSaveSignature}
                        className="mt-2 px-5 py-2 bg-[#0b57d0] hover:bg-[#0842a0] text-white font-medium text-xs rounded-full cursor-pointer shadow-xs"
                      >
                        Save changes
                      </button>
                    </div>

                    <div className="pt-4 border-t border-[#f2f2f2] dark:border-[#2b2c2e] flex items-center justify-between">
                      <span className="text-xs text-[#747775]">Remove account</span>
                      <button
                        onClick={() => {
                          if (confirm(`Remove account ${currentSelectedAccount.name}?`)) {
                            removeAccount(currentSelectedAccount.id);
                          }
                        }}
                        className="flex items-center gap-1.5 px-4 py-1.5 text-xs text-[#ea4335] hover:bg-[#fce8e6] dark:hover:bg-[#3b2020] rounded-full font-semibold transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-[#747775]">No account selected</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-6 max-w-lg">
              {/* Theme selection */}
              <div>
                <label className="block text-xs font-semibold text-[#444746] dark:text-[#c4c7c5] mb-2">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    onClick={() => {
                      document.documentElement.classList.remove('dark');
                      updateSettings({ theme: 'light' });
                    }}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-2 text-xs font-semibold cursor-pointer ${
                      settings.theme === 'light'
                        ? 'border-[#0b57d0] bg-[#eaf1fb] dark:bg-[#004a77]/40 text-[#041e49]'
                        : 'border-[#e0e3e7] dark:border-[#333538] text-[#444746]'
                    }`}
                  >
                    <Sun className="w-5 h-5 text-[#fbbc04]" />
                    <span>Light</span>
                  </button>

                  <button
                    onClick={() => {
                      document.documentElement.classList.add('dark');
                      updateSettings({ theme: 'dark' });
                    }}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-2 text-xs font-semibold cursor-pointer ${
                      settings.theme === 'dark'
                        ? 'border-[#0b57d0] bg-[#eaf1fb] dark:bg-[#004a77]/40 text-[#a8c7fa]'
                        : 'border-[#e0e3e7] dark:border-[#333538] text-[#444746]'
                    }`}
                  >
                    <Moon className="w-5 h-5 text-[#0b57d0]" />
                    <span>Dark</span>
                  </button>

                  <button
                    onClick={() => updateSettings({ theme: 'system' })}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-2 text-xs font-semibold cursor-pointer ${
                      settings.theme === 'system'
                        ? 'border-[#0b57d0] bg-[#eaf1fb] dark:bg-[#004a77]/40 text-[#0b57d0]'
                        : 'border-[#e0e3e7] dark:border-[#333538] text-[#444746]'
                    }`}
                  >
                    <Laptop className="w-5 h-5 text-[#747775]" />
                    <span>System</span>
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-[#747775]" />
                    <span className="text-xs font-medium text-[#1f1f1f] dark:text-[#e3e3e3]">
                      Sound notifications
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.soundEffects}
                    onChange={e => updateSettings({ soundEffects: e.target.checked })}
                    className="rounded text-[#0b57d0]"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#747775]" />
                    <span className="text-xs font-medium text-[#1f1f1f] dark:text-[#e3e3e3]">
                      Desktop notifications
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={e => updateSettings({ notifications: e.target.checked })}
                    className="rounded text-[#0b57d0]"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: KEYBOARD SHORTCUTS */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-4">
              <p className="text-xs text-[#747775]">
                Gmail standard keyboard shortcuts for fast mail triage.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-[#f6f8fc] dark:bg-[#282a2c] rounded-xl">
                  <span className="text-[#1f1f1f] dark:text-[#e3e3e3]">Older conversation</span>
                  <kbd className="px-2 py-0.5 bg-white dark:bg-[#1e1f20] border border-[#e0e3e7] dark:border-[#444746] rounded font-mono font-bold">
                    j or ↓
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-[#f6f8fc] dark:bg-[#282a2c] rounded-xl">
                  <span className="text-[#1f1f1f] dark:text-[#e3e3e3]">Newer conversation</span>
                  <kbd className="px-2 py-0.5 bg-white dark:bg-[#1e1f20] border border-[#e0e3e7] dark:border-[#444746] rounded font-mono font-bold">
                    k or ↑
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-[#f6f8fc] dark:bg-[#282a2c] rounded-xl">
                  <span className="text-[#1f1f1f] dark:text-[#e3e3e3]">Archive</span>
                  <kbd className="px-2 py-0.5 bg-white dark:bg-[#1e1f20] border border-[#e0e3e7] dark:border-[#444746] rounded font-mono font-bold">
                    e
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-[#f6f8fc] dark:bg-[#282a2c] rounded-xl">
                  <span className="text-[#1f1f1f] dark:text-[#e3e3e3]">Delete</span>
                  <kbd className="px-2 py-0.5 bg-white dark:bg-[#1e1f20] border border-[#e0e3e7] dark:border-[#444746] rounded font-mono font-bold">
                    #
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-[#f6f8fc] dark:bg-[#282a2c] rounded-xl">
                  <span className="text-[#1f1f1f] dark:text-[#e3e3e3]">Star / Rotate superstar</span>
                  <kbd className="px-2 py-0.5 bg-white dark:bg-[#1e1f20] border border-[#e0e3e7] dark:border-[#444746] rounded font-mono font-bold">
                    s
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-[#f6f8fc] dark:bg-[#282a2c] rounded-xl">
                  <span className="text-[#1f1f1f] dark:text-[#e3e3e3]">Mark unread</span>
                  <kbd className="px-2 py-0.5 bg-white dark:bg-[#1e1f20] border border-[#e0e3e7] dark:border-[#444746] rounded font-mono font-bold">
                    u
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-[#f6f8fc] dark:bg-[#282a2c] rounded-xl">
                  <span className="text-[#1f1f1f] dark:text-[#e3e3e3]">Compose</span>
                  <kbd className="px-2 py-0.5 bg-white dark:bg-[#1e1f20] border border-[#e0e3e7] dark:border-[#444746] rounded font-mono font-bold">
                    c
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-[#f6f8fc] dark:bg-[#282a2c] rounded-xl">
                  <span className="text-[#1f1f1f] dark:text-[#e3e3e3]">Reply</span>
                  <kbd className="px-2 py-0.5 bg-white dark:bg-[#1e1f20] border border-[#e0e3e7] dark:border-[#444746] rounded font-mono font-bold">
                    r
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-[#f6f8fc] dark:bg-[#282a2c] rounded-xl">
                  <span className="text-[#1f1f1f] dark:text-[#e3e3e3]">Search all mail</span>
                  <kbd className="px-2 py-0.5 bg-white dark:bg-[#1e1f20] border border-[#e0e3e7] dark:border-[#444746] rounded font-mono font-bold">
                    / or ⌘K
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
