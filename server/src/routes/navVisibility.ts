import { Router } from 'express'
import {
  getAdminNavVisibility,
  getNavVisibility,
  putAdminNavVisibility,
} from '../controllers/navVisibilityController'

export const navVisibilityRouter = Router()

navVisibilityRouter.get('/nav-visibility', getNavVisibility)
navVisibilityRouter.get('/admin/nav-visibility', getAdminNavVisibility)
navVisibilityRouter.put('/admin/nav-visibility', putAdminNavVisibility)
