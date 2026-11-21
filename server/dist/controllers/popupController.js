"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPopup = getPopup;
exports.getAdminPopup = getAdminPopup;
exports.putAdminPopup = putAdminPopup;
const popupFileService_1 = require("../services/popupFileService");
async function getPopup(_req, res) {
    try {
        const doc = await (0, popupFileService_1.readPopupDocument)();
        res.json(doc ?? (0, popupFileService_1.emptyPopupDocument)());
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load popup' });
    }
}
async function getAdminPopup(_req, res) {
    try {
        const doc = await (0, popupFileService_1.readPopupDocument)();
        if (!doc) {
            res.json({ ...(0, popupFileService_1.emptyPopupDocument)(), stored: false });
            return;
        }
        res.json({ ...doc, stored: true });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to load popup' });
    }
}
async function putAdminPopup(req, res) {
    try {
        const doc = await (0, popupFileService_1.writePopupDocument)(req.body);
        res.json(doc);
    }
    catch (e) {
        const status = e?.status;
        if (status === 400) {
            res.status(400).json({ error: 'Invalid popup payload' });
            return;
        }
        console.error(e);
        res.status(500).json({ error: 'Failed to save popup' });
    }
}
//# sourceMappingURL=popupController.js.map