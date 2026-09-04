"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHeroBanner = getHeroBanner;
exports.getAdminHeroBanner = getAdminHeroBanner;
exports.putAdminHeroBanner = putAdminHeroBanner;
const heroBannerFileService_1 = require("../services/heroBannerFileService");
async function getHeroBanner(req, res) {
    try {
        const locale = (0, heroBannerFileService_1.parseHeroLocale)(req.query.lang);
        const slides = await (0, heroBannerFileService_1.readHeroBannerForLocale)(locale);
        res.json({ version: 1, slides });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load hero banner' });
    }
}
async function getAdminHeroBanner(_req, res) {
    try {
        const doc = await (0, heroBannerFileService_1.readHeroBannerDocument)();
        res.json(doc);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load hero banner' });
    }
}
async function putAdminHeroBanner(req, res) {
    try {
        await (0, heroBannerFileService_1.writeHeroBannerDocument)(req.body);
        const doc = await (0, heroBannerFileService_1.readHeroBannerDocument)();
        res.json(doc);
    }
    catch (e) {
        const status = e?.status;
        if (status === 400) {
            res.status(400).json({ error: 'Invalid hero banner payload' });
            return;
        }
        console.error(e);
        res.status(500).json({ error: 'Failed to save hero banner' });
    }
}
//# sourceMappingURL=heroBannerController.js.map