import { Router } from 'express'
import { postDocumentUpload, postImageUpload, postVideoUpload, deleteUpload } from '../controllers/uploadsController'
import { getPdfCover } from '../controllers/pdfCoverController'
import { getPdfInline } from '../controllers/pdfViewController'

export const uploadsRouter = Router()

uploadsRouter.post('/uploads/document', postDocumentUpload)
uploadsRouter.post('/uploads/image', postImageUpload)
uploadsRouter.post('/uploads/video', postVideoUpload)
uploadsRouter.post('/uploads/delete', deleteUpload)
uploadsRouter.get('/uploads/pdf/:filename', getPdfInline)
uploadsRouter.get('/uploads/pdf', getPdfInline)
uploadsRouter.get('/uploads/pdf-cover', getPdfCover)

