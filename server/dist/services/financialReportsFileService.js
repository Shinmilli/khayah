"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFinancialLocale = parseFinancialLocale;
exports.readFinancialReportsDocument = readFinancialReportsDocument;
exports.readFinancialReportsState = readFinancialReportsState;
exports.readFinancialReportsForLocale = readFinancialReportsForLocale;
exports.writeFinancialReportsDocument = writeFinancialReportsDocument;
const normalizeStoredMediaUrl_1 = require("../utils/normalizeStoredMediaUrl");
const storedMedia_1 = require("../utils/storedMedia");
const documentDraft_1 = require("./documentDraft");
const siteDocumentStore_1 = require("./siteDocumentStore");
const DOCUMENT_KEY = 'financial-reports';
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
function normalizeDocumentMedia(doc) {
    return {
        ...doc,
        reports: doc.reports.map((r) => ({
            ...r,
            balanceSheetImageUrl: (0, normalizeStoredMediaUrl_1.normalizeStoredMediaUrl)(r.balanceSheetImageUrl),
            operationsStatementImageUrl: (0, normalizeStoredMediaUrl_1.normalizeStoredMediaUrl)(r.operationsStatementImageUrl),
            donationDisclosurePdfUrl: (0, normalizeStoredMediaUrl_1.normalizeStoredMediaUrl)(r.donationDisclosurePdfUrl),
            publicInterestDisclosurePdfUrl: (0, normalizeStoredMediaUrl_1.normalizeStoredMediaUrl)(r.publicInterestDisclosurePdfUrl),
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
    const parsed = await (0, siteDocumentStore_1.readJsonDocument)(DOCUMENT_KEY);
    if (validateDocumentV2(parsed))
        return normalizeDocumentMedia(parsed);
    if (validateDocumentV1(parsed))
        return normalizeDocumentMedia(migrateV1ToV2(parsed));
    throw new Error('Invalid financial reports document');
}
function readFinancialReportsState(preferDraft) {
    return (0, documentDraft_1.readDrafted)(DOCUMENT_KEY, readFinancialReportsDocument, preferDraft);
}
async function readFinancialReportsForLocale(locale, preferDraft = false) {
    const { doc } = await readFinancialReportsState(preferDraft);
    return toPublicDocument(doc, locale);
}
async function writeFinancialReportsDocument(body, mode = 'publish') {
    if (!validateDocumentV2(body)) {
        const err = new Error('Invalid financial reports payload');
        err.status = 400;
        throw err;
    }
    const cleaned = normalizeDocumentMedia(body);
    await (0, documentDraft_1.writeDrafted)(DOCUMENT_KEY, cleaned, mode, async (previous) => {
        if (previous != null)
            await (0, storedMedia_1.deleteRemovedStoredMedia)(previous, cleaned);
    });
}
//# sourceMappingURL=financialReportsFileService.js.map