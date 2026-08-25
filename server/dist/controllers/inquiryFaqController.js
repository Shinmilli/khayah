"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInquiryFaq = getInquiryFaq;
exports.getAdminInquiryFaq = getAdminInquiryFaq;
exports.putAdminInquiryFaq = putAdminInquiryFaq;
const inquiryFaqFileService_1 = require("../services/inquiryFaqFileService");
async function getInquiryFaq(_req, res) {
    try {
        const doc = await (0, inquiryFaqFileService_1.readInquiryFaqDocument)();
        const items = [...doc.items].filter((i) => i.published).sort((a, b) => a.order - b.order);
        res.json({ version: 1, items });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load FAQ' });
    }
}
async function getAdminInquiryFaq(_req, res) {
    try {
        const doc = await (0, inquiryFaqFileService_1.readInquiryFaqDocument)();
        const items = [...doc.items].sort((a, b) => a.order - b.order);
        res.json({ version: 1, items });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load FAQ' });
    }
}
async function putAdminInquiryFaq(req, res) {
    try {
        await (0, inquiryFaqFileService_1.writeInquiryFaqDocument)(req.body);
        const doc = await (0, inquiryFaqFileService_1.readInquiryFaqDocument)();
        res.json(doc);
    }
    catch (e) {
        const status = e?.status;
        if (status === 400) {
            res.status(400).json({ error: 'Invalid FAQ payload' });
            return;
        }
        console.error(e);
        res.status(500).json({ error: 'Failed to save FAQ' });
    }
}
//# sourceMappingURL=inquiryFaqController.js.map