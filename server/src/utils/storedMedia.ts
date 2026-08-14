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
    })
  }

  return out
}

export function collectPostMedia(meta: Record<string, string>): StoredMediaRef[] {
  const files = parsePdfFilesMeta(meta)
  const cover = meta.khayah_cover_url?.trim()
  if (cover && !files.some((f) => f.url === cover)) {
    files.push({ url: cover, provider: guessProvider(cover), resourceType: 'image' })
  }
  return files
}

export function guessProvider(url: string): 'supabase' | 'cloudinary' | undefined {
  if (url.includes('/storage/v1/object/public/')) return 'supabase'
  if (url.includes('res.cloudinary.com') || url.includes('cloudinary.com')) return 'cloudinary'
  return undefined
}

function supabasePathFromUrl(url: string): string | undefined {
  const m = url.match(/\/object\/public\/[^/]+\/(.+?)(?:\?|$)/)
  return m?.[1] ? decodeURIComponent(m[1]) : undefined
}

function cloudinaryPublicIdFromUrl(url: string): string | undefined {
  const m = url.match(/\/(?:raw|image|video)\/upload\/(?:v\d+\/)?(.+)$/)
  if (!m?.[1]) return undefined
  return decodeURIComponent(m[1])
}

function cloudinaryResourceHint(url: string, explicit?: string): string | undefined {
  if (explicit) return explicit
  if (url.includes('/image/upload/')) return 'image'
  if (url.includes('/raw/upload/')) return 'raw'
  return undefined
}

export async function deleteStoredMedia(ref: StoredMediaRef): Promise<void> {
  const url = ref.url?.trim() ?? ''
  const provider = ref.provider || (url ? guessProvider(url) : undefined)

  if (provider === 'supabase') {
    const objectPath = ref.path || (url ? supabasePathFromUrl(url) : undefined)
    if (objectPath) await removeFromSupabase(objectPath)
    return
  }

  if (provider === 'cloudinary') {
    const publicId = ref.publicId || (url ? cloudinaryPublicIdFromUrl(url) : undefined)
    if (publicId) await destroyCloudinaryAsset(publicId, cloudinaryResourceHint(url, ref.resourceType))
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
