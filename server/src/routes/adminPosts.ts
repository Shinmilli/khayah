import { Router } from 'express'
import {
  adminCreatePost,
  adminDeletePost,
  adminGetPost,
  adminListPosts,
  adminUpdatePost,
} from '../controllers/adminPostsController'

export const adminPostsRouter = Router()

adminPostsRouter.get('/admin/posts', adminListPosts)
adminPostsRouter.get('/admin/posts/:id', adminGetPost)
adminPostsRouter.post('/admin/posts', adminCreatePost)
adminPostsRouter.patch('/admin/posts/:id', adminUpdatePost)
adminPostsRouter.delete('/admin/posts/:id', adminDeletePost)

