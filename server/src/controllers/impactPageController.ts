import type { Request, Response } from 'express'
import { readImpactPageDocument, writeImpactPageDocument } from '../services/impactPageFileService'

export async function getImpactPage(_req: Request, res: Response) {
  try {
    res.json(await readImpactPageDocument())
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load impact page' })
  }
}

export async function putAdminImpactPage(req: Request, res: Response) {
  try {
    await writeImpactPageDocument(req.body)
    res.json(await readImpactPageDocument())
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
