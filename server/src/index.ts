import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { postsRouter } from './routes/posts'
import { pagesRouter } from './routes/pages'
import { youtubeRouter } from './routes/youtube'
import { uploadsRouter } from './routes/uploads'
import { adminPostsRouter } from './routes/adminPosts'
import { financialReportsRouter } from './routes/financialReports'
import { prisma } from './utils/prisma'

const app = express()
const PORT = process.env.PORT ?? 3001

app.set('trust proxy', 1)
app.use(cors({ origin: process.env.CLIENT_ORIGIN }))
app.use(express.json())

app.use('/api', postsRouter)
app.use('/api', pagesRouter)
app.use('/api', youtubeRouter)
app.use('/api', uploadsRouter)
app.use('/api', adminPostsRouter)
app.use('/api', financialReportsRouter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

/** Cron keep-alive: wakes Render + pings Supabase (lightweight SELECT) */
app.get('/health/db', async (_req, res) => {
  if (!prisma) {
    return res.status(503).json({ status: 'error', db: 'unavailable' })
  }
  try {
    await prisma.$queryRaw`SELECT 1`
    return res.json({ status: 'ok', db: 'ok' })
  } catch (e) {
    console.error('[health/db]', e)
    return res.status(503).json({ status: 'error', db: 'error' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
