"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessHubCardsRouter = void 0;
const express_1 = require("express");
const businessHubCardsController_1 = require("../controllers/businessHubCardsController");
exports.businessHubCardsRouter = (0, express_1.Router)();
exports.businessHubCardsRouter.get('/business-hub-cards', businessHubCardsController_1.getBusinessHubCards);
exports.businessHubCardsRouter.get('/admin/business-hub-cards', businessHubCardsController_1.getAdminBusinessHubCards);
exports.businessHubCardsRouter.put('/admin/business-hub-cards', businessHubCardsController_1.putAdminBusinessHubCards);
//# sourceMappingURL=businessHubCards.js.map