import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { postsRouter } from './routes/posts'
import { pagesRouter } from './routes/pages'
import { youtubeRouter } from './routes/youtube'
import { socialRouter } from './routes/social'
import { uploadsRouter } from './routes/uploads'
import { adminPostsRouter } from './routes/adminPosts'
import { financialReportsRouter } from './routes/financialReports'
import { inquiriesRouter } from './routes/inquiries'
import { inquiryFaqRouter } from './routes/inquiryFaq'
import { impactStatsRouter } from './routes/impactStats'
import { heroBannerRouter } from './routes/heroBanner'
import { historyRouter } from './routes/history'
import { navMenuImagesRouter } from './routes/navMenuImages'
import { pageHeroBannersRouter } from './routes/pageHeroBanners'
import { authRouter } from './routes/auth'
import { adminUsersRouter } from './routes/adminUsers'
import { adminAuthGuard } from './middlewares/requireAdmin'
import { prisma, prismaInitStatus } from './utils/prisma'
import { parseClientOrigins } from './utils/adminSession'

const app = express()
const PORT = process.env.PORT ?? 3001
const allowedOrigins = parseClientOrigins()

app.set('trust proxy', 1)
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }
      callback(null, false)
    },
    credentials: true,
  }),
)
app.use(express.json())

app.use('/api', adminAuthGuard)
app.use('/api', authRouter)
app.use('/api', adminUsersRouter)
app.use('/api', postsRouter)
app.use('/api', pagesRouter)
app.use('/api', youtubeRouter)
app.use('/api', socialRouter)
app.use('/api', uploadsRouter)
app.use('/api', adminPostsRouter)
app.use('/api', financialReportsRouter)
app.use('/api', inquiriesRouter)
app.use('/api', inquiryFaqRouter)
app.use('/api', impactStatsRouter)
app.use('/api', heroBannerRouter)
app.use('/api', historyRouter)
app.use('/api', navMenuImagesRouter)
app.use('/api', pageHeroBannersRouter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

/** Cron keep-alive: wakes Render + pings Supabase (lightweight SELECT) */
async function healthDb(_req: express.Request, res: express.Response) {
  if (!prisma) {
    return res.status(503).json({
      status: 'error',
      db: 'unavailable',
      reason: prismaInitStatus.reason ?? 'unknown',
      message: prismaInitStatus.message,
      hint:
        prismaInitStatus.reason === 'missing_database_url'
          ? 'Set DATABASE_URL in Render Environment (no surrounding quotes), then Manual Deploy.'
          : prismaInitStatus.reason === 'mock_data'
            ? 'Set MOCK_DATA=false (or delete MOCK_DATA) and redeploy.'
            : 'Check Render Logs for [WARN] Prisma client could not be initialized.',
    })
  }
  try {
    await prisma.$queryRaw`SELECT 1`
    return res.json({ status: 'ok', db: 'ok' })
  } catch (e) {
    console.error('[health/db]', e)
    const message = e instanceof Error ? e.message : String(e)
    return res.status(503).json({ status: 'error', db: 'error', message })
  }
}

app.get('/health/db', healthDb)
app.get('/api/health/db', healthDb)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  if (!prisma) {
    console.warn('[prisma] not connected:', prismaInitStatus.reason ?? 'unknown', prismaInitStatus.message ?? '')
    console.warn('[prisma] Set DATABASE_URL in server/.env (see .env.example), then restart.')
  }
})
