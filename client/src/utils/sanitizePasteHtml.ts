/** 붙여넣기용: 허용 태그만 남기고 style/class 등 제거 (일반 블로그 CMS 방식) */

const ALLOWED = new Set([
  'P',
  'BR',
  'STRONG',
  'B',
  'EM',
  'I',
  'U',
  'S',
  'STRIKE',
  'A',
  'H1',
  'H2',
  'H3',
  'H4',
  'UL',
  'OL',
  'LI',
  'BLOCKQUOTE',
  'IMG',
  'HR',
])

const UNWRAP_AS_BLOCK = new Set([
  'DIV',
  'SECTION',
  'ARTICLE',
  'HEADER',
  'FOOTER',
  'MAIN',
  'ASIDE',
  'FIGURE',
  'FIGCAPTION',
  'CENTER',
  'FONT',
  'LABEL',
])

function isSafeUrl(raw: string, kind: 'href' | 'src'): boolean {
  const t = raw.trim()
  if (!t) return false
  if (kind === 'href') {
    if (t.startsWith('#') || t.startsWith('/')) return true
    try {
      const u = new URL(t, 'https://example.invalid')
      return u.protocol === 'http:' || u.protocol === 'https:' || u.protocol === 'mailto:'
    } catch {
      return false
    }
  }
  return t.startsWith('http://') || t.startsWith('https://') || t.startsWith('data:image/')
}

function plainTextToHtml(text: string): string {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim()
  if (!normalized) return ''
  return normalized
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block
        .split('\n')
        .map((l) => l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'))
        .join('<br>')
      return `<p>${lines || '<br>'}</p>`
    })
    .join('')
}

function appendSanitizedChildren(source: ParentNode, target: HTMLElement) {
  for (const child of Array.from(source.childNodes)) {
    const nodes = sanitizeNode(child)
    for (const n of nodes) target.appendChild(n)
  }
}

function sanitizeNode(node: Node): Node[] {
  if (node.nodeType === Node.COMMENT_NODE) return []

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? ''
    if (!text) return []
    return [document.createTextNode(text.replace(/\u00a0/g, ' '))]
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return []

  const el = node as HTMLElement
  const tag = el.tagName.toUpperCase()

  if (tag.includes(':') || tag === 'META' || tag === 'STYLE' || tag === 'SCRIPT' || tag === 'LINK' || tag === 'XML') {
    return []
  }

  // span/font 등: 래퍼 제거하고 자식만
  if (tag === 'SPAN' || tag === 'FONT' || tag === 'LABEL') {
    const out: Node[] = []
    for (const child of Array.from(el.childNodes)) out.push(...sanitizeNode(child))
    return out
  }

  if (UNWRAP_AS_BLOCK.has(tag)) {
    const hasBlockChild = Array.from(el.children).some((c) => {
      const t = c.tagName.toUpperCase()
      return ALLOWED.has(t) || UNWRAP_AS_BLOCK.has(t) || t.startsWith('H')
    })
    if (hasBlockChild) {
      const out: Node[] = []
      for (const child of Array.from(el.childNodes)) out.push(...sanitizeNode(child))
      return out
    }
    const p = document.createElement('p')
    appendSanitizedChildren(el, p)
    if (!p.textContent?.trim() && !p.querySelector('img,br')) return []
    return [p]
  }

  if (!ALLOWED.has(tag)) {
    const out: Node[] = []
    for (const child of Array.from(el.childNodes)) out.push(...sanitizeNode(child))
    return out
  }

  if (tag === 'BR') return [document.createElement('br')]
  if (tag === 'HR') return [document.createElement('hr')]

  if (tag === 'IMG') {
    const src = el.getAttribute('src') || ''
    if (!isSafeUrl(src, 'src')) return []
    const img = document.createElement('img')
    img.setAttribute('src', src.trim())
    const alt = el.getAttribute('alt')
    if (alt) img.setAttribute('alt', alt)
    img.style.maxWidth = '100%'
    img.style.height = 'auto'
    return [img]
  }

  const nextTag = tag === 'B' ? 'STRONG' : tag === 'I' ? 'EM' : tag === 'STRIKE' ? 'S' : tag
  const created = document.createElement(nextTag.toLowerCase())

  if (nextTag === 'A') {
    const href = el.getAttribute('href') || ''
    if (!isSafeUrl(href, 'href')) {
      const out: Node[] = []
      for (const child of Array.from(el.childNodes)) out.push(...sanitizeNode(child))
      return out
    }
    created.setAttribute('href', href.trim())
    if (el.getAttribute('target') === '_blank') {
      created.setAttribute('target', '_blank')
      created.setAttribute('rel', 'noopener noreferrer')
    }
  }

  appendSanitizedChildren(el, created)

  if (
    nextTag !== 'IMG' &&
    nextTag !== 'HR' &&
    nextTag !== 'BR' &&
    !created.textContent?.trim() &&
    !created.querySelector('img,br')
  ) {
    return []
  }

  return [created]
}

/**
 * 클립보드 HTML → 본문용 안전한 HTML
 */
export function sanitizePasteHtml(html: string, plainFallback?: string): string {
  const raw = html?.trim()
  if (!raw) return plainFallback ? plainTextToHtml(plainFallback) : ''

  const cleaned = raw
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?(?:o|w|m):[^>]*>/gi, '')

  const doc = new DOMParser().parseFromString(`<div id="paste-root">${cleaned}</div>`, 'text/html')
  const root = doc.getElementById('paste-root')
  if (!root) return plainFallback ? plainTextToHtml(plainFallback) : ''

  const holder = document.createElement('div')
  appendSanitizedChildren(root, holder)

  let out = holder.innerHTML
    .replace(/(?:<br\s*\/?>\s*){3,}/gi, '<br><br>')
    .replace(/&nbsp;/gi, ' ')
    .trim()

  // 블록 없이 텍스트만 있으면 p로 감싸기
  if (out && !/^<(p|h[1-4]|ul|ol|blockquote|hr)\b/i.test(out)) {
    out = `<p>${out}</p>`
  }

  if (out) return out
  return plainFallback ? plainTextToHtml(plainFallback) : ''
}

export function sanitizePlainTextPaste(text: string): string {
  return plainTextToHtml(text)
}
