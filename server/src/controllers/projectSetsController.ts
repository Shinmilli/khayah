import type { Request, Response } from 'express'
import { adminCanSeeDraft, isAdminPath, saveModeOf } from '../services/documentDraft'
import { readProjectSetsState, writeProjectSetsDocument } from '../services/projectSetsFileService'

export async function getProjectSets(req: Request, res: Response) {
  try {
    const adminPath = isAdminPath(req)
    const { doc, unpublished } = await readProjectSetsState(adminPath || (await adminCanSeeDraft(req)))
    res.json(adminPath ? { ...doc, unpublished } : doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load project sets' })
  }
}

export async function putAdminProjectSets(req: Request, res: Response) {
  try {
    await writeProjectSetsDocument(req.body, saveModeOf(req))
    const { doc, unpublished } = await readProjectSetsState(true)
    res.json({ ...doc, unpublished })
  } catch (e) {
    const status = (e as Error & { status?: number })?.status
    if (status === 400) {
      res.status(400).json({ error: 'Invalid project sets payload' })
      return
    }
    console.error(e)
    res.status(500).json({ error: 'Failed to save project sets' })
  }
}
