"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imapService = void 0;
const imapflow_1 = require("imapflow");
const mailparser_1 = require("mailparser");
exports.imapService = {
    async testConnection(config) {
        const client = new imapflow_1.ImapFlow({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: {
                user: config.user,
                pass: config.pass,
            },
            logger: false,
        });
        try {
            await client.connect();
            await client.logout();
            return { success: true };
        }
        catch (err) {
            return {
                success: false,
                error: err.message || 'Failed to authenticate with IMAP server.',
            };
        }
    },
    async fetchRecentMessages(config, mailbox = 'INBOX', limit = 20) {
        const client = new imapflow_1.ImapFlow({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: {
                user: config.user,
                pass: config.pass,
            },
            logger: false,
        });
        const messages = [];
        try {
            await client.connect();
            const lock = await client.getMailboxLock(mailbox);
            try {
                const messageGen = client.fetch(`1:${limit}`, {
                    envelope: true,
                    flags: true,
                    source: true,
                    uid: true,
                });
                for await (const msg of messageGen) {
                    if (!msg.source)
                        continue;
                    const parsed = (await (0, mailparser_1.simpleParser)(msg.source));
                    const env = msg.envelope;
                    const flags = msg.flags || new Set();
                    messages.push({
                        id: `msg_remote_${msg.uid}`,
                        subject: env?.subject || '(No Subject)',
                        from: {
                            name: env?.from?.[0]?.name || env?.from?.[0]?.address || 'Unknown',
                            email: env?.from?.[0]?.address || '',
                        },
                        to: (env?.to || []).map((t) => ({ name: t.name || t.address || '', email: t.address || '' })),
                        date: env?.date ? new Date(env.date).toISOString() : new Date().toISOString(),
                        isRead: flags.has('\\Seen'),
                        isStarred: flags.has('\\Flagged'),
                        bodyText: parsed.text || '',
                        bodyHtml: parsed.html || `<p>${parsed.text || ''}</p>`,
                        snippet: (parsed.text || '').slice(0, 140),
                        hasAttachments: Boolean(parsed.attachments && parsed.attachments.length > 0),
                        attachments: (parsed.attachments || []).map((a, idx) => ({
                            id: `att_${msg.uid}_${idx}`,
                            filename: a.filename || 'attachment',
                            size: a.size || 0,
                            contentType: a.contentType || 'application/octet-stream',
                        })),
                    });
                }
            }
            finally {
                lock.release();
            }
            await client.logout();
        }
        catch (err) {
            console.error('Error fetching IMAP messages:', err);
        }
        return messages;
    },
};
