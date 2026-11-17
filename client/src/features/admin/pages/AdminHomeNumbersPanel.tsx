import { useCallback, useEffect, useState } from 'react'
import { adminFetchImpactPage, adminPutImpactPage } from '../../../services/api'
import { resetImpactPageCache } from '../../impact/useImpactPage'
import type { ImpactNumber, ImpactPageDocument } from '../../impact/impactPageTypes'

function moveCard(list: ImpactNumber[], idIndex: number, beforeIndex: number | null): ImpactNumber[] {
  if (beforeIndex === idIndex) return list
  const next = list.filter((_, index) => index !== idIndex)
  const target = beforeIndex == null ? next.length : beforeIndex > idIndex ? beforeIndex - 1 : beforeIndex
  next.splice(target, 0, list[idIndex])
  return next
}

export function AdminHomeNumbersPanel() {
  const [doc, setDoc] = useState<ImpactPageDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setDoc(await adminFetchImpactPage())
    } catch (e) {
      setError(e instanceof Error ? e.message : '불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const onSave = async () => {
    if (!doc) return
    setSaving(true)
    setError('')
    setSavedAt('')
    try {
      const saved = await adminPutImpactPage(doc)
      setDoc(saved)
      resetImpactPageCache()
      setSavedAt(new Date().toLocaleTimeString('ko-KR'))
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !doc) {
    return (
      <div className="admin-page__head">
        <p className="admin-panel__foot">{error || '불러오는 중…'}</p>
      </div>
    )
  }

  const shown = doc.homePublic ?? doc.public
  const setCard = (index: number, partial: Partial<ImpactNumber>) =>
    setDoc({ ...doc, homeNumbers: doc.homeNumbers.map((row, rowIndex) => (rowIndex === index ? { ...row, ...partial } : row)) })

  return (
    <>
      <div className="admin-page__head">
        <div>
          <p className="admin-page__desc">메인 · 사이트 설정</p>
          <h1 className="admin-page__title">② 숫자 섹션</h1>
        </div>
        <div className="admin-page__actions">
          <a className="admin-btn" href="/" target="_blank" rel="noopener noreferrer">미리보기</a>
          <button type="button" className="admin-btn admin-btn--primary" disabled={saving} onClick={() => void onSave()}>
            {saving ? '저장 중…' : '저장'}
          </button>
        </div>
      </div>
      {error ? <p className="admin-banner admin-banner--error">{error}</p> : null}
      {savedAt ? <p className="admin-panel__foot">저장됨 ({savedAt})</p> : null}

      <section className="admin-panel">
        <div className="admin-panel__head">
          <h2 className="admin-panel__title">② 숫자 섹션 (나눔의 결실 확장)</h2>
          <label className="admin-onoff" title="숫자 확정 전 숨김">
            <span>메인 표시</span>
            <span className={`admin-onoff__state${shown ? ' is-on' : ''}`} aria-hidden>
              {shown ? 'ON' : 'OFF'}
            </span>
            <input
              type="checkbox"
              role="switch"
              checked={shown}
              onChange={(e) => setDoc({ ...doc, homePublic: e.target.checked })}
              aria-label="메인 숫자 섹션 표시"
            />
            <span className="admin-onoff__track" aria-hidden>
              <span className="admin-onoff__thumb" />
            </span>
          </label>
        </div>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span className="admin-field__label">섹션 제목</span>
            <input className="admin-input" value={doc.homeTitle} onChange={(e) => setDoc({ ...doc, homeTitle: e.target.value })} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">부제</span>
            <input className="admin-input" value={doc.homeLead} onChange={(e) => setDoc({ ...doc, homeLead: e.target.value })} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">기준일</span>
            <input className="admin-input" value={doc.homeNote} onChange={(e) => setDoc({ ...doc, homeNote: e.target.value })} />
          </label>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
          {doc.homeNumbers.map((row, index) => {
            const source = row.source === 'impact' ? 'impact' : 'manual'
            return (
              <div
                key={index}
                className="admin-item"
                style={{ marginTop: 0, alignItems: 'center' }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const from = Number(e.dataTransfer.getData('text/plain'))
                  if (!Number.isInteger(from)) return
                  setDoc({ ...doc, homeNumbers: moveCard(doc.homeNumbers, from, index) })
                }}
              >
                <span
                  className="admin-org__grip"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', String(index))
                    e.dataTransfer.effectAllowed = 'move'
                  }}
                >
                  ⋮⋮
                </span>
                <b style={{ flex: '0 0 60px', fontSize: 13 }}>카드 {index + 1}</b>
                <div className="admin-segmented admin-segmented--tight" role="group" aria-label={`카드 ${index + 1} 입력 방식`}>
                  <button type="button" className={`admin-segmented__btn${source === 'manual' ? ' admin-segmented__btn--active' : ''}`} onClick={() => setCard(index, { source: 'manual' })}>직접 입력</button>
                  <button
                    type="button"
                    className={`admin-segmented__btn${source === 'impact' ? ' admin-segmented__btn--active' : ''}`}
                    onClick={() => setCard(index, { source: 'impact', impactKey: row.impactKey || doc.overview[0]?.label || '' })}
                  >
                    임팩트 데이터에서 선택
                  </button>
                </div>
                {source === 'impact' ? (
                  <select
                    className="admin-input"
                    style={{ flex: '1 1 200px', width: 'auto' }}
                    value={row.impactKey || ''}
                    onChange={(e) => setCard(index, { impactKey: e.target.value })}
                  >
                    <option value="">항목 선택</option>
                    {doc.overview.map((item) => (
                      <option key={item.label} value={item.label}>{item.label}</option>
                    ))}
                  </select>
                ) : (
                  <>
                    <input className="admin-input" style={{ flex: '1 1 180px', width: 'auto' }} aria-label="문구" value={row.label} onChange={(e) => setCard(index, { label: e.target.value })} />
                    <input className="admin-input" style={{ flex: '0 1 100px', width: 'auto' }} aria-label="숫자" value={row.value} onChange={(e) => setCard(index, { value: e.target.value })} />
                    <input className="admin-input" style={{ flex: '0 1 72px', width: 'auto' }} aria-label="단위" value={row.unit} onChange={(e) => setCard(index, { unit: e.target.value })} />
                  </>
                )}
                <label className="admin-org__check">
                  <input type="checkbox" checked={row.enabled !== false} onChange={(e) => setCard(index, { enabled: e.target.checked })} />
                  표시
                </label>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
