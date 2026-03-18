import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { postsRouter } from './routes/posts'
import { pagesRouter } from './routes/pages'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }))
app.use(express.json())

app.use('/api', postsRouter)
app.use('/api', pagesRouter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
