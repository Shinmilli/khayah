"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.siteCommonRouter = void 0;
const express_1 = require("express");
const siteCommonController_1 = require("../controllers/siteCommonController");
exports.siteCommonRouter = (0, express_1.Router)();
exports.siteCommonRouter.get('/site-common', siteCommonController_1.getSiteCommon);
exports.siteCommonRouter.get('/admin/site-common', siteCommonController_1.getSiteCommon);
exports.siteCommonRouter.put('/admin/site-common', siteCommonController_1.putAdminSiteCommon);
//# sourceMappingURL=siteCommon.js.map