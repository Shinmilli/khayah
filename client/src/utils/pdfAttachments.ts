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

export function coverIsBlank(meta?: Record<string, string>): boolean {
  return (meta?.khayah_cover_blank ?? '').trim() === 'true'
}
