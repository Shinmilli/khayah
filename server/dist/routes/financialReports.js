"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.financialReportsRouter = void 0;
const express_1 = require("express");
const financialReportsController_1 = require("../controllers/financialReportsController");
exports.financialReportsRouter = (0, express_1.Router)();
exports.financialReportsRouter.get('/financial-reports', financialReportsController_1.getFinancialReports);
exports.financialReportsRouter.put('/admin/financial-reports', financialReportsController_1.putAdminFinancialReports);
//# sourceMappingURL=financialReports.js.map