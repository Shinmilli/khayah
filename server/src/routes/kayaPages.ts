import { Router } from 'express'
import { getKayaPages, putAdminKayaPages } from '../controllers/kayaPagesController'

export const kayaPagesRouter = Router()

kayaPagesRouter.get('/kaya-pages', getKayaPages)
kayaPagesRouter.get('/admin/kaya-pages', getKayaPages)
kayaPagesRouter.put('/admin/kaya-pages', putAdminKayaPages)
