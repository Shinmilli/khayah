import type { NextFunction, Request, Response } from 'express'
import path from 'path'
import multer from 'multer'
import { isCloudinaryConfigured, uploadBufferToCloudinary } from '../utils/cloudinary'
import { isSupabaseStorageConfigured, uploadBufferToSupabase } from '../utils/supabaseStorage'
import { decodeOriginalFilename } from '../utils/uploadFilename'
import { deleteStoredMedia, type StoredMediaRef } from '../utils/storedMedia'
import { looksLikeImageBuffer, looksLikePdfBuffer } from '../utils/uploadSniff'

/** Cloudinary free ~10MB — larger files go to Supabase Storage */
const CLOUDINARY_MAX_BYTES = 10 * 1024 * 1024

const memory = multer.memoryStorage()

function pdfFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const okMime = file.mimetype === 'application/pdf'
  const okExt = path.extname(file.originalname ?? '').toLowerCase() === '.pdf'
  if (okMime || okExt) return cb(null, true)
  return cb(new Error('Only PDF files are allowed'))
}

function imageFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (/^image\/(jpeg|png|webp|gif)$/i.test(file.mimetype)) return cb(null, true)
  const ext = path.extname(file.originalname ?? '').toLowerCase()
  if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) return cb(null, true)
  return cb(new Error('Only JPEG, PNG, WebP, or GIF images are allowed'))
}

const uploadPdf = multer({
  storage: memory,
  fileFilter: pdfFilter,
  // Supabase Storage default max ~50MB
  limits: { fileSize: 50 * 1024 * 1024 },
})

const uploadImage = multer({
  storage: memory,
  fileFilter: imageFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
})

function runMulter(middleware: ReturnType<typeof uploadPdf.single>) {
  return (req: Request, res: Response, next: NextFunction) => {
    middleware(req, res, (err: unknown) => {
      if (!err) return next()
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          error: '파일이 너무 큽니다. PDF는 최대 50MB까지 업로드할 수 있습니다.',
        })
      }
      const message = err instanceof Error ? err.message : 'Upload failed'
      return res.status(400).json({ error: message })
    })
  }
}

async function handleUpload(req: Request, res: Response, kind: 'document' | 'image') {
  const file = req.file
  if (!file?.buffer) {
    return res.status(400).json({ error: 'No file uploaded (field name: file)' })
  }

  // 이미지가 documents(raw)로 들어가는 사고 방지
  if (kind === 'document') {
    if (looksLikeImageBuffer(file.buffer, file.mimetype, file.originalname)) {
      return res.status(400).json({
        error: '이미지 파일은 PDF 업로드로 올릴 수 없습니다. 표지/본문 이미지 업로드를 사용하세요.',
      })
    }
    if (!looksLikePdfBuffer(file.buffer)) {
      return res.status(400).json({
        error: 'PDF 내용이 아닙니다. 올바른 PDF 파일인지 확인하세요.',
      })
    }
  }

  const resolvedKind: 'document' | 'image' =
    kind === 'image' || looksLikeImageBuffer(file.buffer, file.mimetype, file.originalname)
      ? 'image'
      : 'document'

  if (kind === 'image' && resolvedKind !== 'image') {
    return res.status(400).json({ error: '이미지 파일만 업로드할 수 있습니다.' })
  }

  const originalName = decodeOriginalFilename(
    file.originalname,
    resolvedKind === 'document' ? 'file.pdf' : 'image',
  )

  const useSupabase = file.size > CLOUDINARY_MAX_BYTES

  try {
    if (useSupabase) {
      if (!isSupabaseStorageConfigured()) {
        return res.status(503).json({
          error: 'File is larger than 10MB but Supabase Storage is not configured',
          required: ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'],
          hint: 'Create a public bucket named uploads in Supabase Storage, then set the env vars on Render.',
        })
      }
      const uploaded = await uploadBufferToSupabase({
        buffer: file.buffer,
        originalName,
        mimeType: file.mimetype,
        kind: resolvedKind,
      })
      return res.json({
        url: uploaded.url,
        path: uploaded.path,
        filename: uploaded.filename,
        originalName,
        mimeType: file.mimetype,
        size: uploaded.bytes || file.size,
        publicId: uploaded.publicId,
        resourceType: uploaded.resourceType,
        provider: 'supabase',
      })
    }

    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        error: 'Cloudinary is not configured',
        required: ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'],
      })
    }

    const uploaded = await uploadBufferToCloudinary({
      buffer: file.buffer,
      originalName,
      mimeType: file.mimetype,
      kind: resolvedKind,
    })

    return res.json({
      url: uploaded.url,
      path: uploaded.path,
      filename: uploaded.filename,
      originalName,
      mimeType: file.mimetype,
      size: uploaded.bytes || file.size,
      publicId: uploaded.publicId,
      resourceType: uploaded.resourceType,
      provider: 'cloudinary',
    })
  } catch (e) {
    console.error('[uploads] error', e)
    const anyErr = e as { message?: string; http_code?: number }
    const message =
      anyErr?.message || (e instanceof Error ? e.message : 'Upload failed')
    return res.status(500).json({
      error: message,
      http_code: anyErr?.http_code,
      provider: useSupabase ? 'supabase' : 'cloudinary',
    })
  }
}

export const postDocumentUpload = [
  runMulter(uploadPdf.single('file')),
  (req: Request, res: Response) => {
    void handleUpload(req, res, 'document')
  },
]

export const postImageUpload = [
  runMulter(uploadImage.single('file')),
  (req: Request, res: Response) => {
    void handleUpload(req, res, 'image')
  },
]

export async function deleteUpload(req: Request, res: Response) {
  const body = req.body as StoredMediaRef | undefined
  const url = typeof body?.url === 'string' ? body.url.trim() : ''
  if (!url && !body?.publicId && !body?.path) {
    return res.status(400).json({ error: 'url, publicId, or path is required' })
  }
  try {
    await deleteStoredMedia({
      url,
      publicId: typeof body?.publicId === 'string' ? body.publicId : undefined,
      path: typeof body?.path === 'string' ? body.path : undefined,
      provider: typeof body?.provider === 'string' ? body.provider : undefined,
      resourceType: typeof body?.resourceType === 'string' ? body.resourceType : undefined,
    })
    return res.json({ ok: true })
  } catch (e) {
    console.error('[uploads] delete error', e)
    return res.status(500).json({ error: e instanceof Error ? e.message : 'Delete failed' })
  }
}
