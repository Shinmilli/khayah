import { Router } from 'express'
import { getPosts, getPostBySlug } from '../controllers/postsController'

export const postsRouter = Router()

postsRouter.get('/posts', getPosts)
postsRouter.get('/posts/:slug', getPostBySlug)
