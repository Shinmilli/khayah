import { useCallback, useEffect, useState } from 'react'
import {
  DEFAULT_IMPACT_STATS,
  type ImpactStatItem,
  type ImpactStatsDocument,
} from '../../home/impactStatsTypes'
import { adminPutImpactStats, fetchImpactStats } from '../../../services/api'

function newStatId(): string {
  return `stat-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())}`
}

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

export function AdminImpactStatsPage() {
  const [doc, setDoc] = useState<ImpactStatsDocument>(() => deepClone(DEFAULT_IMPACT_STATS))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState<string>('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchImpactStats()
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

  const updateStat = (idx: number, patch: Partial<ImpactStatItem>) => {
    setDoc((prev) => ({
      ...prev,
      stats: prev.stats.map((row, i) => (i === idx ? { ...row, ...patch } : row)),
    }))
  }

  const removeStat = (idx: number) => {
    setDoc((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== idx),
    }))
  }

  const addStat = () => {
    setDoc((prev) => ({
      ...prev,
      stats: [...prev.stats, { id: newStatId(), label: '', value: '', unit: '' }],
    }))
  }

  const onSave = async () => {
    setSaving(true)
    setError('')
    try {
      const payload: ImpactStatsDocument = {
        version: 1,
        donut: {
          percent: doc.donut.percent,
          labelLines: doc.donut.labelLines.map((line) => line.trim()).filter(Boolean),
        },
        stats: doc.stats
          .filter((row) => row.label.trim() || row.value.trim() || row.unit?.trim())
          .map((row) => ({
            id: row.id.trim() || newStatId(),
            label: row.label.trim(),
            value: row.value.trim(),
            unit: row.unit?.trim() ?? '',
          })),
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

  const labelLinesText = doc.donut.labelLines.join('\n')

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1 className="admin-page__title">나눔의 결실</h1>
          <p className="admin-page__desc">
            홈 「나눔의 결실」 섹션의 도넛 비율·설명과 하단 성과 지표를 수정합니다. 단위(예: 명)는
            비워 두면 표시하지 않습니다. 라벨이 비어 있는 항목은 홈에 나오지 않습니다.
          </p>
        </div>
        <button type="button" className="admin-btn" disabled={saving || loading} onClick={() => void onSave()}>
          {saving ? '저장 중…' : '저장'}
        </button>
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
                <span className="admin-field__label">비율 (%)</span>
                <input
                  className="admin-input"
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={Number.isFinite(doc.donut.percent) ? doc.donut.percent : 0}
                  onChange={(e) =>
                    setDoc((prev) => ({
                      ...prev,
                      donut: { ...prev.donut, percent: parseFloat(e.target.value) || 0 },
                    }))
                  }
                />
              </label>
              <label className="admin-field admin-field--full">
                <span className="admin-field__label">도넛 안 설명 (줄마다 Enter)</span>
                <textarea
                  className="admin-input admin-input--area"
                  rows={3}
                  value={labelLinesText}
                  onChange={(e) =>
                    setDoc((prev) => ({
                      ...prev,
                      donut: {
                        ...prev.donut,
                        labelLines: e.target.value.split('\n'),
                      },
                    }))
                  }
                  placeholder={'수혜된 아동의\n교육지원'}
                />
              </label>
            </div>
          </section>

          <section className="admin-panel" aria-labelledby="impact-stats-heading">
            <div className="admin-page__head admin-page__head--inline">
              <h2 id="impact-stats-heading" className="admin-panel__title">
                성과 지표
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
                  {doc.stats.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="admin-table__empty">
                        항목이 없습니다. 「항목 추가」로 넣어 주세요.
                      </td>
                    </tr>
                  ) : (
                    doc.stats.map((row, idx) => (
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
          </section>
        </>
      )}
    </div>
  )
}
