"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.impactPageRouter = void 0;
const express_1 = require("express");
const impactPageController_1 = require("../controllers/impactPageController");
exports.impactPageRouter = (0, express_1.Router)();
exports.impactPageRouter.get('/impact-page', impactPageController_1.getImpactPage);
exports.impactPageRouter.get('/admin/impact-page', impactPageController_1.getImpactPage);
exports.impactPageRouter.put('/admin/impact-page', impactPageController_1.putAdminImpactPage);
//# sourceMappingURL=impactPage.js.map