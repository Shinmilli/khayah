"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminPostsRouter = void 0;
const express_1 = require("express");
const adminPostsController_1 = require("../controllers/adminPostsController");
exports.adminPostsRouter = (0, express_1.Router)();
exports.adminPostsRouter.get('/admin/posts', adminPostsController_1.adminListPosts);
exports.adminPostsRouter.get('/admin/posts/:id', adminPostsController_1.adminGetPost);
exports.adminPostsRouter.post('/admin/posts', adminPostsController_1.adminCreatePost);
exports.adminPostsRouter.patch('/admin/posts/:id', adminPostsController_1.adminUpdatePost);
exports.adminPostsRouter.delete('/admin/posts/:id', adminPostsController_1.adminDeletePost);
//# sourceMappingURL=adminPosts.js.map