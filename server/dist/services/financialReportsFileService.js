"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFinancialLocale = parseFinancialLocale;
exports.readFinancialReportsDocument = readFinancialReportsDocument;
exports.readFinancialReportsForLocale = readFinancialReportsForLocale;
exports.writeFinancialReportsDocument = writeFinancialReportsDocument;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const financial_reports_default_json_1 = __importDefault(require("../seed/financial-reports.default.json"));
const normalizeStoredMediaUrl_1 = require("../utils/normalizeStoredMediaUrl");
const DATA_FILE = path_1.default.resolve(process.cwd(), 'data', 'financial-reports.json');
const SEGMENT_LABEL_EN_BY_ID = {
    misc: 'Other income',
    brought_forward: 'Brought forward',
    subsidy: 'Subsidies',
    donation: 'Donations',
    fundraising: 'Fundraising costs',
    carried_next: 'Carried forward',
    admin: 'General administration',
    programs: 'Program expenses',
};
function isPlainObject(v) {
    return typeof v === 'object' && v !== null && !Array.isArray(v);
}
function defaultEnLabel(id, koLabel) {
    return SEGMENT_LABEL_EN_BY_ID[id] ?? koLabel;
}
function validateSegmentV2(v) {
    if (!isPlainObject(v))
        return false;
    if (typeof v.id !== 'string' || typeof v.percent !== 'number' || typeof v.color !== 'string')
        return false;
    if (!isPlainObject(v.labels))
        return false;
    return typeof v.labels.ko === 'string' && typeof v.labels.en === 'string';
}
function validateYearV2(v) {
    if (!isPlainObject(v))
        return false;
    if (typeof v.year !== 'number' || !Number.isFinite(v.year))
        return false;
    if (!Array.isArray(v.incomeSegments) || !Array.isArray(v.expenseSegments))
        return false;
    if (typeof v.incomeTotalWon !== 'number' || typeof v.expenseTotalWon !== 'number')
        return false;
    return v.incomeSegments.every(validateSegmentV2) && v.expenseSegments.every(validateSegmentV2);
}
function validateDocumentV2(body) {
    if (!isPlainObject(body))
        return false;
    if (body.version !== 2)
        return false;
    if (!isPlainObject(body.settings))
        return false;
    const s = body.settings;
    if (typeof s.showBalanceSheet !== 'boolean')
        return false;
    if (typeof s.showOperationsStatement !== 'boolean')
        return false;
    if (typeof s.showActionButtons !== 'boolean')
        return false;
    if (!Array.isArray(body.reports))
        return false;
    return body.reports.every(validateYearV2);
}
function validateSegmentV1(v) {
    if (!isPlainObject(v))
        return false;
    return typeof v.id === 'string' && typeof v.label === 'string' && typeof v.percent === 'number' && typeof v.color === 'string';
}
function validateDocumentV1(body) {
    if (!isPlainObject(body))
        return false;
    if (body.version !== 1)
        return false;
    if (!isPlainObject(body.settings))
        return false;
    if (!Array.isArray(body.reports))
        return false;
    for (const r of body.reports) {
        if (!isPlainObject(r))
            return false;
        if (typeof r.year !== 'number')
            return false;
        if (!Array.isArray(r.incomeSegments) || !Array.isArray(r.expenseSegments))
            return false;
        if (!r.incomeSegments.every(validateSegmentV1) || !r.expenseSegments.every(validateSegmentV1))
            return false;
    }
    return true;
}
function mapSegmentV1ToV2(seg) {
    return {
        id: seg.id,
        percent: seg.percent,
        color: seg.color,
        labels: { ko: seg.label, en: defaultEnLabel(seg.id, seg.label) },
    };
}
function migrateV1ToV2(v1) {
    return {
        version: 2,
        settings: v1.settings,
        reports: v1.reports.map((r) => ({
            ...r,
            incomeSegments: r.incomeSegments.map(mapSegmentV1ToV2),
            expenseSegments: r.expenseSegments.map(mapSegmentV1ToV2),
        })),
    };
}
function normalizeDocument(body) {
    if (validateDocumentV2(body))
        return normalizeDocumentMedia(body);
    if (validateDocumentV1(body))
        return normalizeDocumentMedia(migrateV1ToV2(body));
    return normalizeDocumentMedia(financial_reports_default_json_1.default);
}
function normalizeDocumentMedia(doc) {
    return {
        ...doc,
        reports: doc.reports.map((r) => ({
            ...r,
            balanceSheetImageUrl: (0, normalizeStoredMediaUrl_1.normalizeStoredMediaUrl)(r.balanceSheetImageUrl),
            operationsStatementImageUrl: (0, normalizeStoredMediaUrl_1.normalizeStoredMediaUrl)(r.operationsStatementImageUrl),
            donationDisclosurePdfUrl: (0, normalizeStoredMediaUrl_1.normalizeStoredMediaUrl)(r.donationDisclosurePdfUrl),
        })),
    };
}
function parseFinancialLocale(raw) {
    return raw === 'en' ? 'en' : 'ko';
}
function toPublicDocument(doc, locale) {
    const mapSeg = (seg) => ({
        id: seg.id,
        label: seg.labels[locale],
        percent: seg.percent,
        color: seg.color,
    });
    return {
        version: 2,
        settings: doc.settings,
        reports: doc.reports.map((r) => ({
            ...r,
            incomeSegments: r.incomeSegments.map(mapSeg),
            expenseSegments: r.expenseSegments.map(mapSeg),
        })),
    };
}
async function readFinancialReportsDocument() {
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
            console.warn('[financial-reports] read failed, using seed:', e);
    }
    return normalizeDocumentMedia(financial_reports_default_json_1.default);
}
async function readFinancialReportsForLocale(locale) {
    const doc = await readFinancialReportsDocument();
    return toPublicDocument(doc, locale);
}
async function writeFinancialReportsDocument(body) {
    if (!validateDocumentV2(body)) {
        const err = new Error('Invalid financial reports payload');
        err.status = 400;
        throw err;
    }
    await promises_1.default.mkdir(path_1.default.dirname(DATA_FILE), { recursive: true });
    await promises_1.default.writeFile(DATA_FILE, JSON.stringify(normalizeDocumentMedia(body), null, 2), 'utf8');
}
//# sourceMappingURL=financialReportsFileService.js.map