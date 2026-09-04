import type { Request, Response } from 'express'
import {
  parseHeroLocale,
  readHeroBannerDocument,
  readHeroBannerForLocale,
  writeHeroBannerDocument,
} from '../services/heroBannerFileService'

export async function getHeroBanner(req: Request, res: Response) {
  try {
    const locale = parseHeroLocale(req.query.lang)
    const slides = await readHeroBannerForLocale(locale)
    res.json({ version: 1, slides })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load hero banner' })
  }
}

export async function getAdminHeroBanner(_req: Request, res: Response) {
  try {
    const doc = await readHeroBannerDocument()
    res.json(doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load hero banner' })
  }
}

export async function putAdminHeroBanner(req: Request, res: Response) {
  try {
    await writeHeroBannerDocument(req.body)
    const doc = await readHeroBannerDocument()
    res.json(doc)
  } catch (e) {
    const status = (e as Error & { status?: number })?.status
    if (status === 400) {
      res.status(400).json({ error: 'Invalid hero banner payload' })
      return
    }
    console.error(e)
    res.status(500).json({ error: 'Failed to save hero banner' })
  }
}
