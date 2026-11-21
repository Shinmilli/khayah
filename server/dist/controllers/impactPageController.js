"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImpactPage = getImpactPage;
exports.putAdminImpactPage = putAdminImpactPage;
const documentDraft_1 = require("../services/documentDraft");
const impactPageFileService_1 = require("../services/impactPageFileService");
async function getImpactPage(req, res) {
    try {
        const adminPath = (0, documentDraft_1.isAdminPath)(req);
        const { doc, unpublished } = await (0, impactPageFileService_1.readImpactPageState)(adminPath || (await (0, documentDraft_1.adminCanSeeDraft)(req)));
        res.json(adminPath ? { ...doc, unpublished } : doc);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load impact page' });
    }
}
async function putAdminImpactPage(req, res) {
    try {
        await (0, impactPageFileService_1.writeImpactPageDocument)(req.body, (0, documentDraft_1.saveModeOf)(req));
        const { doc, unpublished } = await (0, impactPageFileService_1.readImpactPageState)(true);
        res.json({ ...doc, unpublished });
    }
    catch (e) {
        const status = e?.status;
        if (status === 400) {
            res.status(400).json({ error: 'Invalid impact page payload' });
            return;
        }
        console.error(e);
        res.status(500).json({ error: 'Failed to save impact page' });
    }
}
//# sourceMappingURL=impactPageController.js.map