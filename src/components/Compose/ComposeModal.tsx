import React, { useState, useRef, useEffect } from 'react';
import { useMail } from '../../context/MailContext';
import { Attachment } from '../../types/mail';
import {
  X,
  Minus,
  Maximize2,
  Minimize2,
  Paperclip,
  Send,
  Trash2,
  Clock,
  ChevronDown,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  Sparkles,
  File,
  Check,
} from 'lucide-react';
import { AccountBadge } from '../Common/AccountBadge';

export const ComposeModal: React.FC = () => {
  const { composeState, closeCompose, updateDraft, sendEmail, accounts } = useMail();

  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [toInput, setToInput] = useState('');
  const [ccInput, setCcInput] = useState('');
  const [bccInput, setBccInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { draft, mode } = composeState;

  // Initialize body into editor content editable
  useEffect(() => {
    if (editorRef.current && draft.bodyHtml && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = draft.bodyHtml;
    }
  }, [composeState.isOpen]);

  if (!composeState.isOpen) return null;

  const currentAccount = accounts.find(a => a.id === draft.accountId) || accounts[0];

  const handleAccountChange = (accountId: string) => {
    const acc = accounts.find(a => a.id === accountId);
    let newBody = draft.bodyHtml;

    // Append new signature if available
    if (acc?.signature) {
      newBody += `<br/><br/>--<br/>${acc.signature.replace(/\n/g, '<br/>')}`;
    }

    updateDraft({
      accountId,
      bodyHtml: newBody,
    });
  };

  const handleToKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',' || e.key === ' ') && toInput.trim()) {
      e.preventDefault();
      const val = toInput.trim().replace(',', '');
      if (val && !draft.to.includes(val)) {
        updateDraft({ to: [...draft.to, val] });
      }
      setToInput('');
    } else if (e.key === 'Backspace' && !toInput && draft.to.length > 0) {
      updateDraft({ to: draft.to.slice(0, -1) });
    }
  };

  const removeToRecipient = (email: string) => {
    updateDraft({ to: draft.to.filter(e => e !== email) });
  };

  const handleCcKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && ccInput.trim()) {
      e.preventDefault();
      const val = ccInput.trim().replace(',', '');
      if (val && !draft.cc.includes(val)) {
        updateDraft({ cc: [...draft.cc, val] });
      }
      setCcInput('');
    }
  };

  const handleBccKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && bccInput.trim()) {
      e.preventDefault();
      const val = bccInput.trim().replace(',', '');
      if (val && !draft.bcc.includes(val)) {
        updateDraft({ bcc: [...draft.bcc, val] });
      }
      setBccInput('');
    }
  };

  // Rich Text Formatting Execution
  const formatText = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      updateDraft({ bodyHtml: editorRef.current.innerHTML });
    }
  };

  const handleFileAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: Attachment[] = Array.from(files).map((f, i) => ({
      id: `att_new_${Date.now()}_${i}`,
      filename: f.name,
      size: f.size,
      contentType: f.type || 'application/octet-stream',
    }));

    updateDraft({ attachments: [...draft.attachments, ...newAttachments] });
  };

  const removeAttachment = (attId: string) => {
    updateDraft({ attachments: draft.attachments.filter(a => a.id !== attId) });
  };

  const handleSend = async () => {
    // If user left text in toInput, add it before sending
    if (toInput.trim() && !draft.to.includes(toInput.trim())) {
      draft.to.push(toInput.trim());
    }

    if (editorRef.current) {
      draft.bodyHtml = editorRef.current.innerHTML;
    }

    setIsSending(true);
    await sendEmail();
    setIsSending(false);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-8 z-50 w-72 bg-white dark:bg-[#1e2029] border border-black/10 dark:border-white/10 rounded-t-xl shadow-2xl flex items-center justify-between p-3 cursor-pointer">
        <span className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200">
          {draft.subject || 'New Message'}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(false)}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded text-slate-500"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={closeCompose}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded text-slate-500"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed z-50 transition-all ${
        isMaximized
          ? 'inset-6'
          : 'bottom-6 right-8 w-full max-w-2xl h-[580px]'
      } bg-white dark:bg-[#191b22] border border-black/12 dark:border-white/12 rounded-2xl shadow-2xl shadow-black/25 flex flex-col overflow-hidden font-sans`}
    >
      {/* Compose Window Header (macOS title style) */}
      <div className="h-10 px-4 bg-[#f4f5f8] dark:bg-[#1e2029] border-b border-black/8 dark:border-white/8 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
            {mode === 'new'
              ? 'New Message'
              : mode === 'reply'
              ? 'Reply'
              : mode === 'reply-all'
              ? 'Reply All'
              : 'Forward'}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Auto-saved to Drafts</span>
        </div>

        {/* Window controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors cursor-pointer"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsMaximized(prev => !prev)}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors cursor-pointer"
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={closeCompose}
            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Account Selector ("From:") */}
      <div className="px-4 py-2 border-b border-black/5 dark:border-white/5 flex items-center justify-between gap-3 text-xs bg-slate-50/50 dark:bg-white/2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-slate-400 font-medium shrink-0">From:</span>
          <select
            value={draft.accountId}
            onChange={e => handleAccountChange(e.target.value)}
            className="bg-transparent font-semibold text-slate-800 dark:text-slate-100 outline-none cursor-pointer hover:text-blue-600 transition-colors"
          >
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id} className="bg-white dark:bg-[#191b22] text-slate-800 dark:text-slate-100">
                {acc.name} &lt;{acc.email}&gt;
              </option>
            ))}
          </select>
        </div>

        <AccountBadge account={currentAccount} size="xs" />
      </div>

      {/* Recipients: To */}
      <div className="px-4 py-2 border-b border-black/5 dark:border-white/5 flex items-center gap-2 text-xs flex-wrap">
        <span className="text-slate-400 font-medium shrink-0">To:</span>

        <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-[200px]">
          {draft.to.map(email => (
            <span
              key={email}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-md font-medium text-xs"
            >
              <span>{email}</span>
              <button
                onClick={() => removeToRecipient(email)}
                className="hover:text-rose-500 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <input
            type="email"
            value={toInput}
            onChange={e => setToInput(e.target.value)}
            onKeyDown={handleToKeyDown}
            placeholder={draft.to.length === 0 ? 'Enter email address and press Enter...' : ''}
            className="flex-1 min-w-[140px] bg-transparent outline-none text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 text-slate-400 text-xs">
          {!showCc && (
            <button
              onClick={() => setShowCc(true)}
              className="hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer font-medium"
            >
              Cc
            </button>
          )}
          {!showBcc && (
            <button
              onClick={() => setShowBcc(true)}
              className="hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer font-medium"
            >
              Bcc
            </button>
          )}
        </div>
      </div>

      {/* Optional Cc Field */}
      {showCc && (
        <div className="px-4 py-1.5 border-b border-black/5 dark:border-white/5 flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium shrink-0">Cc:</span>
          <div className="flex items-center gap-1.5 flex-wrap flex-1">
            {draft.cc.map(email => (
              <span
                key={email}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-200 dark:bg-slate-800 rounded-md text-xs"
              >
                <span>{email}</span>
                <button
                  onClick={() => updateDraft({ cc: draft.cc.filter(e => e !== email) })}
                  className="hover:text-rose-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              type="email"
              value={ccInput}
              onChange={e => setCcInput(e.target.value)}
              onKeyDown={handleCcKeyDown}
              placeholder="Add Cc..."
              className="flex-1 bg-transparent outline-none text-xs text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>
      )}

      {/* Optional Bcc Field */}
      {showBcc && (
        <div className="px-4 py-1.5 border-b border-black/5 dark:border-white/5 flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium shrink-0">Bcc:</span>
          <div className="flex items-center gap-1.5 flex-wrap flex-1">
            {draft.bcc.map(email => (
              <span
                key={email}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-200 dark:bg-slate-800 rounded-md text-xs"
              >
                <span>{email}</span>
                <button
                  onClick={() => updateDraft({ bcc: draft.bcc.filter(e => e !== email) })}
                  className="hover:text-rose-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              type="email"
              value={bccInput}
              onChange={e => setBccInput(e.target.value)}
              onKeyDown={handleBccKeyDown}
              placeholder="Add Bcc..."
              className="flex-1 bg-transparent outline-none text-xs text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>
      )}

      {/* Subject Line */}
      <div className="px-4 py-2 border-b border-black/5 dark:border-white/5 flex items-center gap-2 text-xs">
        <input
          type="text"
          value={draft.subject}
          onChange={e => updateDraft({ subject: e.target.value })}
          placeholder="Subject"
          className="w-full bg-transparent font-bold text-slate-900 dark:text-white outline-none placeholder-slate-400 text-sm"
        />
      </div>

      {/* Rich Formatting Toolbar */}
      <div className="px-4 py-1.5 border-b border-black/5 dark:border-white/5 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-white/2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => formatText('bold')}
          className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors cursor-pointer"
          title="Bold (Cmd+B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => formatText('italic')}
          className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors cursor-pointer"
          title="Italic (Cmd+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => formatText('underline')}
          className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors cursor-pointer"
          title="Underline (Cmd+U)"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 mx-1" />

        <button
          onClick={() => formatText('insertUnorderedList')}
          className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors cursor-pointer"
          title="Bulleted List"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => formatText('insertOrderedList')}
          className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors cursor-pointer"
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => formatText('formatBlock', 'blockquote')}
          className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors cursor-pointer"
          title="Quote"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => formatText('formatBlock', 'pre')}
          className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors cursor-pointer"
          title="Code Block"
        >
          <Code className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 mx-1" />

        <button
          onClick={() => {
            const url = prompt('Enter hyperlink URL:');
            if (url) formatText('createLink', url);
          }}
          className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors cursor-pointer"
          title="Insert Link"
        >
          <Link2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Editor Body */}
      <div className="flex-1 p-4 overflow-y-auto outline-none text-xs leading-relaxed text-slate-800 dark:text-slate-100 scrollbar-thin">
        <div
          ref={editorRef}
          contentEditable
          onInput={() => {
            if (editorRef.current) {
              updateDraft({ bodyHtml: editorRef.current.innerHTML });
            }
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              handleSend();
            }
          }}
          className="w-full h-full min-h-[160px] outline-none"
          data-placeholder="Write your email here..."
        />
      </div>

      {/* Attachment Previews */}
      {draft.attachments.length > 0 && (
        <div className="px-4 py-2 border-t border-black/5 dark:border-white/5 flex items-center gap-2 flex-wrap bg-slate-50/50 dark:bg-white/2">
          {draft.attachments.map(att => (
            <span
              key={att.id}
              className="inline-flex items-center gap-2 px-2.5 py-1 bg-white dark:bg-[#20232e] border border-black/8 dark:border-white/8 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 shadow-2xs"
            >
              <File className="w-3.5 h-3.5 text-blue-500" />
              <span className="truncate max-w-[140px]">{att.filename}</span>
              <button
                onClick={() => removeAttachment(att.id)}
                className="hover:text-rose-500 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Bottom Footer Actions */}
      <div className="px-4 py-3 border-t border-black/8 dark:border-white/8 bg-[#fbfbfd] dark:bg-[#1e2029] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileAttachment}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            title="Attach Files"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <button
            onClick={closeCompose}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
            title="Discard Draft"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            ⌘ + Enter to send
          </span>

          <button
            onClick={handleSend}
            disabled={isSending}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSending ? 'Sending...' : 'Send Message'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
