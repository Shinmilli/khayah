"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readInquiryFaqDocument = readInquiryFaqDocument;
exports.writeInquiryFaqDocument = writeInquiryFaqDocument;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const inquiry_faq_default_json_1 = __importDefault(require("../seed/inquiry-faq.default.json"));
const DATA_FILE = path_1.default.resolve(process.cwd(), 'data', 'inquiry-faq.json');
function isPlainObject(v) {
    return typeof v === 'object' && v !== null && !Array.isArray(v);
}
function validateItem(v) {
    if (!isPlainObject(v))
        return false;
    if (typeof v.id !== 'string' || !v.id.trim())
        return false;
    if (typeof v.question !== 'string')
        return false;
    if (typeof v.answer !== 'string')
        return false;
    if (typeof v.published !== 'boolean')
        return false;
    if (typeof v.order !== 'number' || !Number.isFinite(v.order))
        return false;
    return true;
}
function validateDocument(body) {
    if (!isPlainObject(body))
        return false;
    if (body.version !== 1)
        return false;
    if (!Array.isArray(body.items))
        return false;
    return body.items.every(validateItem);
}
async function readInquiryFaqDocument() {
    try {
        const raw = await promises_1.default.readFile(DATA_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        if (validateDocument(parsed))
            return parsed;
        console.warn('[inquiry-faq] invalid file content, using seed');
    }
    catch (e) {
        const code = e?.code;
        if (code !== 'ENOENT')
            console.warn('[inquiry-faq] read failed, using seed:', e);
    }
    return inquiry_faq_default_json_1.default;
}
async function writeInquiryFaqDocument(body) {
    if (!validateDocument(body)) {
        const err = new Error('Invalid FAQ payload');
        err.status = 400;
        throw err;
    }
    const cleaned = {
        version: 1,
        items: body.items.map((item) => ({
            id: item.id.trim().slice(0, 80),
            question: item.question.trim().slice(0, 200),
            answer: item.answer.trim().slice(0, 4000),
            published: item.published,
            order: item.order,
        })),
    };
    await promises_1.default.mkdir(path_1.default.dirname(DATA_FILE), { recursive: true });
    await promises_1.default.writeFile(DATA_FILE, JSON.stringify(cleaned, null, 2), 'utf8');
}
//# sourceMappingURL=inquiryFaqFileService.js.map