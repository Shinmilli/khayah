"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.impactStatsRouter = void 0;
const express_1 = require("express");
const impactStatsController_1 = require("../controllers/impactStatsController");
exports.impactStatsRouter = (0, express_1.Router)();
exports.impactStatsRouter.get('/impact-stats', impactStatsController_1.getImpactStats);
exports.impactStatsRouter.get('/admin/impact-stats', impactStatsController_1.getAdminImpactStats);
exports.impactStatsRouter.put('/admin/impact-stats', impactStatsController_1.putAdminImpactStats);
//# sourceMappingURL=impactStats.js.map