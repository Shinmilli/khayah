import { useCallback, useEffect, useMemo, useState } from 'react'
import { BUSINESS_HUB_ICON_LABELS } from '../../business/businessHubCardIcons'
import {
  BUSINESS_HUB_ICONS,
  DEFAULT_BUSINESS_HUB_CARDS,
  type BusinessHub,
  type BusinessHubCard,
  type BusinessHubCardLocaleCopy,
  type BusinessHubCardsDocument,
  type BusinessHubEditLocale,
  type BusinessHubIcon,
} from '../../business/businessHubCardsTypes'
import { adminFetchBusinessHubCards, adminPutBusinessHubCards } from '../../../services/api'

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

function newCardId(): string {
  return `card-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : String(Date.now())}`
}

const EDIT_LOCALES: { id: BusinessHubEditLocale; label: string }[] = [
  { id: 'ko', label: '한국어' },
  { id: 'en', label: 'English' },
]

const HUB_LABEL: Record<BusinessHub, string> = {
  overseas: '해외사업',
  domestic: '국내사업',
}

const HUB_HREF_DEFAULT: Record<BusinessHub, string> = {
  overseas: '/business/overseas/education',
  domestic: '/business/domestic/education',
}

export function AdminBusinessHubCardsPage() {
  const [doc, setDoc] = useState<BusinessHubCardsDocument>(() => deepClone(DEFAULT_BUSINESS_HUB_CARDS))
  const [editLocale, setEditLocale] = useState<BusinessHubEditLocale>('ko')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState('')

  const cardsByHub = useMemo(() => {
    const grouped: Record<BusinessHub, BusinessHubCard[]> = { overseas: [], domestic: [] }
    for (const card of doc.cards) {
      grouped[card.hub].push(card)
    }
    grouped.overseas.sort((a, b) => a.order - b.order)
    grouped.domestic.sort((a, b) => a.order - b.order)
    return grouped
  }, [doc.cards])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminFetchBusinessHubCards()
      setDoc(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : '불러오지 못했습니다.')
      setDoc(deepClone(DEFAULT_BUSINESS_HUB_CARDS))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const updateCard = (id: string, patch: Partial<BusinessHubCard>) => {
    setDoc((prev) => ({
      ...prev,
      cards: prev.cards.map((card) => (card.id === id ? { ...card, ...patch } : card)),
    }))
  }

  const updateCopy = (id: string, patch: Partial<BusinessHubCardLocaleCopy>) => {
    setDoc((prev) => ({
      ...prev,
      cards: prev.cards.map((card) =>
        card.id === id
          ? {
              ...card,
              locales: {
                ...card.locales,
                [editLocale]: { ...card.locales[editLocale], ...patch },
              },
            }
          : card,
      ),
    }))
  }

  const addCard = (hub: BusinessHub) => {
    const order = Math.max(0, ...doc.cards.filter((c) => c.hub === hub).map((c) => c.order)) + 1
    const blank: BusinessHubCard = {
      id: newCardId(),
      hub,
      order,
      enabled: true,
      href: HUB_HREF_DEFAULT[hub],
      icon: 'education',
      locales: {
        ko: { title: '', description: '', buttonLabel: '자세히 보기' },
        en: { title: '', description: '', buttonLabel: 'Learn more' },
      },
    }
    setDoc((prev) => ({ ...prev, cards: [...prev.cards, blank] }))
  }

  const removeCard = (id: string, title: string) => {
    if (!window.confirm(`「${title || '제목 없음'}」 카드를 삭제할까요? (한·영 모두 삭제)`)) return
    setDoc((prev) => ({ ...prev, cards: prev.cards.filter((card) => card.id !== id) }))
  }

  const onSave = async () => {
    setSaving(true)
    setError('')
    setSavedAt('')
    try {
      const payload: BusinessHubCardsDocument = {
        version: 1,
        cards: doc.cards.map((card, i) => ({
          ...card,
          id: card.id.trim() || newCardId(),
          order: Number.isFinite(card.order) ? card.order : i + 1,
          href: card.href.trim(),
          locales: {
            ko: {
              title: card.locales.ko.title.trim(),
              description: card.locales.ko.description.trim(),
              buttonLabel: card.locales.ko.buttonLabel.trim(),
            },
            en: {
              title: card.locales.en.title.trim(),
              description: card.locales.en.description.trim(),
              buttonLabel: card.locales.en.buttonLabel.trim(),
            },
          },
        })),
      }
      const saved = await adminPutBusinessHubCards(payload)
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
          <h1 className="admin-page__title">국내·해외 사업 카드</h1>
          <p className="admin-page__desc">
            국내사업·해외사업 페이지 하단 카드(교육, 해외봉사단, 진행사업 등)의 문구와 공개 여부를 한·영으로
            관리합니다. OFF하면 해당 페이지에서 카드가 숨겨집니다. 상단 메뉴 표시는 「메뉴 표시」에서 따로 설정합니다.
          </p>
        </div>
        <button type="button" className="admin-btn admin-btn--primary" disabled={saving} onClick={() => void onSave()}>
          {saving ? '저장 중…' : '저장'}
        </button>
      </div>

      <div className="admin-locale-tabs" role="tablist" aria-label="카드 편집 언어">
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

      {error ? (
        <p className="admin-panel__foot" style={{ color: '#b00020' }}>
          {error}
        </p>
      ) : null}
      {savedAt ? (
        <p className="admin-panel__foot" style={{ color: '#1b6b3a' }}>
          저장됨 ({savedAt})
        </p>
      ) : null}

      {(['overseas', 'domestic'] as const).map((hub) => (
        <section key={hub} className="admin-panel">
          <div className="admin-page__head admin-page__head--inline">
            <h2 className="admin-panel__title">{HUB_LABEL[hub]}</h2>
            <button type="button" className="admin-btn admin-btn--sm admin-btn--ghost" onClick={() => addCard(hub)}>
              카드 추가
            </button>
          </div>

          <div className="admin-form-grid">
            {cardsByHub[hub].length === 0 ? (
              <p className="admin-panel__foot">등록된 카드가 없습니다.</p>
            ) : (
              cardsByHub[hub].map((card) => {
                const copy = card.locales[editLocale]
                return (
                  <div key={card.id} className="admin-panel admin-panel--nested">
                    <div className="admin-form-grid">
                      <label className="admin-field admin-field--full">
                        <span className="admin-field__label">제목</span>
                        <input
                          className="admin-input"
                          value={copy.title}
                          onChange={(e) => updateCopy(card.id, { title: e.target.value })}
                        />
                      </label>
                      <label className="admin-field admin-field--full">
                        <span className="admin-field__label">설명</span>
                        <textarea
                          className="admin-input admin-input--textarea"
                          rows={4}
                          value={copy.description}
                          onChange={(e) => updateCopy(card.id, { description: e.target.value })}
                        />
                      </label>
                      <label className="admin-field">
                        <span className="admin-field__label">버튼 문구</span>
                        <input
                          className="admin-input"
                          value={copy.buttonLabel}
                          onChange={(e) => updateCopy(card.id, { buttonLabel: e.target.value })}
                        />
                      </label>
                      <label className="admin-field">
                        <span className="admin-field__label">페이지</span>
                        <select
                          className="admin-input"
                          value={card.hub}
                          onChange={(e) => updateCard(card.id, { hub: e.target.value as BusinessHub })}
                        >
                          <option value="overseas">해외사업</option>
                          <option value="domestic">국내사업</option>
                        </select>
                      </label>
                      <label className="admin-field">
                        <span className="admin-field__label">링크</span>
                        <input
                          className="admin-input"
                          value={card.href}
                          onChange={(e) => updateCard(card.id, { href: e.target.value })}
                          placeholder="/business/..."
                        />
                      </label>
                      <label className="admin-field">
                        <span className="admin-field__label">아이콘</span>
                        <select
                          className="admin-input"
                          value={card.icon}
                          onChange={(e) => updateCard(card.id, { icon: e.target.value as BusinessHubIcon })}
                        >
                          {BUSINESS_HUB_ICONS.map((icon) => (
                            <option key={icon} value={icon}>
                              {BUSINESS_HUB_ICON_LABELS[icon]}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="admin-field">
                        <span className="admin-field__label">순서</span>
                        <input
                          className="admin-input"
                          type="number"
                          value={card.order}
                          onChange={(e) => updateCard(card.id, { order: parseInt(e.target.value, 10) || 0 })}
                        />
                      </label>
                      <div className="admin-field">
                        <span className="admin-field__label">공개</span>
                        <div className="admin-segmented admin-segmented--tight" role="group">
                          <button
                            type="button"
                            className={`admin-segmented__btn${card.enabled ? ' admin-segmented__btn--active' : ''}`}
                            onClick={() => updateCard(card.id, { enabled: true })}
                          >
                            ON
                          </button>
                          <button
                            type="button"
                            className={`admin-segmented__btn${!card.enabled ? ' admin-segmented__btn--active' : ''}`}
                            onClick={() => updateCard(card.id, { enabled: false })}
                          >
                            OFF
                          </button>
                        </div>
                      </div>
                      <div className="admin-field admin-field--full">
                        <button
                          type="button"
                          className="admin-btn admin-btn--danger-ghost"
                          onClick={() => removeCard(card.id, copy.title)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>
      ))}
    </div>
  )
}
