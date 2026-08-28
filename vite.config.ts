import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { imapService } from './electron/services/imapService';
import { smtpService } from './electron/services/smtpService';

function mailApiPlugin() {
  return {
    name: 'mail-api-plugin',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url?.startsWith('/api/mail/')) {
          return next();
        }

        let body = '';
        req.on('data', (chunk: any) => {
          body += chunk;
        });

        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');
          try {
            const data = body ? JSON.parse(body) : {};

            if (req.url === '/api/mail/test') {
              const account = data.account || data;
              const imapConfig = account.imapConfig || {
                host: account.host || 'imap.gmail.com',
                port: account.port || 993,
                secure: account.secure ?? true,
                user: account.user || account.email,
                pass: account.pass || account.password || '',
              };
              const result = await imapService.testConnection(imapConfig);
              res.statusCode = result.success ? 200 : 400;
              res.end(JSON.stringify(result));
              return;
            }

            if (req.url === '/api/mail/sync') {
              const account = data.account || data;
              if (!account || !account.imapConfig || !account.imapConfig.host) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, messages: [], error: 'Missing IMAP configuration' }));
                return;
              }
              const result = await imapService.fetchRecentMessages(account, data.mailbox || 'INBOX', data.limit || 50);
              res.statusCode = result.success ? 200 : 400;
              res.end(JSON.stringify({
                success: result.success,
                newMessages: result.messages,
                error: result.error,
              }));
              return;
            }

            if (req.url === '/api/mail/send') {
              const draft = data.draft || data;
              const smtpConfig = draft.smtpConfig || (draft.account && draft.account.smtpConfig);
              if (!smtpConfig || !smtpConfig.host) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, error: 'Missing SMTP configuration' }));
                return;
              }
              const result = await smtpService.sendEmail({
                host: smtpConfig.host,
                port: smtpConfig.port || 465,
                secure: smtpConfig.secure ?? (smtpConfig.port === 465),
                user: smtpConfig.user || draft.from,
                pass: smtpConfig.pass || '',
                from: draft.from,
                to: draft.to,
                cc: draft.cc,
                bcc: draft.bcc,
                subject: draft.subject,
                text: draft.bodyText,
                html: draft.bodyHtml,
              });
              res.statusCode = result.success ? 200 : 400;
              res.end(JSON.stringify(result));
              return;
            }

            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Endpoint not found' }));
          } catch (err: any) {
            console.error('Mail API Server Error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: err.message || 'Internal Server Error' }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [tailwindcss(), react(), mailApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
