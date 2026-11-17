import { Router } from 'express'
import { getSiteCommon, putAdminSiteCommon } from '../controllers/siteCommonController'

export const siteCommonRouter = Router()

siteCommonRouter.get('/site-common', getSiteCommon)
siteCommonRouter.get('/admin/site-common', getSiteCommon)
siteCommonRouter.put('/admin/site-common', putAdminSiteCommon)
