import type { Request, Response } from 'express'
import { adminCanSeeDraft, isAdminPath, saveModeOf } from '../services/documentDraft'
import { readImpactPageState, writeImpactPageDocument } from '../services/impactPageFileService'

export async function getImpactPage(req: Request, res: Response) {
  try {
    const adminPath = isAdminPath(req)
    const { doc, unpublished } = await readImpactPageState(adminPath || (await adminCanSeeDraft(req)))
    res.json(adminPath ? { ...doc, unpublished } : doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load impact page' })
  }
}

export async function putAdminImpactPage(req: Request, res: Response) {
  try {
    await writeImpactPageDocument(req.body, saveModeOf(req))
    const { doc, unpublished } = await readImpactPageState(true)
    res.json({ ...doc, unpublished })
  } catch (e) {
    const status = (e as Error & { status?: number })?.status
    if (status === 400) {
      res.status(400).json({ error: 'Invalid impact page payload' })
      return
    }
    console.error(e)
    res.status(500).json({ error: 'Failed to save impact page' })
  }
}
