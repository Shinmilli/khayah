"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadsRouter = void 0;
const express_1 = require("express");
const uploadsController_1 = require("../controllers/uploadsController");
exports.uploadsRouter = (0, express_1.Router)();
exports.uploadsRouter.post('/uploads/document', uploadsController_1.postDocumentUpload);
//# sourceMappingURL=uploads.js.map