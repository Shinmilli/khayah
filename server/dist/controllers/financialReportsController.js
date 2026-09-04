"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFinancialReports = getFinancialReports;
exports.getAdminFinancialReports = getAdminFinancialReports;
exports.putAdminFinancialReports = putAdminFinancialReports;
const financialReportsFileService_1 = require("../services/financialReportsFileService");
async function getFinancialReports(req, res) {
    try {
        const locale = (0, financialReportsFileService_1.parseFinancialLocale)(req.query.lang);
        const doc = await (0, financialReportsFileService_1.readFinancialReportsForLocale)(locale);
        res.json(doc);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load financial reports' });
    }
}
async function getAdminFinancialReports(_req, res) {
    try {
        const doc = await (0, financialReportsFileService_1.readFinancialReportsDocument)();
        res.json(doc);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load financial reports' });
    }
}
async function putAdminFinancialReports(req, res) {
    try {
        await (0, financialReportsFileService_1.writeFinancialReportsDocument)(req.body);
        const doc = await (0, financialReportsFileService_1.readFinancialReportsDocument)();
        res.json(doc);
    }
    catch (e) {
        const status = e?.status;
        if (status === 400) {
            res.status(400).json({ error: 'Invalid financial reports payload' });
            return;
        }
        console.error(e);
        res.status(500).json({ error: 'Failed to save financial reports' });
    }
}
//# sourceMappingURL=financialReportsController.js.map