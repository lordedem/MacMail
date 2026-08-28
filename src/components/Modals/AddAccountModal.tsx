import React, { useState } from 'react';
import { useMail } from '../../context/MailContext';
import { AccountProvider } from '../../types/mail';
import { apiBridge } from '../../services/apiBridge';
import {
  X,
  Mail,
  CheckCircle2,
  AlertCircle,
  Server,
} from 'lucide-react';

const PROVIDER_PRESETS: {
  id: AccountProvider;
  name: string;
  imapHost: string;
  imapPort: number;
  smtpHost: string;
  smtpPort: number;
}[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    imapHost: 'imap.gmail.com',
    imapPort: 993,
    smtpHost: 'smtp.gmail.com',
    smtpPort: 465,
  },
  {
    id: 'custom',
    name: 'Self-Hosted / Custom IMAP',
    imapHost: '',
    imapPort: 993,
    smtpHost: '',
    smtpPort: 587,
  },
  {
    id: 'outlook',
    name: 'Outlook / Office 365',
    imapHost: 'outlook.office365.com',
    imapPort: 993,
    smtpHost: 'smtp.office365.com',
    smtpPort: 587,
  },
  {
    id: 'icloud',
    name: 'iCloud',
    imapHost: 'imap.mail.me.com',
    imapPort: 993,
    smtpHost: 'smtp.mail.me.com',
    smtpPort: 587,
  },
  {
    id: 'fastmail',
    name: 'Fastmail',
    imapHost: 'imap.fastmail.com',
    imapPort: 993,
    smtpHost: 'smtp.fastmail.com',
    smtpPort: 465,
  },
  {
    id: 'yahoo',
    name: 'Yahoo',
    imapHost: 'imap.mail.yahoo.com',
    imapPort: 993,
    smtpHost: 'smtp.mail.yahoo.com',
    smtpPort: 465,
  },
];

const COLOR_OPTIONS = [
  '#2563eb', // Blue
  '#ef4444', // Red
  '#10b981', // Emerald
  '#7c3aed', // Purple
  '#f59e0b', // Amber
  '#64748b', // Slate
];

export const AddAccountModal: React.FC = () => {
  const { isAddAccountOpen, setIsAddAccountOpen, addAccount, showToast } = useMail();

  const [provider, setProvider] = useState<AccountProvider>('gmail');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [color, setColor] = useState(COLOR_OPTIONS[0]);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [imapHost, setImapHost] = useState('imap.gmail.com');
  const [imapPort, setImapPort] = useState(993);
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState(465);

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isAddAccountOpen) return null;

  const handleProviderSelect = (p: AccountProvider) => {
    setProvider(p);
    const preset = PROVIDER_PRESETS.find(item => item.id === p);
    if (preset) {
      setImapHost(preset.imapHost);
      setImapPort(preset.imapPort);
      setSmtpHost(preset.smtpHost);
      setSmtpPort(preset.smtpPort);
    }
    if (p === 'custom') {
      setShowAdvanced(true);
    }
  };

  const handleTestConnection = async () => {
    if (!email || !password) {
      setTestResult({ success: false, message: 'Please provide both an email and password.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const result = await apiBridge.testAccountConnection({
      email,
      provider,
      imapConfig: {
        host: imapHost || (email.includes('@') ? `imap.${email.split('@')[1]}` : 'imap.gmail.com'),
        port: imapPort,
        secure: true,
        user: email,
        pass: password,
      },
    });

    setIsTesting(false);
    if (result.success) {
      setTestResult({ success: true, message: 'Connection verified successfully!' });
    } else {
      setTestResult({ success: false, message: result.error || 'Failed to authenticate.' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast({ type: 'error', title: 'Please fill in required fields' });
      return;
    }

    const finalImapHost = imapHost || `imap.${email.split('@')[1]}`;
    const finalSmtpHost = smtpHost || `smtp.${email.split('@')[1]}`;

    addAccount({
      name: name.trim(),
      email: email.trim(),
      provider,
      color,
      badgeColor: `border-${color}/30`,
      isEnabled: true,
      signature: `Best regards,\n${name.trim()}\n${email.trim()}`,
      imapConfig: {
        host: finalImapHost,
        port: imapPort,
        secure: true,
        user: email.trim(),
        pass: password,
      },
      smtpConfig: {
        host: finalSmtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        user: email.trim(),
        pass: password,
      },
    });

    setIsAddAccountOpen(false);
    setName('');
    setEmail('');
    setPassword('');
    setTestResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-[#16181d] border border-[#e2e8f0] dark:border-[#24262c] rounded-3xl shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#f1f5f9] dark:border-[#1e2026] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#eff6ff] dark:bg-[#1e293b] flex items-center justify-center text-[#2563eb] dark:text-[#60a5fa]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0f172a] dark:text-[#f8fafc]">
                Add Mailbox Account
              </h3>
              <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                Connect self-hosted IMAP/SMTP or email provider
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddAccountOpen(false)}
            className="p-1.5 text-[#64748b] hover:bg-[#f1f5f9] dark:hover:bg-[#1e2026] rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto scrollbar-thin">
          <div>
            <label className="block text-xs font-semibold text-[#475569] dark:text-[#94a3b8] mb-2">
              Provider / Server Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PROVIDER_PRESETS.map(p => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => handleProviderSelect(p.id)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                    provider === p.id
                      ? 'border-[#2563eb] bg-[#eff6ff] dark:bg-[#1e293b] text-[#1d4ed8] dark:text-[#60a5fa] font-bold'
                      : 'border-[#e2e8f0] dark:border-[#2e323b] text-[#334155] dark:text-[#cbd5e1] hover:bg-[#f8fafc] dark:hover:bg-[#1e2026]'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-[#475569] dark:text-[#94a3b8] mb-1">
                Account Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Personal, Work, Server Mail..."
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#121316] border border-[#cbd5e1] dark:border-[#334155] focus:border-[#2563eb] rounded-xl text-xs text-[#0f172a] dark:text-[#f8fafc] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#475569] dark:text-[#94a3b8] mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#121316] border border-[#cbd5e1] dark:border-[#334155] focus:border-[#2563eb] rounded-xl text-xs text-[#0f172a] dark:text-[#f8fafc] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#475569] dark:text-[#94a3b8] mb-1">
                Password / App Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#121316] border border-[#cbd5e1] dark:border-[#334155] focus:border-[#2563eb] rounded-xl text-xs text-[#0f172a] dark:text-[#f8fafc] outline-none"
              />
            </div>

            {/* Self-hosted advanced IMAP/SMTP server toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(prev => !prev)}
                className="text-xs text-[#2563eb] dark:text-[#60a5fa] hover:underline font-medium flex items-center gap-1 cursor-pointer"
              >
                <Server className="w-3.5 h-3.5" />
                <span>{showAdvanced ? 'Hide Server Settings' : 'Custom IMAP / SMTP Settings'}</span>
              </button>

              {showAdvanced && (
                <div className="mt-2.5 p-3 bg-[#f8fafc] dark:bg-[#121316] border border-[#e2e8f0] dark:border-[#24262c] rounded-xl space-y-2.5 text-xs">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="block text-[11px] text-[#64748b] dark:text-[#94a3b8] mb-1">IMAP Host</label>
                      <input
                        type="text"
                        value={imapHost}
                        onChange={e => setImapHost(e.target.value)}
                        placeholder="imap.domain.com"
                        className="w-full p-2 bg-white dark:bg-[#1c1e24] border border-[#cbd5e1] dark:border-[#334155] rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#64748b] dark:text-[#94a3b8] mb-1">Port</label>
                      <input
                        type="number"
                        value={imapPort}
                        onChange={e => setImapPort(Number(e.target.value))}
                        className="w-full p-2 bg-white dark:bg-[#1c1e24] border border-[#cbd5e1] dark:border-[#334155] rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="block text-[11px] text-[#64748b] dark:text-[#94a3b8] mb-1">SMTP Host</label>
                      <input
                        type="text"
                        value={smtpHost}
                        onChange={e => setSmtpHost(e.target.value)}
                        placeholder="smtp.domain.com"
                        className="w-full p-2 bg-white dark:bg-[#1c1e24] border border-[#cbd5e1] dark:border-[#334155] rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#64748b] dark:text-[#94a3b8] mb-1">Port</label>
                      <input
                        type="number"
                        value={smtpPort}
                        onChange={e => setSmtpPort(Number(e.target.value))}
                        className="w-full p-2 bg-white dark:bg-[#1c1e24] border border-[#cbd5e1] dark:border-[#334155] rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account Color Palette */}
            <div>
              <label className="block text-xs font-medium text-[#475569] dark:text-[#94a3b8] mb-1.5">
                Badge Color
              </label>
              <div className="flex items-center gap-2.5">
                {COLOR_OPTIONS.map(c => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                      color === c ? 'scale-125 ring-2 ring-[#2563eb] ring-offset-2 dark:ring-offset-[#16181d]' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Test result banner */}
            {testResult && (
              <div
                className={`p-3 rounded-xl flex items-center gap-2 text-xs ${
                  testResult.success
                    ? 'bg-[#ecfdf5] text-[#047857]'
                    : 'bg-[#fef2f2] text-[#b91c1c]'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-[#f1f5f9] dark:border-[#1e2026] flex items-center justify-between">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-4 py-2 text-xs font-medium text-[#2563eb] dark:text-[#60a5fa] hover:bg-[#eff6ff] dark:hover:bg-[#1e293b] rounded-full transition-colors cursor-pointer"
            >
              {isTesting ? 'Testing...' : 'Test Connection'}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddAccountOpen(false)}
                className="px-4 py-2 text-xs font-medium text-[#64748b] hover:bg-[#f1f5f9] dark:hover:bg-[#1e2026] rounded-full cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium text-xs rounded-full shadow-xs transition-colors cursor-pointer"
              >
                Add Account
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
