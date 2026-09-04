import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_IMPACT_STATS,
  type ImpactEditLocale,
  type ImpactStatItem,
  type ImpactStatsDocument,
  type ImpactStatsLocaleContent,
} from '../../home/impactStatsTypes'
import { adminFetchImpactStats, adminPutImpactStats } from '../../../services/api'

function newStatId(): string {
  return `stat-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())}`
}

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

const EDIT_LOCALES: { id: ImpactEditLocale; label: string }[] = [
  { id: 'ko', label: '한국어' },
  { id: 'en', label: 'English' },
]

export function AdminImpactStatsPage() {
  const [doc, setDoc] = useState<ImpactStatsDocument>(() => deepClone(DEFAULT_IMPACT_STATS))
  const [editLocale, setEditLocale] = useState<ImpactEditLocale>('ko')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState<string>('')

  const localeDoc = useMemo(() => doc.locales[editLocale], [doc, editLocale])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminFetchImpactStats()
      setDoc(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : '불러오지 못했습니다.')
      setDoc(deepClone(DEFAULT_IMPACT_STATS))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const patchLocale = (patch: Partial<ImpactStatsLocaleContent>) => {
    setDoc((prev) => ({
      ...prev,
      locales: {
        ...prev.locales,
        [editLocale]: { ...prev.locales[editLocale], ...patch },
      },
    }))
  }

  const updateStat = (idx: number, patch: Partial<ImpactStatItem>) => {
    setDoc((prev) => ({
      ...prev,
      locales: {
        ...prev.locales,
        [editLocale]: {
          ...prev.locales[editLocale],
          stats: prev.locales[editLocale].stats.map((row, i) => (i === idx ? { ...row, ...patch } : row)),
        },
      },
    }))
  }

  const removeStat = (idx: number) => {
    setDoc((prev) => ({
      ...prev,
      locales: {
        ...prev.locales,
        [editLocale]: {
          ...prev.locales[editLocale],
          stats: prev.locales[editLocale].stats.filter((_, i) => i !== idx),
        },
      },
    }))
  }

  const addStat = () => {
    setDoc((prev) => ({
      ...prev,
      locales: {
        ...prev.locales,
        [editLocale]: {
          ...prev.locales[editLocale],
          stats: [...prev.locales[editLocale].stats, { id: newStatId(), label: '', value: '', unit: '' }],
        },
      },
    }))
  }

  const onSave = async () => {
    setSaving(true)
    setError('')
    try {
      const payload: ImpactStatsDocument = {
        version: 2,
        locales: {
          ko: {
            donut: {
              percent: doc.locales.ko.donut.percent,
              labelLines: doc.locales.ko.donut.labelLines.map((line) => line.trim()).filter(Boolean),
            },
            stats: doc.locales.ko.stats
              .filter((row) => row.label.trim() || row.value.trim() || row.unit?.trim())
              .map((row) => ({
                id: row.id.trim() || newStatId(),
                label: row.label.trim(),
                value: row.value.trim(),
                unit: row.unit?.trim() ?? '',
              })),
          },
          en: {
            donut: {
              percent: doc.locales.en.donut.percent,
              labelLines: doc.locales.en.donut.labelLines.map((line) => line.trim()).filter(Boolean),
            },
            stats: doc.locales.en.stats
              .filter((row) => row.label.trim() || row.value.trim() || row.unit?.trim())
              .map((row) => ({
                id: row.id.trim() || newStatId(),
                label: row.label.trim(),
                value: row.value.trim(),
                unit: row.unit?.trim() ?? '',
              })),
          },
        },
      }
      const saved = await adminPutImpactStats(payload)
      setDoc(saved)
      setSavedAt(new Date().toLocaleTimeString('ko-KR'))
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const labelLinesText = localeDoc.donut.labelLines.join('\n')

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1 className="admin-page__title">나눔의 결실</h1>
          <p className="admin-page__desc">
            홈 「나눔의 결실」 섹션의 도넛·성과 지표를 언어별로 수정합니다. 비율(%)은 한·영 공통으로
            저장되며, 아래 탭에서 각 언어의 문구만 편집합니다.
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
      {savedAt ? (
        <p className="admin-panel__foot" role="status">
          저장됨 ({savedAt})
        </p>
      ) : null}

      {loading ? (
        <p className="admin-panel__foot">불러오는 중…</p>
      ) : (
        <>
          <section className="admin-panel" aria-labelledby="impact-donut-heading">
            <h2 id="impact-donut-heading" className="admin-panel__title">
              후원금 사용 비율 (도넛)
            </h2>
            <div className="admin-form-grid">
              <label className="admin-field">
                <span className="admin-field__label">비율 (%) — 한·영 공통</span>
                <input
                  className="admin-input"
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={Number.isFinite(localeDoc.donut.percent) ? localeDoc.donut.percent : 0}
                  onChange={(e) => {
                    const percent = parseFloat(e.target.value) || 0
                    setDoc((prev) => ({
                      ...prev,
                      locales: {
                        ko: { ...prev.locales.ko, donut: { ...prev.locales.ko.donut, percent } },
                        en: { ...prev.locales.en, donut: { ...prev.locales.en.donut, percent } },
                      },
                    }))
                  }}
                />
              </label>
              <label className="admin-field admin-field--full">
                <span className="admin-field__label">도넛 안 설명 ({editLocale === 'ko' ? '한국어' : 'English'}, 줄마다 Enter)</span>
                <textarea
                  className="admin-input admin-input--area"
                  rows={3}
                  value={labelLinesText}
                  onChange={(e) =>
                    patchLocale({
                      donut: {
                        ...localeDoc.donut,
                        labelLines: e.target.value.split('\n'),
                      },
                    })
                  }
                  placeholder={editLocale === 'ko' ? '수혜된 아동의\n교육지원' : 'Education support\nfor children we serve'}
                />
              </label>
            </div>
          </section>

          <section className="admin-panel" aria-labelledby="impact-stats-heading">
            <div className="admin-page__head admin-page__head--inline">
              <h2 id="impact-stats-heading" className="admin-panel__title">
                성과 지표 ({editLocale === 'ko' ? '한국어' : 'English'})
              </h2>
              <button type="button" className="admin-btn admin-btn--sm admin-btn--ghost" onClick={addStat}>
                항목 추가
              </button>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">항목명</th>
                    <th scope="col">숫자</th>
                    <th scope="col">단위 (선택)</th>
                    <th scope="col">삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {localeDoc.stats.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="admin-table__empty">
                        항목이 없습니다. 「항목 추가」로 넣어 주세요.
                      </td>
                    </tr>
                  ) : (
                    localeDoc.stats.map((row, idx) => (
                      <tr key={row.id}>
                        <td>
                          <input
                            className="admin-input"
                            value={row.label}
                            onChange={(e) => updateStat(idx, { label: e.target.value })}
                            placeholder="사업 참여자 수"
                            aria-label="항목명"
                          />
                        </td>
                        <td>
                          <input
                            className="admin-input"
                            value={row.value}
                            onChange={(e) => updateStat(idx, { value: e.target.value })}
                            placeholder="100,000"
                            aria-label="숫자"
                          />
                        </td>
                        <td>
                          <input
                            className="admin-input"
                            value={row.unit ?? ''}
                            onChange={(e) => updateStat(idx, { unit: e.target.value })}
                            placeholder="비우면 숨김"
                            aria-label="단위"
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="admin-btn admin-btn--sm admin-btn--danger-ghost"
                            onClick={() => removeStat(idx)}
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <p className="admin-upload__hint">
              항목 ID는 언어 간 매칭용입니다. 숫자(value)는 언어별로 같게 두어도 되고, 표시 형식만 다르게
              적을 수 있습니다.
            </p>
          </section>
        </>
      )}
    </div>
  )
}
