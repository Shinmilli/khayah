"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImpactStats = getImpactStats;
exports.getAdminImpactStats = getAdminImpactStats;
exports.putAdminImpactStats = putAdminImpactStats;
const impactStatsFileService_1 = require("../services/impactStatsFileService");
async function getImpactStats(req, res) {
    try {
        const locale = (0, impactStatsFileService_1.parseImpactLocale)(req.query.lang);
        const content = await (0, impactStatsFileService_1.readImpactStatsForLocale)(locale);
        res.json(content);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load impact stats' });
    }
}
async function getAdminImpactStats(_req, res) {
    try {
        const doc = await (0, impactStatsFileService_1.readImpactStatsDocument)();
        res.json(doc);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load impact stats' });
    }
}
async function putAdminImpactStats(req, res) {
    try {
        await (0, impactStatsFileService_1.writeImpactStatsDocument)(req.body);
        const doc = await (0, impactStatsFileService_1.readImpactStatsDocument)();
        res.json(doc);
    }
    catch (e) {
        const status = e?.status;
        if (status === 400) {
            res.status(400).json({ error: 'Invalid impact stats payload' });
            return;
        }
        console.error(e);
        res.status(500).json({ error: 'Failed to save impact stats' });
    }
}
//# sourceMappingURL=impactStatsController.js.map