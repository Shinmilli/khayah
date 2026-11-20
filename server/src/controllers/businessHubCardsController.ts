import type { Request, Response } from 'express'
import {
  parseBusinessHub,
  parseBusinessLocale,
  readBusinessHubCardsForLocale,
  readBusinessHubCardsState,
  writeBusinessHubCardsDocument,
} from '../services/businessHubCardsFileService'
import { adminCanSeeDraft, saveModeOf } from '../services/documentDraft'

export async function getBusinessHubCards(req: Request, res: Response) {
  try {
    const locale = parseBusinessLocale(req.query.lang)
    const hub = parseBusinessHub(req.query.hub)
    const cards = await readBusinessHubCardsForLocale(locale, hub, await adminCanSeeDraft(req))
    res.json({ version: 1, cards })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load business hub cards' })
  }
}

export async function getAdminBusinessHubCards(_req: Request, res: Response) {
  try {
    const { doc, unpublished } = await readBusinessHubCardsState(true)
    res.json({ ...doc, unpublished })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load business hub cards' })
  }
}

export async function putAdminBusinessHubCards(req: Request, res: Response) {
  try {
    await writeBusinessHubCardsDocument(req.body, saveModeOf(req))
    const { doc, unpublished } = await readBusinessHubCardsState(true)
    res.json({ ...doc, unpublished })
  } catch (e) {
    const status = (e as Error & { status?: number })?.status
    if (status === 400) {
      res.status(400).json({ error: 'Invalid business hub cards payload' })
      return
    }
    console.error(e)
    res.status(500).json({ error: 'Failed to save business hub cards' })
  }
}
