"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.navMenuImagesRouter = void 0;
const express_1 = require("express");
const navMenuImagesController_1 = require("../controllers/navMenuImagesController");
exports.navMenuImagesRouter = (0, express_1.Router)();
exports.navMenuImagesRouter.get('/nav-menu-images', navMenuImagesController_1.getNavMenuImages);
exports.navMenuImagesRouter.get('/admin/nav-menu-images', navMenuImagesController_1.getAdminNavMenuImages);
exports.navMenuImagesRouter.put('/admin/nav-menu-images', navMenuImagesController_1.putAdminNavMenuImages);
//# sourceMappingURL=navMenuImages.js.map