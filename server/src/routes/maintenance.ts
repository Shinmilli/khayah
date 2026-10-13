import { Router } from 'express'
import {
  getAdminMaintenance,
  getMaintenance,
  putAdminMaintenance,
} from '../controllers/maintenanceController'

export const maintenanceRouter = Router()

maintenanceRouter.get('/maintenance', getMaintenance)
maintenanceRouter.get('/admin/maintenance', getAdminMaintenance)
maintenanceRouter.put('/admin/maintenance', putAdminMaintenance)
