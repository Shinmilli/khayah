"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const postsController_1 = require("../controllers/postsController");
exports.postsRouter = (0, express_1.Router)();
exports.postsRouter.get('/posts', postsController_1.getPosts);
exports.postsRouter.get('/posts/:slug', postsController_1.getPostBySlug);
//# sourceMappingURL=posts.js.map