"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.youtubeRouter = void 0;
const express_1 = require("express");
const youtubeController_1 = require("../controllers/youtubeController");
exports.youtubeRouter = (0, express_1.Router)();
exports.youtubeRouter.get('/youtube/latest', youtubeController_1.getYoutubeLatest);
//# sourceMappingURL=youtube.js.map