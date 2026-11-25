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
        (u.includes('/raw/upload/')
          ? 'raw'
          : u.includes('/video/upload/') || /\.(mp4|webm|mov|m4v)(?:\?|$)/i.test(u)
            ? 'video'
            : provider === 'cloudinary'
              ? 'image'
              : undefined),
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

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif)$/i

function isCloudinaryTransformSegment(segment: string): boolean {
  if (!segment || /^v\d+$/.test(segment)) return false
  if (segment.includes(',')) return true
  return /^[a-z]{1,3}_/.test(segment)
}

function withoutMediaExt(id: string): string {
  return id.replace(/\.(jpe?g|png|gif|webp|avif|pdf)$/i, '')
}

/**
 * Cloudinary URL → 시도할 public_id 후보들.
 * 이미지 주소는 `.../id.jpg`인데 실제 public_id는 확장자가 없다.
 * 변환(f_webp 등)이 붙은 주소도 같은 id로 지운다.
 */
export function cloudinaryPublicIdCandidates(url: string, explicit?: string): string[] {
  const out: string[] = []
  const add = (id?: string | null) => {
    const v = id?.trim()
    if (!v || out.includes(v)) return
    out.push(v)
  }
  add(explicit)
  if (explicit) add(withoutMediaExt(explicit))
  const m = url.match(/\/(?:raw|image|video)\/upload\/(.+?)(?:\?|$)/)
  if (!m?.[1]) return out
  const parts = decodeURIComponent(m[1]).split('/').filter(Boolean)
  while (parts.length > 1 && (/^v\d+$/.test(parts[0]!) || isCloudinaryTransformSegment(parts[0]!))) {
    parts.shift()
  }
  const decoded = parts.join('/')
  add(withoutMediaExt(decoded))
  add(decoded)
  if (decoded.toLowerCase().endsWith('.pdf')) add(decoded.slice(0, -4))
  else if (!IMAGE_EXT.test(decoded)) add(`${decoded}.pdf`)
  return out
}

function cloudinaryResourceHint(url: string, explicit?: string): string | undefined {
  if (explicit) return explicit
  if (url.includes('/image/upload/')) return 'image'
  if (url.includes('/video/upload/')) return 'video'
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

/** JSON 문서 안의 Cloudinary·Supabase URL을 재귀적으로 모은다 */
export function extractRemoteMediaFromValue(value: unknown): StoredMediaRef[] {
  const out: StoredMediaRef[] = []
  const seen = new Set<string>()
  const push = (ref: StoredMediaRef) => {
    const url = ref.url.trim()
    if (!url || seen.has(url)) return
    seen.add(url)
    out.push({ ...ref, url })
  }
  const walk = (v: unknown) => {
    if (typeof v === 'string') {
      const t = v.trim()
      if (!t) return
      const provider = guessProvider(t)
      if (provider) {
        push({ url: t, provider })
        return
      }
      if (t.includes('<') && (t.includes('src=') || t.includes('href='))) {
        for (const ref of extractMediaFromHtml(t)) push(ref)
      }
      return
    }
    if (Array.isArray(v)) {
      for (const item of v) walk(item)
      return
    }
    if (v && typeof v === 'object') {
      for (const item of Object.values(v as Record<string, unknown>)) walk(item)
    }
  }
  walk(value)
  return out
}

/** 저장 전후 JSON을 비교해 빠진 원격 파일을 Cloudinary·Supabase에서 지운다 */
export async function deleteRemovedStoredMedia(previous: unknown, next: unknown): Promise<void> {
  await deleteStoredMediaMany(
    mediaNotIn(extractRemoteMediaFromValue(previous), extractRemoteMediaFromValue(next)),
  )
}
