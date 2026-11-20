/**
 * 관리자·콘텐츠 링크 규칙:
 * - `/…` 로 시작 → 사이트 내부
 * - 그 외 → 외부 (http(s) 없으면 https:// 붙임)
 * - mailto: / tel: / #앵커 는 그대로
 *
 * `google.com`을 그대로 넣으면 브라우저가
 * `/business/social/google.com` 처럼 상대경로로 붙이므로 막음.
 */
export function normalizeHref(raw: string | null | undefined): string {
  const s = (raw ?? '').trim()
  if (!s || s === '#') return s
  if (/^(mailto:|tel:|sms:)/i.test(s)) return s
  if (s.startsWith('#')) return s
  if (s.startsWith('/')) return s
  if (/^https?:\/\//i.test(s)) return s
  if (s.startsWith('//')) return `https:${s}`
  return `https://${s.replace(/^https?:\/\/*/i, '')}`
}

/** `/`·`#` 로 시작하면 내부, 나머지는 외부 */
export function isExternalHref(raw: string | null | undefined): boolean {
  const href = normalizeHref(raw)
  if (!href || href === '#') return false
  if (href.startsWith('/') || href.startsWith('#')) return false
  return true
}
