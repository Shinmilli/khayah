"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintenanceRouter = void 0;
const express_1 = require("express");
const maintenanceController_1 = require("../controllers/maintenanceController");
exports.maintenanceRouter = (0, express_1.Router)();
exports.maintenanceRouter.get('/maintenance', maintenanceController_1.getMaintenance);
exports.maintenanceRouter.get('/admin/maintenance', maintenanceController_1.getAdminMaintenance);
exports.maintenanceRouter.put('/admin/maintenance', maintenanceController_1.putAdminMaintenance);
//# sourceMappingURL=maintenance.js.map