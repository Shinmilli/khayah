"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NAV_MENU_IMAGE_KEYS = void 0;
exports.validateNavMenuImagesDocument = validateNavMenuImagesDocument;
exports.normalizeNavMenuImagesDocument = normalizeNavMenuImagesDocument;
exports.readNavMenuImagesDocument = readNavMenuImagesDocument;
exports.readNavMenuImagesState = readNavMenuImagesState;
exports.writeNavMenuImagesDocument = writeNavMenuImagesDocument;
const normalizeStoredMediaUrl_1 = require("../utils/normalizeStoredMediaUrl");
const storedMedia_1 = require("../utils/storedMedia");
const documentDraft_1 = require("./documentDraft");
const siteDocumentStore_1 = require("./siteDocumentStore");
const DOCUMENT_KEY = 'nav-menu-images';
exports.NAV_MENU_IMAGE_KEYS = ['khayah', 'business', 'support', 'news'];
function isPlainObject(v) {
    return typeof v === 'object' && v !== null && !Array.isArray(v);
}
function emptyDocument() {
    return {
        version: 1,
        images: { khayah: '', business: '', support: '', news: '' },
    };
}
function normalizeImage(image) {
    const trimmed = image.trim();
    if (!trimmed)
        return '';
    if (trimmed.startsWith('/'))
        return trimmed;
    return (0, normalizeStoredMediaUrl_1.normalizeStoredMediaUrl)(trimmed) ?? trimmed;
}
function validateNavMenuImagesDocument(body) {
    if (!isPlainObject(body))
        return false;
    if (body.version !== 1)
        return false;
    const images = body.images;
    if (!isPlainObject(images))
        return false;
    return exports.NAV_MENU_IMAGE_KEYS.every((key) => typeof images[key] === 'string');
}
function normalizeNavMenuImagesDocument(body) {
    const base = emptyDocument();
    if (!isPlainObject(body))
        return base;
    const images = body.images;
    if (!isPlainObject(images))
        return base;
    for (const key of exports.NAV_MENU_IMAGE_KEYS) {
        const raw = images[key];
        base.images[key] = typeof raw === 'string' ? normalizeImage(raw) : '';
    }
    return base;
}
async function readNavMenuImagesDocument() {
    const parsed = await (0, siteDocumentStore_1.readJsonDocument)(DOCUMENT_KEY);
    if (!validateNavMenuImagesDocument(parsed))
        throw new Error('Invalid nav menu images document');
    return normalizeNavMenuImagesDocument(parsed);
}
function readNavMenuImagesState(preferDraft) {
    return (0, documentDraft_1.readDrafted)(DOCUMENT_KEY, readNavMenuImagesDocument, preferDraft);
}
async function writeNavMenuImagesDocument(body, mode = 'publish') {
    if (!validateNavMenuImagesDocument(body)) {
        const err = new Error('Invalid nav menu images payload');
        err.status = 400;
        throw err;
    }
    const cleaned = normalizeNavMenuImagesDocument(body);
    await (0, documentDraft_1.writeDrafted)(DOCUMENT_KEY, cleaned, mode, async (previous) => {
        if (previous != null)
            await (0, storedMedia_1.deleteRemovedStoredMedia)(previous, cleaned);
    });
}
//# sourceMappingURL=navMenuImagesFileService.js.map