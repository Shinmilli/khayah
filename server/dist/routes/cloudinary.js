"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryRouter = void 0;
const express_1 = require("express");
const cloudinaryController_1 = require("../controllers/cloudinaryController");
exports.cloudinaryRouter = (0, express_1.Router)();
exports.cloudinaryRouter.post('/cloudinary/signature', cloudinaryController_1.postCloudinarySignature);
//# sourceMappingURL=cloudinary.js.map