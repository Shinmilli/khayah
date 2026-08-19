import type { Request, Response } from 'express'

function allowedPdfSourceHost(host: string): boolean {
  const h = host.toLowerCase()
  return (
    h === 'res.cloudinary.com' ||
    h.endsWith('.cloudinary.com') ||
    h.endsWith('.supabase.co') ||
    h.endsWith('.supabase.in')
  )
}

function queryString(req: Request, key: string): string {
  const v = req.query[key]
  if (typeof v === 'string') return v.trim()
  if (Array.isArray(v) && typeof v[0] === 'string') return v[0].trim()
  return ''
}

function queryUrl(req: Request): string {
  return queryString(req, 'url')
}

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

function candidateUrls(src: string): string[] {
  const out = [src]
  const noHash = src.split('#')[0] ?? src
  if (!/\.pdf(\?|$)/i.test(noHash)) {
    const [pathPart, qs] = noHash.split('?')
    out.push(qs ? `${pathPart}.pdf?${qs}` : `${pathPart}.pdf`)
  }
  return [...new Set(out)]
}

async function fetchPdfBuffer(url: string): Promise<{ ok: true; buf: Buffer } | { ok: false; status: number }> {
  const upstream = await fetch(url, {
    redirect: 'follow',
    headers: {
      Accept: 'application/pdf,application/octet-stream,*/*',
      'User-Agent': 'KhayahPdfProxy/1.0',
    },
  })
  if (!upstream.ok) return { ok: false, status: upstream.status }
  const buf = Buffer.from(await upstream.arrayBuffer())
  if (buf.length < 5) return { ok: false, status: 502 }
  const magic = buf.subarray(0, 4).toString('utf8')
  if (magic !== '%PDF') {
    console.error('[uploads] pdf view: not a PDF', url, magic, buf.length)
    return { ok: false, status: 502 }
  }
  return { ok: true, buf }
}

/** 브라우저에서 PDF를 새 탭으로 열기 (Cloudinary raw URL에 확장자가 없으면 그냥 다운로드됨) */
export async function getPdfInline(req: Request, res: Response): Promise<void> {
  const raw = queryUrl(req)
  if (!raw) {
    res.status(400).json({ error: 'url is required' })
    return
  }

  let parsed: URL
  try {
    parsed = new URL(raw)
  } catch {
    res.status(400).json({ error: 'Invalid url' })
    return
  }
  if (parsed.protocol !== 'https:') {
    res.status(403).json({ error: 'Only https URLs are allowed' })
    return
  }
  if (!allowedPdfSourceHost(parsed.hostname)) {
    res.status(403).json({ error: 'Host not allowed' })
    return
  }

  try {
    let lastStatus = 502
    let buf: Buffer | null = null
    for (const url of candidateUrls(parsed.toString())) {
      const got = await fetchPdfBuffer(url)
      if (got.ok) {
        buf = got.buf
        break
      }
      lastStatus = got.status
    }
    if (!buf) {
      res.status(lastStatus === 404 ? 404 : 502).json({ error: 'Failed to fetch PDF', status: lastStatus })
      return
    }

    const name = queryString(req, 'name')
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', contentDispositionInline(name || 'document.pdf'))
    res.setHeader('Cache-Control', 'public, max-age=86400')
    res.send(buf)
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    console.error('[uploads] pdf view error', message)
    res.status(502).json({ error: 'Failed to load PDF', message })
  }
}
