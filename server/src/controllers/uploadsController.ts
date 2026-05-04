import type { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import multer from 'multer'

function getUploadsDir(): string {
  return process.env.UPLOADS_DIR ?? path.resolve(process.cwd(), 'uploads')
}

function ensureUploadsDirExists() {
  const dir = getUploadsDir()
  fs.mkdirSync(dir, { recursive: true })
}

function safeBaseName(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  return base.length > 0 ? base : 'file'
}

ensureUploadsDirExists()

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, getUploadsDir())
  },
  filename: (_req, file, cb) => {
    const original = file.originalname ?? 'file'
    const ext = path.extname(original).toLowerCase() || ''
    const base = safeBaseName(path.basename(original, path.extname(original))).slice(0, 80)
    const stamp = Date.now()
    cb(null, `${base}-${stamp}${ext || '.bin'}`)
  },
})

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

function uploadJson(req: Request, res: Response, file: Express.Multer.File) {
  const publicPath = `/uploads/${file.filename}`
  const host = req.get('host')
  const url = host ? `${req.protocol}://${host}${publicPath}` : publicPath
  return res.json({
    url,
    path: publicPath,
    filename: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
  })
}

const uploadPdf = multer({
  storage,
  fileFilter: pdfFilter,
  limits: { fileSize: 25 * 1024 * 1024 },
})

const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
})

export const postDocumentUpload = [
  uploadPdf.single('file'),
  (req: Request, res: Response) => {
    const file = req.file
    if (!file) return res.status(400).json({ error: 'No file uploaded (field name: file)' })
    return uploadJson(req, res, file)
  },
]

export const postImageUpload = [
  uploadImage.single('file'),
  (req: Request, res: Response) => {
    const file = req.file
    if (!file) return res.status(400).json({ error: 'No file uploaded (field name: file)' })
    return uploadJson(req, res, file)
  },
]
