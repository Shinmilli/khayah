"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inquiriesRouter = void 0;
const express_1 = require("express");
const inquiriesController_1 = require("../controllers/inquiriesController");
exports.inquiriesRouter = (0, express_1.Router)();
exports.inquiriesRouter.post('/inquiries', inquiriesController_1.createInquiry);
exports.inquiriesRouter.post('/inquiries/lookup', inquiriesController_1.lookupInquiries);
exports.inquiriesRouter.get('/admin/inquiries', inquiriesController_1.adminListInquiries);
exports.inquiriesRouter.get('/admin/inquiries/:id', inquiriesController_1.adminGetInquiry);
exports.inquiriesRouter.patch('/admin/inquiries/:id', inquiriesController_1.adminUpdateInquiry);
exports.inquiriesRouter.delete('/admin/inquiries/:id', inquiriesController_1.adminDeleteInquiry);
//# sourceMappingURL=inquiries.js.map