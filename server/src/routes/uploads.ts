import { Router } from 'express'
import { postDocumentUpload } from '../controllers/uploadsController'

export const uploadsRouter = Router()

uploadsRouter.post('/uploads/document', postDocumentUpload)

