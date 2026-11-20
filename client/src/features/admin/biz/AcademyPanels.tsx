import { AdminMediaUpload } from '../components/AdminMediaUpload'
import { breaksToHtml, plainFromBreaks, plainTextFromBreaks } from '../../../utils/lineBreaks'

type Values = Record<string, string>
type SetField = (key: string, value: string) => void

function plain(html: string): string {
  return plainTextFromBreaks(html)
}

function emphasis(html: string): string {
  return html.match(/<span[^>]*>([^<]*)<\/span>/)?.[1] ?? ''
}

function htmlTitle(plainText: string, word: string): string {
  return word && plainText.includes(word) ? plainText.replace(word, `<span class="wn">${word}</span>`) : plainText
}

function htmlLines(plainText: string): string {
  return breaksToHtml(plainText)
}

function modeOf(values: Values, key: string): 'text' | 'image' {
  return values[key] === 'image' ? 'image' : 'text'
}

export function AcademyModeSwitch({
  title,
  values,
  setField,
}: {
  title: string
  values: Values
  setField: SetField
}) {
  const name = title.replace(/^[①-⑳]\s*/, '')
  const key = name.startsWith('소개') ? 'aca.intro.mode' : name.includes('Pre-School') ? 'aca.pre.mode' : name.includes('학습지') ? 'aca.book.mode' : ''
  if (!key) return null
  const mode = modeOf(values, key)
  return (
    <>
      <span>수정 방식</span>
      <div className="admin-segmented admin-segmented--tight" role="group" aria-label="수정 방식">
        <button type="button" className={`admin-segmented__btn${mode !== 'image' ? ' admin-segmented__btn--active' : ''}`} onClick={() => setField(key, 'text')}>
          텍스트
        </button>
        <button type="button" className={`admin-segmented__btn${mode === 'image' ? ' admin-segmented__btn--active' : ''}`} onClick={() => setField(key, 'image')}>
          이미지
        </button>
      </div>
    </>
  )
}

function ImageSwap({ label, imageKey, values, setField }: { label: string; imageKey: string; values: Values; setField: SetField }) {
  return (
    <AdminMediaUpload
      layout="slot"
      slotTitle={label}
      slotRatio="2.2 : 1"
      label={label}
      hint="이 구역 전체를 이미지 한 장으로 바꿉니다"
      variant="image"
      value={values[imageKey] || null}
      onChange={(url) => setField(imageKey, url ?? '')}
    />
  )
}

function FactRows({
  pairs,
  values,
  setField,
}: {
  pairs: Array<[string, string]>
  values: Values
  setField: SetField
}) {
  return (
    <div className="biz-bars">
      {pairs.map(([labelKey, valueKey]) => (
        <div key={labelKey} className="admin-item">
          <span className="biz-grip" aria-hidden="true">⋮⋮</span>
          <div className="admin-form-grid biz-pair">
            <label className="admin-field">
              <span className="admin-field__label">항목</span>
              <input className="admin-input" value={values[labelKey] ?? ''} onChange={(e) => setField(labelKey, e.target.value)} />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">내용</span>
              <input className="admin-input" value={values[valueKey] ?? ''} onChange={(e) => setField(valueKey, e.target.value)} />
            </label>
          </div>
          <button
            type="button"
            className="biz-x"
            aria-label="삭제"
            onClick={() => {
              setField(labelKey, '')
              setField(valueKey, '')
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

function PhotoStrip({
  note,
  items,
  values,
  setField,
}: {
  note: string
  items: Array<{ photo: string; caption: string }>
  values: Values
  setField: SetField
}) {
  return (
    <div className="aca-photos">
      <p className="aca-photos__note">
        <b>사진 1~{items.length}장</b>
        <span>{note}</span>
      </p>
      <div className={`aca-photos__grid${items.length < 4 ? ' aca-photos__grid--two' : ''}`}>
        {items.map((item, index) => (
          <div key={item.photo} className="aca-photo">
            <AdminMediaUpload
              quiet
              layout="slot"
              slotTitle={`사진 ${index + 1}`}
              slotRatio="logo"
              label={`사진 ${index + 1}`}
              variant="image"
              value={values[item.photo] || null}
              onChange={(url) => setField(item.photo, url ?? '')}
            />
            <label className="admin-field">
              <span className="admin-field__label">설명</span>
              <input className="admin-input" value={values[item.caption] ?? ''} onChange={(e) => setField(item.caption, e.target.value)} />
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

const PRE_FACTS: Array<[string, string]> = [
  ['aca.pre.nameLabel', 'aca.pre.name'],
  ['aca.pre.placeLabel', 'aca.pre.place'],
  ['aca.pre.targetLabel', 'aca.pre.target'],
  ['aca.pre.studyLabel', 'aca.pre.study'],
]

const BOOK_FACTS: Array<[string, string]> = [
  ['aca.book.subjectLabel', 'aca.book.subject'],
  ['aca.book.targetLabel', 'aca.book.target'],
  ['aca.book.methodLabel', 'aca.book.method'],
]

const PRE_PHOTOS = [0, 1, 2, 3].map((index) => ({ photo: `aca.pre.photo.${index}`, caption: `aca.pre.cap.${index}` }))
const BOOK_PHOTOS = [0, 1].map((index) => ({ photo: `aca.book.photo.${index}`, caption: `aca.book.cap.${index}` }))

export function AcademyBody({ title, values, setField }: { title: string; values: Values; setField: SetField }) {
  const name = title.replace(/^[①-⑳]\s*/, '')
  if (name.includes('상단')) {
    return (
      <>
        <div className="aca-hero">
          <AdminMediaUpload
            quiet
            layout="slot"
            slotTitle="사진 올리기"
            slotRatio="1920×640"
            label="상단 사진"
            hint="권장 1920×600 · JPG"
            variant="image"
            value={values['aca.banner'] || null}
            onChange={(url) => setField('aca.banner', url ?? '')}
          />
          <div className="admin-form-grid">
            <label className="admin-field">
              <span className="admin-field__label">영문 라벨</span>
              <input className="admin-input" value={values['aca.heroLabel'] ?? ''} onChange={(e) => setField('aca.heroLabel', e.target.value)} />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">페이지 제목</span>
              <input className="admin-input" value={values['aca.heroTitle'] ?? ''} onChange={(e) => setField('aca.heroTitle', e.target.value)} />
            </label>
          </div>
        </div>
        <p className="admin-panel__foot">상단 사진 위에는 어두운 덮개를 두고 글자는 흰색으로 둡니다. 사진이 없으면 기본 배너를 씁니다.</p>
      </>
    )
  }
  if (name.startsWith('소개')) {
    if (modeOf(values, 'aca.intro.mode') === 'image') return <ImageSwap label="소개 이미지" imageKey="aca.intro.image" values={values} setField={setField} />
    const titleHtml = values['aca.title'] ?? ''
    const lead = values['aca.lead'] ?? ''
    return (
      <>
        <div className="aca-hero">
          <AdminMediaUpload
            quiet
            layout="slot"
            slotTitle="로고"
            slotRatio="logo"
            label="카야 아카데미 로고"
            hint="카야 아카데미 로고"
            variant="image"
            value={values['aca.logo'] || null}
            onChange={(url) => setField('aca.logo', url ?? '')}
          />
          <div className="admin-form-grid">
            <label className="admin-field">
              <span className="admin-field__label">영문 라벨 · 연도</span>
              <input className="admin-input" value={values['aca.kicker'] ?? ''} onChange={(e) => setField('aca.kicker', e.target.value)} />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">제목</span>
              <input className="admin-input" value={plain(titleHtml)} onChange={(e) => setField('aca.title', htmlTitle(e.target.value, emphasis(titleHtml)))} />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">강조 단어</span>
              <input className="admin-input" value={emphasis(titleHtml)} onChange={(e) => setField('aca.title', htmlTitle(plain(titleHtml), e.target.value))} />
            </label>
          </div>
        </div>
        <label className="admin-field" style={{ marginTop: 14 }}>
          <span className="admin-field__label">설명</span>
          <textarea className="admin-input" rows={3} value={plain(lead)} onChange={(e) => setField('aca.lead', htmlLines(e.target.value))} />
        </label>
        <div className="aca-side">
          <AdminMediaUpload
            quiet
            layout="slot"
            slotTitle="오른쪽 사진"
            slotRatio="4 : 5"
            label="오른쪽 사진"
            hint="Pre-School 교실"
            variant="image"
            value={values['aca.heroPhoto'] || null}
            onChange={(url) => setField('aca.heroPhoto', url ?? '')}
          />
        </div>
      </>
    )
  }
  if (name.includes('Pre-School')) {
    if (modeOf(values, 'aca.pre.mode') === 'image') return <ImageSwap label="Pre-School 이미지" imageKey="aca.pre.image" values={values} setField={setField} />
    return (
      <>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span className="admin-field__label">영문 라벨</span>
            <input className="admin-input" value={values['aca.pre.kicker'] ?? ''} onChange={(e) => setField('aca.pre.kicker', e.target.value)} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">제목</span>
            <input className="admin-input" value={values['aca.pre.title'] ?? ''} onChange={(e) => setField('aca.pre.title', e.target.value)} />
          </label>
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">설명</span>
            <textarea
              className="admin-input"
              rows={2}
              value={plainFromBreaks(values['aca.pre.lead'] ?? '')}
              onChange={(e) => setField('aca.pre.lead', e.target.value)}
            />
          </label>
        </div>
        <FactRows pairs={PRE_FACTS} values={values} setField={setField} />
        <PhotoStrip note="교실 수업 · 놀이 · 행사 · 원 외관" items={PRE_PHOTOS} values={values} setField={setField} />
      </>
    )
  }
  if (name.includes('학습지')) {
    if (modeOf(values, 'aca.book.mode') === 'image') return <ImageSwap label="학습지 이미지" imageKey="aca.book.image" values={values} setField={setField} />
    return (
      <>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span className="admin-field__label">영문 라벨</span>
            <input className="admin-input" value={values['aca.book.kicker'] ?? ''} onChange={(e) => setField('aca.book.kicker', e.target.value)} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">제목</span>
            <input className="admin-input" value={values['aca.book.title'] ?? ''} onChange={(e) => setField('aca.book.title', e.target.value)} />
          </label>
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">설명</span>
            <textarea className="admin-input" rows={3} value={plain(values['aca.book.lead'] ?? '')} onChange={(e) => setField('aca.book.lead', htmlLines(e.target.value))} />
          </label>
        </div>
        <FactRows pairs={BOOK_FACTS} values={values} setField={setField} />
        <PhotoStrip note="학습지 표지 · 학습지 활용 수업" items={BOOK_PHOTOS} values={values} setField={setField} />
      </>
    )
  }
  if (name.includes('CSR')) {
    return (
      <>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span className="admin-field__label">라벨</span>
            <input className="admin-input" value={values['aca.csrLabel'] ?? ''} onChange={(e) => setField('aca.csrLabel', e.target.value)} />
          </label>
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">내용</span>
            <textarea
              className="admin-input"
              rows={3}
              value={plainFromBreaks(values['aca.csr'] ?? '')}
              onChange={(e) => setField('aca.csr', e.target.value)}
            />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">페이스북 주소</span>
            <input className="admin-input" placeholder="https://facebook.com/…" value={values['aca.facebook'] ?? ''} onChange={(e) => setField('aca.facebook', e.target.value)} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">인스타그램 주소</span>
            <input className="admin-input" placeholder="https://instagram.com/…" value={values['aca.instagram'] ?? ''} onChange={(e) => setField('aca.instagram', e.target.value)} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">틱톡 주소</span>
            <input className="admin-input" placeholder="https://tiktok.com/@…" value={values['aca.tiktok'] ?? ''} onChange={(e) => setField('aca.tiktok', e.target.value)} />
          </label>
        </div>
        <p className="admin-panel__foot">CSR 박스 아래에 페이스북·인스타그램·틱톡 바로가기 버튼이 새 창으로 열립니다. https:// 없이 도메인만 넣어도 됩니다. 주소가 비면 그 버튼은 숨깁니다.</p>
      </>
    )
  }
  return null
}
