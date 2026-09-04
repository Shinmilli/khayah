"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseImpactLocale = parseImpactLocale;
exports.readImpactStatsDocument = readImpactStatsDocument;
exports.readImpactStatsForLocale = readImpactStatsForLocale;
exports.writeImpactStatsDocument = writeImpactStatsDocument;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const impact_stats_default_json_1 = __importDefault(require("../seed/impact-stats.default.json"));
const DATA_FILE = path_1.default.resolve(process.cwd(), 'data', 'impact-stats.json');
function isPlainObject(v) {
    return typeof v === 'object' && v !== null && !Array.isArray(v);
}
function validateLocaleContent(body) {
    if (!isPlainObject(body))
        return false;
    if (!isPlainObject(body.donut))
        return false;
    const donut = body.donut;
    if (typeof donut.percent !== 'number' || !Number.isFinite(donut.percent))
        return false;
    if (donut.percent < 0 || donut.percent > 100)
        return false;
    if (!Array.isArray(donut.labelLines))
        return false;
    if (!donut.labelLines.every((line) => typeof line === 'string'))
        return false;
    if (!Array.isArray(body.stats))
        return false;
    for (const row of body.stats) {
        if (!isPlainObject(row))
            return false;
        if (typeof row.id !== 'string' || !row.id.trim())
            return false;
        if (typeof row.label !== 'string')
            return false;
        if (typeof row.value !== 'string')
            return false;
        if (row.unit != null && typeof row.unit !== 'string')
            return false;
    }
    return true;
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
    return validateLocaleContent(body);
}
function cloneLocaleContent(src) {
    return JSON.parse(JSON.stringify(src));
}
function migrateV1ToV2(v1) {
    const seed = impact_stats_default_json_1.default;
    return {
        version: 2,
        locales: {
            ko: cloneLocaleContent({ donut: v1.donut, stats: v1.stats }),
            en: cloneLocaleContent(seed.locales.en),
        },
    };
}
function normalizeDocument(body) {
    if (validateDocumentV2(body))
        return body;
    if (validateDocumentV1(body))
        return migrateV1ToV2(body);
    return impact_stats_default_json_1.default;
}
function parseImpactLocale(raw) {
    return raw === 'en' ? 'en' : 'ko';
}
async function readImpactStatsDocument() {
    try {
        const raw = await promises_1.default.readFile(DATA_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        const normalized = normalizeDocument(parsed);
        if (!validateDocumentV2(parsed)) {
            await promises_1.default.mkdir(path_1.default.dirname(DATA_FILE), { recursive: true });
            await promises_1.default.writeFile(DATA_FILE, JSON.stringify(normalized, null, 2), 'utf8');
        }
        return normalized;
    }
    catch (e) {
        const code = e?.code;
        if (code !== 'ENOENT')
            console.warn('[impact-stats] read failed, using seed:', e);
    }
    return impact_stats_default_json_1.default;
}
async function readImpactStatsForLocale(locale) {
    const doc = await readImpactStatsDocument();
    return doc.locales[locale];
}
async function writeImpactStatsDocument(body) {
    if (!validateDocumentV2(body)) {
        const err = new Error('Invalid impact stats payload');
        err.status = 400;
        throw err;
    }
    await promises_1.default.mkdir(path_1.default.dirname(DATA_FILE), { recursive: true });
    await promises_1.default.writeFile(DATA_FILE, JSON.stringify(body, null, 2), 'utf8');
}
//# sourceMappingURL=impactStatsFileService.js.map