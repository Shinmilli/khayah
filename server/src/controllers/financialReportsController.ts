import type { Request, Response } from 'express'
import {
  parseFinancialLocale,
  readFinancialReportsDocument,
  readFinancialReportsForLocale,
  writeFinancialReportsDocument,
} from '../services/financialReportsFileService'

export async function getFinancialReports(req: Request, res: Response) {
  try {
    const locale = parseFinancialLocale(req.query.lang)
    const doc = await readFinancialReportsForLocale(locale)
    res.json(doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load financial reports' })
  }
}

export async function getAdminFinancialReports(_req: Request, res: Response) {
  try {
    const doc = await readFinancialReportsDocument()
    res.json(doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load financial reports' })
  }
}

export async function putAdminFinancialReports(req: Request, res: Response) {
  try {
    await writeFinancialReportsDocument(req.body)
    const doc = await readFinancialReportsDocument()
    res.json(doc)
  } catch (e) {
    const status = (e as Error & { status?: number })?.status
    if (status === 400) {
      res.status(400).json({ error: 'Invalid financial reports payload' })
      return
    }
    console.error(e)
    res.status(500).json({ error: 'Failed to save financial reports' })
  }
}
