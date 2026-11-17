import type { Request, Response } from 'express'
import { readSiteCommonDocument, writeSiteCommonDocument } from '../services/siteCommonFileService'

export async function getSiteCommon(_req: Request, res: Response) {
  try {
    res.json(await readSiteCommonDocument())
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load site common' })
  }
}

export async function putAdminSiteCommon(req: Request, res: Response) {
  try {
    await writeSiteCommonDocument(req.body)
    res.json(await readSiteCommonDocument())
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
