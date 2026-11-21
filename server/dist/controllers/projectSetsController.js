"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectSets = getProjectSets;
exports.putAdminProjectSets = putAdminProjectSets;
const documentDraft_1 = require("../services/documentDraft");
const projectSetsFileService_1 = require("../services/projectSetsFileService");
async function getProjectSets(req, res) {
    try {
        const adminPath = (0, documentDraft_1.isAdminPath)(req);
        const { doc, unpublished } = await (0, projectSetsFileService_1.readProjectSetsState)(adminPath || (await (0, documentDraft_1.adminCanSeeDraft)(req)));
        res.json(adminPath ? { ...doc, unpublished } : doc);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load project sets' });
    }
}
async function putAdminProjectSets(req, res) {
    try {
        await (0, projectSetsFileService_1.writeProjectSetsDocument)(req.body, (0, documentDraft_1.saveModeOf)(req));
        const { doc, unpublished } = await (0, projectSetsFileService_1.readProjectSetsState)(true);
        res.json({ ...doc, unpublished });
    }
    catch (e) {
        const status = e?.status;
        if (status === 400) {
            res.status(400).json({ error: 'Invalid project sets payload' });
            return;
        }
        console.error(e);
        res.status(500).json({ error: 'Failed to save project sets' });
    }
}
//# sourceMappingURL=projectSetsController.js.map