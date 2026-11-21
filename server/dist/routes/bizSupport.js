"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bizSupportRouter = void 0;
const express_1 = require("express");
const bizSupportController_1 = require("../controllers/bizSupportController");
exports.bizSupportRouter = (0, express_1.Router)();
exports.bizSupportRouter.get('/biz-support', bizSupportController_1.getBizSupport);
exports.bizSupportRouter.get('/admin/biz-support', bizSupportController_1.getBizSupport);
exports.bizSupportRouter.put('/admin/biz-support', bizSupportController_1.putAdminBizSupport);
//# sourceMappingURL=bizSupport.js.map