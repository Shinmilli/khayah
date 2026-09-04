import { Router } from 'express'
import { getAdminHistory, getHistory, putAdminHistory } from '../controllers/historyController'

export const historyRouter = Router()

historyRouter.get('/history', getHistory)
historyRouter.get('/admin/history', getAdminHistory)
historyRouter.put('/admin/history', putAdminHistory)
