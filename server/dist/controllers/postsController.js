"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = getPosts;
exports.getPostBySlug = getPostBySlug;
const postsService_1 = require("../services/postsService");
async function getPosts(req, res) {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const perPage = Math.min(50, Math.max(1, parseInt(req.query.perPage) || 10));
        const kind = typeof req.query.kind === 'string' ? req.query.kind : undefined;
        const region = typeof req.query.region === 'string' ? req.query.region : undefined;
        const result = await postsService_1.postsService.getPublishedPosts({ page, perPage, kind, region });
        res.json(result);
    }
    catch (e) {
        console.error(e);
        const message = e instanceof Error ? e.message : String(e);
        res.status(500).json({
            error: 'Failed to fetch posts',
            message: process.env.NODE_ENV === 'production' ? undefined : message,
        });
    }
}
async function getPostBySlug(req, res) {
    try {
        const slug = typeof req.params.slug === 'string' ? req.params.slug : '';
        if (!slug) {
            res.status(400).json({ error: 'Slug required' });
            return;
        }
        const post = await postsService_1.postsService.getPostBySlug(slug);
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        res.json(post);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
}
//# sourceMappingURL=postsController.js.map