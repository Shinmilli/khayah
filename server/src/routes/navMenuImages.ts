import { Router } from 'express'
import {
  getAdminNavMenuImages,
  getNavMenuImages,
  putAdminNavMenuImages,
} from '../controllers/navMenuImagesController'

export const navMenuImagesRouter = Router()

navMenuImagesRouter.get('/nav-menu-images', getNavMenuImages)
navMenuImagesRouter.get('/admin/nav-menu-images', getAdminNavMenuImages)
navMenuImagesRouter.put('/admin/nav-menu-images', putAdminNavMenuImages)
