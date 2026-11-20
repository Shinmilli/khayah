import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { BizSupportDocument } from '../../biz/bizSupportTypes'
import { rankedSupportSections } from '../../biz/supportSections'
import { useSiteCommon } from '../../site/useSiteCommon'
import { AdminMediaUpload } from '../components/AdminMediaUpload'
import { bizTitle } from './BizChrome'

type SetField = (key: string, value: string) => void

const ICONS = [
  { id: 'house', label: '집' },
  { id: 'book', label: '책' },
  { id: 'heart', label: '하트' },
  { id: 'person', label: '사람' },
]

const LINKS = [
  { id: '', label: '연결 안 함' },
  { id: '/business/overseas/projects', label: '사업 › 해외 진행사업' },
  { id: '/business/domestic/projects', label: '사업 › 국내 진행사업' },
  { id: '/business/overseas', label: '사업 › 해외사업' },
  { id: '/business/domestic', label: '사업 › 국내사업' },
  { id: '/about/transparency', label: '카야 › 투명경영' },
]

function linesOf(value: string): string {
  return value.replace(/\\n/g, '\n')
}

function htmlLines(value: string): string {
  return value.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')
}

function linesToBr(value: string): string {
  return value
    .split('\n')
    .map((line) => line.trimEnd())
    .join('<br>')
}

function accountRows(value: string): Array<{ bank: string; number: string }> {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [bank, ...rest] = line.split('\t')
      if (rest.length) return { bank, number: rest.join('\t') }
      const parts = line.split(/\s+/)
      return { bank: parts.shift() ?? '', number: parts.join(' ') }
    })
}

function accountText(rows: Array<{ bank: string; number: string }>): string {
  return rows.map((row) => `${row.bank}\t${row.number}`).join('\n')
}

function panelAction(id: string, doc: BizSupportDocument, setField: SetField): ReactNode {
  if (id === 'method.steps') {
    return (
      <button type="button" className="sup-add" onClick={() => setField('method.step.3.title', doc.fields['method.step.3.title'] || '새 단계')}>
        + 단계 추가
      </button>
    )
  }
  if (id === 'method.account') {
    return (
      <button
        type="button"
        className="sup-add"
        onClick={() => setField('method.accounts', `${doc.fields['method.accounts'] ?? ''}${doc.fields['method.accounts'] ? '\n' : ''}\t`)}
      >
        + 계좌 추가
      </button>
    )
  }
  return null
}

export function SupportComposer({
  page,
  doc,
  setField,
  onToggle,
  onReorder,
}: {
  page: 'guide' | 'method'
  doc: BizSupportDocument
  setField: SetField
  onToggle: (id: string) => void
  onReorder: (ids: string[]) => void
  renderFields?: (match: (key: string) => boolean) => ReactNode
}) {
  const rows = rankedSupportSections(page, doc.sections)
  const [selected, setSelected] = useState(rows[0]?.id ?? '')
  const [drag, setDrag] = useState('')
  const jumpTo = (id: string) => {
    setSelected(id)
    document.getElementById(`sup-panel-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <div className="sup-admin">
      <aside className="sup-admin__list">
        <div className="sup-admin__list-head">
          <b>섹션 구성</b>
          <span>끌어서 순서 변경</span>
        </div>
        {rows.map((row, rowIndex) => (
          <div
            key={row.id}
            className={`sup-sec${row.id === selected ? ' is-on' : ''}`}
            draggable
            onDragStart={() => setDrag(row.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (!drag || drag === row.id) return
              const ids = rows.map((item) => item.id)
              const from = ids.indexOf(drag)
              const to = ids.indexOf(row.id)
              const [moved] = ids.splice(from, 1)
              ids.splice(to, 0, moved)
              onReorder(ids)
              setDrag('')
            }}
            onClick={() => jumpTo(row.id)}
          >
            <span className="biz-grip" aria-hidden="true">⋮⋮</span>
            <span className="sup-sec__no">{rowIndex + 1}</span>
            <span className="sup-sec__name">
              <b>{row.title}</b>
              {row.note ? <small>{row.note}</small> : null}
            </span>
            <label className="sup-sec__check" onClick={(event) => event.stopPropagation()}>
              <input type="checkbox" checked={row.enabled} onChange={() => onToggle(row.id)} />
              표시
            </label>
          </div>
        ))}
      </aside>
      <div className="sup-admin__stack">
        {rows.map((row, rowIndex) => (
          <section
            key={row.id}
            id={`sup-panel-${row.id}`}
            className={`sup-admin__edit${row.id === selected ? ' is-on' : ''}`}
            onFocusCapture={() => setSelected(row.id)}
            onClick={() => setSelected(row.id)}
          >
            <p className="sup-edit__kicker">섹션 편집</p>
            <div className="sup-edit__head">
              <h2>{bizTitle(rowIndex, row.title)}</h2>
              {panelAction(row.id, doc, setField)}
            </div>
            <SupportEditor id={row.id} doc={doc} setField={setField} />
          </section>
        ))}
      </div>
    </div>
  )
}

function SupportEditor({
  id,
  doc,
  setField,
}: {
  id: string
  doc: BizSupportDocument
  setField: SetField
}) {
  const values = doc.fields
  if (id === 'guide.hero') return <HeroEditor values={values} setField={setField} donateLabel={doc.donate.labelKo} />
  if (id === 'guide.where') return <WhereEditor values={values} setField={setField} />
  if (id === 'guide.impact') return <ImpactNote title={doc.donate.impactTitle} />
  if (id === 'guide.open') return <OpenEditor values={values} setField={setField} />
  if (id === 'guide.give') return <GiveEditor values={values} setField={setField} donateLabel={doc.donate.labelKo} />
  if (id === 'guide.contact') return <GuideContactEditor values={values} setField={setField} />
  if (id === 'method.happy') return <HappyEditor values={values} setField={setField} />
  if (id === 'method.steps') return <StepsEditor values={values} setField={setField} />
  if (id === 'method.pay') return <PayEditor values={values} setField={setField} />
  if (id === 'method.account') return <AccountEditor values={values} setField={setField} />
  if (id === 'method.receipt') return <ReceiptEditor values={values} setField={setField} />
  if (id === 'method.contact') return <MethodContactEditor values={values} setField={setField} />
  if (id === 'method.cta') return <CtaEditor values={values} setField={setField} donateLabel={doc.donate.labelKo} />
  return null
}

function Field({
  label,
  value,
  onChange,
  rows,
  hint,
  full,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
  hint?: string
  full?: boolean
}) {
  return (
    <label className={`admin-field${full || rows ? ' admin-field--full' : ''}`}>
      <span className="admin-field__label">{label}</span>
      {rows ? (
        <textarea className="admin-input" rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="admin-input" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint ? <span className="admin-field__hint">{hint}</span> : null}
    </label>
  )
}

function HeroEditor({
  values,
  setField,
  donateLabel,
}: {
  values: Record<string, string>
  setField: SetField
  donateLabel: string
}) {
  return (
    <>
      <div className="admin-form-grid">
        <Field label="제목" value={htmlLines(values['guide.title'] ?? '')} onChange={(v) => setField('guide.title', linesToBr(v))} rows={2} full hint="줄바꿈은 엔터" />
        <Field label="소개 문장" value={htmlLines(values['guide.lead'] ?? '')} onChange={(v) => setField('guide.lead', linesToBr(v))} rows={2} full />
        <Field label="사진 대체 텍스트" value={values['guide.photoAlt'] ?? ''} onChange={(v) => setField('guide.photoAlt', v)} />
        <Field label="보조 버튼 문구" value={values['guide.heroBtn2'] ?? ''} onChange={(v) => setField('guide.heroBtn2', v)} hint="후원 방법 페이지로 이동" />
      </div>
      <AdminMediaUpload layout="slot" slotTitle="첫 화면 사진" slotRatio="1920×640" label="첫 화면 사진" hint="권장 가로형" variant="image" value={values['guide.photo'] || null} onChange={(url) => setField('guide.photo', url ?? '')} />
      <div className="sup-place-box">
        <h3 className="sup-edit__sub">버튼</h3>
        <p className="admin-panel__foot">주 버튼 「{donateLabel || '지금 바로 후원하기 ♥'}」 문구·링크는 <Link to="/admin/app/biz-support?tab=settings">후원 공통</Link>에서 관리합니다.</p>
      </div>
    </>
  )
}

function OpenEditor({ values, setField }: { values: Record<string, string>; setField: SetField }) {
  return (
    <>
      <div className="admin-form-grid">
        <Field label="영문 소제목" value={values['guide.openKicker'] ?? ''} onChange={(v) => setField('guide.openKicker', v)} />
        <Field label="제목" value={values['guide.openTitle'] ?? ''} onChange={(v) => setField('guide.openTitle', v)} />
      </div>
      <p className="admin-field__hint">바로가기 → 투명경영 페이지 (/about/transparency)</p>
      <h3 className="sup-edit__sub">투명경영 카드 3개</h3>
      <div className="biz-bars">
        {[0, 1, 2].map((index) => (
          <div key={index} className="sup-card">
            <Field label={`카드 ${index + 1} 제목`} value={values[`guide.open.${index}.title`] ?? ''} onChange={(v) => setField(`guide.open.${index}.title`, v)} full />
            <Field label="본문" value={values[`guide.open.${index}.body`] ?? ''} onChange={(v) => setField(`guide.open.${index}.body`, v)} rows={3} full />
          </div>
        ))}
      </div>
    </>
  )
}

function GiveEditor({
  values,
  setField,
  donateLabel,
}: {
  values: Record<string, string>
  setField: SetField
  donateLabel: string
}) {
  return (
    <>
      <div className="admin-form-grid">
        <Field label="영문 소제목" value={values['guide.giveKicker'] ?? ''} onChange={(v) => setField('guide.giveKicker', v)} />
        <Field label="제목" value={values['guide.giveTitle'] ?? ''} onChange={(v) => setField('guide.giveTitle', v)} />
      </div>
      <h3 className="sup-edit__sub">후원 종류 3개</h3>
      <div className="biz-bars">
        {[0, 1, 2].map((index) => (
          <div key={index} className="sup-card">
            <div className="admin-form-grid">
              <Field label="제목" value={values[`guide.give.${index}.title`] ?? ''} onChange={(v) => setField(`guide.give.${index}.title`, v)} />
              <Field label="결제 수단 한 줄" value={values[`guide.give.${index}.meta`] ?? ''} onChange={(v) => setField(`guide.give.${index}.meta`, v)} hint="· 로 구분해 표시" />
              <Field label="본문" value={values[`guide.give.${index}.body`] ?? ''} onChange={(v) => setField(`guide.give.${index}.body`, v)} rows={2} full />
            </div>
          </div>
        ))}
      </div>
      <h3 className="sup-edit__sub">하단 후원 안내</h3>
      <div className="admin-form-grid">
        <Field label="CTA 제목" value={values['guide.giveCtaTitle'] ?? ''} onChange={(v) => setField('guide.giveCtaTitle', v)} full />
        <Field label="안전 안내 문구" value={values['guide.giveSafe'] ?? ''} onChange={(v) => setField('guide.giveSafe', v)} rows={3} full />
      </div>
      <p className="admin-panel__foot">후원 버튼 「{donateLabel || '지금 바로 후원하기 ♥'}」는 <Link to="/admin/app/biz-support?tab=settings">후원 공통</Link>에서 관리합니다.</p>
    </>
  )
}

function GuideContactEditor({ values, setField }: { values: Record<string, string>; setField: SetField }) {
  return (
    <>
      <div className="admin-form-grid">
        <Field label="제목" value={values['guide.contactTitle'] ?? ''} onChange={(v) => setField('guide.contactTitle', v)} />
        <Field label="안내 문장" value={values['guide.contactLead'] ?? ''} onChange={(v) => setField('guide.contactLead', v)} full />
      </div>
      <ContactNote />
    </>
  )
}

function ImpactNote({ title }: { title?: string }) {
  return (
    <div>
      <p className="admin-panel__foot">숫자는 임팩트 대시보드에서 불러옵니다. 표시 범위와 수치는 <Link to="/admin/app/biz-support?tab=settings">후원 공통</Link>에서 고릅니다. 대시보드가 공개되기 전에는 이 섹션이 숨겨집니다.</p>
      {title ? <p className="admin-field__hint">현재 섹션 제목: {title}</p> : null}
    </div>
  )
}

function HappyEditor({ values, setField }: { values: Record<string, string>; setField: SetField }) {
  return (
    <>
      <h3 className="sup-edit__sub">페이지 상단</h3>
      <div className="admin-form-grid">
        <Field label="페이지 제목" value={values['method.title'] ?? ''} onChange={(v) => setField('method.title', v)} />
        <Field label="소개 문장" value={values['method.lead'] ?? ''} onChange={(v) => setField('method.lead', v)} rows={2} full />
      </div>
      <h3 className="sup-edit__sub">해피나눔 안내</h3>
      <div className="admin-form-grid">
        <Field label="제목" value={htmlLines(values['method.happyTitle'] ?? '')} onChange={(v) => setField('method.happyTitle', linesToBr(v))} rows={2} full hint="줄바꿈은 엔터" />
        <Field label="본문 1" value={values['method.happyP1'] ?? ''} onChange={(v) => setField('method.happyP1', v)} rows={3} full />
        <Field label="본문 2" value={values['method.happyP2'] ?? ''} onChange={(v) => setField('method.happyP2', v)} rows={2} full />
      </div>
      <h3 className="sup-edit__sub">특징 3개</h3>
      <div className="biz-bars">
        {[0, 1, 2].map((index) => (
          <div key={index} className="sup-card">
            <Field label="제목" value={values[`method.happy.${index}.title`] ?? ''} onChange={(v) => setField(`method.happy.${index}.title`, v)} full />
            <Field label="설명" value={values[`method.happy.${index}.body`] ?? ''} onChange={(v) => setField(`method.happy.${index}.body`, v)} rows={2} full />
          </div>
        ))}
      </div>
    </>
  )
}

function PayEditor({ values, setField }: { values: Record<string, string>; setField: SetField }) {
  return (
    <>
      <Field label="제목" value={values['method.payTitle'] ?? ''} onChange={(v) => setField('method.payTitle', v)} full />
      <p className="admin-field__hint">종류별 가능 여부 표는 고정 안내입니다. 아래 카드 문구·권장 배지만 수정합니다.</p>
      <h3 className="sup-edit__sub">납부 수단 카드</h3>
      <div className="biz-bars">
        {[0, 1, 2].map((index) => (
          <div key={index} className="sup-card">
            <div className="admin-form-grid">
              <Field label="제목" value={values[`method.pay.${index}.title`] ?? ''} onChange={(v) => setField(`method.pay.${index}.title`, v)} />
              <Field label="배지" value={values[`method.pay.${index}.badge`] ?? ''} onChange={(v) => setField(`method.pay.${index}.badge`, v)} hint="비우면 배지 숨김" />
              <Field label="설명 (한 줄에 하나씩)" value={linesOf(values[`method.pay.${index}.lines`] ?? '')} onChange={(v) => setField(`method.pay.${index}.lines`, v)} rows={4} full />
            </div>
          </div>
        ))}
        <div className="sup-card">
          <Field label="기타 후원 제목" value={values['method.payOtherTitle'] ?? ''} onChange={(v) => setField('method.payOtherTitle', v)} full />
          <Field label="기타 후원 본문" value={values['method.payOtherBody'] ?? ''} onChange={(v) => setField('method.payOtherBody', v)} rows={2} full />
        </div>
      </div>
    </>
  )
}

function ReceiptEditor({ values, setField }: { values: Record<string, string>; setField: SetField }) {
  return (
    <>
      <Field label="제목" value={values['method.receiptTitle'] ?? ''} onChange={(v) => setField('method.receiptTitle', v)} full />
      <h3 className="sup-edit__sub">혜택 카드 3개</h3>
      <div className="biz-bars">
        {[0, 1, 2].map((index) => (
          <div key={index} className="sup-card">
            <Field label="제목" value={values[`method.receipt.${index}.title`] ?? ''} onChange={(v) => setField(`method.receipt.${index}.title`, v)} full />
            <Field label="본문" value={values[`method.receipt.${index}.body`] ?? ''} onChange={(v) => setField(`method.receipt.${index}.body`, v)} rows={3} full />
          </div>
        ))}
      </div>
    </>
  )
}

function MethodContactEditor({ values, setField }: { values: Record<string, string>; setField: SetField }) {
  return (
    <>
      <h3 className="sup-edit__sub">변경·문의</h3>
      <div className="admin-form-grid">
        <Field label="제목" value={values['method.contactTitle'] ?? ''} onChange={(v) => setField('method.contactTitle', v)} full />
        <Field label="본문" value={values['method.contactBody'] ?? ''} onChange={(v) => setField('method.contactBody', v)} rows={3} full />
      </div>
      <ContactNote />
      <h3 className="sup-edit__sub">후원 추천하기</h3>
      <div className="admin-form-grid">
        <Field label="제목" value={values['method.recommendTitle'] ?? ''} onChange={(v) => setField('method.recommendTitle', v)} full />
        <Field label="본문" value={values['method.recommendBody'] ?? ''} onChange={(v) => setField('method.recommendBody', v)} rows={2} full />
      </div>
      <p className="admin-panel__foot">「후원 링크 복사」는 후원 공통의 해피나눔 주소를 복사합니다.</p>
    </>
  )
}

function CtaEditor({
  values,
  setField,
  donateLabel,
}: {
  values: Record<string, string>
  setField: SetField
  donateLabel: string
}) {
  return (
    <>
      <div className="admin-form-grid">
        <Field label="제목" value={values['method.ctaTitle'] ?? ''} onChange={(v) => setField('method.ctaTitle', v)} full />
        <Field label="안내 문장" value={values['method.ctaLead'] ?? ''} onChange={(v) => setField('method.ctaLead', v)} rows={2} full />
      </div>
      <p className="admin-panel__foot">버튼 「{donateLabel || '지금 바로 후원하기 ♥'}」 문구·링크는 <Link to="/admin/app/biz-support?tab=settings">후원 공통</Link>에서 관리합니다.</p>
    </>
  )
}

function WhereEditor({ values, setField }: { values: Record<string, string>; setField: SetField }) {
  const shown = [0, 1, 2, 3].filter((index) => index < 3 || values[`guide.item.${index}.title`] || values[`guide.item.${index}.body`])
  return (
    <>
      <div className="admin-form-grid">
        <label className="admin-field">
          <span className="admin-field__label">영문 소제목</span>
          <input className="admin-input" value={values['guide.whereKicker'] ?? ''} onChange={(e) => setField('guide.whereKicker', e.target.value)} />
        </label>
        <label className="admin-field">
          <span className="admin-field__label">제목</span>
          <input className="admin-input" value={values['guide.whereTitle'] ?? ''} onChange={(e) => setField('guide.whereTitle', e.target.value)} />
        </label>
        <label className="admin-field admin-field--full">
          <span className="admin-field__label">소개 문구</span>
          <textarea className="admin-input" rows={2} value={values['guide.whereLead'] ?? ''} onChange={(e) => setField('guide.whereLead', e.target.value)} />
        </label>
      </div>
      <div className="sup-style">
        <span>글씨 스타일 (선택형)</span>
        <label>
          제목 크기
          <select className="admin-input" value={values['guide.whereSize'] || 'md'} onChange={(e) => setField('guide.whereSize', e.target.value)}>
            <option value="lg">크게</option>
            <option value="md">보통</option>
            <option value="sm">작게</option>
          </select>
        </label>
        <div className="sup-swatches" role="group" aria-label="제목 색">
          제목 색
          {(['burgundy', 'ink', 'gray'] as const).map((color) => (
            <button
              key={color}
              type="button"
              title={color === 'burgundy' ? '제목색' : color === 'ink' ? '포인트' : '본문색'}
              className={`sup-swatch sup-swatch--${color}${values['guide.whereColor'] === color || (!values['guide.whereColor'] && color === 'burgundy') ? ' is-on' : ''}`}
              onClick={() => setField('guide.whereColor', color)}
            />
          ))}
        </div>
        <label>
          배경
          <select className="admin-input" value={values['guide.whereBg'] || 'beige'} onChange={(e) => setField('guide.whereBg', e.target.value)}>
            <option value="white">흰색</option>
            <option value="beige">베이지</option>
          </select>
        </label>
      </div>
      <div className="sup-place-box">
        <h3 className="sup-edit__sub">대표 카드</h3>
        <div className="sup-place">
          <AdminMediaUpload quiet layout="slot" slotTitle="사진 교체" slotRatio="3 : 2" label="대표 카드 사진" hint="권장 1200×800 이상, 가로형" variant="image" value={values['guide.placePhoto'] || null} onChange={(url) => setField('guide.placePhoto', url ?? '')} />
          <div className="admin-form-grid">
            <label className="admin-field admin-field--full">
              <span className="admin-field__label">태그</span>
              <input className="admin-input" value={values['guide.placeTag'] ?? ''} onChange={(e) => setField('guide.placeTag', e.target.value)} />
            </label>
            <label className="admin-field admin-field--full">
              <span className="admin-field__label">카드 제목</span>
              <input className="admin-input" value={values['guide.placeTitle'] ?? ''} onChange={(e) => setField('guide.placeTitle', e.target.value)} />
            </label>
            <label className="admin-field admin-field--full">
              <span className="admin-field__label">본문</span>
              <textarea className="admin-input" rows={4} value={values['guide.placeBody'] ?? ''} onChange={(e) => setField('guide.placeBody', e.target.value)} />
            </label>
            <label className="admin-field admin-field--full">
              <span className="admin-field__label">링크</span>
              <select className="admin-input" value={values['guide.placeHref'] ?? ''} onChange={(e) => setField('guide.placeHref', e.target.value)}>
                {LINKS.map((link) => (
                  <option key={link.id} value={link.id}>{link.label}</option>
                ))}
              </select>
              <span className="admin-field__hint">연결할 글·페이지가 있을 때만 선택. '연결 안 함'이면 링크 문구도 숨김</span>
            </label>
          </div>
        </div>
      </div>
      <div className="sup-edit__head">
        <h3 className="sup-edit__sub">항목 카드 최대 4개</h3>
        {shown.length < 4 ? (
          <button type="button" className="sup-add" onClick={() => setField(`guide.item.${shown.length}.title`, '새 항목')}>
            + 항목 추가
          </button>
        ) : null}
      </div>
      <div className="biz-bars">
        {shown.map((index) => (
          <div key={index} className="sup-card">
            <div className="sup-card__row">
              <span className="biz-grip" aria-hidden="true">⋮⋮</span>
              <label className="admin-field">
                <span className="admin-field__label">아이콘</span>
                <select className="admin-input" value={values[`guide.item.${index}.icon`] || ICONS[index]?.id || 'house'} onChange={(e) => setField(`guide.item.${index}.icon`, e.target.value)}>
                  {ICONS.map((icon) => (
                    <option key={icon.id} value={icon.id}>{icon.label}</option>
                  ))}
                </select>
              </label>
              <label className="admin-field">
                <span className="admin-field__label">제목</span>
                <input className="admin-input" value={values[`guide.item.${index}.title`] ?? ''} onChange={(e) => setField(`guide.item.${index}.title`, e.target.value)} />
              </label>
            </div>
            <div className="sup-card__row">
              <textarea className="admin-input" rows={2} value={values[`guide.item.${index}.body`] ?? ''} onChange={(e) => setField(`guide.item.${index}.body`, e.target.value)} />
              <button type="button" className="biz-del" onClick={() => { setField(`guide.item.${index}.title`, ''); setField(`guide.item.${index}.body`, '') }}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function StepsEditor({ values, setField }: { values: Record<string, string>; setField: SetField }) {
  const count = values['method.step.3.title'] || values['method.step.3.lines'] ? 4 : 3
  return (
    <>
      <div className="admin-form-grid">
        <Field label="제목" value={values['method.stepsTitle'] ?? ''} onChange={(v) => setField('method.stepsTitle', v)} full />
        <Field label="소개 문장" value={values['method.stepsLead'] ?? ''} onChange={(v) => setField('method.stepsLead', v)} rows={2} full />
      </div>
      <div className="biz-bars">
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="sup-step">
            <AdminMediaUpload quiet layout="slot" slotTitle="캡처 교체" slotRatio="logo" label={`STEP ${index + 1} 캡처`} variant="image" value={values[`method.step.${index}.photo`] || null} onChange={(url) => setField(`method.step.${index}.photo`, url ?? '')} />
            <div>
              <div className="sup-card__row">
                <span className="biz-grip" aria-hidden="true">⋮⋮</span>
                <b>STEP {index + 1}</b>
                <input className="admin-input" value={values[`method.step.${index}.title`] ?? ''} onChange={(e) => setField(`method.step.${index}.title`, e.target.value)} />
                <button type="button" className="biz-del" onClick={() => { setField(`method.step.${index}.title`, ''); setField(`method.step.${index}.lines`, ''); setField(`method.step.${index}.photo`, '') }}>삭제</button>
              </div>
              <textarea className="admin-input" rows={4} value={linesOf(values[`method.step.${index}.lines`] ?? '')} onChange={(e) => setField(`method.step.${index}.lines`, e.target.value)} />
              <p className="admin-field__hint">설명은 한 줄에 하나씩 입력 → 화면에 점 목록으로 표시</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function AccountEditor({ values, setField }: { values: Record<string, string>; setField: SetField }) {
  const rows = accountRows(values['method.accounts'] ?? '')
  const write = (next: Array<{ bank: string; number: string }>) => setField('method.accounts', accountText(next))
  return (
    <>
      <div className="admin-form-grid">
        <Field label="구역 제목" value={values['method.accountTitle'] ?? ''} onChange={(v) => setField('method.accountTitle', v)} full />
        <Field label="예금주" value={values['method.holder'] ?? ''} onChange={(v) => setField('method.holder', v)} />
      </div>
      <div className="biz-bars">
        {rows.map((row, index) => (
          <div key={index} className="sup-account">
            <span className="biz-grip" aria-hidden="true">⋮⋮</span>
            <input className="admin-input" aria-label="은행" value={row.bank} onChange={(e) => write(rows.map((item, itemIndex) => itemIndex === index ? { ...item, bank: e.target.value } : item))} />
            <input className="admin-input" aria-label="계좌번호" value={row.number} onChange={(e) => write(rows.map((item, itemIndex) => itemIndex === index ? { ...item, number: e.target.value } : item))} />
            <button type="button" className="biz-del" onClick={() => write(rows.filter((_, itemIndex) => itemIndex !== index))}>삭제</button>
          </div>
        ))}
      </div>
      <Field label="하단 안내" value={values['method.accountNote'] ?? ''} onChange={(v) => setField('method.accountNote', v)} rows={2} full />
      <p className="admin-panel__foot">후원 계좌는 이 페이지 한 곳에서만 관리·노출 (다른 페이지 중복 노출 없음)</p>
    </>
  )
}

function contactPhone(raw: string | undefined): string {
  const text = (raw || '070-5121-2198').replace(/^T\s*/i, '')
  const match = text.match(/0\d[\d.\-\s]{7,}/)
  return (match?.[0] || text.split('|')[0] || text).trim()
}

function ContactNote() {
  const site = useSiteCommon()
  return (
    <div>
      <div className="sup-contact">
        <p>T  {contactPhone(site?.org.phoneFax)}</p>
        <p>E  {site?.org.email || 'khayahinternational@gmail.com'}</p>
      </div>
      <p className="admin-panel__foot">사이트 공통 정보에서 불러옴. 수정은 <Link to="/admin/app/site-common#org">사이트 설정 › 기관 정보</Link>에서 (한 곳 수정 시 전체 반영)</p>
    </div>
  )
}

export function SupportSettings({
  doc,
  setDoc,
}: {
  doc: BizSupportDocument
  setDoc: (doc: BizSupportDocument) => void
}) {
  const site = useSiteCommon()
  const donate = doc.donate
  const patch = (next: Partial<BizSupportDocument['donate']>) => setDoc({ ...doc, donate: { ...donate, ...next } })
  const metrics = (donate.impactMetrics ?? 'people,children,partners,teachers').split(',').filter(Boolean)
  const toggleMetric = (id: string) => {
    const next = metrics.includes(id) ? metrics.filter((item) => item !== id) : [...metrics, id].slice(0, 4)
    patch({ impactMetrics: next.join(',') })
  }
  return (
    <div className="sup-settings">
      <div className="sup-settings__col">
        <section className="admin-panel">
          <h2 className="admin-panel__title">후원 신청 링크</h2>
          <label className="admin-field">
            <span className="admin-field__label">해피나눔 신청서 주소</span>
            <input className="admin-input" value={donate.url} onChange={(e) => patch({ url: e.target.value })} />
            <span className="admin-field__hint">여기서 한 번 바꾸면 홈페이지의 모든 '후원하기' 버튼에 적용</span>
          </label>
          <label className="sup-sec__check">
            <input type="checkbox" checked={donate.openBlank !== false} onChange={(e) => patch({ openBlank: e.target.checked })} />
            새 창으로 열기
          </label>
        </section>
        <section className="admin-panel">
          <h2 className="admin-panel__title">후원 버튼</h2>
          <label className="admin-field">
            <span className="admin-field__label">큰 버튼 문구</span>
            <input className="admin-input" value={donate.labelKo} onChange={(e) => patch({ labelKo: e.target.value })} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">상단 메뉴 버튼 문구</span>
            <input className="admin-input" value={donate.menuLabel ?? ''} onChange={(e) => patch({ menuLabel: e.target.value })} />
          </label>
          <label className="sup-sec__check">
            <input type="checkbox" checked={(donate.menuPin ?? 'site') !== 'off'} onChange={(e) => patch({ menuPin: e.target.checked ? 'on' : 'off' })} />
            상단 메뉴에 후원하기 버튼 고정
          </label>
          <label className="sup-sec__check">
            <input type="checkbox" checked={donate.showFloating !== false} onChange={(e) => patch({ showFloating: e.target.checked })} />
            오른쪽 아래 떠 있는 후원하기 버튼 표시
          </label>
        </section>
        <section className="admin-panel">
          <h2 className="admin-panel__title">문의 정보</h2>
          <div className="sup-contact">
            <p>T  {contactPhone(site?.org.phoneFax)}</p>
            <p>E  {site?.org.email || 'khayahinternational@gmail.com'}</p>
          </div>
          <p className="admin-panel__foot">사이트 공통 정보에서 불러옴. 수정은 <Link to="/admin/app/site-common#org">사이트 설정 › 기관 정보</Link>에서 (한 곳 수정 시 전체 반영)</p>
        </section>
      </div>
      <div className="sup-settings__col">
        <section className="admin-panel">
          <h2 className="admin-panel__title">'함께 만든 변화' 연동</h2>
          <p className="admin-panel__foot">임팩트 대시보드 데이터를 불러옴. 여기서는 숫자를 입력하지 않음</p>
          <label className="admin-field">
            <span className="admin-field__label">섹션 제목</span>
            <input className="admin-input" value={donate.impactTitle ?? ''} onChange={(e) => patch({ impactTitle: e.target.value })} />
          </label>
          <fieldset className="sup-choice">
            <legend>불러올 범위</legend>
            <label><input type="radio" name="impact-scope" checked={(donate.impactScope ?? 'all') === 'all'} onChange={() => patch({ impactScope: 'all' })} /> 기관 전체 실적</label>
            <label>
              <input type="radio" name="impact-scope" checked={donate.impactScope === 'country'} onChange={() => patch({ impactScope: 'country' })} /> 국가 선택
              <select className="admin-input" value={donate.impactCountry ?? '미얀마'} onChange={(e) => patch({ impactCountry: e.target.value, impactScope: 'country' })}>
                <option>미얀마</option>
                <option>키르기스스탄</option>
              </select>
            </label>
          </fieldset>
          <fieldset className="sup-choice">
            <legend>표시할 수치 (최대 4개)</legend>
            {[
              ['people', '함께한 사람들'],
              ['children', '참여 아동·청소년·청년'],
              ['partners', '협력기관'],
              ['teachers', '참여 교사'],
            ].map(([id, label]) => (
              <label key={id}><input type="checkbox" checked={metrics.includes(id)} onChange={() => toggleMetric(id)} /> {label}</label>
            ))}
          </fieldset>
          <label className="admin-field">
            <span className="admin-field__label">대표 변화 이야기</span>
            <select className="admin-input" value="" disabled>
              <option>임팩트 대시보드 '변화의 이야기'에서 선택</option>
            </select>
          </label>
          <p className="sup-rule">
            <b>자동 표시 규칙</b>
            공개 승인된 수치만 표시 · 수치 없는 칸은 숨김 · 대시보드 공개 전에는 섹션 전체 숨김
          </p>
        </section>
        <section className="admin-panel">
          <h2 className="admin-panel__title">기부금 영수증 안내 문구</h2>
          <p className="admin-panel__foot">후원 안내·후원 방법 페이지 공통</p>
          <textarea
            className="admin-input"
            rows={4}
            value={
              donate.receiptNote ??
              '카야인터내셔널이 발급합니다. 신청 시 주민등록번호를 입력하시면 연말정산 간소화 서비스에서 바로 확인하실 수 있습니다.'
            }
            onChange={(e) => patch({ receiptNote: e.target.value })}
          />
        </section>
      </div>
    </div>
  )
}
