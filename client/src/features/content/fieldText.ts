import type { Locale } from '../../i18n/locale'

/** 영어 값은 `키.en`에 있다. 비어 있으면 한국어 값을 쓴다. */
export function fieldText(fields: Record<string, string>, key: string, locale: Locale): string {
  if (locale === 'en') {
    const en = fields[`${key}.en`]?.trim()
    if (en) return fields[`${key}.en`] ?? en
  }
  return fields[key] ?? ''
}

/** 표시용 필드. 영어 키가 있으면 같은 기본 키 위에 덮어 디자인 템플릿이 그대로 읽게 한다. */
export function fieldsForLocale(fields: Record<string, string>, locale: Locale): Record<string, string> {
  if (locale !== 'en') return fields
  const next = { ...fields }
  for (const [key, value] of Object.entries(fields)) {
    if (!key.endsWith('.en') || !value.trim()) continue
    next[key.slice(0, -3)] = value
  }
  return next
}
