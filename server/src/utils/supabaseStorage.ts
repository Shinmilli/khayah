import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET?.trim() || 'uploads'

export function isSupabaseStorageConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim())
}

function getAdminClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL?.trim()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!url || !key) {
    throw new Error(
      'Supabase Storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
    )
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export type StorageUploadResult = {
  url: string
  path: string
  filename: string
  publicId: string
  bytes: number
  resourceType: string
  provider: 'supabase'
}

function safeFileName(originalName: string): string {
  const ext = originalName.includes('.') ? originalName.slice(originalName.lastIndexOf('.')).toLowerCase() : ''
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  return `${stamp}${ext || ''}`
}

export async function uploadBufferToSupabase(options: {
  buffer: Buffer
  originalName: string
  mimeType: string
  kind: 'document' | 'image'
}): Promise<StorageUploadResult> {
  const supabase = getAdminClient()
  const folder = options.kind === 'document' ? 'documents' : 'images'
  const filename = safeFileName(options.originalName)
  const objectPath = `${folder}/${filename}`

  const { error } = await supabase.storage.from(BUCKET).upload(objectPath, options.buffer, {
    contentType: options.mimeType || 'application/octet-stream',
    upsert: false,
  })

  if (error) {
    throw new Error(error.message || 'Supabase Storage upload failed')
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(objectPath)

  return {
    url: data.publicUrl,
    path: objectPath,
    filename,
    publicId: objectPath,
    bytes: options.buffer.length,
    resourceType: options.kind === 'document' ? 'raw' : 'image',
    provider: 'supabase',
  }
}
