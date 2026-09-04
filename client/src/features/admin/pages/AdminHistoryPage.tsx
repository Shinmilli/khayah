import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_HISTORY,
  type HistoryDocument,
  type HistoryEditLocale,
  type HistoryItem,
  type HistoryLocaleContent,
  type HistoryYear,
} from '../../history/historyTypes'
import { adminFetchHistory, adminPutHistory } from '../../../services/api'

function newId(prefix: string): string {
  return `${prefix}-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())}`
}

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

function sortYearsDesc(years: HistoryYear[]): HistoryYear[] {
  return [...years].sort((a, b) => Number(b.year) - Number(a.year) || b.year.localeCompare(a.year))
}

const EDIT_LOCALES: { id: HistoryEditLocale; label: string }[] = [
  { id: 'ko', label: '한국어' },
  { id: 'en', label: 'English' },
]

export function AdminHistoryPage() {
  const [doc, setDoc] = useState<HistoryDocument>(() => deepClone(DEFAULT_HISTORY))
  const [editLocale, setEditLocale] = useState<HistoryEditLocale>('ko')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState('')

  const localeDoc = useMemo(() => doc.locales[editLocale], [doc, editLocale])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminFetchHistory()
      setDoc(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : '불러오지 못했습니다.')
      setDoc(deepClone(DEFAULT_HISTORY))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const patchLocale = (patch: Partial<HistoryLocaleContent>) => {
    setDoc((prev) => ({
      ...prev,
      locales: {
        ...prev.locales,
        [editLocale]: { ...prev.locales[editLocale], ...patch },
      },
    }))
  }

  const updateYear = (yearIdx: number, patch: Partial<HistoryYear>) => {
    setDoc((prev) => ({
      ...prev,
      locales: {
        ...prev.locales,
        [editLocale]: {
          ...prev.locales[editLocale],
          years: prev.locales[editLocale].years.map((y, i) => (i === yearIdx ? { ...y, ...patch } : y)),
        },
      },
    }))
  }

  const removeYear = (yearIdx: number) => {
    setDoc((prev) => ({
      ...prev,
      locales: {
        ...prev.locales,
        [editLocale]: {
          ...prev.locales[editLocale],
          years: prev.locales[editLocale].years.filter((_, i) => i !== yearIdx),
        },
      },
    }))
  }

  const addYear = () => {
    const currentYear = String(new Date().getFullYear())
    setDoc((prev) => ({
      ...prev,
      locales: {
        ...prev.locales,
        [editLocale]: {
          ...prev.locales[editLocale],
          years: [
            { id: newId('year'), year: currentYear, items: [{ id: newId('item'), month: '01', text: '' }] },
            ...prev.locales[editLocale].years,
          ],
        },
      },
    }))
  }

  const updateItem = (yearIdx: number, itemIdx: number, patch: Partial<HistoryItem>) => {
    setDoc((prev) => ({
      ...prev,
      locales: {
        ...prev.locales,
        [editLocale]: {
          ...prev.locales[editLocale],
          years: prev.locales[editLocale].years.map((y, yi) =>
            yi === yearIdx
              ? {
                  ...y,
                  items: y.items.map((it, ii) => (ii === itemIdx ? { ...it, ...patch } : it)),
                }
              : y,
          ),
        },
      },
    }))
  }

  const removeItem = (yearIdx: number, itemIdx: number) => {
    setDoc((prev) => ({
      ...prev,
      locales: {
        ...prev.locales,
        [editLocale]: {
          ...prev.locales[editLocale],
          years: prev.locales[editLocale].years.map((y, yi) =>
            yi === yearIdx ? { ...y, items: y.items.filter((_, ii) => ii !== itemIdx) } : y,
          ),
        },
      },
    }))
  }

  const addItem = (yearIdx: number) => {
    setDoc((prev) => ({
      ...prev,
      locales: {
        ...prev.locales,
        [editLocale]: {
          ...prev.locales[editLocale],
          years: prev.locales[editLocale].years.map((y, yi) =>
            yi === yearIdx
              ? { ...y, items: [...y.items, { id: newId('item'), month: '', text: '' }] }
              : y,
          ),
        },
      },
    }))
  }

  const normalizeLocale = (src: HistoryLocaleContent): HistoryLocaleContent => ({
    lead: src.lead.trim(),
    years: sortYearsDesc(
      src.years
        .map((y) => ({
          id: y.id.trim() || newId('year'),
          year: y.year.trim(),
          items: y.items
            .filter((it) => it.month.trim() || it.text.trim())
            .map((it) => ({
              id: it.id.trim() || newId('item'),
              month: it.month.trim(),
              text: it.text.trim(),
            })),
        }))
        .filter((y) => y.year && y.items.length > 0),
    ),
  })

  const onSave = async () => {
    setSaving(true)
    setError('')
    try {
      const payload: HistoryDocument = {
        version: 1,
        locales: {
          ko: normalizeLocale(doc.locales.ko),
          en: normalizeLocale(doc.locales.en),
        },
      }
      const saved = await adminPutHistory(payload)
      setDoc(saved)
      setSavedAt(new Date().toLocaleTimeString('ko-KR'))
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1 className="admin-page__title">연혁</h1>
          <p className="admin-page__desc">
            공개 「카야 연혁」 페이지의 인트로 문구·연도·월별 항목을 언어별로 수정·추가합니다. 저장 시
            연도는 최신순으로 정렬됩니다.
          </p>
        </div>
        <button type="button" className="admin-btn" disabled={saving || loading} onClick={() => void onSave()}>
          {saving ? '저장 중…' : '저장'}
        </button>
      </div>

      <div className="admin-field admin-field--full" style={{ marginBottom: '1rem' }}>
        <span className="admin-field__label">편집 언어</span>
        <div className="admin-segmented admin-segmented--tight" role="group" aria-label="편집 언어">
          {EDIT_LOCALES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`admin-segmented__btn${editLocale === id ? ' admin-segmented__btn--active' : ''}`}
              onClick={() => setEditLocale(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error ? <p className="admin-banner admin-banner--error">{error}</p> : null}
      {savedAt ? <p className="admin-banner admin-banner--ok">저장됨 ({savedAt})</p> : null}
      {loading ? <p className="admin-muted">불러오는 중…</p> : null}

      {!loading ? (
        <>
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">인트로 문구</span>
            <input
              className="admin-input"
              value={localeDoc.lead}
              onChange={(e) => patchLocale({ lead: e.target.value })}
              placeholder={editLocale === 'ko' ? '연혁 상단 소개 문구' : 'Intro line above the timeline'}
            />
          </label>

          <div className="admin-history-toolbar">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={addYear}>
              + 연도 추가
            </button>
          </div>

          <div className="admin-history-years">
            {localeDoc.years.length === 0 ? (
              <p className="admin-muted">등록된 연도가 없습니다. 「연도 추가」로 시작하세요.</p>
            ) : null}
            {localeDoc.years.map((year, yearIdx) => (
              <section key={year.id} className="admin-history-year">
                <div className="admin-history-year__head">
                  <label className="admin-field">
                    <span className="admin-field__label">연도</span>
                    <input
                      className="admin-input admin-input--year"
                      value={year.year}
                      onChange={(e) => updateYear(yearIdx, { year: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      inputMode="numeric"
                      placeholder="2024"
                    />
                  </label>
                  <div className="admin-history-year__actions">
                    <button type="button" className="admin-btn admin-btn--ghost" onClick={() => addItem(yearIdx)}>
                      + 항목
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger-ghost"
                      onClick={() => removeYear(yearIdx)}
                    >
                      연도 삭제
                    </button>
                  </div>
                </div>

                <ul className="admin-history-items">
                  {year.items.map((item, itemIdx) => (
                    <li key={item.id} className="admin-history-item">
                      <input
                        className="admin-input admin-input--month"
                        value={item.month}
                        onChange={(e) =>
                          updateItem(yearIdx, itemIdx, { month: e.target.value.replace(/\D/g, '').slice(0, 2) })
                        }
                        inputMode="numeric"
                        placeholder="01"
                        aria-label="월"
                      />
                      <input
                        className="admin-input admin-history-item__text"
                        value={item.text}
                        onChange={(e) => updateItem(yearIdx, itemIdx, { text: e.target.value })}
                        placeholder="내용"
                        aria-label="내용"
                      />
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger-ghost"
                        onClick={() => removeItem(yearIdx, itemIdx)}
                        aria-label="항목 삭제"
                      >
                        삭제
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
