"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsService = void 0;
const postRepository_1 = require("../repositories/postRepository");
exports.postsService = {
    async getPublishedPosts(options) {
        const { posts, total } = await postRepository_1.postRepository.findPublished(options);
        const list = posts.map((p) => ({
            meta: 'postMeta' in p && Array.isArray(p.postMeta)
                ? Object.fromEntries(p.postMeta
                    .filter((m) => Boolean(m.metaKey))
                    .map((m) => [m.metaKey, m.metaValue ?? '']))
                : undefined,
            id: p.id,
            title: p.postTitle,
            excerpt: p.postExcerpt,
            content: p.postContent,
            slug: p.postName,
            status: p.postStatus,
            postType: p.postType,
            publishedAt: p.postDate.toISOString(),
            author: p.author
                ? { id: p.author.id, displayName: p.author.displayName }
                : undefined,
        }));
        return { posts: list, total };
    },
    async getPostBySlug(slug) {
        const post = await postRepository_1.postRepository.findPostBySlug(slug);
        if (!post)
            return null;
        const meta = {};
        if ('postMeta' in post && Array.isArray(post.postMeta)) {
            for (const m of post.postMeta) {
                if (!m.metaKey)
                    continue;
                meta[m.metaKey] = m.metaValue ?? '';
            }
        }
        return {
            id: post.id,
            title: post.postTitle,
            excerpt: post.postExcerpt,
            content: post.postContent,
            slug: post.postName,
            status: post.postStatus,
            postType: post.postType,
            publishedAt: post.postDate.toISOString(),
            author: post.author
                ? { id: post.author.id, displayName: post.author.displayName }
                : undefined,
            meta,
        };
    },
};
//# sourceMappingURL=postsService.js.map