"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSiteCommon = getSiteCommon;
exports.putAdminSiteCommon = putAdminSiteCommon;
const documentDraft_1 = require("../services/documentDraft");
const siteCommonFileService_1 = require("../services/siteCommonFileService");
async function getSiteCommon(req, res) {
    try {
        const adminPath = (0, documentDraft_1.isAdminPath)(req);
        const { doc, unpublished } = await (0, siteCommonFileService_1.readSiteCommonState)(adminPath || (await (0, documentDraft_1.adminCanSeeDraft)(req)));
        res.json(adminPath ? { ...doc, unpublished } : doc);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load site common' });
    }
}
async function putAdminSiteCommon(req, res) {
    try {
        await (0, siteCommonFileService_1.writeSiteCommonDocument)(req.body, (0, documentDraft_1.saveModeOf)(req));
        const { doc, unpublished } = await (0, siteCommonFileService_1.readSiteCommonState)(true);
        res.json({ ...doc, unpublished });
    }
    catch (e) {
        const status = e?.status;
        if (status === 400) {
            res.status(400).json({ error: 'Invalid site common payload' });
            return;
        }
        console.error(e);
        res.status(500).json({ error: 'Failed to save site common' });
    }
}
//# sourceMappingURL=siteCommonController.js.map