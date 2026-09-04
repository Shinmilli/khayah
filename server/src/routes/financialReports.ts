import { Router } from 'express'
import { getAdminFinancialReports, getFinancialReports, putAdminFinancialReports } from '../controllers/financialReportsController'

export const financialReportsRouter = Router()

financialReportsRouter.get('/financial-reports', getFinancialReports)
financialReportsRouter.get('/admin/financial-reports', getAdminFinancialReports)
financialReportsRouter.put('/admin/financial-reports', putAdminFinancialReports)
