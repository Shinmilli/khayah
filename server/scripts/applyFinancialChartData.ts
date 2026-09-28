import 'dotenv/config'
import { FINANCIAL_REPORT_CHARTS } from '../src/data/financialReportCharts'
import {
  readFinancialReportsDocument,
  writeFinancialReportsDocument,
  type FinancialReportYearDataV2,
} from '../src/services/financialReportsFileService'
import { prisma } from '../src/utils/prisma'

async function main() {
  const doc = await readFinancialReportsDocument()
  const byYear = new Map(doc.reports.map((report) => [report.year, report]))

  for (const chart of FINANCIAL_REPORT_CHARTS) {
    const prev = byYear.get(chart.year)
    const next: FinancialReportYearDataV2 = {
      year: chart.year,
      incomeSegments: chart.incomeSegments,
      expenseSegments: chart.expenseSegments,
      incomeTotalWon: chart.incomeTotalWon,
      expenseTotalWon: chart.expenseTotalWon,
      balanceSheetImageUrl: prev?.balanceSheetImageUrl ?? null,
      operationsStatementImageUrl: prev?.operationsStatementImageUrl ?? null,
      donationDisclosurePdfUrl: prev?.donationDisclosurePdfUrl ?? null,
      publicInterestDisclosurePdfUrl: prev?.publicInterestDisclosurePdfUrl ?? null,
    }
    byYear.set(chart.year, next)
  }

  const reports = [...byYear.values()].sort((a, b) => b.year - a.year)
  await writeFinancialReportsDocument({ ...doc, reports })
  console.log(
    'saved years:',
    reports.map((report) => report.year).join(', '),
  )
}

main()
  .catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma?.$disconnect?.()
  })
