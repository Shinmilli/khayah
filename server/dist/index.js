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
const inquiries_1 = require("./routes/inquiries");
const inquiryFaq_1 = require("./routes/inquiryFaq");
const impactStats_1 = require("./routes/impactStats");
const heroBanner_1 = require("./routes/heroBanner");
const prisma_1 = require("./utils/prisma");
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 3001;
const clientOrigin = (process.env.CLIENT_ORIGIN ?? '').trim().replace(/\/$/, '') || undefined;
app.set('trust proxy', 1);
app.use((0, cors_1.default)({ origin: clientOrigin }));
app.use(express_1.default.json());
app.use('/api', posts_1.postsRouter);
app.use('/api', pages_1.pagesRouter);
app.use('/api', youtube_1.youtubeRouter);
app.use('/api', uploads_1.uploadsRouter);
app.use('/api', adminPosts_1.adminPostsRouter);
app.use('/api', financialReports_1.financialReportsRouter);
app.use('/api', inquiries_1.inquiriesRouter);
app.use('/api', inquiryFaq_1.inquiryFaqRouter);
app.use('/api', impactStats_1.impactStatsRouter);
app.use('/api', heroBanner_1.heroBannerRouter);
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
/** Cron keep-alive: wakes Render + pings Supabase (lightweight SELECT) */
async function healthDb(_req, res) {
    if (!prisma_1.prisma) {
        return res.status(503).json({
            status: 'error',
            db: 'unavailable',
            reason: prisma_1.prismaInitStatus.reason ?? 'unknown',
            message: prisma_1.prismaInitStatus.message,
            hint: prisma_1.prismaInitStatus.reason === 'missing_database_url'
                ? 'Set DATABASE_URL in Render Environment (no surrounding quotes), then Manual Deploy.'
                : prisma_1.prismaInitStatus.reason === 'mock_data'
                    ? 'Set MOCK_DATA=false (or delete MOCK_DATA) and redeploy.'
                    : 'Check Render Logs for [WARN] Prisma client could not be initialized.',
        });
    }
    try {
        await prisma_1.prisma.$queryRaw `SELECT 1`;
        return res.json({ status: 'ok', db: 'ok' });
    }
    catch (e) {
        console.error('[health/db]', e);
        const message = e instanceof Error ? e.message : String(e);
        return res.status(503).json({ status: 'error', db: 'error', message });
    }
}
app.get('/health/db', healthDb);
app.get('/api/health/db', healthDb);
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    if (!prisma_1.prisma) {
        console.warn('[prisma] not connected:', prisma_1.prismaInitStatus.reason ?? 'unknown', prisma_1.prismaInitStatus.message ?? '');
        console.warn('[prisma] Set DATABASE_URL in server/.env (see .env.example), then restart.');
    }
});
//# sourceMappingURL=index.js.map