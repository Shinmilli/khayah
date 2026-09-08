import { Router } from 'express'
import {
  adminDeleteUser,
  adminInviteUser,
  adminListUsers,
  adminPatchUser,
} from '../controllers/adminUsersController'

export const adminUsersRouter = Router()

adminUsersRouter.get('/admin/users', adminListUsers)
adminUsersRouter.post('/admin/users', adminInviteUser)
adminUsersRouter.patch('/admin/users/:id', adminPatchUser)
adminUsersRouter.delete('/admin/users/:id', adminDeleteUser)
