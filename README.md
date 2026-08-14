# MacMail ✉️

A high-performance Mac desktop email application built with **Electron**, **React 19**, **TypeScript**, and **Tailwind CSS**. Designed to deliver a mobile-like fluid experience on macOS with unified multi-account management, instant cross-account search across **ALL INBOXES**, and Superhuman-style keyboard navigation.

---

## 🌟 Key Features

### 1. 📥 Unified "ALL INBOXES" Timeline
- Aggregates emails across all connected accounts in a single chronological stream.
- Color-coded account badges on every email card (`[Work]`, `[iCloud]`, `[Rivers Advisory]`) so you always know where mail arrives.
- Unified unread counters and cross-account folders: **All Inboxes**, **All Starred**, **All Sent**, **All Archive**, **All Trash**.

### 2. ⚡️ Instant Cross-Account Global Search (`Cmd + K`)
- High-performance in-memory search index (`MiniSearch`) searching thousands of emails in `< 3ms`.
- Universal search bar searching across subjects, senders, recipients, body content, attachments, and labels across all accounts simultaneously.
- Powerful search tokens & filters:
  - `has:attachment` / `has:file`
  - `is:unread` / `is:starred`
  - `from:name_or_email`
  - `to:name_or_email`
  - `account:work`
  - Instant filter pills (Unread, Starred, Files, Account dropdown).

### 3. 👥 Multi-Account Manager
- Support for **Google / Gmail**, **Microsoft 365 / Outlook**, **Apple iCloud**, **Fastmail**, **Yahoo**, and **Custom IMAP/SMTP**.
- Real protocol connectivity engines (`imapflow`, `nodemailer`, `mailparser`).
- Custom account color palette picker and per-account signatures.
- Preloaded with 3 rich demo accounts (Work, Personal, Consulting) for instant exploration out of the box.

### 4. ✍️ Multi-Account Rich Compose
- Floating & maximized compose modal.
- Multi-account **"From:"** selector dropdown to easily choose which identity to send from.
- Recipient address chips with autocomplete.
- Rich formatting toolbar (Bold, Italic, Underline, Bullet lists, Numbered lists, Code blocks, Blockquotes, Links).
- Attachment upload drop zone and auto-saving drafts.

### 5. ⌨️ Keyboard-First Power Navigation
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

## 🛠️ Tech Stack & Architecture

- **Desktop Framework**: Electron 34 with macOS frameless hidden-inset title bar & native vibrancy.
- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS 4.
- **Protocols & Networking**: `imapflow` (IMAP), `nodemailer` (SMTP), `mailparser` (MIME parsing).
- **Search Engine**: `minisearch` with prefix, fuzzy, and multi-field scoring.
- **Icons & Typography**: Lucide Icons, Plus Jakarta Sans, JetBrains Mono.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Development Mode
To start the Vite development server and launch the desktop app:
```bash
npm run dev
```

### 3. Build Production Desktop Application
```bash
npm run build
npm start
```

### 4. Run Test Suite
```bash
npx tsx scripts/verifyApp.ts
```
