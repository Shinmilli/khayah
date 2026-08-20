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

/** 호수 필터·비교용 (1, 1호, 01 → "1") */
export function normalizeNewsletterIssueKey(raw: string | undefined): string {
  const t = (raw ?? '').replace(/\([^)]*\)/g, '').trim()
  if (!t) return ''
  const digits = t.replace(/\D/g, '')
  return digits || t
}

/** 글 메타·제목에서 호수 키 추출 (메타 우선, 없으면 제목의 "N호") */
export function newsletterIssueKeyFromPost(metaIssue: string | undefined, title: string): string {
  const fromMeta = normalizeNewsletterIssueKey(metaIssue)
  if (fromMeta) return fromMeta
  const m = title.match(/(?:^|[\s(（])(\d+)\s*호/)
  return m?.[1] ?? ''
}

/** 공개 목록·필터용 연도 (메타 → 제목 범위 → 제목 첫 연도 → 게시일) */
export function newsletterArchiveYearFromPost(metaYear: string | undefined, title: string, publishedAt: string): number {
  const spec = parseNewsletterYearSpec((metaYear ?? '').trim())
  if (spec) return newsletterListingYear(spec)

  const titleNorm = title.replace(/[–—~]/g, '-')
  const titleSpec = parseNewsletterYearSpec(titleNorm.match(/\d{4}\s*-\s*\d{4}/)?.[0] ?? '')
  if (titleSpec) return newsletterListingYear(titleSpec)

  const titleYear = titleNorm.match(/(19|20)\d{2}/)
  if (titleYear) return parseInt(titleYear[0], 10)

  return new Date(publishedAt).getFullYear()
}
