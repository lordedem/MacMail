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
  Printer,
  ChevronDown,
  ChevronUp,
  Tag,
  AlertOctagon,
  Clock,
  FolderInput,
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
  const [showRecipientDetails, setShowRecipientDetails] = useState(false);

  if (!selectedThread) {
    return (
      <main className="flex-1 h-full flex flex-col items-center justify-center bg-white dark:bg-[#131314] text-[#747775] dark:text-[#8e918f] p-8 text-center select-none">
        <div className="w-16 h-16 rounded-full bg-[#f6f8fc] dark:bg-[#1e1f20] flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-[#444746] dark:text-[#c4c7c5] stroke-1" />
        </div>
        <h3 className="text-sm font-medium text-[#1f1f1f] dark:text-[#e3e3e3]">
          No conversation selected
        </h3>
        <p className="text-xs text-[#747775] dark:text-[#8e918f] mt-1 max-w-xs">
          Select an email to read details or compose a new message.
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
    if (contentType.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-[#34a853]" />;
    if (contentType.includes('pdf')) return <FileText className="w-5 h-5 text-[#ea4335]" />;
    return <File className="w-5 h-5 text-[#0b57d0]" />;
  };

  return (
    <main className="flex-1 h-full flex flex-col bg-white dark:bg-[#131314] text-[#1f1f1f] dark:text-[#e3e3e3] overflow-hidden font-sans">
      {/* Gmail Top Action Toolbar */}
      <header className="h-12 px-4 border-b border-[#e0e3e7] dark:border-[#333538] flex items-center justify-between shrink-0 bg-[#f6f8fc] dark:bg-[#1e1f20] text-[#444746] dark:text-[#c4c7c5]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => archiveThread(selectedThread.id)}
            className="p-2 hover:bg-[#e9eef6] dark:hover:bg-[#28292a] hover:text-[#1f1f1f] dark:hover:text-white rounded-full transition-colors cursor-pointer"
            title="Archive"
          >
            <Archive className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              showToast({ type: 'warning', title: 'Reported as spam' });
              archiveThread(selectedThread.id);
            }}
            className="p-2 hover:bg-[#e9eef6] dark:hover:bg-[#28292a] hover:text-[#1f1f1f] dark:hover:text-white rounded-full transition-colors cursor-pointer"
            title="Report spam"
          >
            <AlertOctagon className="w-4 h-4" />
          </button>

          <button
            onClick={() => trashThread(selectedThread.id)}
            className="p-2 hover:bg-[#fce8e6] dark:hover:bg-[#3b2020] text-[#444746] dark:text-[#c4c7c5] hover:text-[#ea4335] rounded-full transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-[#e0e3e7] dark:bg-[#333538] mx-1" />

          <button
            onClick={() => markThreadRead(selectedThread.id, !selectedThread.isRead)}
            className="p-2 hover:bg-[#e9eef6] dark:hover:bg-[#28292a] hover:text-[#1f1f1f] dark:hover:text-white rounded-full transition-colors cursor-pointer"
            title="Mark as unread"
          >
            <Mail className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              showToast({ type: 'info', title: 'Snoozed until tomorrow 8:00 AM' });
              archiveThread(selectedThread.id);
            }}
            className="p-2 hover:bg-[#e9eef6] dark:hover:bg-[#28292a] hover:text-[#1f1f1f] dark:hover:text-white rounded-full transition-colors cursor-pointer"
            title="Snooze"
          >
            <Clock className="w-4 h-4" />
          </button>

          {/* Move to folder */}
          <select
            onChange={e => {
              if (e.target.value) {
                moveThreadToFolder(selectedThread.id, e.target.value as FolderType);
                e.target.value = '';
              }
            }}
            defaultValue=""
            className="text-xs bg-transparent text-[#444746] dark:text-[#c4c7c5] hover:text-[#1f1f1f] dark:hover:text-white rounded-md px-2 py-1 outline-none cursor-pointer"
          >
            <option value="" disabled>
              Move to...
            </option>
            <option value="inbox">Inbox</option>
            <option value="archive">Archive</option>
            <option value="trash">Trash</option>
          </select>
        </div>

        {/* Right tools */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => window.print()}
            className="p-2 hover:bg-[#e9eef6] dark:hover:bg-[#28292a] hover:text-[#1f1f1f] dark:hover:text-white rounded-full transition-colors cursor-pointer"
            title="Print all"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={() => toggleStarThread(selectedThread.id)}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              selectedThread.isStarred
                ? 'text-[#fbbc04]'
                : 'hover:bg-[#e9eef6] dark:hover:bg-[#28292a]'
            }`}
            title="Star"
          >
            <Star className={`w-4 h-4 ${selectedThread.isStarred ? 'fill-current' : ''}`} />
          </button>
        </div>
      </header>

      {/* Main Email Thread Canvas */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl w-full mx-auto scrollbar-thin">
        {/* Subject Heading */}
        <div className="flex items-start justify-between gap-4 border-b border-[#f2f2f2] dark:border-[#2b2c2e] pb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-normal text-[#1f1f1f] dark:text-[#e3e3e3] leading-snug">
              {selectedThread.subject || '(no subject)'}
            </h1>
            <span className="px-2 py-0.5 bg-[#e0e2e6] dark:bg-[#333538] text-[#444746] dark:text-[#c4c7c5] text-[11px] font-medium rounded-md">
              Inbox
            </span>
          </div>

          <AccountBadge account={account} size="sm" />
        </div>

        {/* Message Thread List */}
        <div className="space-y-4">
          {messages.map((message, idx) => {
            const isLast = idx === messages.length - 1;
            const isManuallyExpanded = expandedMessageIds.has(message.id);
            const isExpanded = isLast || isManuallyExpanded;

            return (
              <div
                key={message.id}
                className="bg-white dark:bg-[#1e1f20] border border-[#e0e3e7] dark:border-[#333538] rounded-2xl p-5 transition-all"
              >
                {/* Header */}
                <div
                  onClick={() => !isLast && toggleExpandMessage(message.id)}
                  className={`flex items-start justify-between gap-3 ${
                    !isLast ? 'cursor-pointer' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <Avatar
                      name={message.from.name}
                      email={message.from.email}
                      avatarUrl={message.from.avatarUrl}
                      size="md"
                    />

                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-sm text-[#1f1f1f] dark:text-[#e3e3e3]">
                          {message.from.name}
                        </span>
                        <span className="text-xs text-[#747775] font-normal truncate hidden sm:inline">
                          &lt;{message.from.email}&gt;
                        </span>
                      </div>

                      <div className="text-xs text-[#747775] mt-0.5 flex items-center gap-1">
                        <span>to {message.to.map(t => t.name || t.email).join(', ')}</span>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setShowRecipientDetails(prev => !prev);
                          }}
                          className="hover:text-[#1f1f1f] dark:hover:text-white"
                        >
                          <ChevronDown className="w-3 h-3 inline" />
                        </button>
                      </div>

                      {showRecipientDetails && (
                        <div className="mt-2 p-3 bg-[#f6f8fc] dark:bg-[#282a2c] rounded-xl border border-[#e0e3e7] dark:border-[#333538] text-xs text-[#444746] dark:text-[#c4c7c5] space-y-1">
                          <p><strong>From:</strong> {message.from.name} &lt;{message.from.email}&gt;</p>
                          <p><strong>To:</strong> {message.to.map(t => `${t.name} <${t.email}>`).join(', ')}</p>
                          {message.cc && message.cc.length > 0 && (
                            <p><strong>Cc:</strong> {message.cc.map(c => `${c.name} <${c.email}>`).join(', ')}</p>
                          )}
                          <p><strong>Date:</strong> {format(new Date(message.date), 'PPpp')}</p>
                          <p><strong>Security:</strong> Standard encryption (TLS)</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <time className="text-xs text-[#747775]">
                      {format(new Date(message.date), 'MMM d, yyyy, h:mm a')}
                    </time>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        openCompose('reply', message);
                      }}
                      className="p-1.5 hover:bg-[#f2f2f2] dark:hover:bg-[#28292a] text-[#444746] dark:text-[#c4c7c5] rounded-full transition-colors"
                      title="Reply"
                    >
                      <Reply className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Collapsed Snippet */}
                {!isExpanded && (
                  <p className="text-xs text-[#747775] mt-2 truncate pl-11">
                    {message.snippet}
                  </p>
                )}

                {/* Expanded Message Body */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-[#f2f2f2] dark:border-[#2b2c2e] space-y-4">
                    <IframeHtmlBody
                      htmlContent={message.bodyHtml || `<p>${message.bodyText.replace(/\n/g, '<br/>')}</p>`}
                      allowExternalImages={true}
                    />

                    {/* Google Drive Style Attachments Section */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-[#f2f2f2] dark:border-[#2b2c2e]">
                        <p className="text-xs font-bold text-[#444746] dark:text-[#c4c7c5] mb-3">
                          {message.attachments.length} Attachment{message.attachments.length > 1 ? 's' : ''}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {message.attachments.map(att => (
                            <div
                              key={att.id}
                              className="flex items-center justify-between p-3 bg-[#f6f8fc] dark:bg-[#282a2c] border border-[#e0e3e7] dark:border-[#333538] rounded-xl hover:shadow-sm transition-all group cursor-pointer"
                              onClick={() => {
                                showToast({
                                  type: 'info',
                                  title: 'Downloading file',
                                  message: att.filename,
                                });
                              }}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2 rounded-lg bg-white dark:bg-[#1e1f20]">
                                  {getAttachmentIcon(att.contentType)}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-[#1f1f1f] dark:text-[#e3e3e3] truncate">
                                    {att.filename}
                                  </p>
                                  <p className="text-[11px] text-[#747775]">
                                    {formatFileSize(att.size)}
                                  </p>
                                </div>
                              </div>

                              <button
                                className="p-2 text-[#444746] group-hover:text-[#0b57d0] hover:bg-white dark:hover:bg-[#1e1f20] rounded-full transition-colors"
                                title="Download"
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
              </div>
            );
          })}
        </div>

        {/* Gmail Bottom Action Pills (Reply / Forward) */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => openCompose('reply', lastMessage)}
            className="flex items-center gap-2 px-6 py-2 border border-[#747775]/50 hover:bg-[#f6f8fc] dark:hover:bg-[#28292a] text-[#444746] dark:text-[#c4c7c5] text-xs font-semibold rounded-full transition-colors cursor-pointer"
          >
            <Reply className="w-4 h-4" />
            <span>Reply</span>
          </button>

          <button
            onClick={() => openCompose('forward', lastMessage)}
            className="flex items-center gap-2 px-6 py-2 border border-[#747775]/50 hover:bg-[#f6f8fc] dark:hover:bg-[#28292a] text-[#444746] dark:text-[#c4c7c5] text-xs font-semibold rounded-full transition-colors cursor-pointer"
          >
            <Forward className="w-4 h-4" />
            <span>Forward</span>
          </button>
        </div>
      </div>
    </main>
  );
};
