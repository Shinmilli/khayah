"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const posts_1 = require("./routes/posts");
const pages_1 = require("./routes/pages");
const youtube_1 = require("./routes/youtube");
const uploads_1 = require("./routes/uploads");
const adminPosts_1 = require("./routes/adminPosts");
const financialReports_1 = require("./routes/financialReports");
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 3001;
app.set('trust proxy', 1);
app.use((0, cors_1.default)({ origin: process.env.CLIENT_ORIGIN }));
app.use(express_1.default.json());
app.use('/api', posts_1.postsRouter);
app.use('/api', pages_1.pagesRouter);
app.use('/api', youtube_1.youtubeRouter);
app.use('/api', uploads_1.uploadsRouter);
app.use('/api', adminPosts_1.adminPostsRouter);
app.use('/api', financialReports_1.financialReportsRouter);
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map