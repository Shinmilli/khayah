"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistory = getHistory;
exports.getAdminHistory = getAdminHistory;
exports.putAdminHistory = putAdminHistory;
const historyFileService_1 = require("../services/historyFileService");
async function getHistory(req, res) {
    try {
        const locale = (0, historyFileService_1.parseHistoryLocale)(req.query.lang);
        const content = await (0, historyFileService_1.readHistoryForLocale)(locale);
        res.json(content);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load history' });
    }
}
async function getAdminHistory(_req, res) {
    try {
        const doc = await (0, historyFileService_1.readHistoryDocument)();
        res.json(doc);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load history' });
    }
}
async function putAdminHistory(req, res) {
    try {
        await (0, historyFileService_1.writeHistoryDocument)(req.body);
        const doc = await (0, historyFileService_1.readHistoryDocument)();
        res.json(doc);
    }
    catch (e) {
        const status = e?.status;
        if (status === 400) {
            res.status(400).json({ error: 'Invalid history payload' });
            return;
        }
        console.error(e);
        res.status(500).json({ error: 'Failed to save history' });
    }
}
//# sourceMappingURL=historyController.js.map