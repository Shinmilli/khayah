import type { Request, Response } from 'express'
import { readBizSupportDocument, writeBizSupportDocument } from '../services/bizSupportFileService'

export async function getBizSupport(_req: Request, res: Response) {
  try {
    res.json(await readBizSupportDocument())
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load biz support' })
  }
}

export async function putAdminBizSupport(req: Request, res: Response) {
  try {
    await writeBizSupportDocument(req.body)
    res.json(await readBizSupportDocument())
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
