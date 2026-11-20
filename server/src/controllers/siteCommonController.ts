import type { Request, Response } from 'express'
import { adminCanSeeDraft, isAdminPath, saveModeOf } from '../services/documentDraft'
import { readSiteCommonState, writeSiteCommonDocument } from '../services/siteCommonFileService'

export async function getSiteCommon(req: Request, res: Response) {
  try {
    const adminPath = isAdminPath(req)
    const { doc, unpublished } = await readSiteCommonState(adminPath || (await adminCanSeeDraft(req)))
    res.json(adminPath ? { ...doc, unpublished } : doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load site common' })
  }
}

export async function putAdminSiteCommon(req: Request, res: Response) {
  try {
    await writeSiteCommonDocument(req.body, saveModeOf(req))
    const { doc, unpublished } = await readSiteCommonState(true)
    res.json({ ...doc, unpublished })
  } catch (e) {
    const status = (e as Error & { status?: number })?.status
    if (status === 400) {
      res.status(400).json({ error: 'Invalid site common payload' })
      return
    }
    console.error(e)
    res.status(500).json({ error: 'Failed to save site common' })
  }
}
