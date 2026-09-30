import type { Request, Response } from 'express'
import { appendPdfTitle } from '../utils/pdfTitle'
import { loadAllowedPdf, readQuery } from '../utils/pdfSource'

function ensurePdfExt(name: string): string {
  return name.toLowerCase().endsWith('.pdf') ? name : `${name}.pdf`
}

function utf8PdfName(raw: string | undefined): string {
  const base = (raw ?? 'document.pdf').split(/[/\\]/).pop() ?? 'document.pdf'
  const cleaned = base.replace(/[\r\n"]/g, '').trim() || 'document.pdf'
  return ensurePdfExt(cleaned)
}

function requestedPdfName(req: Request): string {
  const fromPath = typeof req.params.filename === 'string' ? req.params.filename : ''
  return utf8PdfName(fromPath || readQuery(req, 'name') || undefined)
}

/** 한글 파일명을 ASCII로 줄이면 탭에 Vol.2_2021.pdf 처럼 잘린 이름이 나온다. */
function contentDispositionInline(raw: string): string {
  const utf8 = utf8PdfName(raw)
  const star = `filename*=UTF-8''${encodeURIComponent(utf8)}`
  if (/^[\x20-\x7E]+$/.test(utf8) && !utf8.includes('"') && !utf8.includes('\\')) {
    return `inline; filename="${utf8}"; ${star}`
  }
  return `inline; ${star}`
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

    const name = requestedPdfName(req)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', contentDispositionInline(name))
    res.setHeader('Cache-Control', 'public, max-age=86400')
    res.send(appendPdfTitle(loaded.buf, name))
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    console.error('[uploads] pdf view error', message)
    res.status(502).json({ error: 'Failed to load PDF', message })
  }
}
