import { useEffect, useRef } from 'react'
import { applyKayaFields } from './applyKayaFields'
import { useKayaPages } from './useKayaPages'

export function KayaBoundHtml({ html, className }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const doc = useKayaPages()

  useEffect(() => {
    if (!ref.current || !doc) return
    applyKayaFields(ref.current, doc)
  }, [html, doc])

  return <div ref={ref} className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
