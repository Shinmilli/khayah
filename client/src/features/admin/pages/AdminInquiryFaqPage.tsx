import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_INQUIRY_FAQ,
  type InquiryFaqDocument,
  type InquiryFaqEditLocale,
  type InquiryFaqItem,
} from '../../../types/inquiryFaq'
import { adminFetchInquiryFaq, adminPutInquiryFaq } from '../../../services/api'

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

function newFaqId(): string {
  return `faq-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : String(Date.now())}`
}

const EDIT_LOCALES: { id: InquiryFaqEditLocale; label: string }[] = [
  { id: 'ko', label: '한국어' },
  { id: 'en', label: 'English' },
]

export function AdminInquiryFaqPage() {
  const [doc, setDoc] = useState<InquiryFaqDocument>(() => deepClone(DEFAULT_INQUIRY_FAQ))
  const [editLocale, setEditLocale] = useState<InquiryFaqEditLocale>('ko')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState('')

  const items = useMemo(() => doc.locales[editLocale].items, [doc, editLocale])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminFetchInquiryFaq()
      setDoc(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : '불러오지 못했습니다.')
      setDoc(deepClone(DEFAULT_INQUIRY_FAQ))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const patchItems = (nextItems: InquiryFaqItem[]) => {
    setDoc((prev) => ({
      ...prev,
      locales: {
        ...prev.locales,
        [editLocale]: { items: nextItems },
      },
    }))
  }

  const syncMetaToAllLocales = (id: string, patch: Pick<InquiryFaqItem, 'published' | 'order'>) => {
    setDoc((prev) => ({
      version: 2,
      locales: {
        ko: {
          items: prev.locales.ko.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
        },
        en: {
          items: prev.locales.en.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
        },
      },
    }))
  }

  const updateItem = (idx: number, patch: Partial<InquiryFaqItem>) => {
    const id = items[idx]?.id
    if (!id) return
    const metaKeys = patch.published !== undefined || patch.order !== undefined
    if (metaKeys && (patch.published !== undefined || patch.order !== undefined)) {
      syncMetaToAllLocales(id, {
        published: patch.published ?? items[idx].published,
        order: patch.order ?? items[idx].order,
      })
    }
    patchItems(items.map((item, i) => (i === idx ? { ...item, ...patch } : item)))
  }

  const addItem = () => {
    const id = newFaqId()
    const order = Math.max(0, ...doc.locales.ko.items.map((i) => i.order)) + 1
    const blank = { id, question: '', answer: '', published: true, order }
    setDoc((prev) => ({
      version: 2,
      locales: {
        ko: { items: [...prev.locales.ko.items, { ...blank }] },
        en: { items: [...prev.locales.en.items, { ...blank, question: '', answer: '' }] },
      },
    }))
  }

  const removeItem = (idx: number) => {
    const id = items[idx]?.id
    if (!id || !window.confirm('이 FAQ 항목을 삭제할까요? (한·영 모두 삭제)')) return
    setDoc((prev) => ({
      version: 2,
      locales: {
        ko: { items: prev.locales.ko.items.filter((item) => item.id !== id) },
        en: { items: prev.locales.en.items.filter((item) => item.id !== id) },
      },
    }))
  }

  const onSave = async () => {
    setSaving(true)
    setError('')
    setSavedAt('')
    try {
      const saved = await adminPutInquiryFaq(doc)
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
          <h1 className="admin-page__title">고객 문의 FAQ</h1>
          <p className="admin-page__desc">
            문의 페이지 FAQ 아코디언 문구를 한·영으로 관리합니다. 공개/순서는 언어 공통입니다.
          </p>
        </div>
        <button type="button" className="admin-btn admin-btn--primary" disabled={saving} onClick={() => void onSave()}>
          {saving ? '저장 중…' : '저장'}
        </button>
      </div>

      <div className="admin-locale-tabs" role="tablist" aria-label="FAQ 편집 언어">
        {EDIT_LOCALES.map((loc) => (
          <button
            key={loc.id}
            type="button"
            role="tab"
            aria-selected={editLocale === loc.id}
            className={`admin-locale-tabs__btn${editLocale === loc.id ? ' is-active' : ''}`}
            onClick={() => setEditLocale(loc.id)}
          >
            {loc.label}
          </button>
        ))}
      </div>

      {error ? <p className="admin-panel__foot" style={{ color: '#b00020' }}>{error}</p> : null}
      {savedAt ? <p className="admin-panel__foot" style={{ color: '#1b6b3a' }}>저장됨 ({savedAt})</p> : null}

      <section className="admin-panel">
        <div className="admin-page__head admin-page__head--inline">
          <h2 className="admin-panel__title">FAQ 항목</h2>
          <button type="button" className="admin-btn admin-btn--sm admin-btn--ghost" onClick={addItem}>
            항목 추가
          </button>
        </div>

        <div className="admin-form-grid">
          {items.map((item, idx) => (
            <div key={item.id} className="admin-panel admin-panel--nested">
              <div className="admin-form-grid">
                <label className="admin-field admin-field--full">
                  <span className="admin-field__label">질문</span>
                  <input
                    className="admin-input"
                    value={item.question}
                    onChange={(e) => updateItem(idx, { question: e.target.value })}
                  />
                </label>
                <label className="admin-field admin-field--full">
                  <span className="admin-field__label">답변</span>
                  <textarea
                    className="admin-input admin-input--textarea"
                    rows={4}
                    value={item.answer}
                    onChange={(e) => updateItem(idx, { answer: e.target.value })}
                  />
                </label>
                <label className="admin-field">
                  <span className="admin-field__label">순서</span>
                  <input
                    className="admin-input"
                    type="number"
                    value={item.order}
                    onChange={(e) => updateItem(idx, { order: parseInt(e.target.value, 10) || 0 })}
                  />
                </label>
                <div className="admin-field">
                  <span className="admin-field__label">공개</span>
                  <div className="admin-segmented admin-segmented--tight" role="group">
                    <button
                      type="button"
                      className={`admin-segmented__btn${item.published ? ' admin-segmented__btn--active' : ''}`}
                      onClick={() => updateItem(idx, { published: true })}
                    >
                      ON
                    </button>
                    <button
                      type="button"
                      className={`admin-segmented__btn${!item.published ? ' admin-segmented__btn--active' : ''}`}
                      onClick={() => updateItem(idx, { published: false })}
                    >
                      OFF
                    </button>
                  </div>
                </div>
                <div className="admin-field admin-field--full">
                  <button type="button" className="admin-btn admin-btn--danger-ghost" onClick={() => removeItem(idx)}>
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
