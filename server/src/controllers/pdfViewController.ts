import type { Request, Response } from 'express'
import { loadAllowedPdf, readQuery } from '../utils/pdfSource'

function ensurePdfExt(name: string): string {
  return name.toLowerCase().endsWith('.pdf') ? name : `${name}.pdf`
}

function utf8PdfName(raw: string | undefined): string {
  const base = (raw ?? 'document.pdf').split(/[/\\]/).pop() ?? 'document.pdf'
  const cleaned = base.replace(/[\r\n"]/g, '').trim() || 'document.pdf'
  return ensurePdfExt(cleaned)
}

function asciiPdfName(raw: string | undefined): string {
  const base = utf8PdfName(raw)
  const cleaned = base.replace(/[^\w.\-]+/g, '_').replace(/^_+|_+$/g, '') || 'document'
  return ensurePdfExt(cleaned)
}

function contentDispositionInline(raw: string | undefined): string {
  const utf8 = utf8PdfName(raw)
  const ascii = asciiPdfName(raw)
  return `inline; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(utf8)}`
}

/** 브라우저에서 PDF를 새 탭으로 열기 (Cloudinary raw URL에 확장자가 없으면 그냥 다운로드됨) */
export async function getPdfInline(req: Request, res: Response): Promise<void> {
  const raw = readQuery(req, 'url')
  if (!raw) {
    res.status(400).json({ error: 'url is required' })
    return
  }

  try {
    const loaded = await loadAllowedPdf(raw)
    if (!loaded.ok) {
      if (loaded.status === 400 || loaded.status === 403) {
        res.status(loaded.status).json({ error: loaded.error })
        return
      }
      res.status(loaded.status).json({ error: 'Failed to fetch PDF', status: loaded.status })
      return
    }

    const name = readQuery(req, 'name')
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', contentDispositionInline(name || 'document.pdf'))
    res.setHeader('Cache-Control', 'public, max-age=86400')
    res.send(loaded.buf)
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    console.error('[uploads] pdf view error', message)
    res.status(502).json({ error: 'Failed to load PDF', message })
  }
}
