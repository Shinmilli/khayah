import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AdminMediaUpload } from '../components/AdminMediaUpload'
import { AdminLocaleEmptyNote, AdminLocaleTabs, type AdminEditLocale } from '../components/AdminLocaleTabs'
import { AdminSaveActions, draftStatus, takeUnpublished } from '../AdminSaveActions'
import { adminFetchBizSupport, adminFetchBusinessHubCards, adminPutBizSupport, adminPutBusinessHubCards, type SaveMode } from '../../../services/api'
import type { BusinessHubCardsDocument } from '../../business/businessHubCardsTypes'
import { AxisCards, BottomCards, CtaFields, HubCards, PrincipleCards, ProgramCards, StepList, VolunteerPhotos } from '../biz/IntroCards'
import { resetBizSupportCache } from '../../biz/useBizSupport'
import type { BizSupportDocument } from '../../biz/bizSupportTypes'
import { BizHead, bizTitle, mergePanels, movePanels, removePanel, sortPanels, togglePanel } from '../biz/BizChrome'
import { SectionBlocks } from '../biz/SectionBlocks'
import { rankedSupportSections } from '../../biz/supportSections'
import { AcademyBody, AcademyModeSwitch } from '../biz/AcademyPanels'
import { ComfortBody, ComfortModeSwitch } from '../biz/ComfortPanels'
import { SupportComposer, SupportSettings } from '../biz/SupportComposer'

type TabId = 'common' | 'intro' | 'social' | 'academy' | 'cnc' | 'guide' | 'method' | 'settings'

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'common', label: '사업 공통' },
  { id: 'intro', label: '사업 소개' },
  { id: 'social', label: '소셜비즈니스' },
  { id: 'academy', label: '카야 아카데미' },
  { id: 'cnc', label: '컬러앤컴포트' },
  { id: 'guide', label: '후원 안내' },
  { id: 'method', label: '후원 방법' },
  { id: 'settings', label: '후원 공통' },
]

const COMMON_MENU_KEYS = ['domestic', 'overseas', 'advocacy', 'researchSocial']
const CHILD_MENU_KEYS = ['domesticEducation', 'domesticProjects', 'overseasEducation', 'overseasVolunteer', 'overseasProjects', 'researchProjects', 'socialAcademy', 'socialComfort']

const MENU_LABEL: Record<string, string> = {
  domestic: '국내사업',
  domesticEducation: '국내 · 교육',
  domesticProjects: '국내 진행사업',
  overseas: '해외사업',
  overseasEducation: '해외 · 교육',
  overseasVolunteer: '해외봉사단',
  overseasProjects: '해외 진행사업',
  advocacy: '연구사업',
  researchProjects: '연구사업 진행사업',
  researchSocial: '소셜비즈니스',
  socialAcademy: '카야 아카데미',
  socialComfort: '컬러앤컴포트',
}

type Field = { key: string; label: string; html?: boolean; image?: boolean; rows?: number; em?: string }

function plainFromHtml(html: string): string {
  return html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')
}

function emphasisFromHtml(html: string): string {
  return html.match(/<span[^>]*>([^<]*)<\/span>/)?.[1] ?? ''
}

function htmlFromPlain(plain: string, word: string, className: string): string {
  return plain
    .split('\n')
    .map((line) => (word && line.includes(word) ? line.replace(word, `<span class="${className}">${word}</span>`) : line))
    .join('<br />')
}

function widePhoto(key: string): boolean {
  return /^(dom|ovs|res)\.photo$/.test(key) || key.endsWith('heroPhoto') || key === 'guide.photo' || key === 'soc.aca.photo' || key === 'soc.cnc.photo'
}

function isCardPair(left: Field, right: Field | undefined): boolean {
  if (!right || left.image || right.image) return false
  if (left.key.endsWith('Label') && right.key === left.key.slice(0, -'Label'.length)) return true
  return left.key.endsWith('.title') && right.key === `${left.key.slice(0, -'.title'.length)}.body`
}

function FieldStack({
  rows,
  values,
  setField,
  titleLimit,
  lineLimit,
}: {
  rows: Field[]
  values: Record<string, string>
  setField: (key: string, value: string) => void
  titleLimit: string
  lineLimit: string
}) {
  const nodes: ReactNode[] = []
  let loose: Field[] = []
  const flush = () => {
    if (!loose.length) return
    const chunk = loose
    loose = []
    nodes.push(
      <div key={chunk[0].key} className="admin-form-grid">
        {chunk.map((field) => fieldNode(field, values, setField, titleLimit, lineLimit))}
      </div>,
    )
  }
  for (let index = 0; index < rows.length; index += 1) {
    const field = rows[index]
    const next = rows[index + 1]
    if (isCardPair(field, next) && next) {
      flush()
      nodes.push(
        <div key={field.key} className="admin-item">
          <span className="biz-grip" aria-hidden="true">⋮⋮</span>
          <div className="admin-form-grid">
            {fieldNode(field, values, setField, titleLimit, lineLimit)}
            {fieldNode(next, values, setField, titleLimit, lineLimit)}
          </div>
          <button
            type="button"
            className="biz-x"
            aria-label="삭제"
            onClick={() => {
              setField(field.key, '')
              setField(next.key, '')
            }}
          >
            ×
          </button>
        </div>,
      )
      index += 1
    } else {
      loose.push(field)
    }
  }
  flush()
  return <div className="biz-bars">{nodes}</div>
}

function fieldNode(
  field: Field,
  values: Record<string, string>,
  setField: (key: string, value: string) => void,
  titleLimit: string,
  lineLimit: string,
) {
  const value = values[field.key] ?? ''
  if (field.image) {
    return (
      <AdminMediaUpload
        key={field.key}
        layout="slot"
        slotTitle={field.label}
        slotRatio={widePhoto(field.key) ? '1920×640' : 'logo'}
        label={field.label}
        variant="image"
        value={value || null}
        onChange={(url) => setField(field.key, url ?? '')}
      />
    )
  }
  if (field.em) {
    return (
      <div key={field.key} className="admin-form-grid" style={{ gridColumn: '1 / -1' }}>
        <label className="admin-field admin-field--full">
          <span className="admin-field__label">{field.label}</span>
          <textarea className="admin-input" rows={2} value={plainFromHtml(value)} onChange={(e) => setField(field.key, htmlFromPlain(e.target.value, emphasisFromHtml(value), field.em!))} />
        </label>
        <label className="admin-field">
          <span className="admin-field__label">강조 단어</span>
          <input className="admin-input" value={emphasisFromHtml(value)} onChange={(e) => setField(field.key, htmlFromPlain(plainFromHtml(value), e.target.value, field.em!))} />
        </label>
      </div>
    )
  }
  return (
    <label key={field.key} className={`admin-field${field.rows || field.html ? ' admin-field--full' : ''}`}>
      <span className="admin-field__label">{field.label}</span>
      {field.rows || field.html ? (
        <textarea className="admin-input" rows={field.rows ?? 2} value={value} onChange={(e) => setField(field.key, e.target.value)} />
      ) : (
        <input className="admin-input" value={value} onChange={(e) => setField(field.key, e.target.value)} />
      )}
      {field.label === '설명' && limitWarning('lines', value, titleLimit, lineLimit) ? <span className="admin-field__warn">{limitWarning('lines', value, titleLimit, lineLimit)}</span> : null}
      {field.em ? null : field.label.includes('제목') && limitWarning('title', value, titleLimit, lineLimit) ? <span className="admin-field__warn">{limitWarning('title', value, titleLimit, lineLimit)}</span> : null}
    </label>
  )
}

const INTRO_PAGES: Array<{ id: string; label: string; fields: Field[] }> = [
  {
    id: 'dom',
    label: '국내사업 소개',
    fields: [
      { key: 'dom.photo', label: '상단 사진', image: true },
      { key: 'dom.photoAlt', label: '상단 사진 대체 텍스트' },
      { key: 'dom.title', label: '제목', html: true, em: 'biz-kp__em' },
      { key: 'dom.lead', label: '설명', rows: 3 },
      { key: 'dom.p.0.title', label: '원칙 1' },
      { key: 'dom.p.0.body', label: '원칙 1 본문', rows: 3 },
      { key: 'dom.p.1.title', label: '원칙 2' },
      { key: 'dom.p.1.body', label: '원칙 2 본문', rows: 3 },
      { key: 'dom.p.2.title', label: '원칙 3' },
      { key: 'dom.p.2.body', label: '원칙 3 본문', rows: 3 },
      { key: 'dom.p.3.title', label: '원칙 4' },
      { key: 'dom.p.3.body', label: '원칙 4 본문', rows: 3 },
    ],
  },
  {
    id: 'dedu',
    label: '국내 교육',
    fields: [
      { key: 'dedu.title', label: '제목', html: true, em: 'wn' },
      { key: 'dedu.desc', label: '설명', rows: 3 },
      { key: 'dedu.cta', label: '버튼 문구' },
      { key: 'dedu.0.title', label: '프로그램 1 제목' },
      { key: 'dedu.0.sub', label: '프로그램 1 태그' },
      { key: 'dedu.0.body', label: '프로그램 1 설명', rows: 3 },
      { key: 'dedu.0.photo', label: '프로그램 1 사진', image: true },
      { key: 'dedu.0.caption', label: '프로그램 1 사진 설명' },
      { key: 'dedu.1.label', label: '프로그램 2 영문 라벨' },
      { key: 'dedu.1.title', label: '프로그램 2 제목' },
      { key: 'dedu.1.sub', label: '프로그램 2 태그' },
      { key: 'dedu.1.body', label: '프로그램 2 설명', rows: 3 },
      { key: 'dedu.1.photo', label: '프로그램 2 사진', image: true },
      { key: 'dedu.1.caption', label: '프로그램 2 사진 설명' },
      { key: 'dedu.2.label', label: '프로그램 3 영문 라벨' },
      { key: 'dedu.2.title', label: '프로그램 3 제목' },
      { key: 'dedu.2.sub', label: '프로그램 3 태그' },
      { key: 'dedu.2.body', label: '프로그램 3 설명', rows: 3 },
      { key: 'dedu.2.photo', label: '프로그램 3 사진', image: true },
      { key: 'dedu.2.caption', label: '프로그램 3 사진 설명' },
    ],
  },
  {
    id: 'ovs',
    label: '해외사업 소개',
    fields: [
      { key: 'ovs.photo', label: '상단 사진', image: true },
      { key: 'ovs.title', label: '제목', html: true, em: 'biz-kp__em' },
      { key: 'ovs.lead', label: '설명', rows: 2 },
      { key: 'ovs.p.0.title', label: '원칙 1' },
      { key: 'ovs.p.0.body', label: '원칙 1 본문', html: true, rows: 3 },
      { key: 'ovs.p.1.title', label: '원칙 2' },
      { key: 'ovs.p.1.body', label: '원칙 2 본문', html: true, rows: 3 },
      { key: 'ovs.p.2.title', label: '원칙 3' },
      { key: 'ovs.p.2.body', label: '원칙 3 본문', html: true, rows: 3 },
      { key: 'ovs.p.3.title', label: '원칙 4' },
      { key: 'ovs.p.3.body', label: '원칙 4 본문', html: true, rows: 3 },
    ],
  },
  {
    id: 'oedu',
    label: '해외 교육',
    fields: [
      { key: 'oedu.title', label: '소개 제목', html: true },
      { key: 'oedu.desc', label: '소개 문장', rows: 3 },
      { key: 'oedu.cta', label: '진행사업 확인하기' },
      { key: 'oedu.ctaNote', label: '버튼 위 안내' },
      { key: 'oedu.ctaHref', label: '연결 페이지' },
      { key: 'oedu.0.title', label: '교육 축 1' },
      { key: 'oedu.0.body', label: '교육 축 1 본문', rows: 3 },
      { key: 'oedu.0.photo.0', label: '축 1 사진 1', image: true },
      { key: 'oedu.0.cap.0', label: '축 1 사진 1 설명' },
      { key: 'oedu.0.photo.1', label: '축 1 사진 2', image: true },
      { key: 'oedu.0.cap.1', label: '축 1 사진 2 설명' },
      { key: 'oedu.0.photo.2', label: '축 1 사진 3', image: true },
      { key: 'oedu.0.cap.2', label: '축 1 사진 3 설명' },
      { key: 'oedu.1.title', label: '교육 축 2' },
      { key: 'oedu.1.body', label: '교육 축 2 본문', rows: 3 },
      { key: 'oedu.1.card.1.title', label: '교육 축 2 카드 제목' },
      { key: 'oedu.1.photo.0', label: '축 2 사진 1', image: true },
      { key: 'oedu.1.cap.0', label: '축 2 사진 1 설명' },
      { key: 'oedu.1.photo.1', label: '축 2 사진 2', image: true },
      { key: 'oedu.1.cap.1', label: '축 2 사진 2 설명' },
      { key: 'oedu.1.photo.2', label: '축 2 사진 3', image: true },
      { key: 'oedu.1.cap.2', label: '축 2 사진 3 설명' },
      { key: 'oedu.2.title', label: '교육 축 3' },
      { key: 'oedu.2.body', label: '교육 축 3 본문', rows: 3 },
      { key: 'oedu.2.photo.0', label: '축 3 사진 1', image: true },
      { key: 'oedu.2.cap.0', label: '축 3 사진 1 설명' },
      { key: 'oedu.2.photo.1', label: '축 3 사진 2', image: true },
      { key: 'oedu.2.cap.1', label: '축 3 사진 2 설명' },
      { key: 'oedu.2.photo.2', label: '축 3 사진 3', image: true },
      { key: 'oedu.2.cap.2', label: '축 3 사진 3 설명' },
    ],
  },
  {
    id: 'vol',
    label: '해외봉사단',
    fields: [
      { key: 'vol.title', label: '제목', html: true, em: 'wn' },
      { key: 'vol.desc', label: '소개 문장', rows: 4 },
      { key: 'vol.cta', label: '진행사업 확인하기' },
      { key: 'vol.ctaNote', label: '버튼 위 안내' },
      { key: 'vol.ctaHref', label: '연결 페이지' },
      { key: 'vol.step.0', label: '단계 1' },
      { key: 'vol.step.1', label: '단계 2' },
      { key: 'vol.step.2', label: '단계 3' },
      { key: 'vol.step.3', label: '단계 4' },
      { key: 'vol.step.4', label: '단계 5' },
      { key: 'vol.step.5', label: '단계 6' },
      { key: 'vol.step.6', label: '단계 7' },
      { key: 'vol.step.7', label: '단계 8' },
      { key: 'vol.step.8', label: '단계 9' },
      { key: 'vol.step.9', label: '단계 10' },
      { key: 'vol.block.0.title', label: '단계 목록 1' },
      { key: 'vol.block.0.lead', label: '단계 목록 1 설명', rows: 3 },
      { key: 'vol.panel.0.title', label: '목록 1' },
      { key: 'vol.panel.1.title', label: '목록 2' },
      { key: 'vol.block.1.title', label: '단계 목록 2' },
      { key: 'vol.block.1.lead', label: '단계 목록 2 설명', rows: 3 },
      { key: 'vol.photo.0', label: '하단 사진 1', image: true },
      { key: 'vol.photo.1', label: '하단 사진 2', image: true },
      { key: 'vol.photo.2', label: '하단 사진 3', image: true },
    ],
  },
  {
    id: 'res',
    label: '연구사업 소개',
    fields: [
      { key: 'res.photo', label: '상단 사진', image: true },
      { key: 'res.title', label: '소개 제목', rows: 2 },
      { key: 'res.lead', label: '소개 문장', rows: 3 },
      { key: 'res.cta', label: '진행사업 확인하기' },
      { key: 'res.ctaNote', label: '버튼 위 안내' },
      { key: 'res.ctaHref', label: '연결 페이지' },
      { key: 'res.p.0.title', label: '원칙 1' },
      { key: 'res.p.0.body', label: '원칙 1 본문', html: true, rows: 3 },
      { key: 'res.p.1.title', label: '원칙 2' },
      { key: 'res.p.1.body', label: '원칙 2 본문', html: true, rows: 3 },
      { key: 'res.p.2.title', label: '원칙 3' },
      { key: 'res.p.2.body', label: '원칙 3 본문', html: true, rows: 3 },
      { key: 'res.p.3.title', label: '원칙 4' },
      { key: 'res.p.3.body', label: '원칙 4 본문', html: true, rows: 3 },
      { key: 'res.card.0.title', label: '하단 카드 1' },
      { key: 'res.card.0.desc', label: '하단 카드 1 본문', rows: 2 },
      { key: 'res.card.0.href', label: '하단 카드 1 링크' },
      { key: 'res.card.1.title', label: '하단 카드 2' },
      { key: 'res.card.1.desc', label: '하단 카드 2 본문', rows: 2 },
      { key: 'res.card.1.href', label: '하단 카드 2 링크' },
      { key: 'res.card.2.title', label: '하단 카드 3' },
      { key: 'res.card.2.desc', label: '하단 카드 3 본문', rows: 2 },
      { key: 'res.card.2.href', label: '하단 카드 3 링크' },
    ],
  },
]

const PAGE_FIELDS: Record<Exclude<TabId, 'common' | 'intro' | 'settings'>, Field[]> = {
  social: [
    { key: 'soc.heroLabel', label: '상단 영문 라벨' },
    { key: 'soc.kicker', label: '소개 소제목' },
    { key: 'soc.title', label: '제목', html: true, em: 'wn' },
    { key: 'soc.lead', label: '소개 문장', html: true, rows: 2 },
    { key: 'soc.aca.logo', label: '카야 아카데미 로고', image: true },
    { key: 'soc.aca.photo', label: '카야 아카데미 사진', image: true },
    { key: 'soc.aca.name', label: '카야 아카데미 이름' },
    { key: 'soc.aca.lead', label: '카야 아카데미 문장', rows: 2 },
    { key: 'soc.aca.since', label: '카야 아카데미 영문명 · 연도' },
    { key: 'soc.aca.kindLabel', label: '카야 아카데미 항목 1' },
    { key: 'soc.aca.kind', label: '카야 아카데미 내용 1' },
    { key: 'soc.aca.regionLabel', label: '카야 아카데미 항목 2' },
    { key: 'soc.aca.region', label: '카야 아카데미 내용 2' },
    { key: 'soc.aca.workLabel', label: '카야 아카데미 항목 3' },
    { key: 'soc.aca.work', label: '카야 아카데미 내용 3', rows: 2 },
    { key: 'soc.aca.more', label: '카야 아카데미 버튼' },
    { key: 'soc.aca.href', label: '카야 아카데미 링크' },
    { key: 'soc.cnc.logo', label: '컬러앤컴포트 로고', image: true },
    { key: 'soc.cnc.name', label: '컬러앤컴포트 이름' },
    { key: 'soc.cnc.lead', label: '컬러앤컴포트 문장', rows: 2 },
    { key: 'soc.cnc.since', label: '컬러앤컴포트 영문명 · 연도' },
    { key: 'soc.cnc.kindLabel', label: '컬러앤컴포트 항목 1' },
    { key: 'soc.cnc.kind', label: '컬러앤컴포트 내용 1' },
    { key: 'soc.cnc.regionLabel', label: '컬러앤컴포트 항목 2' },
    { key: 'soc.cnc.region', label: '컬러앤컴포트 내용 2' },
    { key: 'soc.cnc.workLabel', label: '컬러앤컴포트 항목 3' },
    { key: 'soc.cnc.work', label: '컬러앤컴포트 내용 3', rows: 2 },
    { key: 'soc.cnc.more', label: '컬러앤컴포트 버튼' },
    { key: 'soc.cnc.href', label: '컬러앤컴포트 링크' },
    { key: 'soc.cnc.photo', label: '컬러앤컴포트 사진', image: true },
  ],
  academy: [
    { key: 'aca.heroLabel', label: '상단 영문 라벨' },
    { key: 'aca.kicker', label: '소개 소제목' },
    { key: 'aca.title', label: '제목', html: true, em: 'wn' },
    { key: 'aca.lead', label: '소개 문장', html: true, rows: 2 },
    { key: 'aca.logo', label: '로고', image: true },
    { key: 'aca.heroPhoto', label: '상단 사진', image: true },
    { key: 'aca.pre.lead', label: 'Pre-School 문장', rows: 2 },
    { key: 'aca.pre.nameLabel', label: '항목 1' },
    { key: 'aca.pre.name', label: '내용 1' },
    { key: 'aca.pre.placeLabel', label: '항목 2' },
    { key: 'aca.pre.place', label: '내용 2' },
    { key: 'aca.pre.targetLabel', label: '항목 3' },
    { key: 'aca.pre.target', label: '내용 3' },
    { key: 'aca.pre.studyLabel', label: '항목 4' },
    { key: 'aca.pre.study', label: '내용 4' },
    { key: 'aca.pre.photo.0', label: '사진 1', image: true },
    { key: 'aca.pre.cap.0', label: '사진 1 설명' },
    { key: 'aca.pre.photo.1', label: '사진 2', image: true },
    { key: 'aca.pre.cap.1', label: '사진 2 설명' },
    { key: 'aca.pre.photo.2', label: '사진 3', image: true },
    { key: 'aca.pre.cap.2', label: '사진 3 설명' },
    { key: 'aca.pre.photo.3', label: '사진 4', image: true },
    { key: 'aca.pre.cap.3', label: '사진 4 설명' },
    { key: 'aca.book.lead', label: '학습지 문장', html: true, rows: 2 },
    { key: 'aca.book.subjectLabel', label: '항목 1' },
    { key: 'aca.book.subject', label: '내용 1' },
    { key: 'aca.book.targetLabel', label: '항목 2' },
    { key: 'aca.book.target', label: '내용 2' },
    { key: 'aca.book.methodLabel', label: '항목 3' },
    { key: 'aca.book.method', label: '내용 3' },
    { key: 'aca.book.photo.0', label: '사진 1', image: true },
    { key: 'aca.book.cap.0', label: '사진 1 설명' },
    { key: 'aca.book.photo.1', label: '사진 2', image: true },
    { key: 'aca.book.cap.1', label: '사진 2 설명' },
    { key: 'aca.csr', label: 'CSR', rows: 2 },
    { key: 'aca.facebook', label: '페이스북 링크' },
    { key: 'aca.instagram', label: '인스타그램 링크' },
  ],
  cnc: [
    { key: 'cnc.heroLabel', label: '상단 영문 라벨' },
    { key: 'cnc.kicker', label: '소개 소제목' },
    { key: 'cnc.title', label: '제목', html: true, em: 'wn' },
    { key: 'cnc.lead', label: '소개 문장', html: true, rows: 2 },
    { key: 'cnc.logo', label: '로고', image: true },
    { key: 'cnc.heroPhoto', label: '상단 사진', image: true },
    { key: 'cnc.note', label: '브랜드 하단 문구' },
    { key: 'cnc.story.0.title', label: '이야기 1 키워드' },
    { key: 'cnc.story.0.body', label: '이야기 1 설명' },
    { key: 'cnc.story.1.title', label: '이야기 2 키워드' },
    { key: 'cnc.story.1.body', label: '이야기 2 설명' },
    { key: 'cnc.story.2.title', label: '이야기 3 키워드' },
    { key: 'cnc.story.2.body', label: '이야기 3 설명' },
    { key: 'cnc.product.0', label: '제품 1' },
    { key: 'cnc.product.0.photo', label: '제품 1 사진', image: true },
    { key: 'cnc.product.1', label: '제품 2' },
    { key: 'cnc.product.1.photo', label: '제품 2 사진', image: true },
    { key: 'cnc.product.2', label: '제품 3' },
    { key: 'cnc.product.2.photo', label: '제품 3 사진', image: true },
    { key: 'cnc.step.0.title', label: '구매 1 제목' },
    { key: 'cnc.step.0.body', label: '구매 1 설명' },
    { key: 'cnc.step.1.title', label: '구매 2 제목' },
    { key: 'cnc.step.1.body', label: '구매 2 설명' },
    { key: 'cnc.step.2.title', label: '구매 3 제목' },
    { key: 'cnc.step.2.body', label: '구매 3 설명' },
    { key: 'cnc.storeLabel', label: '스토어 버튼' },
    { key: 'cnc.store', label: '스토어 링크' },
    { key: 'cnc.kakaoLabel', label: '카카오톡 버튼' },
    { key: 'cnc.kakao', label: '카카오톡 링크' },
    { key: 'cnc.instagram', label: '인스타그램 링크' },
  ],
  guide: [
    { key: 'guide.title', label: '첫 화면 제목', html: true, rows: 2 },
    { key: 'guide.lead', label: '첫 화면 문장', html: true, rows: 2 },
    { key: 'guide.photo', label: '첫 화면 사진', image: true },
    { key: 'guide.photoAlt', label: '사진 대체 텍스트' },
    { key: 'guide.heroBtn2', label: '보조 버튼 문구' },
    { key: 'guide.whereTitle', label: '후원이 닿는 곳' },
    { key: 'guide.whereLead', label: '후원이 닿는 곳 문장', rows: 2 },
    { key: 'guide.placePhoto', label: '대표 카드 사진', image: true },
    { key: 'guide.placeAlt', label: '대표 카드 사진 대체 텍스트' },
    { key: 'guide.placeTag', label: '대표 카드 태그' },
    { key: 'guide.placeTitle', label: '대표 카드 제목' },
    { key: 'guide.placeBody', label: '대표 카드 본문', rows: 3 },
    { key: 'guide.item.0.title', label: '카드 1' },
    { key: 'guide.item.0.body', label: '카드 1 본문', rows: 2 },
    { key: 'guide.item.1.title', label: '카드 2' },
    { key: 'guide.item.1.body', label: '카드 2 본문', rows: 2 },
    { key: 'guide.item.2.title', label: '카드 3' },
    { key: 'guide.item.2.body', label: '카드 3 본문', rows: 2 },
    { key: 'guide.openTitle', label: '투명 운영 제목' },
    { key: 'guide.open.0.title', label: '투명 카드 1' },
    { key: 'guide.open.0.body', label: '투명 카드 1 본문', rows: 2 },
    { key: 'guide.open.1.title', label: '투명 카드 2' },
    { key: 'guide.open.1.body', label: '투명 카드 2 본문', rows: 2 },
    { key: 'guide.open.2.title', label: '투명 카드 3' },
    { key: 'guide.open.2.body', label: '투명 카드 3 본문', rows: 2 },
    { key: 'guide.giveTitle', label: '후원 종류 제목' },
    { key: 'guide.give.0.title', label: '후원 종류 1' },
    { key: 'guide.give.0.body', label: '후원 종류 1 본문', rows: 2 },
    { key: 'guide.give.0.meta', label: '후원 종류 1 결제' },
    { key: 'guide.give.1.title', label: '후원 종류 2' },
    { key: 'guide.give.1.body', label: '후원 종류 2 본문', rows: 2 },
    { key: 'guide.give.1.meta', label: '후원 종류 2 결제' },
    { key: 'guide.give.2.title', label: '후원 종류 3' },
    { key: 'guide.give.2.body', label: '후원 종류 3 본문', rows: 2 },
    { key: 'guide.give.2.meta', label: '후원 종류 3 결제' },
    { key: 'guide.giveCtaTitle', label: '후원 CTA 제목' },
    { key: 'guide.giveSafe', label: '후원 안전 안내', rows: 2 },
    { key: 'guide.contactTitle', label: '후원 문의 제목' },
    { key: 'guide.contactLead', label: '후원 문의 문장', rows: 2 },
  ],
  method: [
    { key: 'method.title', label: '제목' },
    { key: 'method.lead', label: '소개 문장', rows: 2 },
    { key: 'method.happyTitle', label: '해피나눔 안내', html: true, rows: 2 },
    { key: 'method.happyP1', label: '해피나눔 본문 1', rows: 3 },
    { key: 'method.happyP2', label: '해피나눔 본문 2', rows: 2 },
    { key: 'method.happy.0.title', label: '해피 특징 1' },
    { key: 'method.happy.0.body', label: '해피 특징 1 본문', rows: 2 },
    { key: 'method.happy.1.title', label: '해피 특징 2' },
    { key: 'method.happy.1.body', label: '해피 특징 2 본문', rows: 2 },
    { key: 'method.happy.2.title', label: '해피 특징 3' },
    { key: 'method.happy.2.body', label: '해피 특징 3 본문', rows: 2 },
    { key: 'method.stepsTitle', label: '신청 절차 제목' },
    { key: 'method.stepsLead', label: '신청 절차 소개', rows: 2 },
    { key: 'method.step.0.title', label: '절차 1' },
    { key: 'method.step.0.photo', label: '절차 1 캡처', image: true },
    { key: 'method.step.1.title', label: '절차 2' },
    { key: 'method.step.1.photo', label: '절차 2 캡처', image: true },
    { key: 'method.step.2.title', label: '절차 3' },
    { key: 'method.step.2.photo', label: '절차 3 캡처', image: true },
    { key: 'method.payTitle', label: '납부 방법 제목' },
    { key: 'method.pay.0.title', label: '납부 1' },
    { key: 'method.pay.0.badge', label: '납부 1 배지' },
    { key: 'method.pay.0.lines', label: '납부 1 설명', rows: 3 },
    { key: 'method.pay.1.title', label: '납부 2' },
    { key: 'method.pay.1.badge', label: '납부 2 배지' },
    { key: 'method.pay.1.lines', label: '납부 2 설명', rows: 3 },
    { key: 'method.pay.2.title', label: '납부 3' },
    { key: 'method.pay.2.badge', label: '납부 3 배지' },
    { key: 'method.pay.2.lines', label: '납부 3 설명', rows: 3 },
    { key: 'method.payOtherTitle', label: '기타 후원 제목' },
    { key: 'method.payOtherBody', label: '기타 후원 본문', rows: 2 },
    { key: 'method.receiptTitle', label: '영수증 안내' },
    { key: 'method.receipt.0.title', label: '혜택 1' },
    { key: 'method.receipt.0.body', label: '혜택 1 본문', rows: 2 },
    { key: 'method.receipt.1.title', label: '혜택 2' },
    { key: 'method.receipt.1.body', label: '혜택 2 본문', rows: 2 },
    { key: 'method.receipt.2.title', label: '혜택 3' },
    { key: 'method.receipt.2.body', label: '혜택 3 본문', rows: 2 },
    { key: 'method.contactTitle', label: '변경 안내' },
    { key: 'method.contactBody', label: '변경 안내 본문', rows: 3 },
    { key: 'method.recommendTitle', label: '후원 추천 제목' },
    { key: 'method.recommendBody', label: '후원 추천 본문', rows: 2 },
    { key: 'method.ctaTitle', label: '하단 버튼 제목' },
    { key: 'method.ctaLead', label: '하단 버튼 문장', rows: 2 },
  ],
}

function fieldGroups(id: string, fields: Field[]): Array<{ title: string; rows: Field[] }> {
  const rules: Array<[string, (key: string) => boolean]> =
    id === 'dom'
      ? [
          ['① 상단 사진', (key) => key.startsWith('dom.') && key.includes('photo')],
          ['② 소개', (key) => key === 'dom.title' || key === 'dom.lead'],
          ['③ 원칙 목록', (key) => key.startsWith('dom.p.')],
        ]
      : id === 'dedu'
        ? [
            ['② 소개', (key) => key === 'dedu.title' || key === 'dedu.desc'],
            ['④ 프로그램 · 교육 축', (key) => key.startsWith('dedu.0.') || key.startsWith('dedu.1.') || key.startsWith('dedu.2.')],
            ['⑦ 진행사업 확인하기', (key) => key.startsWith('dedu.cta')],
          ]
        : id === 'ovs'
          ? [
              ['① 상단 사진', (key) => key.includes('photo')],
              ['② 소개', (key) => key === 'ovs.title' || key === 'ovs.lead'],
              ['③ 원칙 목록', (key) => key.includes('.p.')],
            ]
          : id === 'oedu'
            ? [
                ['② 소개', (key) => key === 'oedu.title' || key === 'oedu.desc'],
                ['④ 프로그램 · 교육 축', (key) => key.startsWith('oedu.0.') || key.startsWith('oedu.1.') || key.startsWith('oedu.2.')],
                ['⑦ 진행사업 확인하기', (key) => key.startsWith('oedu.cta')],
              ]
            : id === 'vol'
              ? [
                  ['② 소개', (key) => key === 'vol.title' || key === 'vol.desc'],
                  ['⑤ 단계 목록', (key) => key.includes('.block.') || key.includes('.panel.') || key.startsWith('vol.step.')],
                  ['⑥ 하단 카드', (key) => key.includes('photo')],
                  ['⑦ 진행사업 확인하기', (key) => key.startsWith('vol.cta')],
                ]
              : id === 'res'
                ? [
                    ['① 상단 사진', (key) => key.includes('photo')],
                    ['② 소개', (key) => key === 'res.title' || key === 'res.lead'],
                    ['③ 원칙 목록', (key) => key.includes('.p.')],
                    ['⑥ 하단 카드', (key) => key.includes('.card.')],
                    ['⑦ 진행사업 확인하기', (key) => key.startsWith('res.cta')],
                  ]
                : id === 'social'
                  ? [
                      ['① 상단', (key) => key === 'soc.heroLabel'],
                      ['② 소개', (key) => key === 'soc.kicker' || key === 'soc.title' || key === 'soc.lead'],
                      ['③ 사업 소개 블록 · 카야 아카데미', (key) => key.startsWith('soc.aca.')],
                      ['④ 사업 소개 블록 · 컬러앤컴포트', () => true],
                    ]
                  : id === 'academy'
                    ? [
                        ['① 상단 사진', (key) => key.startsWith('aca.hero') || key === 'aca.logo'],
                        ['② 소개', (key) => key === 'aca.kicker' || key === 'aca.title' || key === 'aca.lead'],
                        ['③ Pre-School', (key) => key.startsWith('aca.pre.')],
                        ['④ 학습지', (key) => key.startsWith('aca.book.')],
                        ['⑤ CSR', () => true],
                      ]
                      : id === 'cnc'
                      ? [
                          ['① 상단 사진', (key) => key.startsWith('cnc.hero') || key === 'cnc.logo'],
                          ['② 소개', (key) => key === 'cnc.kicker' || key === 'cnc.title' || key === 'cnc.lead'],
                          ['③ 브랜드 이야기', (key) => key === 'cnc.note' || key.startsWith('cnc.story.')],
                          ['④ 제품', (key) => key.startsWith('cnc.product.')],
                          ['⑤ 구매 방법 · 버튼', () => true],
                        ]
                      : id === 'guide'
                        ? [
                            ['① 첫 화면', (key) => ['guide.title', 'guide.lead', 'guide.photo', 'guide.photoAlt'].includes(key)],
                            ['② 후원이 닿는 곳', (key) => key.startsWith('guide.where') || key.startsWith('guide.place') || key.startsWith('guide.item.')],
                            ['③ 후원 종류', () => true],
                          ]
                        : [
                            ['① 소개', (key) => key === 'method.title' || key === 'method.lead'],
                            ['해피나눔', (key) => key.startsWith('method.happy')],
                            ['② 신청 절차', (key) => key.startsWith('method.step.')],
                            ['③ 납부 방법', (key) => key.startsWith('method.pay.')],
                            ['④ 후원 계좌 · 영수증', (key) => key.startsWith('method.receipt')],
                            ['⑤ 변경 안내', () => true],
                          ]
  const used = new Set<string>()
  const groups: Array<{ title: string; rows: Field[] }> = []
  for (const [title, match] of rules) {
    const rows = fields.filter((field) => !used.has(field.key) && match(field.key))
    rows.forEach((field) => used.add(field.key))
    if (rows.length) groups.push({ title, rows })
  }
  return groups
}

function previewHref(tab: TabId, introId: string): string {
  if (tab === 'guide') return '/support/guide'
  if (tab === 'method') return '/support/method'
  if (tab === 'social') return '/business/social'
  if (tab === 'academy') return '/business/social/academy'
  if (tab === 'cnc') return '/business/social/color-and-comfort'
  if (tab !== 'intro') return '/'
  const href: Record<string, string> = {
    dom: '/business/domestic',
    dedu: '/business/domestic/education',
    ovs: '/business/overseas',
    oedu: '/business/overseas/education',
    vol: '/business/overseas/volunteer',
    res: '/business/advocacy',
  }
  return href[introId] ?? '/business/domestic'
}

const BIZ_TABS: TabId[] = ['common', 'intro', 'social', 'academy', 'cnc', 'guide', 'method', 'settings']

function bizTab(raw: string | null): TabId {
  return BIZ_TABS.includes(raw as TabId) ? (raw as TabId) : 'common'
}

function withBizDefaults(doc: BizSupportDocument): BizSupportDocument {
  return {
    ...doc,
    layout: doc.layout ?? [],
    blocks: doc.blocks ?? [],
    otherTitle: doc.otherTitle || 'MORE · 다른 사업 보기',
    titleLimit: doc.titleLimit || '20자',
    lineLimit: doc.lineLimit || '3줄',
    archive: doc.archive ?? [
      { id: 'projects-board', name: '진행사업 게시판', status: '비공개 (원문 보존)', memo: '게시판 → 진행사업 페이지형으로 전환. 기존 글 원문 그대로 보존' },
      { id: 'grants', name: '지원사업 게시판', status: '비공개', memo: '메뉴·링크에서 숨김' },
      { id: 'merged-pages', name: '국내사업 > 교육 / 연구사업 > 교육연구 하위 페이지', status: '삭제', memo: '상위 페이지로 통합' },
    ],
  }
}

function limitWarning(kind: 'title' | 'lines', value: string, titleLimit: string, lineLimit: string) {
  if (kind === 'title') {
    const max = Number.parseInt(titleLimit, 10)
    const count = [...plainFromHtml(value).replace(/\s/g, '')].length
    return Number.isFinite(max) && max > 0 && count > max ? `제목이 ${max}자를 넘습니다. 저장은 됩니다.` : ''
  }
  const max = Number.parseInt(lineLimit, 10)
  const count = value.split('\n').filter((line) => line.trim()).length
  return Number.isFinite(max) && max > 0 && count > max ? `설명이 ${max}줄을 넘습니다. 저장은 됩니다.` : ''
}

export function AdminBizSupportPage() {
  const [params, setParams] = useSearchParams()
  const tab = bizTab(params.get('tab'))
  const [doc, setDoc] = useState<BizSupportDocument | null>(null)
  const pageParam = params.get('page')
  const [introId, setIntroId] = useState(pageParam && INTRO_PAGES.some((page) => page.id === pageParam) ? pageParam : 'dom')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState('')
  const [savedMode, setSavedMode] = useState<SaveMode | ''>('')
  const [unpublished, setUnpublished] = useState(false)
  const [editLocale, setEditLocale] = useState<AdminEditLocale>('ko')
  const [hubDoc, setHubDoc] = useState<BusinessHubCardsDocument | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const support = takeUnpublished(await adminFetchBizSupport())
      setDoc(withBizDefaults(support.doc))
      setUnpublished(support.unpublished)
      try {
        setHubDoc(takeUnpublished(await adminFetchBusinessHubCards()).doc)
      } catch {
        setHubDoc(null)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (pageParam && INTRO_PAGES.some((page) => page.id === pageParam)) setIntroId(pageParam)
  }, [pageParam])

  const setField = (key: string, value: string) => {
    setDoc((prev) => (prev ? { ...prev, fields: { ...prev.fields, [key]: value } } : prev))
  }
  const setFields = (fields: Record<string, string>) => {
    setDoc((prev) => (prev ? { ...prev, fields } : prev))
  }

  const patchMenu = (key: string, patch: { label?: string; labelEn?: string; target?: string; tabs?: string }) => {
    setDoc((prev) => (prev ? { ...prev, menu: prev.menu.map((item) => (item.key === key ? { ...item, ...patch } : item)) } : prev))
  }

  const patchArchive = (id: string, patch: { name?: string; status?: string; memo?: string }) => {
    setDoc((prev) => (prev ? { ...prev, archive: prev.archive.map((item) => (item.id === id ? { ...item, ...patch } : item)) } : prev))
  }

  const onSave = async (mode: SaveMode) => {
    if (!doc) return
    setSaving(true)
    setError('')
    setSavedAt('')
    try {
      const grants = (doc.archive ?? []).find((row) => row.id === 'grants' || row.name.includes('지원사업'))
      const saved = takeUnpublished(await adminPutBizSupport({
        ...doc,
        grantsPublic: grants ? !grants.status.includes('비공개') : doc.grantsPublic,
      }, mode))
      setDoc(withBizDefaults(saved.doc))
      setUnpublished(saved.unpublished)
      setSavedMode(mode)
      if (hubDoc && (tab === 'intro' && (introId === 'dom' || introId === 'ovs'))) {
        setHubDoc(takeUnpublished(await adminPutBusinessHubCards(hubDoc, mode)).doc)
      }
      resetBizSupportCache()
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

  const intro = INTRO_PAGES.find((page) => page.id === introId) ?? INTRO_PAGES[0]
  const fields = tab === 'intro' ? intro.fields : tab === 'common' || tab === 'settings' ? [] : PAGE_FIELDS[tab]
  const sectionPage = tab === 'intro' ? intro.id : tab
  const pageLabel = tab === 'intro' ? '사업 소개 페이지 6장 (공통)' : tab === 'common' ? '사업 공통 설정' : (TABS.find((item) => item.id === tab)?.label ?? '')
  const pageTitle = tab === 'intro' ? '사업 소개 페이지 관리' : tab === 'common' ? '사업 공통 설정 관리' : tab === 'social' ? '소셜비즈니스 소개 관리' : tab === 'academy' ? '카야 아카데미 관리' : tab === 'cnc' ? '컬러앤컴포트 관리' : `${pageLabel} 관리`
  const rawGroups = fields.length ? fieldGroups(sectionPage, fields).map((group) => ({ ...group, id: `${sectionPage}:${group.title}` })) : []
  if (tab === 'intro' && (introId === 'dom' || introId === 'ovs')) rawGroups.push({ id: `${introId}:hub`, title: '⑥ 하단 카드', rows: [] })
  const groupIds = rawGroups.map((group) => group.id)
  const groups = sortPanels(rawGroups, doc.layout).filter((group) => !group.removed)
  const setLayout = (layout: NonNullable<BizSupportDocument['layout']>) => setDoc({ ...doc, layout: mergePanels(doc.layout, layout) })
  const toggleSupport = (id: string) => {
    if (tab !== 'guide' && tab !== 'method') return
    const current = rankedSupportSections(tab, doc.sections).find((row) => row.id === id)
    if (!current) return
    const exists = doc.sections.some((section) => section.id === id)
    setDoc({
      ...doc,
      sections: exists
        ? doc.sections.map((section) => (section.id === id ? { ...section, enabled: !section.enabled } : section))
        : [...doc.sections, { id, page: tab, order: current.order, enabled: false }],
    })
  }
  const reorderSupport = (ids: string[]) => {
    if (tab !== 'guide' && tab !== 'method') return
    setDoc({
      ...doc,
      sections: [
        ...doc.sections.filter((section) => !ids.includes(section.id)),
        ...ids.map((sectionId, order) => {
          const prev = doc.sections.find((section) => section.id === sectionId)
          return { id: sectionId, page: tab, order: order + 1, enabled: prev?.enabled !== false }
        }),
      ],
    })
  }
  const withGroupOrder = (layout: NonNullable<BizSupportDocument['layout']>, sections = doc.sections) => {
    const visible = sortPanels(rawGroups, layout).filter((group) => !group.removed)
    return sections.map((row) => {
      const index = visible.findIndex((group) => group.rows.some((field) => field.key === row.id || field.key.startsWith(`${row.id}.`)))
      return index < 0 ? row : { ...row, order: index }
    })
  }
  const commonIds = ['common:menu', 'common:other', 'common:rules', 'common:archive']
  const commonRanked = sortPanels(
    [
      { id: 'common:menu', title: '사업 메뉴 · 하위 탭' },
      { id: 'common:other', title: "하단 '다른 사업 보기'" },
      { id: 'common:rules', title: '글자·표기 규칙' },
      { id: 'common:archive', title: '삭제된 메뉴 · 비공개 게시판' },
    ],
    doc.layout,
  ).filter((row) => !row.removed)
  const commonOn = (id: string) => commonRanked.find((row) => row.id === id)?.enabled !== false
  const commonOrder = (id: string) => commonRanked.find((row) => row.id === id)?.order ?? 0
  const commonHead = (id: string) => {
    const index = commonRanked.findIndex((row) => row.id === id)
    const row = commonRanked[index]
    if (!row) return null
    return (
      <BizHead
        title={bizTitle(index, row.title)}
        enabled={row.enabled}
        onUp={() => setLayout(movePanels(doc.layout, commonIds, id, -1))}
        onDown={() => setLayout(movePanels(doc.layout, commonIds, id, 1))}
        onToggle={() => setLayout(togglePanel(doc.layout, commonIds, id))}
        trailing={<button type="button" className="biz-del" onClick={() => setLayout(removePanel(doc.layout, commonIds, id))}>섹션 삭제</button>}
      />
    )
  }
  const introBody = (title: string) => {
    if (tab !== 'intro') return null
    const name = title.replace(/^[①-⑳]\s*/, '')
    if (name.startsWith('하단 카드') && hubDoc && (introId === 'dom' || introId === 'ovs')) {
      return (
        <HubCards
          hub={introId === 'dom' ? 'domestic' : 'overseas'}
          cards={hubDoc.cards}
          onChange={(cards) => setHubDoc({ ...hubDoc, cards })}
        />
      )
    }
    if (name.startsWith('원칙') && (introId === 'dom' || introId === 'ovs' || introId === 'res')) {
      const prefix = introId === 'ovs' ? 'ovs.p' : introId === 'res' ? 'res.p' : 'dom.p'
      return <PrincipleCards fields={doc.fields} prefix={prefix} max={4} onFields={setFields} />
    }
    if (name.startsWith('프로그램')) {
      return introId === 'oedu'
        ? <AxisCards fields={doc.fields} onFields={setFields} />
        : <ProgramCards fields={doc.fields} onFields={setFields} />
    }
    if (name.startsWith('단계')) return <StepList fields={doc.fields} onFields={setFields} />
    if (name.startsWith('하단 카드') && introId === 'res') return <BottomCards fields={doc.fields} onFields={setFields} />
    if (name.startsWith('하단') && introId === 'vol') return <VolunteerPhotos fields={doc.fields} onFields={setFields} />
    if (name.startsWith('진행사업')) {
      const prefix = introId === 'oedu' ? 'oedu' : introId === 'vol' ? 'vol' : introId === 'res' ? 'res' : 'dedu'
      return <CtaFields fields={doc.fields} prefix={prefix} onFields={setFields} />
    }
    return null
  }

  return (
    <div className="admin-page biz-mock">
      <div className="admin-page__head">
        <div>
          <p className="admin-page__desc">{tab === 'guide' || tab === 'method' || tab === 'settings' ? '후원' : '사업'} › {pageLabel}</p>
          <h1 className="admin-page__title">{pageTitle}</h1>
        </div>
        <div className="admin-page__actions">
          <AdminLocaleTabs value={editLocale} onChange={setEditLocale} />
          <a
            className="admin-btn"
            href={`${editLocale === 'en' ? '/en' : ''}${previewHref(tab, intro.id)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            미리보기
          </a>
          <AdminSaveActions saving={saving} onSave={(mode) => void onSave(mode)} />
        </div>
      </div>
      {error ? <p className="admin-banner admin-banner--error">{error}</p> : null}
      {draftStatus(unpublished, savedAt, savedMode) ? <p className="admin-panel__foot">{draftStatus(unpublished, savedAt, savedMode)}</p> : null}
      <AdminLocaleEmptyNote locale={editLocale} />
      {tab === 'common' ? (
        <div className="biz-stack">
          {commonRanked.some((row) => row.id === 'common:menu') ? <section className="admin-panel" style={{ order: commonOrder('common:menu') }}>
            {commonHead('common:menu')}
            {commonOn('common:menu') ? (doc.menu ?? [])
              .filter((row) => COMMON_MENU_KEYS.includes(row.key) || !CHILD_MENU_KEYS.includes(row.key))
              .map((row) => (
                <div key={row.key} className="admin-item">
                  <span className="biz-grip" aria-hidden="true">⋮⋮</span>
                  <div className="admin-form-grid">
                    <label className="admin-field">
                      <span className="admin-field__label">메뉴명</span>
                      <input
                        className="admin-input"
                        value={
                          editLocale === 'en'
                            ? row.labelEn || ''
                            : row.label || MENU_LABEL[row.key] || ''
                        }
                        onChange={(e) =>
                          patchMenu(row.key, editLocale === 'en' ? { labelEn: e.target.value } : { label: e.target.value })
                        }
                      />
                    </label>
                    <label className="admin-field">
                      <span className="admin-field__label">연결 페이지</span>
                      <input className="admin-input" value={row.target ?? ''} onChange={(e) => patchMenu(row.key, { target: e.target.value })} />
                    </label>
                    <label className="admin-field">
                      <span className="admin-field__label">하위 탭</span>
                      <input className="admin-input" value={row.tabs ?? ''} onChange={(e) => patchMenu(row.key, { tabs: e.target.value })} />
                    </label>
                  </div>
                  <button type="button" className="biz-x" aria-label="삭제" onClick={() => setDoc({ ...doc, menu: doc.menu.filter((item) => item.key !== row.key) })}>
                    ×
                  </button>
                </div>
              )) : null}
            {commonOn('common:menu') ? (
            <button
              type="button"
              className="biz-add"
              onClick={() =>
                setDoc({
                  ...doc,
                  menu: [...doc.menu, { key: `menu-${doc.menu.length + 1}`, order: doc.menu.length + 1, label: '', target: '', tabs: '' }],
                })
              }
            >
              + 사업 메뉴 추가
            </button>
            ) : null}
          </section> : null}
          {commonRanked.some((row) => row.id === 'common:other') ? <section className="admin-panel" style={{ order: commonOrder('common:other') }}>
            {commonHead('common:other')}
            {commonOn('common:other') ? (
            <div className="admin-form-grid">
              <label className="admin-field">
                <span className="admin-field__label">제목</span>
                <input className="admin-input" value={doc.otherTitle ?? 'MORE · 다른 사업 보기'} onChange={(e) => setDoc({ ...doc, otherTitle: e.target.value })} />
              </label>
              <div className="admin-field">
                <span className="admin-field__label">표시 방식</span>
                <div className="admin-segmented" role="group" aria-label="다른 사업 보기">
                  <button type="button" className={`admin-segmented__btn${doc.otherBusiness === 'auto' ? ' admin-segmented__btn--active' : ''}`} onClick={() => setDoc({ ...doc, otherBusiness: 'auto' })}>
                    자동 (현재 페이지 제외)
                  </button>
                  <button type="button" className={`admin-segmented__btn${doc.otherBusiness === 'manual' ? ' admin-segmented__btn--active' : ''}`} onClick={() => setDoc({ ...doc, otherBusiness: 'manual' })}>
                    직접 선택
                  </button>
                </div>
              </div>
            </div>
            ) : null}
          </section> : null}
          {commonRanked.some((row) => row.id === 'common:rules') ? <section className="admin-panel" style={{ order: commonOrder('common:rules') }}>
            {commonHead('common:rules')}
            {commonOn('common:rules') ? (
            <div className="admin-form-grid">
              <label className="admin-field">
                <span className="admin-field__label">제목 최대 글자 수 (경고)</span>
                <input className="admin-input" value={doc.titleLimit ?? '20자'} onChange={(e) => setDoc({ ...doc, titleLimit: e.target.value })} />
              </label>
              <label className="admin-field">
                <span className="admin-field__label">설명 최대 줄 수 (경고)</span>
                <input className="admin-input" value={doc.lineLimit ?? '3줄'} onChange={(e) => setDoc({ ...doc, lineLimit: e.target.value })} />
              </label>
              <div className="admin-field">
                <span className="admin-field__label">줄바꿈</span>
                <div className="admin-segmented">
                  <span className="admin-segmented__btn admin-segmented__btn--active">단어 단위 (keep-all)</span>
                </div>
              </div>
              <div className="admin-field">
                <span className="admin-field__label">서체</span>
                <div className="admin-segmented">
                  <span className="admin-segmented__btn admin-segmented__btn--active">나눔스퀘어라운드</span>
                </div>
              </div>
            </div>
            ) : null}
          </section> : null}
          {commonRanked.some((row) => row.id === 'common:archive') ? <section className="admin-panel" style={{ order: commonOrder('common:archive') }}>
            {commonHead('common:archive')}
            {commonOn('common:archive') ? (doc.archive ?? []).map((row) => (
              <div key={row.id} className="admin-item">
                <span className="biz-grip" aria-hidden="true">⋮⋮</span>
                <div className="admin-form-grid">
                  <label className="admin-field">
                    <span className="admin-field__label">항목</span>
                    <input className="admin-input" value={row.name} onChange={(e) => patchArchive(row.id, { name: e.target.value })} />
                  </label>
                  <label className="admin-field">
                    <span className="admin-field__label">상태</span>
                    <input className="admin-input" value={row.status} onChange={(e) => patchArchive(row.id, { status: e.target.value })} />
                  </label>
                  <label className="admin-field">
                    <span className="admin-field__label">메모</span>
                    <input className="admin-input" value={row.memo} onChange={(e) => patchArchive(row.id, { memo: e.target.value })} />
                  </label>
                </div>
                <button type="button" className="biz-x" aria-label="삭제" onClick={() => setDoc({ ...doc, archive: doc.archive.filter((item) => item.id !== row.id) })}>
                  ×
                </button>
              </div>
            )) : null}
            {commonOn('common:archive') ? (
            <button
              type="button"
              className="biz-add"
              onClick={() => setDoc({ ...doc, archive: [...(doc.archive ?? []), { id: `archive-${Date.now()}`, name: '', status: '', memo: '' }] })}
            >
              + 항목 추가
            </button>
            ) : null}
          </section> : null}
        </div>
      ) : null}

      {tab === 'settings' ? <SupportSettings doc={doc} setDoc={setDoc} /> : null}

      {tab === 'intro' ? (
        <div className="admin-segmented" role="tablist" aria-label="사업 소개">
          {INTRO_PAGES.map((page) => (
            <button
              key={page.id}
              type="button"
              className={`admin-segmented__btn${introId === page.id ? ' admin-segmented__btn--active' : ''}`}
              onClick={() => {
                setIntroId(page.id)
                const next = new URLSearchParams(params)
                next.set('tab', 'intro')
                next.set('page', page.id)
                setParams(next, { replace: true })
              }}
            >
              {page.label}
            </button>
          ))}
        </div>
      ) : null}

      {tab === 'guide' || tab === 'method' ? (
        <SupportComposer
          page={tab}
          doc={doc}
          setField={setField}
          onToggle={toggleSupport}
          onReorder={reorderSupport}
          renderFields={(match) => (
            <FieldStack
              rows={fields.filter((field) => match(field.key))}
              values={doc.fields}
              setField={setField}
              titleLimit={doc.titleLimit}
              lineLimit={doc.lineLimit}
            />
          )}
        />
      ) : null}

      {tab !== 'guide' && tab !== 'method' && (fields.length || groups.length)
        ? groups.map((group, index) => {
            const bare = group.title.replace(/^[①-⑳]\s*/, '')
            const canDelete = tab === 'intro' || ((tab === 'social' || tab === 'academy' || tab === 'cnc') && !bare.includes('상단'))
            return (
            <section key={group.id} className="admin-panel">
              <BizHead
                title={tab === 'intro' ? group.title : bizTitle(index, group.title)}
                enabled={group.enabled}
                onUp={() => {
                  const layout = mergePanels(doc.layout, movePanels(doc.layout, groupIds, group.id, -1))
                  setDoc({ ...doc, layout, sections: withGroupOrder(layout) })
                }}
                onDown={() => {
                  const layout = mergePanels(doc.layout, movePanels(doc.layout, groupIds, group.id, 1))
                  setDoc({ ...doc, layout, sections: withGroupOrder(layout) })
                }}
                onToggle={() => {
                  const layout = mergePanels(doc.layout, togglePanel(doc.layout, groupIds, group.id))
                  const enabled = layout.find((row) => row.id === group.id)?.enabled !== false
                  setDoc({
                    ...doc,
                    layout,
                    sections: withGroupOrder(layout).map((row) => (group.rows.some((field) => field.key === row.id || field.key.startsWith(`${row.id}.`)) ? { ...row, enabled } : row)),
                  })
                }}
                trailing={canDelete ? <button type="button" className="biz-del" onClick={() => {
                  const layout = mergePanels(doc.layout, removePanel(doc.layout, groupIds, group.id))
                  setDoc({
                    ...doc,
                    layout,
                    sections: withGroupOrder(layout).map((row) => (group.rows.some((field) => field.key === row.id || field.key.startsWith(`${row.id}.`)) ? { ...row, enabled: false } : row)),
                  })
                }}>섹션 삭제</button> : null}
              >
                {tab === 'academy' ? <AcademyModeSwitch title={group.title} values={doc.fields} setField={setField} /> : tab === 'cnc' ? <ComfortModeSwitch title={group.title} values={doc.fields} setField={setField} /> : null}
              </BizHead>
              {group.enabled ? ((tab === 'academy' ? <AcademyBody title={group.title} values={doc.fields} setField={setField} /> : tab === 'cnc' ? <ComfortBody title={group.title} values={doc.fields} setField={setField} /> : null) ?? introBody(group.title) ?? <FieldStack rows={group.rows} values={doc.fields} setField={setField} titleLimit={doc.titleLimit} lineLimit={doc.lineLimit} />) : null}
            </section>
            )
          })
        : null}
      {tab === 'common' || tab === 'social' || tab === 'academy' || tab === 'cnc' ? (
        <SectionBlocks
          blocks={(doc.blocks ?? []).filter((block) => block.page === tab)}
          note={tab === 'common' ? '여기서 추가한 섹션은 사업 페이지 맨 아래에 함께 나옵니다.' : undefined}
          onChange={(next) =>
            setDoc({
              ...doc,
              blocks: [
                ...(doc.blocks ?? []).filter((block) => block.page !== tab),
                ...next.map((block) => ({ ...block, page: tab })),
              ],
            })
          }
        />
      ) : null}
    </div>
  )
}
