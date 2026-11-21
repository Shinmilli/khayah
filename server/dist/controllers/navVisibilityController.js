"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNavVisibility = getNavVisibility;
exports.getAdminNavVisibility = getAdminNavVisibility;
exports.putAdminNavVisibility = putAdminNavVisibility;
const documentDraft_1 = require("../services/documentDraft");
const navVisibilityFileService_1 = require("../services/navVisibilityFileService");
async function getNavVisibility(req, res) {
    try {
        const { doc } = await (0, navVisibilityFileService_1.readNavVisibilityState)(await (0, documentDraft_1.adminCanSeeDraft)(req));
        res.json(doc);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load nav visibility' });
    }
}
async function getAdminNavVisibility(_req, res) {
    try {
        const { doc, unpublished } = await (0, navVisibilityFileService_1.readNavVisibilityState)(true);
        res.json({ ...doc, unpublished });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load nav visibility' });
    }
}
async function putAdminNavVisibility(req, res) {
    try {
        await (0, navVisibilityFileService_1.writeNavVisibilityDocument)(req.body, (0, documentDraft_1.saveModeOf)(req));
        const { doc, unpublished } = await (0, navVisibilityFileService_1.readNavVisibilityState)(true);
        res.json({ ...doc, unpublished });
    }
    catch (e) {
        const status = e?.status;
        if (status === 400) {
            res.status(400).json({ error: 'Invalid nav visibility payload' });
            return;
        }
        console.error(e);
        res.status(500).json({ error: 'Failed to save nav visibility' });
    }
}
//# sourceMappingURL=navVisibilityController.js.map