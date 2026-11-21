"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHistoryLocale = parseHistoryLocale;
exports.readHistoryDocument = readHistoryDocument;
exports.readHistoryForLocale = readHistoryForLocale;
exports.writeHistoryDocument = writeHistoryDocument;
const siteDocumentStore_1 = require("./siteDocumentStore");
const DOCUMENT_KEY = 'history';
function isPlainObject(v) {
    return typeof v === 'object' && v !== null && !Array.isArray(v);
}
function validateItem(row) {
    if (!isPlainObject(row))
        return false;
    if (typeof row.id !== 'string' || !row.id.trim())
        return false;
    if (typeof row.month !== 'string')
        return false;
    if (typeof row.text !== 'string')
        return false;
    return true;
}
function validateYear(row) {
    if (!isPlainObject(row))
        return false;
    if (typeof row.id !== 'string' || !row.id.trim())
        return false;
    if (typeof row.year !== 'string' || !row.year.trim())
        return false;
    if (!Array.isArray(row.items))
        return false;
    return row.items.every(validateItem);
}
function validateLocaleContent(body) {
    if (!isPlainObject(body))
        return false;
    if (typeof body.lead !== 'string')
        return false;
    if (!Array.isArray(body.years))
        return false;
    return body.years.every(validateYear);
}
function validateDocument(body) {
    if (!isPlainObject(body))
        return false;
    if (body.version !== 1)
        return false;
    if (!isPlainObject(body.locales))
        return false;
    const locales = body.locales;
    return validateLocaleContent(locales.ko) && validateLocaleContent(locales.en);
}
function parseHistoryLocale(raw) {
    return raw === 'en' ? 'en' : 'ko';
}
async function readHistoryDocument() {
    const parsed = await (0, siteDocumentStore_1.readJsonDocument)(DOCUMENT_KEY);
    if (!validateDocument(parsed)) {
        throw new Error('Invalid history document');
    }
    return parsed;
}
async function readHistoryForLocale(locale) {
    const doc = await readHistoryDocument();
    return doc.locales[locale];
}
async function writeHistoryDocument(body) {
    if (!validateDocument(body)) {
        const err = new Error('Invalid history payload');
        err.status = 400;
        throw err;
    }
    await (0, siteDocumentStore_1.writeJsonDocument)(DOCUMENT_KEY, body);
}
//# sourceMappingURL=historyFileService.js.map