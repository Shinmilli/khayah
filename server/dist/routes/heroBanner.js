"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.heroBannerRouter = void 0;
const express_1 = require("express");
const heroBannerController_1 = require("../controllers/heroBannerController");
exports.heroBannerRouter = (0, express_1.Router)();
exports.heroBannerRouter.get('/hero-banner', heroBannerController_1.getHeroBanner);
exports.heroBannerRouter.get('/admin/hero-banner', heroBannerController_1.getAdminHeroBanner);
exports.heroBannerRouter.put('/admin/hero-banner', heroBannerController_1.putAdminHeroBanner);
//# sourceMappingURL=heroBanner.js.map