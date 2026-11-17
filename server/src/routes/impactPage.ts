import { Router } from 'express'
import { getImpactPage, putAdminImpactPage } from '../controllers/impactPageController'

export const impactPageRouter = Router()

impactPageRouter.get('/impact-page', getImpactPage)
impactPageRouter.get('/admin/impact-page', getImpactPage)
impactPageRouter.put('/admin/impact-page', putAdminImpactPage)
