"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNavMenuImages = getNavMenuImages;
exports.getAdminNavMenuImages = getAdminNavMenuImages;
exports.putAdminNavMenuImages = putAdminNavMenuImages;
const documentDraft_1 = require("../services/documentDraft");
const navMenuImagesFileService_1 = require("../services/navMenuImagesFileService");
async function getNavMenuImages(req, res) {
    try {
        const { doc } = await (0, navMenuImagesFileService_1.readNavMenuImagesState)(await (0, documentDraft_1.adminCanSeeDraft)(req));
        res.json(doc);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load nav menu images' });
    }
}
async function getAdminNavMenuImages(_req, res) {
    try {
        const { doc, unpublished } = await (0, navMenuImagesFileService_1.readNavMenuImagesState)(true);
        res.json({ ...doc, unpublished });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load nav menu images' });
    }
}
async function putAdminNavMenuImages(req, res) {
    try {
        await (0, navMenuImagesFileService_1.writeNavMenuImagesDocument)(req.body, (0, documentDraft_1.saveModeOf)(req));
        const { doc, unpublished } = await (0, navMenuImagesFileService_1.readNavMenuImagesState)(true);
        res.json({ ...doc, unpublished });
    }
    catch (e) {
        const status = e?.status;
        if (status === 400) {
            res.status(400).json({ error: 'Invalid nav menu images payload' });
            return;
        }
        console.error(e);
        res.status(500).json({ error: 'Failed to save nav menu images' });
    }
}
//# sourceMappingURL=navMenuImagesController.js.map