import React, { useState, useRef, useEffect } from 'react';
import { useMail } from '../../context/MailContext';
import { Attachment } from '../../types/mail';
import {
  X,
  Minus,
  Maximize2,
  Minimize2,
  Paperclip,
  Trash2,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  File,
  ChevronDown,
  AlignLeft,
} from 'lucide-react';
import { AccountBadge } from '../Common/AccountBadge';

export const ComposeModal: React.FC = () => {
  const { composeState, closeCompose, updateDraft, sendEmail, accounts } = useMail();

  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showFormatting, setShowFormatting] = useState(true);
  const [toInput, setToInput] = useState('');
  const [ccInput, setCcInput] = useState('');
  const [bccInput, setBccInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { draft, mode } = composeState;

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
      <div className="fixed bottom-0 right-16 z-50 w-72 bg-[#f2f6fc] dark:bg-[#1e1f20] border border-[#e0e3e7] dark:border-[#333538] rounded-t-xl shadow-lg flex items-center justify-between px-4 py-2.5 cursor-pointer">
        <span className="text-xs font-semibold truncate text-[#1f1f1f] dark:text-[#e3e3e3]">
          {draft.subject || 'New Message'}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(false)}
            className="p-1 hover:bg-[#e0e3e7] dark:hover:bg-[#28292a] rounded text-[#444746]"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={closeCompose}
            className="p-1 hover:bg-[#e0e3e7] dark:hover:bg-[#28292a] rounded text-[#444746]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed z-50 transition-all duration-200 ${
        isMaximized
          ? 'inset-6'
          : 'bottom-0 right-16 w-full max-w-[560px] h-[540px]'
      } bg-white dark:bg-[#1e1f20] border border-[#e0e3e7] dark:border-[#333538] rounded-t-2xl shadow-2xl flex flex-col overflow-hidden font-sans`}
    >
      {/* Gmail Window Header */}
      <div className="h-10 px-4 bg-[#f2f6fc] dark:bg-[#282a2c] border-b border-[#e0e3e7] dark:border-[#333538] flex items-center justify-between shrink-0 select-none">
        <span className="text-xs font-bold text-[#1f1f1f] dark:text-[#e3e3e3]">
          {mode === 'new'
            ? 'New Message'
            : mode === 'reply'
            ? 'Reply'
            : mode === 'reply-all'
            ? 'Reply All'
            : 'Forward'}
        </span>

        {/* Window controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 text-[#444746] dark:text-[#c4c7c5] hover:bg-[#e0e3e7] dark:hover:bg-[#333538] rounded transition-colors cursor-pointer"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsMaximized(prev => !prev)}
            className="p-1 text-[#444746] dark:text-[#c4c7c5] hover:bg-[#e0e3e7] dark:hover:bg-[#333538] rounded transition-colors cursor-pointer"
            title={isMaximized ? 'Exit full screen' : 'Full screen'}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={closeCompose}
            className="p-1 text-[#444746] dark:text-[#c4c7c5] hover:bg-[#e0e3e7] dark:hover:bg-[#333538] rounded transition-colors cursor-pointer"
            title="Save & close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Account Selector ("From:") */}
      <div className="px-4 py-2 border-b border-[#f2f2f2] dark:border-[#2b2c2e] flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[#747775] font-medium shrink-0">From:</span>
          <select
            value={draft.accountId}
            onChange={e => handleAccountChange(e.target.value)}
            className="bg-transparent font-semibold text-[#1f1f1f] dark:text-[#e3e3e3] outline-none cursor-pointer hover:text-[#0b57d0] transition-colors"
          >
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id} className="bg-white dark:bg-[#1e1f20] text-[#1f1f1f] dark:text-[#e3e3e3]">
                {acc.name} &lt;{acc.email}&gt;
              </option>
            ))}
          </select>
        </div>

        <AccountBadge account={currentAccount} size="xs" />
      </div>

      {/* Recipients: To */}
      <div className="px-4 py-2 border-b border-[#f2f2f2] dark:border-[#2b2c2e] flex items-center gap-2 text-xs flex-wrap">
        <span className="text-[#747775] font-medium shrink-0">To:</span>

        <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-[200px]">
          {draft.to.map(email => (
            <span
              key={email}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#f0f4f9] dark:bg-[#282a2c] text-[#1f1f1f] dark:text-[#e3e3e3] border border-[#c4c7c5] dark:border-[#444746] rounded-full text-xs"
            >
              <span>{email}</span>
              <button
                onClick={() => removeToRecipient(email)}
                className="hover:text-[#ea4335] cursor-pointer"
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
            placeholder={draft.to.length === 0 ? 'Recipients' : ''}
            className="flex-1 min-w-[140px] bg-transparent outline-none text-xs text-[#1f1f1f] dark:text-[#e3e3e3] placeholder-[#747775]"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 text-[#747775] text-xs">
          {!showCc && (
            <button
              onClick={() => setShowCc(true)}
              className="hover:text-[#1f1f1f] dark:hover:text-white cursor-pointer font-medium"
            >
              Cc
            </button>
          )}
          {!showBcc && (
            <button
              onClick={() => setShowBcc(true)}
              className="hover:text-[#1f1f1f] dark:hover:text-white cursor-pointer font-medium"
            >
              Bcc
            </button>
          )}
        </div>
      </div>

      {/* Optional Cc Field */}
      {showCc && (
        <div className="px-4 py-1.5 border-b border-[#f2f2f2] dark:border-[#2b2c2e] flex items-center gap-2 text-xs">
          <span className="text-[#747775] font-medium shrink-0">Cc:</span>
          <div className="flex items-center gap-1.5 flex-wrap flex-1">
            {draft.cc.map(email => (
              <span
                key={email}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#f0f4f9] dark:bg-[#282a2c] rounded-full text-xs"
              >
                <span>{email}</span>
                <button
                  onClick={() => updateDraft({ cc: draft.cc.filter(e => e !== email) })}
                  className="hover:text-[#ea4335] cursor-pointer"
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
              className="flex-1 bg-transparent outline-none text-xs text-[#1f1f1f] dark:text-[#e3e3e3]"
            />
          </div>
        </div>
      )}

      {/* Optional Bcc Field */}
      {showBcc && (
        <div className="px-4 py-1.5 border-b border-[#f2f2f2] dark:border-[#2b2c2e] flex items-center gap-2 text-xs">
          <span className="text-[#747775] font-medium shrink-0">Bcc:</span>
          <div className="flex items-center gap-1.5 flex-wrap flex-1">
            {draft.bcc.map(email => (
              <span
                key={email}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#f0f4f9] dark:bg-[#282a2c] rounded-full text-xs"
              >
                <span>{email}</span>
                <button
                  onClick={() => updateDraft({ bcc: draft.bcc.filter(e => e !== email) })}
                  className="hover:text-[#ea4335] cursor-pointer"
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
              className="flex-1 bg-transparent outline-none text-xs text-[#1f1f1f] dark:text-[#e3e3e3]"
            />
          </div>
        </div>
      )}

      {/* Subject Line */}
      <div className="px-4 py-2 border-b border-[#f2f2f2] dark:border-[#2b2c2e] flex items-center gap-2 text-xs">
        <input
          type="text"
          value={draft.subject}
          onChange={e => updateDraft({ subject: e.target.value })}
          placeholder="Subject"
          className="w-full bg-transparent text-[#1f1f1f] dark:text-white outline-none placeholder-[#747775] text-xs font-normal"
        />
      </div>

      {/* Editor Body */}
      <div className="flex-1 p-4 overflow-y-auto outline-none text-xs leading-relaxed text-[#1f1f1f] dark:text-[#e3e3e3] scrollbar-thin font-sans">
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
        />
      </div>

      {/* Attachments Section */}
      {draft.attachments.length > 0 && (
        <div className="px-4 py-2 border-t border-[#f2f2f2] dark:border-[#2b2c2e] flex items-center gap-2 flex-wrap bg-[#f6f8fc] dark:bg-[#1e1f20]">
          {draft.attachments.map(att => (
            <span
              key={att.id}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-[#282a2c] border border-[#e0e3e7] dark:border-[#444746] rounded-lg text-xs text-[#1f1f1f] dark:text-[#e3e3e3]"
            >
              <File className="w-3.5 h-3.5 text-[#0b57d0]" />
              <span className="truncate max-w-[140px]">{att.filename}</span>
              <button
                onClick={() => removeAttachment(att.id)}
                className="hover:text-[#ea4335] cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Gmail Bottom Action Toolbar */}
      <div className="px-4 py-2.5 border-t border-[#e0e3e7] dark:border-[#333538] flex items-center justify-between shrink-0 bg-white dark:bg-[#1e1f20]">
        <div className="flex items-center gap-3">
          {/* Blue Gmail Send Pill Button */}
          <button
            onClick={handleSend}
            disabled={isSending}
            className="flex items-center gap-2 px-6 py-2 bg-[#0b57d0] hover:bg-[#0842a0] dark:bg-[#a8c7fa] dark:hover:bg-[#c2e7ff] text-white dark:text-[#001d35] font-semibold text-xs rounded-full shadow-xs transition-colors cursor-pointer"
          >
            <span>{isSending ? 'Sending...' : 'Send'}</span>
          </button>

          {/* Formatting tools */}
          <div className="flex items-center gap-1 text-[#444746] dark:text-[#c4c7c5]">
            <button
              onClick={() => formatText('bold')}
              className="p-1.5 hover:bg-[#f2f2f2] dark:hover:bg-[#28292a] rounded cursor-pointer"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('italic')}
              className="p-1.5 hover:bg-[#f2f2f2] dark:hover:bg-[#28292a] rounded cursor-pointer"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('underline')}
              className="p-1.5 hover:bg-[#f2f2f2] dark:hover:bg-[#28292a] rounded cursor-pointer"
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const url = prompt('Enter URL:');
                if (url) formatText('createLink', url);
              }}
              className="p-1.5 hover:bg-[#f2f2f2] dark:hover:bg-[#28292a] rounded cursor-pointer"
              title="Insert link"
            >
              <Link2 className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileAttachment}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 hover:bg-[#f2f2f2] dark:hover:bg-[#28292a] rounded cursor-pointer"
              title="Attach files"
            >
              <Paperclip className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          onClick={closeCompose}
          className="p-1.5 text-[#444746] hover:text-[#ea4335] hover:bg-[#fce8e6] dark:hover:bg-[#3b2020] rounded-full transition-colors cursor-pointer"
          title="Discard draft"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
