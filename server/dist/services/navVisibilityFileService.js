"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NAV_VISIBILITY_LINK_KEYS = exports.NAV_VISIBILITY_TOP_KEYS = void 0;
exports.normalizeNavVisibilityDocument = normalizeNavVisibilityDocument;
exports.validateNavVisibilityDocument = validateNavVisibilityDocument;
exports.readNavVisibilityDocument = readNavVisibilityDocument;
exports.readNavVisibilityState = readNavVisibilityState;
exports.writeNavVisibilityDocument = writeNavVisibilityDocument;
const documentDraft_1 = require("./documentDraft");
const siteDocumentStore_1 = require("./siteDocumentStore");
const DOCUMENT_KEY = 'nav-visibility';
exports.NAV_VISIBILITY_TOP_KEYS = ['khayah', 'business', 'support', 'news'];
exports.NAV_VISIBILITY_LINK_KEYS = [
    'greeting',
    'history',
    'location',
    'financialReport',
    'aboutKhayah',
    'ci',
    'org',
    'domestic',
    'domesticEducation',
    'overseas',
    'overseasEducation',
    'overseasVolunteer',
    'domesticProjects',
    'overseasProjects',
    'researchProjects',
    'researchEducation',
    'researchSocial',
    'socialAcademy',
    'socialComfort',
    'advocacy',
    'projects',
    'supportGuide',
    'supportMethod',
    'announcements',
    'activities',
    'stories',
    'newsletter',
    'press',
    'inquiry',
    'impactGlance',
];
function isPlainObject(v) {
    return typeof v === 'object' && v !== null && !Array.isArray(v);
}
function asBoolean(v, fallback) {
    return typeof v === 'boolean' ? v : fallback;
}
function emptyDocument() {
    const top = {};
    const links = {};
    for (const key of exports.NAV_VISIBILITY_TOP_KEYS)
        top[key] = true;
    for (const key of exports.NAV_VISIBILITY_LINK_KEYS)
        links[key] = key !== 'impactGlance';
    return { version: 1, top, links };
}
function normalizeNavVisibilityDocument(body) {
    const base = emptyDocument();
    if (!isPlainObject(body))
        return base;
    const top = isPlainObject(body.top) ? body.top : {};
    const links = isPlainObject(body.links) ? body.links : {};
    for (const key of exports.NAV_VISIBILITY_TOP_KEYS) {
        base.top[key] = asBoolean(top[key], true);
    }
    for (const key of exports.NAV_VISIBILITY_LINK_KEYS) {
        base.links[key] = asBoolean(links[key], key !== 'impactGlance');
    }
    return base;
}
function validateNavVisibilityDocument(body) {
    if (!isPlainObject(body))
        return false;
    if (body.version !== 1)
        return false;
    if (!isPlainObject(body.top) || !isPlainObject(body.links))
        return false;
    const top = body.top;
    const links = body.links;
    const topOk = exports.NAV_VISIBILITY_TOP_KEYS.every((key) => typeof top[key] === 'boolean');
    const linksOk = exports.NAV_VISIBILITY_LINK_KEYS.every((key) => typeof links[key] === 'boolean');
    return topOk && linksOk;
}
async function readNavVisibilityDocument() {
    const parsed = await (0, siteDocumentStore_1.readJsonDocument)(DOCUMENT_KEY);
    if (!isPlainObject(parsed))
        throw new Error('Invalid nav visibility document');
    return normalizeNavVisibilityDocument(parsed);
}
function readNavVisibilityState(preferDraft) {
    return (0, documentDraft_1.readDrafted)(DOCUMENT_KEY, readNavVisibilityDocument, preferDraft);
}
async function writeNavVisibilityDocument(body, mode = 'publish') {
    if (!isPlainObject(body) || body.version !== 1) {
        const err = new Error('Invalid nav visibility payload');
        err.status = 400;
        throw err;
    }
    await (0, documentDraft_1.writeDrafted)(DOCUMENT_KEY, normalizeNavVisibilityDocument(body), mode);
}
//# sourceMappingURL=navVisibilityFileService.js.map