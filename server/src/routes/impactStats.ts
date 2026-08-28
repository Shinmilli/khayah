import { Router } from 'express'
import { getImpactStats, putAdminImpactStats } from '../controllers/impactStatsController'

export const impactStatsRouter = Router()

impactStatsRouter.get('/impact-stats', getImpactStats)
impactStatsRouter.put('/admin/impact-stats', putAdminImpactStats)
