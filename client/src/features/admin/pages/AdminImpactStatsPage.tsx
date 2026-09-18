import { useCallback, useEffect, useMemo, useState } from 'react'
import { AdminMediaUpload } from '../components/AdminMediaUpload'
import { IMPACT_STAT_ICONS, resolveImpactStatIcon } from '../../home/impactStatIcons'
import {
  DEFAULT_IMPACT_STATS,
  emptyPrimaryCard,
  emptyStatItem,
  type ImpactEditLocale,
  type ImpactPrimaryCard,
  type ImpactPrimaryCardColors,
  type ImpactStatColors,
  type ImpactStatItem,
  type ImpactStatsDocument,
} from '../../home/impactStatsTypes'
import { adminFetchImpactStats, adminPutImpactStats } from '../../../services/api'

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

function hexForPicker(value: string): string {
  const s = value.trim()
  if (/^#[0-9a-fA-F]{6}$/i.test(s)) return s
  if (/^#[0-9a-fA-F]{3}$/i.test(s)) {
    return `#${s[1]}${s[1]}${s[2]}${s[2]}${s[3]}${s[3]}`
  }
  return '#000000'
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="admin-color-chip">
      <span className="admin-color-chip__label">{label}</span>
      <span className="admin-color-chip__row">
        <input type="color" value={hexForPicker(value)} onChange={(e) => onChange(e.target.value)} aria-label={label} />
        <input
          className="admin-color-chip__hex"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />
      </span>
    </label>
  )
}

const EDIT_LOCALES: { id: ImpactEditLocale; label: string }[] = [
  { id: 'ko', label: '한국어' },
  { id: 'en', label: 'English' },
]

const PRIMARY_COLOR_FIELDS: { key: keyof ImpactPrimaryCardColors; label: string }[] = [
  { key: 'cardBg', label: '카드 배경' },
  { key: 'kicker', label: '작은 영어' },
  { key: 'title', label: '제목' },
  { key: 'desc', label: '설명' },
  { key: 'ctaBg', label: '버튼 배경' },
  { key: 'ctaText', label: '버튼 글자' },
  { key: 'donutFill', label: '도넛 채움' },
  { key: 'donutTrack', label: '도넛 나머지' },
  { key: 'donutHole', label: '도넛 안쪽' },
  { key: 'donutValue', label: '도넛 숫자' },
  { key: 'donutSub', label: '도넛 설명' },
]

const STAT_COLOR_FIELDS: { key: keyof ImpactStatColors; label: string }[] = [
  { key: 'cardBg', label: '카드 배경' },
  { key: 'label', label: '항목명' },
  { key: 'value', label: '숫자' },
  { key: 'unit', label: '단위' },
  { key: 'iconBg', label: '아이콘 배경' },
  { key: 'iconColor', label: '아이콘' },
]

const IMPACT_SECTIONS = [
  { id: 'intro', label: '섹션 제목' },
  { id: 'background', label: '배경 이미지' },
  { id: 'primary', label: '메인 카드' },
  { id: 'stats', label: '성과 지표 카드' },
] as const

type ImpactSectionId = (typeof IMPACT_SECTIONS)[number]['id']

export function AdminImpactStatsPage() {
  const [tab, setTab] = useState<ImpactSectionId>('intro')
  const [doc, setDoc] = useState<ImpactStatsDocument>(() => deepClone(DEFAULT_IMPACT_STATS))
  const [editLocale, setEditLocale] = useState<ImpactEditLocale>('ko')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState('')

  const localeIntro = useMemo(() => doc.intro[editLocale], [doc, editLocale])
  const showLocale = tab === 'intro' || tab === 'primary' || tab === 'stats'

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

  const onSave = async () => {
    setSaving(true)
    setError('')
    try {
      const saved = await adminPutImpactStats(doc)
      setDoc(saved)
      setSavedAt(new Date().toLocaleTimeString('ko-KR'))
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const patchIntro = (patch: Partial<typeof localeIntro>) => {
    setDoc((prev) => ({
      ...prev,
      intro: { ...prev.intro, [editLocale]: { ...prev.intro[editLocale], ...patch } },
    }))
  }

  const updatePrimary = (idx: number, patch: Partial<ImpactPrimaryCard>) => {
    setDoc((prev) => ({
      ...prev,
      primaryCards: prev.primaryCards.map((card, i) => (i === idx ? { ...card, ...patch } : card)),
    }))
  }

  const updateStat = (idx: number, patch: Partial<ImpactStatItem>) => {
    setDoc((prev) => ({
      ...prev,
      stats: prev.stats.map((row, i) => (i === idx ? { ...row, ...patch } : row)),
    }))
  }

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1 className="admin-page__title">나눔의 결실</h1>
          <p className="admin-page__desc">항목을 누르면 아래에서 바로 수정할 수 있습니다.</p>
        </div>
        <button type="button" className="admin-btn" disabled={saving || loading} onClick={() => void onSave()}>
          {saving ? '저장 중…' : '저장'}
        </button>
      </div>

      <div className="admin-impact-tabs" role="tablist" aria-label="나눔의 결실 항목">
        {IMPACT_SECTIONS.map((row) => (
          <button
            key={row.id}
            type="button"
            role="tab"
            aria-selected={tab === row.id}
            className={`admin-impact-tabs__btn${tab === row.id ? ' is-active' : ''}`}
            onClick={() => setTab(row.id)}
          >
            {row.label}
          </button>
        ))}
      </div>

      {showLocale ? (
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
      ) : null}

      {error ? <p className="admin-banner admin-banner--error">{error}</p> : null}
      {savedAt ? (
        <p className="admin-panel__foot" role="status">
          저장됨 ({savedAt})
        </p>
      ) : null}

      {loading ? (
        <p className="admin-panel__foot">불러오는 중…</p>
      ) : tab === 'intro' ? (
        <section className="admin-panel" aria-labelledby="impact-intro-heading">
          <h2 id="impact-intro-heading" className="admin-panel__title">
            문구
          </h2>
          <div className="admin-form-grid">
            <label className="admin-field">
              <span className="admin-field__label">작은 제목 (kicker)</span>
              <input
                className="admin-input"
                value={localeIntro.kicker}
                onChange={(e) => patchIntro({ kicker: e.target.value })}
              />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">큰 제목</span>
              <input
                className="admin-input"
                value={localeIntro.title}
                onChange={(e) => patchIntro({ title: e.target.value })}
              />
            </label>
            <label className="admin-field admin-field--full">
              <span className="admin-field__label">부제</span>
              <input
                className="admin-input"
                value={localeIntro.subtitle}
                onChange={(e) => patchIntro({ subtitle: e.target.value })}
              />
            </label>
            <label className="admin-field admin-field--full">
              <span className="admin-field__label">회전 문구 (줄마다 하나, 예: 01. 투명하게 증명합니다)</span>
              <textarea
                className="admin-input admin-input--area"
                rows={4}
                value={localeIntro.rotator.join('\n')}
                onChange={(e) => patchIntro({ rotator: e.target.value.split('\n') })}
              />
            </label>
            <div className="admin-field">
              <ColorField
                label="회전 문구 색상"
                value={doc.introColors.rotator}
                onChange={(v) => setDoc((prev) => ({ ...prev, introColors: { ...prev.introColors, rotator: v } }))}
              />
            </div>
          </div>
        </section>
      ) : tab === 'background' ? (
        <section className="admin-panel" aria-labelledby="impact-bg-heading">
          <h2 id="impact-bg-heading" className="admin-panel__title">
            이미지
          </h2>
          <AdminMediaUpload
            label="나눔의 결실 배경"
            hint="비우면 기본 배경이 사용됩니다."
            variant="image"
            layout="wide"
            value={doc.backgroundImageUrl.trim() ? doc.backgroundImageUrl : null}
            onChange={(url) => setDoc((prev) => ({ ...prev, backgroundImageUrl: url ?? '' }))}
          />
        </section>
      ) : tab === 'primary' ? (
        <section className="admin-panel" aria-labelledby="impact-primary-heading">
          <div className="admin-page__head admin-page__head--inline">
            <h2 id="impact-primary-heading" className="admin-panel__title">
              빨간 카드
            </h2>
            <button
              type="button"
              className="admin-btn admin-btn--sm admin-btn--ghost"
              onClick={() => setDoc((prev) => ({ ...prev, primaryCards: [...prev.primaryCards, emptyPrimaryCard()] }))}
            >
              카드 추가
            </button>
          </div>
          {doc.primaryCards.length === 0 ? (
            <p className="admin-table__empty">빨간 카드가 없습니다.</p>
          ) : (
            doc.primaryCards.map((card, idx) => {
              const loc = card.locales[editLocale]
              return (
                <div key={card.id} className="admin-impact-card-editor">
                  <div className="admin-page__head admin-page__head--inline">
                    <h3 className="admin-panel__title">카드 {idx + 1}</h3>
                    <button
                      type="button"
                      className="admin-btn admin-btn--sm admin-btn--danger-ghost"
                      onClick={() =>
                        setDoc((prev) => ({
                          ...prev,
                          primaryCards: prev.primaryCards.filter((_, i) => i !== idx),
                        }))
                      }
                    >
                      삭제
                    </button>
                  </div>
                  <div className="admin-form-grid">
                    <label className="admin-field">
                      <span className="admin-field__label">작은 영어 (Our Work)</span>
                      <input
                        className="admin-input"
                        value={loc.kicker}
                        onChange={(e) =>
                          updatePrimary(idx, {
                            locales: {
                              ...card.locales,
                              [editLocale]: { ...loc, kicker: e.target.value },
                            },
                          })
                        }
                      />
                    </label>
                    <label className="admin-field">
                      <span className="admin-field__label">제목</span>
                      <input
                        className="admin-input"
                        value={loc.title}
                        onChange={(e) =>
                          updatePrimary(idx, {
                            locales: {
                              ...card.locales,
                              [editLocale]: { ...loc, title: e.target.value },
                            },
                          })
                        }
                      />
                    </label>
                    <label className="admin-field admin-field--full">
                      <span className="admin-field__label">설명 (Khayah는 후원금을…)</span>
                      <textarea
                        className="admin-input admin-input--area"
                        rows={3}
                        value={loc.desc}
                        onChange={(e) =>
                          updatePrimary(idx, {
                            locales: {
                              ...card.locales,
                              [editLocale]: { ...loc, desc: e.target.value },
                            },
                          })
                        }
                      />
                    </label>
                    <label className="admin-field">
                      <span className="admin-field__label">자세히 보기 문구</span>
                      <input
                        className="admin-input"
                        value={loc.ctaLabel}
                        onChange={(e) =>
                          updatePrimary(idx, {
                            locales: {
                              ...card.locales,
                              [editLocale]: { ...loc, ctaLabel: e.target.value },
                            },
                          })
                        }
                      />
                    </label>
                    <label className="admin-field">
                      <span className="admin-field__label">자세히 보기 링크</span>
                      <input
                        className="admin-input"
                        value={loc.ctaHref}
                        onChange={(e) =>
                          updatePrimary(idx, {
                            locales: {
                              ...card.locales,
                              [editLocale]: { ...loc, ctaHref: e.target.value },
                            },
                          })
                        }
                        placeholder="/about/financial-report"
                      />
                    </label>
                    <label className="admin-field">
                      <span className="admin-field__label">도넛 비율 (%) — 한·영 공통</span>
                      <input
                        className="admin-input"
                        type="number"
                        min={0}
                        max={100}
                        step={0.1}
                        value={Number.isFinite(loc.donut.percent) ? loc.donut.percent : 0}
                        onChange={(e) => {
                          const percent = parseFloat(e.target.value) || 0
                          updatePrimary(idx, {
                            locales: {
                              ko: { ...card.locales.ko, donut: { ...card.locales.ko.donut, percent } },
                              en: { ...card.locales.en, donut: { ...card.locales.en.donut, percent } },
                            },
                          })
                        }}
                      />
                    </label>
                    <label className="admin-field">
                      <span className="admin-field__label">도넛 안 설명 (줄마다 Enter)</span>
                      <textarea
                        className="admin-input admin-input--area"
                        rows={3}
                        value={loc.donut.labelLines.join('\n')}
                        onChange={(e) =>
                          updatePrimary(idx, {
                            locales: {
                              ...card.locales,
                              [editLocale]: {
                                ...loc,
                                donut: { ...loc.donut, labelLines: e.target.value.split('\n') },
                              },
                            },
                          })
                        }
                      />
                    </label>
                  </div>
                  <p className="admin-upload__hint" style={{ marginTop: 12 }}>
                    카드·글자·도넛 색상
                  </p>
                  <div className="admin-color-grid">
                    {PRIMARY_COLOR_FIELDS.map(({ key, label }) => (
                      <ColorField
                        key={key}
                        label={label}
                        value={card.colors[key]}
                        onChange={(v) => updatePrimary(idx, { colors: { ...card.colors, [key]: v } })}
                      />
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </section>
      ) : (
        <section className="admin-panel" aria-labelledby="impact-stats-heading">
          <div className="admin-page__head admin-page__head--inline">
            <h2 id="impact-stats-heading" className="admin-panel__title">
              흰 카드
            </h2>
            <button
              type="button"
              className="admin-btn admin-btn--sm admin-btn--ghost"
              onClick={() => setDoc((prev) => ({ ...prev, stats: [...prev.stats, emptyStatItem()] }))}
            >
              카드 추가
            </button>
          </div>
          {doc.stats.length === 0 ? (
            <p className="admin-table__empty">흰 카드가 없습니다.</p>
          ) : (
            doc.stats.map((row, idx) => {
              const loc = row.locales[editLocale]
              const iconName = resolveImpactStatIcon(row.icon, row.id)
              return (
                <div key={row.id} className="admin-impact-card-editor">
                  <div className="admin-page__head admin-page__head--inline">
                    <h3 className="admin-panel__title">지표 {idx + 1}</h3>
                    <button
                      type="button"
                      className="admin-btn admin-btn--sm admin-btn--danger-ghost"
                      onClick={() =>
                        setDoc((prev) => ({ ...prev, stats: prev.stats.filter((_, i) => i !== idx) }))
                      }
                    >
                      삭제
                    </button>
                  </div>
                  <div className="admin-form-grid">
                    <label className="admin-field">
                      <span className="admin-field__label">아이콘 (한·영 공통)</span>
                      <div className="admin-icon-picker">
                        <span className="admin-icon-picker__preview" aria-hidden="true">
                          <span className="material-symbols-outlined">{iconName}</span>
                        </span>
                        <select
                          className="admin-input"
                          value={iconName}
                          onChange={(e) => updateStat(idx, { icon: e.target.value })}
                        >
                          {IMPACT_STAT_ICONS.map((opt) => (
                            <option key={opt.name} value={opt.name}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </label>
                    <label className="admin-field">
                      <span className="admin-field__label">항목명</span>
                      <input
                        className="admin-input"
                        value={loc.label}
                        onChange={(e) =>
                          updateStat(idx, {
                            locales: { ...row.locales, [editLocale]: { ...loc, label: e.target.value } },
                          })
                        }
                      />
                    </label>
                    <label className="admin-field">
                      <span className="admin-field__label">숫자</span>
                      <input
                        className="admin-input"
                        value={loc.value}
                        onChange={(e) =>
                          updateStat(idx, {
                            locales: { ...row.locales, [editLocale]: { ...loc, value: e.target.value } },
                          })
                        }
                      />
                    </label>
                    <label className="admin-field">
                      <span className="admin-field__label">단위</span>
                      <input
                        className="admin-input"
                        value={loc.unit}
                        onChange={(e) =>
                          updateStat(idx, {
                            locales: { ...row.locales, [editLocale]: { ...loc, unit: e.target.value } },
                          })
                        }
                      />
                    </label>
                  </div>
                  <div className="admin-color-grid">
                    {STAT_COLOR_FIELDS.map(({ key, label }) => (
                      <ColorField
                        key={key}
                        label={label}
                        value={row.colors[key]}
                        onChange={(v) => updateStat(idx, { colors: { ...row.colors, [key]: v } })}
                      />
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </section>
      )}
    </div>
  )
}
