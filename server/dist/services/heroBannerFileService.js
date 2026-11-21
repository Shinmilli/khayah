"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHeroLocale = parseHeroLocale;
exports.readHeroBannerDocument = readHeroBannerDocument;
exports.readHeroBannerForLocale = readHeroBannerForLocale;
exports.writeHeroBannerDocument = writeHeroBannerDocument;
const normalizeStoredMediaUrl_1 = require("../utils/normalizeStoredMediaUrl");
const storedMedia_1 = require("../utils/storedMedia");
const siteDocumentStore_1 = require("./siteDocumentStore");
const DOCUMENT_KEY = 'hero-banner';
const KO_SMALL_LINE = '교육으로 사람을 세우는 국제개발협력 NGO, 카야인터내셔널';
function readSmallLine(v, whenMissing) {
    if (typeof v !== 'string')
        return whenMissing;
    return v.trim().slice(0, 200);
}
function isPlainObject(v) {
    return typeof v === 'object' && v !== null && !Array.isArray(v);
}
function validateLocaleCopy(v) {
    if (!isPlainObject(v))
        return false;
    if (typeof v.alt !== 'string')
        return false;
    if (!Array.isArray(v.lines) || !v.lines.every((line) => typeof line === 'string'))
        return false;
    if (v.smallLine != null && typeof v.smallLine !== 'string')
        return false;
    return true;
}
function validateSlide(v) {
    if (!isPlainObject(v))
        return false;
    if (typeof v.id !== 'string' || !v.id.trim())
        return false;
    if (typeof v.order !== 'number' || !Number.isFinite(v.order))
        return false;
    if (typeof v.enabled !== 'boolean')
        return false;
    if (typeof v.image !== 'string')
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
    if (!Array.isArray(body.slides))
        return false;
    return body.slides.every(validateSlide);
}
function normalizeImage(image) {
    const trimmed = image.trim();
    if (!trimmed)
        return trimmed;
    if (trimmed.startsWith('/'))
        return trimmed;
    return (0, normalizeStoredMediaUrl_1.normalizeStoredMediaUrl)(trimmed) ?? trimmed;
}
function normalizeDocument(doc) {
    return {
        version: 1,
        slides: [...doc.slides]
            .map((slide) => ({
            id: slide.id.trim().slice(0, 80),
            order: slide.order,
            enabled: slide.enabled,
            image: normalizeImage(slide.image),
            mobileImage: normalizeImage(typeof slide.mobileImage === 'string' ? slide.mobileImage : ''),
            align: (slide.align === 'center' ? 'center' : 'left'),
            dim: (slide.dim === 'weak' ? 'weak' : slide.dim === 'strong' ? 'strong' : 'mid'),
            buttons: (Array.isArray(slide.buttons) ? slide.buttons : []).slice(0, 2).map((row) => ({
                label: typeof row?.label === 'string' ? row.label.trim().slice(0, 40) : '',
                href: typeof row?.href === 'string' ? row.href.trim().slice(0, 400) : '',
            })),
            locales: {
                ko: {
                    alt: slide.locales.ko.alt.trim().slice(0, 200),
                    lines: slide.locales.ko.lines.map((l) => l.trimEnd()).slice(0, 8),
                    smallLine: readSmallLine(slide.locales.ko.smallLine, KO_SMALL_LINE),
                },
                en: {
                    alt: slide.locales.en.alt.trim().slice(0, 200),
                    lines: slide.locales.en.lines.map((l) => l.trimEnd()).slice(0, 8),
                    smallLine: readSmallLine(slide.locales.en.smallLine, ''),
                },
            },
        }))
            .sort((a, b) => a.order - b.order)
            .slice(0, 12),
    };
}
function parseHeroLocale(raw) {
    return raw === 'en' ? 'en' : 'ko';
}
async function readHeroBannerDocument() {
    const parsed = await (0, siteDocumentStore_1.readJsonDocument)(DOCUMENT_KEY);
    if (!validateDocument(parsed))
        throw new Error('Invalid hero banner document');
    return normalizeDocument(parsed);
}
async function readHeroBannerForLocale(locale) {
    const doc = await readHeroBannerDocument();
    return doc.slides
        .filter((s) => s.enabled && s.image.trim())
        .sort((a, b) => a.order - b.order)
        .map((s) => ({
        id: s.id,
        order: s.order,
        image: s.image,
        mobileImage: s.mobileImage,
        align: s.align,
        dim: s.dim,
        buttons: s.buttons.filter((button) => button.label && button.href),
        alt: s.locales[locale].alt,
        lines: s.locales[locale].lines.map((line) => line.trimEnd()).filter((line) => line.length > 0),
        smallLine: s.locales[locale].smallLine ?? (locale === 'ko' ? KO_SMALL_LINE : ''),
    }));
}
async function writeHeroBannerDocument(body) {
    if (!validateDocument(body)) {
        const err = new Error('Invalid hero banner payload');
        err.status = 400;
        throw err;
    }
    const cleaned = normalizeDocument(body);
    const previous = await readHeroBannerDocument();
    await (0, siteDocumentStore_1.writeJsonDocument)(DOCUMENT_KEY, cleaned);
    await (0, storedMedia_1.deleteRemovedStoredMedia)(previous, cleaned);
}
//# sourceMappingURL=heroBannerFileService.js.map