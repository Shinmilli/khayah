import { Router } from 'express'
import { getBizSupport, putAdminBizSupport } from '../controllers/bizSupportController'

export const bizSupportRouter = Router()

bizSupportRouter.get('/biz-support', getBizSupport)
bizSupportRouter.get('/admin/biz-support', getBizSupport)
bizSupportRouter.put('/admin/biz-support', putAdminBizSupport)
