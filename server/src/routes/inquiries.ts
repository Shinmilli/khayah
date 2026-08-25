import { Router } from 'express'
import {
  adminDeleteInquiry,
  adminGetInquiry,
  adminListInquiries,
  adminUpdateInquiry,
  createInquiry,
  lookupInquiries,
} from '../controllers/inquiriesController'

export const inquiriesRouter = Router()

inquiriesRouter.post('/inquiries', createInquiry)
inquiriesRouter.post('/inquiries/lookup', lookupInquiries)

inquiriesRouter.get('/admin/inquiries', adminListInquiries)
inquiriesRouter.get('/admin/inquiries/:id', adminGetInquiry)
inquiriesRouter.patch('/admin/inquiries/:id', adminUpdateInquiry)
inquiriesRouter.delete('/admin/inquiries/:id', adminDeleteInquiry)
