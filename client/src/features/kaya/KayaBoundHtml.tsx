import { useLayoutEffect, useRef } from 'react'
import { applyKayaFields } from './applyKayaFields'
import { useKayaPages } from './useKayaPages'

export function KayaBoundHtml({ html, className }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const doc = useKayaPages()

  useLayoutEffect(() => {
    const root = ref.current
    if (!root || !doc) return
    root.innerHTML = html
    applyKayaFields(root, doc)
  }, [html, doc])

  return <div ref={ref} className={className} />
}
