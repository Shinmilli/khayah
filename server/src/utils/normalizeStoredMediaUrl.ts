import { v2 as cloudinary } from 'cloudinary'
import { configureCloudinary, isCloudinaryConfigured } from './cloudinary'

/** 저장값이 public_id/path일 때 공개 URL로 변환 (재정보고 등 레거시 데이터) */
export function normalizeStoredMediaUrl(value: string | null | undefined): string | null {
  if (value == null) return null
  const s = String(value).trim()
  if (!s) return null
  if (/^https?:\/\//i.test(s)) return s

  if (s.startsWith('images/') || s.startsWith('documents/')) {
    const base = process.env.SUPABASE_URL?.trim()
    if (base) {
      const bucket = process.env.SUPABASE_STORAGE_BUCKET?.trim() || 'uploads'
      return `${base.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${s}`
    }
  }

  if (isCloudinaryConfigured()) {
    configureCloudinary()
    const resourceType = /\/documents\//.test(s) ? 'raw' : 'image'
    try {
      return cloudinary.url(s, { resource_type: resourceType, secure: true })
    } catch {
      return s
    }
  }

  return s
}
