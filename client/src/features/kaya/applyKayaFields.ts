import type { KayaMember, KayaPagesDocument } from './kayaPagesTypes'
import { greetSectionOrder } from './kayaSectionOrder'

function esc(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function memberCell(row: KayaMember): string {
  return `<div class="khayah-board-cell" role="listitem"><div class="khayah-board-name"><span>${esc(row.badge)}</span> ${esc(row.name)}</div><div class="khayah-board-role">${esc(row.role)}</div></div>`
}

export function applyKayaFields(root: HTMLElement, doc: KayaPagesDocument) {
  root.querySelectorAll<HTMLElement>('[data-k]').forEach((el) => {
    const key = el.getAttribute('data-k')
    if (!key || !(key in doc.fields)) return
    const value = doc.fields[key] ?? ''
    const mode = el.getAttribute('data-k-mode') || 'text'
    if (mode === 'src') {
      if (value && el instanceof HTMLImageElement) el.src = value
    } else if (mode === 'html') {
      const html =
        key === 'greet.quote'
          ? value
              .replace(/<span[^>]*(?:quote-mark|closing__mark)[^>]*>[\s\S]*?<\/span>/gi, '')
              .replace(/&(?:[lr]dquo|#822[01]|#x201[cd]);/gi, '')
              .replace(/[“”„‟「」]/g, '')
              .trim()
          : value
      el.innerHTML = html
    } else if (mode === 'tel' || mode === 'mail') {
      el.textContent = value
      if (el instanceof HTMLAnchorElement) {
        el.href = mode === 'tel' ? `tel:${value.replace(/[^\d+]/g, '')}` : `mailto:${value}`
      }
    } else {
      el.textContent = value
    }
    const altKey = el.getAttribute('data-k-alt')
    if (altKey && altKey in doc.fields && el instanceof HTMLImageElement && doc.fields[altKey]) {
      el.alt = doc.fields[altKey]
    }
  })

  const groups: Array<['directors' | 'experts', KayaMember['group']]> = [
    ['directors', '이사회'],
    ['experts', '전문위원회'],
  ]
  for (const [slot, group] of groups) {
    const grid = root.querySelector(`[data-org="${slot}"]`)
    if (!grid) continue
    const rows = doc.members
      .filter((row) => row.group === group && row.enabled && row.name.trim())
      .sort((a, b) => a.order - b.order)
    grid.innerHTML = rows.map(memberCell).join('')
  }

  const intro = root.querySelector<HTMLElement>('.kaya-intro')
  if (intro) {
    intro.classList.toggle('kaya-intro--gray', doc.fields['intro.bg'] === 'gray')
    intro.classList.toggle('kaya-intro--center', doc.fields['intro.align'] === 'center')
    intro.classList.toggle('kaya-intro--photo-left', doc.fields['intro.photoSide'] === 'left')
    const photo = intro.querySelector<HTMLElement>('.kaya-intro__photo')
    const hidePhoto = doc.fields['intro.photoSide'] === 'none' || !doc.fields['intro.photo']?.trim()
    if (photo) photo.hidden = hidePhoto
  }
  const chips = [...root.querySelectorAll<HTMLElement>('.kaya-chips .kaya-chip')]
  chips.forEach((chip) => {
    const keep = Boolean(chip.textContent?.trim())
    chip.classList.remove('kaya-chip--on')
    if (!keep) {
      chip.remove()
      return
    }
    chip.hidden = false
  })
  root.querySelector<HTMLElement>('.kaya-chips .kaya-chip')?.classList.add('kaya-chip--on')
  let shown = 0
  ;[...root.querySelectorAll<HTMLElement>('.kaya-id')].forEach((article) => {
    const point = article.querySelector<HTMLElement>('.kaya-id__point')
    if (point) point.hidden = !point.textContent?.trim()
    const name = article.querySelector('h3')?.textContent?.trim() ?? ''
    const body = article.querySelector('p:not(.kaya-id__en):not(.kaya-id__point)')?.textContent?.trim() ?? ''
    const keep = Boolean(name || body || point?.textContent?.trim())
    if (!keep) {
      article.remove()
      return
    }
    article.hidden = false
    shown += 1
    const no = article.querySelector('.kaya-id__no')
    if (no) no.textContent = String(shown).padStart(2, '0')
  })

  root.querySelectorAll<HTMLIFrameElement>('iframe[data-k-map]').forEach((frame) => {
    const key = frame.getAttribute('data-k-map')
    const address = key ? doc.fields[key] : ''
    if (!address) return
    frame.src = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&hl=ko&z=17&output=embed`
  })

  const greeting = root.querySelector<HTMLElement>('.greeting-modern')
  if (greeting) {
    const on = (id: string) => doc.fields[`greet.${id}On`] !== '0'
    const profile = greeting.querySelector<HTMLElement>('.gm-hero')
    const quote = greeting.querySelector<HTMLElement>('.gm-band')
    const body = greeting.querySelector<HTMLElement>('.article')
    const close = greeting.querySelector<HTMLElement>('.gm-closing')
    if (profile) profile.hidden = !on('profile')
    if (quote) quote.hidden = !on('quote')
    if (body) body.hidden = !on('body')
    if (close) close.hidden = !on('close')
    if (quote && body) {
      const first = greetSectionOrder(doc.fields['greet.sectionOrder'])[0]
      greeting.insertBefore(first === 'body' ? body : quote, first === 'body' ? quote : body)
    }
  }
}

