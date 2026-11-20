import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AdminMediaUpload } from '../components/AdminMediaUpload'
import { BizHead, bizTitle } from '../biz/BizChrome'
import { greetSectionOrder, kayaSectionOrder, transSectionOrder, type GreetMovingId, type KayaSectionId, type TransMovingId } from '../../kaya/kayaSectionOrder'
import type { KayaPagesDocument } from '../../kaya/kayaPagesTypes'
import type { FinancialReportsDocument } from '../../financial-report/financialReportTypes'
import { uploadDocumentPdf } from '../../../services/api'
import { pdfOpenHref } from '../../../utils/pdfAttachments'
import {
  complianceItems,
  compliancePatch,
  disclosureItems,
  disclosurePatch,
  newDisclosureItem,
  pdfKindOf,
  principleItems,
  principlePatch,
  type DisclosureFile,
} from '../../kaya/transparencyLists'

type TabId = 'intro' | 'greet' | 'trans' | 'location'

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

function selectAfter(
  el: HTMLTextAreaElement,
  start: number,
  end: number,
  onCaret?: (start: number, end: number) => void,
) {
  onCaret?.(start, end)
  requestAnimationFrame(() => {
    el.focus()
    el.setSelectionRange(start, end)
  })
}

function unwrapInner(selected: string, open: string, close: string): string | null {
  if (!selected.startsWith(open) || !selected.endsWith(close)) return null
  const inner = selected.slice(open.length, -close.length)
  if (inner.includes(open) || inner.includes(close)) return null
  return inner
}

function peelOuter(value: string, open: string, close: string): string | null {
  if (!value.startsWith(open) || !value.endsWith(close)) return null
  let depth = 0
  let index = 0
  while (index < value.length) {
    if (value.startsWith(open, index)) {
      depth += 1
      index += open.length
      continue
    }
    if (value.startsWith(close, index)) {
      depth -= 1
      index += close.length
      if (depth === 0) return index === value.length ? value.slice(open.length, -close.length) : null
      continue
    }
    index += 1
  }
  return null
}

function withoutPlaceholder(value: string, open: string, close: string): string {
  const token = `${open}문구${close}`
  return value.startsWith(token) ? value.slice(token.length) : value
}

function toggleWhole(value: string, open: string, close: string): string {
  const body = withoutPlaceholder(value, open, close)
  const peeled = peelOuter(body, open, close)
  if (peeled != null) return peeled
  if (!body.trim()) return body
  return `${open}${body}${close}`
}

function markCovers(value: string, start: number, end: number, open: string, close: string): boolean {
  const selected = value.slice(start, end)
  if (unwrapInner(selected, open, close) != null) return true
  const before = value.slice(0, start)
  const after = value.slice(end)
  if (before.endsWith(open) && after.startsWith(close)) return true
  const openAt = before.lastIndexOf(open)
  const closeAt = after.indexOf(close)
  if (openAt === -1 || closeAt === -1) return false
  const beforeInner = before.slice(openAt + open.length)
  const afterInner = after.slice(0, closeAt)
  return !beforeInner.includes(open) && !beforeInner.includes(close) && !afterInner.includes(open) && !afterInner.includes(close)
}

const BODY_MARKS = [
  { label: '굵게', open: '<strong>', close: '</strong>' },
  { label: '밑줄 강조', open: '<span class="gm-mark">', close: '</span>' },
  { label: '와인색', open: '<span class="gm-wine">', close: '</span>' },
] as const

function wrapSelection(
  el: HTMLTextAreaElement | null,
  value: string,
  open: string,
  close: string,
  onChange: (next: string) => void,
  onCaret?: (start: number, end: number) => void,
) {
  if (!el) return
  const start = el.selectionStart
  const end = el.selectionEnd
  const selected = value.slice(start, end)
  const before = value.slice(0, start)
  const after = value.slice(end)
  const placeholder = `${open}문구${close}`

  if (!selected || (selected === '문구' && before.endsWith(open) && after.startsWith(close)) || (value.startsWith(placeholder) && start < placeholder.length)) {
    const next = toggleWhole(value, open, close)
    const inner = peelOuter(next, open, close)
    onChange(next)
    selectAfter(el, inner == null ? 0 : open.length, inner == null ? next.length : open.length + inner.length, onCaret)
    return
  }

  const wrapped = unwrapInner(selected, open, close)
  if (wrapped != null) {
    onChange(before + wrapped + after)
    selectAfter(el, start, start + wrapped.length, onCaret)
    return
  }

  if (before.endsWith(open) && after.startsWith(close)) {
    const next = before.slice(0, -open.length) + selected + after.slice(close.length)
    const caret = start - open.length
    onChange(next)
    selectAfter(el, caret, caret + selected.length, onCaret)
    return
  }

  const openAt = before.lastIndexOf(open)
  const closeAt = after.indexOf(close)
  if (openAt !== -1 && closeAt !== -1) {
    const beforeInner = before.slice(openAt + open.length)
    const afterInner = after.slice(0, closeAt)
    if (!beforeInner.includes(open) && !beforeInner.includes(close) && !afterInner.includes(open) && !afterInner.includes(close)) {
      const inner = beforeInner + selected + afterInner
      onChange(before.slice(0, openAt) + inner + after.slice(closeAt + close.length))
      selectAfter(el, openAt, openAt + inner.length, onCaret)
      return
    }
  }

  onChange(before + open + selected + close + after)
  const caret = start + open.length
  selectAfter(el, caret, caret + selected.length, onCaret)
}

export function AdminKayaSectionForms({
  tab,
  doc,
  setField,
  setDoc,
  heroImage,
  onHeroImage,
  finance,
  setFinance,
  editLocale = 'ko',
}: {
  tab: TabId
  doc: KayaPagesDocument
  setField: (key: string, value: string) => void
  setDoc: (next: KayaPagesDocument) => void
  heroImage: string
  onHeroImage: (url: string) => void
  finance: FinancialReportsDocument | null
  setFinance: (next: FinancialReportsDocument) => void
  editLocale?: 'ko' | 'en'
}) {
  const fields = doc.fields
  const localeKey = (key: string) => {
    if (editLocale !== 'en') return key
    if (key.endsWith('En') || key.endsWith('Ko') || key.endsWith('On') || key.endsWith('Order') || key.endsWith('Mode') || key.endsWith('Side') || key === 'intro.bg' || key === 'intro.align') {
      return key
    }
    return `${key}.en`
  }
  const text = (key: string) => fields[localeKey(key)] ?? ''
  const setLocaleField = (key: string, value: string) => setField(localeKey(key), value)

  if (tab === 'intro') return <IntroForm text={text} setField={setLocaleField} doc={doc} setDoc={setDoc} heroImage={heroImage} onHeroImage={onHeroImage} />
  if (tab === 'greet') return <GreetForm text={text} setField={setLocaleField} setDoc={setDoc} doc={doc} heroImage={heroImage} onHeroImage={onHeroImage} />
  if (tab === 'location') return <LocationForm text={text} setField={setLocaleField} />
  return <TransForm text={text} setField={setLocaleField} doc={doc} setDoc={setDoc} heroImage={heroImage} onHeroImage={onHeroImage} finance={finance} setFinance={setFinance} />
}

function HeroUpload({ heroImage, onHeroImage }: { heroImage: string; onHeroImage: (url: string) => void }) {
  return (
    <AdminMediaUpload
      layout="slot"
      slotTitle="사진 올리기"
      slotRatio="1920×640"
      label="상단 사진"
      hint="카야 메뉴가 이 사진을 함께 씁니다"
      variant="image"
      value={heroImage || null}
      onChange={(url) => onHeroImage(url ?? '')}
    />
  )
}

const CHIP_COUNT = 8
const ID_COUNT = 6

function idPointKey(index: number): string {
  if (index === 0) return 'intro.definitionPoint'
  if (index === 1) return 'intro.visionPoint'
  if (index === 2) return 'intro.missionPoint'
  return `intro.id.${index}.point`
}

function idBodyKey(index: number): string {
  if (index === 0) return 'intro.definition'
  if (index === 1) return 'intro.vision'
  if (index === 2) return 'intro.mission'
  return `intro.id.${index}.body`
}

function EditMode({ value, onChange }: { value: string; onChange: (mode: 'text' | 'image') => void }) {
  return (
    <>
      <span>수정 방식</span>
      <div className="admin-segmented admin-segmented--tight" role="group" aria-label="수정 방식">
        {(['text', 'image'] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            className={`admin-segmented__btn${value === mode ? ' admin-segmented__btn--active' : ''}`}
            onClick={() => onChange(mode)}
          >
            {mode === 'text' ? '텍스트' : '이미지'}
          </button>
        ))}
      </div>
    </>
  )
}

function SectionImageFields({
  prefix,
  text,
  setField,
  pcHint,
  mobileHint,
}: {
  prefix: string
  text: (key: string) => string
  setField: (key: string, value: string) => void
  pcHint: string
  mobileHint: string
}) {
  return (
    <div className="admin-form-grid">
      <AdminMediaUpload
        quiet
        layout="slot"
        slotTitle="PC용 이미지"
        slotRatio="quiet-tall"
        label="PC용 이미지"
        hint={pcHint}
        variant="image"
        value={text(`${prefix}.sectionImage`) || null}
        onChange={(url) => setField(`${prefix}.sectionImage`, url ?? '')}
      />
      <AdminMediaUpload
        quiet
        layout="slot"
        slotTitle="모바일용 이미지 (선택)"
        slotRatio="quiet-tall"
        label="모바일용 이미지"
        hint={mobileHint}
        variant="image"
        value={text(`${prefix}.sectionImageMobile`) || null}
        onChange={(url) => setField(`${prefix}.sectionImageMobile`, url ?? '')}
      />
      <label className="admin-field admin-field--full">
        <span className="admin-field__label">대체 텍스트 (선택 · 이미지 속 글자를 그대로 입력 · 검색·접근성용)</span>
        <textarea className="admin-input" rows={2} value={text(`${prefix}.sectionAlt`)} onChange={(e) => setField(`${prefix}.sectionAlt`, e.target.value)} />
      </label>
    </div>
  )
}

function heroNote(url: string): string {
  if (!url) return '사진을 올리면 카야 메뉴가 이 사진을 함께 씁니다.'
  const file = decodeURIComponent(url.split('?')[0].split('/').pop() || '')
  const name = file.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ').trim()
  if (/[가-힣]/.test(name)) return `현재: ${name}`
  return '현재 사진이 지정되어 있습니다.'
}

function IntroForm({
  text,
  setField,
  doc,
  setDoc,
  heroImage,
  onHeroImage,
}: {
  text: (key: string) => string
  setField: (key: string, value: string) => void
  doc: KayaPagesDocument
  setDoc: (next: KayaPagesDocument) => void
  heroImage: string
  onHeroImage: (url: string) => void
}) {
  const headline = text('intro.headline')
  const identityTitle = text('identity.title')
  const setHeadline = (plain: string, word: string) => setField('intro.headline', htmlFromPlain(plain, word, 'kaya-wine'))
  const setIdentityTitle = (plain: string, word: string) => setField('identity.title', htmlFromPlain(plain, word, 'kaya-wine'))
  const chips = Array.from({ length: CHIP_COUNT }, (_, index) => text(`intro.chip.${index}`))
  const visibleChips = chips.reduce((count, value, index) => (value.trim() ? index + 1 : count), 0)
  const writeChips = (next: string[]) => {
    const fields = { ...doc.fields }
    for (let index = 0; index < CHIP_COUNT; index += 1) fields[`intro.chip.${index}`] = next[index] ?? ''
    setDoc({ ...doc, fields })
  }
  const photoSide = text('intro.photoSide') || 'right'
  const photoLabel = photoSide === 'left' ? '왼쪽 사진 교체 (선택)' : '오른쪽 사진 교체 (선택)'
  const idFilled = Array.from({ length: ID_COUNT }, (_, index) =>
    Boolean(text(`intro.id.${index}.name`).trim() || text(idPointKey(index)).trim() || text(idBodyKey(index)).trim()),
  )
  const lastFilled = idFilled.lastIndexOf(true)
  const shownIds = Math.max(3, lastFilled + 1)
  const order = kayaSectionOrder(doc.fields['kaya.sectionOrder'])
  const modeOf = (id: KayaSectionId): 'text' | 'image' => {
    const stored = doc.fields[`${id}.mode`]
    if (stored === 'image' || stored === 'text') return stored
    return id === 'ci' ? 'image' : 'text'
  }
  const shown = (id: KayaSectionId) => doc.fields[`${id}.on`] !== '0'
  const move = (id: KayaSectionId, dir: -1 | 1) => {
    const next = order.slice()
    const index = next.indexOf(id)
    const target = index + dir
    if (index < 0 || target < 0 || target >= next.length) return
    const [row] = next.splice(index, 1)
    next.splice(target, 0, row)
    setField('kaya.sectionOrder', next.join(','))
  }
  const head = (id: KayaSectionId, title: string, note?: string) => (
    <BizHead title={title} note={note} enabled={shown(id)} onToggle={() => setField(`${id}.on`, shown(id) ? '0' : '1')} onUp={() => move(id, -1)} onDown={() => move(id, 1)}>
      <EditMode value={modeOf(id)} onChange={(mode) => setField(`${id}.mode`, mode)} />
    </BizHead>
  )
  const panels: Record<KayaSectionId, ReactNode> = {
    intro: (
      <section className={`admin-panel${modeOf('intro') === 'image' ? ' is-image' : ''}`}>
        {head('intro', bizTitle(order.indexOf('intro') + 1, '소개'))}
        {modeOf('intro') === 'image' ? (
          <SectionImageFields prefix="intro" text={text} setField={setField} pcHint="권장 가로 2240px · JPG/PNG · 구역 전체를 이 이미지로 교체" mobileHint="없으면 PC용을 줄여서 표시" />
        ) : (
          <>
            <div className="admin-form-grid">
              <label className="admin-field">
                <span className="admin-field__label">소제목 (영문)</span>
                <input className="admin-input" value={text('intro.kickerEn')} onChange={(e) => setField('intro.kickerEn', e.target.value)} />
              </label>
              <label className="admin-field">
                <span className="admin-field__label">소제목 (국문)</span>
                <input className="admin-input" value={text('intro.kickerKo')} onChange={(e) => setField('intro.kickerKo', e.target.value)} />
              </label>
              <label className="admin-field">
                <span className="admin-field__label">제목 (줄바꿈 가능)</span>
                <textarea className="admin-input" rows={3} value={plainFromHtml(headline)} onChange={(e) => setHeadline(e.target.value, emphasisFromHtml(headline))} />
              </label>
              <label className="admin-field">
                <span className="admin-field__label">강조 단어 (와인색)</span>
                <input className="admin-input" value={emphasisFromHtml(headline)} onChange={(e) => setHeadline(plainFromHtml(headline), e.target.value)} />
              </label>
              <label className="admin-field admin-field--full">
                <span className="admin-field__label">설명</span>
                <textarea className="admin-input" rows={2} value={text('intro.lead')} onChange={(e) => setField('intro.lead', e.target.value)} />
              </label>
            </div>
            <div className="admin-intro-split">
              <div className="admin-field">
                <span className="admin-field__label">칩 (추가·삭제)</span>
                <div className="admin-chips">
                  {chips.slice(0, visibleChips).map((value, index) => (
                    <span key={index} className="admin-chip">
                      <input aria-label={`칩 ${index + 1}`} value={value} onChange={(e) => setField(`intro.chip.${index}`, e.target.value)} />
                      <button type="button" aria-label="칩 삭제" onClick={() => writeChips(chips.filter((_, chipIndex) => chipIndex !== index))}>
                        ×
                      </button>
                    </span>
                  ))}
                  {visibleChips < CHIP_COUNT ? (
                    <button type="button" className="admin-chip-add" onClick={() => setField(`intro.chip.${visibleChips}`, '새 칩')}>
                      + 칩
                    </button>
                  ) : null}
                </div>
              </div>
              <div>
                <AdminMediaUpload
                  quiet
                  layout="slot"
                  slotTitle={photoLabel}
                  label={photoLabel}
                  hint="사진 없이 저장하면 글이 전체 폭으로 표시"
                  variant="image"
                  value={text('intro.photo') || null}
                  onChange={(url) => setField('intro.photo', url ?? '')}
                />
                <div className="admin-form-grid" style={{ marginTop: 10 }}>
                  <label className="admin-field">
                    <span className="admin-field__label">사진 설명 구분</span>
                    <input className="admin-input" value={text('intro.captionKicker')} onChange={(e) => setField('intro.captionKicker', e.target.value)} />
                  </label>
                  <label className="admin-field">
                    <span className="admin-field__label">사진 설명</span>
                    <input className="admin-input" value={text('intro.caption')} onChange={(e) => setField('intro.caption', e.target.value)} />
                  </label>
                </div>
              </div>
            </div>
            <div className="biz-opt">
              <span>배경</span>
              <div className="admin-segmented admin-segmented--tight" role="group" aria-label="배경">
                {([['white', '흰색'], ['gray', '연회색']] as const).map(([value, label]) => (
                  <button key={value} type="button" className={`admin-segmented__btn${(text('intro.bg') || 'white') === value ? ' admin-segmented__btn--active' : ''}`} onClick={() => setField('intro.bg', value)}>{label}</button>
                ))}
              </div>
              <span>정렬</span>
              <div className="admin-segmented admin-segmented--tight" role="group" aria-label="정렬">
                {([['left', '왼쪽'], ['center', '가운데']] as const).map(([value, label]) => (
                  <button key={value} type="button" className={`admin-segmented__btn${(text('intro.align') || 'left') === value ? ' admin-segmented__btn--active' : ''}`} onClick={() => setField('intro.align', value)}>{label}</button>
                ))}
              </div>
              <span>사진 위치</span>
              <div className="admin-segmented admin-segmented--tight" role="group" aria-label="사진 위치">
                {([['right', '오른쪽'], ['left', '왼쪽'], ['none', '없음']] as const).map(([value, label]) => (
                  <button key={value} type="button" className={`admin-segmented__btn${photoSide === value ? ' admin-segmented__btn--active' : ''}`} onClick={() => setField('intro.photoSide', value)}>{label}</button>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    ),
    identity: (
      <section className={`admin-panel${modeOf('identity') === 'image' ? ' is-image' : ''}`}>
        {head('identity', bizTitle(order.indexOf('identity') + 1, '정의·비전·미션'))}
        {modeOf('identity') === 'image' ? (
          <SectionImageFields prefix="identity" text={text} setField={setField} pcHint="권장 가로 2240px · JPG/PNG · 구역 전체를 이 이미지로 교체" mobileHint="없으면 PC용을 줄여서 표시" />
        ) : (
          <>
            <div className="admin-form-grid">
              <label className="admin-field">
                <span className="admin-field__label">소제목 (영문)</span>
                <input className="admin-input" value={text('identity.kickerEn')} onChange={(e) => setField('identity.kickerEn', e.target.value)} />
              </label>
              <label className="admin-field">
                <span className="admin-field__label">소제목 (국문)</span>
                <input className="admin-input" value={text('identity.kickerKo')} onChange={(e) => setField('identity.kickerKo', e.target.value)} />
              </label>
              <label className="admin-field">
                <span className="admin-field__label">제목</span>
                <input className="admin-input" value={plainFromHtml(identityTitle)} onChange={(e) => setIdentityTitle(e.target.value, emphasisFromHtml(identityTitle))} />
              </label>
              <label className="admin-field">
                <span className="admin-field__label">강조 단어 (와인색)</span>
                <input className="admin-input" value={emphasisFromHtml(identityTitle)} onChange={(e) => setIdentityTitle(plainFromHtml(identityTitle), e.target.value)} />
              </label>
            </div>
            <div className="biz-bars">
              {Array.from({ length: shownIds }, (_, index) => (
                <div key={index} className="admin-item">
                  <span className="biz-grip" aria-hidden="true">⋮⋮</span>
                  <div className="admin-form-grid">
                    <label className="admin-field">
                      <span className="admin-field__label">항목명</span>
                      <input className="admin-input" value={text(`intro.id.${index}.name`)} onChange={(e) => setField(`intro.id.${index}.name`, e.target.value)} />
                    </label>
                    <label className="admin-field">
                      <span className="admin-field__label">강조 문장</span>
                      <input className="admin-input" value={text(idPointKey(index))} placeholder="(선택)" onChange={(e) => setField(idPointKey(index), e.target.value)} />
                    </label>
                    <label className="admin-field admin-field--full">
                      <span className="admin-field__label">설명</span>
                      <textarea className="admin-input" rows={2} value={text(idBodyKey(index))} onChange={(e) => setField(idBodyKey(index), e.target.value)} />
                    </label>
                  </div>
                  {index >= 3 ? (
                    <button
                      type="button"
                      className="biz-x"
                      aria-label="항목 삭제"
                      onClick={() => {
                        const fields = { ...doc.fields }
                        for (let cursor = index; cursor < ID_COUNT - 1; cursor += 1) {
                          fields[`intro.id.${cursor}.name`] = fields[`intro.id.${cursor + 1}.name`] ?? ''
                          fields[`intro.id.${cursor}.point`] = fields[`intro.id.${cursor + 1}.point`] ?? ''
                          fields[`intro.id.${cursor}.body`] = fields[`intro.id.${cursor + 1}.body`] ?? ''
                        }
                        fields[`intro.id.${ID_COUNT - 1}.name`] = ''
                        fields[`intro.id.${ID_COUNT - 1}.point`] = ''
                        fields[`intro.id.${ID_COUNT - 1}.body`] = ''
                        setDoc({ ...doc, fields })
                      }}
                    >
                      ×
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
            {shownIds < ID_COUNT ? (
              <button type="button" className="biz-add" onClick={() => setField(`intro.id.${shownIds}.name`, '새 항목')}>+ 항목 추가</button>
            ) : null}
          </>
        )}
      </section>
    ),
    values: (
      <section className={`admin-panel${modeOf('values') === 'image' ? ' is-image' : ''}`}>
        {head('values', bizTitle(order.indexOf('values') + 1, '핵심가치'), modeOf('values') === 'image' ? '이미지 방식 예시' : undefined)}
        {modeOf('values') === 'image' ? (
          <>
            <SectionImageFields prefix="values" text={text} setField={setField} pcHint="권장 가로 2240px · JPG/PNG · 구역 전체를 이 이미지로 교체" mobileHint="권장 가로 750px · 없으면 PC용을 줄여서 표시" />
            <p className="admin-panel__foot">텍스트 방식으로 바꾸면 가치 5개의 이름을 직접 입력하는 칸이 나타납니다. 원형 배치는 고정입니다.</p>
          </>
        ) : (
          <>
            <p className="admin-panel__foot">가치 5개의 이름만 표시합니다. 원형 배치는 고정입니다.</p>
            {[0, 1, 2, 3, 4].map((index) => (
              <div key={index} className="admin-item">
                <b style={{ flex: '0 0 24px' }}>{index + 1}</b>
                <label className="admin-field" style={{ flex: '1 1 160px' }}>
                  <span className="admin-field__label">가치명</span>
                  <input className="admin-input" value={text(`intro.value.${index}.title`)} onChange={(e) => setField(`intro.value.${index}.title`, e.target.value)} />
                </label>
              </div>
            ))}
          </>
        )}
      </section>
    ),
    ci: (
      <section className={`admin-panel${modeOf('ci') === 'image' ? ' is-image' : ''}`}>
        {head('ci', bizTitle(order.indexOf('ci') + 1, 'CI'), modeOf('ci') === 'image' ? '기본: 이미지 방식' : undefined)}
        {modeOf('ci') === 'image' ? (
          <>
            <SectionImageFields prefix="ci" text={text} setField={setField} pcHint="CI 로고·의미 설명을 한 장으로 디자인한 이미지 · 구역 전체를 이 이미지로 교체" mobileHint="권장 가로 750px · 없으면 PC용을 줄여서 표시" />
            <p className="admin-panel__foot">CI는 로고와 설명이 한 덩어리라 이미지 방식을 기본으로 둡니다. 텍스트 방식으로 바꾸면 CI 로고와 대체 텍스트를 직접 입력합니다.</p>
          </>
        ) : (
          <>
            <p className="admin-panel__foot">로고와 설명을 한 장으로 올린 이미지를 씁니다.</p>
            <AdminMediaUpload layout="slot" slotTitle="CI 이미지" slotRatio="2.2 : 1" label="CI 이미지" variant="image" value={text('ci.image') || null} onChange={(url) => setField('ci.image', url ?? '')} />
            <label className="admin-field" style={{ marginTop: 12 }}>
              <span className="admin-field__label">대체 텍스트</span>
              <textarea className="admin-input" rows={2} value={text('ci.imageAlt')} onChange={(e) => setField('ci.imageAlt', e.target.value)} />
            </label>
          </>
        )}
      </section>
    ),
  }
  return (
    <div className="kaya-ci-admin">
      <p className="admin-banner">
        섹션마다 <b>수정 방식</b>을 고를 수 있습니다. <b>텍스트</b>는 글자를 직접 입력하고, <b>이미지</b>는 PC·모바일용으로 올려 그 구역을 통째로 바꿉니다. 비어 있는 칸은 화면에서 빠지고, 사진이 없으면 글이 넓게 펼쳐집니다.
      </p>
      <section className="admin-panel">
        <BizHead title="① 상단 사진" enabled={doc.fields['intro.heroOn'] !== '0'} onToggle={() => setField('intro.heroOn', doc.fields['intro.heroOn'] === '0' ? '1' : '0')} />
        <div className="kaya-hero-grid">
          <AdminMediaUpload
            quiet
            layout="slot"
            slotTitle="사진 올리기 (권장 1920×640)"
            label="상단 사진"
            hint={heroNote(heroImage)}
            variant="image"
            value={heroImage || null}
            onChange={(url) => onHeroImage(url ?? '')}
          />
          <div className="kaya-hero-fields">
            <label className="admin-field">
              <span className="admin-field__label">영문 라벨</span>
              <input className="admin-input" value={doc.fields['intro.heroLabel'] ?? 'ABOUT KHAYAH'} onChange={(e) => setField('intro.heroLabel', e.target.value)} />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">페이지 제목</span>
              <input className="admin-input" value={doc.fields['intro.heroTitle'] ?? '카야 소개·CI'} onChange={(e) => setField('intro.heroTitle', e.target.value)} />
            </label>
          </div>
        </div>
      </section>
      {order.map((id) => (
        <Fragment key={id}>{panels[id]}</Fragment>
      ))}
    </div>
  )
}


function GreetForm({
  text,
  setField,
  setDoc,
  doc,
  heroImage,
  onHeroImage,
}: {
  text: (key: string) => string
  setField: (key: string, value: string) => void
  setDoc: (next: KayaPagesDocument) => void
  doc: KayaPagesDocument
  heroImage: string
  onHeroImage: (url: string) => void
}) {
  const title = text('greet.title')
  const lead = text('greet.lead')
  const setTitle = (plain: string, word: string) => setField('greet.title', htmlFromPlain(plain, word, 'gm-wine'))
  const setLead = (plain: string, word: string) => setField('greet.lead', htmlFromPlain(plain, word, 'gm-wine'))
  const moveBody = (from: number, to: number) => {
    if (from === to) return
    const keys = [0, 1, 2, 3, 4, 5].map((index) => `greet.body.${index}`)
    const values = keys.map((key) => doc.fields[key] ?? '')
    const [item] = values.splice(from, 1)
    values.splice(to, 0, item)
    setDoc({ ...doc, fields: { ...doc.fields, ...Object.fromEntries(keys.map((key, index) => [key, values[index]])) } })
  }
  const moving = greetSectionOrder(doc.fields['greet.sectionOrder'])
  const shown = (id: string) => doc.fields[`greet.${id}On`] !== '0'
  const toggle = (id: string) => setField(`greet.${id}On`, shown(id) ? '0' : '1')
  const moveSection = (id: GreetMovingId, dir: -1 | 1) => {
    const next = moving.slice()
    const index = next.indexOf(id)
    const target = index + dir
    if (index < 0 || target < 0 || target >= next.length) return
    const [row] = next.splice(index, 1)
    next.splice(target, 0, row)
    setField('greet.sectionOrder', next.join(','))
  }
  const movingPanels: Record<GreetMovingId, ReactNode> = {
    quote: (
      <section className="admin-panel">
        <BizHead title={bizTitle(moving.indexOf('quote') + 2, '인용문')} enabled={shown('quote')} onToggle={() => toggle('quote')} onUp={() => moveSection('quote', -1)} onDown={() => moveSection('quote', 1)} />
        {shown('quote') ? <>
        <label className="admin-field">
          <span className="admin-field__label">인용 문구</span>
          <textarea className="admin-input" rows={4} value={plainFromHtml(lead)} onChange={(e) => setLead(e.target.value, emphasisFromHtml(lead))} />
        </label>
        <label className="admin-field" style={{ marginTop: 12 }}>
          <span className="admin-field__label">강조 문장 (와인색)</span>
          <input className="admin-input" value={emphasisFromHtml(lead)} onChange={(e) => setLead(plainFromHtml(lead), e.target.value)} />
        </label>
        </> : null}
      </section>
    ),
    body: (
      <section className="admin-panel">
        <BizHead title={bizTitle(moving.indexOf('body') + 2, '본문')} enabled={shown('body')} onToggle={() => toggle('body')} onUp={() => moveSection('body', -1)} onDown={() => moveSection('body', 1)} />
        {shown('body') ? (
          <>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <BodyRow key={index} index={index} value={text(`greet.body.${index}`)} onChange={(value) => setField(`greet.body.${index}`, value)} onDrop={(from) => moveBody(from, index)} />
            ))}
            <div className="admin-field" style={{ marginTop: 14 }}>
              <span className="admin-field__label">서명 방식</span>
              <div className="admin-segmented" role="group" aria-label="서명 방식">
                {(
                  [
                    ['name', '이름'],
                    ['image', '서명 이미지'],
                    ['both', '이름 + 이미지'],
                  ] as const
                ).map(([mode, label]) => (
                  <button
                    key={mode}
                    type="button"
                    className={`admin-segmented__btn${(text('greet.signMode') || 'name') === mode ? ' admin-segmented__btn--active' : ''}`}
                    onClick={() => setField('greet.signMode', mode)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="admin-form-grid" style={{ marginTop: 14 }}>
              <label className="admin-field">
                <span className="admin-field__label">서명 직함</span>
                <input className="admin-input" value={text('greet.signRole')} onChange={(e) => setField('greet.signRole', e.target.value)} />
              </label>
              {(text('greet.signMode') || 'name') !== 'image' ? (
                <label className="admin-field">
                  <span className="admin-field__label">서명 이름</span>
                  <input className="admin-input" value={text('greet.signName')} onChange={(e) => setField('greet.signName', e.target.value)} />
                </label>
              ) : null}
            </div>
            {(text('greet.signMode') || 'name') !== 'name' ? (
              <div style={{ marginTop: 14 }}>
                <AdminMediaUpload layout="slot" slotTitle="서명 이미지" slotRatio="logo" label="서명 이미지" variant="image" value={text('greet.signImage') || null} onChange={(url) => setField('greet.signImage', url ?? '')} />
              </div>
            ) : null}
          </>
        ) : null}
      </section>
    ),
  }
  return (
    <>
      <section className="admin-panel">
        <BizHead title="① 상단 사진" enabled={shown('hero')} onToggle={() => toggle('hero')} />
        <HeroUpload heroImage={heroImage} onHeroImage={onHeroImage} />
      </section>
      <section className="admin-panel">
        <BizHead title="② 대표 소개" enabled={shown('profile')} onToggle={() => toggle('profile')} />
        {shown('profile') ? <div className="admin-item">
          <AdminMediaUpload layout="slot" slotTitle="대표 사진" slotRatio="4 : 5" label="대표 사진" variant="image" value={text('greet.photo') || null} onChange={(url) => setField('greet.photo', url ?? '')} />
          <div className="admin-form-grid" style={{ flex: '1 1 320px' }}>
            <label className="admin-field admin-field--full">
              <span className="admin-field__label">제목</span>
              <input className="admin-input" value={plainFromHtml(title)} onChange={(e) => setTitle(e.target.value, emphasisFromHtml(title))} />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">강조 단어</span>
              <input className="admin-input" value={emphasisFromHtml(title)} onChange={(e) => setTitle(plainFromHtml(title), e.target.value)} />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">부제</span>
              <input className="admin-input" value={text('greet.sub')} onChange={(e) => setField('greet.sub', e.target.value)} />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">직함</span>
              <input className="admin-input" value={text('greet.role')} onChange={(e) => setField('greet.role', e.target.value)} />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">이름</span>
              <input className="admin-input" value={text('greet.name')} onChange={(e) => setField('greet.name', e.target.value)} />
            </label>
            <label className="admin-field admin-field--full">
              <span className="admin-field__label">사진 대체 텍스트</span>
              <input className="admin-input" value={text('greet.photoAlt')} onChange={(e) => setField('greet.photoAlt', e.target.value)} />
            </label>
          </div>
        </div> : null}
      </section>
      {moving.map((id) => movingPanels[id])}
      <section className="admin-panel">
        <BizHead title={bizTitle(4, '마지막 인용 띠')} enabled={shown('close')} onToggle={() => toggle('close')} />
        <label className="admin-field">
          <span className="admin-field__label">인용 문구 (줄바꿈 가능)</span>
          <textarea className="admin-input" rows={3} value={text('greet.quote')} onChange={(e) => setField('greet.quote', e.target.value)} />
        </label>
        <label className="admin-field" style={{ marginTop: 12 }}>
          <span className="admin-field__label">이름</span>
          <input className="admin-input" value={text('greet.sigNameKo')} onChange={(e) => setField('greet.sigNameKo', e.target.value)} />
        </label>
      </section>
    </>
  )
}

function BodyRow({
  index,
  value,
  onChange,
  onDrop,
}: {
  index: number
  value: string
  onChange: (next: string) => void
  onDrop: (from: number) => void
}) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [caret, setCaret] = useState<{ start: number; end: number } | null>(null)
  const syncCaret = () => {
    const el = ref.current
    if (!el || document.activeElement !== el) return
    setCaret({ start: el.selectionStart, end: el.selectionEnd })
  }
  useEffect(() => {
    const sync = () => syncCaret()
    document.addEventListener('selectionchange', sync)
    return () => document.removeEventListener('selectionchange', sync)
  }, [])
  return (
    <div
      className="admin-item"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const from = Number(e.dataTransfer.getData('text/plain'))
        if (Number.isInteger(from)) onDrop(from)
      }}
    >
      <span
        className="admin-org__grip"
        draggable
        aria-label="순서 변경"
        onDragStart={(e) => e.dataTransfer.setData('text/plain', String(index))}
      >
        ⋮⋮
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="admin-field__label">문단 {index + 1}</p>
        <div className="admin-form-actions" style={{ marginBottom: 8 }}>
          {BODY_MARKS.map((mark) => {
            const on =
              peelOuter(value, mark.open, mark.close) != null ||
              (caret != null && markCovers(value, caret.start, caret.end, mark.open, mark.close))
            return (
              <button
                key={mark.label}
                type="button"
                className={`admin-btn admin-btn--sm${on ? ' is-on' : ''}`}
                aria-pressed={on}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => wrapSelection(ref.current, value, mark.open, mark.close, onChange, (start, end) => setCaret({ start, end }))}
              >
                {mark.label}
              </button>
            )
          })}
        </div>
        <textarea
          ref={ref}
          className="admin-input"
          rows={3}
          aria-label={`문단 ${index + 1}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onSelect={syncCaret}
          onKeyUp={syncCaret}
          onMouseUp={syncCaret}
          onFocus={syncCaret}
          onBlur={(e) => {
            const next = e.relatedTarget
            if (next instanceof HTMLElement && next.closest('.admin-form-actions')) return
            setCaret(null)
          }}
        />
      </div>
    </div>
  )
}

function TransForm({
  text,
  setField,
  doc,
  setDoc,
  heroImage,
  onHeroImage,
  finance,
  setFinance,
}: {
  text: (key: string) => string
  setField: (key: string, value: string) => void
  doc: KayaPagesDocument
  setDoc: (next: KayaPagesDocument) => void
  heroImage: string
  onHeroImage: (url: string) => void
  finance: FinancialReportsDocument | null
  setFinance: (next: FinancialReportsDocument) => void
}) {
  const setFields = (patch: Record<string, string>) => {
    setDoc({ ...doc, fields: { ...doc.fields, ...patch } })
  }
  const actions = disclosureItems(doc.fields)
  const principles = principleItems(doc.fields)
  const compliance = complianceItems(doc.fields)
  const moveList = <T,>(rows: T[], from: number, to: number): T[] | null => {
    if (!Number.isInteger(from) || from === to || from < 0 || from >= rows.length || to < 0 || to >= rows.length) return null
    const next = [...rows]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    return next
  }
  const years = (finance?.reports ?? []).map((row) => row.year)
  const slotFiles = (slot: 'publicInterest' | 'donation'): DisclosureFile[] =>
    (finance?.reports ?? [])
      .flatMap((row) => {
        const url = slot === 'publicInterest' ? row.publicInterestDisclosurePdfUrl : row.donationDisclosurePdfUrl
        return url ? [{ year: row.year, url }] : []
      })
      .sort((a, b) => b.year - a.year)
  const setSlotPdf = (slot: 'publicInterest' | 'donation', year: number, url: string | null) => {
    if (!finance) return
    const key = slot === 'publicInterest' ? 'publicInterestDisclosurePdfUrl' : 'donationDisclosurePdfUrl'
    setFinance({
      ...finance,
      reports: finance.reports.map((row) => (row.year === year ? { ...row, [key]: url } : row)),
    })
  }
  const moving = transSectionOrder(doc.fields['trans.sectionOrder'])
  const shown = (id: string) => doc.fields[`trans.${id}On`] !== '0'
  const toggle = (id: string) => setField(`trans.${id}On`, shown(id) ? '0' : '1')
  const move = (id: TransMovingId, dir: -1 | 1) => {
    const next = moving.slice()
    const index = next.indexOf(id)
    const target = index + dir
    if (index < 0 || target < 0 || target >= next.length) return
    const [row] = next.splice(index, 1)
    next.splice(target, 0, row)
    setField('trans.sectionOrder', next.join(','))
  }
  const movingHead = (id: TransMovingId, title: string) => (
    <BizHead title={bizTitle(moving.indexOf(id) + 1, title)} enabled={shown(id)} onToggle={() => toggle(id)} onUp={() => move(id, -1)} onDown={() => move(id, 1)} />
  )
  return (
    <div className="biz-stack">
      <section className="admin-panel" style={{ order: 0 }}>
        <BizHead title="① 상단 사진 · 소개" enabled={shown('hero')} onToggle={() => toggle('hero')} />
        {shown('hero') ? <>
        <HeroUpload heroImage={heroImage} onHeroImage={onHeroImage} />
        <div className="admin-form-grid">
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">소개 제목</span>
            <input className="admin-input" value={text('trans.introTitle')} onChange={(e) => setField('trans.introTitle', e.target.value)} />
          </label>
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">소개 설명</span>
            <textarea className="admin-input" rows={3} value={text('trans.introBody')} onChange={(e) => setField('trans.introBody', e.target.value)} />
          </label>
          {[0, 1, 2].map((index) => (
            <label key={index} className="admin-field">
              <span className="admin-field__label">칩 {index + 1}</span>
              <input className="admin-input" value={text(`trans.chip.${index}`)} onChange={(e) => setField(`trans.chip.${index}`, e.target.value)} />
            </label>
          ))}
        </div>
        </> : null}
      </section>
      <section className="admin-panel" style={{ order: moving.indexOf('disclose') + 1 }}>
        {movingHead('disclose', '공시 자료')}
        {shown('disclose') ? <>
        {actions.map((item, index) => {
          const pdfKind = pdfKindOf(item)
          const files = pdfKind === 'files' ? item.files : slotFiles(pdfKind)
          return (
            <div
              key={item.id}
              className="admin-item trans-item"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const [kind, raw] = e.dataTransfer.getData('text/plain').split(':')
                if (kind !== 'action') return
                const next = moveList(actions, Number(raw), index)
                if (next) setFields(disclosurePatch(next))
              }}
            >
              <span className="biz-grip" draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', `action:${index}`)}>⋮⋮</span>
              <div className="trans-row">
                <div>
                  <label className="admin-field">
                    <span className="admin-field__label">항목명</span>
                    <input
                      className="admin-input"
                      value={item.label}
                      onChange={(e) => {
                        const next = actions.map((row, rowIndex) => (rowIndex === index ? { ...row, label: e.target.value } : row))
                        setFields(disclosurePatch(next))
                      }}
                    />
                  </label>
                  <div className="trans-kind" role="group" aria-label="이 항목을 여는 방식">
                    <button
                      type="button"
                      className={item.kind === 'link' ? undefined : 'is-on'}
                      onClick={() => {
                        if (item.kind !== 'link') return
                        const next = actions.map((row, rowIndex) => (rowIndex === index ? { ...row, kind: pdfKind } : row))
                        setFields(disclosurePatch(next))
                      }}
                    >
                      연도별 PDF
                    </button>
                    <button
                      type="button"
                      className={item.kind === 'link' ? 'is-on' : undefined}
                      onClick={() => {
                        if (item.kind === 'link') return
                        const next = actions.map((row, rowIndex) => (rowIndex === index ? { ...row, kind: 'link' as const } : row))
                        setFields(disclosurePatch(next))
                      }}
                    >
                      공통 주소
                    </button>
                  </div>
                </div>
                {item.kind === 'link' ? (
                  <label className="admin-field">
                    <span className="admin-field__label">공통 주소</span>
                    <input
                      className="admin-input"
                      value={item.href}
                      placeholder="https://"
                      onChange={(e) => {
                        const next = actions.map((row, rowIndex) => (rowIndex === index ? { ...row, href: e.target.value } : row))
                        setFields(disclosurePatch(next))
                      }}
                    />
                  </label>
                ) : (
                  <YearPdfField
                    years={years}
                    files={files}
                    onSet={(year, url) => {
                      if (pdfKind === 'files') {
                        const nextFiles = url
                          ? [...item.files.filter((file) => file.year !== year), { year, url }].sort((a, b) => b.year - a.year)
                          : item.files.filter((file) => file.year !== year)
                        const next = actions.map((row, rowIndex) => (rowIndex === index ? { ...row, files: nextFiles } : row))
                        setFields(disclosurePatch(next))
                        return
                      }
                      setSlotPdf(pdfKind, year, url)
                    }}
                  />
                )}
              </div>
              <button
                type="button"
                className="biz-x"
                aria-label="자료 삭제"
                onClick={() => setFields(disclosurePatch(actions.filter((_, rowIndex) => rowIndex !== index)))}
              >
                ×
              </button>
            </div>
          )
        })}
        <div className="trans-add">
          <button
            type="button"
            className="biz-add"
            disabled={actions.length >= 8}
            onClick={() => setFields(disclosurePatch([...actions, newDisclosureItem()]))}
          >
            + 자료 추가
          </button>
          <p>연도별 PDF는 공개 화면에서 고른 해의 파일이 열립니다. 공통 주소는 모든 해에 같은 주소로 연결됩니다.</p>
        </div>
        <p className="admin-panel__foot">10MB보다 큰 PDF는 대용량 저장소에 저장됩니다. 저장을 눌러야 공개 화면에 반영됩니다.</p>
        </> : null}
      </section>
      <section className="admin-panel" style={{ order: moving.indexOf('principles') + 1 }}>
        {movingHead('principles', '투명경영 원칙')}
        {shown('principles') ? <>
        <label className="admin-field">
          <span className="admin-field__label">섹션 제목</span>
          <input className="admin-input" value={text('trans.principlesTitle')} onChange={(e) => setField('trans.principlesTitle', e.target.value)} />
        </label>
        {principles.map((item, index) => (
          <div
            key={`principle-${index}`}
            className="admin-item trans-item"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const [kind, raw] = e.dataTransfer.getData('text/plain').split(':')
              if (kind !== 'principle') return
              const next = moveList(principles, Number(raw), index)
              if (next) setFields(principlePatch(next))
            }}
          >
            <span className="biz-grip" draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', `principle:${index}`)}>⋮⋮</span>
            <label className="admin-field" style={{ flex: '1 1 160px' }}>
              <span className="admin-field__label">{String(index + 1).padStart(2, '0')} 제목</span>
              <input
                className="admin-input"
                value={item.title}
                onChange={(e) => {
                  const next = principles.map((row, rowIndex) => (rowIndex === index ? { ...row, title: e.target.value } : row))
                  setFields(principlePatch(next))
                }}
              />
            </label>
            <label className="admin-field" style={{ flex: '2 1 240px' }}>
              <span className="admin-field__label">설명</span>
              <textarea
                className="admin-input"
                rows={2}
                value={item.body}
                onChange={(e) => {
                  const next = principles.map((row, rowIndex) => (rowIndex === index ? { ...row, body: e.target.value } : row))
                  setFields(principlePatch(next))
                }}
              />
            </label>
            <button
              type="button"
              className="biz-x"
              aria-label="원칙 삭제"
              onClick={() => setFields(principlePatch(principles.filter((_, rowIndex) => rowIndex !== index)))}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className="biz-add"
          disabled={principles.length >= 8}
          onClick={() => setFields(principlePatch([...principles, { title: '', body: '' }]))}
        >
          + 원칙 추가
        </button>
        </> : null}
      </section>
      <section className="admin-panel" style={{ order: moving.indexOf('compliance') + 1 }}>
        {movingHead('compliance', '공시·준수 현황')}
        {shown('compliance') ? <>
        <label className="admin-field" style={{ marginBottom: 12 }}>
          <span className="admin-field__label">제목</span>
          <input className="admin-input" value={text('trans.complianceTitle')} onChange={(e) => setField('trans.complianceTitle', e.target.value)} />
        </label>
        <table className="admin-sheet">
          <thead>
            <tr><th aria-label="순서" /><th>항목</th><th>내용</th><th>관리</th></tr>
          </thead>
          <tbody>
            {compliance.map((item, index) => (
              <tr
                key={`compliance-${index}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const [kind, raw] = e.dataTransfer.getData('text/plain').split(':')
                  if (kind !== 'compliance') return
                  const next = moveList(compliance, Number(raw), index)
                  if (next) setFields(compliancePatch(next))
                }}
              >
                <td>
                  <span className="admin-org__grip" draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', `compliance:${index}`)}>⋮⋮</span>
                </td>
                <td>
                  <input
                    className="admin-input"
                    aria-label="항목"
                    value={item.dt}
                    onChange={(e) => {
                      const next = compliance.map((row, rowIndex) => (rowIndex === index ? { ...row, dt: e.target.value } : row))
                      setFields(compliancePatch(next))
                    }}
                  />
                </td>
                <td>
                  <input
                    className="admin-input"
                    aria-label="내용"
                    value={item.dd}
                    onChange={(e) => {
                      const next = compliance.map((row, rowIndex) => (rowIndex === index ? { ...row, dd: e.target.value } : row))
                      setFields(compliancePatch(next))
                    }}
                  />
                </td>
                <td>
                  <button type="button" className="biz-del" onClick={() => setFields(compliancePatch(compliance.filter((_, rowIndex) => rowIndex !== index)))}>
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          className="biz-add"
          disabled={compliance.length >= 12}
          onClick={() => setFields(compliancePatch([...compliance, { dt: '', dd: '' }]))}
        >
          + 항목 추가
        </button>
        </> : null}
      </section>
      <section className="admin-panel" style={{ order: moving.indexOf('reports') + 1 }}>
        {movingHead('reports', '연도별 재무보고')}
        {shown('reports') ? <>
        <p className="admin-panel__foot">금액, 비율, 연도 PDF는 재정보고 화면에서 수정합니다.</p>
        <Link className="admin-btn" to="/admin/app/financial-reports">재정보고 열기</Link>
        </> : null}
      </section>
      <section className="admin-panel" style={{ order: 100 }}>
        <BizHead title={bizTitle(moving.length + 1, '하단 배너')} enabled={shown('banner')} onToggle={() => toggle('banner')} />
        {shown('banner') ? <>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span className="admin-field__label">제목</span>
            <input className="admin-input" value={text('trans.supportTitle')} onChange={(e) => setField('trans.supportTitle', e.target.value)} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">설명 (선택)</span>
            <input className="admin-input" value={text('trans.supportBody')} placeholder="비워 두면 숨김" onChange={(e) => setField('trans.supportBody', e.target.value)} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">버튼 문구</span>
            <input className="admin-input" value={text('trans.supportButton')} onChange={(e) => setField('trans.supportButton', e.target.value)} />
          </label>
        </div>
        <p className="admin-panel__foot">버튼은 후원 공통 설정에 있는 해피나눔 후원 신청서로 새 창에서 연결됩니다.</p>
        </> : null}
      </section>
    </div>
  )
}

function YearPdfField({
  years,
  files,
  onSet,
}: {
  years: number[]
  files: DisclosureFile[]
  onSet: (year: number, url: string | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [picked, setPicked] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const sortedYears = [...new Set(years)].sort((a, b) => b - a)
  const active = picked != null && sortedYears.includes(picked) ? picked : sortedYears.find((year) => !files.some((file) => file.year === year)) ?? sortedYears[0]
  const chips = [...files].filter((file) => file.url).sort((a, b) => b.year - a.year)
  return (
    <div className="admin-field">
      <span className="admin-field__label">올린 PDF</span>
      <div className="trans-pdfs">
        {chips.map((file) => (
          <span key={file.year} className="trans-pdf">
            <a href={pdfOpenHref(file.url, `${file.year}.pdf`)} target="_blank" rel="noopener noreferrer">
              {file.year}.pdf
            </a>
            <button type="button" aria-label={`${file.year}년 PDF 삭제`} onClick={() => onSet(file.year, null)}>
              ×
            </button>
          </span>
        ))}
      </div>
      {sortedYears.length ? (
        <div className="trans-pdf-add">
          <label className="admin-field">
            <span className="admin-field__label">올릴 연도</span>
            <select className="admin-input" aria-label="PDF를 올릴 연도" value={active ?? ''} onChange={(e) => setPicked(Number(e.target.value))}>
              {sortedYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                  {chips.some((file) => file.year === year) ? ' · 파일 있음' : ' · 없음'}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="biz-add trans-pdfs__add"
            disabled={busy || active == null}
            onClick={() => {
              if (inputRef.current) inputRef.current.value = ''
              inputRef.current?.click()
            }}
          >
            {busy ? '올리는 중…' : '+ 연도 PDF'}
          </button>
        </div>
      ) : (
        <p className="trans-kind__note">연도를 먼저 재정보고에 추가하면 여기에 PDF를 올릴 수 있습니다.</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (!file || active == null) return
          setBusy(true)
          setError('')
          void uploadDocumentPdf(file)
            .then((result) => onSet(active, result.url))
            .catch((err: unknown) => setError(err instanceof Error ? err.message : '업로드에 실패했습니다.'))
            .finally(() => setBusy(false))
        }}
      />
      {error ? <p className="admin-media-upload__err">{error}</p> : null}
    </div>
  )
}

function LocationForm({ text, setField }: { text: (key: string) => string; setField: (key: string, value: string) => void }) {
  return (
    <>
      <section className="admin-panel">
        <h2 className="admin-panel__title">① 기관 · 오시는 길</h2>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span className="admin-field__label">기관명</span>
            <input className="admin-input" value={text('loc.name')} onChange={(e) => setField('loc.name', e.target.value)} />
          </label>
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">주소</span>
            <input className="admin-input" value={text('loc.address')} onChange={(e) => setField('loc.address', e.target.value)} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">전화</span>
            <input className="admin-input" value={text('loc.phone')} onChange={(e) => setField('loc.phone', e.target.value)} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">팩스</span>
            <input className="admin-input" value={text('loc.fax')} onChange={(e) => setField('loc.fax', e.target.value)} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">이메일</span>
            <input className="admin-input" value={text('loc.email')} onChange={(e) => setField('loc.email', e.target.value)} />
          </label>
        </div>
      </section>
      <section className="admin-panel">
        <h2 className="admin-panel__title">② 후원계좌</h2>
        <label className="admin-field">
          <span className="admin-field__label">예금주</span>
          <input className="admin-input" value={text('loc.holder')} onChange={(e) => setField('loc.holder', e.target.value)} />
        </label>
        {[0, 1, 2, 3].map((index) => (
          <label key={index} className="admin-field" style={{ marginTop: 12 }}>
            <span className="admin-field__label">계좌 {index + 1}</span>
            <input className="admin-input" value={text(`loc.account.${index}`)} onChange={(e) => setField(`loc.account.${index}`, e.target.value)} />
          </label>
        ))}
      </section>
    </>
  )
}
