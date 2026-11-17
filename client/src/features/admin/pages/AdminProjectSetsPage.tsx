import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AdminMediaUpload } from '../components/AdminMediaUpload'
import { adminFetchProjectSets, adminPutProjectSets } from '../../../services/api'
import { resetProjectSetsCache } from '../../projects/useProjectSets'
import type { ProjectListKind } from '../../projects/publicProjectSets'
import {
  PROJECT_CATEGORIES,
  PROJECT_FIELDS,
  type ProjectCategory,
  type ProjectPageKey,
  type ProjectSetRecord,
  type ProjectSetsDocument,
} from '../../projects/projectSetTypes'

type TabId = 'sets' | ProjectPageKey

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'sets', label: '진행사업 관리' },
  { id: 'domestic', label: '국내 진행사업' },
  { id: 'overseas', label: '해외 진행사업' },
  { id: 'education', label: '해외 교육 진행사업' },
  { id: 'volunteer', label: '해외봉사단 진행사업' },
  { id: 'research', label: '연구사업 진행사업' },
]

const PAGE_KIND: Record<ProjectPageKey, ProjectListKind> = {
  domestic: 'domestic',
  overseas: 'overseas',
  education: 'overseas-education',
  volunteer: 'volunteer',
  research: 'research',
}

function OnOff({ enabled, onChange, label }: { enabled: boolean; onChange: (next: boolean) => void; label: string }) {
  return (
    <div className="admin-segmented admin-segmented--tight" role="group" aria-label={label}>
      <button type="button" className={`admin-segmented__btn${enabled ? ' admin-segmented__btn--active' : ''}`} onClick={() => onChange(true)}>
        ON
      </button>
      <button type="button" className={`admin-segmented__btn${!enabled ? ' admin-segmented__btn--active' : ''}`} onClick={() => onChange(false)}>
        OFF
      </button>
    </div>
  )
}

function blankSet(order: number): ProjectSetRecord {
  return {
    id: `set-${Date.now()}`,
    category: '국내',
    field: '',
    year: new Date().getFullYear(),
    enabled: true,
    order,
    eyebrow: '',
    title: '',
    period: '',
    audience: '',
    partner: '',
    paragraphs: [],
    slides: [{ src: '', alt: '' }],
    showArrows: true,
    emphasizeLast: false,
    stepsOn: true,
    steps: [
      { kicker: '', title: '', detail: '' },
      { kicker: '', title: '', detail: '' },
    ],
    factsOn: true,
    facts: [
      { value: '', unit: '', label: '' },
      { value: '', unit: '', label: '' },
      { value: '', unit: '', label: '' },
    ],
    note: '',
    photosOn: true,
    photos: [
      { src: '', alt: '' },
      { src: '', alt: '' },
      { src: '', alt: '' },
    ],
  }
}

const PROJECT_TABS: TabId[] = ['sets', 'domestic', 'overseas', 'education', 'volunteer', 'research']

function projectTab(raw: string | null): TabId {
  return PROJECT_TABS.includes(raw as TabId) ? (raw as TabId) : 'sets'
}

export function AdminProjectSetsPage() {
  const [params, setParams] = useSearchParams()
  const tab = projectTab(params.get('tab'))
  const setTab = (next: TabId) => {
    const nextParams = new URLSearchParams(params)
    nextParams.set('tab', next)
    setParams(nextParams, { replace: true })
  }
  const [doc, setDoc] = useState<ProjectSetsDocument | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [category, setCategory] = useState<ProjectCategory | '전체'>('전체')
  const [year, setYear] = useState<string>('전체')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const next = await adminFetchProjectSets()
      setDoc(next)
      setSelectedId(next.items[0]?.id ?? null)
    } catch (e) {
      setError(e instanceof Error ? e.message : '불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const years = useMemo(() => {
    const values = new Set<number>()
    for (const item of doc?.items ?? []) {
      if (typeof item.year === 'number') values.add(item.year)
    }
    return [...values].sort((a, b) => b - a)
  }, [doc])

  const updateItem = (id: string, patch: Partial<ProjectSetRecord>) => {
    setDoc((prev) => (prev ? { ...prev, items: prev.items.map((item) => (item.id === id ? { ...item, ...patch } : item)) } : prev))
  }

  const onSave = async () => {
    if (!doc) return
    setSaving(true)
    setError('')
    setSavedAt('')
    try {
      const saved = await adminPutProjectSets(doc)
      setDoc(saved)
      resetProjectSetsCache()
      setSavedAt(new Date().toLocaleTimeString('ko-KR'))
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !doc) {
    return (
      <div className="admin-page">
        <p className="admin-panel__foot">{error || '불러오는 중…'}</p>
      </div>
    )
  }

  const selected = doc.items.find((item) => item.id === selectedId) ?? null
  const listed = doc.items.filter((item) => {
    if (category !== '전체' && item.category !== category) return false
    if (year === '전체') return true
    if (year === '미정') return item.year == null
    return String(item.year) === year
  })

  const move = (id: string, dir: -1 | 1) => {
    const index = listed.findIndex((item) => item.id === id)
    const other = listed[index + dir]
    if (!other) return
    setDoc({
      ...doc,
      items: doc.items.map((item) => {
        if (item.id === id) return { ...item, order: other.order }
        if (item.id === other.id) return { ...item, order: doc.items.find((row) => row.id === id)?.order ?? item.order }
        return item
      }),
    })
  }

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <p className="admin-page__desc">사업</p>
          <h1 className="admin-page__title">{TABS.find((item) => item.id === tab)?.label}</h1>
        </div>
        <div className="admin-page__actions">
          <a className="admin-btn" href={tab === 'domestic' ? '/business/domestic/projects' : tab === 'overseas' ? '/business/overseas/projects' : tab === 'education' ? '/business/overseas/education/projects' : tab === 'volunteer' ? '/business/overseas/volunteer/projects' : tab === 'research' ? '/business/advocacy/projects' : '/business/domestic/projects'} target="_blank" rel="noopener noreferrer">미리보기</a>
          <button type="button" className="admin-btn admin-btn--primary" disabled={saving} onClick={() => void onSave()}>
            {saving ? '저장 중…' : '저장'}
          </button>
        </div>
      </div>
      {tab === 'sets' ? <p className="admin-callout">국내·해외·연구 진행사업을 한 곳에서 입력합니다. 사업 하나 = 사업 세트 하나이며, 비운 영역은 화면에서 빠집니다.</p> : null}
      {error ? <p className="admin-banner admin-banner--error">{error}</p> : null}
      {savedAt ? <p className="admin-panel__foot">저장됨 ({savedAt})</p> : null}
      {tab !== 'sets' ? (
        <PageTab
          doc={doc}
          pageKey={tab}
          onChange={(header) => setDoc({ ...doc, pages: { ...doc.pages, [tab]: header } })}
          onEdit={(id) => {
            setSelectedId(id)
            setTab('sets')
          }}
        />
      ) : (
        <>
          <section className="admin-panel">
            <h2 className="admin-panel__title">① 사업 목록</h2>
            <div className="admin-form-grid">
              <label className="admin-field">
                <span className="admin-field__label">카테고리</span>
                <select className="admin-input" value={category} onChange={(e) => setCategory(e.target.value as ProjectCategory | '전체')}>
                  <option value="전체">전체</option>
                  {PROJECT_CATEGORIES.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-field">
                <span className="admin-field__label">연도</span>
                <select className="admin-input" value={year} onChange={(e) => setYear(e.target.value)}>
                  <option value="전체">전체</option>
                  {years.map((value) => (
                    <option key={value} value={String(value)}>
                      {value}
                    </option>
                  ))}
                  <option value="미정">연도 미정</option>
                </select>
              </label>
            </div>
            <button
              type="button"
              className="admin-btn"
              onClick={() => {
                const next = blankSet(doc.items.length)
                setDoc({ ...doc, items: [...doc.items, next] })
                setSelectedId(next.id)
              }}
            >
              + 사업 추가
            </button>
            <ul className="admin-list">
              {listed.map((item, index) => (
                <li key={item.id}>
                  <button type="button" className="admin-btn" onClick={() => setSelectedId(item.id)}>
                    {item.year ?? '연도 미정'} · {item.category} · {item.field || '분야 없음'} · {item.title || '(사업명 없음)'}
                  </button>
                  <OnOff enabled={item.enabled} label="공개" onChange={(enabled) => updateItem(item.id, { enabled })} />
                  <button type="button" className="admin-btn" disabled={index === 0} onClick={() => move(item.id, -1)}>
                    ↑
                  </button>
                  <button type="button" className="admin-btn" disabled={index === listed.length - 1} onClick={() => move(item.id, 1)}>
                    ↓
                  </button>
                </li>
              ))}
            </ul>
            <p className="admin-panel__foot">같은 연도 안의 순서는 화살표로 바꿉니다. 입력은 이 화면 한 곳입니다.</p>
          </section>
          {selected ? (
            <SetEditor
              item={selected}
              onChange={(patch) => updateItem(selected.id, patch)}
              onDelete={() => {
                setDoc({ ...doc, items: doc.items.filter((item) => item.id !== selected.id) })
                setSelectedId(doc.items.find((item) => item.id !== selected.id)?.id ?? null)
              }}
            />
          ) : null}
        </>
      )}
    </div>
  )
}

function PageTab({
  doc,
  pageKey,
  onChange,
  onEdit,
}: {
  doc: ProjectSetsDocument
  pageKey: ProjectPageKey
  onChange: (header: ProjectSetsDocument['pages'][ProjectPageKey]) => void
  onEdit: (id: string) => void
}) {
  const header = doc.pages[pageKey]
  const visible = doc.items.filter((item) => {
    const kind = PAGE_KIND[pageKey]
    if (kind === 'domestic') return item.category === '국내'
    if (kind === 'research') return item.category === '연구'
    if (item.category !== '해외') return false
    if (kind === 'overseas') return true
    if (kind === 'overseas-education') return item.field === '교육'
    return item.field === '해외봉사단'
  })
  return (
    <>
    <section className="admin-panel">
      <h2 className="admin-panel__title">① 상단 사진</h2>
      <div className="admin-form-grid">
        <AdminMediaUpload label="상단 사진" variant="image" value={header.photo || null} onChange={(url) => onChange({ ...header, photo: url ?? '' })} />
        <label className="admin-field">
          <span className="admin-field__label">사진 설명</span>
          <input className="admin-input" value={header.photoAlt} onChange={(e) => onChange({ ...header, photoAlt: e.target.value })} />
        </label>
      </div>
      <p className="admin-panel__foot">상단 사진을 비우면 지금 페이지 배너를 그대로 씁니다.</p>
    </section>
    <section className="admin-panel">
      <h2 className="admin-panel__title">② 소개</h2>
      <div className="admin-form-grid">
        <label className="admin-field">
          <span className="admin-field__label">페이지 제목</span>
          <input className="admin-input" value={header.title} onChange={(e) => onChange({ ...header, title: e.target.value })} />
        </label>
        <label className="admin-field admin-field--full">
          <span className="admin-field__label">상단 문구</span>
          <input className="admin-input" value={header.eyebrow} onChange={(e) => onChange({ ...header, eyebrow: e.target.value })} />
        </label>
      </div>
    </section>
    {pageKey === 'research' ? (
      <section className="admin-panel">
        <div className="admin-panel__head">
          <h2 className="admin-panel__title">③ 연구의 흐름</h2>
          <button type="button" className="admin-btn" onClick={() => onChange({ ...header, flow: [...(header.flow ?? []), { name: '', body: '' }] })}>+ 단계</button>
        </div>
        {(header.flow ?? []).map((step, index) => (
          <div key={index} className="admin-form-grid">
            <label className="admin-field"><span className="admin-field__label">단계명</span><input className="admin-input" value={step.name} onChange={(e) => onChange({ ...header, flow: header.flow.map((item, itemIndex) => itemIndex === index ? { ...item, name: e.target.value } : item) })} /></label>
            <label className="admin-field"><span className="admin-field__label">설명</span><input className="admin-input" value={step.body} onChange={(e) => onChange({ ...header, flow: header.flow.map((item, itemIndex) => itemIndex === index ? { ...item, body: e.target.value } : item) })} /></label>
          </div>
        ))}
      </section>
    ) : pageKey === 'education' ? null : (
      <section className="admin-panel">
        <div className="admin-panel__head">
          <h2 className="admin-panel__title">③ 숫자 카드</h2>
          {(header.cards ?? []).length < 4 ? <button type="button" className="admin-btn" onClick={() => onChange({ ...header, cards: [...(header.cards ?? []), { value: '', unit: '', note: '', source: '' }] })}>+ 카드</button> : null}
        </div>
        {(header.cards ?? []).map((card, index) => (
          <div key={index} className="admin-form-grid">
            <label className="admin-field"><span className="admin-field__label">숫자</span><input className="admin-input" value={card.value} onChange={(e) => onChange({ ...header, cards: header.cards.map((item, itemIndex) => itemIndex === index ? { ...item, value: e.target.value } : item) })} /></label>
            <label className="admin-field"><span className="admin-field__label">단위</span><input className="admin-input" value={card.unit} onChange={(e) => onChange({ ...header, cards: header.cards.map((item, itemIndex) => itemIndex === index ? { ...item, unit: e.target.value } : item) })} /></label>
            <label className="admin-field"><span className="admin-field__label">설명</span><input className="admin-input" value={card.note} onChange={(e) => onChange({ ...header, cards: header.cards.map((item, itemIndex) => itemIndex === index ? { ...item, note: e.target.value } : item) })} /></label>
            <label className="admin-field"><span className="admin-field__label">기준·출처</span><input className="admin-input" value={card.source} onChange={(e) => onChange({ ...header, cards: header.cards.map((item, itemIndex) => itemIndex === index ? { ...item, source: e.target.value } : item) })} /></label>
          </div>
        ))}
      </section>
    )}
    <section className="admin-panel">
      <h2 className="admin-panel__title">④ 진행사업 목록</h2>
      <ul className="admin-list">
        {visible.map((item) => (
          <li key={item.id}>
            <span>
              {item.year ?? '연도 미정'} · {item.title || '(사업명 없음)'}
              {item.enabled ? '' : ' · 비공개'}
            </span>
            <button type="button" className="admin-btn" onClick={() => onEdit(item.id)}>
              수정
            </button>
          </li>
        ))}
      </ul>
      <p className="admin-panel__foot">목록 입력은 진행사업 관리 한 곳에서 합니다. 숫자 카드는 각 사업의 수치 박스를 씁니다.</p>
    </section>
    </>
  )
}

function SetEditor({
  item,
  onChange,
  onDelete,
}: {
  item: ProjectSetRecord
  onChange: (patch: Partial<ProjectSetRecord>) => void
  onDelete: () => void
}) {
  const setStep = (index: number, patch: Partial<ProjectSetRecord['steps'][number]>) => {
    onChange({ steps: item.steps.map((step, stepIndex) => (stepIndex === index ? { ...step, ...patch } : step)) })
  }
  return (
    <>
      <section className="admin-panel">
        <h2 className="admin-panel__title">② 사업 기본 정보</h2>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span className="admin-field__label">카테고리</span>
            <select className="admin-input" value={item.category} onChange={(e) => onChange({ category: e.target.value as ProjectCategory })}>
              {PROJECT_CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-field">
            <span className="admin-field__label">분야 (필터용)</span>
            <select className="admin-input" value={item.field} onChange={(e) => onChange({ field: e.target.value as ProjectSetRecord['field'] })}>
              <option value="">없음</option>
              {PROJECT_FIELDS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-field">
            <span className="admin-field__label">연도</span>
            <input
              className="admin-input"
              inputMode="numeric"
              value={item.year ?? ''}
              placeholder="비우면 연도 미정"
              onChange={(e) => onChange({ year: e.target.value.trim() ? Number(e.target.value) : null })}
            />
          </label>
          <div className="admin-field">
            <span className="admin-field__label">공개</span>
            <OnOff enabled={item.enabled} label="공개" onChange={(enabled) => onChange({ enabled })} />
          </div>
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">분야 라벨 (영문 · 국문 한 줄)</span>
            <input className="admin-input" value={item.eyebrow} onChange={(e) => onChange({ eyebrow: e.target.value })} />
          </label>
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">사업명</span>
            <input className="admin-input" value={item.title} onChange={(e) => onChange({ title: e.target.value })} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">기간</span>
            <input className="admin-input" value={item.period} onChange={(e) => onChange({ period: e.target.value })} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">대상</span>
            <input className="admin-input" value={item.audience} onChange={(e) => onChange({ audience: e.target.value })} />
          </label>
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">협력기관</span>
            <input className="admin-input" value={item.partner} onChange={(e) => onChange({ partner: e.target.value })} />
          </label>
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">설명 (문장마다 줄바꿈)</span>
            <textarea className="admin-input" rows={5} value={item.paragraphs.join('\n')} onChange={(e) => onChange({ paragraphs: e.target.value.split('\n') })} />
          </label>
        </div>
        <h3 className="admin-panel__title">오른쪽 큰 사진 (여러 장)</h3>
        {item.slides.map((slide, index) => (
          <div key={`${item.id}-slide-${index}`} className="admin-form-grid">
            <AdminMediaUpload
              label={`사진 ${index + 1}`}
              variant="image"
              value={slide.src || null}
              onChange={(url) => onChange({ slides: item.slides.map((row, rowIndex) => (rowIndex === index ? { ...row, src: url ?? '' } : row)) })}
            />
            <label className="admin-field">
              <span className="admin-field__label">사진 설명</span>
              <input
                className="admin-input"
                value={slide.alt}
                onChange={(e) => onChange({ slides: item.slides.map((row, rowIndex) => (rowIndex === index ? { ...row, alt: e.target.value } : row)) })}
              />
            </label>
          </div>
        ))}
        <button type="button" className="admin-btn" disabled={item.slides.length >= 8} onClick={() => onChange({ slides: [...item.slides, { src: '', alt: '' }] })}>
          + 사진 추가
        </button>
        <p className="admin-panel__foot">큰 사진은 1장이면 화살표·장수 표시를 숨기고, 2장 이상이면 좌우 화살표와 장수를 표시합니다.</p>
      </section>

      <section className="admin-panel">
        <h2 className="admin-panel__title">③ 진행 박스</h2>
        <div className="admin-field">
          <span className="admin-field__label">표시</span>
          <OnOff enabled={item.stepsOn} label="진행 박스 표시" onChange={(stepsOn) => onChange({ stepsOn })} />
        </div>
        <div className="admin-field">
          <span className="admin-field__label">화살표</span>
          <div className="admin-segmented admin-segmented--tight" role="group" aria-label="화살표">
            <button type="button" className={`admin-segmented__btn${item.showArrows ? ' admin-segmented__btn--active' : ''}`} onClick={() => onChange({ showArrows: true })}>
              사용
            </button>
            <button type="button" className={`admin-segmented__btn${!item.showArrows ? ' admin-segmented__btn--active' : ''}`} onClick={() => onChange({ showArrows: false })}>
              사용 안 함
            </button>
          </div>
        </div>
        <div className="admin-field">
          <span className="admin-field__label">마지막 박스 강조 색</span>
          <div className="admin-segmented admin-segmented--tight" role="group" aria-label="마지막 박스 강조 색">
            <button type="button" className={`admin-segmented__btn${item.emphasizeLast ? ' admin-segmented__btn--active' : ''}`} onClick={() => onChange({ emphasizeLast: true })}>
              사용
            </button>
            <button type="button" className={`admin-segmented__btn${!item.emphasizeLast ? ' admin-segmented__btn--active' : ''}`} onClick={() => onChange({ emphasizeLast: false })}>
              사용 안 함
            </button>
          </div>
        </div>
        {item.steps.map((step, index) => (
          <div key={`${item.id}-step-${index}`} className="admin-form-grid">
            <label className="admin-field">
              <span className="admin-field__label">윗줄</span>
              <input className="admin-input" value={step.kicker} onChange={(e) => setStep(index, { kicker: e.target.value })} />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">제목</span>
              <input className="admin-input" value={step.title} onChange={(e) => setStep(index, { title: e.target.value })} />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">설명 (선택)</span>
              <input className="admin-input" value={step.detail} onChange={(e) => setStep(index, { detail: e.target.value })} />
            </label>
            <button type="button" className="admin-btn" onClick={() => onChange({ steps: item.steps.filter((_, stepIndex) => stepIndex !== index) })}>
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-btn"
          disabled={item.steps.length >= 6}
          onClick={() => onChange({ steps: [...item.steps, { kicker: '', title: '', detail: '' }] })}
        >
          + 박스 추가
        </button>
        <p className="admin-panel__foot">박스는 2~6개입니다. 윗줄·제목·설명이 모두 비면 그 박스는 화면에 나오지 않습니다.</p>
      </section>

      <section className="admin-panel">
        <h2 className="admin-panel__title">④ 수치 박스</h2>
        <div className="admin-field">
          <span className="admin-field__label">표시</span>
          <OnOff enabled={item.factsOn} label="수치 박스 표시" onChange={(factsOn) => onChange({ factsOn })} />
        </div>
        {item.facts.map((fact, index) => (
          <div key={`${item.id}-fact-${index}`} className="admin-form-grid">
            <label className="admin-field">
              <span className="admin-field__label">숫자</span>
              <input
                className="admin-input"
                value={fact.value}
                onChange={(e) => onChange({ facts: item.facts.map((row, rowIndex) => (rowIndex === index ? { ...row, value: e.target.value } : row)) })}
              />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">단위</span>
              <input
                className="admin-input"
                value={fact.unit}
                onChange={(e) => onChange({ facts: item.facts.map((row, rowIndex) => (rowIndex === index ? { ...row, unit: e.target.value } : row)) })}
              />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">설명</span>
              <input
                className="admin-input"
                value={fact.label}
                onChange={(e) => onChange({ facts: item.facts.map((row, rowIndex) => (rowIndex === index ? { ...row, label: e.target.value } : row)) })}
              />
            </label>
          </div>
        ))}
        <label className="admin-field admin-field--full">
          <span className="admin-field__label">근거 (작게 표시)</span>
          <input className="admin-input" value={item.note} onChange={(e) => onChange({ note: e.target.value })} />
        </label>
        <p className="admin-panel__foot">숫자가 비면 그 수치 박스는 화면에 나오지 않습니다.</p>
      </section>

      <section className="admin-panel">
        <h2 className="admin-panel__title">⑤ 하단 사진 3장</h2>
        <div className="admin-field">
          <span className="admin-field__label">표시</span>
          <OnOff enabled={item.photosOn} label="하단 사진 표시" onChange={(photosOn) => onChange({ photosOn })} />
        </div>
        {item.photos.map((photo, index) => (
          <div key={`${item.id}-photo-${index}`} className="admin-form-grid">
            <AdminMediaUpload
              label={`사진 ${index + 1}`}
              variant="image"
              value={photo.src || null}
              onChange={(url) => onChange({ photos: item.photos.map((row, rowIndex) => (rowIndex === index ? { ...row, src: url ?? '' } : row)) })}
            />
            <label className="admin-field">
              <span className="admin-field__label">설명</span>
              <input
                className="admin-input"
                value={photo.alt}
                onChange={(e) => onChange({ photos: item.photos.map((row, rowIndex) => (rowIndex === index ? { ...row, alt: e.target.value } : row)) })}
              />
            </label>
          </div>
        ))}
        <p className="admin-panel__foot">사진이 없으면 그 칸은 빠지고, 세 장 모두 없으면 이 줄 전체를 숨깁니다.</p>
        <button type="button" className="admin-btn" onClick={onDelete}>
          이 사업 삭제
        </button>
      </section>
    </>
  )
}
