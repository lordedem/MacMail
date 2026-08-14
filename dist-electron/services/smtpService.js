"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smtpService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.smtpService = {
    async sendEmail(params) {
        const transporter = nodemailer_1.default.createTransport({
            host: params.host,
            port: params.port,
            secure: params.secure,
            auth: {
                user: params.user,
                pass: params.pass,
            },
        });
        try {
            const info = await transporter.sendMail({
                from: params.from,
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
