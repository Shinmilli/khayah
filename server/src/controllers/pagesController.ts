import { Request, Response } from 'express'
import { pagesService } from '../services/pagesService'

export async function getPages(req: Request, res: Response) {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const perPage = Math.min(100, Math.max(1, parseInt(req.query.perPage as string) || 50))
    const result = await pagesService.getPublishedPages(page, perPage)
    res.json(result)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to fetch pages' })
  }
}

export async function getPageBySlug(req: Request, res: Response) {
  try {
    const slug = typeof req.params.slug === 'string' ? req.params.slug : ''
    if (!slug) {
      res.status(400).json({ error: 'Slug required' })
      return
    }
    const page = await pagesService.getPageBySlug(slug)
    if (!page) {
      res.status(404).json({ error: 'Page not found' })
      return
    }
    res.json(page)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to fetch page' })
  }
}
