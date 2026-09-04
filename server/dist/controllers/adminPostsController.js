"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminListPosts = adminListPosts;
exports.adminGetPost = adminGetPost;
exports.adminCreatePost = adminCreatePost;
exports.adminUpdatePost = adminUpdatePost;
exports.adminDeletePost = adminDeletePost;
const prisma_1 = require("../utils/prisma");
const adminPostsService_1 = require("../services/adminPostsService");
function requireDb(res) {
    if (prisma_1.prisma)
        return true;
    res.status(503).json({
        error: 'Database unavailable',
        hint: 'server/.env에 DATABASE_URL을 설정한 뒤 API 서버를 재시art하세요.',
    });
    return false;
}
async function adminListPosts(req, res) {
    if (!requireDb(res))
        return;
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const perPage = Math.min(100, Math.max(1, parseInt(req.query.perPage) || 20));
        const kind = typeof req.query.kind === 'string' ? req.query.kind : undefined;
        const result = await adminPostsService_1.adminPostsService.list({ page, perPage, kind });
        res.json(result);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch admin posts' });
    }
}
async function adminGetPost(req, res) {
    if (!requireDb(res))
        return;
    try {
        const id = Number(req.params.id);
        if (!Number.isFinite(id)) {
            res.status(400).json({ error: 'Invalid id' });
            return;
        }
        const post = await adminPostsService_1.adminPostsService.getById(id);
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        res.json(post);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch admin post' });
    }
}
async function adminCreatePost(req, res) {
    if (!requireDb(res))
        return;
    try {
        const body = req.body;
        if (!body?.kind || !body?.title) {
            res.status(400).json({ error: 'kind and title are required' });
            return;
        }
        const created = await adminPostsService_1.adminPostsService.create({
            kind: body.kind,
            title: body.title,
            excerpt: body.excerpt ?? '',
            content: body.content ?? '',
            status: body.status ?? 'publish',
            meta: body.meta ?? {},
            publishedAt: body.publishedAt,
        });
        res.status(201).json(created);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to create admin post' });
    }
}
async function adminUpdatePost(req, res) {
    if (!requireDb(res))
        return;
    try {
        const id = Number(req.params.id);
        if (!Number.isFinite(id)) {
            res.status(400).json({ error: 'Invalid id' });
            return;
        }
        const body = req.body;
        const updated = await adminPostsService_1.adminPostsService.update(id, {
            title: body.title,
            excerpt: body.excerpt,
            content: body.content,
            status: body.status,
            meta: body.meta,
            publishedAt: body.publishedAt,
        });
        if (!updated) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        res.json(updated);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to update admin post' });
    }
}
async function adminDeletePost(req, res) {
    if (!requireDb(res))
        return;
    try {
        const id = Number(req.params.id);
        if (!Number.isFinite(id)) {
            res.status(400).json({ error: 'Invalid id' });
            return;
        }
        const ok = await adminPostsService_1.adminPostsService.remove(id);
        if (!ok) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        res.status(204).send();
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to delete admin post' });
    }
}
//# sourceMappingURL=adminPostsController.js.map