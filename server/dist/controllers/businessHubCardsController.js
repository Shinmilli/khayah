"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBusinessHubCards = getBusinessHubCards;
exports.getAdminBusinessHubCards = getAdminBusinessHubCards;
exports.putAdminBusinessHubCards = putAdminBusinessHubCards;
const businessHubCardsFileService_1 = require("../services/businessHubCardsFileService");
const documentDraft_1 = require("../services/documentDraft");
async function getBusinessHubCards(req, res) {
    try {
        const locale = (0, businessHubCardsFileService_1.parseBusinessLocale)(req.query.lang);
        const hub = (0, businessHubCardsFileService_1.parseBusinessHub)(req.query.hub);
        const cards = await (0, businessHubCardsFileService_1.readBusinessHubCardsForLocale)(locale, hub, await (0, documentDraft_1.adminCanSeeDraft)(req));
        res.json({ version: 1, cards });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load business hub cards' });
    }
}
async function getAdminBusinessHubCards(_req, res) {
    try {
        const { doc, unpublished } = await (0, businessHubCardsFileService_1.readBusinessHubCardsState)(true);
        res.json({ ...doc, unpublished });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load business hub cards' });
    }
}
async function putAdminBusinessHubCards(req, res) {
    try {
        await (0, businessHubCardsFileService_1.writeBusinessHubCardsDocument)(req.body, (0, documentDraft_1.saveModeOf)(req));
        const { doc, unpublished } = await (0, businessHubCardsFileService_1.readBusinessHubCardsState)(true);
        res.json({ ...doc, unpublished });
    }
    catch (e) {
        const status = e?.status;
        if (status === 400) {
            res.status(400).json({ error: 'Invalid business hub cards payload' });
            return;
        }
        console.error(e);
        res.status(500).json({ error: 'Failed to save business hub cards' });
    }
}
//# sourceMappingURL=businessHubCardsController.js.map