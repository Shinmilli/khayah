import type { Request, Response } from 'express'
import { adminCanSeeDraft, saveModeOf } from '../services/documentDraft'
import {
  parseInquiryFaqLocale,
  readInquiryFaqForLocale,
  readInquiryFaqState,
  writeInquiryFaqDocument,
} from '../services/inquiryFaqFileService'

export async function getInquiryFaq(req: Request, res: Response) {
  try {
    const locale = parseInquiryFaqLocale(req.query.lang)
    const content = await readInquiryFaqForLocale(locale, await adminCanSeeDraft(req))
    const enabled = content.enabled === true
    const items = enabled
      ? [...content.items].filter((i) => i.published).sort((a, b) => a.order - b.order)
      : []
    res.json({ version: 2, enabled, items })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load FAQ' })
  }
}

export async function getAdminInquiryFaq(_req: Request, res: Response) {
  try {
    const { doc, unpublished } = await readInquiryFaqState(true)
    res.json({ ...doc, unpublished })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load FAQ' })
  }
}

export async function putAdminInquiryFaq(req: Request, res: Response) {
  try {
    await writeInquiryFaqDocument(req.body, saveModeOf(req))
    const { doc, unpublished } = await readInquiryFaqState(true)
    res.json({ ...doc, unpublished })
  } catch (e) {
    const status = (e as Error & { status?: number })?.status
    if (status === 400) {
      res.status(400).json({ error: 'Invalid FAQ payload' })
      return
    }
    console.error(e)
    res.status(500).json({ error: 'Failed to save FAQ' })
  }
}
