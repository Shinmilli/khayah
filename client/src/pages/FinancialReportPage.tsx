import { useEffect, useMemo, useState } from 'react'
import { PageHero } from '../components/PageHero'
import { FinancialDonutChart } from '../features/financial-report/FinancialDonutChart'
import { formatWon, MOCK_FINANCIAL_REPORTS } from '../features/financial-report/financialReportMockData'
import '../styles/financial-report.css'

const HOMETAX_DISCLOSURE_URL =
  'https://hometax.go.kr/ui/pp/agitx_index.html?isCdn=Y&ST1BOX=1&ND2BOX=1&RD3BOX=1'
const ACRC_URL = 'https://www.acrc.go.kr/'

function ArrowCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
      <path d="M10 8l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function FinancialReportPage() {
  const years = useMemo(
    () => [...new Set(MOCK_FINANCIAL_REPORTS.map((r) => r.year))].sort((a, b) => b - a),
    [],
  )
  const [year, setYear] = useState(years[0] ?? 2023)
  const [pdfModalOpen, setPdfModalOpen] = useState(false)

  const report = MOCK_FINANCIAL_REPORTS.find((r) => r.year === year) ?? MOCK_FINANCIAL_REPORTS[0]

  useEffect(() => {
    document.title = `${report.year} 재정보고 | 사단법인 카야 인터내셔널`
    return () => {
      document.title = '사단법인 카야 인터내셔널 | 개발NGO'
    }
  }, [report.year])

  useEffect(() => {
    if (!pdfModalOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPdfModalOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pdfModalOpen])

  const onDonationDisclosureClick = () => {
    if (report.donationDisclosurePdfUrl) {
      window.open(report.donationDisclosurePdfUrl, '_blank', 'noopener,noreferrer')
      return
    }
    setPdfModalOpen(true)
  }

  return (
    <div className="financial-report-page">
      <PageHero title={`${report.year} 재정보고`} showScrollHint={false} />

      <div className="financial-report__inner">
        <div className="financial-report__year-row">
          <span className="financial-report__year-label">연도</span>
          {years.map((y) => (
            <button
              key={y}
              type="button"
              className={`financial-report__year-btn${y === year ? ' financial-report__year-btn--active' : ''}`}
              onClick={() => setYear(y)}
            >
              {y}
            </button>
          ))}
        </div>

        <div className="financial-report__charts">
          <FinancialDonutChart
            key={`fr-income-${report.year}`}
            year={report.year}
            kind="income"
            segments={report.incomeSegments}
            totalFormatted={formatWon(report.incomeTotalWon)}
          />
          <FinancialDonutChart
            key={`fr-expense-${report.year}`}
            year={report.year}
            kind="expense"
            segments={report.expenseSegments}
            totalFormatted={formatWon(report.expenseTotalWon)}
          />
        </div>

        <div className="financial-report__tables">
          <div className="financial-report__table-card">
            <div className="financial-report__table-head">{report.year}년 재무상태표</div>
            {report.balanceSheetImageUrl ? (
              <img src={report.balanceSheetImageUrl} alt={`${report.year}년 재무상태표`} />
            ) : (
              <div className="financial-report__table-placeholder">
                재무상태표 이미지 영역
                <span style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#999' }}>
                  관리자 페이지에서 이미지 URL을 등록하면 표시됩니다.
                </span>
              </div>
            )}
          </div>
          <div className="financial-report__table-card">
            <div className="financial-report__table-head">{report.year}년 운영성과표</div>
            {report.operationsStatementImageUrl ? (
              <img src={report.operationsStatementImageUrl} alt={`${report.year}년 운영성과표`} />
            ) : (
              <div className="financial-report__table-placeholder">
                운영성과표 이미지 영역
                <span style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#999' }}>
                  관리자 페이지에서 이미지 URL을 등록하면 표시됩니다.
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="financial-report__actions">
          <a
            className="financial-report__action financial-report__action--teal"
            href={HOMETAX_DISCLOSURE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>공익법인 결산서류 등 공시</span>
            <span className="financial-report__action-icon" aria-hidden="true">
              <ArrowCircleIcon />
            </span>
          </a>
          <button
            type="button"
            className="financial-report__action financial-report__action--yellow"
            onClick={onDonationDisclosureClick}
          >
            <span>기부금 모금액 및 활용 실적 공시</span>
            <span className="financial-report__action-icon" aria-hidden="true">
              <ArrowCircleIcon />
            </span>
          </button>
          <a
            className="financial-report__action financial-report__action--burgundy"
            href={ACRC_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>
              공공위반사항 제보
              <br />
              &quot;국민권익위원회&quot;
            </span>
            <span className="financial-report__action-icon" aria-hidden="true">
              <ArrowCircleIcon />
            </span>
          </a>
        </div>
      </div>

      {pdfModalOpen && (
        <div
          className="financial-report__modal-backdrop"
          role="presentation"
          onClick={() => setPdfModalOpen(false)}
        >
          <div
            className="financial-report__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="fr-pdf-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="fr-pdf-modal-title">기부금 공시 PDF</h2>
            <p>
              목업 단계입니다. 추후 관리자 페이지에서 업로드한 PDF 주소가 연결되면 새 창으로 열립니다.
            </p>
            <div className="financial-report__modal-actions">
              <button type="button" className="financial-report__modal-btn" onClick={() => setPdfModalOpen(false)}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
