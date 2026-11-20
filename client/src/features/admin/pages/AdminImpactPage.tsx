import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AdminMediaUpload } from '../components/AdminMediaUpload'
import { AdminRichTextEditor } from '../components/AdminRichTextEditor'
import type { AdminRichTextEditorHandle } from '../components/AdminRichTextEditor'
import { AdminLocaleEmptyNote, AdminLocaleTabs, type AdminEditLocale } from '../components/AdminLocaleTabs'
import { AdminSaveActions, draftStatus, takeUnpublished } from '../AdminSaveActions'
import { adminFetchImpactPage, adminPutImpactPage, type SaveMode } from '../../../services/api'
import { resetImpactPageCache } from '../../impact/useImpactPage'
import {
  IMPACT_SECTION_LABEL,
  type ImpactOffice,
  type ImpactPageDocument,
  type ImpactStory,
  type ImpactYear,
} from '../../impact/impactPageTypes'

function newId(prefix: string): string {
  return `${prefix}-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Date.now()}`
}

const SAMPLE_YEAR_ROWS = [
  { name: '경기청년 기후특사단', real: '[000]', total: '[000]', child: '측정 전', youth: '[000]', teacher: '0' },
  { name: 'SEEM 방과후학습', real: '[000]', total: '[000]', child: '[000]', youth: '측정 전', teacher: '[00]' },
  { name: '중복 제외 전체 참여자 (본부 입력)', real: '[0,000]', total: '', child: '', youth: '', teacher: '' },
]

function blankStory() {
  return {
    id: newId('s'),
    category: '변화의 이야기' as const,
    title: '',
    project: '',
    featured: true,
    consent: false,
    body: '',
    before: '',
    intervention: '',
    after: '',
    evidence: '',
    sustainability: '',
    expertName: '',
    expertOrg: '',
    expertField: '',
    expertLine: '',
    expertPhoto: '',
  }
}

function withVisibleSamples(doc: ImpactPageDocument): ImpactPageDocument {
  return {
    ...doc,
    projects: doc.projects?.length
      ? doc.projects
      : [
          { id: 'p-climate', name: '경기청년 기후특사단', base: '한국 본부', field: '해외봉사단', period: '2024~', status: '진행' },
          { id: 'p-seem', name: 'SEEM 방과후학습', base: '키르기스스탄 지부', field: '교육', period: '2026~', status: '진행' },
          { id: 'p-quake', name: '만달레이 대지진 긴급구호', base: '미얀마 지부', field: '긴급구호', period: '2025.04~08', status: '종료' },
          { id: 'p-labor', name: '외국인 노동자 기술·창업 교육', base: '한국 본부', field: '국내 (지난 사업)', period: '2018~2020', status: '종료' },
        ],
    years: dedupeYears(
      doc.years?.length
        ? doc.years
        : ['2024', '2025', '2026'].map((year) => ({ year, rows: SAMPLE_YEAR_ROWS.map((row) => ({ ...row })) })),
    ),
    evals: doc.evals?.length
      ? doc.evals
      : [
          {
            id: 'e-seem',
            program: 'SEEM 방과후학습',
            axis: '배우는 힘',
            mode: '사전 · 사후',
            value: '사전 [00]% · 사후 [00]%',
            itemName: '사전 / 사후 / 향상 비율 등 직접 입력',
            meta: '',
          },
        ],
    stories: doc.stories?.length
      ? doc.stories
      : [
          {
            ...blankStory(),
            id: 's-test-1',
            title: '스토리 test 1',
            project: '테스트 사업',
            featured: true,
            consent: true,
            body: '임팩트 스토리 본문 테스트입니다. 관리자에서 수정·삭제할 수 있습니다.',
            before: 'Before 테스트',
            intervention: 'Intervention 테스트',
            after: 'After 테스트',
            evidence: 'Evidence 테스트',
            sustainability: 'Sustainability 테스트',
          },
        ],
  }
}

const SECTION_NOTE: Record<string, string> = {
  stories: "아래 ⑤ 스토리 관리의 '변화의 이야기' 대표 글 1개",
  education: '평가 자료 전까지 숨김',
  experts: "아래 ⑤ 스토리 관리의 '전문가 이야기' 대표 글 최대 3개",
  overview: '숫자 카드 5개. 값은 아래 한눈에 보기에서 입력',
  offices: '아래 본부·지부 내용이 이 섹션에 나옵니다',
  programs: '진행사업 페이지 6곳 연결 카드 (고정)',
}

function csvCell(value: string): string {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

function csvOf(doc: ImpactPageDocument): string {
  const lines = ['구분,이름,값,단위,설명,비고']
  for (const row of doc.homeNumbers) {
    lines.push(['메인 숫자', row.label, row.value, row.unit, row.note, ''].map(csvCell).join(','))
  }
  for (const row of doc.overview) {
    lines.push(['한눈에 보기', row.label, row.value, row.unit, row.note, ''].map(csvCell).join(','))
  }
  for (const row of doc.projects ?? []) {
    lines.push(['사업', row.name, row.period, row.field, row.base, row.status].map(csvCell).join(','))
  }
  for (const office of doc.offices ?? []) {
    lines.push(['본부·지부', office.name, office.status, office.kicker, office.programs, office.body].map(csvCell).join(','))
  }
  for (const year of doc.years ?? []) {
    for (const row of year.rows) {
      lines.push(['연도별 실적', year.year, row.name, row.real, row.total, `${row.child}|${row.youth}|${row.teacher}`].map(csvCell).join(','))
    }
  }
  for (const row of doc.evals ?? []) {
    lines.push(['평가', row.program, row.value, row.axis, row.itemName, `${row.mode}|${row.meta}`].map(csvCell).join(','))
  }
  for (const row of doc.stories ?? []) {
    lines.push(['스토리', row.title, row.project, row.category, row.featured ? '대표' : '', row.consent ? '동의' : ''].map(csvCell).join(','))
  }
  return `\uFEFF${lines.join('\n')}`
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"'
        i += 1
      } else if (ch === '"') {
        inQuotes = false
      } else {
        cur += ch
      }
      continue
    }
    if (ch === '"') {
      inQuotes = true
      continue
    }
    if (ch === ',') {
      cells.push(cur)
      cur = ''
      continue
    }
    cur += ch
  }
  cells.push(cur)
  return cells
}

function dedupeYears(years: ImpactYear[]): ImpactYear[] {
  const byYear = new Map<string, ImpactYear>()
  for (const item of years) {
    const key = (item.year || '').trim() || '미정'
    const prev = byYear.get(key)
    if (!prev) {
      byYear.set(key, { year: key === '미정' ? item.year : key, rows: item.rows.map((row) => ({ ...row })) })
      continue
    }
    byYear.set(key, { ...prev, rows: [...prev.rows, ...item.rows.map((row) => ({ ...row }))] })
  }
  return Array.from(byYear.values())
}

function applyImpactCsv(doc: ImpactPageDocument, text: string): ImpactPageDocument {
  const rows = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .slice(1)
    .filter(Boolean)
    .map(parseCsvLine)
  const next: ImpactPageDocument = {
    ...doc,
    homeNumbers: doc.homeNumbers.map((item) => ({ ...item })),
    overview: doc.overview.map((item) => ({ ...item })),
    projects: (doc.projects ?? []).map((item) => ({ ...item })),
    offices: (doc.offices ?? []).map((item) => ({ ...item })),
    years: dedupeYears((doc.years ?? []).map((item) => ({ ...item, rows: item.rows.map((row) => ({ ...row })) }))),
    evals: (doc.evals ?? []).map((item) => ({ ...item })),
    stories: (doc.stories ?? []).map((item) => ({ ...item })),
  }

  for (const cells of rows) {
    const [group, a = '', b = '', c = '', d = '', e = ''] = cells
    if (group === '메인 숫자' || group === '한눈에 보기') {
      const list = group === '메인 숫자' ? next.homeNumbers : next.overview
      const found = list.find((item) => item.label === a)
      if (!found) continue
      found.value = b || found.value
      found.unit = c || found.unit
      found.note = d || found.note
      continue
    }
    if (group === '사업') {
      const found = next.projects.find((item) => item.name === a)
      if (found) {
        found.period = b || found.period
        found.field = c || found.field
        found.base = d || found.base
        found.status = e === '종료' ? '종료' : e === '진행' ? '진행' : found.status
      } else if (a.trim()) {
        next.projects.push({ id: newId('p'), name: a, period: b, field: c, base: d, status: e === '종료' ? '종료' : '진행' })
      }
      continue
    }
    if (group === '본부·지부') {
      const found = next.offices.find((item) => item.name === a || item.kicker === c)
      if (found) {
        found.name = a || found.name
        found.status = b || found.status
        found.kicker = c || found.kicker
        found.programs = d || found.programs
        found.body = e || found.body
      } else if (a.trim()) {
        next.offices.push({
          name: a,
          kicker: c || '지부',
          status: b,
          body: e,
          photo: '',
          photoAlt: '',
          people: '',
          partners: '',
          programs: d,
        })
      }
      continue
    }
    if (group === '연도별 실적') {
      const yearKey = a.trim() || '미정'
      let year = next.years.find((item) => item.year === yearKey)
      if (!year) {
        year = { year: yearKey, rows: [] }
        next.years.push(year)
      }
      const [child = '', youth = '', teacher = ''] = e.split('|')
      const found = year.rows.find((row) => row.name === b)
      if (found) {
        found.real = c || found.real
        found.total = d || found.total
        found.child = child || found.child
        found.youth = youth || found.youth
        found.teacher = teacher || found.teacher
      } else if (b.trim()) {
        year.rows.push({ name: b, real: c, total: d, child, youth, teacher })
      }
      continue
    }
    if (group === '평가') {
      const found = next.evals.find((item) => item.program === a && item.itemName === d)
      const [mode = '', meta = ''] = e.split('|')
      if (found) {
        found.value = b || found.value
        found.axis = c || found.axis
        found.itemName = d || found.itemName
        found.mode = mode || found.mode
        found.meta = meta || found.meta
      } else if (a.trim()) {
        next.evals.push({
          id: newId('e'),
          program: a,
          value: b,
          axis: c || '배우는 힘',
          itemName: d,
          mode: mode || '사전 · 사후',
          meta,
        })
      }
      continue
    }
    if (group === '스토리') {
      const found = next.stories.find((item) => item.title === a)
      const category = c === '전문가 이야기' ? '전문가 이야기' : '변화의 이야기'
      if (found) {
        found.project = b || found.project
        found.category = category
        found.featured = d === '대표' ? true : d === '' ? found.featured : false
        found.consent = e === '동의' ? true : e === '' ? found.consent : false
      } else if (a.trim()) {
        next.stories.push({
          ...blankStory(),
          title: a,
          project: b,
          category,
          featured: d === '대표',
          consent: e === '동의',
        })
      }
    }
  }
  next.years = dedupeYears(next.years)
  return next
}

export function AdminImpactPage() {
  const [doc, setDoc] = useState<ImpactPageDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState('')
  const [savedMode, setSavedMode] = useState<SaveMode | ''>('')
  const [unpublished, setUnpublished] = useState(false)
  const [editLocale, setEditLocale] = useState<AdminEditLocale>('ko')
  const [yearOn, setYearOn] = useState(0)
  const [editingYears, setEditingYears] = useState(false)
  const [editingOffices, setEditingOffices] = useState(false)
  const [editingProjects, setEditingProjects] = useState(false)
  const [editingEvals, setEditingEvals] = useState(false)
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null)
  const storyRichRef = useRef<AdminRichTextEditorHandle | null>(null)

  const withFlushedStoryBody = useCallback(
    (current: ImpactPageDocument) => {
      if (!editingStoryId) return current
      const html = storyRichRef.current?.getHtml()
      if (typeof html !== 'string') return current
      return {
        ...current,
        stories: current.stories.map((item) => (item.id === editingStoryId ? { ...item, body: html } : item)),
      }
    },
    [editingStoryId],
  )

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const loaded = takeUnpublished(await adminFetchImpactPage())
      const next = withVisibleSamples({
        ...loaded.doc,
        years: dedupeYears(loaded.doc.years ?? []),
      })
      next.years = dedupeYears(next.years ?? [])
      setUnpublished(loaded.unpublished)
      setDoc(next)
      const yearIndex = next.years.findIndex((year) => year.year === '2025')
      setYearOn(yearIndex >= 0 ? yearIndex : 0)
    } catch (e) {
      setError(e instanceof Error ? e.message : '불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const location = useLocation()
  const ready = doc != null

  useEffect(() => {
    if (!ready) return
    const id = location.hash.replace(/^#/, '')
    if (!id) return
    const scroll = () => document.getElementById(id)?.scrollIntoView({ block: 'start' })
    const frame = window.requestAnimationFrame(scroll)
    const timer = window.setTimeout(scroll, 250)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [ready, location.hash])

  const onSave = async (mode: SaveMode) => {
    if (!doc) return
    setSaving(true)
    setError('')
    try {
      const payload = withFlushedStoryBody(doc)
      setDoc(payload)
      const saved = takeUnpublished(await adminPutImpactPage(payload, mode))
      setDoc(saved.doc)
      setUnpublished(saved.unpublished)
      setSavedMode(mode)
      resetImpactPageCache()
      setSavedAt(new Date().toLocaleTimeString('ko-KR'))
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  /** 서버 최신본에 스토리만 덮어써서 저장 (다른 구역 미저장 수정은 건드리지 않음) */
  const onSaveStoriesOnly = async () => {
    if (!doc) return
    setSaving(true)
    setError('')
    try {
      const local = withFlushedStoryBody(doc)
      const loaded = takeUnpublished(await adminFetchImpactPage())
      const merged = { ...loaded.doc, stories: local.stories }
      const saved = takeUnpublished(await adminPutImpactPage(merged, 'publish'))
      setDoc({ ...local, stories: saved.doc.stories })
      setUnpublished(saved.unpublished)
      setSavedMode('publish')
      resetImpactPageCache()
      setSavedAt(new Date().toLocaleTimeString('ko-KR'))
    } catch (e) {
      setError(e instanceof Error ? e.message : '스토리 저장에 실패했습니다.')
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

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <p className="admin-page__desc">사업 › 한눈에 보는 카야</p>
          <h1 className="admin-page__title">임팩트 관리</h1>
        </div>
        <div className="admin-page__actions">
          <AdminLocaleTabs value={editLocale} onChange={setEditLocale} />
          <a className="admin-btn" href={editLocale === 'en' ? '/en/business/impact' : '/business/impact'} target="_blank" rel="noopener noreferrer">미리보기</a>
          <button
            type="button"
            className="admin-btn"
            onClick={() => {
              const blob = new Blob([csvOf(doc)], { type: 'text/csv;charset=utf-8' })
              const url = URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.href = url
              link.download = 'impact.csv'
              link.click()
              URL.revokeObjectURL(url)
            }}
          >
            엑셀 내려받기
          </button>
          <label className="admin-btn">
            엑셀 올리기
            <input
              type="file"
              accept=".csv,text/csv"
              hidden
              onChange={async (event) => {
                const file = event.target.files?.[0]
                event.target.value = ''
                if (!file) return
                const text = await file.text()
                const next = applyImpactCsv(doc, text)
                setDoc(next)
                setYearOn((prev) => Math.min(prev, Math.max(next.years.length - 1, 0)))
              }}
            />
          </label>
          <AdminSaveActions saving={saving} onSave={(mode) => void onSave(mode)} />
        </div>
      </div>
      {error ? <p className="admin-banner admin-banner--error">{error}</p> : null}
      {draftStatus(unpublished, savedAt, savedMode) ? <p className="admin-panel__foot">{draftStatus(unpublished, savedAt, savedMode)}</p> : null}
      <AdminLocaleEmptyNote locale={editLocale} />

      <section id="impact-screen" className="admin-panel">
        <div className="admin-panel__head">
          <h2 className="admin-panel__title">① 화면 설정</h2>
          <label className="admin-onoff" title="끄면 한눈에 보는 카야 페이지와 그곳으로 가는 링크만 숨깁니다. 메인 숫자 섹션은 그대로 둡니다.">
            <span>페이지 공개</span>
            <span className={`admin-onoff__state${doc.public ? ' is-on' : ''}`} aria-hidden>
              {doc.public ? 'ON' : 'OFF'}
            </span>
            <input
              type="checkbox"
              role="switch"
              checked={doc.public}
              onChange={(e) => setDoc({ ...doc, public: e.target.checked })}
              aria-label="페이지 공개. 끄면 한눈에 보는 카야 페이지와 그곳으로 가는 링크만 숨깁니다"
            />
            <span className="admin-onoff__track" aria-hidden>
              <span className="admin-onoff__thumb" />
            </span>
          </label>
        </div>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span className="admin-field__label">페이지 제목</span>
            <input className="admin-input" value={doc.headline} onChange={(e) => setDoc({ ...doc, headline: e.target.value })} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">핵심 메시지 · 3단계 설명</span>
            <input className="admin-input" value={doc.message} onChange={(e) => setDoc({ ...doc, message: e.target.value })} />
          </label>
        </div>
        <table className="admin-sheet">
          <thead>
            <tr>
              <th>섹션</th>
              <th>표시</th>
              <th>순서</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            {doc.sections
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((row) => (
                <tr key={row.id}>
                  <td>{IMPACT_SECTION_LABEL[row.id] ?? row.id}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={row.enabled}
                      aria-label={`${IMPACT_SECTION_LABEL[row.id] ?? row.id} 표시`}
                      onChange={(e) =>
                        setDoc({
                          ...doc,
                          sections: doc.sections.map((item) => (item.id === row.id ? { ...item, enabled: e.target.checked } : item)),
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="admin-input"
                      type="number"
                      value={row.order}
                      aria-label={`${IMPACT_SECTION_LABEL[row.id] ?? row.id} 순서`}
                      onChange={(e) =>
                        setDoc({
                          ...doc,
                          sections: doc.sections.map((item) => (item.id === row.id ? { ...item, order: Number(e.target.value) } : item)),
                        })
                      }
                    />
                  </td>
                  <td>{SECTION_NOTE[row.id] ?? ''}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="admin-form-grid" style={{ marginTop: 16 }}>
          <label className="admin-field">
            <span className="admin-field__label">메인 노출 숫자 (4개)</span>
            <input className="admin-input" value={doc.homeNumbers.map((row) => row.label).filter(Boolean).join(' · ')} readOnly />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">메인 대표 사례</span>
            <input className="admin-input" value={doc.featuredLabel ?? ''} placeholder="스토리(변화의 이야기)에서 1건 선택" onChange={(e) => setDoc({ ...doc, featuredLabel: e.target.value })} />
          </label>
          <div className="admin-field">
            <span className="admin-field__label">후원 페이지 연동</span>
            <div className="admin-segmented" role="group" aria-label="후원 페이지 연동">
              <button type="button" className={`admin-segmented__btn${(doc.supportScope ?? 'all') === 'all' ? ' admin-segmented__btn--active' : ''}`} onClick={() => setDoc({ ...doc, supportScope: 'all' })}>기관 전체</button>
              <button type="button" className={`admin-segmented__btn${doc.supportScope === 'country' ? ' admin-segmented__btn--active' : ''}`} onClick={() => setDoc({ ...doc, supportScope: 'country' })}>국가 선택</button>
            </div>
          </div>
        </div>
        <details className="admin-fold">
          <summary className="admin-fold__summary">메인 숫자</summary>
          <table className="admin-sheet">
            <thead>
              <tr><th>메인 숫자</th><th>값</th><th>단위</th><th>설명</th></tr>
            </thead>
            <tbody>
              {doc.homeNumbers.map((row, index) => (
                <tr key={`${row.label}-${index}`}>
                  <td><input className="admin-input" aria-label="이름" value={row.label} onChange={(e) => setDoc({ ...doc, homeNumbers: doc.homeNumbers.map((item, itemIndex) => itemIndex === index ? { ...item, label: e.target.value } : item) })} /></td>
                  <td><input className="admin-input" aria-label="값" value={row.value} onChange={(e) => setDoc({ ...doc, homeNumbers: doc.homeNumbers.map((item, itemIndex) => itemIndex === index ? { ...item, value: e.target.value } : item) })} /></td>
                  <td><input className="admin-input" aria-label="단위" value={row.unit} onChange={(e) => setDoc({ ...doc, homeNumbers: doc.homeNumbers.map((item, itemIndex) => itemIndex === index ? { ...item, unit: e.target.value } : item) })} /></td>
                  <td><input className="admin-input" aria-label="설명" value={row.note} onChange={(e) => setDoc({ ...doc, homeNumbers: doc.homeNumbers.map((item, itemIndex) => itemIndex === index ? { ...item, note: e.target.value } : item) })} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
        <details className="admin-fold">
          <summary className="admin-fold__summary">한눈에 보기</summary>
          <table className="admin-sheet">
            <thead>
              <tr><th>한눈에 보기</th><th>값</th><th>단위</th><th>설명</th></tr>
            </thead>
            <tbody>
              {doc.overview.map((row, index) => (
                <tr key={`${row.label}-${index}`}>
                  <td>{row.label}</td>
                  <td><input className="admin-input" aria-label={`${row.label} 값`} value={row.value} onChange={(e) => setDoc({ ...doc, overview: doc.overview.map((item, itemIndex) => itemIndex === index ? { ...item, value: e.target.value } : item) })} /></td>
                  <td><input className="admin-input" aria-label={`${row.label} 단위`} value={row.unit} onChange={(e) => setDoc({ ...doc, overview: doc.overview.map((item, itemIndex) => itemIndex === index ? { ...item, unit: e.target.value } : item) })} /></td>
                  <td><input className="admin-input" aria-label={`${row.label} 설명`} value={row.note} onChange={(e) => setDoc({ ...doc, overview: doc.overview.map((item, itemIndex) => itemIndex === index ? { ...item, note: e.target.value } : item) })} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </section>

      <section id="impact-projects" className="admin-panel">
        <div className="admin-panel__head">
          <h2 className="admin-panel__title">② 사업 관리</h2>
          <div className="admin-panel__tools">
            <button type="button" className="biz-edit" onClick={() => setEditingProjects((v) => !v)}>
              {editingProjects ? '표로 보기' : '수정'}
            </button>
            {editingProjects ? (
              <button
                type="button"
                className="admin-btn admin-btn--add"
                onClick={() => setDoc({ ...doc, projects: [...(doc.projects ?? []), { id: newId('p'), name: '', base: '', field: '', period: '', status: '진행' }] })}
              >
                + 사업 추가
              </button>
            ) : null}
          </div>
        </div>
        <table className="admin-sheet impact-sheet">
          <thead>
            <tr>
              <th>사업명</th>
              <th>거점</th>
              <th>분야</th>
              <th>기간</th>
              <th>상태</th>
              {editingProjects ? <th></th> : null}
            </tr>
          </thead>
          <tbody>
            {(doc.projects ?? []).map((row, index) => (
              <tr key={row.id}>
                {(['name', 'base', 'field', 'period'] as const).map((key) => (
                  <td key={key}>
                    {editingProjects ? (
                      <input
                        className="admin-input"
                        value={row[key]}
                        aria-label={key}
                        onChange={(e) =>
                          setDoc({
                            ...doc,
                            projects: doc.projects.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, [key]: e.target.value } : item,
                            ),
                          })
                        }
                      />
                    ) : (
                      row[key] || '—'
                    )}
                  </td>
                ))}
                <td>
                  {editingProjects ? (
                    <button
                      type="button"
                      className={`admin-status${row.status === '진행' ? ' admin-status--on' : ' admin-status--off'}`}
                      onClick={() =>
                        setDoc({
                          ...doc,
                          projects: doc.projects.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, status: item.status === '진행' ? '종료' : '진행' } : item,
                          ),
                        })
                      }
                    >
                      {row.status}
                    </button>
                  ) : (
                    <span className={`admin-status${row.status === '진행' ? ' admin-status--on' : ' admin-status--off'}`}>{row.status}</span>
                  )}
                </td>
                {editingProjects ? (
                  <td>
                    <button
                      type="button"
                      className="admin-btn admin-btn--sm"
                      onClick={() => setDoc({ ...doc, projects: doc.projects.filter((item) => item.id !== row.id) })}
                    >
                      삭제
                    </button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
        <details id="impact-offices" className="admin-fold" open>
          <summary className="admin-fold__summary">본부·지부 관리</summary>
          <div className="admin-panel__tools" style={{ margin: '10px 0 0' }}>
            <button type="button" className="biz-edit" onClick={() => setEditingOffices((v) => !v)}>
              {editingOffices ? '표로 보기' : '수정'}
            </button>
            {editingOffices ? (
              <button
                type="button"
                className="admin-btn admin-btn--add"
                onClick={() =>
                  setDoc({
                    ...doc,
                    offices: [
                      ...doc.offices,
                      {
                        name: '',
                        kicker: '지부',
                        status: '',
                        body: '',
                        photo: '',
                        photoAlt: '',
                        people: '',
                        partners: '',
                        programs: '',
                      },
                    ],
                  })
                }
              >
                + 본부·지부
              </button>
            ) : null}
          </div>
          {editingOffices ? (
            <div className="impact-office-list">
              {doc.offices.map((office, index) => {
                const patchOffice = (partial: Partial<ImpactOffice>) =>
                  setDoc({
                    ...doc,
                    offices: doc.offices.map((item, itemIndex) => (itemIndex === index ? { ...item, ...partial } : item)),
                  })
                return (
                  <article key={`${office.kicker}-${index}`} className="impact-office-card">
                    <div className="impact-office-card__head">
                      <label className="admin-field impact-office-card__name">
                        <span className="admin-field__label">이름</span>
                        <input className="admin-input" value={office.name} aria-label="이름" onChange={(e) => patchOffice({ name: e.target.value })} />
                      </label>
                      <button
                        type="button"
                        className="admin-btn admin-btn--sm"
                        onClick={() => setDoc({ ...doc, offices: doc.offices.filter((_, itemIndex) => itemIndex !== index) })}
                      >
                        삭제
                      </button>
                    </div>
                    <div className="impact-office-card__meta">
                      <label className="admin-field">
                        <span className="admin-field__label">구분</span>
                        <input className="admin-input" value={office.kicker} aria-label="구분" onChange={(e) => patchOffice({ kicker: e.target.value })} />
                      </label>
                      <label className="admin-field">
                        <span className="admin-field__label">상태</span>
                        <input className="admin-input" value={office.status} aria-label="상태" onChange={(e) => patchOffice({ status: e.target.value })} />
                      </label>
                      <label className="admin-field">
                        <span className="admin-field__label">하는 일</span>
                        <input className="admin-input" value={office.programs} aria-label="하는 일" onChange={(e) => patchOffice({ programs: e.target.value })} />
                      </label>
                      <label className="admin-field">
                        <span className="admin-field__label">인원</span>
                        <input className="admin-input" value={office.people} aria-label="인원" onChange={(e) => patchOffice({ people: e.target.value })} />
                      </label>
                      <label className="admin-field">
                        <span className="admin-field__label">파트너</span>
                        <input className="admin-input" value={office.partners} aria-label="파트너" onChange={(e) => patchOffice({ partners: e.target.value })} />
                      </label>
                    </div>
                    <div className="impact-office-card__content">
                      <label className="admin-field impact-office-card__body">
                        <span className="admin-field__label">본문</span>
                        <textarea
                          className="admin-input"
                          rows={5}
                          value={office.body}
                          aria-label="본문"
                          onChange={(e) => patchOffice({ body: e.target.value })}
                        />
                      </label>
                      <div className="impact-office-card__photo">
                        <span className="admin-field__label">사진</span>
                        <AdminMediaUpload
                          compact
                          label={`${office.name || '본부·지부'} 사진`}
                          variant="image"
                          value={office.photo || null}
                          onChange={(url) => patchOffice({ photo: url ?? '' })}
                        />
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <table className="admin-sheet impact-sheet">
              <thead>
                <tr>
                  <th>이름</th>
                  <th>구분</th>
                  <th>상태</th>
                  <th>하는 일</th>
                  <th>인원</th>
                  <th>파트너</th>
                </tr>
              </thead>
              <tbody>
                {doc.offices.map((office, index) => (
                  <tr key={`${office.kicker}-${index}`}>
                    <td>{office.name || '—'}</td>
                    <td>{office.kicker || '—'}</td>
                    <td>{office.status || '—'}</td>
                    <td>{office.programs || '—'}</td>
                    <td>{office.people || '—'}</td>
                    <td>{office.partners || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </details>
      </section>

      <section id="impact-years" className="admin-panel">
        <div className="admin-panel__head">
          <h2 className="admin-panel__title">③ 연도별 실적</h2>
          <div className="admin-panel__tools">
            <div className="admin-segmented" role="tablist" aria-label="연도">
              {(doc.years ?? []).map((year, index) => (
                <button
                  key={`${year.year}-${index}`}
                  type="button"
                  className={`admin-segmented__btn${index === Math.min(yearOn, doc.years.length - 1) ? ' admin-segmented__btn--active' : ''}`}
                  onClick={() => setYearOn(index)}
                >
                  {year.year || '연도'}
                </button>
              ))}
            </div>
            <button type="button" className="biz-edit" onClick={() => setEditingYears((v) => !v)}>
              {editingYears ? '표로 보기' : '수정'}
            </button>
            {editingYears ? (
              <button
                type="button"
                className="admin-btn admin-btn--add"
                onClick={() => {
                  const used = new Set((doc.years ?? []).map((item) => item.year.trim()))
                  let nextYear = new Date().getFullYear()
                  while (used.has(String(nextYear))) nextYear += 1
                  setDoc({ ...doc, years: [...(doc.years ?? []), { year: String(nextYear), rows: [] }] })
                  setYearOn((doc.years ?? []).length)
                }}
              >
                + 연도
              </button>
            ) : null}
          </div>
        </div>
        {(doc.years ?? []).map((year, yearIndex) =>
          yearIndex !== Math.min(yearOn, doc.years.length - 1) ? null : (
            <div key={`${year.year}-${yearIndex}`} className="impact-year-panel">
              {editingYears ? (
                <div className="admin-panel__tools impact-year-tools">
                  <label className="admin-field" style={{ flex: '0 1 140px' }}>
                    <span className="admin-field__label">연도명</span>
                    <input
                      className="admin-input"
                      value={year.year}
                      onChange={(e) => {
                        const value = e.target.value.trim()
                        const dup = doc.years.some((item, index) => index !== yearIndex && item.year.trim() === value)
                        if (dup) {
                          window.alert('같은 연도가 이미 있습니다.')
                          return
                        }
                        setDoc({
                          ...doc,
                          years: doc.years.map((item, index) => (index === yearIndex ? { ...item, year: e.target.value } : item)),
                        })
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    className="admin-btn admin-btn--add"
                    onClick={() =>
                      setDoc({
                        ...doc,
                        years: doc.years.map((item, index) =>
                          index === yearIndex ? { ...item, rows: [...item.rows, { name: '', real: '', total: '', child: '', youth: '', teacher: '' }] } : item,
                        ),
                      })
                    }
                  >
                    + 행
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn--sm"
                    onClick={() => {
                      const next = doc.years.filter((_, index) => index !== yearIndex)
                      setDoc({ ...doc, years: next })
                      setYearOn((prev) => Math.min(prev, Math.max(next.length - 1, 0)))
                    }}
                  >
                    이 연도 삭제
                  </button>
                </div>
              ) : null}
              <table className="admin-sheet impact-sheet">
                <thead>
                  <tr>
                    <th>사업</th>
                    <th>실인원</th>
                    <th>연인원</th>
                    <th>아동·청소년</th>
                    <th>청년</th>
                    <th>교사</th>
                    {editingYears ? <th></th> : null}
                  </tr>
                </thead>
                <tbody>
                  {year.rows.map((row, rowIndex) => {
                    const totalRow = row.name.includes('중복 제외')
                    const setCell = (key: 'name' | 'real' | 'total' | 'child' | 'youth' | 'teacher', value: string) =>
                      setDoc({
                        ...doc,
                        years: doc.years.map((item, index) =>
                          index === yearIndex
                            ? { ...item, rows: item.rows.map((line, lineIndex) => (lineIndex === rowIndex ? { ...line, [key]: value } : line)) }
                            : item,
                        ),
                      })
                    return (
                      <tr key={rowIndex}>
                        <td>
                          {editingYears ? (
                            <input className="admin-input" value={row.name} aria-label="사업" onChange={(e) => setCell('name', e.target.value)} />
                          ) : (
                            row.name || '—'
                          )}
                        </td>
                        {totalRow ? (
                          <td colSpan={5}>
                            {editingYears ? (
                              <input className="admin-input" value={row.real} aria-label="전체 참여자" onChange={(e) => setCell('real', e.target.value)} />
                            ) : (
                              row.real || '—'
                            )}
                          </td>
                        ) : (
                          (['real', 'total', 'child', 'youth', 'teacher'] as const).map((key) => (
                            <td key={key}>
                              {editingYears ? (
                                <input className="admin-input" value={row[key]} aria-label={key} onChange={(e) => setCell(key, e.target.value)} />
                              ) : (
                                row[key] || '—'
                              )}
                            </td>
                          ))
                        )}
                        {editingYears ? (
                          <td>
                            <button
                              type="button"
                              className="admin-btn admin-btn--sm"
                              onClick={() =>
                                setDoc({
                                  ...doc,
                                  years: doc.years.map((item, index) =>
                                    index === yearIndex ? { ...item, rows: item.rows.filter((_, lineIndex) => lineIndex !== rowIndex) } : item,
                                  ),
                                })
                              }
                            >
                              삭제
                            </button>
                          </td>
                        ) : null}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ),
        )}
      </section>

      <section id="impact-evals" className="admin-panel">
        <div className="admin-panel__head">
          <h2 className="admin-panel__title">④ 평가 결과</h2>
          <div className="admin-panel__tools">
            <button type="button" className="biz-edit" onClick={() => setEditingEvals((v) => !v)}>
              {editingEvals ? '표로 보기' : '수정'}
            </button>
            {editingEvals ? (
              <button
                type="button"
                className="admin-btn admin-btn--add"
                onClick={() => {
                  setDoc({
                    ...doc,
                    evals: [...(doc.evals ?? []), { id: newId('e'), program: '', axis: '배우는 힘', mode: '사전 · 사후', value: '', itemName: '', meta: '' }],
                  })
                }}
              >
                + 평가 추가
              </button>
            ) : null}
          </div>
        </div>
        <table className="admin-sheet impact-sheet">
          <thead>
            <tr>
              <th>연결 사업</th>
              <th>교육 축</th>
              <th>표시 방식</th>
              <th>값 · 단위</th>
              <th>항목 이름</th>
              <th>대상 · 시점</th>
              {editingEvals ? <th></th> : null}
            </tr>
          </thead>
          <tbody>
            {(doc.evals ?? []).map((row, index) => (
              <tr key={row.id}>
                <td>
                  {editingEvals ? (
                    <input
                      className="admin-input"
                      value={row.program}
                      onChange={(e) => setDoc({ ...doc, evals: doc.evals.map((item, itemIndex) => (itemIndex === index ? { ...item, program: e.target.value } : item)) })}
                    />
                  ) : (
                    row.program || '—'
                  )}
                </td>
                <td>
                  {editingEvals ? (
                    <select
                      className="admin-input"
                      value={row.axis}
                      onChange={(e) => setDoc({ ...doc, evals: doc.evals.map((item, itemIndex) => (itemIndex === index ? { ...item, axis: e.target.value } : item)) })}
                    >
                      {['배우는 힘', '살아가는 힘', '선택하는 힘'].map((axis) => (
                        <option key={axis} value={axis}>
                          {axis}
                        </option>
                      ))}
                    </select>
                  ) : (
                    row.axis || '—'
                  )}
                </td>
                <td>
                  {editingEvals ? (
                    <select
                      className="admin-input"
                      value={row.mode}
                      onChange={(e) => setDoc({ ...doc, evals: doc.evals.map((item, itemIndex) => (itemIndex === index ? { ...item, mode: e.target.value } : item)) })}
                    >
                      {['사전 · 사후', '단일 수치(%)', '향상률(%p)'].map((mode) => (
                        <option key={mode} value={mode}>
                          {mode}
                        </option>
                      ))}
                    </select>
                  ) : (
                    row.mode || '—'
                  )}
                </td>
                <td>
                  {editingEvals ? (
                    <input
                      className="admin-input"
                      value={row.value}
                      onChange={(e) => setDoc({ ...doc, evals: doc.evals.map((item, itemIndex) => (itemIndex === index ? { ...item, value: e.target.value } : item)) })}
                    />
                  ) : (
                    row.value || '—'
                  )}
                </td>
                <td>
                  {editingEvals ? (
                    <input
                      className="admin-input"
                      value={row.itemName}
                      onChange={(e) => setDoc({ ...doc, evals: doc.evals.map((item, itemIndex) => (itemIndex === index ? { ...item, itemName: e.target.value } : item)) })}
                    />
                  ) : (
                    row.itemName || '—'
                  )}
                </td>
                <td>
                  {editingEvals ? (
                    <input
                      className="admin-input"
                      value={row.meta}
                      onChange={(e) => setDoc({ ...doc, evals: doc.evals.map((item, itemIndex) => (itemIndex === index ? { ...item, meta: e.target.value } : item)) })}
                    />
                  ) : (
                    row.meta || '—'
                  )}
                </td>
                {editingEvals ? (
                  <td>
                    <button type="button" className="admin-btn admin-btn--sm" onClick={() => setDoc({ ...doc, evals: doc.evals.filter((item) => item.id !== row.id) })}>
                      삭제
                    </button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="impact-stories" className="admin-panel">
        <div className="admin-panel__head">
          <h2 className="admin-panel__title">⑤ 스토리 관리</h2>
          <div className="admin-panel__tools">
            <button
              type="button"
              className="admin-btn admin-btn--add"
              onClick={() => {
                const next = blankStory()
                setDoc((current) => {
                  const base = current ? withFlushedStoryBody(current) : doc
                  return { ...base, stories: [...(base.stories ?? []), next] }
                })
                setEditingStoryId(next.id)
              }}
            >
              + 글쓰기
            </button>
            <button type="button" className="admin-btn admin-btn--primary" disabled={saving} onClick={() => void onSaveStoriesOnly()}>
              {saving ? '저장 중…' : '스토리 저장'}
            </button>
          </div>
        </div>
        <p className="admin-panel__foot">변화의 이야기·전문가 이야기는 게시글이 아니라 여기서만 등록·수정합니다. 「스토리 저장」은 이 구역만 서버에 반영하고, 다른 구역의 미저장 수정은 그대로 둡니다.</p>
        <table className="admin-sheet impact-sheet">
          <thead>
            <tr>
              <th>카테고리</th>
              <th>제목</th>
              <th>연결 사업</th>
              <th>대표</th>
              <th>동의</th>
              <th>순서 · 수정</th>
            </tr>
          </thead>
          <tbody>
            {(doc.stories ?? []).map((row) => (
              <tr key={row.id} className={editingStoryId === row.id ? 'is-selected' : undefined}>
                <td>{row.category}</td>
                <td>{row.title || '(제목 없음)'}</td>
                <td>{row.project || '—'}</td>
                <td>{row.featured ? '지정' : '지정 안 함'}</td>
                <td>{row.consent ? '확인' : '미확인'}</td>
                <td>
                  <button
                    type="button"
                    className="biz-edit"
                    onClick={() => {
                      setDoc((current) => (current ? withFlushedStoryBody(current) : current))
                      setEditingStoryId((id) => (id === row.id ? null : row.id))
                    }}
                  >
                    {editingStoryId === row.id ? '닫기' : '수정'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(doc.stories ?? []).map((row, index) => {
          if (editingStoryId !== row.id) return null
          const setStory = (partial: Partial<ImpactStory>) =>
            setDoc({ ...doc, stories: doc.stories.map((item, itemIndex) => (itemIndex === index ? { ...item, ...partial } : item)) })
          return (
            <div key={`edit-${row.id}`} className="impact-story-edit">
              <p className="impact-story-edit__head">
                <b>{row.category}</b>
                <span>{row.title.trim() || '제목 없음'}</span>
              </p>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <span className="admin-field__label">카테고리</span>
                  <div className="admin-segmented admin-segmented--tight">
                    {(['변화의 이야기', '전문가 이야기'] as const).map((category) => (
                      <button key={category} type="button" className={`admin-segmented__btn${row.category === category ? ' admin-segmented__btn--active' : ''}`} onClick={() => setStory({ category })}>
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="admin-field">
                  <span className="admin-field__label">제목</span>
                  <input className="admin-input" value={row.title} onChange={(e) => setStory({ title: e.target.value })} />
                </label>
                <label className="admin-field">
                  <span className="admin-field__label">연결 사업</span>
                  <input className="admin-input" value={row.project} onChange={(e) => setStory({ project: e.target.value })} />
                </label>
                <div className="admin-field">
                  <span className="admin-field__label">대표 글로 지정</span>
                  <div className="admin-segmented admin-segmented--tight">
                    <button type="button" className={`admin-segmented__btn${row.featured ? ' admin-segmented__btn--active' : ''}`} onClick={() => setStory({ featured: true })}>
                      지정
                    </button>
                    <button type="button" className={`admin-segmented__btn${!row.featured ? ' admin-segmented__btn--active' : ''}`} onClick={() => setStory({ featured: false })}>
                      지정 안 함
                    </button>
                  </div>
                </div>
                <div className="admin-field admin-field--full">
                  <span className="admin-field__label">본문</span>
                  <AdminRichTextEditor key={row.id} ref={storyRichRef} initialHtml={row.body || ''} />
                </div>
              </div>
              {row.category === '변화의 이야기' ? (
                <div className="impact-story-steps">
                  <p className="admin-field__label">변화 단계 (Before → Sustainability)</p>
                  {(
                    [
                      ['before', 'Before'],
                      ['intervention', 'Intervention'],
                      ['after', 'After'],
                      ['evidence', 'Evidence'],
                      ['sustainability', 'Sustainability'],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} className="admin-field">
                      <span className="admin-field__label">{label}</span>
                      <textarea
                        className="admin-input"
                        rows={3}
                        aria-label={`변화의 이야기 ${label}`}
                        value={row[key] ?? ''}
                        onChange={(e) => setStory({ [key]: e.target.value })}
                      />
                    </label>
                  ))}
                </div>
              ) : (
                <div className="admin-form-grid">
                  <label className="admin-field">
                    <span className="admin-field__label">이름</span>
                    <input className="admin-input" value={row.expertName ?? ''} onChange={(e) => setStory({ expertName: e.target.value })} />
                  </label>
                  <label className="admin-field">
                    <span className="admin-field__label">소속</span>
                    <input className="admin-input" value={row.expertOrg ?? ''} onChange={(e) => setStory({ expertOrg: e.target.value })} />
                  </label>
                  <label className="admin-field">
                    <span className="admin-field__label">전문 분야</span>
                    <input className="admin-input" value={row.expertField ?? ''} onChange={(e) => setStory({ expertField: e.target.value })} />
                  </label>
                  <label className="admin-field">
                    <span className="admin-field__label">평가 한두 문장</span>
                    <input className="admin-input" value={row.expertLine ?? ''} onChange={(e) => setStory({ expertLine: e.target.value })} />
                  </label>
                  <div className="admin-field admin-field--full">
                    <AdminMediaUpload label="전문가 사진 (선택)" variant="image" value={row.expertPhoto || null} onChange={(url) => setStory({ expertPhoto: url ?? '' })} />
                  </div>
                </div>
              )}
              <label className="impact-consent">
                <input type="checkbox" checked={row.consent} onChange={(e) => setStory({ consent: e.target.checked })} />
                사진·인터뷰 게재 동의 확인 (체크해야 공개 가능)
              </label>
              <div className="admin-panel__tools">
                <button
                  type="button"
                  className="admin-btn admin-btn--sm"
                  onClick={() => {
                    setDoc({ ...doc, stories: doc.stories.filter((item) => item.id !== row.id) })
                    setEditingStoryId(null)
                    storyRichRef.current = null
                  }}
                >
                  이 글 삭제
                </button>
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}
