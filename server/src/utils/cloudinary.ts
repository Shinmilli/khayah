import { v2 as cloudinary } from 'cloudinary'

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim(),
  )
}

export function configureCloudinary(): void {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.',
    )
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })
}

export type CloudinaryUploadResult = {
  url: string
  path: string
  filename: string
  publicId: string
  bytes: number
  resourceType: string
  format?: string
}

function folderPrefix(): string {
  return (process.env.CLOUDINARY_FOLDER ?? 'khayah').replace(/^\/+|\/+$/g, '')
}

type UploadApiLike = {
  secure_url: string
  public_id: string
  bytes: number
  resource_type: string
  format?: string
  original_filename?: string
}

export async function uploadBufferToCloudinary(options: {
  buffer: Buffer
  originalName: string
  mimeType: string
  kind: 'document' | 'image'
}): Promise<CloudinaryUploadResult> {
  configureCloudinary()

  const folder = `${folderPrefix()}/${options.kind === 'document' ? 'documents' : 'images'}`
  const resourceType = options.kind === 'document' ? 'raw' : 'image'

  const result = await new Promise<UploadApiLike>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        // 한글/특수문자 파일명은 public_id로 쓰지 않음 (Cloudinary 오류 방지)
        use_filename: false,
        unique_filename: true,
        overwrite: false,
        // PDF raw도 공개 URL로 바로 열리게
        type: 'upload',
        access_mode: 'public',
      },
      (err, uploaded) => {
        if (err || !uploaded?.secure_url || !uploaded.public_id) {
          reject(err ?? new Error('Cloudinary upload failed'))
          return
        }
        resolve(uploaded as UploadApiLike)
      },
    )
    stream.end(options.buffer)
  })

  const filename =
    result.original_filename ?? result.public_id.split('/').pop() ?? options.originalName

  return {
    url: result.secure_url,
    path: result.public_id,
    filename,
    publicId: result.public_id,
    bytes: result.bytes,
    resourceType: result.resource_type,
    format: result.format,
  }
}

export async function destroyCloudinaryAsset(publicId: string, resourceTypeHint?: string): Promise<void> {
  if (!publicId.trim() || !isCloudinaryConfigured()) return
  configureCloudinary()
  const order =
    resourceTypeHint === 'image' ? (['image', 'raw'] as const) : (['raw', 'image'] as const)
  for (const resource_type of order) {
    try {
      const r = await cloudinary.uploader.destroy(publicId, { resource_type, invalidate: true })
      if (r?.result === 'ok' || r?.result === 'not found') return
    } catch {
      // try next resource type
    }
  }
}
