# MacMail ✉️

A high-performance Mac desktop email client built with **Electron**, **React 19**, **TypeScript**, and **Tailwind CSS**. Designed for self-hosting and privacy, featuring unified multi-account management, instant cross-account search across **ALL INBOXES**, dark/light mode theming, and Superhuman-style keyboard navigation.

---

## 🌟 Key Features

### 1. 🎨 Modern macOS 3-Column Interface
- **Unified Header Bar**: Clean top bar with traffic light spacing, `AllMail` branding, integrated search, `All inboxes ▾` scope selector, Dark/Light mode switcher, settings, and user avatar.
- **Sidebar Navigation**: Quick Compose button with color-dot indicators for connected accounts and folders (Inbox, Starred, Snoozed, Sent, Drafts, Spam, Trash).
- **Message Feed**: Soft-blue active conversation highlights, blue unread dot indicators, sender avatars, timestamps, and account badge pills.
- **Reading Pane**: Action toolbar with quick back navigation, archive (`✕`), reply (`↺`), star (`★`), more actions (`···`), and thread pagination (`1 of 4`).
- **Dark & Light Mode**: Instant one-click toggle in the top bar and settings modal with state persistence.

---

### 2. 🔒 Self-Hosting Ready & Zero Mock Data
- **Pure Mail Protocol Engine**: No hardcoded mock messages. The client synchronizes directly with your actual mail servers.
- **Real IMAP Synchronization**: Powered by `imapflow` and `mailparser` to download emails, parse HTML/plain-text bodies, handle file attachments, and synchronize remote flags (`\Seen`, `\Flagged`).
- **Real SMTP Sending**: Direct email dispatching via `nodemailer` supporting Direct SSL (Port 465) and STARTTLS (Port 587/25).
- **Self-Hosted & Custom Servers**: Connect any standard IMAP/SMTP server (e.g. Mailcow, Dovecot, Postfix, Fastmail, ProtonBridge) with custom host/port settings and self-signed TLS/SSL certificate support.

---

### 3. ⚡️ Instant Cross-Account Global Search (`⌘K` / `/`)
- **Sub-3ms Search**: High-performance in-memory search index (`MiniSearch`) across all connected inboxes.
- **Multi-Field Filtering**: Search across subjects, senders, recipients, body content, attachments, and labels.
- **Search Tokens & Shortcuts**:
  - `has:attachment` / `has:file`
  - `is:unread` / `is:starred`
  - `from:name_or_email`
  - `to:name_or_email`
  - `account:work`

---

### 4. ✍️ Multi-Account Rich Compose
- Floating and maximized compose window with auto-saving drafts.
- Multi-identity **From:** selector to switch sending accounts seamlessly.
- Rich-text formatting toolbar (Bold, Italic, Underline, Lists, Code, Blockquotes, Links).
- Drag-and-drop attachment support.

---

### 5. ⌨️ Keyboard-First Power Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>j</kbd> / <kbd>↓</kbd> | Navigate to next email |
| <kbd>k</kbd> / <kbd>↑</kbd> | Navigate to previous email |
| <kbd>e</kbd> | Archive conversation |
| <kbd>#</kbd> / <kbd>Delete</kbd> | Move conversation to Trash |
| <kbd>s</kbd> | Star / Flag conversation |
| <kbd>u</kbd> | Toggle Read / Unread |
| <kbd>c</kbd> / <kbd>⌘N</kbd> | Compose new message |
| <kbd>r</kbd> | Reply to sender |
| <kbd>a</kbd> | Reply all |
| <kbd>f</kbd> | Forward |
| <kbd>⌘K</kbd> / <kbd>/</kbd> | Universal Command Palette & Search |
| <kbd>⌘R</kbd> | Sync all mailboxes now |
| <kbd>⌘Enter</kbd> | Send email |

---

## ⚙️ Connecting Mail Accounts

### 1. Gmail / Google Workspace
Google requires **2-Step Verification** and an **App Password** for third-party IMAP/SMTP clients:
1. Enable IMAP in Gmail: **Gmail Settings (⚙️) → See all settings → Forwarding and POP/IMAP → Enable IMAP → Save Changes**.
2. Ensure **2-Step Verification** is turned on in your Google Account.
3. Generate a 16-character password at **[myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)**.
4. In MacMail, click **Settings (⚙️) → Accounts → Add Account**, choose **Gmail**, and enter your email and the 16-character App Password.

### 2. Apple iCloud
1. Generate an app-specific password at **[appleid.apple.com](https://appleid.apple.com)**.
2. In MacMail, add an account using the **iCloud** preset.

### 3. Self-Hosted / Custom IMAP & SMTP
1. In MacMail, open **Add Account** and choose **Self-Hosted / Custom IMAP**.
2. Click **Custom IMAP / SMTP Settings** to specify:
   - **IMAP Host & Port**: e.g., `mail.yourdomain.com:993` (SSL)
   - **SMTP Host & Port**: e.g., `mail.yourdomain.com:587` (STARTTLS) or `465` (SSL)
3. Click **Test Connection** to verify before saving.

---

## 🛠️ Tech Stack & Architecture

- **Desktop Framework**: Electron 34 with macOS frameless hidden-inset title bar & native vibrancy.
- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS 4.
- **Protocols & Networking**: `imapflow` (IMAP), `nodemailer` (SMTP), `mailparser` (MIME parsing).
- **Search Engine**: `minisearch` with prefix, fuzzy, and multi-field scoring.
- **Icons & Typography**: Lucide Icons, SF Pro / System UI fonts.

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/MacMail.git
cd MacMail
npm install
```

### 2. Run in Development Mode
```bash
npm run dev
```

### 3. Build Desktop Application
```bash
npm run build
npm start
```

---

## 📄 License
MIT License. Free and open source for personal and commercial self-hosted mail use.
