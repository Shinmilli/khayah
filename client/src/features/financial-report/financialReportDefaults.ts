import type { FinancialReportSegment } from './financialReportTypes'

/** 관리자 ‘연도 추가’ 시 채워 넣는 수입 항목 템플릿 — 비율은 기본 10·20·30·40(합계 100) */
export const DEFAULT_INCOME_SEGMENTS: FinancialReportSegment[] = [
  { id: 'misc', label: '기타수입', percent: 10, color: '#2a9d8f' },
  { id: 'brought_forward', label: '전기이월금', percent: 20, color: '#e9c46a' },
  { id: 'subsidy', label: '보조금', percent: 30, color: '#6c7a89' },
  { id: 'donation', label: '기부금', percent: 40, color: '#8b1538' },
]

/** 지출 항목 템플릿 — 비율은 기본 10·20·30·40(합계 100) */
export const DEFAULT_EXPENSE_SEGMENTS: FinancialReportSegment[] = [
  { id: 'fundraising', label: '모금비용', percent: 10, color: '#2a9d8f' },
  { id: 'carried_next', label: '차기이월금', percent: 20, color: '#e9c46a' },
  { id: 'admin', label: '일반관리비', percent: 30, color: '#8b1538' },
  { id: 'programs', label: '사업수행비용', percent: 40, color: '#457b9d' },
]

export function formatWon(n: number): string {
  return `${n.toLocaleString('ko-KR')}원`
}
