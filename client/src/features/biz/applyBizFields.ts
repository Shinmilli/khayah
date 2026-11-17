import type { BizSupportDocument } from './bizSupportTypes'
import { donateHref } from './useBizSupport'

function sectionOf(doc: BizSupportDocument, id: string | null) {
  if (!id) return undefined
  return doc.sections.find((row) => row.id === id)
}

function reorder(parent: Element, selector: string, doc: BizSupportDocument) {
  const items = [...parent.querySelectorAll<HTMLElement>(selector)]
  if (items.length < 2) {
    for (const el of items) {
      const row = sectionOf(doc, el.getAttribute('data-item') || el.getAttribute('data-sec'))
      if (!row) continue
      el.hidden = !row.enabled
    }
    return
  }
  const sorted = items.slice().sort((a, b) => {
    const left = sectionOf(doc, a.getAttribute('data-item') || a.getAttribute('data-sec'))
    const right = sectionOf(doc, b.getAttribute('data-item') || b.getAttribute('data-sec'))
    return (left?.order ?? 0) - (right?.order ?? 0)
  })
  for (const el of sorted) {
    const row = sectionOf(doc, el.getAttribute('data-item') || el.getAttribute('data-sec'))
    if (row) el.hidden = !row.enabled
    parent.appendChild(el)
  }
}

export function applyBizFields(root: HTMLElement, doc: BizSupportDocument, accounts: string) {
  root.querySelectorAll<HTMLElement>('[data-k]').forEach((el) => {
    const key = el.getAttribute('data-k')
    if (!key || !(key in doc.fields)) return
    const value = doc.fields[key] ?? ''
    const mode = el.getAttribute('data-k-mode') || 'text'
    if (mode === 'src') {
      if (value && el instanceof HTMLImageElement) el.src = value
    } else if (mode === 'html') {
      el.innerHTML = value
    } else if (mode === 'chips') {
      const source = (value || el.textContent || '').trim()
      if (!source) return
      el.replaceChildren(
        ...source
          .split(/\s+·\s+/)
          .map((part) => part.trim())
          .filter(Boolean)
          .map((label) => {
            const span = document.createElement('span')
            span.textContent = label
            return span
          }),
      )
    } else {
      el.textContent = value
    }
    const altKey = el.getAttribute('data-k-alt')
    if (altKey && doc.fields[altKey] && el instanceof HTMLImageElement) el.alt = doc.fields[altKey]
  })

  root.querySelectorAll<HTMLAnchorElement>('[data-k-href]').forEach((el) => {
    const key = el.getAttribute('data-k-href')
    const href = key ? (doc.fields[key] ?? '').trim() : ''
    if (!href || href === '#') {
      el.hidden = true
      return
    }
    el.hidden = false
    el.href = href
  })

  const url = donateHref(doc)
  root.querySelectorAll<HTMLAnchorElement>('a[href*="ihappynanum.com"]').forEach((el) => {
    el.href = url
  })
  root.querySelectorAll<HTMLElement>('[data-k="donate.label"]').forEach((el) => {
    if (doc.donate.labelKo) el.textContent = doc.donate.labelKo
  })

  const parents = new Set<Element>()
  root.querySelectorAll('[data-item]').forEach((el) => {
    if (el.parentElement) parents.add(el.parentElement)
  })
  parents.forEach((parent) => reorder(parent, ':scope > [data-item]', doc))

  const secParents = new Set<Element>()
  root.querySelectorAll('[data-sec]').forEach((el) => {
    if (el.parentElement) secParents.add(el.parentElement)
  })
  secParents.forEach((parent) => reorder(parent, ':scope > [data-sec]', doc))
  const impact = root.querySelector<HTMLElement>('[data-sec="guide.impact"]')
  if (impact) impact.hidden = !doc.donate.impactEnabled

  const grid = root.querySelector('.sup-account-grid')
  if (!grid || !accounts.trim()) return
  const lines = accounts
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('예금주'))
  if (!lines.length) return
  grid.innerHTML = lines
    .map((line) => {
      const parts = line.split(/\s+/)
      const bank = parts.shift() ?? ''
      const number = parts.join(' ')
      return `<div class="sup-account"><b>${bank.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</b><span>${number.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span></div>`
    })
    .join('')
  const holder = accounts.split('\n').find((line) => line.trim().startsWith('예금주'))
  const holderEl = root.querySelector('.sup-accounts .sup-head span')
  if (holder && holderEl) holderEl.textContent = holder.trim()
}
