import { Router } from 'express'
import { getYoutubeLatest } from '../controllers/youtubeController'

export const youtubeRouter = Router()

youtubeRouter.get('/youtube/latest', getYoutubeLatest)
