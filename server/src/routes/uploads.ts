import { Router } from 'express'
import { postDocumentUpload, postImageUpload, deleteUpload } from '../controllers/uploadsController'

export const uploadsRouter = Router()

uploadsRouter.post('/uploads/document', postDocumentUpload)
uploadsRouter.post('/uploads/image', postImageUpload)
uploadsRouter.post('/uploads/delete', deleteUpload)

