"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_MAINTENANCE_DOCUMENT = void 0;
exports.normalizeMaintenanceDocument = normalizeMaintenanceDocument;
exports.readMaintenanceDocument = readMaintenanceDocument;
exports.writeMaintenanceDocument = writeMaintenanceDocument;
const siteDocumentStore_1 = require("./siteDocumentStore");
const DOCUMENT_KEY = 'maintenance';
const TITLE_MAX = 80;
const MESSAGE_MAX = 600;
exports.DEFAULT_MAINTENANCE_DOCUMENT = {
    version: 1,
    enabled: false,
    titleKo: '잠시 점검 중입니다',
    titleEn: "We'll be back soon",
    messageKo: '더 안정적인 서비스를 위해 사이트를 점검하고 있습니다.\n조금만 기다려 주시면 곧 다시 찾아뵙겠습니다.',
    messageEn: 'Khayah is temporarily unavailable while we carry out maintenance.\nPlease visit again in a little while.',
};
function isPlainObject(v) {
    return typeof v === 'object' && v !== null && !Array.isArray(v);
}
function asString(v) {
    return typeof v === 'string' ? v.trim() : '';
}
function clip(v, max) {
    return v.length > max ? v.slice(0, max) : v;
}
function textOrDefault(v, max, fallback) {
    const s = clip(asString(v), max);
    return s || fallback;
}
function isMissingDocument(e) {
    return e?.status === 404;
}
function normalizeMaintenanceDocument(body) {
    const base = exports.DEFAULT_MAINTENANCE_DOCUMENT;
    if (!isPlainObject(body))
        return { ...base };
    return {
        version: 1,
        enabled: body.enabled === true,
        titleKo: textOrDefault(body.titleKo, TITLE_MAX, base.titleKo),
        titleEn: textOrDefault(body.titleEn, TITLE_MAX, base.titleEn),
        messageKo: textOrDefault(body.messageKo, MESSAGE_MAX, base.messageKo),
        messageEn: textOrDefault(body.messageEn, MESSAGE_MAX, base.messageEn),
    };
}
async function readMaintenanceDocument() {
    try {
        const parsed = await (0, siteDocumentStore_1.readJsonDocument)(DOCUMENT_KEY);
        return normalizeMaintenanceDocument(parsed);
    }
    catch (e) {
        if (isMissingDocument(e))
            return { ...exports.DEFAULT_MAINTENANCE_DOCUMENT };
        throw e;
    }
}
async function writeMaintenanceDocument(body) {
    if (!isPlainObject(body) || body.version !== 1 || typeof body.enabled !== 'boolean') {
        const err = new Error('Invalid maintenance payload');
        err.status = 400;
        throw err;
    }
    await (0, siteDocumentStore_1.writeJsonDocument)(DOCUMENT_KEY, normalizeMaintenanceDocument(body));
}
//# sourceMappingURL=maintenanceFileService.js.map