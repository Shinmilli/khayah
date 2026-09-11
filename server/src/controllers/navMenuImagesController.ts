import type { Request, Response } from 'express'
import {
  readNavMenuImagesDocument,
  writeNavMenuImagesDocument,
} from '../services/navMenuImagesFileService'

export async function getNavMenuImages(_req: Request, res: Response) {
  try {
    const doc = await readNavMenuImagesDocument()
    res.json(doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load nav menu images' })
  }
}

export async function getAdminNavMenuImages(_req: Request, res: Response) {
  try {
    const doc = await readNavMenuImagesDocument()
    res.json(doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load nav menu images' })
  }
}

export async function putAdminNavMenuImages(req: Request, res: Response) {
  try {
    await writeNavMenuImagesDocument(req.body)
    const doc = await readNavMenuImagesDocument()
    res.json(doc)
  } catch (e) {
    const status = (e as Error & { status?: number })?.status
    if (status === 400) {
      res.status(400).json({ error: 'Invalid nav menu images payload' })
      return
    }
    console.error(e)
    res.status(500).json({ error: 'Failed to save nav menu images' })
  }
}
