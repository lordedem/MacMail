import React, { useEffect } from 'react';
import { useMail } from './context/MailContext';
import { HeaderBar } from './components/Header/HeaderBar';
import { Sidebar } from './components/Sidebar/Sidebar';
import { MessageList } from './components/MessageList/MessageList';
import { MessageDetail } from './components/MessageDetail/MessageDetail';
import { ComposeModal } from './components/Compose/ComposeModal';
import { AddAccountModal } from './components/Modals/AddAccountModal';
import { SettingsModal } from './components/Modals/SettingsModal';
import { CommandPalette } from './components/Search/CommandPalette';
import { ToastContainer } from './components/Common/ToastContainer';

export const App: React.FC = () => {
  const {
    filteredThreads,
    selectedThreadId,
    selectThread,
    archiveThread,
    trashThread,
    toggleStarThread,
    markThreadRead,
    openCompose,
    syncAllAccounts,
    setIsCommandPaletteOpen,
    isCommandPaletteOpen,
    composeState,
    isAddAccountOpen,
    isSettingsOpen,
    settings,
  } = useMail();

  // Apply Theme
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System mode
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) root.classList.add('dark');
      else root.classList.remove('dark');
    }
  }, [settings.theme]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInput =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement?.getAttribute('contenteditable') === 'true';

      // Always allow Cmd+K, Cmd+N, Cmd+R
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        openCompose('new');
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        syncAllAccounts();
        return;
      }

      // If user is inside an open modal or input field, ignore single letter shortcuts
      if (isInput || isCommandPaletteOpen || composeState.isOpen || isAddAccountOpen || isSettingsOpen) {
        return;
      }

      const currentIndex = filteredThreads.findIndex(t => t.id === selectedThreadId);

      // j or Down: Navigate down
      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentIndex < filteredThreads.length - 1) {
          selectThread(filteredThreads[currentIndex + 1].id);
        }
      }
      // k or Up: Navigate up
      else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentIndex > 0) {
          selectThread(filteredThreads[currentIndex - 1].id);
        }
      }
      // e: Archive
      else if (e.key === 'e' && selectedThreadId) {
        e.preventDefault();
        archiveThread(selectedThreadId);
      }
      // #: Delete / Trash
      else if (e.key === '#' && selectedThreadId) {
        e.preventDefault();
        trashThread(selectedThreadId);
      }
      // s: Star
      else if (e.key === 's' && selectedThreadId) {
        e.preventDefault();
        toggleStarThread(selectedThreadId);
      }
      // u: Toggle Read
      else if (e.key === 'u' && selectedThreadId) {
        e.preventDefault();
        const cur = filteredThreads.find(t => t.id === selectedThreadId);
        if (cur) markThreadRead(selectedThreadId, !cur.isRead);
      }
      // c: Compose
      else if (e.key === 'c') {
        e.preventDefault();
        openCompose('new');
      }
      // r: Reply
      else if (e.key === 'r' && selectedThreadId) {
        e.preventDefault();
        const cur = filteredThreads.find(t => t.id === selectedThreadId);
        if (cur && cur.messages.length > 0) {
          openCompose('reply', cur.messages[cur.messages.length - 1]);
        }
      }
      // a: Reply All
      else if (e.key === 'a' && selectedThreadId) {
        e.preventDefault();
        const cur = filteredThreads.find(t => t.id === selectedThreadId);
        if (cur && cur.messages.length > 0) {
          openCompose('reply-all', cur.messages[cur.messages.length - 1]);
        }
      }
      // f: Forward
      else if (e.key === 'f' && selectedThreadId) {
        e.preventDefault();
        const cur = filteredThreads.find(t => t.id === selectedThreadId);
        if (cur && cur.messages.length > 0) {
          openCompose('forward', cur.messages[cur.messages.length - 1]);
        }
      }
      // /: Focus search
      else if (e.key === '/') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    filteredThreads,
    selectedThreadId,
    selectThread,
    archiveThread,
    trashThread,
    toggleStarThread,
    markThreadRead,
    openCompose,
    syncAllAccounts,
    setIsCommandPaletteOpen,
    isCommandPaletteOpen,
    composeState.isOpen,
    isAddAccountOpen,
    isSettingsOpen,
  ]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#fafafa] dark:bg-[#121316] text-[#0f172a] dark:text-[#f8fafc] antialiased select-none font-sans">
      {/* Top Header Bar across all 3 columns */}
      <HeaderBar />

      {/* 3-Column Body */}
      <div className="flex-1 flex flex-row overflow-hidden min-h-0">
        {/* Column 1: Sidebar Navigation */}
        <Sidebar />

        {/* Column 2: Message List Feed */}
        <MessageList />

        {/* Column 3: Message Detail Canvas */}
        <MessageDetail />
      </div>

      {/* Modals & Overlays */}
      <ComposeModal />
      <AddAccountModal />
      <SettingsModal />
      <CommandPalette />
      <ToastContainer />
    </div>
  );
};
