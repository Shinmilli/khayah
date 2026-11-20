import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AdminMediaUpload } from '../components/AdminMediaUpload'
import { AdminLocaleEmptyNote, AdminLocaleTabs, type AdminEditLocale } from '../components/AdminLocaleTabs'
import { AdminSaveActions, draftStatus, takeUnpublished } from '../AdminSaveActions'
import { adminFetchImpactPage, adminPutImpactPage, type SaveMode } from '../../../services/api'
import { resetImpactPageCache } from '../../impact/useImpactPage'
import { IMPACT_SECTION_LABEL, type ImpactPageDocument } from '../../impact/impactPageTypes'

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
    years: doc.years?.length
      ? doc.years
      : ['2024', '2025', '2026'].map((year) => ({ year, rows: SAMPLE_YEAR_ROWS.map((row) => ({ ...row })) })),
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
    stories: doc.stories?.length ? doc.stories : [blankStory()],
  }
}

const SECTION_NOTE: Record<string, string> = {
  stories: "스토리 게시판 '변화의 이야기' 대표 글 1개",
  education: '평가 자료 전까지 숨김',
  experts: "스토리 게시판 '전문가 이야기' 대표 글 최대 3개",
  overview: '숫자 카드 5개. 값은 아래 한눈에 보기에서 입력',
  offices: '아래 본부·지부 내용이 이 섹션에 나옵니다',
  programs: '진행사업 페이지 6곳 연결 카드 (고정)',
}

function csvOf(doc: ImpactPageDocument): string {
  const lines = ['구분,이름,값,단위,설명']
  for (const row of doc.homeNumbers) lines.push(['메인 숫자', row.label, row.value, row.unit, row.note].map(csvCell).join(','))
  for (const row of doc.overview) lines.push(['한눈에 보기', row.label, row.value, row.unit, row.note].map(csvCell).join(','))
  return `\uFEFF${lines.join('\n')}`
}

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`
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

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const loaded = takeUnpublished(await adminFetchImpactPage())
      const next = withVisibleSamples(loaded.doc)
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
      const saved = takeUnpublished(await adminPutImpactPage(doc, mode))
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
                const text = (await file.text()).replace(/^\uFEFF/, '')
                const rows = text.split(/\r?\n/).slice(1).filter(Boolean)
                const next = { ...doc, homeNumbers: doc.homeNumbers.map((item) => ({ ...item })), overview: doc.overview.map((item) => ({ ...item })) }
                for (const line of rows) {
                  const cells = line.split(',').map((cell) => cell.replace(/^"|"$/g, '').replace(/""/g, '"'))
                  const [group, label, value, unit, note] = cells
                  const list = group === '메인 숫자' ? next.homeNumbers : group === '한눈에 보기' ? next.overview : null
                  const found = list?.find((item) => item.label === label)
                  if (!found) continue
                  found.value = value ?? found.value
                  found.unit = unit ?? found.unit
                  found.note = note ?? found.note
                }
                setDoc(next)
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
          <button type="button" className="admin-btn" onClick={() => setDoc({ ...doc, projects: [...(doc.projects ?? []), { id: newId('p'), name: '', base: '', field: '', period: '', status: '진행' }] })}>
            + 사업 추가
          </button>
        </div>
        <table className="admin-sheet">
          <thead>
            <tr><th>사업명</th><th>거점</th><th>분야</th><th>기간</th><th>상태</th><th></th></tr>
          </thead>
          <tbody>
            {(doc.projects ?? []).map((row, index) => (
              <tr key={row.id}>
                {(['name', 'base', 'field', 'period'] as const).map((key) => (
                  <td key={key}>
                    <input className="admin-input" value={row[key]} aria-label={key} onChange={(e) => setDoc({ ...doc, projects: doc.projects.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: e.target.value } : item)) })} />
                  </td>
                ))}
                <td>
                  <button type="button" className={`admin-status${row.status === '진행' ? ' admin-status--on' : ' admin-status--off'}`} onClick={() => setDoc({ ...doc, projects: doc.projects.map((item, itemIndex) => (itemIndex === index ? { ...item, status: item.status === '진행' ? '종료' : '진행' } : item)) })}>{row.status}</button>
                </td>
                <td>
                  <button type="button" className="admin-btn admin-btn--sm" onClick={() => setDoc({ ...doc, projects: doc.projects.filter((item) => item.id !== row.id) })}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <details id="impact-offices" className="admin-fold">
          <summary className="admin-fold__summary">본부·지부 관리</summary>
        <table className="admin-sheet">
          <thead>
            <tr>
              <th>이름</th>
              <th>구분</th>
              <th>상태</th>
              <th>하는 일</th>
            </tr>
          </thead>
          <tbody>
            {doc.offices.map((office) => (
              <tr key={office.kicker}>
                <td>{office.name}</td>
                <td>{office.kicker}</td>
                <td>{office.status}</td>
                <td>{office.programs}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {doc.offices.map((office, index) => (
          <div key={office.kicker} className="admin-item">
            <AdminMediaUpload
              label={`${office.name} 현장 사진`}
              variant="image"
              value={office.photo || null}
              onChange={(url) =>
                setDoc({
                  ...doc,
                  offices: doc.offices.map((item, itemIndex) => (itemIndex === index ? { ...item, photo: url ?? '' } : item)),
                })
              }
            />
            <div className="admin-form-grid">
              <label className="admin-field">
                <span className="admin-field__label">상태</span>
                <input
                  className="admin-input"
                  value={office.status}
                  onChange={(e) =>
                    setDoc({
                      ...doc,
                      offices: doc.offices.map((item, itemIndex) => (itemIndex === index ? { ...item, status: e.target.value } : item)),
                    })
                  }
                />
              </label>
              <label className="admin-field">
                <span className="admin-field__label">하는 일</span>
                <input
                  className="admin-input"
                  value={office.programs}
                  onChange={(e) =>
                    setDoc({
                      ...doc,
                      offices: doc.offices.map((item, itemIndex) => (itemIndex === index ? { ...item, programs: e.target.value } : item)),
                    })
                  }
                />
              </label>
              <label className="admin-field admin-field--full">
                <span className="admin-field__label">본문</span>
                <textarea
                  className="admin-input"
                  rows={3}
                  value={office.body}
                  onChange={(e) =>
                    setDoc({
                      ...doc,
                      offices: doc.offices.map((item, itemIndex) => (itemIndex === index ? { ...item, body: e.target.value } : item)),
                    })
                  }
                />
              </label>
            </div>
          </div>
        ))}
        </details>
      </section>

      <section id="impact-years" className="admin-panel">
        <div className="admin-panel__head">
          <h2 className="admin-panel__title">③ 연도별 실적</h2>
          <div className="admin-panel__tools">
            <div className="admin-segmented" role="tablist" aria-label="연도">
              {(doc.years ?? []).map((year, index) => (
                <button key={`${year.year}-${index}`} type="button" className={`admin-segmented__btn${index === Math.min(yearOn, doc.years.length - 1) ? ' admin-segmented__btn--active' : ''}`} onClick={() => setYearOn(index)}>{year.year || '연도'}</button>
              ))}
            </div>
            <button type="button" className="admin-btn" onClick={() => setDoc({ ...doc, years: [...(doc.years ?? []), { year: String(new Date().getFullYear()), rows: [] }] })}>+ 연도</button>
          </div>
        </div>
        {(doc.years ?? []).map((year, yearIndex) => yearIndex !== Math.min(yearOn, doc.years.length - 1) ? null : (
          <div key={`${year.year}-${yearIndex}`}>
            <div className="admin-panel__tools" style={{ marginBottom: 12 }}>
              <label className="admin-field" style={{ flex: '0 1 160px' }}>
                <span className="admin-field__label">연도</span>
                <input className="admin-input" value={year.year} onChange={(e) => setDoc({ ...doc, years: doc.years.map((item, index) => (index === yearIndex ? { ...item, year: e.target.value } : item)) })} />
              </label>
              <button type="button" className="admin-btn admin-btn--sm" onClick={() => setDoc({ ...doc, years: doc.years.map((item, index) => (index === yearIndex ? { ...item, rows: [...item.rows, { name: '', real: '', total: '', child: '', youth: '', teacher: '' }] } : item)) })}>+ 행</button>
            </div>
            <table className="admin-sheet">
              <thead><tr><th>사업</th><th>실인원</th><th>연인원</th><th>아동·청소년</th><th>청년</th><th>교사</th></tr></thead>
              <tbody>
                {year.rows.map((row, rowIndex) => {
                  const totalRow = row.name.includes('중복 제외')
                  const setCell = (key: 'name' | 'real' | 'total' | 'child' | 'youth' | 'teacher', value: string) =>
                    setDoc({ ...doc, years: doc.years.map((item, index) => index === yearIndex ? { ...item, rows: item.rows.map((line, lineIndex) => lineIndex === rowIndex ? { ...line, [key]: value } : line) } : item) })
                  return (
                    <tr key={rowIndex}>
                      <td>
                        <input className="admin-input" value={row.name} aria-label="사업" onChange={(e) => setCell('name', e.target.value)} />
                      </td>
                      {totalRow ? (
                        <td colSpan={5}>
                          <input className="admin-input" value={row.real} aria-label="전체 참여자" onChange={(e) => setCell('real', e.target.value)} />
                        </td>
                      ) : (
                        (['real', 'total', 'child', 'youth', 'teacher'] as const).map((key) => (
                          <td key={key}>
                            <input className="admin-input" value={row[key]} aria-label={key} onChange={(e) => setCell(key, e.target.value)} />
                          </td>
                        ))
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ))}
      </section>

      <section id="impact-evals" className="admin-panel">
        <div className="admin-panel__head">
          <h2 className="admin-panel__title">④ 평가 결과</h2>
          <button type="button" className="admin-btn" onClick={() => setDoc({ ...doc, evals: [...(doc.evals ?? []), { id: newId('e'), program: '', axis: '배우는 힘', mode: '사전 · 사후', value: '', itemName: '', meta: '' }] })}>+ 평가 추가</button>
        </div>
        {(doc.evals ?? []).map((row, index) => (
          <div key={row.id} className="impact-block">
            <div className="impact-quad">
              <label className="admin-field"><span className="admin-field__label">연결 사업</span><input className="admin-input" value={row.program} onChange={(e) => setDoc({ ...doc, evals: doc.evals.map((item, itemIndex) => itemIndex === index ? { ...item, program: e.target.value } : item) })} /></label>
              <div className="admin-field">
                <span className="admin-field__label">교육 축</span>
                <div className="admin-segmented">
                  {(['배우는 힘', '살아가는 힘', '선택하는 힘'] as const).map((axis) => (
                    <button key={axis} type="button" className={`admin-segmented__btn${row.axis === axis ? ' admin-segmented__btn--active' : ''}`} onClick={() => setDoc({ ...doc, evals: doc.evals.map((item, itemIndex) => itemIndex === index ? { ...item, axis } : item) })}>{axis}</button>
                  ))}
                </div>
              </div>
              <div className="admin-field">
                <span className="admin-field__label">표시 방식</span>
                <div className="admin-segmented">
                  {(['사전 · 사후', '단일 수치(%)', '향상률(%p)'] as const).map((mode) => (
                    <button key={mode} type="button" className={`admin-segmented__btn${row.mode === mode ? ' admin-segmented__btn--active' : ''}`} onClick={() => setDoc({ ...doc, evals: doc.evals.map((item, itemIndex) => itemIndex === index ? { ...item, mode } : item) })}>{mode}</button>
                  ))}
                </div>
              </div>
              <label className="admin-field"><span className="admin-field__label">값 · 단위</span><input className="admin-input" value={row.value} onChange={(e) => setDoc({ ...doc, evals: doc.evals.map((item, itemIndex) => itemIndex === index ? { ...item, value: e.target.value } : item) })} /></label>
            </div>
            <div className="impact-pair">
              <label className="admin-field"><span className="admin-field__label">항목 이름 (화면 표시)</span><input className="admin-input" value={row.itemName} onChange={(e) => setDoc({ ...doc, evals: doc.evals.map((item, itemIndex) => itemIndex === index ? { ...item, itemName: e.target.value } : item) })} /></label>
              <label className="admin-field"><span className="admin-field__label">대상 · 시점 · 응답률 · 도구</span><input className="admin-input" value={row.meta} onChange={(e) => setDoc({ ...doc, evals: doc.evals.map((item, itemIndex) => itemIndex === index ? { ...item, meta: e.target.value } : item) })} /></label>
            </div>
          </div>
        ))}
      </section>

      <section id="impact-stories" className="admin-panel">
        <div className="admin-panel__head">
          <h2 className="admin-panel__title">⑤ 스토리 관리 (게시판)</h2>
          <button type="button" className="admin-btn" onClick={() => setDoc({ ...doc, stories: [...(doc.stories ?? []), { id: newId('s'), category: '변화의 이야기', title: '', project: '', featured: true, consent: false, body: '', before: '', intervention: '', after: '', evidence: '', sustainability: '', expertName: '', expertOrg: '', expertField: '', expertLine: '', expertPhoto: '' }] })}>+ 글쓰기</button>
        </div>
        {(doc.stories ?? []).map((row, index) => {
          const setStory = (partial: Partial<typeof row>) => setDoc({ ...doc, stories: doc.stories.map((item, itemIndex) => (itemIndex === index ? { ...item, ...partial } : item)) })
          return (
            <div key={row.id} className="impact-block">
              <div className="impact-quad">
                <div className="admin-field">
                  <span className="admin-field__label">카테고리</span>
                  <div className="admin-segmented">
                    {(['변화의 이야기', '전문가 이야기'] as const).map((category) => (
                      <button key={category} type="button" className={`admin-segmented__btn${row.category === category ? ' admin-segmented__btn--active' : ''}`} onClick={() => setStory({ category })}>{category}</button>
                    ))}
                  </div>
                </div>
                <label className="admin-field"><span className="admin-field__label">제목</span><input className="admin-input" value={row.title} onChange={(e) => setStory({ title: e.target.value })} /></label>
                <label className="admin-field"><span className="admin-field__label">연결 사업</span><input className="admin-input" value={row.project} onChange={(e) => setStory({ project: e.target.value })} /></label>
                <div className="admin-field">
                  <span className="admin-field__label">대표 글로 지정</span>
                  <div className="admin-segmented">
                    <button type="button" className={`admin-segmented__btn${row.featured ? ' admin-segmented__btn--active' : ''}`} onClick={() => setStory({ featured: true })}>지정</button>
                    <button type="button" className={`admin-segmented__btn${!row.featured ? ' admin-segmented__btn--active' : ''}`} onClick={() => setStory({ featured: false })}>지정 안 함</button>
                  </div>
                </div>
              </div>
              {row.category === '변화의 이야기' ? (
                <div className="impact-five">
                  {([
                    ['before', 'Before'],
                    ['intervention', 'Intervention'],
                    ['after', 'After'],
                    ['evidence', 'Evidence'],
                    ['sustainability', 'Sustainability'],
                  ] as const).map(([key, label]) => (
                    <label key={key} className="admin-field">
                      <span className="admin-field__label">{label}</span>
                      <input className="admin-input" aria-label={`변화의 이야기 ${label}`} value={row[key] ?? ''} onChange={(e) => setStory({ [key]: e.target.value })} />
                    </label>
                  ))}
                </div>
              ) : (
                <div className="impact-pair">
                  <label className="admin-field"><span className="admin-field__label">이름</span><input className="admin-input" value={row.expertName ?? ''} onChange={(e) => setStory({ expertName: e.target.value })} /></label>
                  <label className="admin-field"><span className="admin-field__label">소속</span><input className="admin-input" value={row.expertOrg ?? ''} onChange={(e) => setStory({ expertOrg: e.target.value })} /></label>
                  <label className="admin-field"><span className="admin-field__label">전문 분야</span><input className="admin-input" value={row.expertField ?? ''} onChange={(e) => setStory({ expertField: e.target.value })} /></label>
                  <label className="admin-field"><span className="admin-field__label">평가 한두 문장</span><input className="admin-input" value={row.expertLine ?? ''} onChange={(e) => setStory({ expertLine: e.target.value })} /></label>
                  <label className="admin-field admin-field--full"><span className="admin-field__label">본문</span><textarea className="admin-input" rows={3} value={row.body} onChange={(e) => setStory({ body: e.target.value })} /></label>
                  <div className="admin-field admin-field--full">
                    <AdminMediaUpload label="전문가 사진 (선택)" variant="image" value={row.expertPhoto || null} onChange={(url) => setStory({ expertPhoto: url ?? '' })} />
                  </div>
                </div>
              )}
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 14, fontSize: 14, fontWeight: 700, minHeight: 44 }}>
                <input type="checkbox" checked={row.consent} onChange={(e) => setStory({ consent: e.target.checked })} />
                사진·인터뷰 게재 동의 확인 (체크해야 공개 가능)
              </label>
            </div>
          )
        })}
      </section>
    </div>
  )
}
