import type { NextFunction, Request, Response } from 'express'
import path from 'path'
import multer from 'multer'
import { isCloudinaryConfigured, uploadBufferToCloudinary } from '../utils/cloudinary'

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
  limits: { fileSize: 25 * 1024 * 1024 },
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
      const message = err instanceof Error ? err.message : 'Upload failed'
      return res.status(400).json({ error: message })
    })
  }
}

async function handleCloudinaryUpload(req: Request, res: Response, kind: 'document' | 'image') {
  if (!isCloudinaryConfigured()) {
    return res.status(503).json({
      error: 'Cloudinary is not configured',
      required: ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'],
    })
  }

  const file = req.file
  if (!file?.buffer) {
    return res.status(400).json({ error: 'No file uploaded (field name: file)' })
  }

  try {
    const uploaded = await uploadBufferToCloudinary({
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
      kind,
    })

    return res.json({
      url: uploaded.url,
      path: uploaded.path,
      filename: uploaded.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: uploaded.bytes || file.size,
      publicId: uploaded.publicId,
      resourceType: uploaded.resourceType,
    })
  } catch (e) {
    console.error('[uploads] Cloudinary error', e)
    const message = e instanceof Error ? e.message : 'Cloudinary upload failed'
    return res.status(500).json({ error: message })
  }
}

export const postDocumentUpload = [
  runMulter(uploadPdf.single('file')),
  (req: Request, res: Response) => {
    void handleCloudinaryUpload(req, res, 'document')
  },
]

export const postImageUpload = [
  runMulter(uploadImage.single('file')),
  (req: Request, res: Response) => {
    void handleCloudinaryUpload(req, res, 'image')
  },
]
