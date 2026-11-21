"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyInquiry = notifyInquiry;
/** SMTP가 있으면 기관 메일로 문의 알림을 보낸다. 설정이 없거나 실패해도 문의 저장은 유지한다. */
async function notifyInquiry(inquiry) {
    const host = process.env.SMTP_HOST?.trim();
    const to = process.env.INQUIRY_NOTIFY_TO?.trim() || 'khayahinternational@gmail.com';
    if (!host)
        return;
    const nodemailer = await Promise.resolve().then(() => __importStar(require('nodemailer')));
    const port = Number(process.env.SMTP_PORT || 587);
    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: process.env.SMTP_USER
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS ?? '' }
            : undefined,
    });
    await transporter.sendMail({
        from: process.env.SMTP_FROM?.trim() || process.env.SMTP_USER || to,
        to,
        subject: `[카야 문의] ${inquiry.subject}`,
        text: [`유형: ${inquiry.type}`, `이름: ${inquiry.name}`, `연락처: ${inquiry.contact}`, '', inquiry.body].join('\n'),
    });
}
//# sourceMappingURL=inquiryNotify.js.map