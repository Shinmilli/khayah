"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKayaPages = getKayaPages;
exports.putAdminKayaPages = putAdminKayaPages;
const documentDraft_1 = require("../services/documentDraft");
const kayaPagesFileService_1 = require("../services/kayaPagesFileService");
async function getKayaPages(req, res) {
    try {
        const adminPath = (0, documentDraft_1.isAdminPath)(req);
        const { doc, unpublished } = await (0, kayaPagesFileService_1.readKayaPagesState)(adminPath || (await (0, documentDraft_1.adminCanSeeDraft)(req)));
        res.json(adminPath ? { ...doc, unpublished } : doc);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load kaya pages' });
    }
}
async function putAdminKayaPages(req, res) {
    try {
        await (0, kayaPagesFileService_1.writeKayaPagesDocument)(req.body, (0, documentDraft_1.saveModeOf)(req));
        const { doc, unpublished } = await (0, kayaPagesFileService_1.readKayaPagesState)(true);
        res.json({ ...doc, unpublished });
    }
    catch (e) {
        const status = e?.status;
        if (status === 400) {
            res.status(400).json({ error: 'Invalid kaya pages payload' });
            return;
        }
        console.error(e);
        res.status(500).json({ error: 'Failed to save kaya pages' });
    }
}
//# sourceMappingURL=kayaPagesController.js.map