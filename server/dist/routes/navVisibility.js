"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.navVisibilityRouter = void 0;
const express_1 = require("express");
const navVisibilityController_1 = require("../controllers/navVisibilityController");
exports.navVisibilityRouter = (0, express_1.Router)();
exports.navVisibilityRouter.get('/nav-visibility', navVisibilityController_1.getNavVisibility);
exports.navVisibilityRouter.get('/admin/nav-visibility', navVisibilityController_1.getAdminNavVisibility);
exports.navVisibilityRouter.put('/admin/nav-visibility', navVisibilityController_1.putAdminNavVisibility);
//# sourceMappingURL=navVisibility.js.map