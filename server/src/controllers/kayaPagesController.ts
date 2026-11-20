import type { Request, Response } from 'express'
import { adminCanSeeDraft, isAdminPath, saveModeOf } from '../services/documentDraft'
import { readKayaPagesState, writeKayaPagesDocument } from '../services/kayaPagesFileService'

export async function getKayaPages(req: Request, res: Response) {
  try {
    const adminPath = isAdminPath(req)
    const { doc, unpublished } = await readKayaPagesState(adminPath || (await adminCanSeeDraft(req)))
    res.json(adminPath ? { ...doc, unpublished } : doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load kaya pages' })
  }
}

export async function putAdminKayaPages(req: Request, res: Response) {
  try {
    await writeKayaPagesDocument(req.body, saveModeOf(req))
    const { doc, unpublished } = await readKayaPagesState(true)
    res.json({ ...doc, unpublished })
  } catch (e) {
    const status = (e as Error & { status?: number })?.status
    if (status === 400) {
      res.status(400).json({ error: 'Invalid kaya pages payload' })
      return
    }
    console.error(e)
    res.status(500).json({ error: 'Failed to save kaya pages' })
  }
}
