import { Router } from 'express'
import { getFinancialReports, putAdminFinancialReports } from '../controllers/financialReportsController'

export const financialReportsRouter = Router()

financialReportsRouter.get('/financial-reports', getFinancialReports)
financialReportsRouter.put('/admin/financial-reports', putAdminFinancialReports)
