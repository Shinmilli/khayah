/** 재정보고 — 연도별 데이터 (`GET /api/financial-reports` JSON 구조) */
export type FinancialReportSegment = {
  id: string
  label: string
  /** 0–100, 도넛 표시용 (합계 100 권장) */
  percent: number
  color: string
}

export type FinancialReportYearData = {
  year: number
  incomeSegments: FinancialReportSegment[]
  expenseSegments: FinancialReportSegment[]
  /** 표시용 총액(원) */
  incomeTotalWon: number
  expenseTotalWon: number
  /** 재무상태표 이미지 — 관리자 업로드 URL */
  balanceSheetImageUrl?: string | null
  /** 운영성과표 이미지 */
  operationsStatementImageUrl?: string | null
  /** 기부금 모금액 및 활용 실적 공시 PDF — 관리자 업로드 URL */
  donationDisclosurePdfUrl?: string | null
}

/** 공개 재정보고 페이지 — 표·버튼 영역 노출 여부(관리자에서 설정) */
export type FinancialReportPageSettings = {
  showBalanceSheet: boolean
  showOperationsStatement: boolean
  showActionButtons: boolean
}

export type FinancialReportsDocument = {
  version: 1
  settings: FinancialReportPageSettings
  reports: FinancialReportYearData[]
}
