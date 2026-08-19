import { API_BASE } from '../constants'

export type PdfAttachment = {
  url: string
  name: string
  publicId?: string
  path?: string
  provider?: string
  resourceType?: string
  size?: number
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === 'object'
}

export function parsePdfAttachments(meta?: Record<string, string>): PdfAttachment[] {
  if (!meta) return []
  const out: PdfAttachment[] = []
  const seen = new Set<string>()
  const push = (item: PdfAttachment) => {
    const url = item.url.trim()
    if (!url || seen.has(url)) return
    seen.add(url)
    out.push({ ...item, url, name: item.name.trim() || '문서.pdf' })
  }

  const raw = meta.khayah_pdf_files?.trim()
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as unknown
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (!isRecord(item) || typeof item.url !== 'string') continue
          push({
            url: item.url,
            name: typeof item.name === 'string' ? item.name : '',
            publicId: typeof item.publicId === 'string' ? item.publicId : undefined,
            path: typeof item.path === 'string' ? item.path : undefined,
            provider: typeof item.provider === 'string' ? item.provider : undefined,
            resourceType: typeof item.resourceType === 'string' ? item.resourceType : undefined,
            size: typeof item.size === 'number' ? item.size : undefined,
          })
        }
      }
    } catch {
      /* ignore */
    }
  }

  const legacy = meta.khayah_pdf_url?.trim()
  if (legacy) {
    push({ url: legacy, name: meta.khayah_pdf_name?.trim() || '문서.pdf' })
  }
  return out
}

/** Cloudinary raw PDF는 URL에 .pdf가 없으면 브라우저가 확장자 없는 파일로 저장함 */
export function pdfOpenHref(url: string, filename?: string): string {
  const u = url.trim()
  if (!u) return u
  if (u.startsWith('/')) return u

  let host = ''
  try {
    host = new URL(u).hostname.toLowerCase()
  } catch {
    return u
  }

  const isCloudinaryRaw = host.includes('cloudinary.com') && u.includes('/raw/upload/')
  const isSupabase = host.endsWith('.supabase.co') || host.endsWith('.supabase.in')
  if (!isCloudinaryRaw && !isSupabase) return u

  const qs = new URLSearchParams({ url: u })
  const name = filename?.trim()
  if (name) qs.set('name', name)
  return `${API_BASE}/uploads/pdf?${qs.toString()}`
}

export function coverIsBlank(meta?: Record<string, string>): boolean {
  return (meta?.khayah_cover_blank ?? '').trim() === 'true'
}
