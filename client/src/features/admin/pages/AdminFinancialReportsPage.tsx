import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_EXPENSE_SEGMENTS,
  DEFAULT_INCOME_SEGMENTS,
} from '../../financial-report/financialReportDefaults'
import type {
  FinancialReportSegment,
  FinancialReportYearData,
  FinancialReportsDocument,
} from '../../financial-report/financialReportTypes'
import { AdminMediaUpload } from '../components/AdminMediaUpload'
import { adminPutFinancialReports, fetchFinancialReports } from '../../../services/api'

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

function newSegmentId(): string {
  return `seg-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())}`
}

function emptyYearFromTemplate(year: number): FinancialReportYearData {
  return {
    year,
    /** 템플릿의 의미 있는 id 유지 — 도넛 안내선 분기·저장 데이터와 일치 (추가 행만 newSegmentId) */
    incomeSegments: deepClone(DEFAULT_INCOME_SEGMENTS),
    expenseSegments: deepClone(DEFAULT_EXPENSE_SEGMENTS),
    incomeTotalWon: 0,
    expenseTotalWon: 0,
    balanceSheetImageUrl: null,
    operationsStatementImageUrl: null,
    donationDisclosurePdfUrl: null,
  }
}

function AdminOnOffToggle({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  ariaLabel: string
}) {
  return (
    <label className="admin-onoff">
      <span className={`admin-onoff__state${checked ? ' is-on' : ''}`} aria-hidden>
        {checked ? 'ON' : 'OFF'}
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={ariaLabel}
      />
      <span className="admin-onoff__track" aria-hidden>
        <span className="admin-onoff__thumb" />
      </span>
    </label>
  )
}

function SegmentTableEditor({
  title,
  rows,
  onChange,
}: {
  title: string
  rows: FinancialReportSegment[]
  onChange: (next: FinancialReportSegment[]) => void
}) {
  const updateRow = (idx: number, patch: Partial<FinancialReportSegment>) => {
    const next = rows.map((r, i) => (i === idx ? { ...r, ...patch } : r))
    onChange(next)
  }
  const removeRow = (idx: number) => {
    onChange(rows.filter((_, i) => i !== idx))
  }
  const addRow = () => {
    onChange([
      ...rows,
      { id: newSegmentId(), label: '새 항목', percent: 0, color: '#6c7a89' },
    ])
  }

  return (
    <div className="admin-panel admin-panel--nested">
      <div className="admin-page__head admin-page__head--inline">
        <h3 className="admin-subpanel__title">{title}</h3>
        <button type="button" className="admin-btn admin-btn--sm admin-btn--ghost" onClick={addRow}>
          항목 추가
        </button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th scope="col">항목명</th>
              <th scope="col">비율(%)</th>
              <th scope="col">색</th>
              <th scope="col">삭제</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id}>
                <td>
                  <input
                    className="admin-input"
                    value={row.label}
                    onChange={(e) => updateRow(idx, { label: e.target.value })}
                    aria-label={`${title} 항목명`}
                  />
                </td>
                <td>
                  <input
                    className="admin-input"
                    type="number"
                    step="0.01"
                    value={Number.isFinite(row.percent) ? row.percent : 0}
                    onChange={(e) => updateRow(idx, { percent: parseFloat(e.target.value) || 0 })}
                    aria-label={`${title} 비율`}
                  />
                </td>
                <td>
                  <input
                    className="admin-input"
                    type="text"
                    value={row.color}
                    onChange={(e) => updateRow(idx, { color: e.target.value })}
                    aria-label={`${title} 색상`}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="admin-btn admin-btn--sm admin-btn--danger-ghost"
                    onClick={() => removeRow(idx)}
                    disabled={rows.length <= 1}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AdminFinancialReportsPage() {
  const [doc, setDoc] = useState<FinancialReportsDocument | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadErr, setLoadErr] = useState<string | null>(null)
  const [saveErr, setSaveErr] = useState<string | null>(null)
  const [savedOk, setSavedOk] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadErr(null)
    try {
      const d = await fetchFinancialReports()
      setDoc(deepClone(d))
      const ys = [...d.reports.map((r) => r.year)].sort((a, b) => b - a)
      setSelectedYear((cur) => (cur !== null && ys.includes(cur) ? cur : ys[0] ?? null))
    } catch (e) {
      setLoadErr(e instanceof Error ? e.message : '불러오기 실패')
      setDoc(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const sortedYears = useMemo(() => {
    if (!doc) return []
    return [...doc.reports.map((r) => r.year)].sort((a, b) => b - a)
  }, [doc])

  const selected = useMemo(() => {
    if (!doc || selectedYear === null) return null
    return doc.reports.find((r) => r.year === selectedYear) ?? null
  }, [doc, selectedYear])

  const updateSelected = (patch: Partial<FinancialReportYearData>) => {
    if (!doc || selectedYear === null) return
    setDoc({
      ...doc,
      reports: doc.reports.map((r) => (r.year === selectedYear ? { ...r, ...patch } : r)),
    })
  }

  const onAddYear = () => {
    if (!doc) return
    const nextYear = sortedYears.length ? Math.max(...sortedYears) + 1 : new Date().getFullYear()
    if (doc.reports.some((r) => r.year === nextYear)) {
      window.alert('이미 같은 연도가 있습니다.')
      return
    }
    const row = emptyYearFromTemplate(nextYear)
    setDoc({ ...doc, reports: [...doc.reports, row] })
    setSelectedYear(nextYear)
  }

  const onDeleteYear = () => {
    if (!doc || selectedYear === null) return
    if (!window.confirm(`${selectedYear}년 데이터를 삭제할까요?`)) return
    const nextReports = doc.reports.filter((r) => r.year !== selectedYear)
    setDoc({ ...doc, reports: nextReports })
    const ys = [...nextReports.map((r) => r.year)].sort((a, b) => b - a)
    setSelectedYear(ys[0] ?? null)
  }

  const onSave = async () => {
    if (!doc) return
    const years = doc.reports.map((r) => r.year)
    if (new Set(years).size !== years.length) {
      window.alert('연도가 중복되었습니다. 연도 숫자를 바꿔 주세요.')
      return
    }
    setSaving(true)
    setSaveErr(null)
    setSavedOk(false)
    try {
      const sorted = {
        ...doc,
        reports: [...doc.reports].sort((a, b) => b.year - a.year),
      }
      const saved = await adminPutFinancialReports(sorted)
      setDoc(deepClone(saved))
      setSavedOk(true)
      window.setTimeout(() => setSavedOk(false), 2400)
    } catch (e) {
      setSaveErr(e instanceof Error ? e.message : '저장 실패')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-panel__foot">불러오는 중…</p>
      </div>
    )
  }

  if (loadErr || !doc) {
    return (
      <div className="admin-page">
        <p className="admin-panel__foot" style={{ color: '#b00020' }}>
          {loadErr ?? '데이터 없음'} — API 서버가 실행 중인지, 프록시(`/api`)를 확인해 주세요.
        </p>
        <button type="button" className="admin-btn admin-btn--primary" onClick={() => void load()}>
          다시 시도
        </button>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1 className="admin-page__title">재정보고</h1>
          <p className="admin-page__desc">
            연도별 수입·지출 도넛 데이터와 재무상태표·운영성과표 이미지·기부금 공시 PDF를 저장합니다.
            파일은 서버 <code>/uploads</code>에 두고 공개 페이지(`/소식/재정보고`)는{' '}
            <code>GET /api/financial-reports</code>로 불러옵니다.
          </p>
        </div>
        <button type="button" className="admin-btn admin-btn--primary" disabled={saving} onClick={() => void onSave()}>
          {saving ? '저장 중…' : '저장'}
        </button>
      </div>

      {saveErr ? (
        <p className="admin-panel__foot" style={{ color: '#b00020', marginBottom: '1rem' }}>
          {saveErr}
        </p>
      ) : null}
      {savedOk ? (
        <p className="admin-panel__foot" style={{ color: '#1b6b3a', marginBottom: '1rem' }}>
          저장되었습니다.
        </p>
      ) : null}

      <section className="admin-panel" aria-labelledby="fr-years-heading">
        <h2 id="fr-years-heading" className="admin-panel__title">
          연도
        </h2>
        <div className="admin-row-actions" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
          {sortedYears.map((y) => (
            <button
              key={y}
              type="button"
              className={`admin-btn admin-btn--sm${y === selectedYear ? ' admin-btn--primary' : ''}`}
              onClick={() => setSelectedYear(y)}
            >
              {y}년
            </button>
          ))}
          <button type="button" className="admin-btn admin-btn--sm admin-btn--ghost" onClick={onAddYear}>
            연도 추가
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--sm admin-btn--danger-ghost"
            onClick={onDeleteYear}
            disabled={selectedYear === null}
          >
            선택 연도 삭제
          </button>
        </div>

        {selected && selectedYear !== null ? (
          <>
            <div className="admin-form-grid">
              <label className="admin-field">
                <span className="admin-field__label">연도 (숫자)</span>
                <input
                  className="admin-input"
                  type="number"
                  value={selected.year}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10)
                    if (!Number.isFinite(v)) return
                    const old = selectedYear
                    setDoc({
                      ...doc,
                      reports: doc.reports.map((r) => (r.year === old ? { ...r, year: v } : r)),
                    })
                    setSelectedYear(v)
                  }}
                />
              </label>
              <label className="admin-field">
                <span className="admin-field__label">수입 총액 (원, 숫자)</span>
                <input
                  className="admin-input"
                  type="number"
                  value={selected.incomeTotalWon}
                  onChange={(e) =>
                    updateSelected({ incomeTotalWon: parseInt(e.target.value, 10) || 0 })
                  }
                />
              </label>
              <label className="admin-field">
                <span className="admin-field__label">지출 총액 (원, 숫자)</span>
                <input
                  className="admin-input"
                  type="number"
                  value={selected.expenseTotalWon}
                  onChange={(e) =>
                    updateSelected({ expenseTotalWon: parseInt(e.target.value, 10) || 0 })
                  }
                />
              </label>
            </div>

            <SegmentTableEditor
              title="수입 구성 (도넛)"
              rows={selected.incomeSegments}
              onChange={(incomeSegments) => updateSelected({ incomeSegments })}
            />
            <SegmentTableEditor
              title="지출 구성 (도넛)"
              rows={selected.expenseSegments}
              onChange={(expenseSegments) => updateSelected({ expenseSegments })}
            />

            <div className="admin-fr-section">
              <div className="admin-fr-section__head">
                <span className="admin-fr-section__head-kicker">화면에 표시</span>
                <AdminOnOffToggle
                  checked={doc.settings.showBalanceSheet}
                  onChange={(showBalanceSheet) =>
                    setDoc({ ...doc, settings: { ...doc.settings, showBalanceSheet } })
                  }
                  ariaLabel="재무상태표 영역 공개 표시"
                />
              </div>
              <AdminMediaUpload
                label="재무상태표 이미지"
                hint="JPEG · PNG · WebP · GIF — 업로드 후 상단 「저장」을 눌러야 공개 페이지에 반영됩니다."
                variant="image"
                value={selected.balanceSheetImageUrl ?? null}
                onChange={(url) => updateSelected({ balanceSheetImageUrl: url })}
              />
            </div>

            <div className="admin-fr-section">
              <div className="admin-fr-section__head">
                <span className="admin-fr-section__head-kicker">화면에 표시</span>
                <AdminOnOffToggle
                  checked={doc.settings.showOperationsStatement}
                  onChange={(showOperationsStatement) =>
                    setDoc({ ...doc, settings: { ...doc.settings, showOperationsStatement } })
                  }
                  ariaLabel="운영성과표 영역 공개 표시"
                />
              </div>
              <AdminMediaUpload
                label="운영성과표 이미지"
                hint="JPEG · PNG · WebP · GIF"
                variant="image"
                value={selected.operationsStatementImageUrl ?? null}
                onChange={(url) => updateSelected({ operationsStatementImageUrl: url })}
              />
            </div>

            <div className="admin-fr-section">
              <div className="admin-fr-section__head">
                <span className="admin-fr-section__head-kicker">화면에 표시</span>
                <AdminOnOffToggle
                  checked={doc.settings.showActionButtons}
                  onChange={(showActionButtons) =>
                    setDoc({ ...doc, settings: { ...doc.settings, showActionButtons } })
                  }
                  ariaLabel="하단 링크·버튼 영역 공개 표시"
                />
              </div>
              <AdminMediaUpload
                label="기부금 모금액 및 활용 실적 공시 PDF"
                hint="PDF만 업로드 · 공개 페이지 하단 「기부금 모금액 및 활용 실적 공시」 버튼에서 열립니다."
                variant="pdf"
                value={selected.donationDisclosurePdfUrl ?? null}
                onChange={(url) => updateSelected({ donationDisclosurePdfUrl: url })}
              />
            </div>
          </>
        ) : (
          <p className="admin-panel__foot">연도를 추가한 뒤 편집할 수 있습니다.</p>
        )}
      </section>
    </div>
  )
}
