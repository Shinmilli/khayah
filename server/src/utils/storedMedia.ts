import { destroyCloudinaryAsset } from './cloudinary'
import { removeFromSupabase } from './supabaseStorage'

export type StoredMediaRef = {
  url: string
  name?: string
  publicId?: string
  path?: string
  provider?: string
  resourceType?: string
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === 'object'
}

export function parsePdfFilesMeta(meta: Record<string, string>): StoredMediaRef[] {
  const out: StoredMediaRef[] = []
  const seen = new Set<string>()
  const push = (ref: StoredMediaRef) => {
    const url = ref.url?.trim()
    if (!url || seen.has(url)) return
    seen.add(url)
    out.push({ ...ref, url })
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
            name: typeof item.name === 'string' ? item.name : undefined,
            publicId: typeof item.publicId === 'string' ? item.publicId : undefined,
            path: typeof item.path === 'string' ? item.path : undefined,
            provider: typeof item.provider === 'string' ? item.provider : undefined,
            resourceType: typeof item.resourceType === 'string' ? item.resourceType : undefined,
          })
        }
      }
    } catch {
      // ignore invalid json
    }
  }

  const legacy = meta.khayah_pdf_url?.trim()
  if (legacy) {
    push({
      url: legacy,
      name: meta.khayah_pdf_name?.trim() || undefined,
      provider: guessProvider(legacy),
      resourceType: legacy.includes('/raw/') ? 'raw' : undefined,
    })
  }

  return out
}

export function guessProvider(url: string): 'supabase' | 'cloudinary' | undefined {
  if (url.includes('/storage/v1/object/public/')) return 'supabase'
  if (url.includes('res.cloudinary.com') || url.includes('cloudinary.com')) return 'cloudinary'
  return undefined
}

/** 본문 HTML의 img / Cloudinary·Supabase 미디어 URL 수집 */
export function extractMediaFromHtml(html: string | null | undefined): StoredMediaRef[] {
  if (!html?.trim()) return []
  const out: StoredMediaRef[] = []
  const seen = new Set<string>()
  const push = (url: string, resourceType?: string) => {
    const u = url.trim()
    if (!u || seen.has(u)) return
    const provider = guessProvider(u)
    if (!provider) return
    seen.add(u)
    out.push({
      url: u,
      provider,
      resourceType:
        resourceType ||
        (u.includes('/raw/upload/') ? 'raw' : provider === 'cloudinary' ? 'image' : undefined),
    })
  }

  const srcRe = /(?:src|href)=["']([^"']+)["']/gi
  let m: RegExpExecArray | null
  while ((m = srcRe.exec(html))) {
    push(m[1]!)
  }
  return out
}

export function collectPostMedia(
  meta: Record<string, string>,
  contentHtml?: string | null,
): StoredMediaRef[] {
  const files = parsePdfFilesMeta(meta)
  const cover = meta.khayah_cover_url?.trim()
  if (cover && !files.some((f) => f.url === cover)) {
    files.push({ url: cover, provider: guessProvider(cover), resourceType: 'image' })
  }
  for (const ref of extractMediaFromHtml(contentHtml)) {
    if (!files.some((f) => f.url === ref.url)) files.push(ref)
  }
  return files
}

function supabasePathFromUrl(url: string): string | undefined {
  const m = url.match(/\/object\/public\/[^/]+\/(.+?)(?:\?|$)/)
  return m?.[1] ? decodeURIComponent(m[1]) : undefined
}

/** Cloudinary URL → 시도할 public_id 후보들 (.pdf 유무 등) */
export function cloudinaryPublicIdCandidates(url: string, explicit?: string): string[] {
  const out: string[] = []
  const add = (id?: string | null) => {
    const v = id?.trim()
    if (!v || out.includes(v)) return
    out.push(v)
  }
  add(explicit)
  const m = url.match(/\/(?:raw|image|video)\/upload\/(?:v\d+\/)?(.+?)(?:\?|$)/)
  if (m?.[1]) {
    const decoded = decodeURIComponent(m[1])
    add(decoded)
    if (decoded.toLowerCase().endsWith('.pdf')) add(decoded.slice(0, -4))
    else add(`${decoded}.pdf`)
  }
  return out
}

function cloudinaryResourceHint(url: string, explicit?: string): string | undefined {
  if (explicit) return explicit
  if (url.includes('/image/upload/')) return 'image'
  if (url.includes('/raw/upload/')) return 'raw'
  if (url.toLowerCase().includes('.pdf')) return 'raw'
  return undefined
}

export async function deleteStoredMedia(ref: StoredMediaRef): Promise<void> {
  const url = ref.url?.trim() ?? ''
  const provider = ref.provider || (url ? guessProvider(url) : undefined)

  if (provider === 'supabase') {
    const objectPath = ref.path || (url ? supabasePathFromUrl(url) : undefined) || ref.publicId
    if (objectPath) await removeFromSupabase(objectPath)
    return
  }

  if (provider === 'cloudinary') {
    const ids = cloudinaryPublicIdCandidates(url, ref.publicId)
    const hint = cloudinaryResourceHint(url, ref.resourceType)
    if (!ids.length) {
      throw new Error('Cloudinary public_id를 확인할 수 없습니다.')
    }
    let allNotFound = true
    for (const id of ids) {
      const outcome = await destroyCloudinaryAsset(id, hint)
      if (outcome === 'ok') return
      if (outcome !== 'not_found') allNotFound = false
    }
    // 후보 전부 없음 = 이미 삭제된 것으로 멱등 성공
    if (allNotFound) return
    console.warn('[storedMedia] cloudinary delete failed', { url, ids, hint })
    throw new Error(`Cloudinary 삭제 실패: ${ids[0]}`)
  }
}

export async function deleteStoredMediaMany(refs: StoredMediaRef[]): Promise<void> {
  for (const ref of refs) {
    try {
      await deleteStoredMedia(ref)
    } catch (e) {
      console.error('[storedMedia] delete failed', ref.url, e)
    }
  }
}

export function mediaNotIn(oldRefs: StoredMediaRef[], newRefs: StoredMediaRef[]): StoredMediaRef[] {
  const keep = new Set(newRefs.map((r) => r.url.trim()).filter(Boolean))
  return oldRefs.filter((r) => r.url.trim() && !keep.has(r.url.trim()))
}
