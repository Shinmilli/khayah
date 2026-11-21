"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyRouter = void 0;
const express_1 = require("express");
const historyController_1 = require("../controllers/historyController");
exports.historyRouter = (0, express_1.Router)();
exports.historyRouter.get('/history', historyController_1.getHistory);
exports.historyRouter.get('/admin/history', historyController_1.getAdminHistory);
exports.historyRouter.put('/admin/history', historyController_1.putAdminHistory);
//# sourceMappingURL=history.js.map