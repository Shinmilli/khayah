import type { FinancialReportSegmentV2 } from './financialReportTypes'

/** 관리자 ‘연도 추가’ 시 채워 넣는 수입 항목 템플릿 — 비율은 기본 10·20·30·40(합계 100) */
export const DEFAULT_INCOME_SEGMENTS: FinancialReportSegmentV2[] = [
  { id: 'misc', labels: { ko: '기타수입', en: 'Other income' }, percent: 10, color: '#2a9d8f' },
  { id: 'brought_forward', labels: { ko: '전기이월금', en: 'Brought forward' }, percent: 20, color: '#e9c46a' },
  { id: 'subsidy', labels: { ko: '보조금', en: 'Subsidies' }, percent: 30, color: '#6c7a89' },
  { id: 'donation', labels: { ko: '기부금', en: 'Donations' }, percent: 40, color: '#8b1538' },
]

/** 지출 항목 템플릿 — 비율은 기본 10·20·30·40(합계 100) */
export const DEFAULT_EXPENSE_SEGMENTS: FinancialReportSegmentV2[] = [
  { id: 'fundraising', labels: { ko: '모금비용', en: 'Fundraising costs' }, percent: 10, color: '#2a9d8f' },
  { id: 'carried_next', labels: { ko: '차기이월금', en: 'Carried forward' }, percent: 20, color: '#e9c46a' },
  { id: 'admin', labels: { ko: '일반관리비', en: 'General administration' }, percent: 30, color: '#8b1538' },
  { id: 'programs', labels: { ko: '사업수행비용', en: 'Program expenses' }, percent: 40, color: '#457b9d' },
]

export function formatWon(n: number, locale: 'ko' | 'en' = 'ko'): string {
  if (locale === 'en') return `₩${n.toLocaleString('en-US')}`
  return `${n.toLocaleString('ko-KR')}원`
}
