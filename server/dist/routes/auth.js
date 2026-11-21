"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.get('/auth/config', authController_1.getAuthConfig);
exports.authRouter.post('/auth/google', authController_1.postGoogleLogin);
exports.authRouter.post('/auth/demo', authController_1.postDemoLogin);
exports.authRouter.get('/auth/me', authController_1.getMe);
exports.authRouter.post('/auth/logout', authController_1.postLogout);
//# sourceMappingURL=auth.js.map