import { Router } from 'express'
import { getAdminPopup, getPopup, putAdminPopup } from '../controllers/popupController'

export const popupRouter = Router()

popupRouter.get('/popup', getPopup)
popupRouter.get('/admin/popup', getAdminPopup)
popupRouter.put('/admin/popup', putAdminPopup)
