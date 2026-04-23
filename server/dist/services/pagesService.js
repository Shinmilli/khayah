"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagesService = void 0;
const postRepository_1 = require("../repositories/postRepository");
exports.pagesService = {
    async getPublishedPages(page = 1, perPage = 50) {
        const { pages, total } = await postRepository_1.postRepository.findPublishedPages({ page, perPage });
        const list = pages.map((p) => ({
            id: p.id,
            title: p.postTitle,
            slug: p.postName,
            excerpt: p.postExcerpt,
            content: p.postContent,
            postParent: p.postParent,
            menuOrder: p.menuOrder,
        }));
        return { pages: list, total };
    },
    async getPageBySlug(slug) {
        const page = await postRepository_1.postRepository.findPageBySlug(slug);
        if (!page)
            return null;
        return {
            id: page.id,
            title: page.postTitle,
            slug: page.postName,
            excerpt: page.postExcerpt,
            content: page.postContent,
            postParent: page.postParent,
        };
    },
};
//# sourceMappingURL=pagesService.js.map