import type { Request, Response } from 'express'
import { prisma } from '../utils/prisma'
import { adminPostsService } from '../services/adminPostsService'

function requireDb(res: Response): boolean {
  if (prisma) return true
  res.status(503).json({
    error: 'Database unavailable',
    hint: 'server/.env에 DATABASE_URL을 설정한 뒤 API 서버를 재시art하세요.',
  })
  return false
}

export async function adminListPosts(req: Request, res: Response) {
  if (!requireDb(res)) return
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const perPage = Math.min(100, Math.max(1, parseInt(req.query.perPage as string) || 20))
    const kind = typeof req.query.kind === 'string' ? req.query.kind : undefined
    const result = await adminPostsService.list({ page, perPage, kind })
    res.json(result)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to fetch admin posts' })
  }
}

export async function adminGetPost(req: Request, res: Response) {
  if (!requireDb(res)) return
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: 'Invalid id' })
      return
    }
    const post = await adminPostsService.getById(id)
    if (!post) {
      res.status(404).json({ error: 'Post not found' })
      return
    }
    res.json(post)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to fetch admin post' })
  }
}

export async function adminCreatePost(req: Request, res: Response) {
  if (!requireDb(res)) return
  try {
    const body = req.body as {
      kind: string
      title: string
      excerpt?: string
      content?: string
      meta?: Record<string, string>
      status?: 'publish' | 'draft'
      publishedAt?: string
    }

    if (!body?.kind || !body?.title) {
      res.status(400).json({ error: 'kind and title are required' })
      return
    }

    const created = await adminPostsService.create({
      kind: body.kind,
      title: body.title,
      excerpt: body.excerpt ?? '',
      content: body.content ?? '',
      status: body.status ?? 'publish',
      meta: body.meta ?? {},
      publishedAt: body.publishedAt,
    })
    res.status(201).json(created)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to create admin post' })
  }
}

export async function adminUpdatePost(req: Request, res: Response) {
  if (!requireDb(res)) return
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: 'Invalid id' })
      return
    }
    const body = req.body as {
      title?: string
      excerpt?: string
      content?: string
      meta?: Record<string, string>
      status?: 'publish' | 'draft'
      publishedAt?: string
    }
    const updated = await adminPostsService.update(id, {
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      status: body.status,
      meta: body.meta,
      publishedAt: body.publishedAt,
    })
    if (!updated) {
      res.status(404).json({ error: 'Post not found' })
      return
    }
    res.json(updated)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to update admin post' })
  }
}

export async function adminDeletePost(req: Request, res: Response) {
  if (!requireDb(res)) return
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: 'Invalid id' })
      return
    }
    const ok = await adminPostsService.remove(id)
    if (!ok) {
      res.status(404).json({ error: 'Post not found' })
      return
    }
    res.status(204).send()
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to delete admin post' })
  }
}

