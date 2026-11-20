import type { Request, Response } from 'express'
import { adminCanSeeDraft, saveModeOf } from '../services/documentDraft'
import { readNavMenuImagesState, writeNavMenuImagesDocument } from '../services/navMenuImagesFileService'

export async function getNavMenuImages(req: Request, res: Response) {
  try {
    const { doc } = await readNavMenuImagesState(await adminCanSeeDraft(req))
    res.json(doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load nav menu images' })
  }
}

export async function getAdminNavMenuImages(_req: Request, res: Response) {
  try {
    const { doc, unpublished } = await readNavMenuImagesState(true)
    res.json({ ...doc, unpublished })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load nav menu images' })
  }
}

export async function putAdminNavMenuImages(req: Request, res: Response) {
  try {
    await writeNavMenuImagesDocument(req.body, saveModeOf(req))
    const { doc, unpublished } = await readNavMenuImagesState(true)
    res.json({ ...doc, unpublished })
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
