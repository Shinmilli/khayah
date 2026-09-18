import { Router } from 'express'
import {
  getAdminBusinessHubCards,
  getBusinessHubCards,
  putAdminBusinessHubCards,
} from '../controllers/businessHubCardsController'

export const businessHubCardsRouter = Router()

businessHubCardsRouter.get('/business-hub-cards', getBusinessHubCards)
businessHubCardsRouter.get('/admin/business-hub-cards', getAdminBusinessHubCards)
businessHubCardsRouter.put('/admin/business-hub-cards', putAdminBusinessHubCards)
