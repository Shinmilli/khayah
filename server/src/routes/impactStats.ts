import { Router } from 'express'
import { getAdminImpactStats, getImpactStats, putAdminImpactStats } from '../controllers/impactStatsController'

export const impactStatsRouter = Router()

impactStatsRouter.get('/impact-stats', getImpactStats)
impactStatsRouter.get('/admin/impact-stats', getAdminImpactStats)
impactStatsRouter.put('/admin/impact-stats', putAdminImpactStats)
