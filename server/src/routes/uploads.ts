import { Router } from 'express'
import { postDocumentUpload, postImageUpload } from '../controllers/uploadsController'

export const uploadsRouter = Router()

uploadsRouter.post('/uploads/document', postDocumentUpload)
uploadsRouter.post('/uploads/image', postImageUpload)

