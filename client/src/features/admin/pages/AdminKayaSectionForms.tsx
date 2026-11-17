import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { AdminMediaUpload } from '../components/AdminMediaUpload'
import type { KayaPagesDocument } from '../../kaya/kayaPagesTypes'

type TabId = 'intro' | 'greet' | 'trans'

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

function wrapSelection(
  el: HTMLTextAreaElement | null,
  value: string,
  open: string,
  close: string,
  onChange: (next: string) => void,
) {
  if (!el) return
  const start = el.selectionStart
  const end = el.selectionEnd
  const selected = value.slice(start, end) || '문구'
  onChange(value.slice(0, start) + open + selected + close + value.slice(end))
}

export function AdminKayaSectionForms({
  tab,
  doc,
  setField,
  setDoc,
  heroImage,
  onHeroImage,
}: {
  tab: TabId
  doc: KayaPagesDocument
  setField: (key: string, value: string) => void
  setDoc: (next: KayaPagesDocument) => void
  heroImage: string
  onHeroImage: (url: string) => void
}) {
  const fields = doc.fields
  const text = (key: string) => fields[key] ?? ''

  if (tab === 'intro') return <IntroForm text={text} setField={setField} heroImage={heroImage} onHeroImage={onHeroImage} />
  if (tab === 'greet') return <GreetForm text={text} setField={setField} setDoc={setDoc} doc={doc} heroImage={heroImage} onHeroImage={onHeroImage} />
  return <TransForm text={text} setField={setField} doc={doc} setDoc={setDoc} heroImage={heroImage} onHeroImage={onHeroImage} />
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

function IntroForm({
  text,
  setField,
  heroImage,
  onHeroImage,
}: {
  text: (key: string) => string
  setField: (key: string, value: string) => void
  heroImage: string
  onHeroImage: (url: string) => void
}) {
  const headline = text('intro.headline')
  const setHeadline = (plain: string, word: string) => setField('intro.headline', htmlFromPlain(plain, word, 'kaya-wine'))
  return (
    <>
      <p className="admin-banner">섹션 글자를 직접 고칩니다. 비어 있는 칩은 화면에서 빠집니다. 핵심가치는 글자 5개, CI는 이미지입니다.</p>
      <section className="admin-panel">
        <h2 className="admin-panel__title">① 상단 사진</h2>
        <HeroUpload heroImage={heroImage} onHeroImage={onHeroImage} />
      </section>
      <section className="admin-panel">
        <h2 className="admin-panel__title">② 소개</h2>
        <div className="admin-form-grid">
          <label className="admin-field admin-field--full">
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
        <p className="admin-field__label" style={{ marginTop: 14 }}>칩</p>
        <div className="admin-form-grid">
          {[0, 1, 2].map((index) => (
            <label key={index} className="admin-field">
              <span className="admin-field__label">칩 {index + 1}</span>
              <input className="admin-input" value={text(`intro.chip.${index}`)} onChange={(e) => setField(`intro.chip.${index}`, e.target.value)} />
            </label>
          ))}
        </div>
        <div className="admin-item">
          <AdminMediaUpload layout="slot" slotTitle="오른쪽 사진" slotRatio="logo" label="오른쪽 사진" variant="image" value={text('intro.photo') || null} onChange={(url) => setField('intro.photo', url ?? '')} />
          <div className="admin-form-grid" style={{ flex: '1 1 280px' }}>
            <label className="admin-field">
              <span className="admin-field__label">사진 설명 구분</span>
              <input className="admin-input" value={text('intro.captionKicker')} onChange={(e) => setField('intro.captionKicker', e.target.value)} />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">사진 설명</span>
              <input className="admin-input" value={text('intro.caption')} onChange={(e) => setField('intro.caption', e.target.value)} />
            </label>
            <label className="admin-field admin-field--full">
              <span className="admin-field__label">대체 텍스트</span>
              <input className="admin-input" value={text('intro.photoAlt')} onChange={(e) => setField('intro.photoAlt', e.target.value)} />
            </label>
          </div>
        </div>
      </section>
      <section className="admin-panel">
        <h2 className="admin-panel__title">③ 정의·비전·미션</h2>
        <div className="admin-item">
          <b style={{ flex: '0 0 48px' }}>정의</b>
          <div className="admin-form-grid" style={{ flex: 1 }}>
            <label className="admin-field admin-field--full">
              <span className="admin-field__label">강조 문장</span>
              <input className="admin-input" value={text('intro.definitionPoint')} onChange={(e) => setField('intro.definitionPoint', e.target.value)} />
            </label>
            <label className="admin-field admin-field--full">
              <span className="admin-field__label">설명</span>
              <textarea className="admin-input" rows={2} value={text('intro.definition')} onChange={(e) => setField('intro.definition', e.target.value)} />
            </label>
          </div>
        </div>
        {([['비전', 'intro.vision'], ['미션', 'intro.mission']] as const).map(([label, key]) => (
          <div key={key} className="admin-item">
            <b style={{ flex: '0 0 48px' }}>{label}</b>
            <label className="admin-field" style={{ flex: 1 }}>
              <span className="admin-field__label">설명</span>
              <textarea className="admin-input" rows={2} value={text(key)} onChange={(e) => setField(key, e.target.value)} />
            </label>
          </div>
        ))}
      </section>
      <section className="admin-panel">
        <h2 className="admin-panel__title">④ 핵심가치</h2>
        <p className="admin-panel__foot">가치 5개의 이름과 설명을 입력합니다. 원형 배치는 고정입니다.</p>
        {[0, 1, 2, 3, 4].map((index) => (
          <div key={index} className="admin-item">
            <b style={{ flex: '0 0 24px' }}>{index + 1}</b>
            <label className="admin-field" style={{ flex: '1 1 160px' }}>
              <span className="admin-field__label">가치명</span>
              <input className="admin-input" value={text(`intro.value.${index}.title`)} onChange={(e) => setField(`intro.value.${index}.title`, e.target.value)} />
            </label>
            <label className="admin-field" style={{ flex: '2 1 240px' }}>
              <span className="admin-field__label">설명</span>
              <textarea className="admin-input" rows={2} value={text(`intro.value.${index}.desc`)} onChange={(e) => setField(`intro.value.${index}.desc`, e.target.value)} />
            </label>
          </div>
        ))}
      </section>
      <section className="admin-panel">
        <h2 className="admin-panel__title">⑤ CI</h2>
        <p className="admin-panel__foot">로고와 설명을 한 장으로 올린 이미지를 씁니다.</p>
        <AdminMediaUpload layout="slot" slotTitle="CI 이미지" slotRatio="2.2 : 1" label="CI 이미지" variant="image" value={text('ci.image') || null} onChange={(url) => setField('ci.image', url ?? '')} />
        <label className="admin-field" style={{ marginTop: 12 }}>
          <span className="admin-field__label">대체 텍스트</span>
          <textarea className="admin-input" rows={2} value={text('ci.imageAlt')} onChange={(e) => setField('ci.imageAlt', e.target.value)} />
        </label>
      </section>
    </>
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
  return (
    <>
      <section className="admin-panel">
        <h2 className="admin-panel__title">① 상단 사진</h2>
        <HeroUpload heroImage={heroImage} onHeroImage={onHeroImage} />
      </section>
      <section className="admin-panel">
        <h2 className="admin-panel__title">② 대표 소개</h2>
        <div className="admin-item">
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
        </div>
      </section>
      <section className="admin-panel">
        <h2 className="admin-panel__title">③ 인용문</h2>
        <label className="admin-field">
          <span className="admin-field__label">인용 문구</span>
          <textarea className="admin-input" rows={4} value={plainFromHtml(lead)} onChange={(e) => setLead(e.target.value, emphasisFromHtml(lead))} />
        </label>
        <label className="admin-field" style={{ marginTop: 12 }}>
          <span className="admin-field__label">강조 문장 (와인색)</span>
          <input className="admin-input" value={emphasisFromHtml(lead)} onChange={(e) => setLead(plainFromHtml(lead), e.target.value)} />
        </label>
      </section>
      <section className="admin-panel">
        <h2 className="admin-panel__title">④ 본문</h2>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <BodyRow key={index} index={index} value={text(`greet.body.${index}`)} onChange={(value) => setField(`greet.body.${index}`, value)} onDrop={(from) => moveBody(from, index)} />
        ))}
        <div className="admin-form-grid" style={{ marginTop: 14 }}>
          <label className="admin-field">
            <span className="admin-field__label">서명 직함</span>
            <input className="admin-input" value={text('greet.signRole')} onChange={(e) => setField('greet.signRole', e.target.value)} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">서명 이름</span>
            <input className="admin-input" value={text('greet.signName')} onChange={(e) => setField('greet.signName', e.target.value)} />
          </label>
        </div>
      </section>
      <section className="admin-panel">
        <h2 className="admin-panel__title">⑤ 마지막 인용 띠</h2>
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
          <button type="button" className="admin-btn admin-btn--sm" onClick={() => wrapSelection(ref.current, value, '<strong>', '</strong>', onChange)}>굵게</button>
          <button type="button" className="admin-btn admin-btn--sm" onClick={() => wrapSelection(ref.current, value, '<span class="gm-mark">', '</span>', onChange)}>밑줄 강조</button>
          <button type="button" className="admin-btn admin-btn--sm" onClick={() => wrapSelection(ref.current, value, '<span class="gm-wine">', '</span>', onChange)}>와인색</button>
        </div>
        <textarea ref={ref} className="admin-input" rows={3} aria-label={`문단 ${index + 1}`} value={value} onChange={(e) => onChange(e.target.value)} />
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
}: {
  text: (key: string) => string
  setField: (key: string, value: string) => void
  doc: KayaPagesDocument
  setDoc: (next: KayaPagesDocument) => void
  heroImage: string
  onHeroImage: (url: string) => void
}) {
  const movePair = (prefix: string, count: number, from: number, to: number, parts: string[]) => {
    if (from === to) return
    const rows = Array.from({ length: count }, (_, index) => parts.map((part) => doc.fields[`${prefix}.${index}.${part}`] ?? ''))
    const [item] = rows.splice(from, 1)
    rows.splice(to, 0, item)
    const next = { ...doc.fields }
    rows.forEach((row, index) => {
      parts.forEach((part, partIndex) => {
        next[`${prefix}.${index}.${part}`] = row[partIndex]
      })
    })
    setDoc({ ...doc, fields: next })
  }
  return (
    <>
      <section className="admin-panel">
        <h2 className="admin-panel__title">① 상단 사진 · 소개</h2>
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
      </section>
      <section className="admin-panel">
        <h2 className="admin-panel__title">② 공시 자료</h2>
        {[0, 1, 2].map((index) => (
          <div key={index} className="admin-item" style={{ alignItems: 'center' }}>
            <label className="admin-field" style={{ flex: 1 }}>
              <span className="admin-field__label">항목명</span>
              <input className="admin-input" value={text(`trans.action.${index}`)} onChange={(e) => setField(`trans.action.${index}`, e.target.value)} />
            </label>
          </div>
        ))}
        <p className="admin-panel__foot">연도별 PDF는 재정보고에서 올립니다.</p>
      </section>
      <section className="admin-panel">
        <h2 className="admin-panel__title">③ 투명경영 원칙</h2>
        <label className="admin-field">
          <span className="admin-field__label">섹션 제목</span>
          <input className="admin-input" value={text('trans.principlesTitle')} onChange={(e) => setField('trans.principlesTitle', e.target.value)} />
        </label>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="admin-item"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const from = Number(e.dataTransfer.getData('text/plain'))
              if (Number.isInteger(from)) movePair('trans.principle', 3, from, index, ['title', 'body'])
            }}
          >
            <span className="admin-org__grip" draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', String(index))}>⋮⋮</span>
            <label className="admin-field" style={{ flex: '1 1 160px' }}>
              <span className="admin-field__label">0{index + 1} 제목</span>
              <input className="admin-input" value={text(`trans.principle.${index}.title`)} onChange={(e) => setField(`trans.principle.${index}.title`, e.target.value)} />
            </label>
            <label className="admin-field" style={{ flex: '2 1 240px' }}>
              <span className="admin-field__label">설명</span>
              <textarea className="admin-input" rows={2} value={text(`trans.principle.${index}.body`)} onChange={(e) => setField(`trans.principle.${index}.body`, e.target.value)} />
            </label>
          </div>
        ))}
      </section>
      <section className="admin-panel">
        <h2 className="admin-panel__title">④ 공시·준수 현황</h2>
        <label className="admin-field" style={{ marginBottom: 12 }}>
          <span className="admin-field__label">제목</span>
          <input className="admin-input" value={text('trans.complianceTitle')} onChange={(e) => setField('trans.complianceTitle', e.target.value)} />
        </label>
        <table className="admin-sheet">
          <thead>
            <tr><th aria-label="순서" /><th>항목</th><th>내용</th></tr>
          </thead>
          <tbody>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <tr
                key={index}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const from = Number(e.dataTransfer.getData('text/plain'))
                  if (Number.isInteger(from)) movePair('trans.compliance', 6, from, index, ['dt', 'dd'])
                }}
              >
                <td>
                  <span className="admin-org__grip" draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', String(index))}>⋮⋮</span>
                </td>
                <td><input className="admin-input" aria-label="항목" value={text(`trans.compliance.${index}.dt`)} onChange={(e) => setField(`trans.compliance.${index}.dt`, e.target.value)} /></td>
                <td><input className="admin-input" aria-label="내용" value={text(`trans.compliance.${index}.dd`)} onChange={(e) => setField(`trans.compliance.${index}.dd`, e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="admin-panel">
        <h2 className="admin-panel__title">⑤ 연도별 재무보고</h2>
        <p className="admin-panel__foot">금액, 비율, 연도 PDF는 재정보고 화면에서 수정합니다.</p>
        <Link className="admin-btn" to="/admin/app/financial-reports">재정보고 열기</Link>
      </section>
      <section className="admin-panel">
        <h2 className="admin-panel__title">⑥ 하단 배너</h2>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span className="admin-field__label">제목</span>
            <input className="admin-input" value={text('trans.supportTitle')} onChange={(e) => setField('trans.supportTitle', e.target.value)} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">버튼 문구</span>
            <input className="admin-input" value={text('trans.supportButton')} onChange={(e) => setField('trans.supportButton', e.target.value)} />
          </label>
        </div>
      </section>
    </>
  )
}
