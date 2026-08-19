import { Router } from 'express'
import { postDocumentUpload, postImageUpload, deleteUpload } from '../controllers/uploadsController'
import { getPdfInline } from '../controllers/pdfViewController'

export const uploadsRouter = Router()

uploadsRouter.post('/uploads/document', postDocumentUpload)
uploadsRouter.post('/uploads/image', postImageUpload)
uploadsRouter.post('/uploads/delete', deleteUpload)
uploadsRouter.get('/uploads/pdf', getPdfInline)

