import { useLayoutEffect, useRef } from 'react'
import { useLocale } from '../../i18n/LocaleContext'
import { applyKayaFields } from './applyKayaFields'
import { useKayaPages } from './useKayaPages'

export function KayaBoundHtml({ html, className }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const doc = useKayaPages()
  const { locale } = useLocale()

  useLayoutEffect(() => {
    const root = ref.current
    if (!root || !doc) return
    root.innerHTML = html
    applyKayaFields(root, doc, locale)
  }, [html, doc, locale])

  return <div ref={ref} className={className} />
}
