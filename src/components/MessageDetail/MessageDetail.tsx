import React, { useState } from 'react';
import { useMail } from '../../context/MailContext';
import { Avatar } from '../Common/Avatar';
import { AccountBadge } from '../Common/AccountBadge';
import { IframeHtmlBody } from './IframeHtmlBody';
import {
  ArrowLeft,
  X,
  RotateCcw,
  Star,
  MoreHorizontal,
  Paperclip,
  Download,
  FileText,
  Image as ImageIcon,
  File,
  Send,
  Reply,
  Forward,
  Trash2,
  Archive,
  ChevronDown,
} from 'lucide-react';
import { format } from 'date-fns';

export const MessageDetail: React.FC = () => {
  const {
    selectedThread,
    filteredThreads,
    selectedThreadId,
    selectThread,
    archiveThread,
    trashThread,
    toggleStarThread,
    openCompose,
    accounts,
    showToast,
  } = useMail();

  const [showRecipientDetails, setShowRecipientDetails] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Pagination calculation: "1 of 4"
  const currentIndex = filteredThreads.findIndex(t => t.id === selectedThreadId);
  const totalCount = filteredThreads.length;
  const paginationLabel =
    currentIndex !== -1 && totalCount > 0 ? `${currentIndex + 1} of ${totalCount}` : '';

  const handlePrevThread = () => {
    if (currentIndex > 0) {
      selectThread(filteredThreads[currentIndex - 1].id);
    }
  };

  const handleNextThread = () => {
    if (currentIndex < totalCount - 1) {
      selectThread(filteredThreads[currentIndex + 1].id);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getAttachmentIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) return <ImageIcon className="w-4 h-4 text-[#10b981]" />;
    if (contentType.includes('pdf')) return <FileText className="w-4 h-4 text-[#ef4444]" />;
    return <File className="w-4 h-4 text-[#2563eb]" />;
  };

  return (
    <main className="flex-1 h-full flex flex-col bg-white dark:bg-[#121316] text-[#0f172a] dark:text-[#f8fafc] overflow-hidden font-sans transition-colors">
      {/* 1. Top Action Toolbar matching screenshot: [ ← ✕ ↺ ★ ··· ] ... [ 1 of 4 ] */}
      <header className="h-10 px-4 border-b border-[#e5e7eb] dark:border-[#24262b] flex items-center justify-between shrink-0 select-none bg-white dark:bg-[#121316]">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Back Arrow */}
          <button
            onClick={handlePrevThread}
            disabled={currentIndex <= 0}
            className="p-1.5 text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white disabled:opacity-30 hover:bg-[#f1f5f9] dark:hover:bg-[#1e2026] rounded-md transition-colors cursor-pointer"
            title="Previous message (or back)"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Close / Archive (✕) */}
          <button
            onClick={() => {
              if (selectedThread) {
                archiveThread(selectedThread.id);
              }
            }}
            disabled={!selectedThread}
            className="p-1.5 text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white disabled:opacity-30 hover:bg-[#f1f5f9] dark:hover:bg-[#1e2026] rounded-md transition-colors cursor-pointer"
            title="Archive / Close (✕)"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Reply / Refresh (↺) */}
          <button
            onClick={() => {
              if (selectedThread && selectedThread.messages.length > 0) {
                openCompose('reply', selectedThread.messages[selectedThread.messages.length - 1]);
              }
            }}
            disabled={!selectedThread}
            className="p-1.5 text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white disabled:opacity-30 hover:bg-[#f1f5f9] dark:hover:bg-[#1e2026] rounded-md transition-colors cursor-pointer"
            title="Reply (↺)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Star (★) */}
          <button
            onClick={() => {
              if (selectedThread) {
                toggleStarThread(selectedThread.id);
              }
            }}
            disabled={!selectedThread}
            className={`p-1.5 rounded-md transition-colors cursor-pointer disabled:opacity-30 ${
              selectedThread?.isStarred
                ? 'text-[#f59e0b]'
                : 'text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white hover:bg-[#f1f5f9] dark:hover:bg-[#1e2026]'
            }`}
            title="Star conversation"
          >
            <Star className={`w-4 h-4 ${selectedThread?.isStarred ? 'fill-current' : ''}`} />
          </button>

          {/* More actions (···) */}
          <div className="relative">
            <button
              onClick={() => setIsMoreMenuOpen(prev => !prev)}
              disabled={!selectedThread}
              className="p-1.5 text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white disabled:opacity-30 hover:bg-[#f1f5f9] dark:hover:bg-[#1e2026] rounded-md transition-colors cursor-pointer"
              title="More actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {isMoreMenuOpen && selectedThread && (
              <div className="absolute left-0 mt-1 w-44 bg-white dark:bg-[#1a1c22] border border-[#e2e8f0] dark:border-[#2e323b] rounded-xl shadow-xl py-1 z-50 animate-in fade-in-50">
                <button
                  onClick={() => {
                    openCompose('forward', selectedThread.messages[selectedThread.messages.length - 1]);
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full px-3.5 py-1.5 text-left text-xs text-[#0f172a] dark:text-[#e2e8f0] hover:bg-[#f1f5f9] dark:hover:bg-[#252830] flex items-center gap-2"
                >
                  <Forward className="w-3.5 h-3.5" />
                  <span>Forward</span>
                </button>
                <button
                  onClick={() => {
                    trashThread(selectedThread.id);
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full px-3.5 py-1.5 text-left text-xs text-[#ef4444] hover:bg-[#fef2f2] dark:hover:bg-[#381e1e] flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete message</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Pagination Indicator: "1 of 4" */}
        {paginationLabel && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#64748b] dark:text-[#94a3b8] font-medium">
              {paginationLabel}
            </span>
          </div>
        )}
      </header>

      {/* 2. Main Email Canvas */}
      {!selectedThread ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none text-[#94a3b8]">
          <p className="text-sm font-medium">No conversation selected</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl w-full mx-auto scrollbar-thin">
          {/* Email Subject Heading */}
          <div className="flex items-start justify-between gap-4 border-b border-[#f1f5f9] dark:border-[#1e2026] pb-4">
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-[#0f172a] dark:text-[#f8fafc] leading-tight">
                {selectedThread.subject || '(no subject)'}
              </h1>
            </div>

            <AccountBadge
              account={
                accounts.find(a => a.id === selectedThread.accountId) || {
                  name: selectedThread.accountName,
                  color: selectedThread.accountColor,
                }
              }
              size="sm"
            />
          </div>

          {/* Messages in Thread */}
          <div className="space-y-4">
            {selectedThread.messages.map((message, idx) => {
              const isLast = idx === selectedThread.messages.length - 1;

              return (
                <div
                  key={message.id}
                  className="bg-white dark:bg-[#16181d] border border-[#e2e8f0] dark:border-[#24262c] rounded-2xl p-5 shadow-2xs transition-all"
                >
                  {/* Message Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <Avatar
                        name={message.from.name}
                        email={message.from.email}
                        avatarUrl={message.from.avatarUrl}
                        size="md"
                      />

                      <div className="min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-sm text-[#0f172a] dark:text-[#f8fafc]">
                            {message.from.name}
                          </span>
                          <span className="text-xs text-[#64748b] dark:text-[#94a3b8] font-normal truncate hidden sm:inline">
                            &lt;{message.from.email}&gt;
                          </span>
                        </div>

                        <div className="text-xs text-[#64748b] dark:text-[#94a3b8] mt-0.5 flex items-center gap-1">
                          <span>to {message.to.map(t => t.name || t.email).join(', ')}</span>
                          <button
                            onClick={() => setShowRecipientDetails(prev => !prev)}
                            className="hover:text-[#0f172a] dark:hover:text-white cursor-pointer"
                          >
                            <ChevronDown className="w-3 h-3 inline" />
                          </button>
                        </div>

                        {showRecipientDetails && (
                          <div className="mt-2 p-3 bg-[#f8fafc] dark:bg-[#1c1e24] rounded-xl border border-[#e2e8f0] dark:border-[#2e323b] text-xs text-[#475569] dark:text-[#cbd5e1] space-y-1">
                            <p><strong>From:</strong> {message.from.name} &lt;{message.from.email}&gt;</p>
                            <p><strong>To:</strong> {message.to.map(t => `${t.name} <${t.email}>`).join(', ')}</p>
                            <p><strong>Date:</strong> {format(new Date(message.date), 'PPpp')}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <time className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                        {format(new Date(message.date), 'MMM d, yyyy, h:mm a')}
                      </time>

                      <button
                        onClick={() => openCompose('reply', message)}
                        className="p-1 text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white hover:bg-[#f1f5f9] dark:hover:bg-[#1e2026] rounded-md transition-colors"
                        title="Reply"
                      >
                        <Reply className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="mt-4 pt-3 border-t border-[#f1f5f9] dark:border-[#24262c] text-[13.5px] leading-relaxed text-[#334155] dark:text-[#cbd5e1]">
                    <IframeHtmlBody
                      htmlContent={message.bodyHtml || `<p>${message.bodyText.replace(/\n/g, '<br/>')}</p>`}
                      allowExternalImages={true}
                    />

                    {/* Attachments Section */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-[#f1f5f9] dark:border-[#24262c]">
                        <p className="text-xs font-bold text-[#475569] dark:text-[#94a3b8] mb-2.5">
                          {message.attachments.length} Attachment{message.attachments.length > 1 ? 's' : ''}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {message.attachments.map(att => (
                            <div
                              key={att.id}
                              onClick={() => {
                                showToast({
                                  type: 'info',
                                  title: 'Downloading file',
                                  message: att.filename,
                                });
                              }}
                              className="flex items-center justify-between p-2.5 bg-[#f8fafc] dark:bg-[#1c1e24] border border-[#e2e8f0] dark:border-[#2e323b] rounded-xl hover:shadow-2xs transition-all group cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="p-1.5 rounded-lg bg-white dark:bg-[#121316] border border-[#e2e8f0] dark:border-[#2e323b]">
                                  {getAttachmentIcon(att.contentType)}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-[#0f172a] dark:text-[#f8fafc] truncate">
                                    {att.filename}
                                  </p>
                                  <p className="text-[11px] text-[#64748b] dark:text-[#94a3b8]">
                                    {formatFileSize(att.size)}
                                  </p>
                                </div>
                              </div>

                              <button
                                className="p-1.5 text-[#64748b] group-hover:text-[#2563eb] hover:bg-white dark:hover:bg-[#121316] rounded-md transition-colors"
                                title="Download"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 pt-2">
            <button
              onClick={() =>
                openCompose(
                  'reply',
                  selectedThread.messages[selectedThread.messages.length - 1]
                )
              }
              className="flex items-center gap-2 px-5 py-2 bg-white dark:bg-[#1c1e24] hover:bg-[#f8fafc] dark:hover:bg-[#252830] border border-[#e2e8f0] dark:border-[#2e323b] text-[#334155] dark:text-[#cbd5e1] text-xs font-semibold rounded-full transition-colors cursor-pointer shadow-2xs"
            >
              <Reply className="w-3.5 h-3.5 text-[#2563eb]" />
              <span>Reply</span>
            </button>

            <button
              onClick={() =>
                openCompose(
                  'forward',
                  selectedThread.messages[selectedThread.messages.length - 1]
                )
              }
              className="flex items-center gap-2 px-5 py-2 bg-white dark:bg-[#1c1e24] hover:bg-[#f8fafc] dark:hover:bg-[#252830] border border-[#e2e8f0] dark:border-[#2e323b] text-[#334155] dark:text-[#cbd5e1] text-xs font-semibold rounded-full transition-colors cursor-pointer shadow-2xs"
            >
              <Forward className="w-3.5 h-3.5 text-[#64748b]" />
              <span>Forward</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
