import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { postsRouter } from './routes/posts'
import { pagesRouter } from './routes/pages'
import { youtubeRouter } from './routes/youtube'
import path from 'path'
import { uploadsRouter } from './routes/uploads'
import { adminPostsRouter } from './routes/adminPosts'
import { financialReportsRouter } from './routes/financialReports'

const app = express()
const PORT = process.env.PORT ?? 3001

app.set('trust proxy', 1)
app.use(cors({ origin: process.env.CLIENT_ORIGIN }))
app.use(express.json())

const uploadsDir = process.env.UPLOADS_DIR ?? path.resolve(process.cwd(), 'uploads')
app.use('/uploads', express.static(uploadsDir))

app.use('/api', postsRouter)
app.use('/api', pagesRouter)
app.use('/api', youtubeRouter)
app.use('/api', uploadsRouter)
app.use('/api', adminPostsRouter)
app.use('/api', financialReportsRouter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
