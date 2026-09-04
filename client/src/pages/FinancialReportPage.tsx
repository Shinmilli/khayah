import { useCallback, useEffect, useMemo, useState } from 'react'
import { PageHero } from '../components/PageHero'
import { FinancialDonutChart } from '../features/financial-report/FinancialDonutChart'
import { formatWon } from '../features/financial-report/financialReportDefaults'
import type { FinancialReportsPublicDocument } from '../features/financial-report/financialReportTypes'
import { fetchFinancialReports } from '../services/api'
import { useLocale } from '../i18n/LocaleContext'
import { pdfOpenHref } from '../utils/pdfAttachments'
import '../styles/financial-report.css'

const HOMETAX_DISCLOSURE_URL =
  'https://hometax.go.kr/ui/pp/agitx_index.html?isCdn=Y&ST1BOX=1&ND2BOX=1&RD3BOX=1'
const ACRC_URL = 'https://www.acrc.go.kr/'

const MAX_VISIBLE_YEARS = 5

function ArrowCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
      <path d="M10 8l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="20" height="20">
      <path d="M14 7l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="20" height="20">
      <path d="M10 7l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function FinancialReportPage() {
  const { locale, messages } = useLocale()
  const fr = messages.pages.financialReport
  const nav = messages.nav
  const [doc, setDoc] = useState<FinancialReportsPublicDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const d = await fetchFinancialReports(locale)
      setDoc(d)
    } catch (e) {
      setDoc(null)
      setError(e instanceof Error ? e.message : fr.loadError)
    } finally {
      setLoading(false)
    }
  }, [locale, fr.loadError])

  useEffect(() => {
    void load()
  }, [load])

  const years = useMemo(() => {
    if (!doc?.reports.length) return []
    return [...new Set(doc.reports.map((r) => r.year))].sort((a, b) => b - a)
  }, [doc])

  const [year, setYear] = useState<number | null>(null)
  useEffect(() => {
    if (year !== null && years.includes(year)) return
    if (years.length) setYear(years[0])
    else setYear(null)
  }, [years, year])

  const maxYearWindowStart = Math.max(0, years.length - MAX_VISIBLE_YEARS)
  const [yearWindowStart, setYearWindowStart] = useState(0)

  useEffect(() => {
    if (years.length <= MAX_VISIBLE_YEARS) {
      setYearWindowStart(0)
      return
    }
    const yi = year !== null ? years.indexOf(year) : -1
    if (yi < 0) return
    setYearWindowStart((prev) => {
      let next = prev
      if (yi < next) next = yi
      if (yi >= next + MAX_VISIBLE_YEARS) next = yi - MAX_VISIBLE_YEARS + 1
      return Math.max(0, Math.min(maxYearWindowStart, next))
    })
  }, [years, year, maxYearWindowStart])

  const visibleYears = useMemo(
    () => years.slice(yearWindowStart, yearWindowStart + MAX_VISIBLE_YEARS),
    [years, yearWindowStart],
  )

  const shiftYearWindow = useCallback(
    (delta: number) => {
      if (!years.length) return
      const nextStart = Math.max(0, Math.min(maxYearWindowStart, yearWindowStart + delta))
      if (nextStart === yearWindowStart) return
      setYearWindowStart(nextStart)
      if (year === null) return
      const yi = years.indexOf(year)
      if (yi < 0) return
      if (yi < nextStart) setYear(years[nextStart])
      else if (yi >= nextStart + MAX_VISIBLE_YEARS) setYear(years[nextStart + MAX_VISIBLE_YEARS - 1])
    },
    [years, year, yearWindowStart, maxYearWindowStart],
  )

  const [pdfModalOpen, setPdfModalOpen] = useState(false)

  const report = useMemo(() => {
    if (!doc?.reports.length || year === null) return null
    return doc.reports.find((r) => r.year === year) ?? null
  }, [doc, year])

  const settings = doc?.settings

  useEffect(() => {
    if (!report) return
    document.title = messages.pages.documentTitle(fr.pageTitle(report.year))
    return () => {
      document.title = messages.pages.defaultTitle
    }
  }, [report?.year, fr, messages.pages])

  useEffect(() => {
    if (!pdfModalOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPdfModalOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pdfModalOpen])

  const onDonationDisclosureClick = useCallback(() => {
    if (!report) return
    const raw = report.donationDisclosurePdfUrl?.trim()
    if (raw) {
      const href = pdfOpenHref(raw, `${report.year}년 기부금 공시.pdf`)
      window.open(href, '_blank', 'noopener,noreferrer')
      return
    }
    setPdfModalOpen(true)
  }, [report])

  if (loading) {
    return (
      <div className="financial-report-page">
        <PageHero title={nav.links.financialReport} showScrollHint={false} />
        <div className="financial-report__inner">
          <p className="financial-report__status">{fr.loading}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="financial-report-page">
        <PageHero title={nav.links.financialReport} showScrollHint={false} />
        <div className="financial-report__inner">
          <div className="financial-report__error" role="alert">
            <p>{error}</p>
            <p className="financial-report__error-hint">{fr.loadErrorHint}</p>
            <button type="button" className="financial-report__retry" onClick={() => void load()}>
              {fr.retry}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!doc || !report || year === null || !settings) {
    return (
      <div className="financial-report-page">
        <PageHero title={nav.links.financialReport} showScrollHint={false} />
        <div className="financial-report__inner">
          <p className="financial-report__empty">
            {fr.empty}
          </p>
        </div>
      </div>
    )
  }

  const showAnyTable = settings.showBalanceSheet || settings.showOperationsStatement

  return (
    <div className="financial-report-page">
      <PageHero title={fr.pageTitle(report.year)} showScrollHint={false} />

      <div className="financial-report__inner">
        <div className="financial-report__year-row">
          <span className="financial-report__year-label" id="fr-year-label">
            연도
          </span>
          <div className="financial-report__year-strip">
            <button
              type="button"
              className="financial-report__year-nav"
              aria-label={fr.yearNavNewer}
              disabled={years.length <= MAX_VISIBLE_YEARS || yearWindowStart <= 0}
              onClick={() => shiftYearWindow(-1)}
            >
              <ChevronLeftIcon />
            </button>
            <div
              className="financial-report__year-toggle"
              role="tablist"
              aria-labelledby="fr-year-label"
              aria-orientation="horizontal"
            >
              {visibleYears.map((y) => (
                <button
                  key={y}
                  type="button"
                  role="tab"
                  aria-selected={y === year}
                  className={`financial-report__year-toggle-btn${y === year ? ' financial-report__year-toggle-btn--active' : ''}`}
                  onClick={() => setYear(y)}
                >
                  {y}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="financial-report__year-nav"
              aria-label={fr.yearNavOlder}
              disabled={years.length <= MAX_VISIBLE_YEARS || yearWindowStart >= maxYearWindowStart}
              onClick={() => shiftYearWindow(1)}
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>

        <div className="financial-report__charts">
          <FinancialDonutChart
            key={`fr-income-${report.year}`}
            year={report.year}
            kind="income"
            segments={report.incomeSegments}
            totalFormatted={formatWon(report.incomeTotalWon, locale)}
            incomeTitle={fr.incomeChart}
          />
          <FinancialDonutChart
            key={`fr-expense-${report.year}`}
            year={report.year}
            kind="expense"
            segments={report.expenseSegments}
            totalFormatted={formatWon(report.expenseTotalWon, locale)}
            expenseTitle={fr.expenseChart}
          />
        </div>

        {showAnyTable ? (
          <div
            className={`financial-report__tables${
              settings.showBalanceSheet && settings.showOperationsStatement ? '' : ' financial-report__tables--single'
            }`}
          >
            {settings.showBalanceSheet ? (
              <div className="financial-report__table-card">
                <div className="financial-report__table-head">{fr.balanceSheet(report.year)}</div>
                {report.balanceSheetImageUrl ? (
                  <img src={report.balanceSheetImageUrl} alt={`${fr.balanceSheet(report.year)}`} />
                ) : (
                  <div className="financial-report__table-placeholder">
                    {fr.tablePlaceholderBalance}
                    <span style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#999' }}>
                      {fr.tablePlaceholderHint}
                    </span>
                  </div>
                )}
              </div>
            ) : null}
            {settings.showOperationsStatement ? (
              <div className="financial-report__table-card">
                <div className="financial-report__table-head">{fr.operationsStatement(report.year)}</div>
                {report.operationsStatementImageUrl ? (
                  <img src={report.operationsStatementImageUrl} alt={`${fr.operationsStatement(report.year)}`} />
                ) : (
                  <div className="financial-report__table-placeholder">
                    {fr.tablePlaceholderOps}
                    <span style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#999' }}>
                      {fr.tablePlaceholderHint}
                    </span>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        ) : null}

        {settings.showActionButtons ? (
          <div className="financial-report__actions">
            <a
              className="financial-report__action financial-report__action--teal"
              href={HOMETAX_DISCLOSURE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{fr.actionHometax}</span>
              <span className="financial-report__action-icon" aria-hidden="true">
                <ArrowCircleIcon />
              </span>
            </a>
            <button
              type="button"
              className="financial-report__action financial-report__action--yellow"
              onClick={onDonationDisclosureClick}
            >
              <span>{fr.actionDonation}</span>
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
                {fr.actionAcrc.split('\n').map((line, i) => (
                  <span key={i}>
                    {i > 0 ? <br /> : null}
                    {line}
                  </span>
                ))}
              </span>
              <span className="financial-report__action-icon" aria-hidden="true">
                <ArrowCircleIcon />
              </span>
            </a>
          </div>
        ) : null}
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
            <h2 id="fr-pdf-modal-title">{fr.pdfModalTitle}</h2>
            <p>
              {fr.pdfModalBody}
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
