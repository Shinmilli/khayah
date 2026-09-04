"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHeroLocale = parseHeroLocale;
exports.readHeroBannerDocument = readHeroBannerDocument;
exports.readHeroBannerForLocale = readHeroBannerForLocale;
exports.writeHeroBannerDocument = writeHeroBannerDocument;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const hero_banner_default_json_1 = __importDefault(require("../seed/hero-banner.default.json"));
const normalizeStoredMediaUrl_1 = require("../utils/normalizeStoredMediaUrl");
const DATA_FILE = path_1.default.resolve(process.cwd(), 'data', 'hero-banner.json');
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
            locales: {
                ko: {
                    alt: slide.locales.ko.alt.trim().slice(0, 200),
                    lines: slide.locales.ko.lines.map((l) => l.trimEnd()).slice(0, 8),
                },
                en: {
                    alt: slide.locales.en.alt.trim().slice(0, 200),
                    lines: slide.locales.en.lines.map((l) => l.trimEnd()).slice(0, 8),
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
    try {
        const raw = await promises_1.default.readFile(DATA_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        if (validateDocument(parsed))
            return normalizeDocument(parsed);
        console.warn('[hero-banner] invalid file content, using seed');
    }
    catch (e) {
        const code = e?.code;
        if (code !== 'ENOENT')
            console.warn('[hero-banner] read failed, using seed:', e);
    }
    return normalizeDocument(hero_banner_default_json_1.default);
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
        alt: s.locales[locale].alt,
        lines: s.locales[locale].lines.filter((line) => line.trim().length > 0),
    }))
        .filter((s) => s.lines.length > 0);
}
async function writeHeroBannerDocument(body) {
    if (!validateDocument(body)) {
        const err = new Error('Invalid hero banner payload');
        err.status = 400;
        throw err;
    }
    const cleaned = normalizeDocument(body);
    await promises_1.default.mkdir(path_1.default.dirname(DATA_FILE), { recursive: true });
    await promises_1.default.writeFile(DATA_FILE, JSON.stringify(cleaned, null, 2), 'utf8');
}
//# sourceMappingURL=heroBannerFileService.js.map