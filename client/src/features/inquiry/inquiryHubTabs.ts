/** URL ?tab= 값과 고객 문의 허브 탭 id 매핑 */
export const INQUIRY_HUB_TAB_IDS = ['faq', 'board'] as const
export type InquiryHubTabId = (typeof INQUIRY_HUB_TAB_IDS)[number]

export const INQUIRY_HUB_TABS: Array<{ id: InquiryHubTabId; label: string }> = [
  { id: 'faq', label: 'FAQ' },
  { id: 'board', label: '문의하기' },
]

/** faqPublic가 꺼져 있으면 FAQ 탭 요청도 문의하기로 둔다. */
export function parseInquiryHubTab(search: string, faqPublic = false): InquiryHubTabId {
  if (!faqPublic) return 'board'
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const raw = params.get('tab')?.toLowerCase().trim()
  if (raw === '1to1' || raw === 'inquiry' || raw === 'write' || raw === 'lookup' || raw === 'board') {
    return 'board'
  }
  if (raw && INQUIRY_HUB_TAB_IDS.includes(raw as InquiryHubTabId)) return raw as InquiryHubTabId
  return 'faq'
}
