"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPages = getPages;
exports.getPageBySlug = getPageBySlug;
const pagesService_1 = require("../services/pagesService");
async function getPages(req, res) {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const perPage = Math.min(100, Math.max(1, parseInt(req.query.perPage) || 50));
        const result = await pagesService_1.pagesService.getPublishedPages(page, perPage);
        res.json(result);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch pages' });
    }
}
async function getPageBySlug(req, res) {
    try {
        const slug = typeof req.params.slug === 'string' ? req.params.slug : '';
        if (!slug) {
            res.status(400).json({ error: 'Slug required' });
            return;
        }
        const page = await pagesService_1.pagesService.getPageBySlug(slug);
        if (!page) {
            res.status(404).json({ error: 'Page not found' });
            return;
        }
        res.json(page);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch page' });
    }
}
//# sourceMappingURL=pagesController.js.map