"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInquiryFaqLocale = parseInquiryFaqLocale;
exports.readInquiryFaqDocument = readInquiryFaqDocument;
exports.readInquiryFaqState = readInquiryFaqState;
exports.readInquiryFaqForLocale = readInquiryFaqForLocale;
exports.writeInquiryFaqDocument = writeInquiryFaqDocument;
const inquiry_faq_default_json_1 = __importDefault(require("../seed/inquiry-faq.default.json"));
const documentDraft_1 = require("./documentDraft");
const siteDocumentStore_1 = require("./siteDocumentStore");
const DOCUMENT_KEY = 'inquiry-faq';
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
function parseInquiryFaqLocale(raw) {
    return raw === 'en' ? 'en' : 'ko';
}
async function readInquiryFaqDocument() {
    const parsed = await (0, siteDocumentStore_1.readJsonDocument)(DOCUMENT_KEY);
    if (validateDocumentV2(parsed))
        return parsed;
    if (validateDocumentV1(parsed))
        return migrateV1ToV2(parsed);
    throw new Error('Invalid FAQ document');
}
function readInquiryFaqState(preferDraft) {
    return (0, documentDraft_1.readDrafted)(DOCUMENT_KEY, readInquiryFaqDocument, preferDraft);
}
async function readInquiryFaqForLocale(locale, preferDraft = false) {
    const { doc } = await readInquiryFaqState(preferDraft);
    return doc.locales[locale];
}
async function writeInquiryFaqDocument(body, mode = 'publish') {
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
    await (0, documentDraft_1.writeDrafted)(DOCUMENT_KEY, cleaned, mode);
}
//# sourceMappingURL=inquiryFaqFileService.js.map