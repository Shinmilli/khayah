"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadsRouter = void 0;
const express_1 = require("express");
const uploadsController_1 = require("../controllers/uploadsController");
const pdfViewController_1 = require("../controllers/pdfViewController");
exports.uploadsRouter = (0, express_1.Router)();
exports.uploadsRouter.post('/uploads/document', uploadsController_1.postDocumentUpload);
exports.uploadsRouter.post('/uploads/image', uploadsController_1.postImageUpload);
exports.uploadsRouter.post('/uploads/delete', uploadsController_1.deleteUpload);
exports.uploadsRouter.get('/uploads/pdf', pdfViewController_1.getPdfInline);
//# sourceMappingURL=uploads.js.map