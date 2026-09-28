import type { FinancialReportSegmentV2, FinancialReportYearDataV2 } from '../services/financialReportsFileService'

type Seg = FinancialReportSegmentV2

function seg(id: string, ko: string, en: string, percent: number, color: string): Seg {
  return { id, labels: { ko, en }, percent, color }
}

const C = {
  teal: '#2a9d8f',
  gold: '#e9c46a',
  maroon: '#8b1538',
  blue: '#457b9d',
  slate: '#6c7a89',
  orange: '#e07a3d',
  sand: '#f0d9a0',
  wine: '#5c1a2e',
} as const

/** 재정보고 도넛에 넣은 연도별 실적. 2023년 차트는 제공되지 않아 여기 없다. */
export const FINANCIAL_REPORT_CHARTS: Array<
  Pick<FinancialReportYearDataV2, 'year' | 'incomeSegments' | 'expenseSegments' | 'incomeTotalWon' | 'expenseTotalWon'>
> = [
  {
    year: 2016,
    incomeTotalWon: 59453525,
    expenseTotalWon: 59453525,
    incomeSegments: [
      seg('misc', '기타', 'Other', 0.002, C.wine),
      seg('donation', '기부금', 'Donations', 99.99, C.maroon),
    ],
    expenseSegments: [
      seg('admin', '운영관리비', 'Operating expenses', 2.46, C.gold),
      seg('programs', '사업수행비', 'Program expenses', 25.52, C.teal),
      seg('carried_next', '차기이월금', 'Carried forward', 72.02, C.maroon),
    ],
  },
  {
    year: 2017,
    incomeTotalWon: 125253956,
    expenseTotalWon: 125253956,
    incomeSegments: [
      seg('misc', '기타', 'Other', 0.01, C.wine),
      seg('subsidy', '보조금', 'Subsidies', 11.93, C.teal),
      seg('brought_forward', '전기이월금', 'Brought forward', 34.19, C.gold),
      seg('donation', '기부금', 'Donations', 53.88, C.maroon),
    ],
    expenseSegments: [
      seg('admin', '운영관리비', 'Operating expenses', 14.09, C.gold),
      seg('programs', '사업수행비', 'Program expenses', 50.44, C.teal),
      seg('carried_next', '차기이월금', 'Carried forward', 35.47, C.maroon),
    ],
  },
  {
    year: 2018,
    incomeTotalWon: 218827961,
    expenseTotalWon: 218827961,
    incomeSegments: [
      seg('misc', '기타', 'Other', 0.001, C.wine),
      seg('brought_forward', '전기이월금', 'Brought forward', 20.3, C.gold),
      seg('subsidy', '보조금', 'Subsidies', 36.03, C.teal),
      seg('donation', '기부금', 'Donations', 43.67, C.maroon),
    ],
    expenseSegments: [
      seg('admin', '운영관리비', 'Operating expenses', 13.94, C.gold),
      seg('carried_next', '차기이월금', 'Carried forward', 20.81, C.maroon),
      seg('programs', '사업수행비', 'Program expenses', 65.25, C.teal),
    ],
  },
  {
    year: 2019,
    incomeTotalWon: 244466850,
    expenseTotalWon: 244466850,
    incomeSegments: [
      seg('misc', '기타', 'Other', 0.004, C.wine),
      seg('donation', '기부금', 'Donations', 17.27, C.maroon),
      seg('brought_forward', '전기이월금', 'Brought forward', 18.62, C.gold),
      seg('subsidy', '보조금', 'Subsidies', 64.1, C.teal),
    ],
    expenseSegments: [
      seg('admin', '운영관리비', 'Operating expenses', 10.7, C.gold),
      seg('carried_next', '차기이월금', 'Carried forward', 18.35, C.maroon),
      seg('programs', '사업수행비', 'Program expenses', 70.95, C.teal),
    ],
  },
  {
    year: 2020,
    incomeTotalWon: 205374688,
    expenseTotalWon: 205374688,
    incomeSegments: [
      seg('misc', '기타', 'Other', 0.16, C.teal),
      seg('donation', '기부금', 'Donations', 19.55, C.gold),
      seg('brought_forward', '전기이월금', 'Brought forward', 21.84, C.blue),
      seg('subsidy', '보조금', 'Subsidies', 58.45, C.maroon),
    ],
    expenseSegments: [
      seg('carried_next', '차기이월금', 'Carried forward', 7.12, C.gold),
      seg('admin', '운영관리비', 'Operating expenses', 31.89, C.maroon),
      seg('programs', '사업수행비', 'Program expenses', 60.99, C.teal),
    ],
  },
  {
    year: 2021,
    incomeTotalWon: 244596090,
    expenseTotalWon: 244596090,
    incomeSegments: [
      seg('misc', '기타수입', 'Other income', 2.5, C.teal),
      seg('brought_forward', '전기이월금', 'Brought forward', 5.98, C.sand),
      seg('donation', '기부금', 'Donations', 28.27, C.maroon),
      seg('subsidy', '보조금', 'Subsidies', 63.25, C.orange),
    ],
    expenseSegments: [
      seg('fundraising', '모금비용', 'Fundraising costs', 0.73, C.sand),
      seg('carried_next', '차기이월금', 'Carried forward', 5.1, C.sand),
      seg('admin', '일반관리비', 'General administration', 22.54, C.orange),
      seg('programs', '사업수행비', 'Program expenses', 71.62, C.maroon),
    ],
  },
  {
    year: 2022,
    incomeTotalWon: 417143228,
    expenseTotalWon: 417143228,
    incomeSegments: [
      seg('misc', '기타수입', 'Other income', 0.04, C.teal),
      seg('brought_forward', '전기이월금', 'Brought forward', 2.99, C.gold),
      seg('subsidy', '보조금', 'Subsidies', 42.56, C.orange),
      seg('donation', '기부금', 'Donations', 54.41, C.maroon),
    ],
    expenseSegments: [
      seg('fundraising', '모금비용', 'Fundraising costs', 0.41, C.sand),
      seg('carried_next', '차기이월금', 'Carried forward', 5.11, C.gold),
      seg('admin', '일반관리비', 'General administration', 12.14, C.orange),
      seg('programs', '사업수행비용', 'Program expenses', 82.34, C.maroon),
    ],
  },
  {
    year: 2024,
    incomeTotalWon: 1503904484,
    expenseTotalWon: 1503904484,
    incomeSegments: [
      seg('misc', '기타수입', 'Other income', 0.02, C.teal),
      seg('brought_forward', '전기이월금', 'Brought forward', 4.04, C.blue),
      seg('donation', '기부금', 'Donations', 19.12, '#b4234a'),
      seg('subsidy', '보조금', 'Subsidies', 76.82, C.maroon),
    ],
    expenseSegments: [
      seg('fundraising', '모금비용', 'Fundraising costs', 0.08, '#c4a35a'),
      seg('carried_next', '차기이월금', 'Carried forward', 25.84, C.gold),
      seg('admin', '일반관리비', 'General administration', 6.19, C.maroon),
      seg('programs', '사업수행비용', 'Program expenses', 67.89, C.blue),
    ],
  },
  {
    year: 2025,
    incomeTotalWon: 2754856299,
    expenseTotalWon: 2754856299,
    incomeSegments: [
      seg('brought_forward', '전기이월금', 'Brought forward', 14.11, C.gold),
      seg('donation', '기부금', 'Donations', 19.51, C.blue),
      seg('misc', '기타수입', 'Other income', 25.2, C.teal),
      seg('subsidy', '보조금', 'Subsidies', 41.18, C.maroon),
    ],
    expenseSegments: [
      seg('fundraising', '모금비용', 'Fundraising costs', 0.04, C.wine),
      seg('carried_next', '차기이월금', 'Carried forward', 6.04, C.gold),
      seg('admin', '일반관리비', 'General administration', 5.39, C.maroon),
      seg('programs', '사업수행비용', 'Program expenses', 88.54, C.blue),
    ],
  },
]
