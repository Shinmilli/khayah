"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPageHeroBanners = getPageHeroBanners;
exports.getAdminPageHeroBanners = getAdminPageHeroBanners;
exports.putAdminPageHeroBanners = putAdminPageHeroBanners;
const documentDraft_1 = require("../services/documentDraft");
const pageHeroBannersFileService_1 = require("../services/pageHeroBannersFileService");
async function getPageHeroBanners(req, res) {
    try {
        const { doc } = await (0, pageHeroBannersFileService_1.readPageHeroBannersState)(await (0, documentDraft_1.adminCanSeeDraft)(req));
        res.json(doc);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load page hero banners' });
    }
}
async function getAdminPageHeroBanners(_req, res) {
    try {
        const { doc, unpublished } = await (0, pageHeroBannersFileService_1.readPageHeroBannersState)(true);
        res.json({ ...doc, unpublished });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load page hero banners' });
    }
}
async function putAdminPageHeroBanners(req, res) {
    try {
        await (0, pageHeroBannersFileService_1.writePageHeroBannersDocument)(req.body, (0, documentDraft_1.saveModeOf)(req));
        const { doc, unpublished } = await (0, pageHeroBannersFileService_1.readPageHeroBannersState)(true);
        res.json({ ...doc, unpublished });
    }
    catch (e) {
        const status = e?.status;
        if (status === 400) {
            res.status(400).json({ error: 'Invalid page hero banners payload' });
            return;
        }
        console.error(e);
        res.status(500).json({ error: 'Failed to save page hero banners' });
    }
}
//# sourceMappingURL=pageHeroBannersController.js.map