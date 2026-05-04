import type { FinancialReportSegment, FinancialReportYearData } from './financialReportTypes'

/** 관리자에서 기본으로 채울 수 있는 수입 항목 템플릿 (이름·비율은 편집·추가·삭제 가능) */
export const DEFAULT_INCOME_SEGMENTS: FinancialReportSegment[] = [
  { id: 'misc', label: '기타수입', percent: 0.12, color: '#2a9d8f' },
  { id: 'brought_forward', label: '전기이월금', percent: 4.63, color: '#e9c46a' },
  { id: 'subsidy', label: '보조금', percent: 23.36, color: '#6c7a89' },
  { id: 'donation', label: '기부금', percent: 71.89, color: '#8b1538' },
]

/** 지출 기본 항목 */
export const DEFAULT_EXPENSE_SEGMENTS: FinancialReportSegment[] = [
  { id: 'fundraising', label: '모금비용', percent: 0.31, color: '#2a9d8f' },
  { id: 'carried_next', label: '차기이월금', percent: 13.18, color: '#e9c46a' },
  { id: 'admin', label: '일반관리비', percent: 9.21, color: '#8b1538' },
  { id: 'programs', label: '사업수행비용', percent: 77.3, color: '#457b9d' },
]

const MOCK_TOTAL = 460_659_841

export const MOCK_FINANCIAL_REPORTS: FinancialReportYearData[] = [
  {
    year: 2023,
    incomeSegments: DEFAULT_INCOME_SEGMENTS,
    expenseSegments: DEFAULT_EXPENSE_SEGMENTS,
    incomeTotalWon: MOCK_TOTAL,
    expenseTotalWon: MOCK_TOTAL,
    balanceSheetImageUrl: null,
    operationsStatementImageUrl: null,
    donationDisclosurePdfUrl: null,
  },
  {
    year: 2022,
    incomeSegments: [
      { id: 'misc', label: '기타수입', percent: 0.2, color: '#2a9d8f' },
      { id: 'brought_forward', label: '전기이월금', percent: 5.1, color: '#e9c46a' },
      { id: 'subsidy', label: '보조금', percent: 22.0, color: '#6c7a89' },
      { id: 'donation', label: '기부금', percent: 72.7, color: '#8b1538' },
    ],
    expenseSegments: [
      { id: 'fundraising', label: '모금비용', percent: 0.4, color: '#2a9d8f' },
      { id: 'carried_next', label: '차기이월금', percent: 12.5, color: '#e9c46a' },
      { id: 'admin', label: '일반관리비', percent: 10.0, color: '#8b1538' },
      { id: 'programs', label: '사업수행비용', percent: 77.1, color: '#457b9d' },
    ],
    incomeTotalWon: 412_000_000,
    expenseTotalWon: 412_000_000,
    balanceSheetImageUrl: null,
    operationsStatementImageUrl: null,
    donationDisclosurePdfUrl: null,
  },
]

export function formatWon(n: number): string {
  return `${n.toLocaleString('ko-KR')}원`
}
