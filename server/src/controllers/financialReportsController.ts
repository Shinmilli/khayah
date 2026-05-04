import type { Request, Response } from 'express'
import { readFinancialReportsDocument, writeFinancialReportsDocument } from '../services/financialReportsFileService'

export async function getFinancialReports(_req: Request, res: Response) {
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
