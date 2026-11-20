import type { Request, Response } from 'express'
import { readBizSupportState, writeBizSupportDocument } from '../services/bizSupportFileService'
import { adminCanSeeDraft, isAdminPath, saveModeOf } from '../services/documentDraft'

export async function getBizSupport(req: Request, res: Response) {
  try {
    const adminPath = isAdminPath(req)
    const { doc, unpublished } = await readBizSupportState(adminPath || (await adminCanSeeDraft(req)))
    res.json(adminPath ? { ...doc, unpublished } : doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load biz support' })
  }
}

export async function putAdminBizSupport(req: Request, res: Response) {
  try {
    await writeBizSupportDocument(req.body, saveModeOf(req))
    const { doc, unpublished } = await readBizSupportState(true)
    res.json({ ...doc, unpublished })
  } catch (e) {
    const status = (e as Error & { status?: number })?.status
    if (status === 400) {
      res.status(400).json({ error: 'Invalid biz support payload' })
      return
    }
    console.error(e)
    res.status(500).json({ error: 'Failed to save biz support' })
  }
}
