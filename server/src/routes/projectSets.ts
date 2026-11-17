import { Router } from 'express'
import { getProjectSets, putAdminProjectSets } from '../controllers/projectSetsController'

export const projectSetsRouter = Router()

projectSetsRouter.get('/project-sets', getProjectSets)
projectSetsRouter.get('/admin/project-sets', getProjectSets)
projectSetsRouter.put('/admin/project-sets', putAdminProjectSets)
