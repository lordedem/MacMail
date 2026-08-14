import React, { useState } from 'react';
import { useMail } from '../../context/MailContext';
import { Account, AccountProvider } from '../../types/mail';
import { apiBridge } from '../../services/apiBridge';
import {
  X,
  Mail,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  Sparkles,
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
    name: 'Google',
    imapHost: 'imap.gmail.com',
    imapPort: 993,
    smtpHost: 'smtp.gmail.com',
    smtpPort: 465,
  },
  {
    id: 'outlook',
    name: 'Outlook, Hotmail, Live',
    imapHost: 'outlook.office365.com',
    imapPort: 993,
    smtpHost: 'smtp.office365.com',
    smtpPort: 587,
  },
  {
    id: 'yahoo',
    name: 'Yahoo',
    imapHost: 'imap.mail.yahoo.com',
    imapPort: 993,
    smtpHost: 'smtp.mail.yahoo.com',
    smtpPort: 465,
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
    id: 'custom',
    name: 'Other (IMAP)',
    imapHost: '',
    imapPort: 993,
    smtpHost: '',
    smtpPort: 587,
  },
];

const COLOR_OPTIONS = [
  '#0b57d0', // Google Blue
  '#34a853', // Google Green
  '#ea4335', // Google Red
  '#7c3aed', // Purple
  '#fbbc04', // Google Yellow
  '#0891b2', // Cyan
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
    setName('');
    setEmail('');
    setPassword('');
    setTestResult(null);
  };

  const addQuickDemoAccount = () => {
    const demoAccounts = [
      { name: 'Alex Rivers (Startups)', email: 'alex@startup-ventures.co', color: '#34a853' },
      { name: 'Alex Rivers (Work Google)', email: 'alex.rivers@workspace.org', color: '#0b57d0' },
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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-[#1e1f20] border border-[#e0e3e7] dark:border-[#333538] rounded-3xl shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#f2f2f2] dark:border-[#2b2c2e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#eaf1fb] dark:bg-[#282a2c] flex items-center justify-center text-[#0b57d0] dark:text-[#a8c7fa]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-medium text-[#1f1f1f] dark:text-[#e3e3e3]">
                Set up email
              </h3>
              <p className="text-xs text-[#747775]">
                Add your account to MacMail
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddAccountOpen(false)}
            className="p-1.5 text-[#444746] hover:bg-[#f2f2f2] dark:hover:bg-[#28292a] rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto scrollbar-thin">
          <div>
            <label className="block text-xs font-semibold text-[#444746] dark:text-[#c4c7c5] mb-2">
              Select Email Provider
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PROVIDER_PRESETS.map(p => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => handleProviderSelect(p.id)}
                  className={`p-3 rounded-2xl border text-xs font-medium text-left transition-all cursor-pointer ${
                    provider === p.id
                      ? 'border-[#0b57d0] bg-[#eaf1fb] dark:bg-[#004a77]/40 text-[#041e49] dark:text-[#c2e7ff] font-bold'
                      : 'border-[#e0e3e7] dark:border-[#333538] text-[#444746] dark:text-[#c4c7c5] hover:bg-[#f6f8fc] dark:hover:bg-[#28292a]'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-[#444746] dark:text-[#c4c7c5] mb-1">
                Your name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Alex Rivers"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#282a2c] border border-[#747775]/40 focus:border-[#0b57d0] rounded-xl text-xs text-[#1f1f1f] dark:text-[#e3e3e3] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#444746] dark:text-[#c4c7c5] mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#282a2c] border border-[#747775]/40 focus:border-[#0b57d0] rounded-xl text-xs text-[#1f1f1f] dark:text-[#e3e3e3] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#444746] dark:text-[#c4c7c5] mb-1">
                Password or App Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-[#282a2c] border border-[#747775]/40 focus:border-[#0b57d0] rounded-xl text-xs text-[#1f1f1f] dark:text-[#e3e3e3] outline-none"
              />
            </div>

            {/* Account Color Palette */}
            <div>
              <label className="block text-xs font-medium text-[#444746] dark:text-[#c4c7c5] mb-1.5">
                Account Label Color
              </label>
              <div className="flex items-center gap-2.5">
                {COLOR_OPTIONS.map(c => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                      color === c ? 'scale-125 ring-2 ring-[#0b57d0] ring-offset-2 dark:ring-offset-[#1e1f20]' : ''
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
                    ? 'bg-[#e6f4ea] text-[#137333]'
                    : 'bg-[#fce8e6] text-[#c5221f]'
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
          <div className="pt-4 border-t border-[#f2f2f2] dark:border-[#2b2c2e] flex items-center justify-between">
            <button
              type="button"
              onClick={addQuickDemoAccount}
              className="text-xs font-medium text-[#0b57d0] dark:text-[#a8c7fa] hover:underline cursor-pointer"
            >
              Demo Account
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-4 py-2 text-xs font-medium text-[#0b57d0] dark:text-[#a8c7fa] hover:bg-[#eaf1fb] dark:hover:bg-[#282a2c] rounded-full transition-colors cursor-pointer"
              >
                {isTesting ? 'Testing...' : 'Test'}
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-[#0b57d0] hover:bg-[#0842a0] text-white font-medium text-xs rounded-full shadow-xs transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
