"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inquiriesService = exports.INQUIRY_STATUSES = exports.INQUIRY_TYPES = void 0;
exports.validatePin = validatePin;
const prisma_1 = require("../utils/prisma");
const pinHash_1 = require("../utils/pinHash");
exports.INQUIRY_TYPES = ['후원 문의', '봉사 참여', '사업 문의', '기타'];
exports.INQUIRY_STATUSES = ['대기', '처리중', '완료'];
function toPublic(row) {
    return {
        id: row.id,
        name: row.name,
        contact: row.contact,
        type: row.type,
        subject: row.subject,
        body: row.body,
        status: row.status,
        reply: row.reply,
        createdAt: row.createdAt.toISOString(),
        repliedAt: row.repliedAt ? row.repliedAt.toISOString() : null,
    };
}
function toAdmin(row) {
    return {
        ...toPublic(row),
        memo: row.memo,
        updatedAt: row.updatedAt.toISOString(),
    };
}
function normalizeContact(raw) {
    return raw.trim().replace(/\s+/g, '').toLowerCase();
}
function validatePin(pin) {
    return /^\d{4,6}$/.test(pin);
}
exports.inquiriesService = {
    async create(input) {
        if (!prisma_1.prisma)
            throw Object.assign(new Error('Database unavailable'), { status: 503 });
        const name = input.name.trim();
        const contact = normalizeContact(input.contact);
        const type = input.type.trim();
        const subject = input.subject.trim();
        const body = input.body.trim();
        const pin = input.pin.trim();
        if (!name || name.length > 80)
            throw Object.assign(new Error('이름을 확인해 주세요.'), { status: 400 });
        if (!contact || contact.length > 120)
            throw Object.assign(new Error('연락처(이메일 또는 전화)를 확인해 주세요.'), { status: 400 });
        if (!validatePin(pin))
            throw Object.assign(new Error('비밀번호는 숫자 4~6자리여야 합니다.'), { status: 400 });
        if (!exports.INQUIRY_TYPES.includes(type)) {
            throw Object.assign(new Error('문의 유형을 선택해 주세요.'), { status: 400 });
        }
        if (!subject || subject.length > 200)
            throw Object.assign(new Error('제목을 확인해 주세요.'), { status: 400 });
        if (!body || body.length > 5000)
            throw Object.assign(new Error('문의 내용을 확인해 주세요.'), { status: 400 });
        const pinHash = await (0, pinHash_1.hashPin)(pin);
        const created = await prisma_1.prisma.inquiry.create({
            data: { name, contact, pinHash, type, subject, body, status: '대기' },
        });
        return toPublic(created);
    },
    async lookup(input) {
        if (!prisma_1.prisma)
            throw Object.assign(new Error('Database unavailable'), { status: 503 });
        const name = input.name.trim();
        const contact = normalizeContact(input.contact);
        const pin = input.pin.trim();
        if (!name || !contact || !validatePin(pin)) {
            throw Object.assign(new Error('이름, 연락처, 비밀번호를 확인해 주세요.'), { status: 400 });
        }
        const candidates = await prisma_1.prisma.inquiry.findMany({
            where: { name, contact },
            orderBy: { createdAt: 'desc' },
            take: 30,
        });
        const matched = [];
        for (const row of candidates) {
            if (await (0, pinHash_1.verifyPin)(pin, row.pinHash))
                matched.push(toPublic(row));
        }
        return matched;
    },
    async listAdmin(page = 1, perPage = 20) {
        if (!prisma_1.prisma)
            throw Object.assign(new Error('Database unavailable'), { status: 503 });
        const skip = Math.max(0, (page - 1) * perPage);
        const take = Math.min(50, Math.max(1, perPage));
        const [total, rows] = await Promise.all([
            prisma_1.prisma.inquiry.count(),
            prisma_1.prisma.inquiry.findMany({
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
        ]);
        return { inquiries: rows.map(toAdmin), total };
    },
    async getAdmin(id) {
        if (!prisma_1.prisma)
            throw Object.assign(new Error('Database unavailable'), { status: 503 });
        const row = await prisma_1.prisma.inquiry.findUnique({ where: { id } });
        return row ? toAdmin(row) : null;
    },
    async updateAdmin(id, input) {
        if (!prisma_1.prisma)
            throw Object.assign(new Error('Database unavailable'), { status: 503 });
        const existing = await prisma_1.prisma.inquiry.findUnique({ where: { id } });
        if (!existing)
            return null;
        const data = {};
        if (input.status != null) {
            const s = input.status.trim();
            if (!exports.INQUIRY_STATUSES.includes(s)) {
                throw Object.assign(new Error('처리 상태가 올바르지 않습니다.'), { status: 400 });
            }
            data.status = s;
        }
        if (input.reply != null) {
            data.reply = input.reply.trim().slice(0, 5000);
            data.repliedAt = data.reply ? new Date() : null;
            if (data.reply && !data.status && existing.status === '대기')
                data.status = '처리중';
        }
        if (input.memo != null)
            data.memo = input.memo.trim().slice(0, 5000);
        const updated = await prisma_1.prisma.inquiry.update({ where: { id }, data });
        return toAdmin(updated);
    },
    async removeAdmin(id) {
        if (!prisma_1.prisma)
            throw Object.assign(new Error('Database unavailable'), { status: 503 });
        const existing = await prisma_1.prisma.inquiry.findUnique({ where: { id } });
        if (!existing)
            return false;
        await prisma_1.prisma.inquiry.delete({ where: { id } });
        return true;
    },
};
//# sourceMappingURL=inquiriesService.js.map