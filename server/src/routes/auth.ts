import { Router } from 'express'
import { getMe, postDemoLogin, postGoogleLogin, postLogout } from '../controllers/authController'

export const authRouter = Router()

authRouter.post('/auth/google', postGoogleLogin)
authRouter.post('/auth/demo', postDemoLogin)
authRouter.get('/auth/me', getMe)
authRouter.post('/auth/logout', postLogout)
