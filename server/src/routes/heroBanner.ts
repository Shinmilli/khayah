import { Router } from 'express'
import { getAdminHeroBanner, getHeroBanner, putAdminHeroBanner } from '../controllers/heroBannerController'

export const heroBannerRouter = Router()

heroBannerRouter.get('/hero-banner', getHeroBanner)
heroBannerRouter.get('/admin/hero-banner', getAdminHeroBanner)
heroBannerRouter.put('/admin/hero-banner', putAdminHeroBanner)
