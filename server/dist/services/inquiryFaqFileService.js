"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInquiryFaqLocale = parseInquiryFaqLocale;
exports.readInquiryFaqDocument = readInquiryFaqDocument;
exports.readInquiryFaqForLocale = readInquiryFaqForLocale;
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
function validateLocaleContent(v) {
    if (!isPlainObject(v))
        return false;
    if (!Array.isArray(v.items))
        return false;
    return v.items.every(validateItem);
}
function validateDocumentV2(body) {
    if (!isPlainObject(body))
        return false;
    if (body.version !== 2)
        return false;
    if (!isPlainObject(body.locales))
        return false;
    const locales = body.locales;
    return validateLocaleContent(locales.ko) && validateLocaleContent(locales.en);
}
function validateDocumentV1(body) {
    if (!isPlainObject(body))
        return false;
    if (body.version !== 1)
        return false;
    if (!Array.isArray(body.items))
        return false;
    return body.items.every(validateItem);
}
function cloneItems(items) {
    return JSON.parse(JSON.stringify(items));
}
function migrateV1ToV2(v1) {
    const seed = inquiry_faq_default_json_1.default;
    return {
        version: 2,
        locales: {
            ko: { items: cloneItems(v1.items) },
            en: { items: cloneItems(seed.locales.en.items) },
        },
    };
}
function normalizeDocument(body) {
    if (validateDocumentV2(body))
        return body;
    if (validateDocumentV1(body))
        return migrateV1ToV2(body);
    return inquiry_faq_default_json_1.default;
}
function parseInquiryFaqLocale(raw) {
    return raw === 'en' ? 'en' : 'ko';
}
async function readInquiryFaqDocument() {
    try {
        const raw = await promises_1.default.readFile(DATA_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        const normalized = normalizeDocument(parsed);
        if (!validateDocumentV2(parsed)) {
            await promises_1.default.mkdir(path_1.default.dirname(DATA_FILE), { recursive: true });
            await promises_1.default.writeFile(DATA_FILE, JSON.stringify(normalized, null, 2), 'utf8');
        }
        return normalized;
    }
    catch (e) {
        const code = e?.code;
        if (code !== 'ENOENT')
            console.warn('[inquiry-faq] read failed, using seed:', e);
    }
    return inquiry_faq_default_json_1.default;
}
async function readInquiryFaqForLocale(locale) {
    const doc = await readInquiryFaqDocument();
    return doc.locales[locale];
}
async function writeInquiryFaqDocument(body) {
    if (!validateDocumentV2(body)) {
        const err = new Error('Invalid FAQ payload');
        err.status = 400;
        throw err;
    }
    const cleaned = {
        version: 2,
        locales: {
            ko: {
                items: body.locales.ko.items.map((item) => ({
                    id: item.id.trim().slice(0, 80),
                    question: item.question.trim().slice(0, 200),
                    answer: item.answer.trim().slice(0, 4000),
                    published: item.published,
                    order: item.order,
                })),
            },
            en: {
                items: body.locales.en.items.map((item) => ({
                    id: item.id.trim().slice(0, 80),
                    question: item.question.trim().slice(0, 200),
                    answer: item.answer.trim().slice(0, 4000),
                    published: item.published,
                    order: item.order,
                })),
            },
        },
    };
    await promises_1.default.mkdir(path_1.default.dirname(DATA_FILE), { recursive: true });
    await promises_1.default.writeFile(DATA_FILE, JSON.stringify(cleaned, null, 2), 'utf8');
}
//# sourceMappingURL=inquiryFaqFileService.js.map