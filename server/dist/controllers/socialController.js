"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocialLatestHandler = getSocialLatestHandler;
const socialLatestService_1 = require("../services/socialLatestService");
async function getSocialLatestHandler(_req, res) {
    try {
        const latest = await (0, socialLatestService_1.getSocialLatest)();
        res.json(latest);
    }
    catch (e) {
        console.error(e);
        res.status(502).json({ error: 'Failed to load social previews' });
    }
}
//# sourceMappingURL=socialController.js.map