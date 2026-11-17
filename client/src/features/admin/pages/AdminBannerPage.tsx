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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState('')

  const slides = useMemo(
    () => [...doc.slides].sort((a, b) => a.order - b.order),
    [doc.slides],
  )
  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminFetchHeroBanner()
      setDoc(data)
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

  const updateCopy = (id: string, patch: Partial<{ alt: string; lines: string[]; smallLine: string }>) => {
    setDoc((prev) => ({
      ...prev,
      slides: prev.slides.map((s) =>
        s.id === id
          ? { ...s, locales: { ...s.locales, [editLocale]: { ...s.locales[editLocale], ...patch } } }
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
      mobileImage: '',
      align: 'left',
      dim: 'mid',
      buttons: [],
      locales: {
        ko: { alt: '', lines: [''], smallLine: '교육으로 사람을 세우는 국제개발협력 NGO, 카야인터내셔널' },
        en: { alt: '', lines: [''], smallLine: '' },
      },
    }
    setDoc((prev) => ({ ...prev, slides: [...prev.slides, blank] }))
  }

  const removeSlide = (slide: HeroBannerSlide) => {
    if (doc.slides.length <= 1) {
      window.alert('슬라이드는 최소 1개가 필요합니다.')
      return
    }
    if (!window.confirm(`${slide.order}번 슬라이드를 삭제할까요?`)) return
    setDoc({ ...doc, slides: doc.slides.filter((s) => s.id !== slide.id) })
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
              smallLine: (s.locales.ko.smallLine ?? '교육으로 사람을 세우는 국제개발협력 NGO, 카야인터내셔널').trim(),
            },
            en: {
              alt: s.locales.en.alt.trim(),
              lines: s.locales.en.lines.map((l) => l.trimEnd()),
              smallLine: (s.locales.en.smallLine ?? '').trim(),
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
          <p className="admin-page__desc">메인 · 사이트 설정</p>
          <h1 className="admin-page__title">① 메인 배너</h1>
        </div>
        <div className="admin-page__actions">
          <div className="admin-segmented" role="group" aria-label="편집 언어">
            {EDIT_LOCALES.map(({ id }) => (
              <button key={id} type="button" className={`admin-segmented__btn${editLocale === id ? ' admin-segmented__btn--active' : ''}`} onClick={() => setEditLocale(id)}>
                {id === 'ko' ? '국문' : '영문'}
              </button>
            ))}
          </div>
          <a className="admin-btn" href="/" target="_blank" rel="noopener noreferrer">미리보기</a>
          <button type="button" className="admin-btn admin-btn--primary" disabled={saving} onClick={() => void onSave()}>
            {saving ? '저장 중…' : '저장'}
          </button>
        </div>
      </div>

      {error ? <p className="admin-banner admin-banner--error">{error}</p> : null}
      {savedAt ? <p className="admin-panel__foot" role="status">저장됨 ({savedAt})</p> : null}

      <section className="admin-panel" aria-labelledby="hero-heading">
        <div className="admin-panel__head">
          <h2 id="hero-heading" className="admin-panel__title">① 메인 배너</h2>
          <span className="admin-panel__foot">슬라이드 {slides.length}개 · 끌어서 순서 변경</span>
        </div>
        {slides.map((slide) => {
          const copy = slide.locales[editLocale]
          const buttons = slide.buttons ?? []
          return (
            <div
              key={slide.id}
              className="admin-slide"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const id = e.dataTransfer.getData('text/plain')
                if (!id || id === slide.id) return
                const ordered = [...doc.slides].sort((a, b) => a.order - b.order)
                const moving = ordered.find((item) => item.id === id)
                if (!moving) return
                const rest = ordered.filter((item) => item.id !== id)
                const index = rest.findIndex((item) => item.id === slide.id)
                rest.splice(index < 0 ? rest.length : index, 0, moving)
                const orderOf = new Map(rest.map((item, itemIndex) => [item.id, itemIndex + 1]))
                setDoc((prev) => ({ ...prev, slides: prev.slides.map((item) => ({ ...item, order: orderOf.get(item.id) ?? item.order })) }))
              }}
            >
              <span
                className="admin-org__grip"
                draggable
                aria-label="순서 변경"
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', slide.id)
                  e.dataTransfer.effectAllowed = 'move'
                }}
              >
                ⋮⋮
              </span>
              <AdminMediaUpload layout="slot" slotTitle="PC 이미지" slotRatio="2.2 : 1" label="PC 이미지" variant="image" value={slide.image?.trim() ? slide.image : null} onChange={(url) => updateSlide(slide.id, { image: url ?? '' })} />
              <AdminMediaUpload layout="slot" slotTitle="모바일" slotRatio="4 : 5" label="모바일 이미지" variant="image" value={slide.mobileImage?.trim() ? slide.mobileImage : null} onChange={(url) => updateSlide(slide.id, { mobileImage: url ?? '' })} />
              <div className="admin-slide__fields">
                <div className="admin-form-grid">
                  <label className="admin-field admin-field--full">
                    <span className="admin-field__label">큰 문구</span>
                    <textarea className="admin-input" rows={2} value={copy.lines.join('\n')} onChange={(e) => updateCopy(slide.id, { lines: e.target.value.split('\n') })} />
                  </label>
                  <label className="admin-field admin-field--full">
                    <span className="admin-field__label">작은 문구</span>
                    <input className="admin-input" value={copy.smallLine ?? ''} onChange={(e) => updateCopy(slide.id, { smallLine: e.target.value })} />
                  </label>
                  <div className="admin-field">
                    <span className="admin-field__label">문구 위치</span>
                    <div className="admin-segmented" role="group" aria-label="문구 위치">
                      {(['left', 'center'] as const).map((align) => (
                        <button key={align} type="button" className={`admin-segmented__btn${(slide.align ?? 'left') === align ? ' admin-segmented__btn--active' : ''}`} onClick={() => updateSlide(slide.id, { align })}>{align === 'left' ? '왼쪽' : '가운데'}</button>
                      ))}
                    </div>
                  </div>
                  <div className="admin-field">
                    <span className="admin-field__label">사진 어둡게</span>
                    <div className="admin-segmented" role="group" aria-label="사진 어둡게">
                      {([['weak', '약하게'], ['mid', '보통'], ['strong', '강하게']] as const).map(([dim, label]) => (
                        <button key={dim} type="button" className={`admin-segmented__btn${(slide.dim ?? 'mid') === dim ? ' admin-segmented__btn--active' : ''}`} onClick={() => updateSlide(slide.id, { dim })}>{label}</button>
                      ))}
                    </div>
                  </div>
                  <div className="admin-field">
                    <span className="admin-field__label">표시</span>
                    <div className="admin-segmented" role="group" aria-label="슬라이드 표시">
                      <button type="button" className={`admin-segmented__btn${slide.enabled ? ' admin-segmented__btn--active' : ''}`} onClick={() => updateSlide(slide.id, { enabled: true })}>표시</button>
                      <button type="button" className={`admin-segmented__btn${!slide.enabled ? ' admin-segmented__btn--active' : ''}`} onClick={() => updateSlide(slide.id, { enabled: false })}>숨김</button>
                    </div>
                  </div>
                  {buttons.map((button, index) => (
                    <div key={index} className="admin-form-grid" style={{ gridColumn: '1 / -1' }}>
                      <label className="admin-field">
                        <span className="admin-field__label">버튼 {index + 1} 문구</span>
                        <input className="admin-input" value={button.label} onChange={(e) => updateSlide(slide.id, { buttons: buttons.map((item, itemIndex) => itemIndex === index ? { ...item, label: e.target.value } : item) })} />
                      </label>
                      <label className="admin-field">
                        <span className="admin-field__label">버튼 {index + 1} 링크</span>
                        <input className="admin-input" value={button.href} onChange={(e) => updateSlide(slide.id, { buttons: buttons.map((item, itemIndex) => itemIndex === index ? { ...item, href: e.target.value } : item) })} />
                      </label>
                    </div>
                  ))}
                  <label className="admin-field">
                    <span className="admin-field__label">이미지 설명</span>
                    <input className="admin-input" value={copy.alt} onChange={(e) => updateCopy(slide.id, { alt: e.target.value })} />
                  </label>
                </div>
                <div className="admin-form-actions">
                  {buttons.length < 2 ? (
                    <button type="button" className="admin-btn" onClick={() => updateSlide(slide.id, { buttons: [...buttons, { label: '', href: '' }] })}>+ 버튼 추가</button>
                  ) : null}
                  <button type="button" className="admin-btn admin-btn--danger-ghost" onClick={() => removeSlide(slide)} disabled={doc.slides.length <= 1}>삭제</button>
                </div>
              </div>
            </div>
          )
        })}
        <button type="button" className="admin-btn" style={{ marginTop: 12, color: 'var(--adm-wine)', borderStyle: 'dashed', borderColor: '#e3b3bd' }} onClick={addSlide}>+ 슬라이드 추가</button>
      </section>
    </div>
  )
}
