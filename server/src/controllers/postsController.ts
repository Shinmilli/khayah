import { Request, Response } from 'express'
import { postsService } from '../services/postsService'

export async function getPosts(req: Request, res: Response) {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const perPage = Math.min(50, Math.max(1, parseInt(req.query.perPage as string) || 10))
    const kind = typeof req.query.kind === 'string' ? req.query.kind : undefined
    const region = typeof req.query.region === 'string' ? req.query.region : undefined
    const result = await postsService.getPublishedPosts({ page, perPage, kind, region })
    res.json(result)
  } catch (e) {
    console.error(e)
    const message = e instanceof Error ? e.message : String(e)
    res.status(500).json({
      error: 'Failed to fetch posts',
      message: process.env.NODE_ENV === 'production' ? undefined : message,
    })
  }
}

export async function getPostBySlug(req: Request, res: Response) {
  try {
    const slug = typeof req.params.slug === 'string' ? req.params.slug : ''
    if (!slug) {
      res.status(400).json({ error: 'Slug required' })
      return
    }
    const post = await postsService.getPostBySlug(slug)
    if (!post) {
      res.status(404).json({ error: 'Post not found' })
      return
    }
    res.json(post)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to fetch post' })
  }
}
