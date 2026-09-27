import type { Request, Response } from 'express'
import {
  emptyPopupDocument,
  readPopupDocument,
  writePopupDocument,
} from '../services/popupFileService'

export async function getPopup(_req: Request, res: Response) {
  try {
    const doc = await readPopupDocument()
    res.json(doc ?? emptyPopupDocument())
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load popup' })
  }
}

export async function getAdminPopup(_req: Request, res: Response) {
  try {
    const doc = await readPopupDocument()
    if (!doc) {
      res.status(404).json({ error: 'Missing popup document' })
      return
    }
    res.json(doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load popup' })
  }
}

export async function putAdminPopup(req: Request, res: Response) {
  try {
    const doc = await writePopupDocument(req.body)
    res.json(doc)
  } catch (e) {
    const status = (e as Error & { status?: number })?.status
    if (status === 400) {
      res.status(400).json({ error: 'Invalid popup payload' })
      return
    }
    console.error(e)
    res.status(500).json({ error: 'Failed to save popup' })
  }
}
