import type { Request, Response } from 'express'
import {
  parseInquiryFaqLocale,
  readInquiryFaqDocument,
  readInquiryFaqForLocale,
  writeInquiryFaqDocument,
} from '../services/inquiryFaqFileService'

export async function getInquiryFaq(req: Request, res: Response) {
  try {
    const locale = parseInquiryFaqLocale(req.query.lang)
    const content = await readInquiryFaqForLocale(locale)
    const items = [...content.items].filter((i) => i.published).sort((a, b) => a.order - b.order)
    res.json({ version: 2, items })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load FAQ' })
  }
}

export async function getAdminInquiryFaq(_req: Request, res: Response) {
  try {
    const doc = await readInquiryFaqDocument()
    res.json(doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load FAQ' })
  }
}

export async function putAdminInquiryFaq(req: Request, res: Response) {
  try {
    await writeInquiryFaqDocument(req.body)
    const doc = await readInquiryFaqDocument()
    res.json(doc)
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
