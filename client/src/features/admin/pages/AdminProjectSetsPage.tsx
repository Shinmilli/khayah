import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AdminMediaUpload } from '../components/AdminMediaUpload'
import { AdminLocaleEmptyNote, AdminLocaleTabs, type AdminEditLocale } from '../components/AdminLocaleTabs'
import { AdminSaveActions, draftStatus, takeUnpublished } from '../AdminSaveActions'
import { adminFetchProjectSets, adminPutProjectSets, type SaveMode } from '../../../services/api'
import { resetProjectSetsCache } from '../../projects/useProjectSets'
import { BizHead, bizTitle, movePanels, removePanel, sortPanels, togglePanel } from '../biz/BizChrome'
import { EducationAxisEditor } from './EducationAxisEditor'
import { SectionBlocks } from '../biz/SectionBlocks'
import { fillPublicPage } from './pagePublicFill'
import { DEFAULT_EDUCATION_AXES } from '../../projects/educationAxes'
import type { BizPanel } from '../../biz/bizSupportTypes'
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

const TABS: Array<{ id: TabId; label: string; title: string }> = [
  { id: 'sets', label: '진행사업 관리 (국내·해외·연구 공통)', title: '진행사업 관리' },
  { id: 'domestic', label: '국내 진행사업', title: '국내사업 관리' },
  { id: 'overseas', label: '해외 진행사업', title: '해외사업 소개 관리' },
  { id: 'education', label: '해외 교육 진행사업', title: '교육 관리' },
  { id: 'volunteer', label: '해외봉사단 진행사업', title: '해외봉사단 관리' },
  { id: 'research', label: '연구사업 진행사업', title: '연구사업 관리' },
]

const PAGE_KIND: Record<ProjectPageKey, ProjectListKind> = {
  domestic: 'domestic',
  overseas: 'overseas',
  education: 'overseas-education',
  volunteer: 'volunteer',
  research: 'research',
}

const PAGE_LIST_NOTE: Record<ProjectPageKey, string> = {
  domestic: '진행사업 관리에서 입력 · 이 페이지는 카테고리 = 국내',
  overseas: '진행사업 관리에서 입력 · 이 페이지는 카테고리 = 해외 (분야 버튼: 전체·교육·해외봉사단·긴급구호)',
  education: '진행사업 관리에서 입력 · 이 페이지는 카테고리 = 해외 · 분야 = 교육',
  volunteer: '진행사업 관리에서 입력 · 이 페이지는 카테고리 = 해외 · 분야 = 해외봉사단',
  research: '진행사업 관리에서 입력 · 이 페이지는 카테고리 = 연구',
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
  const [params] = useSearchParams()
  const tab = projectTab(params.get('tab'))
  const [doc, setDoc] = useState<ProjectSetsDocument | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [category, setCategory] = useState<ProjectCategory | '전체'>('전체')
  const [year, setYear] = useState<string>('전체')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState('')
  const [savedMode, setSavedMode] = useState<SaveMode | ''>('')
  const [unpublished, setUnpublished] = useState(false)
  const [editLocale, setEditLocale] = useState<AdminEditLocale>('ko')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const loaded = takeUnpublished(await adminFetchProjectSets())
      const next = loaded.doc
      setUnpublished(loaded.unpublished)
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

  const onSave = async (mode: SaveMode) => {
    if (!doc) return
    setSaving(true)
    setError('')
    setSavedAt('')
    try {
      const saved = takeUnpublished(await adminPutProjectSets(doc, mode))
      setDoc(saved.doc)
      setUnpublished(saved.unpublished)
      setSavedMode(mode)
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
    <div className="admin-page biz-mock">
      <div className="admin-page__head">
        <div>
          <p className="admin-page__desc">사업 › {TABS.find((item) => item.id === tab)?.label}</p>
          <h1 className="admin-page__title">{TABS.find((item) => item.id === tab)?.title}</h1>
        </div>
        <div className="admin-page__actions">
          <AdminLocaleTabs value={editLocale} onChange={setEditLocale} />
          <a
            className="admin-btn"
            href={`${editLocale === 'en' ? '/en' : ''}${
              tab === 'domestic'
                ? '/business/domestic/projects'
                : tab === 'overseas'
                  ? '/business/overseas/projects'
                  : tab === 'education'
                    ? '/business/overseas/education/projects'
                    : tab === 'volunteer'
                      ? '/business/overseas/volunteer/projects'
                      : tab === 'research'
                        ? '/business/advocacy/projects'
                        : '/business/domestic/projects'
            }`}
            target="_blank"
            rel="noopener noreferrer"
          >
            미리보기
          </a>
          <AdminSaveActions saving={saving} onSave={(mode) => void onSave(mode)} />
        </div>
      </div>
      {tab === 'sets' ? <p className="admin-callout">국내·해외·연구 진행사업을 한 곳에서 입력합니다. 사업 하나 = 사업 세트 하나이며, 비운 영역은 화면에서 빠집니다.</p> : null}
      {error ? <p className="admin-banner admin-banner--error">{error}</p> : null}
      {draftStatus(unpublished, savedAt, savedMode) ? <p className="admin-panel__foot">{draftStatus(unpublished, savedAt, savedMode)}</p> : null}
      <AdminLocaleEmptyNote locale={editLocale} />
      {tab !== 'sets' ? (
        <PageTab
          doc={doc}
          pageKey={tab}
          onChange={(header) => setDoc({ ...doc, pages: { ...doc.pages, [tab]: header } })}
          onToggleItem={(id) => updateItem(id, { enabled: !(doc.items.find((item) => item.id === id)?.enabled) })}
        />
      ) : (
        <>
          <section className="admin-panel">
            <BizHead title="① 사업 목록">
              <span>카테고리</span>
              <div className="admin-segmented" role="group" aria-label="카테고리">
                {(['전체', ...PROJECT_CATEGORIES] as const).map((value) => (
                  <button key={value} type="button" className={`admin-segmented__btn${category === value ? ' admin-segmented__btn--active' : ''}`} onClick={() => setCategory(value)}>
                    {value}
                  </button>
                ))}
              </div>
              <span>연도</span>
              <div className="admin-segmented" role="group" aria-label="연도">
                {['전체', ...years.map(String), '미정'].map((value) => (
                  <button key={value} type="button" className={`admin-segmented__btn${year === value ? ' admin-segmented__btn--active' : ''}`} onClick={() => setYear(value)}>
                    {value === '미정' ? '연도 미정' : value}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="biz-add"
                onClick={() => {
                  const next = blankSet(doc.items.length)
                  setDoc({ ...doc, items: [...doc.items, next] })
                  setSelectedId(next.id)
                }}
              >
                + 사업 추가
              </button>
            </BizHead>
            <table className="admin-sheet biz-sheet">
              <thead>
                <tr>
                  <th>연도</th>
                  <th>카테고리</th>
                  <th>분야</th>
                  <th>사업명</th>
                  <th>공개</th>
                  <th>순서 · 수정</th>
                </tr>
              </thead>
              <tbody>
                {listed.map((item, index) => (
                  <tr key={item.id}>
                    <td>{item.year ?? '연도 미정'}</td>
                    <td>{item.category}</td>
                    <td>{item.field || '분야 없음'}</td>
                    <td>{item.title || '(사업명 없음)'}</td>
                    <td>
                      <button type="button" className={`biz-tg${item.enabled ? ' is-on' : ''}`} aria-pressed={item.enabled} aria-label="공개" onClick={() => updateItem(item.id, { enabled: !item.enabled })}>
                        <span />
                      </button>
                    </td>
                    <td>
                      <button type="button" className="biz-mv" aria-label="위로" disabled={index === 0} onClick={() => move(item.id, -1)}>↑</button>
                      <button type="button" className="biz-mv" aria-label="아래로" disabled={index === listed.length - 1} onClick={() => move(item.id, 1)}>↓</button>
                      <button type="button" className="biz-del" onClick={() => setSelectedId(item.id)}>수정</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  onToggleItem,
}: {
  doc: ProjectSetsDocument
  pageKey: ProjectPageKey
  onChange: (header: ProjectSetsDocument['pages'][ProjectPageKey]) => void
  onToggleItem: (id: string) => void
}) {
  const header = doc.pages[pageKey]
  const view = fillPublicPage(header, pageKey)
  const [cardsCleared, setCardsCleared] = useState(false)
  const [flowCleared, setFlowCleared] = useState(false)
  useEffect(() => {
    setCardsCleared(false)
    setFlowCleared(false)
  }, [pageKey])
  const cards = cardsCleared ? header.cards ?? [] : view.cards
  const flow = flowCleared ? header.flow ?? [] : view.flow
  const visible = doc.items.filter((item) => {
    const kind = PAGE_KIND[pageKey]
    if (kind === 'domestic') return item.category === '국내'
    if (kind === 'research') return item.category === '연구'
    if (item.category !== '해외') return false
    if (kind === 'overseas') return true
    if (kind === 'overseas-education') return item.field === '교육'
    return item.field === '해외봉사단'
  })
  const movingIds = pageKey === 'education' ? ['photo', 'intro'] : ['photo', 'intro', pageKey === 'research' ? 'flow' : 'cards']
  const ranked = sortPanels(movingIds.map((id) => ({ id })), header.panels).filter((row) => !row.removed)
  const writePanels = (next: BizPanel[]) => onChange({ ...header, panels: next })
  const shown = (id: string) => ranked.find((row) => row.id === id)?.enabled !== false
  const head = (id: string, title: string, note?: string, extra?: ReactNode, deletable = true) => {
    const index = ranked.findIndex((row) => row.id === id)
    if (index < 0) return null
    return (
      <BizHead
        title={bizTitle(index, title)}
        note={note}
        enabled={shown(id)}
        onUp={() => writePanels(movePanels(header.panels, movingIds, id, -1))}
        onDown={() => writePanels(movePanels(header.panels, movingIds, id, 1))}
        onToggle={() => writePanels(togglePanel(header.panels, movingIds, id))}
        trailing={deletable ? <button type="button" className="biz-del" onClick={() => writePanels(removePanel(header.panels, movingIds, id))}>섹션 삭제</button> : null}
      >
        {extra}
      </BizHead>
    )
  }
  const axisCount = pageKey === 'education' ? (header.axes?.length ? header.axes : DEFAULT_EDUCATION_AXES).length : 0
  const photoSection = (
    <section className="admin-panel">
      {head('photo', '상단 사진', undefined, undefined, false)}
      {shown('photo') ? <>
      <div className="admin-form-grid">
        <AdminMediaUpload layout="slot" slotTitle="사진 올리기" slotRatio="1920×640" label="상단 사진" variant="image" value={view.photo || null} onChange={(url) => onChange({ ...header, photo: url ?? '' })} />
        <label className="admin-field">
          <span className="admin-field__label">영문 라벨</span>
          <input className="admin-input" value={view.heroLabel} onChange={(e) => onChange({ ...header, heroLabel: e.target.value })} />
        </label>
        <label className="admin-field">
          <span className="admin-field__label">페이지 제목</span>
          <input className="admin-input" value={view.title} onChange={(e) => onChange({ ...header, title: e.target.value })} />
        </label>
      </div>
      <p className="admin-panel__foot">상단 사진을 비우면 지금 페이지 배너를 그대로 씁니다.</p>
      </> : null}
    </section>
  )
  const introSection = (
    <section className="admin-panel">
      {head('intro', '소개')}
      {shown('intro') ? <>
      <div className="admin-form-grid">
        {pageKey === 'education' ? (
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">소제목</span>
            <input className="admin-input" value={view.introKicker} onChange={(e) => onChange({ ...header, introKicker: e.target.value })} />
          </label>
        ) : (
          <>
            <label className="admin-field">
              <span className="admin-field__label">소제목 (영문)</span>
              <input className="admin-input" value={view.introKicker} onChange={(e) => onChange({ ...header, introKicker: e.target.value })} />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">소제목 (국문)</span>
              <input className="admin-input" value={view.introKickerKo} onChange={(e) => onChange({ ...header, introKickerKo: e.target.value })} />
            </label>
          </>
        )}
        <label className="admin-field">
          <span className="admin-field__label">제목 (한 줄)</span>
          <input className="admin-input" value={view.introTitle} onChange={(e) => onChange({ ...header, introTitle: e.target.value })} />
        </label>
        <label className="admin-field">
          <span className="admin-field__label">강조 단어 (와인색)</span>
          <input className="admin-input" value={view.emphasis} onChange={(e) => onChange({ ...header, emphasis: e.target.value })} />
        </label>
        <label className="admin-field admin-field--full">
          <span className="admin-field__label">설명 (문장마다 줄바꿈)</span>
          <textarea className="admin-input" rows={3} value={view.lead} onChange={(e) => onChange({ ...header, lead: e.target.value })} />
        </label>
        {pageKey === 'education' ? (
          <div className="admin-field">
            <span className="admin-field__label">정렬</span>
            <div className="admin-segmented admin-segmented--tight" role="group" aria-label="정렬">
              <button type="button" className={`admin-segmented__btn${header.align === 'left' ? ' admin-segmented__btn--active' : ''}`} onClick={() => onChange({ ...header, align: 'left' })}>왼쪽</button>
              <button type="button" className={`admin-segmented__btn${header.align !== 'left' ? ' admin-segmented__btn--active' : ''}`} onClick={() => onChange({ ...header, align: 'center' })}>가운데</button>
            </div>
          </div>
        ) : pageKey === 'domestic' ? null : (
          <div className="admin-field">
            <span className="admin-field__label">소개 사진</span>
            <div className="admin-segmented admin-segmented--tight" role="group" aria-label="소개 사진">
              <button type="button" className={`admin-segmented__btn${(header.photoSide ?? 'right') === 'right' ? ' admin-segmented__btn--active' : ''}`} onClick={() => onChange({ ...header, photoSide: 'right' })}>오른쪽</button>
              <button type="button" className={`admin-segmented__btn${header.photoSide === 'left' ? ' admin-segmented__btn--active' : ''}`} onClick={() => onChange({ ...header, photoSide: 'left' })}>왼쪽</button>
              <button type="button" className={`admin-segmented__btn${header.photoSide === 'none' ? ' admin-segmented__btn--active' : ''}`} onClick={() => onChange({ ...header, photoSide: 'none' })}>없음</button>
            </div>
          </div>
        )}
        {pageKey === 'education' ? null : (
          <div className="admin-field">
            <span className="admin-field__label">배경</span>
            <div className="admin-segmented admin-segmented--tight" role="group" aria-label="숫자 카드 배경">
              <button type="button" className={`admin-segmented__btn${header.band === 'white' ? ' admin-segmented__btn--active' : ''}`} onClick={() => onChange({ ...header, band: 'white' })}>흰색</button>
              <button type="button" className={`admin-segmented__btn${header.band !== 'white' ? ' admin-segmented__btn--active' : ''}`} onClick={() => onChange({ ...header, band: 'gray' })}>연회색</button>
            </div>
          </div>
        )}
      </div>
      </> : null}
    </section>
  )
  const flowSection = pageKey === 'research' ? (
      <section className="admin-panel">
        {head('flow', '연구의 흐름', undefined, <button type="button" className="biz-add" onClick={() => { setFlowCleared(false); onChange({ ...header, flow: [...flow, { name: '', body: '' }] }) }}>+ 단계</button>)}
        {shown('flow') ? <>
        <div className="biz-bars">
        {flow.map((step, index) => (
          <div key={index} className="admin-item">
            <span className="biz-grip" aria-hidden="true">⋮⋮</span>
            <div className="admin-form-grid">
              <label className="admin-field"><span className="admin-field__label">번호</span><input className="admin-input" value={String(index + 1)} readOnly /></label>
              <label className="admin-field"><span className="admin-field__label">단계명</span><input className="admin-input" value={step.name} onChange={(e) => { setFlowCleared(false); onChange({ ...header, flow: flow.map((item, itemIndex) => itemIndex === index ? { ...item, name: e.target.value } : item) }) }} /></label>
              <label className="admin-field"><span className="admin-field__label">설명</span><input className="admin-input" value={step.body} onChange={(e) => { setFlowCleared(false); onChange({ ...header, flow: flow.map((item, itemIndex) => itemIndex === index ? { ...item, body: e.target.value } : item) }) }} /></label>
            </div>
            <button type="button" className="biz-x" aria-label="삭제" onClick={() => { const next = flow.filter((_, itemIndex) => itemIndex !== index); setFlowCleared(next.length === 0); onChange({ ...header, flow: next }) }}>×</button>
          </div>
        ))}
        </div>
        </> : null}
      </section>
    ) : null
  const cardsSection = pageKey === 'research' || pageKey === 'education' ? null : (
      <section className="admin-panel">
        {head('cards', '숫자 카드', '1~4개 권장')}
        {shown('cards') ? <>
        <div className="biz-bars">
        {cards.map((card, index) => (
          <div key={index} className="admin-item">
            <span className="biz-grip" aria-hidden="true">⋮⋮</span>
            <div className="admin-form-grid biz-pair">
              <label className="admin-field"><span className="admin-field__label">숫자</span><input className="admin-input" value={card.value} onChange={(e) => { setCardsCleared(false); onChange({ ...header, cards: cards.map((item, itemIndex) => itemIndex === index ? { ...item, value: e.target.value } : item) }) }} /></label>
              <label className="admin-field"><span className="admin-field__label">단위</span><input className="admin-input" value={card.unit} onChange={(e) => { setCardsCleared(false); onChange({ ...header, cards: cards.map((item, itemIndex) => itemIndex === index ? { ...item, unit: e.target.value } : item) }) }} /></label>
              <label className="admin-field"><span className="admin-field__label">설명</span><input className="admin-input" value={card.note} onChange={(e) => { setCardsCleared(false); onChange({ ...header, cards: cards.map((item, itemIndex) => itemIndex === index ? { ...item, note: e.target.value } : item) }) }} /></label>
              <label className="admin-field"><span className="admin-field__label">기준·출처 (작게 표시)</span><input className="admin-input" value={card.source} onChange={(e) => { setCardsCleared(false); onChange({ ...header, cards: cards.map((item, itemIndex) => itemIndex === index ? { ...item, source: e.target.value } : item) }) }} /></label>
            </div>
            <button type="button" className="biz-x" aria-label="삭제" onClick={() => { const next = cards.filter((_, itemIndex) => itemIndex !== index); setCardsCleared(next.length === 0); onChange({ ...header, cards: next }) }}>×</button>
          </div>
        ))}
        {cards.length < 4 ? <button type="button" className="biz-add" onClick={() => { setCardsCleared(false); onChange({ ...header, cards: [...cards, { value: '', unit: '', note: '', source: '' }] }) }}>+ 숫자 카드 추가</button> : null}
        </div>
        </> : null}
      </section>
    )
  const sections: Record<string, ReactNode> = { photo: photoSection, intro: introSection, flow: flowSection, cards: cardsSection }
  return (
    <div className="biz-stack">
    {ranked.map((row) => sections[row.id])}
    {pageKey === 'education' ? <EducationAxisEditor header={header} onChange={onChange} start={ranked.length} /> : null}
    <section className="admin-panel">
      <BizHead title={bizTitle(ranked.length + axisCount, '진행사업 목록')} note={PAGE_LIST_NOTE[pageKey]}>
        <a className="biz-link" href="/admin/app/projects?tab=sets">진행사업 관리로 이동 →</a>
      </BizHead>
      <>
      <table className="biz-table">
        <thead>
          <tr>
            <th>연도</th>
            <th>분야</th>
            <th>사업명</th>
            <th>공개</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((item) => (
            <tr key={item.id}>
              <td>{item.year ?? ''}</td>
              <td>{item.field || item.category}</td>
              <td>{item.title || '(사업명 없음)'}</td>
              <td>
                <button type="button" className={`biz-tg${item.enabled ? ' is-on' : ''}`} aria-pressed={item.enabled} aria-label="공개" onClick={() => onToggleItem(item.id)}>
                  <span />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </>
    </section>
    <SectionBlocks blocks={header.blocks ?? []} onChange={(blocks) => onChange({ ...header, blocks })} />
    </div>
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
        <BizHead title="② 사업 기본 정보" />
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
        <h3 className="admin-panel__title admin-panel__title--gap">오른쪽 큰 사진 (여러 장)</h3>
        <div className="biz-bars">
        {item.slides.map((slide, index) => (
          <div key={`${item.id}-slide-${index}`} className="admin-item project-slide">
            <span className="project-slide__no">사진 {index + 1}</span>
            <AdminMediaUpload
              compact
              hideRemove
              label={`사진 ${index + 1}`}
              variant="image"
              value={slide.src || null}
              onChange={(url) => onChange({ slides: item.slides.map((row, rowIndex) => (rowIndex === index ? { ...row, src: url ?? '' } : row)) })}
            />
            <label className="admin-field project-slide__alt">
              <span className="admin-field__label">사진 설명</span>
              <input
                className="admin-input"
                value={slide.alt}
                onChange={(e) => onChange({ slides: item.slides.map((row, rowIndex) => (rowIndex === index ? { ...row, alt: e.target.value } : row)) })}
              />
            </label>
            <button
              type="button"
              className="biz-x"
              aria-label={`사진 ${index + 1} 삭제`}
              onClick={() => onChange({ slides: item.slides.filter((_, rowIndex) => rowIndex !== index) })}
            >
              ×
            </button>
          </div>
        ))}
        <button type="button" className="biz-add" disabled={item.slides.length >= 8} onClick={() => onChange({ slides: [...item.slides, { src: '', alt: '' }] })}>
          + 사진 추가
        </button>
        </div>
        <p className="admin-panel__foot">큰 사진은 1장이면 화살표·장수 표시를 숨기고, 2장 이상이면 좌우 화살표와 장수를 표시합니다.</p>
      </section>

      <section className="admin-panel">
        <BizHead title="③ 진행 박스" note="2~6개" enabled={item.stepsOn} onToggle={() => onChange({ stepsOn: !item.stepsOn })} />
        {item.stepsOn ? <>
        <div className="biz-opt">
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
        </div>
        <div className="biz-bars">
        {item.steps.map((step, index) => (
          <div key={`${item.id}-step-${index}`} className="admin-item">
            <span className="biz-grip" aria-hidden="true">⋮⋮</span>
            <div className="admin-form-grid">
              <label className="admin-field">
                <span className="admin-field__label">{index === 0 ? '윗줄 (예: DAY 1 · STEP 1 · 연도)' : '윗줄'}</span>
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
            </div>
            <button type="button" className="biz-x" aria-label="삭제" onClick={() => onChange({ steps: item.steps.filter((_, stepIndex) => stepIndex !== index) })}>
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className="biz-add"
          disabled={item.steps.length >= 6}
          onClick={() => onChange({ steps: [...item.steps, { kicker: '', title: '', detail: '' }] })}
        >
          + 박스 추가
        </button>
        </div>
        <p className="admin-panel__foot">박스는 2~6개입니다. 윗줄·제목·설명이 모두 비면 그 박스는 화면에 나오지 않습니다.</p>
        </> : null}
      </section>

      <section className="admin-panel">
        <BizHead title="④ 수치 박스" note="3개" enabled={item.factsOn} onToggle={() => onChange({ factsOn: !item.factsOn })} />
        {item.factsOn ? <>
        <div className="biz-bars">
        {item.facts.map((fact, index) => (
          <div key={`${item.id}-fact-${index}`} className="admin-item">
            <div className="admin-form-grid">
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
          </div>
        ))}
        </div>
        <label className="admin-field admin-field--full">
          <span className="admin-field__label">근거 (작게 표시)</span>
          <input className="admin-input" value={item.note} onChange={(e) => onChange({ note: e.target.value })} />
        </label>
        <p className="admin-panel__foot">숫자가 비면 그 수치 박스는 화면에 나오지 않습니다.</p>
        </> : null}
      </section>

      <section className="admin-panel">
        <BizHead title="⑤ 하단 사진 3장" note="고정 · 슬라이드 없음" enabled={item.photosOn} onToggle={() => onChange({ photosOn: !item.photosOn })} />
        {item.photosOn ? <>
        <div className="biz-photos">
        {[0, 1, 2].map((index) => {
          const photo = item.photos[index] ?? { src: '', alt: '' }
          const photos = [0, 1, 2].map((slot) => item.photos[slot] ?? { src: '', alt: '' })
          return (
            <div key={`${item.id}-photo-${index}`}>
              <AdminMediaUpload
                layout="slot"
                slotTitle={`사진 ${index + 1}`}
                slotRatio="4:3"
                label={`사진 ${index + 1}`}
                variant="image"
                value={photo.src || null}
                onChange={(url) => onChange({ photos: photos.map((row, rowIndex) => (rowIndex === index ? { ...row, src: url ?? '' } : row)) })}
              />
              <label className="admin-field">
                <span className="admin-field__label">설명</span>
                <input
                  className="admin-input"
                  value={photo.alt}
                  onChange={(e) => onChange({ photos: photos.map((row, rowIndex) => (rowIndex === index ? { ...row, alt: e.target.value } : row)) })}
                />
              </label>
            </div>
          )
        })}
        </div>
        <p className="admin-panel__foot">사진이 없으면 그 칸은 빠지고, 세 장 모두 없으면 이 줄 전체를 숨깁니다.</p>
        </> : null}
        <button type="button" className="biz-del" onClick={onDelete}>
          이 사업 삭제
        </button>
      </section>
    </>
  )
}
