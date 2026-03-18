import { Router } from 'express'
import { getPages, getPageBySlug } from '../controllers/pagesController'

export const pagesRouter = Router()

pagesRouter.get('/pages', getPages)
pagesRouter.get('/pages/:slug', getPageBySlug)
