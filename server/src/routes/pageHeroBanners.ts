import { Router } from 'express'
import {
  getAdminPageHeroBanners,
  getPageHeroBanners,
  putAdminPageHeroBanners,
} from '../controllers/pageHeroBannersController'

export const pageHeroBannersRouter = Router()

pageHeroBannersRouter.get('/page-hero-banners', getPageHeroBanners)
pageHeroBannersRouter.get('/admin/page-hero-banners', getAdminPageHeroBanners)
pageHeroBannersRouter.put('/admin/page-hero-banners', putAdminPageHeroBanners)
