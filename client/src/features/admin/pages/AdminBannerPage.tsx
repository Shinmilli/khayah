import { useCallback, useEffect, useMemo, useState } from 'react'
import { AdminMediaUpload } from '../components/AdminMediaUpload'
import {
  DEFAULT_HERO_BANNER,
  type HeroBannerDocument,
  type HeroBannerEditLocale,
  type HeroBannerSlide,
} from '../../home/heroBannerTypes'
import { adminFetchHeroBanner, adminPutHeroBanner } from '../../../services/api'

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

function newSlideId(): string {
  return `h-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : String(Date.now())}`
}

const EDIT_LOCALES: { id: HeroBannerEditLocale; label: string }[] = [
  { id: 'ko', label: '한국어' },
  { id: 'en', label: 'English' },
]

export function AdminBannerPage() {
  const [doc, setDoc] = useState<HeroBannerDocument>(() => deepClone(DEFAULT_HERO_BANNER))
  const [editLocale, setEditLocale] = useState<HeroBannerEditLocale>('ko')
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_HERO_BANNER.slides[0]?.id ?? '')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState('')

  const slides = useMemo(
    () => [...doc.slides].sort((a, b) => a.order - b.order),
    [doc.slides],
  )
  const selected = slides.find((s) => s.id === selectedId) ?? slides[0] ?? null
  const selectedCopy = selected?.locales[editLocale]

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminFetchHeroBanner()
      setDoc(data)
      setSelectedId((cur) => {
        if (data.slides.some((s) => s.id === cur)) return cur
        return data.slides[0]?.id ?? ''
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : '불러오지 못했습니다.')
      setDoc(deepClone(DEFAULT_HERO_BANNER))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const updateSlide = (id: string, patch: Partial<HeroBannerSlide>) => {
    setDoc((prev) => ({
      ...prev,
      slides: prev.slides.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }))
  }

  const updateSelectedCopy = (patch: Partial<{ alt: string; lines: string[] }>) => {
    if (!selected) return
    setDoc((prev) => ({
      ...prev,
      slides: prev.slides.map((s) =>
        s.id === selected.id
          ? {
              ...s,
              locales: {
                ...s.locales,
                [editLocale]: { ...s.locales[editLocale], ...patch },
              },
            }
          : s,
      ),
    }))
  }

  const addSlide = () => {
    const order = Math.max(0, ...doc.slides.map((s) => s.order)) + 1
    const id = newSlideId()
    const blank: HeroBannerSlide = {
      id,
      order,
      enabled: true,
      image: '',
      locales: {
        ko: { alt: '', lines: [''] },
        en: { alt: '', lines: [''] },
      },
    }
    setDoc((prev) => ({ ...prev, slides: [...prev.slides, blank] }))
    setSelectedId(id)
  }

  const removeSelected = () => {
    if (!selected) return
    if (doc.slides.length <= 1) {
      window.alert('슬라이드는 최소 1개가 필요합니다.')
      return
    }
    if (!window.confirm(`${selected.order}번 슬라이드를 삭제할까요?`)) return
    const next = doc.slides.filter((s) => s.id !== selected.id)
    setDoc({ ...doc, slides: next })
    setSelectedId(next[0]?.id ?? '')
  }

  const onSave = async () => {
    setSaving(true)
    setError('')
    setSavedAt('')
    try {
      const payload: HeroBannerDocument = {
        version: 1,
        slides: doc.slides.map((s, i) => ({
          ...s,
          id: s.id.trim() || newSlideId(),
          order: Number.isFinite(s.order) ? s.order : i + 1,
          image: s.image.trim(),
          locales: {
            ko: {
              alt: s.locales.ko.alt.trim(),
              lines: s.locales.ko.lines.map((l) => l.trimEnd()),
            },
            en: {
              alt: s.locales.en.alt.trim(),
              lines: s.locales.en.lines.map((l) => l.trimEnd()),
            },
          },
        })),
      }
      const saved = await adminPutHeroBanner(payload)
      setDoc(saved)
      setSavedAt(new Date().toLocaleTimeString('ko-KR'))
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장에 실패했습니다.')
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

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1 className="admin-page__title">메인 배너 관리</h1>
          <p className="admin-page__desc">
            홈 상단 히어로 슬라이드의 배경 이미지·문구·alt를 한·영으로 관리합니다. 이미지는 공통, 문구는
            언어별입니다. 저장 후 공개 홈(`/`, `/en`)에 반영됩니다.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={addSlide}>
            슬라이드 추가
          </button>
          <button type="button" className="admin-btn admin-btn--primary" disabled={saving} onClick={() => void onSave()}>
            {saving ? '저장 중…' : '저장'}
          </button>
        </div>
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

      <section className="admin-panel" aria-labelledby="hero-heading">
        <h2 id="hero-heading" className="admin-panel__title">
          홈 히어로 슬라이드
        </h2>

        <div className="admin-split admin-split--hero">
          <div>
            <h3 className="admin-subpanel__title">슬라이드 목록</h3>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">순서</th>
                    <th scope="col">표시</th>
                    <th scope="col">문구 미리보기</th>
                    <th scope="col">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {slides.map((slide) => (
                    <tr
                      key={slide.id}
                      className={slide.id === selected?.id ? 'admin-table__row--selected' : undefined}
                    >
                      <td>{slide.order}</td>
                      <td>{slide.enabled ? 'ON' : 'OFF'}</td>
                      <td>
                        <span className="admin-hero-preview">
                          {slide.locales[editLocale].lines.filter(Boolean).join(' · ') || '(문구 없음)'}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="admin-btn admin-btn--sm admin-btn--ghost"
                          onClick={() => setSelectedId(slide.id)}
                        >
                          편집 선택
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="admin-subpanel__title">선택 슬라이드 편집</h3>
            {selected && selectedCopy ? (
              <>
                <p className="admin-fieldset__hint admin-fieldset__hint--flush">
                  슬라이드: {selected.order}번 · {selectedCopy.alt || '(alt 없음)'}
                </p>
                <div className="admin-form-grid">
                  <div className="admin-field admin-field--full">
                    <span className="admin-field__label">표시</span>
                    <div className="admin-segmented admin-segmented--tight" role="group" aria-label="슬라이드 표시">
                      <button
                        type="button"
                        className={`admin-segmented__btn${selected.enabled ? ' admin-segmented__btn--active' : ''}`}
                        onClick={() => updateSlide(selected.id, { enabled: true })}
                      >
                        ON
                      </button>
                      <button
                        type="button"
                        className={`admin-segmented__btn${!selected.enabled ? ' admin-segmented__btn--active' : ''}`}
                        onClick={() => updateSlide(selected.id, { enabled: false })}
                      >
                        OFF
                      </button>
                    </div>
                  </div>
                  <label className="admin-field">
                    <span className="admin-field__label">순서</span>
                    <input
                      className="admin-input"
                      type="number"
                      value={selected.order}
                      onChange={(e) =>
                        updateSlide(selected.id, { order: parseInt(e.target.value, 10) || selected.order })
                      }
                    />
                  </label>
                  <AdminMediaUpload
                    label="배너 배경 이미지 (한·영 공통)"
                    hint="16:9 권장 · 업로드 후 「저장」을 누르면 홈에 반영됩니다."
                    variant="image"
                    layout="wide"
                    value={selected.image?.trim() ? selected.image : null}
                    onChange={(url) => updateSlide(selected.id, { image: url ?? '' })}
                  />
                  {!/^https?:\/\//i.test(selected.image) && selected.image.trim() ? (
                    <p className="admin-media-upload__hint">
                      현재 경로: {selected.image} — 업로드하면 HTTPS URL로 교체할 수 있습니다.
                    </p>
                  ) : null}
                  <label className="admin-field admin-field--full">
                    <span className="admin-field__label">
                      배너 문구 ({editLocale === 'ko' ? '한국어' : 'English'}, 줄마다 Enter)
                    </span>
                    <textarea
                      className="admin-input admin-input--area"
                      rows={4}
                      value={selectedCopy.lines.join('\n')}
                      onChange={(e) =>
                        updateSelectedCopy({
                          lines: e.target.value.split('\n').map((l) => l.trimEnd()),
                        })
                      }
                    />
                  </label>
                  <label className="admin-field admin-field--full">
                    <span className="admin-field__label">
                      이미지 설명 alt ({editLocale === 'ko' ? '한국어' : 'English'})
                    </span>
                    <input
                      className="admin-input"
                      type="text"
                      value={selectedCopy.alt}
                      onChange={(e) => updateSelectedCopy({ alt: e.target.value })}
                    />
                  </label>
                </div>
                <div className="admin-form-actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn--danger-ghost"
                    onClick={removeSelected}
                    disabled={doc.slides.length <= 1}
                  >
                    이 슬라이드 삭제
                  </button>
                </div>
              </>
            ) : (
              <p className="admin-panel__foot">슬라이드를 추가해 주세요.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
