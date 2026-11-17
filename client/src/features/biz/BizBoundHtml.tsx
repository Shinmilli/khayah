import { useEffect, useRef } from 'react'
import { applyBizFields } from './applyBizFields'
import { useBizSupport } from './useBizSupport'
import { useSiteCommon } from '../site/useSiteCommon'
import { useImpactPage } from '../impact/useImpactPage'

export function BizBoundHtml({ html, className }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const doc = useBizSupport()
  const site = useSiteCommon()
  const impact = useImpactPage()

  useEffect(() => {
    if (!ref.current || !doc) return
    applyBizFields(ref.current, doc, site?.org.accounts ?? '')
    const breaks: Record<string, string[]> = {
      'dom.p.0.body': ['발견하고,'],
      'dom.p.1.body': ['존중합니다.', '지양하고,'],
      'dom.p.2.body': ['연결합니다.', '활용되어'],
      'oedu.0.title': ['기초역량'],
      'oedu.1.title': ['미래지향'],
      'oedu.2.title': ['교육 질'],
      'vol.desc': ['이해하고', '지원합니다.'],
    }
    ref.current.querySelectorAll<HTMLElement>('[data-k]').forEach((el) => {
      const points = breaks[el.getAttribute('data-k') ?? '']
      if (!points || el.innerHTML.includes('<br')) return
      let html = el.textContent ?? ''
      for (const point of points) html = html.replace(point, `${point}<br>`)
      el.innerHTML = html
    })
    const leadTitle = ref.current.querySelector<HTMLElement>('[data-k="oedu.title"]')
    if (leadTitle && !leadTitle.querySelector('span') && (leadTitle.textContent ?? '').includes('Leading tomorrow!')) {
      leadTitle.innerHTML = leadTitle.innerHTML
        .replace(/<br\s*\/?>/gi, ' ')
        .replace('Leading tomorrow!', '<span>Leading tomorrow!</span>')
    }
    const band = ref.current.querySelector<HTMLElement>('[data-sec="guide.impact"]')
    if (band && !impact?.public) band.hidden = true
  }, [html, doc, site, impact])

  return <div ref={ref} className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
