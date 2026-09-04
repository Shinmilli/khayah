import type { Request, Response } from 'express'
import {
  parseHistoryLocale,
  readHistoryDocument,
  readHistoryForLocale,
  writeHistoryDocument,
} from '../services/historyFileService'

export async function getHistory(req: Request, res: Response) {
  try {
    const locale = parseHistoryLocale(req.query.lang)
    const content = await readHistoryForLocale(locale)
    res.json(content)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load history' })
  }
}

export async function getAdminHistory(_req: Request, res: Response) {
  try {
    const doc = await readHistoryDocument()
    res.json(doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load history' })
  }
}

export async function putAdminHistory(req: Request, res: Response) {
  try {
    await writeHistoryDocument(req.body)
    const doc = await readHistoryDocument()
    res.json(doc)
  } catch (e) {
    const status = (e as Error & { status?: number })?.status
    if (status === 400) {
      res.status(400).json({ error: 'Invalid history payload' })
      return
    }
    console.error(e)
    res.status(500).json({ error: 'Failed to save history' })
  }
}
