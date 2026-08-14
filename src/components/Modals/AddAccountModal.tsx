import React, { useState } from 'react';
import { useMail } from '../../context/MailContext';
import { Account, AccountProvider } from '../../types/mail';
import { apiBridge } from '../../services/apiBridge';
import {
  X,
  Mail,
  Lock,
  Server,
  User,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Shield,
  Palette,
} from 'lucide-react';

const PROVIDER_PRESETS: {
  id: AccountProvider;
  name: string;
  imapHost: string;
  imapPort: number;
  smtpHost: string;
  smtpPort: number;
  iconBg: string;
}[] = [
  {
    id: 'gmail',
    name: 'Google / Gmail',
    imapHost: 'imap.gmail.com',
    imapPort: 993,
    smtpHost: 'smtp.gmail.com',
    smtpPort: 465,
    iconBg: 'bg-red-500',
  },
  {
    id: 'outlook',
    name: 'Microsoft 365 / Outlook',
    imapHost: 'outlook.office365.com',
    imapPort: 993,
    smtpHost: 'smtp.office365.com',
    smtpPort: 587,
    iconBg: 'bg-blue-600',
  },
  {
    id: 'icloud',
    name: 'Apple iCloud',
    imapHost: 'imap.mail.me.com',
    imapPort: 993,
    smtpHost: 'smtp.mail.me.com',
    smtpPort: 587,
    iconBg: 'bg-slate-700',
  },
  {
    id: 'fastmail',
    name: 'Fastmail',
    imapHost: 'imap.fastmail.com',
    imapPort: 993,
    smtpHost: 'smtp.fastmail.com',
    smtpPort: 465,
    iconBg: 'bg-blue-500',
  },
  {
    id: 'yahoo',
    name: 'Yahoo Mail',
    imapHost: 'imap.mail.yahoo.com',
    imapPort: 993,
    smtpHost: 'smtp.mail.yahoo.com',
    smtpPort: 465,
    iconBg: 'bg-purple-600',
  },
  {
    id: 'custom',
    name: 'Custom IMAP / SMTP',
    imapHost: '',
    imapPort: 993,
    smtpHost: '',
    smtpPort: 587,
    iconBg: 'bg-slate-500',
  },
];

const COLOR_OPTIONS = [
  '#2563eb', // Blue
  '#059669', // Emerald
  '#7c3aed', // Purple
  '#ea580c', // Orange
  '#e11d48', // Rose
  '#0891b2', // Cyan
  '#4f46e5', // Indigo
  '#d97706', // Amber
];

export const AddAccountModal: React.FC = () => {
  const { isAddAccountOpen, setIsAddAccountOpen, addAccount, showToast } = useMail();

  const [provider, setProvider] = useState<AccountProvider>('gmail');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [color, setColor] = useState(COLOR_OPTIONS[0]);

  // Advanced server settings
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
      imapConfig: { host: imapHost, port: imapPort, secure: true, user: email, pass: password },
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

    addAccount({
      name: name.trim(),
      email: email.trim(),
      provider,
      color,
      badgeColor: `border-${color}/30`,
      isEnabled: true,
      signature: `Best regards,\n${name.trim()}\n${email.trim()}`,
      imapConfig: {
        host: imapHost,
        port: imapPort,
        secure: true,
        user: email.trim(),
        pass: password,
      },
      smtpConfig: {
        host: smtpHost,
        port: smtpPort,
        secure: true,
        user: email.trim(),
        pass: password,
      },
    });

    setIsAddAccountOpen(false);
    // Reset form
    setName('');
    setEmail('');
    setPassword('');
    setTestResult(null);
  };

  const addQuickDemoAccount = () => {
    const demoAccounts = [
      { name: 'Alex Rivers (Startups)', email: 'alex@startup-ventures.co', color: '#ea580c' },
      { name: 'Alex Rivers (Newsletter)', email: 'alex.digest@substack.com', color: '#0891b2' },
      { name: 'Alex Rivers (University)', email: 'arivers@alumni.stanford.edu', color: '#e11d48' },
    ];
    const picked = demoAccounts[Math.floor(Math.random() * demoAccounts.length)];

    addAccount({
      name: picked.name,
      email: picked.email,
      provider: 'demo',
      color: picked.color,
      badgeColor: '',
      isEnabled: true,
      signature: `—\n${picked.name}`,
    });

    setIsAddAccountOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-[#191b22] border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-4 border-b border-black/8 dark:border-white/8 flex items-center justify-between bg-[#fbfbfd] dark:bg-[#1e2029]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Connect Email Account
              </h3>
              <p className="text-[11px] text-slate-400">
                Add an account to your unified "All Inboxes" timeline
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddAccountOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto scrollbar-thin">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Select Provider
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PROVIDER_PRESETS.map(p => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => handleProviderSelect(p.id)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    provider === p.id
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'border-black/8 dark:border-white/8 text-slate-600 dark:text-slate-400 hover:bg-black/4 dark:hover:bg-white/4'
                  }`}
                >
                  <span className="truncate">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Account Name / Label
              </label>
              <div className="relative flex items-center">
                <User className="w-3.5 h-3.5 absolute left-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Alex (Engineering) or Personal"
                  className="w-full pl-8 pr-3 py-2 bg-black/4 dark:bg-white/4 border border-black/8 dark:border-white/8 focus:border-blue-500 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-3.5 h-3.5 absolute left-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-8 pr-3 py-2 bg-black/4 dark:bg-white/4 border border-black/8 dark:border-white/8 focus:border-blue-500 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password or App Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-3.5 h-3.5 absolute left-3 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full pl-8 pr-3 py-2 bg-black/4 dark:bg-white/4 border border-black/8 dark:border-white/8 focus:border-blue-500 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                For Gmail or iCloud, generate an App-Specific Password in security settings.
              </p>
            </div>

            {/* Account Color Badge Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Account Badge Color
              </label>
              <div className="flex items-center gap-2">
                {COLOR_OPTIONS.map(c => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                      color === c ? 'scale-125 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-[#191b22]' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Advanced Server Settings toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(prev => !prev)}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {showAdvanced ? 'Hide Server Settings' : 'Custom IMAP / SMTP Server Settings...'}
              </button>

              {showAdvanced && (
                <div className="mt-2 p-3 bg-black/4 dark:bg-white/4 rounded-xl border border-black/5 dark:border-white/5 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400">IMAP Host</span>
                      <input
                        type="text"
                        value={imapHost}
                        onChange={e => setImapHost(e.target.value)}
                        className="w-full p-1.5 bg-white dark:bg-[#191b22] border border-black/10 dark:border-white/10 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">IMAP Port</span>
                      <input
                        type="number"
                        value={imapPort}
                        onChange={e => setImapPort(Number(e.target.value))}
                        className="w-full p-1.5 bg-white dark:bg-[#191b22] border border-black/10 dark:border-white/10 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400">SMTP Host</span>
                      <input
                        type="text"
                        value={smtpHost}
                        onChange={e => setSmtpHost(e.target.value)}
                        className="w-full p-1.5 bg-white dark:bg-[#191b22] border border-black/10 dark:border-white/10 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">SMTP Port</span>
                      <input
                        type="number"
                        value={smtpPort}
                        onChange={e => setSmtpPort(Number(e.target.value))}
                        className="w-full p-1.5 bg-white dark:bg-[#191b22] border border-black/10 dark:border-white/10 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Test result banner */}
            {testResult && (
              <div
                className={`p-2.5 rounded-xl flex items-center gap-2 text-xs font-medium ${
                  testResult.success
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
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

          {/* Footer Actions */}
          <div className="pt-3 border-t border-black/8 dark:border-white/8 flex items-center justify-between">
            <button
              type="button"
              onClick={addQuickDemoAccount}
              className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Sample Account</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
              >
                {isTesting ? 'Testing...' : 'Test Connection'}
              </button>

              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Connect Account
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
