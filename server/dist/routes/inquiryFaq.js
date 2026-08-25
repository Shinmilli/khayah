"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inquiryFaqRouter = void 0;
const express_1 = require("express");
const inquiryFaqController_1 = require("../controllers/inquiryFaqController");
exports.inquiryFaqRouter = (0, express_1.Router)();
exports.inquiryFaqRouter.get('/inquiry-faq', inquiryFaqController_1.getInquiryFaq);
exports.inquiryFaqRouter.get('/admin/inquiry-faq', inquiryFaqController_1.getAdminInquiryFaq);
exports.inquiryFaqRouter.put('/admin/inquiry-faq', inquiryFaqController_1.putAdminInquiryFaq);
//# sourceMappingURL=inquiryFaq.js.map