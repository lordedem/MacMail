import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

export interface ImapConnectionConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
}

export interface SyncAccountParams {
  id: string;
  name: string;
  email: string;
  color: string;
  imapConfig: ImapConnectionConfig;
}

export const imapService = {
  async testConnection(config: ImapConnectionConfig): Promise<{ success: boolean; error?: string }> {
    const client = new ImapFlow({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
      logger: false,
      emitLogs: false,
    });

    try {
      await client.connect();
      await client.logout();
      return { success: true };
    } catch (err: any) {
      console.error('IMAP testConnection error:', err);
      return {
        success: false,
        error: err.message || 'Failed to authenticate with IMAP server.',
      };
    }
  },

  async fetchRecentMessages(
    account: SyncAccountParams,
    mailbox = 'INBOX',
    limit = 30
  ): Promise<{ success: boolean; messages: any[]; error?: string }> {
    if (!account.imapConfig || !account.imapConfig.host) {
      return { success: false, messages: [], error: 'No IMAP configuration provided.' };
    }

    const client = new ImapFlow({
      host: account.imapConfig.host,
      port: account.imapConfig.port || 993,
      secure: account.imapConfig.secure ?? true,
      auth: {
        user: account.imapConfig.user || account.email,
        pass: account.imapConfig.pass || '',
      },
      logger: false,
      emitLogs: false,
    });

    const messages: any[] = [];

    try {
      await client.connect();
      const lock = await client.getMailboxLock(mailbox);

      try {
        const totalMessages = client.mailbox ? client.mailbox.exists : 0;

        if (totalMessages > 0) {
          const startSeq = Math.max(1, totalMessages - limit + 1);
          const range = `${startSeq}:*`;

          const messageGen = client.fetch(range, {
            envelope: true,
            flags: true,
            source: true,
            uid: true,
            internalDate: true,
          });

          for await (const msg of messageGen) {
            try {
              let bodyText = '';
              let bodyHtml = '';
              let attachments: any[] = [];

              if (msg.source) {
                const parsed: any = await simpleParser(msg.source);
                bodyText = parsed.text || '';
                bodyHtml = parsed.html || (parsed.text ? `<p>${parsed.text.replace(/\n/g, '<br/>')}</p>` : '');
                if (parsed.attachments && parsed.attachments.length > 0) {
                  attachments = parsed.attachments.map((a: any, idx: number) => ({
                    id: `att_${msg.uid}_${idx}`,
                    filename: a.filename || 'attachment',
                    size: a.size || 0,
                    contentType: a.contentType || 'application/octet-stream',
                  }));
                }
              }

              const env = msg.envelope;
              const flags = msg.flags || new Set<string>();
              const dateIso = env?.date
                ? new Date(env.date).toISOString()
                : msg.internalDate
                ? new Date(msg.internalDate).toISOString()
                : new Date().toISOString();

              const fromContact = {
                name: env?.from?.[0]?.name || env?.from?.[0]?.address || 'Unknown',
                email: env?.from?.[0]?.address || '',
              };

              const toContacts = (env?.to || []).map((t: any) => ({
                name: t.name || t.address || '',
                email: t.address || '',
              }));

              const ccContacts = (env?.cc || []).map((c: any) => ({
                name: c.name || c.address || '',
                email: c.address || '',
              }));

              const subject = env?.subject || '(No Subject)';
              const snippet = (bodyText || '').replace(/\s+/g, ' ').trim().slice(0, 140);
              const threadId = `th_${account.id}_${msg.uid}`;

              messages.push({
                id: `msg_${account.id}_${msg.uid}`,
                threadId,
                accountId: account.id,
                folderType: mailbox.toLowerCase().includes('sent')
                  ? 'sent'
                  : mailbox.toLowerCase().includes('draft')
                  ? 'drafts'
                  : mailbox.toLowerCase().includes('trash')
                  ? 'trash'
                  : mailbox.toLowerCase().includes('spam') || mailbox.toLowerCase().includes('junk')
                  ? 'spam'
                  : 'inbox',
                from: fromContact,
                to: toContacts,
                cc: ccContacts,
                subject,
                snippet,
                bodyText,
                bodyHtml,
                date: dateIso,
                isRead: flags.has('\\Seen'),
                isStarred: flags.has('\\Flagged'),
                hasAttachments: attachments.length > 0,
                attachments,
                labels: [mailbox],
                category: 'primary',
                accountName: account.name,
              });
            } catch (parseErr) {
              console.error(`Error parsing message uid ${msg.uid}:`, parseErr);
            }
          }
        }
      } finally {
        lock.release();
      }

      await client.logout();

      // Sort newest first
      messages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return { success: true, messages };
    } catch (err: any) {
      console.error('IMAP sync error:', err);
      return {
        success: false,
        messages: [],
        error: err.message || 'Failed to sync with IMAP server.',
      };
    }
  },
};
