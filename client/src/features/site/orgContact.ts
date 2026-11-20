/** Parse site-common `org.phoneFax` (supports legacy `T … | F …` and plain values). */
export function parsePhoneFax(raw: string | undefined): { phone: string; fax: string } {
  const text = (raw || '').trim()
  if (!text) return { phone: '', fax: '' }

  const stripLabel = (value: string) => value.replace(/^[TFE]\s+/i, '').trim()

  if (text.includes('|')) {
    const [left = '', right = ''] = text.split('|').map((part) => part.trim())
    return { phone: stripLabel(left), fax: stripLabel(right) }
  }

  const phoneMatch = text.match(/(?:^|\b)T\s+(.+?)(?=\s+F\b|$)/i)
  const faxMatch = text.match(/\bF\s+(.+)$/i)
  if (phoneMatch || faxMatch) {
    return {
      phone: stripLabel(phoneMatch?.[1] || ''),
      fax: stripLabel(faxMatch?.[1] || ''),
    }
  }

  return { phone: stripLabel(text), fax: '' }
}

export function formatPhoneFax(phone: string, fax: string): string {
  const nextPhone = phone.trim()
  const nextFax = fax.trim()
  if (nextPhone && nextFax) return `${nextPhone} | ${nextFax}`
  return nextPhone || nextFax
}

export function cleanEmail(raw: string | undefined): string {
  return (raw || '').replace(/^E\s+/i, '').trim()
}

export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '')
  return digits ? `tel:${digits}` : ''
}

export function mailtoHref(email: string): string {
  const value = cleanEmail(email)
  return value ? `mailto:${value}` : ''
}
