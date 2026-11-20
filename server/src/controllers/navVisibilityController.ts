import type { Request, Response } from 'express'
import { adminCanSeeDraft, saveModeOf } from '../services/documentDraft'
import { readNavVisibilityState, writeNavVisibilityDocument } from '../services/navVisibilityFileService'

export async function getNavVisibility(req: Request, res: Response) {
  try {
    const { doc } = await readNavVisibilityState(await adminCanSeeDraft(req))
    res.json(doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load nav visibility' })
  }
}

export async function getAdminNavVisibility(_req: Request, res: Response) {
  try {
    const { doc, unpublished } = await readNavVisibilityState(true)
    res.json({ ...doc, unpublished })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load nav visibility' })
  }
}

export async function putAdminNavVisibility(req: Request, res: Response) {
  try {
    await writeNavVisibilityDocument(req.body, saveModeOf(req))
    const { doc, unpublished } = await readNavVisibilityState(true)
    res.json({ ...doc, unpublished })
  } catch (e) {
    const status = (e as Error & { status?: number })?.status
    if (status === 400) {
      res.status(400).json({ error: 'Invalid nav visibility payload' })
      return
    }
    console.error(e)
    res.status(500).json({ error: 'Failed to save nav visibility' })
  }
}
