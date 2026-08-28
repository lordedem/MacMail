"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smtpService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.smtpService = {
    async sendEmail(params) {
        const isPort465 = params.port === 465;
        const transporter = nodemailer_1.default.createTransport({
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
        }
        catch (err) {
            console.error('SMTP send error:', err);
            return { success: false, error: err.message || 'Failed to send email via SMTP.' };
        }
    },
};
