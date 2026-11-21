"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.popupRouter = void 0;
const express_1 = require("express");
const popupController_1 = require("../controllers/popupController");
exports.popupRouter = (0, express_1.Router)();
exports.popupRouter.get('/popup', popupController_1.getPopup);
exports.popupRouter.get('/admin/popup', popupController_1.getAdminPopup);
exports.popupRouter.put('/admin/popup', popupController_1.putAdminPopup);
//# sourceMappingURL=popup.js.map