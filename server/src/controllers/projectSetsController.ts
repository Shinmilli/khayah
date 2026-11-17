import type { Request, Response } from 'express'
import { readProjectSetsDocument, writeProjectSetsDocument } from '../services/projectSetsFileService'

export async function getProjectSets(_req: Request, res: Response) {
  try {
    res.json(await readProjectSetsDocument())
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load project sets' })
  }
}

export async function putAdminProjectSets(req: Request, res: Response) {
  try {
    await writeProjectSetsDocument(req.body)
    res.json(await readProjectSetsDocument())
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
