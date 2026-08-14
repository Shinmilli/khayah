export type NewsletterYearSpec = { start: number; end: number }

/** `2026` 또는 `2017-2020` (하이픈·엔대시 허용) */
export function parseNewsletterYearSpec(raw: string): NewsletterYearSpec | null {
  const t = raw.trim().replace(/[–—~]/g, '-')
  const m = t.match(/^(19|20)\d{2}(?:\s*-\s*((?:19|20)\d{2}))?$/)
  if (!m) return null
  const start = parseInt(t.slice(0, 4), 10)
  const dash = t.indexOf('-')
  const end = dash >= 0 ? parseInt(t.slice(dash + 1).trim(), 10) : start
  if (!Number.isFinite(start) || !Number.isFinite(end)) return null
  return start <= end ? { start, end } : { start: end, end: start }
}

export function formatNewsletterYearMeta(start: number, end: number): string {
  return start === end ? String(start) : `${start}-${end}`
}

/** 아카이브 연도 탭: 범위면 종료 연도에만 한 번 노출 */
export function newsletterListingYear(spec: NewsletterYearSpec): number {
  return spec.end
}

export function newsletterYearLabel(spec: NewsletterYearSpec): string {
  return spec.start === spec.end ? String(spec.start) : `${spec.start}–${spec.end}`
}
