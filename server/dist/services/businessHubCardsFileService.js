"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUSINESS_HUB_ICONS = exports.BUSINESS_HUBS = void 0;
exports.parseBusinessLocale = parseBusinessLocale;
exports.parseBusinessHub = parseBusinessHub;
exports.readBusinessHubCardsDocument = readBusinessHubCardsDocument;
exports.readBusinessHubCardsState = readBusinessHubCardsState;
exports.readBusinessHubCardsForLocale = readBusinessHubCardsForLocale;
exports.writeBusinessHubCardsDocument = writeBusinessHubCardsDocument;
const documentDraft_1 = require("./documentDraft");
const siteDocumentStore_1 = require("./siteDocumentStore");
const DOCUMENT_KEY = 'business-hub-cards';
exports.BUSINESS_HUBS = ['overseas', 'domestic'];
exports.BUSINESS_HUB_ICONS = ['education', 'volunteer', 'projects', 'people'];
function isPlainObject(v) {
    return typeof v === 'object' && v !== null && !Array.isArray(v);
}
function isHub(v) {
    return v === 'overseas' || v === 'domestic';
}
function isIcon(v) {
    return v === 'education' || v === 'volunteer' || v === 'projects' || v === 'people';
}
function validateLocaleCopy(v) {
    if (!isPlainObject(v))
        return false;
    if (typeof v.title !== 'string')
        return false;
    if (typeof v.description !== 'string')
        return false;
    if (typeof v.buttonLabel !== 'string')
        return false;
    return true;
}
function validateCard(v) {
    if (!isPlainObject(v))
        return false;
    if (typeof v.id !== 'string' || !v.id.trim())
        return false;
    if (!isHub(v.hub))
        return false;
    if (typeof v.order !== 'number' || !Number.isFinite(v.order))
        return false;
    if (typeof v.enabled !== 'boolean')
        return false;
    if (typeof v.href !== 'string')
        return false;
    if (!isIcon(v.icon))
        return false;
    if (!isPlainObject(v.locales))
        return false;
    return validateLocaleCopy(v.locales.ko) && validateLocaleCopy(v.locales.en);
}
function validateDocument(body) {
    if (!isPlainObject(body))
        return false;
    if (body.version !== 1)
        return false;
    if (!Array.isArray(body.cards))
        return false;
    return body.cards.every(validateCard);
}
function normalizeHref(href) {
    const trimmed = href.trim();
    if (!trimmed)
        return '';
    if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('mailto:'))
        return trimmed.slice(0, 400);
    const withoutLocale = trimmed.replace(/^\/en(?=\/|$)/, '') || '/';
    const withSlash = withoutLocale.startsWith('/') ? withoutLocale : `/${withoutLocale}`;
    return withSlash.slice(0, 200);
}
function normalizeDocument(doc) {
    return {
        version: 1,
        cards: [...doc.cards]
            .map((card) => ({
            id: card.id.trim().slice(0, 80),
            hub: card.hub,
            order: card.order,
            enabled: card.enabled,
            href: normalizeHref(card.href),
            icon: card.icon,
            locales: {
                ko: {
                    title: card.locales.ko.title.trim().slice(0, 80),
                    description: card.locales.ko.description.trim().slice(0, 800),
                    buttonLabel: card.locales.ko.buttonLabel.trim().slice(0, 40),
                },
                en: {
                    title: card.locales.en.title.trim().slice(0, 80),
                    description: card.locales.en.description.trim().slice(0, 800),
                    buttonLabel: card.locales.en.buttonLabel.trim().slice(0, 40),
                },
            },
        }))
            .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
            .slice(0, 24),
    };
}
function parseBusinessLocale(raw) {
    return raw === 'en' ? 'en' : 'ko';
}
function parseBusinessHub(raw) {
    return isHub(raw) ? raw : null;
}
async function readBusinessHubCardsDocument() {
    const parsed = await (0, siteDocumentStore_1.readJsonDocument)(DOCUMENT_KEY);
    if (!validateDocument(parsed))
        throw new Error('Invalid business hub cards document');
    return normalizeDocument(parsed);
}
function readBusinessHubCardsState(preferDraft) {
    return (0, documentDraft_1.readDrafted)(DOCUMENT_KEY, readBusinessHubCardsDocument, preferDraft);
}
async function readBusinessHubCardsForLocale(locale, hub, preferDraft = false) {
    const { doc } = await readBusinessHubCardsState(preferDraft);
    return doc.cards
        .filter((card) => card.enabled && (!hub || card.hub === hub) && card.locales[locale].title.trim())
        .sort((a, b) => a.order - b.order)
        .map((card) => ({
        id: card.id,
        hub: card.hub,
        order: card.order,
        href: card.href,
        icon: card.icon,
        title: card.locales[locale].title,
        description: card.locales[locale].description,
        buttonLabel: card.locales[locale].buttonLabel,
    }));
}
async function writeBusinessHubCardsDocument(body, mode = 'publish') {
    if (!validateDocument(body)) {
        const err = new Error('Invalid business hub cards payload');
        err.status = 400;
        throw err;
    }
    await (0, documentDraft_1.writeDrafted)(DOCUMENT_KEY, normalizeDocument(body), mode);
}
//# sourceMappingURL=businessHubCardsFileService.js.map