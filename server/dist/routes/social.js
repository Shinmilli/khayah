"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socialRouter = void 0;
const express_1 = require("express");
const socialController_1 = require("../controllers/socialController");
exports.socialRouter = (0, express_1.Router)();
exports.socialRouter.get('/social/latest', socialController_1.getSocialLatestHandler);
//# sourceMappingURL=social.js.map