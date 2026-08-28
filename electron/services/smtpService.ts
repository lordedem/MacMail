import nodemailer from 'nodemailer';

export interface SmtpSendParams {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: { filename: string; content?: any; path?: string }[];
}

export const smtpService = {
  async sendEmail(params: SmtpSendParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const isPort465 = params.port === 465;

    const transporter = nodemailer.createTransport({
      host: params.host,
      port: params.port || 465,
      secure: params.secure !== undefined ? params.secure : isPort465,
      auth: {
        user: params.user,
        pass: params.pass,
      },
      tls: {
        rejectUnauthorized: false, // Allows custom self-hosted SSL certificates
      },
    });

    try {
      const info = await transporter.sendMail({
        from: `"${params.from.split('@')[0]}" <${params.from}>`,
        to: params.to.join(', '),
        cc: params.cc && params.cc.length > 0 ? params.cc.join(', ') : undefined,
        bcc: params.bcc && params.bcc.length > 0 ? params.bcc.join(', ') : undefined,
        subject: params.subject,
        text: params.text,
        html: params.html,
        attachments: params.attachments,
      });

      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.error('SMTP send error:', err);
      const errorMsg =
        err.response ||
        err.message ||
        'Failed to send email via SMTP server.';
      return { success: false, error: errorMsg };
    }
  },
};
