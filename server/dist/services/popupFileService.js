"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePopupDocument = parsePopupDocument;
exports.readPopupDocument = readPopupDocument;
exports.emptyPopupDocument = emptyPopupDocument;
exports.writePopupDocument = writePopupDocument;
const storedMedia_1 = require("../utils/storedMedia");
const siteDocumentStore_1 = require("./siteDocumentStore");
const DOCUMENT_KEY = 'popup';
const MAX_ITEMS = 20;
const DEFAULT_BUTTON_LABELS = { ko: '자세히 보기', en: 'Learn more' };
function isPlainObject(v) {
    return typeof v === 'object' && v !== null && !Array.isArray(v);
}
function asDate(v) {
    const s = asString(v);
    return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '';
}
function asString(v) {
    return typeof v === 'string' ? v.trim() : '';
}
function clip(v, max) {
    return v.length > max ? v.slice(0, max) : v;
}
function asExternalUrl(v) {
    const s = clip(asString(v), 2000);
    if (!s)
        return '';
    try {
        const u = new URL(s);
        if (u.protocol === 'http:' || u.protocol === 'https:')
            return s;
    }
    catch {
        /* invalid */
    }
    return '';
}
function asImageUrl(v) {
    const s = clip(asString(v), 2000);
    if (!s)
        return '';
    if (s.startsWith('/') && !s.startsWith('//'))
        return s;
    return asExternalUrl(s);
}
function newId() {
    return `p_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}
function asButtonLabels(v) {
    if (!isPlainObject(v))
        return { ...DEFAULT_BUTTON_LABELS };
    const ko = clip(asString(v.ko), 80) || DEFAULT_BUTTON_LABELS.ko;
    const en = clip(asString(v.en), 80) || DEFAULT_BUTTON_LABELS.en;
    return { ko, en };
}
function parseItem(raw, usedIds) {
    if (!isPlainObject(raw))
        return null;
    let id = clip(asString(raw.id), 80);
    if (!id || usedIds.has(id))
        id = newId();
    usedIds.add(id);
    return {
        id,
        enabled: raw.enabled === true,
        imageUrl: asImageUrl(raw.imageUrl),
        linkUrl: asExternalUrl(raw.linkUrl),
        buttonEnabled: raw.buttonEnabled === true,
        buttonLabels: asButtonLabels(raw.buttonLabels),
        buttonUrl: asExternalUrl(raw.buttonUrl),
        startsOn: asDate(raw.startsOn),
        endsOn: asDate(raw.endsOn),
    };
}
function parsePopupDocument(body) {
    if (!isPlainObject(body) || !Array.isArray(body.items))
        return null;
    const usedIds = new Set();
    const items = [];
    for (const raw of body.items.slice(0, MAX_ITEMS)) {
        const item = parseItem(raw, usedIds);
        if (item)
            items.push(item);
    }
    return { version: 1, items };
}
function isMissingDocument(e) {
    return e?.status === 404;
}
async function readPopupDocument() {
    try {
        const parsed = await (0, siteDocumentStore_1.readJsonDocument)(DOCUMENT_KEY);
        const doc = parsePopupDocument(parsed);
        if (!doc)
            throw new Error('Invalid popup document');
        return doc;
    }
    catch (e) {
        if (isMissingDocument(e))
            return null;
        throw e;
    }
}
function emptyPopupDocument() {
    return { version: 1, items: [] };
}
async function writePopupDocument(body) {
    const normalized = parsePopupDocument(body);
    if (!normalized) {
        const err = new Error('Invalid popup payload');
        err.status = 400;
        throw err;
    }
    let previous = null;
    try {
        previous = await (0, siteDocumentStore_1.readJsonDocument)(DOCUMENT_KEY);
    }
    catch (e) {
        if (!isMissingDocument(e))
            throw e;
    }
    await (0, siteDocumentStore_1.writeJsonDocument)(DOCUMENT_KEY, normalized);
    await (0, storedMedia_1.deleteRemovedStoredMedia)(previous, normalized);
    return normalized;
}
//# sourceMappingURL=popupFileService.js.map