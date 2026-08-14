import React, { useState } from 'react';
import { useMail } from '../../context/MailContext';
import { EmailMessage, Attachment, FolderType } from '../../types/mail';
import { Avatar } from '../Common/Avatar';
import { AccountBadge } from '../Common/AccountBadge';
import { IframeHtmlBody } from './IframeHtmlBody';
import {
  Reply,
  ReplyAll,
  Forward,
  Archive,
  Trash2,
  Star,
  Mail,
  MoreVertical,
  Paperclip,
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  File,
  Send,
  Maximize2,
  ChevronDown,
  ChevronUp,
  FolderInput,
  Printer,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';

export const MessageDetail: React.FC = () => {
  const {
    selectedThread,
    archiveThread,
    trashThread,
    toggleStarThread,
    markThreadRead,
    moveThreadToFolder,
    openCompose,
    accounts,
    showToast,
  } = useMail();

  const [expandedMessageIds, setExpandedMessageIds] = useState<Set<string>>(new Set());
  const [quickReplyText, setQuickReplyText] = useState('');
  const [quickReplyAccountId, setQuickReplyAccountId] = useState<string>('');
  const [allowImages, setAllowImages] = useState(true);

  if (!selectedThread) {
    return (
      <main className="flex-1 h-full flex flex-col items-center justify-center bg-white dark:bg-[#131418] text-slate-400 dark:text-slate-500 p-8 text-center select-none">
        <div className="w-16 h-16 rounded-2xl bg-black/4 dark:bg-white/4 flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 stroke-1 text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          No Conversation Selected
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs leading-relaxed">
          Select an email thread from the list or use <kbd className="px-1.5 py-0.5 bg-black/5 dark:bg-white/10 rounded font-mono text-[10px]">j</kbd> and <kbd className="px-1.5 py-0.5 bg-black/5 dark:bg-white/10 rounded font-mono text-[10px]">k</kbd> to navigate.
        </p>
      </main>
    );
  }

  const account = accounts.find(a => a.id === selectedThread.accountId) || {
    name: selectedThread.accountName,
    color: selectedThread.accountColor,
    email: '',
  };

  const messages = selectedThread.messages;
  const lastMessage = messages[messages.length - 1];

  const toggleExpandMessage = (msgId: string) => {
    setExpandedMessageIds(prev => {
      const next = new Set(prev);
      if (next.has(msgId)) next.delete(msgId);
      else next.add(msgId);
      return next;
    });
  };

  const handleQuickReplySend = () => {
    if (!quickReplyText.trim()) return;

    openCompose('reply', lastMessage);
    setQuickReplyText('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getAttachmentIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) return <ImageIcon className="w-4 h-4 text-emerald-500" />;
    if (contentType.includes('pdf')) return <FileText className="w-4 h-4 text-rose-500" />;
    return <File className="w-4 h-4 text-blue-500" />;
  };

  return (
    <main className="flex-1 h-full flex flex-col bg-white dark:bg-[#131418] text-slate-800 dark:text-slate-200 overflow-hidden font-sans">
      {/* Top Reading Toolbar */}
      <header className="h-13 px-5 border-b border-black/8 dark:border-white/8 flex items-center justify-between shrink-0 bg-white/80 dark:bg-[#131418]/80 backdrop-blur-md">
        <div className="flex items-center gap-1">
          <button
            onClick={() => archiveThread(selectedThread.id)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            title="Archive (e)"
          >
            <Archive className="w-4 h-4" />
            <span className="hidden sm:inline">Archive</span>
          </button>

          <button
            onClick={() => trashThread(selectedThread.id)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
            title="Trash (#)"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Trash</span>
          </button>

          <button
            onClick={() => markThreadRead(selectedThread.id, !selectedThread.isRead)}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            title="Toggle Unread (u)"
          >
            <Mail className="w-4 h-4" />
          </button>

          <button
            onClick={() => toggleStarThread(selectedThread.id)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedThread.isStarred
                ? 'text-amber-500'
                : 'text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            title="Star (s)"
          >
            <Star className={`w-4 h-4 ${selectedThread.isStarred ? 'fill-current' : ''}`} />
          </button>

          <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 mx-1" />

          {/* Move to folder dropdown */}
          <select
            onChange={e => {
              if (e.target.value) {
                moveThreadToFolder(selectedThread.id, e.target.value as FolderType);
                e.target.value = '';
              }
            }}
            defaultValue=""
            className="text-xs bg-black/4 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-lg px-2 py-1 outline-none cursor-pointer hover:bg-black/8 dark:hover:bg-white/10"
          >
            <option value="" disabled>
              Move to...
            </option>
            <option value="inbox">Inbox</option>
            <option value="archive">Archive</option>
            <option value="trash">Trash</option>
          </select>
        </div>

        {/* Action icons right */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openCompose('reply', lastMessage)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Reply className="w-3.5 h-3.5" />
            <span>Reply</span>
          </button>

          <button
            onClick={() => openCompose('reply-all', lastMessage)}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            title="Reply All (a)"
          >
            <ReplyAll className="w-4 h-4" />
          </button>

          <button
            onClick={() => openCompose('forward', lastMessage)}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            title="Forward (f)"
          >
            <Forward className="w-4 h-4" />
          </button>

          <button
            onClick={() => window.print()}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            title="Print Conversation"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Email Thread Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl w-full mx-auto scrollbar-thin">
        {/* Thread Header: Subject & Tags */}
        <div className="flex flex-col gap-2 border-b border-black/5 dark:border-white/5 pb-4">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-snug">
              {selectedThread.subject || '(No Subject)'}
            </h1>

            {/* Account Badge Header */}
            <AccountBadge account={account} size="md" />
          </div>

          {/* Labels & Tags */}
          {selectedThread.labels.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {selectedThread.labels.map(lbl => (
                <span
                  key={lbl}
                  className="px-2 py-0.5 bg-black/4 dark:bg-white/6 text-slate-600 dark:text-slate-400 text-[11px] font-medium rounded-md"
                >
                  {lbl}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Message Thread List */}
        <div className="space-y-4">
          {messages.map((message, idx) => {
            const isLast = idx === messages.length - 1;
            const isManuallyExpanded = expandedMessageIds.has(message.id);
            const isExpanded = isLast || isManuallyExpanded;

            return (
              <article
                key={message.id}
                className="bg-[#fcfdfe] dark:bg-[#191b22] border border-black/8 dark:border-white/8 rounded-2xl p-5 shadow-xs transition-all"
              >
                {/* Message Header */}
                <div
                  onClick={() => !isLast && toggleExpandMessage(message.id)}
                  className={`flex items-start justify-between gap-3 ${
                    !isLast ? 'cursor-pointer' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                      name={message.from.name}
                      email={message.from.email}
                      avatarUrl={message.from.avatarUrl}
                      size="md"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                          {message.from.name}
                        </h3>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono truncate hidden sm:inline">
                          &lt;{message.from.email}&gt;
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        to {message.to.map(t => t.name || t.email).join(', ')}
                        {message.cc && message.cc.length > 0 && (
                          <span> (cc: {message.cc.map(c => c.name || c.email).join(', ')})</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <time className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      {format(new Date(message.date), 'MMM d, yyyy, h:mm a')}
                    </time>

                    {!isLast && (
                      <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Collapsed Snippet */}
                {!isExpanded && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 truncate pl-12">
                    {message.snippet}
                  </p>
                )}

                {/* Expanded Body */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 space-y-4">
                    {/* HTML Body via safe iframe */}
                    <div className="prose dark:prose-invert max-w-none text-sm">
                      <IframeHtmlBody
                        htmlContent={message.bodyHtml || `<p>${message.bodyText.replace(/\n/g, '<br/>')}</p>`}
                        allowExternalImages={allowImages}
                      />
                    </div>

                    {/* Attachments Section */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                          <Paperclip className="w-3.5 h-3.5" />
                          <span>
                            {message.attachments.length} Attachment
                            {message.attachments.length > 1 ? 's' : ''}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {message.attachments.map(att => (
                            <div
                              key={att.id}
                              className="flex items-center justify-between p-2.5 bg-white dark:bg-[#20232e] border border-black/8 dark:border-white/8 rounded-xl hover:border-blue-500/40 transition-colors group"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="p-2 rounded-lg bg-black/4 dark:bg-white/4">
                                  {getAttachmentIcon(att.contentType)}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                                    {att.filename}
                                  </p>
                                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                                    {formatFileSize(att.size)}
                                  </p>
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  showToast({
                                    type: 'info',
                                    title: 'Downloading file',
                                    message: att.filename,
                                  });
                                }}
                                className="p-1.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
                                title="Download Attachment"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Quick Inline Reply Card */}
        <div className="bg-[#fbfbfd] dark:bg-[#191b22] border border-black/8 dark:border-white/8 rounded-2xl p-4 shadow-xs mt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Reply from:</span>
              <select
                value={quickReplyAccountId || selectedThread.accountId}
                onChange={e => setQuickReplyAccountId(e.target.value)}
                className="bg-white dark:bg-[#20232e] text-slate-700 dark:text-slate-200 font-semibold px-2.5 py-1 rounded-lg border border-black/8 dark:border-white/8 text-xs outline-none cursor-pointer"
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.email})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => openCompose('reply', lastMessage)}
              className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Composer</span>
            </button>
          </div>

          <textarea
            value={quickReplyText}
            onChange={e => setQuickReplyText(e.target.value)}
            placeholder={`Reply to ${lastMessage.from.name}... (Cmd+Enter to send)`}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleQuickReplySend();
              }
            }}
            rows={3}
            className="w-full p-3 bg-white dark:bg-[#20232e] border border-black/8 dark:border-white/8 focus:border-blue-500 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none resize-y transition-all"
          />

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5 dark:border-white/5">
            <span className="text-[10px] text-slate-400 font-mono">
              Press ⌘ + Enter to send
            </span>

            <button
              onClick={handleQuickReplySend}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Reply</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
