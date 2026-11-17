import type { KayaMember, KayaPagesDocument } from './kayaPagesTypes'

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
      el.innerHTML = value
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
}
