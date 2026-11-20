import { useCallback, useEffect, useMemo, useState } from 'react'
import { PageHero } from '../components/PageHero'
import { KhayahSectionNav } from '../components/KhayahSectionNav'
import { pageHeroImageForPath } from '../constants/pageHeroImages'
import { PATH } from '../i18n/routes'
import { FinancialDonutChart } from '../features/financial-report/FinancialDonutChart'
import { formatWon } from '../features/financial-report/financialReportDefaults'
import type { FinancialReportsPublicDocument } from '../features/financial-report/financialReportTypes'
import { fetchFinancialReports } from '../services/api'
import { useLocale } from '../i18n/LocaleContext'
import { useKayaPages } from '../features/kaya/useKayaPages'
import { donateHref, useBizSupport } from '../features/biz/useBizSupport'
import { pdfOpenHref } from '../utils/pdfAttachments'
import { complianceItems, disclosureItems, principleItems } from '../features/kaya/transparencyLists'
import { transSectionOrder } from '../features/kaya/kayaSectionOrder'
import { toCloudinaryWebpUrl } from '../utils/cloudinaryWebp'
import { normalizeHref } from '../utils/hrefs'
import '../styles/financial-report.css'

const ACRC_URL = 'https://www.acrc.go.kr/'

function layoutTitle(text: string, line: string): string {
  if (text.includes('<br')) return text
  const plain = text.replace(/<[^>]+>/g, '')
  const at = plain.indexOf(line)
  if (at <= 0) return text
  const head = plain.slice(0, at).replace(/\s+$/, '')
  const tail = plain.slice(at + line.length)
  return `${head}<br /><span>${line}</span>${tail}`
}

function trimPercent(percent: number): string {
  if (!Number.isFinite(percent)) return '0'
  return String(Math.round(percent * 100) / 100)
}

function FrRing({
  title,
  centerLabel,
  total,
  segments,
  year,
}: {
  title: string
  centerLabel: string
  total: string
  segments: { id: string; label: string; percent: number; color: string }[]
  year: number
}) {
  let acc = 0
  const stops = segments
    .map((segment) => {
      const start = acc
      acc += segment.percent
      return `${segment.color} ${start}% ${acc}%`
    })
    .join(', ')
  return (
    <div className="fr-card">
      <p>{title}</p>
      <div className="fr-card__body">
        <div
          className="fr-ring"
          role="img"
          aria-label={segments.map((segment) => `${segment.label} ${trimPercent(segment.percent)}%`).join(', ')}
          style={{ background: stops ? `conic-gradient(${stops})` : '#eceae6' }}
        >
          <div>
            <span>
              {year} {centerLabel}
            </span>
            <span>{total}</span>
          </div>
        </div>
        <div className="fr-legend">
          {segments.map((segment) => (
            <div key={segment.id}>
              <span style={{ background: segment.color }} />
              {segment.label}
              <b>{trimPercent(segment.percent)}%</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

type PdfMissing = { title: string; body: string }

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
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14.5 5.5 8 12l6.5 6.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9.5 5.5 16 12l-6.5 6.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function FinancialReportPage() {
  const { locale, messages } = useLocale()
  const kaya = useKayaPages()
  const biz = useBizSupport()
  const ko = (key: string, fallback: string) => (locale === 'ko' && kaya?.fields[key] ? kaya.fields[key] : fallback)
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

  const [pdfMissing, setPdfMissing] = useState<PdfMissing | null>(null)
  const [statementsOpen, setStatementsOpen] = useState(false)

  useEffect(() => {
    setStatementsOpen(false)
  }, [year])

  const report = useMemo(() => {
    if (!doc?.reports.length || year === null) return null
    return doc.reports.find((r) => r.year === year) ?? null
  }, [doc, year])

  const settings = doc?.settings

  useEffect(() => {
    if (!report) return
    document.title = messages.pages.documentTitle(nav.links.financialReport)
    return () => {
      document.title = messages.pages.defaultTitle
    }
  }, [report?.year, nav.links.financialReport, messages.pages])

  useEffect(() => {
    if (!pdfMissing) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPdfMissing(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pdfMissing])

  const openYearPdf = useCallback((url: string | null | undefined, filename: string, missing: PdfMissing) => {
    const raw = url?.trim()
    if (raw) {
      window.open(pdfOpenHref(raw, filename), '_blank', 'noopener,noreferrer')
      return
    }
    setPdfMissing(missing)
  }, [])

  if (loading) {
    return (
      <div className={`financial-report-page${locale === 'ko' ? ' financial-report-page--ko' : ''}`}>
        <PageHero
          title={nav.links.financialReport}
          backgroundImageUrl={pageHeroImageForPath(PATH.aboutFinancialReport)}
          showScrollHint={false}
          layout={locale === 'ko' ? 'kaya' : 'banner'}
          eyebrow={locale === 'ko' ? 'TRANSPARENCY' : undefined}
        />
        <KhayahSectionNav />
        <div className="financial-report__inner">
          <p className="financial-report__status">{fr.loading}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`financial-report-page${locale === 'ko' ? ' financial-report-page--ko' : ''}`}>
        <PageHero
          title={nav.links.financialReport}
          backgroundImageUrl={pageHeroImageForPath(PATH.aboutFinancialReport)}
          showScrollHint={false}
          layout={locale === 'ko' ? 'kaya' : 'banner'}
          eyebrow={locale === 'ko' ? 'TRANSPARENCY' : undefined}
        />
        <KhayahSectionNav />
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
      <div className={`financial-report-page${locale === 'ko' ? ' financial-report-page--ko' : ''}`}>
        <PageHero
          title={nav.links.financialReport}
          backgroundImageUrl={pageHeroImageForPath(PATH.aboutFinancialReport)}
          showScrollHint={false}
          layout={locale === 'ko' ? 'kaya' : 'banner'}
          eyebrow={locale === 'ko' ? 'TRANSPARENCY' : undefined}
        />
        <KhayahSectionNav />
        <div className="financial-report__inner">
          <p className="financial-report__empty">
            {fr.empty}
          </p>
        </div>
      </div>
    )
  }

  const showAnyTable = settings.showBalanceSheet || settings.showOperationsStatement
  const statementBlock = showAnyTable ? (
    <div className="fr-statements">
      <button
        type="button"
        className="fr-statements__toggle"
        aria-expanded={statementsOpen}
        onClick={() => setStatementsOpen((open) => !open)}
      >
        재무제표 자세히 보기
      </button>
      <div
        className={`financial-report__tables${
          settings.showBalanceSheet && settings.showOperationsStatement ? '' : ' financial-report__tables--single'
        }`}
        hidden={!statementsOpen}
      >
        {settings.showBalanceSheet ? (
          <div className="financial-report__table-card">
            <div className="financial-report__table-head">{fr.balanceSheet(report.year)}</div>
            {report.balanceSheetImageUrl ? (
              <img src={toCloudinaryWebpUrl(report.balanceSheetImageUrl)} alt={`${fr.balanceSheet(report.year)}`} />
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
              <img src={toCloudinaryWebpUrl(report.operationsStatementImageUrl)} alt={`${fr.operationsStatement(report.year)}`} />
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
    </div>
  ) : null

  const transMoving = transSectionOrder(kaya?.fields['trans.sectionOrder'])
  const transOn = (id: string) => kaya?.fields[`trans.${id}On`] !== '0'
  const discloseInline = transOn('hero') && transMoving[0] === 'disclose' && transOn('disclose')
  const discloseBox = report && settings?.showActionButtons ? (
    <div className="fr-disclose">
      <p>DISCLOSURE · 공시 자료</p>
      {disclosureItems(kaya?.fields ?? {})
        .filter((item) => item.label.trim() && (item.kind !== 'link' || item.href.trim()))
        .map((item, index) => {
          const no = String(index + 1).padStart(2, '0')
          if (item.kind === 'link') {
            return (
              <a key={item.id} className="fr-disclose__row" href={normalizeHref(item.href)} target="_blank" rel="noopener noreferrer">
                <span>{no}</span>
                <span>{item.label}</span>
                <span aria-hidden="true">→</span>
              </a>
            )
          }
          const url =
            item.kind === 'publicInterest'
              ? report.publicInterestDisclosurePdfUrl
              : item.kind === 'donation'
                ? report.donationDisclosurePdfUrl
                : item.files.find((file) => file.year === report.year)?.url
          return (
            <button
              key={item.id}
              type="button"
              className="fr-disclose__row"
              onClick={() =>
                openYearPdf(url, `${report.year}년 ${item.label}.pdf`, {
                  title: `${item.label} PDF`,
                  body: `${report.year}년 ${item.label} PDF가 없습니다.`,
                })
              }
            >
              <span>{no}</span>
              <span>{item.label}</span>
              <span>PDF</span>
            </button>
          )
        })}
    </div>
  ) : null

  return (
    <div className={`financial-report-page${locale === 'ko' ? ' financial-report-page--ko' : ''}`}>
      {locale === 'ko' && !transOn('hero') ? null : <PageHero
        title={nav.links.financialReport}
        backgroundImageUrl={pageHeroImageForPath(PATH.aboutFinancialReport)}
        showScrollHint={false}
        layout={locale === 'ko' ? 'kaya' : 'banner'}
        eyebrow={locale === 'ko' ? 'TRANSPARENCY' : undefined}
      />}
      <KhayahSectionNav />

      <div className="financial-report__inner">
        {locale === 'ko' ? (
          <>
            <section className="fr-intro" style={{ order: 0 }} hidden={!transOn('hero')}>
              <div className="fr-intro__copy">
                <p className="fr-kicker">TRANSPARENCY · 투명경영</p>
                <h2
                  dangerouslySetInnerHTML={{
                    __html: layoutTitle(
                      ko('trans.introTitle', '투명하게 운영하고, 정직하게 보고합니다.'),
                      '정직하게 보고합니다.',
                    ),
                  }}
                />
                <p>
                  {ko(
                    'trans.introBody',
                    '카야는 후원자와 협력기관이 보내주신 신뢰를 가장 소중한 자산으로 여깁니다. 모든 재정을 관련 법령과 내부 규정에 따라 관리하고, 운영 현황과 재무 정보를 정기적으로 공개합니다.',
                  )}
                </p>
                <div className="fr-chips">
                  <span className="is-on">{ko('trans.chip.0', '내부 감사')}</span>
                  <span>{ko('trans.chip.1', '외부 감사')}</span>
                  <span>{ko('trans.chip.2', '재무 공개')}</span>
                </div>
              </div>
              {discloseInline ? discloseBox : null}
            </section>
            {transOn('disclose') && !discloseInline ? <section style={{ order: transMoving.indexOf('disclose') + 1 }}>{discloseBox}</section> : null}
          </>
        ) : null}
        {locale === 'ko' ? (
          <>
            <section className="fr-principles" hidden={!transOn('principles')} style={{ order: transMoving.indexOf('principles') + 1 }}>
              <div className="fr-principles__copy">
                <p className="fr-kicker">ACCOUNTABILITY · 투명경영 원칙</p>
                <h2
                  dangerouslySetInnerHTML={{
                    __html: layoutTitle(ko('trans.principlesTitle', '감사와 공시로 재정의 투명성을 지킵니다.'), '재정의 투명성'),
                  }}
                />
              </div>
              <div className="fr-principle-grid">
                {principleItems(kaya?.fields ?? {})
                  .filter((item) => item.title.trim() || item.body.trim())
                  .map((item, index) => (
                    <article key={`${item.title}-${index}`}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </article>
                  ))}
              </div>
            </section>
            <section className="fr-compliance" hidden={!transOn('compliance')} style={{ order: transMoving.indexOf('compliance') + 1 }}>
              <p className="fr-kicker">COMPLIANCE · 공시·준수 현황</p>
              <h2
                dangerouslySetInnerHTML={{
                  __html: layoutTitle(
                    ko('trans.complianceTitle', '법령에 따른 공시와 정보 제공, 후원자 소통을 성실히 이행합니다.'),
                    '후원자 소통을 성실히 이행합니다.',
                  ),
                }}
              />
              <dl>
                {complianceItems(kaya?.fields ?? {})
                  .filter((item) => item.dt.trim() || item.dd.trim())
                  .map((item, index) => (
                    <div key={`${item.dt}-${index}`}>
                      <dt>{item.dt}</dt>
                      <dd>{item.dd}</dd>
                    </div>
                  ))}
              </dl>
            </section>
          </>
        ) : null}
        {locale === 'ko' ? null : (
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
        )}

        {locale === 'ko' ? (
          <section className="fr-finance" hidden={!transOn('reports')} style={{ order: transMoving.indexOf('reports') + 1 }}>
            <div className="fr-finance__head">
              <div>
                <p className="fr-kicker">FINANCIAL REPORT · 연도별 재무보고</p>
                <h2>연도별 재무보고</h2>
                <p>이사회 승인과 결산 공시를 마친 연도별 결산 자료를 기준으로 작성되었습니다.</p>
              </div>
              <div className="fr-pills" role="group" aria-label="연도 선택">
                {years.length > MAX_VISIBLE_YEARS ? (
                  <button
                    type="button"
                    className="fr-pills__nav"
                    aria-label={fr.yearNavNewer}
                    disabled={yearWindowStart <= 0}
                    onClick={() => shiftYearWindow(-1)}
                  >
                    <ChevronLeftIcon />
                  </button>
                ) : null}
                {visibleYears.map((y) => (
                  <button key={y} type="button" className={y === year ? 'is-on' : undefined} onClick={() => setYear(y)}>
                    {y}
                  </button>
                ))}
                {years.length > MAX_VISIBLE_YEARS ? (
                  <button
                    type="button"
                    className="fr-pills__nav"
                    aria-label={fr.yearNavOlder}
                    disabled={yearWindowStart >= maxYearWindowStart}
                    onClick={() => shiftYearWindow(1)}
                  >
                    <ChevronRightIcon />
                  </button>
                ) : null}
              </div>
            </div>
            {(() => {
              const program = report.expenseSegments.find((segment) => segment.label.includes('사업수행'))
              if (!program) return null
              return (
                <div className="fr-highlight">
                  <b>{report.year}년</b> 지출의 <b>{trimPercent(program.percent)}%</b>를 사업 수행에 사용했습니다.
                </div>
              )
            })()}
            <div className="fr-charts">
              <FrRing
                title="수입 구성"
                centerLabel={fr.incomeChart}
                total={formatWon(report.incomeTotalWon, locale)}
                segments={report.incomeSegments}
                year={report.year}
              />
              <FrRing
                title="지출 구성"
                centerLabel={fr.expenseChart}
                total={formatWon(report.expenseTotalWon, locale)}
                segments={report.expenseSegments}
                year={report.year}
              />
            </div>
            {statementBlock}
          </section>
        ) : (
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
        )}

        {locale === 'ko' ? null : statementBlock}

        {locale !== 'ko' && settings.showActionButtons ? (
          <div className="financial-report__actions">
            <button
              type="button"
              className="financial-report__action financial-report__action--teal"
              onClick={() =>
                openYearPdf(
                  report.publicInterestDisclosurePdfUrl,
                  `${report.year}년 공익법인 결산서류 공시.pdf`,
                  { title: fr.pdfModalTitlePublicInterest, body: fr.pdfModalBodyPublicInterest },
                )
              }
            >
              <span>{fr.actionHometax}</span>
              <span className="financial-report__action-icon" aria-hidden="true">
                <ArrowCircleIcon />
              </span>
            </button>
            <button
              type="button"
              className="financial-report__action financial-report__action--yellow"
              onClick={() =>
                openYearPdf(report.donationDisclosurePdfUrl, `${report.year}년 기부금 공시.pdf`, {
                  title: fr.pdfModalTitle,
                  body: fr.pdfModalBody,
                })
              }
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
        {locale === 'ko' ? (
          <section className="fr-support" hidden={!transOn('banner')} style={{ order: 100 }}>
            <div>
              <p className="fr-kicker">SUPPORT</p>
              <h2>{ko('trans.supportTitle', '투명하게 운영되는 나눔에 함께해 주세요')}</h2>
              {ko('trans.supportBody', '') ? <p className="fr-support__body">{ko('trans.supportBody', '')}</p> : null}
            </div>
            <a href={donateHref(biz)} target="_blank" rel="noopener noreferrer">
              {ko('trans.supportButton', '후원하러 가기')}
            </a>
          </section>
        ) : null}
      </div>

      {pdfMissing && (
        <div
          className="financial-report__modal-backdrop"
          role="presentation"
          onClick={() => setPdfMissing(null)}
        >
          <div
            className="financial-report__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="fr-pdf-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="fr-pdf-modal-title">{pdfMissing.title}</h2>
            <p>{pdfMissing.body}</p>
            <div className="financial-report__modal-actions">
              <button type="button" className="financial-report__modal-btn" onClick={() => setPdfMissing(null)}>
                {fr.pdfModalClose}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
