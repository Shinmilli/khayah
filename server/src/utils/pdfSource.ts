import type { Request } from 'express'
import { downloadCloudinaryRawBuffer } from './cloudinary'
import { cloudinaryPublicIdCandidates } from './storedMedia'

export function allowedPdfSourceHost(host: string): boolean {
  const h = host.toLowerCase()
  return (
    h === 'res.cloudinary.com' ||
    h.endsWith('.cloudinary.com') ||
    h.endsWith('.supabase.co') ||
    h.endsWith('.supabase.in')
  )
}

export function readQuery(req: Request, key: string): string {
  const v = req.query[key]
  if (typeof v === 'string') return v.trim()
  if (Array.isArray(v) && typeof v[0] === 'string') return v[0].trim()
  return ''
}

function candidateUrls(src: string): string[] {
  const out = [src]
  const noHash = src.split('#')[0] ?? src
  if (!/\.pdf(\?|$)/i.test(noHash)) {
    const [pathPart, qs] = noHash.split('?')
    out.push(qs ? `${pathPart}.pdf?${qs}` : `${pathPart}.pdf`)
  } else {
    // public_id에 .pdf가 들어간 자산은 delivery가 401 → 확장자 없는 URL도 시도
    out.push(noHash.replace(/\.pdf(?=\?|$)/i, ''))
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

export type LoadedPdf = { ok: true; buf: Buffer } | { ok: false; status: number; error: string }

/** Cloudinary/Supabase에 있는 PDF 바이트. 공개 URL이 401이면 인증 다운로드로 재시도. */
export async function loadAllowedPdf(raw: string): Promise<LoadedPdf> {
  if (!raw.trim()) return { ok: false, status: 400, error: 'url is required' }

  let parsed: URL
  try {
    parsed = new URL(raw)
  } catch {
    return { ok: false, status: 400, error: 'Invalid url' }
  }
  if (parsed.protocol !== 'https:') {
    return { ok: false, status: 403, error: 'Only https URLs are allowed' }
  }
  if (!allowedPdfSourceHost(parsed.hostname)) {
    return { ok: false, status: 403, error: 'Host not allowed' }
  }

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

  if (!buf && parsed.hostname.toLowerCase().includes('cloudinary.com')) {
    for (const id of cloudinaryPublicIdCandidates(parsed.toString())) {
      const authBuf = await downloadCloudinaryRawBuffer(id)
      if (authBuf) {
        buf = authBuf
        break
      }
    }
  }

  if (!buf) {
    return {
      ok: false,
      status: lastStatus === 404 ? 404 : 502,
      error: 'Failed to fetch PDF',
    }
  }
  return { ok: true, buf }
}
