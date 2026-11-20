/** Show `<br>` / newlines as real line breaks in admin textareas. Keeps other tags. */
export function plainFromBreaks(value: string): string {
  return String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
}

/** Strip tags after converting breaks — for plain-looking admin fields. */
export function plainTextFromBreaks(value: string): string {
  return plainFromBreaks(value).replace(/<[^>]+>/g, '')
}

/** Store Enter line breaks as `<br>` for HTML fields. */
export function breaksToHtml(value: string): string {
  return plainFromBreaks(value).split('\n').join('<br>')
}

/** Normalize HTML so bare newlines also become `<br>`. Keeps other tags. */
export function normalizeHtmlBreaks(value: string): string {
  return String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .split('\n')
    .join('<br>')
}

/** Fill an element with plain text, preserving Enter line breaks safely. */
export function fillTextWithBreaks(el: HTMLElement, value: string): void {
  const text = plainFromBreaks(value)
  if (!text.includes('\n')) {
    el.textContent = text
    return
  }
  el.replaceChildren()
  text.split('\n').forEach((line, index) => {
    if (index > 0) el.appendChild(document.createElement('br'))
    el.appendChild(document.createTextNode(line))
  })
}
