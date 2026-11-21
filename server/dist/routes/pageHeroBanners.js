"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageHeroBannersRouter = void 0;
const express_1 = require("express");
const pageHeroBannersController_1 = require("../controllers/pageHeroBannersController");
exports.pageHeroBannersRouter = (0, express_1.Router)();
exports.pageHeroBannersRouter.get('/page-hero-banners', pageHeroBannersController_1.getPageHeroBanners);
exports.pageHeroBannersRouter.get('/admin/page-hero-banners', pageHeroBannersController_1.getAdminPageHeroBanners);
exports.pageHeroBannersRouter.put('/admin/page-hero-banners', pageHeroBannersController_1.putAdminPageHeroBanners);
//# sourceMappingURL=pageHeroBanners.js.map