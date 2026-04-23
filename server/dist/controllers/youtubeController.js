"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYoutubeLatest = getYoutubeLatest;
const youtubeLatestService_1 = require("../services/youtubeLatestService");
async function getYoutubeLatest(_req, res) {
    try {
        const latest = await (0, youtubeLatestService_1.getLatestYoutubeVideo)();
        res.json(latest);
    }
    catch (e) {
        console.error(e);
        res.status(502).json({ error: 'Failed to load latest YouTube video' });
    }
}
//# sourceMappingURL=youtubeController.js.map