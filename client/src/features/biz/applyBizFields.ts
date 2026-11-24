import type { Locale } from '../../i18n/locale'
import { fieldsForLocale } from '../content/fieldText'
import type { BizSupportDocument } from './bizSupportTypes'
import { rankedSupportSections } from './supportSections'
import { donateHref } from './useBizSupport'
import { fillTextWithBreaks, normalizeHtmlBreaks } from '../../utils/lineBreaks'
import { isExternalHref, normalizeHref } from '../../utils/hrefs'

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
    // Missing section must not jump to the front (empty slots used to sort as order 0)
    return (left?.order ?? 999) - (right?.order ?? 999)
  })
  for (const el of sorted) {
    const row = sectionOf(doc, el.getAttribute('data-item') || el.getAttribute('data-sec'))
    if (row) el.hidden = !row.enabled
    parent.appendChild(el)
  }
}

export function applyBizFields(root: HTMLElement, doc: BizSupportDocument, accounts: string, locale: Locale = 'ko') {
  const shown = fieldsForLocale(doc.fields, locale)
  root.querySelectorAll<HTMLElement>('[data-k]').forEach((el) => {
    const key = el.getAttribute('data-k')
    if (!key || !(key in shown)) return
    const value = shown[key] ?? ''
    const mode = el.getAttribute('data-k-mode') || 'text'
    if (mode === 'src') {
      if (value && el instanceof HTMLImageElement) el.src = value
    } else if (mode === 'html') {
      el.innerHTML = normalizeHtmlBreaks(value)
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
    } else if (mode === 'lines') {
      const lines = value
        .split(/\n/)
        .map((line) => line.trim())
        .filter(Boolean)
      if (!lines.length) return
      el.replaceChildren(
        ...lines.map((line) => {
          const item = document.createElement('li')
          item.textContent = line
          return item
        }),
      )
    } else {
      fillTextWithBreaks(el, value)
    }
    if (el.classList.contains('sup-rec')) {
      const muted = el.getAttribute('data-k-badge') === 'muted' || /소액/.test(value)
      el.classList.toggle('sup-rec--muted', muted)
      el.hidden = !value.trim()
    }
    const altKey = el.getAttribute('data-k-alt')
    if (altKey && shown[altKey] && el instanceof HTMLImageElement) el.alt = shown[altKey]
  })

  ;(['data-aca', 'data-cnc'] as const).forEach((attr) => {
    const prefix = attr === 'data-aca' ? 'aca' : 'cnc'
    root.querySelectorAll<HTMLElement>(`[${attr}]`).forEach((section) => {
      const id = section.getAttribute(attr)
      if (!id) return
      const image = section.querySelector<HTMLImageElement>(':scope > .aca-replace')
      const src = shown[`${prefix}.${id}.image`]?.trim() ?? ''
      const replace = shown[`${prefix}.${id}.mode`] === 'image' && src
      if (replace) {
        const img = image ?? document.createElement('img')
        img.className = 'aca-replace'
        img.src = src
        img.alt = ''
        if (!image) section.appendChild(img)
        ;[...section.children].forEach((child) => {
          if (child !== img) (child as HTMLElement).hidden = true
        })
        return
      }
      image?.remove()
      ;[...section.children].forEach((child) => {
        ;(child as HTMLElement).hidden = false
      })
    })
  })
  root.querySelectorAll<HTMLElement>('.sbiz-fact').forEach((row) => {
    const value = row.querySelector('dd')?.textContent?.trim() ?? ''
    row.hidden = !value
  })
  root.querySelectorAll<HTMLElement>('.sbiz-cell').forEach((cell) => {
    cell.hidden = !(cell.textContent ?? '').trim()
  })
  root.querySelectorAll<HTMLElement>('.sbiz-photos--3 .sbiz-photo').forEach((figure) => {
    figure.hidden = !(figure.querySelector('figcaption')?.textContent ?? '').trim()
  })
  root.querySelectorAll<HTMLElement>('.sbiz-step').forEach((step) => {
    const title = step.querySelector('strong')?.textContent?.trim() ?? ''
    const body = step.querySelector('span')?.textContent?.trim() ?? ''
    step.hidden = !title && !body
  })
  root.querySelectorAll<HTMLElement>('.sbiz-note').forEach((note) => {
    note.hidden = !(note.textContent ?? '').trim() || shown['cnc.noteOn'] === '0'
  })

  root.querySelectorAll<HTMLElement>('.dom-pr, .dedu-row').forEach((el) => {
    const title = el.querySelector('h3')?.textContent?.trim() ?? ''
    if (!title) {
      el.remove()
      return
    }
    el.hidden = false
  })
  root.querySelectorAll<HTMLElement>('.voln-steps > div').forEach((el) => {
    const name = el.querySelector('span')?.textContent?.trim() ?? ''
    el.hidden = !name
  })

  const socialHrefKeys = new Set(['aca.facebook', 'aca.instagram', 'aca.tiktok', 'cnc.instagram', 'cnc.store', 'cnc.kakao'])
  root.querySelectorAll<HTMLAnchorElement>('[data-k-href]').forEach((el) => {
    const key = el.getAttribute('data-k-href')
    if (!key) return
    const href = normalizeHref(shown[key] ?? '')
    if (!href || href === '#') {
      if (socialHrefKeys.has(key)) {
        el.hidden = true
        return
      }
      if (!(key in shown)) return
      if (el.classList.contains('sbiz-btn')) {
        el.hidden = false
        return
      }
      el.hidden = true
      return
    }
    el.hidden = false
    el.href = href
    if (socialHrefKeys.has(key) || isExternalHref(href)) {
      el.target = '_blank'
      el.rel = 'noopener'
    } else {
      el.removeAttribute('target')
      el.removeAttribute('rel')
    }
  })

  const url = donateHref(doc)
  root.querySelectorAll<HTMLAnchorElement>('a[href*="ihappynanum.com"]').forEach((el) => {
    el.href = url
    if (doc.donate.openBlank === false) {
      el.removeAttribute('target')
      el.removeAttribute('rel')
    } else {
      el.target = '_blank'
      el.rel = 'noopener'
    }
  })
  root.querySelectorAll<HTMLElement>('[data-k="donate.label"]').forEach((el) => {
    if (doc.donate.labelKo) el.textContent = doc.donate.labelKo
  })
  const receiptRaw = doc.donate.receiptNote?.trim() ?? ''
  const receiptNote =
    receiptRaw ===
    '카야인터내셔널이 발급합니다. 신청 시 주민등록번호를 입력하시면 연말정산 간소화 서비스에서 바로 확인하실 수 있습니다.'
      ? ''
      : receiptRaw
  root.querySelectorAll<HTMLElement>('[data-k="donate.receiptNote"]').forEach((el) => {
    el.textContent = receiptNote
    el.hidden = !receiptNote
  })

  const where = root.querySelector<HTMLElement>('[data-sec="guide.where"]')
  if (where) {
    const title = where.querySelector<HTMLElement>('.sup-h2')
    const size = shown['guide.whereSize'] || 'md'
    const color = shown['guide.whereColor'] || 'burgundy'
    const bg = shown['guide.whereBg'] || 'beige'
    where.classList.toggle('sup-band--white', bg === 'white')
    if (title) {
      title.style.fontSize = size === 'lg' ? '2rem' : size === 'sm' ? '1.35rem' : ''
      title.style.color = color === 'ink' ? '#b11e3b' : color === 'gray' ? '#4b5563' : ''
    }
  }

  const ICONS: Record<string, string> = {
    house: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"></path><path d="M5 10v10h14V10"></path><path d="M10 20v-5h4v5"></path></svg>',
    book: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h6a2 2 0 012 2v12a2 2 0 00-2-2H4z"></path><path d="M20 5h-6a2 2 0 00-2 2v12a2 2 0 012-2h6z"></path></svg>',
    heart: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.6-7 10-7 10z"></path></svg>',
    person: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B11E3B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"></circle><path d="M5 20a7 7 0 0114 0"></path></svg>',
  }
  syncGuideSideItems(root, shown, ICONS)

  root.querySelectorAll<HTMLElement>('[data-icon]').forEach((el) => {
    const key = el.getAttribute('data-icon')
    if (!key) return
    const icon = shown[key] || 'house'
    if (ICONS[icon]) el.innerHTML = ICONS[icon]
  })
  const impactTitle = doc.donate.impactTitle?.trim()
  if (impactTitle) {
    const el = root.querySelector<HTMLElement>('#sup-impact, [data-sec="guide.impact"] .sup-h2')
    if (el) el.textContent = impactTitle
  }

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
  root.querySelectorAll<HTMLElement>('.sup--guide, .sup--method').forEach((page) => layoutSupport(page, doc))

  const methodAccounts = shown['method.accounts']?.trim() ?? ''
  const source = methodAccounts || accounts
  const grid = root.querySelector('.sup-account-grid')
  if (!grid || !source.trim()) return
  const lines = source
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('예금주'))
  if (!lines.length) return
  grid.innerHTML = lines
    .map((line) => {
      const tabbed = line.includes('\t')
      const bank = tabbed ? line.split('\t')[0] : line.split(/\s+/)[0] ?? ''
      const number = tabbed ? line.split('\t').slice(1).join('\t') : line.split(/\s+/).slice(1).join(' ')
      return `<div class="sup-account"><b>${bank.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</b><span>${number.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span></div>`
    })
    .join('')
}

/** Empty guide side cards are removed from the DOM (not merely hidden). */
function syncGuideSideItems(root: HTMLElement, shown: Record<string, string>, icons: Record<string, string>) {
  const side = root.querySelector('.sup-side')
  if (!side) return
  for (let index = 0; index < 4; index += 1) {
    const id = `guide.item.${index}`
    const title = shown[`${id}.title`]?.trim() ?? ''
    const body = shown[`${id}.body`]?.trim() ?? ''
    let el = side.querySelector<HTMLElement>(`:scope > .sup-item[data-item="${id}"]`)
    if (!title && !body) {
      el?.remove()
      continue
    }
    if (!el) {
      el = document.createElement('div')
      el.className = 'sup-item'
      el.setAttribute('data-item', id)
      el.innerHTML = `<span class="sup-ico" data-icon="${id}.icon" aria-hidden="true"></span><div><h3 data-k="${id}.title"></h3><p data-k="${id}.body"></p></div>`
      side.appendChild(el)
    }
    el.hidden = false
    el.removeAttribute('hidden')
    const titleEl = el.querySelector<HTMLElement>('h3')
    const bodyEl = el.querySelector<HTMLElement>('p')
    if (titleEl) titleEl.textContent = title
    if (bodyEl) bodyEl.textContent = body
    const iconKey = shown[`${id}.icon`] || (['house', 'book', 'heart', 'person'][index] ?? 'house')
    const ico = el.querySelector<HTMLElement>('.sup-ico')
    if (ico && icons[iconKey]) ico.innerHTML = icons[iconKey]
  }
}

function layoutSupport(root: HTMLElement, doc: BizSupportDocument) {
  const page = root.classList.contains('sup--guide') ? 'guide' : root.classList.contains('sup--method') ? 'method' : null
  if (!page) return
  const ranked = rankedSupportSections(page, doc.sections)
  if (page === 'method') {
    const pay = root.querySelector<HTMLElement>('[data-sec="method.pay"]')
    const account = root.querySelector<HTMLElement>('[data-sec="method.account"]')
    const wrap = pay?.querySelector('.sup-wrap')
    const nest = ranked.findIndex((row) => row.id === 'method.account') === ranked.findIndex((row) => row.id === 'method.pay') + 1
    if (account && wrap) {
      if (nest && account.parentElement !== wrap) wrap.appendChild(account)
      if (!nest && account.parentElement !== root) root.appendChild(account)
    }
  }
  ranked.forEach((row, index) => {
    const el = root.querySelector<HTMLElement>(`[data-sec="${row.id}"]`)
    if (!el) return
    if (el.parentElement === root) el.style.order = String(index + 1)
    el.hidden = !row.enabled
  })
  const impact = root.querySelector<HTMLElement>('[data-sec="guide.impact"]')
  if (impact) impact.hidden = impact.hidden || !doc.donate.impactEnabled
}
