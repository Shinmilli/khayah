"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFinancialReportsDocument = readFinancialReportsDocument;
exports.writeFinancialReportsDocument = writeFinancialReportsDocument;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const financial_reports_default_json_1 = __importDefault(require("../seed/financial-reports.default.json"));
const DATA_FILE = path_1.default.resolve(process.cwd(), 'data', 'financial-reports.json');
function isPlainObject(v) {
    return typeof v === 'object' && v !== null && !Array.isArray(v);
}
function validateDocument(body) {
    if (!isPlainObject(body))
        return false;
    if (body.version !== 1)
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
    for (const r of body.reports) {
        if (!isPlainObject(r))
            return false;
        if (typeof r.year !== 'number' || !Number.isFinite(r.year))
            return false;
        if (!Array.isArray(r.incomeSegments) || !Array.isArray(r.expenseSegments))
            return false;
        if (typeof r.incomeTotalWon !== 'number' || typeof r.expenseTotalWon !== 'number')
            return false;
        for (const seg of [...r.incomeSegments, ...r.expenseSegments]) {
            if (!isPlainObject(seg))
                return false;
            if (typeof seg.id !== 'string' || typeof seg.label !== 'string')
                return false;
            if (typeof seg.percent !== 'number' || !Number.isFinite(seg.percent))
                return false;
            if (typeof seg.color !== 'string')
                return false;
        }
    }
    return true;
}
async function readFinancialReportsDocument() {
    try {
        const raw = await promises_1.default.readFile(DATA_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        if (validateDocument(parsed))
            return parsed;
        console.warn('[financial-reports] invalid file content, using seed');
    }
    catch (e) {
        const code = e?.code;
        if (code !== 'ENOENT')
            console.warn('[financial-reports] read failed, using seed:', e);
    }
    return financial_reports_default_json_1.default;
}
async function writeFinancialReportsDocument(body) {
    if (!validateDocument(body)) {
        const err = new Error('Invalid financial reports payload');
        err.status = 400;
        throw err;
    }
    await promises_1.default.mkdir(path_1.default.dirname(DATA_FILE), { recursive: true });
    await promises_1.default.writeFile(DATA_FILE, JSON.stringify(body, null, 2), 'utf8');
}
//# sourceMappingURL=financialReportsFileService.js.map