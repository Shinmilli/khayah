import type { Request, Response } from 'express'
import { readKayaPagesDocument, writeKayaPagesDocument } from '../services/kayaPagesFileService'

export async function getKayaPages(_req: Request, res: Response) {
  try {
    res.json(await readKayaPagesDocument())
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load kaya pages' })
  }
}

export async function putAdminKayaPages(req: Request, res: Response) {
  try {
    await writeKayaPagesDocument(req.body)
    res.json(await readKayaPagesDocument())
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
