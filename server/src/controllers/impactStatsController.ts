import type { Request, Response } from 'express'
import { readImpactStatsDocument, writeImpactStatsDocument } from '../services/impactStatsFileService'

export async function getImpactStats(_req: Request, res: Response) {
  try {
    const doc = await readImpactStatsDocument()
    res.json(doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load impact stats' })
  }
}

export async function putAdminImpactStats(req: Request, res: Response) {
  try {
    await writeImpactStatsDocument(req.body)
    const doc = await readImpactStatsDocument()
    res.json(doc)
  } catch (e) {
    const status = (e as Error & { status?: number })?.status
    if (status === 400) {
      res.status(400).json({ error: 'Invalid impact stats payload' })
      return
    }
    console.error(e)
    res.status(500).json({ error: 'Failed to save impact stats' })
  }
}
