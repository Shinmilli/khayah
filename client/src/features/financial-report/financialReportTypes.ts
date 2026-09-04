/** 재정보고 — 연도별 데이터 (`GET /api/financial-reports` JSON 구조) */
export type FinancialReportSegmentLabels = { ko: string; en: string }

export type FinancialReportSegmentV2 = {
  id: string
  labels: FinancialReportSegmentLabels
  percent: number
  color: string
}

/** 공개 API·차트용 — locale별 label이 풀린 형태 */
export type FinancialReportSegment = {
  id: string
  label: string
  percent: number
  color: string
}

export type FinancialReportYearDataV2 = {
  year: number
  incomeSegments: FinancialReportSegmentV2[]
  expenseSegments: FinancialReportSegmentV2[]
  incomeTotalWon: number
  expenseTotalWon: number
  balanceSheetImageUrl?: string | null
  operationsStatementImageUrl?: string | null
  donationDisclosurePdfUrl?: string | null
}

export type FinancialReportYearData = Omit<FinancialReportYearDataV2, 'incomeSegments' | 'expenseSegments'> & {
  incomeSegments: FinancialReportSegment[]
  expenseSegments: FinancialReportSegment[]
}

export type FinancialReportPageSettings = {
  showBalanceSheet: boolean
  showOperationsStatement: boolean
  showActionButtons: boolean
}

export type FinancialReportsDocument = {
  version: 2
  settings: FinancialReportPageSettings
  reports: FinancialReportYearDataV2[]
}

export type FinancialReportsPublicDocument = {
  version: 2
  settings: FinancialReportPageSettings
  reports: FinancialReportYearData[]
}

export type FinancialReportEditLocale = 'ko' | 'en'
