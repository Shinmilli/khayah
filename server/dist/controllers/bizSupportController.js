"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBizSupport = getBizSupport;
exports.putAdminBizSupport = putAdminBizSupport;
const bizSupportFileService_1 = require("../services/bizSupportFileService");
const documentDraft_1 = require("../services/documentDraft");
async function getBizSupport(req, res) {
    try {
        const adminPath = (0, documentDraft_1.isAdminPath)(req);
        const { doc, unpublished } = await (0, bizSupportFileService_1.readBizSupportState)(adminPath || (await (0, documentDraft_1.adminCanSeeDraft)(req)));
        res.json(adminPath ? { ...doc, unpublished } : doc);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load biz support' });
    }
}
async function putAdminBizSupport(req, res) {
    try {
        await (0, bizSupportFileService_1.writeBizSupportDocument)(req.body, (0, documentDraft_1.saveModeOf)(req));
        const { doc, unpublished } = await (0, bizSupportFileService_1.readBizSupportState)(true);
        res.json({ ...doc, unpublished });
    }
    catch (e) {
        const status = e?.status;
        if (status === 400) {
            res.status(400).json({ error: 'Invalid biz support payload' });
            return;
        }
        console.error(e);
        res.status(500).json({ error: 'Failed to save biz support' });
    }
}
//# sourceMappingURL=bizSupportController.js.map