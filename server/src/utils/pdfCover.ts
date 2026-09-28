import { createHash } from 'crypto'
import { mkdir, readFile, rename, writeFile } from 'fs/promises'
import { createRequire } from 'module'
import os from 'os'
import path from 'path'

const require = createRequire(__filename)
const pdfjsRoot = path.dirname(require.resolve('pdfjs-dist/package.json'))
const cMapUrl = path.join(pdfjsRoot, 'cmaps') + path.sep
const standardFontDataUrl = path.join(pdfjsRoot, 'standard_fonts') + path.sep

const CACHE_DIR = path.join(os.tmpdir(), 'khayah-pdf-covers')
const TARGET_WIDTH = 720
const MAX_HEIGHT = 1280
const JPEG_QUALITY = 72
const MEMORY_MAX = 32
const RENDER_SLOTS = 2

type CanvasAndContext = {
  canvas: { toBuffer: (mime: 'image/jpeg', quality?: number) => Buffer; width: number; height: number } | null
  context: {
    fillStyle: string
    fillRect: (x: number, y: number, w: number, h: number) => void
  } | null
}

type PdfDoc = {
  getPage: (n: number) => Promise<{
    getViewport: (opts: { scale: number }) => { width: number; height: number }
    render: (ctx: { canvasContext: unknown; viewport: unknown }) => { promise: Promise<void> }
    cleanup: () => void
  }>
  canvasFactory: {
    create: (width: number, height: number) => CanvasAndContext
    destroy: (canvasAndContext: CanvasAndContext) => void
  }
  destroy: () => Promise<void>
}

type PdfjsApi = {
  getDocument: (src: Record<string, unknown>) => { promise: Promise<PdfDoc>; destroy: () => void }
}

const memory = new Map<string, Buffer>()
const pending = new Map<string, Promise<Buffer>>()
let cacheDirReady: Promise<void> | null = null
let activeRenders = 0
const renderWaiters: Array<() => void> = []

function remember(key: string, buf: Buffer): void {
  if (memory.has(key)) memory.delete(key)
  memory.set(key, buf)
  while (memory.size > MEMORY_MAX) {
    const oldest = memory.keys().next().value
    if (oldest === undefined) break
    memory.delete(oldest)
  }
}

function ensureCacheDir(): Promise<void> {
  if (!cacheDirReady) cacheDirReady = mkdir(CACHE_DIR, { recursive: true }).then(() => undefined)
  return cacheDirReady
}

async function readDisk(key: string): Promise<Buffer | null> {
  try {
    return await readFile(path.join(CACHE_DIR, `${key}.jpg`))
  } catch {
    return null
  }
}

async function withRenderSlot<T>(fn: () => Promise<T>): Promise<T> {
  if (activeRenders >= RENDER_SLOTS) {
    await new Promise<void>((resolve) => renderWaiters.push(resolve))
  }
  activeRenders += 1
  try {
    return await fn()
  } finally {
    activeRenders -= 1
    renderWaiters.shift()?.()
  }
}

async function loadPdfjs(): Promise<PdfjsApi> {
  const dynamicImport = new Function('specifier', 'return import(specifier)') as (specifier: string) => Promise<PdfjsApi>
  return dynamicImport('pdfjs-dist/legacy/build/pdf.mjs')
}

async function renderPdfFirstPageJpeg(pdf: Buffer): Promise<Buffer> {
  const pdfjs = await loadPdfjs()
  const task = pdfjs.getDocument({
    data: new Uint8Array(pdf),
    cMapUrl,
    cMapPacked: true,
    standardFontDataUrl,
    isEvalSupported: false,
    verbosity: 0,
  })
  const doc = await task.promise
  let canvasAndContext: CanvasAndContext | null = null
  try {
    const page = await doc.getPage(1)
    const base = page.getViewport({ scale: 1 })
    const scale = Math.min(TARGET_WIDTH / base.width, MAX_HEIGHT / base.height)
    const viewport = page.getViewport({ scale: Number.isFinite(scale) && scale > 0 ? scale : 1 })
    canvasAndContext = doc.canvasFactory.create(Math.ceil(viewport.width), Math.ceil(viewport.height))
    const ctx = canvasAndContext.context
    const canvas = canvasAndContext.canvas
    if (!ctx || !canvas) throw new Error('canvas')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    await page.render({ canvasContext: ctx, viewport }).promise
    const jpeg = canvas.toBuffer('image/jpeg', JPEG_QUALITY)
    page.cleanup()
    return jpeg
  } finally {
    if (canvasAndContext) {
      try {
        doc.canvasFactory.destroy(canvasAndContext)
      } catch {
        /* ignore */
      }
    }
    await doc.destroy().catch(() => undefined)
  }
}

async function writeCache(key: string, jpeg: Buffer): Promise<void> {
  await ensureCacheDir()
  const finalPath = path.join(CACHE_DIR, `${key}.jpg`)
  const tmpPath = `${finalPath}.${process.pid}.tmp`
  await writeFile(tmpPath, jpeg)
  await rename(tmpPath, finalPath)
}

function tinyWarmPdf(): Buffer {
  const stream = 'BT /F1 12 Tf 40 40 Td ( ) Tj ET\n'
  const header = '%PDF-1.4\n'
  const objs = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
    `4 0 obj\n<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}endstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
  ]
  let body = header
  const offsets = [0]
  for (const obj of objs) {
    offsets.push(Buffer.byteLength(body))
    body += obj
  }
  const xrefPos = Buffer.byteLength(body)
  let xref = `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`
  for (let i = 1; i <= objs.length; i += 1) {
    xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
  }
  return Buffer.from(
    `${body}${xref}trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`,
  )
}

/** pdf.js와 캔버스를 미리 올려, 첫 표지 요청이 라이브러리 로딩을 기다리지 않게 한다. */
export function warmPdfCoverRenderer(): void {
  const started = Date.now()
  void renderPdfFirstPageJpeg(tinyWarmPdf())
    .then(() => {
      console.log('[uploads] pdf cover renderer ready', `${Date.now() - started}ms`)
    })
    .catch((e) => {
      console.warn('[uploads] pdf cover renderer warm failed', e)
    })
}

/** 같은 PDF URL은 첫 요청만 렌더하고, 이후에는 JPEG를 바로 돌려준다. */
export async function getCachedPdfCover(pdfUrl: string, loadPdf: () => Promise<Buffer>): Promise<Buffer> {
  const key = createHash('sha256').update(`v1|${pdfUrl}`).digest('hex')
  const hot = memory.get(key)
  if (hot) return hot
  const disk = await readDisk(key)
  if (disk) {
    remember(key, disk)
    return disk
  }

  const existing = pending.get(key)
  if (existing) return existing

  const job = (async () => {
    const again = memory.get(key) ?? (await readDisk(key))
    if (again) {
      remember(key, again)
      return again
    }
    const jpeg = await withRenderSlot(async () => renderPdfFirstPageJpeg(await loadPdf()))
    remember(key, jpeg)
    await writeCache(key, jpeg).catch((e) => {
      console.warn('[uploads] pdf cover cache write failed', e)
    })
    return jpeg
  })().finally(() => {
    pending.delete(key)
  })

  pending.set(key, job)
  return job
}
