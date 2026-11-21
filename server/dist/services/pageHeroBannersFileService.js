"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAGE_HERO_BANNER_KEYS = void 0;
exports.validatePageHeroBannersDocument = validatePageHeroBannersDocument;
exports.normalizePageHeroBannersDocument = normalizePageHeroBannersDocument;
exports.readPageHeroBannersDocument = readPageHeroBannersDocument;
exports.readPageHeroBannersState = readPageHeroBannersState;
exports.writePageHeroBannersDocument = writePageHeroBannersDocument;
const normalizeStoredMediaUrl_1 = require("../utils/normalizeStoredMediaUrl");
const storedMedia_1 = require("../utils/storedMedia");
const documentDraft_1 = require("./documentDraft");
const siteDocumentStore_1 = require("./siteDocumentStore");
const DOCUMENT_KEY = 'page-hero-banners';
exports.PAGE_HERO_BANNER_KEYS = ['khayah', 'business', 'support', 'news'];
const LEGACY_BY_SECTION = {
    khayah: ['about/khayah', 'about/greeting', 'about/history', 'about/location', 'about/transparency', 'about/financial-report'],
    business: [
        'business/domestic',
        'business/overseas',
        'business/advocacy',
        'business/projects',
        'business/domestic/education',
        'business/overseas/education',
        'business/overseas/volunteer',
        'business/overseas/health-care',
    ],
    support: ['support/guide', 'support/apply'],
    news: ['news/announcements', 'stories', 'news/activities', 'news/newsletter', 'news/press', 'news/inquiry'],
};
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
function firstImage(...candidates) {
    for (const raw of candidates) {
        if (typeof raw === 'string' && raw.trim())
            return normalizeImage(raw);
    }
    return '';
}
function validatePageHeroBannersDocument(body) {
    if (!isPlainObject(body))
        return false;
    if (body.version !== 1)
        return false;
    const images = body.images;
    if (!isPlainObject(images))
        return false;
    return exports.PAGE_HERO_BANNER_KEYS.every((key) => typeof images[key] === 'string');
}
function normalizePageHeroBannersDocument(body) {
    const base = emptyDocument();
    if (!isPlainObject(body))
        return base;
    const images = body.images;
    if (!isPlainObject(images))
        return base;
    for (const key of exports.PAGE_HERO_BANNER_KEYS) {
        const legacy = LEGACY_BY_SECTION[key].map((pathKey) => images[pathKey]);
        base.images[key] = firstImage(images[key], ...legacy);
    }
    return base;
}
async function readPageHeroBannersDocument() {
    const parsed = await (0, siteDocumentStore_1.readJsonDocument)(DOCUMENT_KEY);
    if (!validatePageHeroBannersDocument(parsed))
        throw new Error('Invalid page hero banners document');
    return normalizePageHeroBannersDocument(parsed);
}
function readPageHeroBannersState(preferDraft) {
    return (0, documentDraft_1.readDrafted)(DOCUMENT_KEY, readPageHeroBannersDocument, preferDraft);
}
async function writePageHeroBannersDocument(body, mode = 'publish') {
    if (!validatePageHeroBannersDocument(body)) {
        const err = new Error('Invalid page hero banners payload');
        err.status = 400;
        throw err;
    }
    const cleaned = normalizePageHeroBannersDocument(body);
    await (0, documentDraft_1.writeDrafted)(DOCUMENT_KEY, cleaned, mode, async (previous) => {
        if (previous != null)
            await (0, storedMedia_1.deleteRemovedStoredMedia)(previous, cleaned);
    });
}
//# sourceMappingURL=pageHeroBannersFileService.js.map