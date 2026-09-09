import { Router } from 'express'
import { getSocialLatestHandler } from '../controllers/socialController'

export const socialRouter = Router()

socialRouter.get('/social/latest', getSocialLatestHandler)
