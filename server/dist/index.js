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
const social_1 = require("./routes/social");
const uploads_1 = require("./routes/uploads");
const adminPosts_1 = require("./routes/adminPosts");
const financialReports_1 = require("./routes/financialReports");
const inquiries_1 = require("./routes/inquiries");
const inquiryFaq_1 = require("./routes/inquiryFaq");
const impactStats_1 = require("./routes/impactStats");
const heroBanner_1 = require("./routes/heroBanner");
const siteCommon_1 = require("./routes/siteCommon");
const kayaPages_1 = require("./routes/kayaPages");
const bizSupport_1 = require("./routes/bizSupport");
const projectSets_1 = require("./routes/projectSets");
const impactPage_1 = require("./routes/impactPage");
const history_1 = require("./routes/history");
const navMenuImages_1 = require("./routes/navMenuImages");
const navVisibility_1 = require("./routes/navVisibility");
const pageHeroBanners_1 = require("./routes/pageHeroBanners");
const businessHubCards_1 = require("./routes/businessHubCards");
const popup_1 = require("./routes/popup");
const maintenance_1 = require("./routes/maintenance");
const auth_1 = require("./routes/auth");
const adminUsers_1 = require("./routes/adminUsers");
const requireAdmin_1 = require("./middlewares/requireAdmin");
const pdfCover_1 = require("./utils/pdfCover");
const prisma_1 = require("./utils/prisma");
const adminSession_1 = require("./utils/adminSession");
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 3001;
const allowedOrigins = (0, adminSession_1.parseClientOrigins)();
app.set('trust proxy', 1);
app.use((0, cors_1.default)({
    origin(origin, callback) {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(null, false);
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use('/api', requireAdmin_1.adminAuthGuard);
app.use('/api', auth_1.authRouter);
app.use('/api', adminUsers_1.adminUsersRouter);
app.use('/api', posts_1.postsRouter);
app.use('/api', pages_1.pagesRouter);
app.use('/api', youtube_1.youtubeRouter);
app.use('/api', social_1.socialRouter);
app.use('/api', uploads_1.uploadsRouter);
app.use('/api', adminPosts_1.adminPostsRouter);
app.use('/api', financialReports_1.financialReportsRouter);
app.use('/api', inquiries_1.inquiriesRouter);
app.use('/api', inquiryFaq_1.inquiryFaqRouter);
app.use('/api', impactStats_1.impactStatsRouter);
app.use('/api', heroBanner_1.heroBannerRouter);
app.use('/api', siteCommon_1.siteCommonRouter);
app.use('/api', kayaPages_1.kayaPagesRouter);
app.use('/api', bizSupport_1.bizSupportRouter);
app.use('/api', projectSets_1.projectSetsRouter);
app.use('/api', impactPage_1.impactPageRouter); // 한눈에 보는 카야. 공개 여부는 문서의 public
app.use('/api', history_1.historyRouter);
app.use('/api', navMenuImages_1.navMenuImagesRouter);
app.use('/api', navVisibility_1.navVisibilityRouter);
app.use('/api', pageHeroBanners_1.pageHeroBannersRouter);
app.use('/api', businessHubCards_1.businessHubCardsRouter);
app.use('/api', popup_1.popupRouter);
app.use('/api', maintenance_1.maintenanceRouter);
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
    (0, pdfCover_1.warmPdfCoverRenderer)();
    if (!prisma_1.prisma) {
        console.warn('[prisma] not connected:', prisma_1.prismaInitStatus.reason ?? 'unknown', prisma_1.prismaInitStatus.message ?? '');
        console.warn('[prisma] Set DATABASE_URL in server/.env (see .env.example), then restart.');
    }
});
//# sourceMappingURL=index.js.map