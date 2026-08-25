import { Router } from 'express'
import { getAdminInquiryFaq, getInquiryFaq, putAdminInquiryFaq } from '../controllers/inquiryFaqController'

export const inquiryFaqRouter = Router()

inquiryFaqRouter.get('/inquiry-faq', getInquiryFaq)
inquiryFaqRouter.get('/admin/inquiry-faq', getAdminInquiryFaq)
inquiryFaqRouter.put('/admin/inquiry-faq', putAdminInquiryFaq)
