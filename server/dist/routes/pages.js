"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagesRouter = void 0;
const express_1 = require("express");
const pagesController_1 = require("../controllers/pagesController");
exports.pagesRouter = (0, express_1.Router)();
exports.pagesRouter.get('/pages', pagesController_1.getPages);
exports.pagesRouter.get('/pages/:slug', pagesController_1.getPageBySlug);
//# sourceMappingURL=pages.js.map