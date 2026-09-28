import { useState } from 'react'
import { pdfCoverHref } from '../utils/pdfAttachments'

/** PDF 1페이지를 서버에서 만든 JPEG로 보여 준다. 브라우저가 PDF 전체를 받지 않는다. */
export function PdfFirstPagePreview({
  url,
  className,
}: {
  url: string
  className?: string
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const src = pdfCoverHref(url)
  if (!src || failedUrl === url) return null
  return (
    <img
      className={className}
      src={src}
      alt=""
      decoding="async"
      loading="lazy"
      onError={() => setFailedUrl(url)}
    />
  )
}
