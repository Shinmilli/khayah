import type { Request, Response } from 'express'
import {
  readPageHeroBannersDocument,
  writePageHeroBannersDocument,
} from '../services/pageHeroBannersFileService'

export async function getPageHeroBanners(_req: Request, res: Response) {
  try {
    const doc = await readPageHeroBannersDocument()
    res.json(doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load page hero banners' })
  }
}

export async function getAdminPageHeroBanners(_req: Request, res: Response) {
  try {
    const doc = await readPageHeroBannersDocument()
    res.json(doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load page hero banners' })
  }
}

export async function putAdminPageHeroBanners(req: Request, res: Response) {
  try {
    await writePageHeroBannersDocument(req.body)
    const doc = await readPageHeroBannersDocument()
    res.json(doc)
  } catch (e) {
    const status = (e as Error & { status?: number })?.status
    if (status === 400) {
      res.status(400).json({ error: 'Invalid page hero banners payload' })
      return
    }
    console.error(e)
    res.status(500).json({ error: 'Failed to save page hero banners' })
  }
}
