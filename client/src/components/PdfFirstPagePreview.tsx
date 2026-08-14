import { useEffect, useRef, useState } from 'react'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

let workerReady = false
function ensurePdfWorker() {
  if (workerReady) return
  GlobalWorkerOptions.workerSrc = pdfWorker
  workerReady = true
}

export function PdfFirstPagePreview({
  url,
  className,
}: {
  url: string
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!url) return
    let cancelled = false
    setFailed(false)
    ensurePdfWorker()
    const loading = getDocument({ url, withCredentials: false })

    void (async () => {
      try {
        const doc = await loading.promise
        if (cancelled) return
        const page = await doc.getPage(1)
        const el = canvasRef.current
        const parentW = el?.parentElement?.clientWidth || 320
        const base = page.getViewport({ scale: 1 })
        const scale = Math.min(640, parentW) / base.width
        const viewport = page.getViewport({ scale })
        if (!el || cancelled) return
        const ctx = el.getContext('2d')
        if (!ctx) throw new Error('canvas')
        el.width = viewport.width
        el.height = viewport.height
        await page.render({ canvas: el, viewport }).promise
      } catch {
        if (!cancelled) setFailed(true)
      }
    })()

    return () => {
      cancelled = true
      void loading.destroy()
    }
  }, [url])

  if (failed) return null
  return <canvas ref={canvasRef} className={className} />
}
