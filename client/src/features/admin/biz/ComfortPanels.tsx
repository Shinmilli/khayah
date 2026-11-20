import { AdminMediaUpload } from '../components/AdminMediaUpload'
import { breaksToHtml, plainTextFromBreaks } from '../../../utils/lineBreaks'

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

function modeKey(title: string): string {
  const name = title.replace(/^[①-⑳]\s*/, '')
  if (name.startsWith('소개')) return 'cnc.intro.mode'
  if (name.includes('브랜드')) return 'cnc.story.mode'
  if (name.includes('제품')) return 'cnc.products.mode'
  if (name.includes('구매')) return 'cnc.buy.mode'
  return ''
}

function imageKey(mode: string): string {
  return mode.replace(/\.mode$/, '.image')
}

export function ComfortModeSwitch({ title, values, setField }: { title: string; values: Values; setField: SetField }) {
  const key = modeKey(title)
  if (!key) return null
  const image = values[key] === 'image'
  return (
    <>
      <span>수정 방식</span>
      <div className="admin-segmented admin-segmented--tight" role="group" aria-label="수정 방식">
        <button type="button" className={`admin-segmented__btn${image ? '' : ' admin-segmented__btn--active'}`} onClick={() => setField(key, 'text')}>
          텍스트
        </button>
        <button type="button" className={`admin-segmented__btn${image ? ' admin-segmented__btn--active' : ''}`} onClick={() => setField(key, 'image')}>
          이미지
        </button>
      </div>
    </>
  )
}

function ImageSwap({ label, imageKey: key, values, setField }: { label: string; imageKey: string; values: Values; setField: SetField }) {
  return (
    <AdminMediaUpload
      layout="slot"
      slotTitle={label}
      slotRatio="2.2 : 1"
      label={label}
      hint="이 구역 전체를 이미지 한 장으로 바꿉니다"
      variant="image"
      value={values[key] || null}
      onChange={(url) => setField(key, url ?? '')}
    />
  )
}

function TextRows({
  left,
  right,
  pairs,
  values,
  setField,
}: {
  left: string
  right: string
  pairs: Array<[string, string]>
  values: Values
  setField: SetField
}) {
  return (
    <div className="biz-bars">
      {pairs.map(([titleKey, bodyKey]) => (
        <div key={titleKey} className="admin-item">
          <span className="biz-grip" aria-hidden="true">⋮⋮</span>
          <div className="admin-form-grid biz-pair">
            <label className="admin-field">
              <span className="admin-field__label">{left}</span>
              <input className="admin-input" value={values[titleKey] ?? ''} onChange={(e) => setField(titleKey, e.target.value)} />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">{right}</span>
              <input className="admin-input" value={values[bodyKey] ?? ''} onChange={(e) => setField(bodyKey, e.target.value)} />
            </label>
          </div>
          <button
            type="button"
            className="biz-x"
            aria-label="삭제"
            onClick={() => {
              setField(titleKey, '')
              setField(bodyKey, '')
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

const STORIES: Array<[string, string]> = [
  ['cnc.story.0.title', 'cnc.story.0.body'],
  ['cnc.story.1.title', 'cnc.story.1.body'],
  ['cnc.story.2.title', 'cnc.story.2.body'],
]

const STEPS: Array<[string, string]> = [
  ['cnc.step.0.title', 'cnc.step.0.body'],
  ['cnc.step.1.title', 'cnc.step.1.body'],
  ['cnc.step.2.title', 'cnc.step.2.body'],
]

const PRODUCTS = [0, 1, 2]

export function ComfortBody({ title, values, setField }: { title: string; values: Values; setField: SetField }) {
  const name = title.replace(/^[①-⑳]\s*/, '')
  const mode = modeKey(title)
  if (mode && values[mode] === 'image') return <ImageSwap label={`${name} 이미지`} imageKey={imageKey(mode)} values={values} setField={setField} />
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
            value={values['cnc.banner'] || null}
            onChange={(url) => setField('cnc.banner', url ?? '')}
          />
          <div className="admin-form-grid">
            <label className="admin-field">
              <span className="admin-field__label">영문 라벨</span>
              <input className="admin-input" value={values['cnc.heroLabel'] ?? ''} onChange={(e) => setField('cnc.heroLabel', e.target.value)} />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">페이지 제목</span>
              <input className="admin-input" value={values['cnc.heroTitle'] ?? ''} onChange={(e) => setField('cnc.heroTitle', e.target.value)} />
            </label>
          </div>
        </div>
        <p className="admin-panel__foot">상단 사진 위에는 어두운 덮개를 두고 글자는 흰색으로 둡니다. 사진이 없으면 기본 배너를 씁니다.</p>
      </>
    )
  }
  if (name.startsWith('소개')) {
    const titleHtml = values['cnc.title'] ?? ''
    const lead = values['cnc.lead'] ?? ''
    return (
      <>
        <div className="aca-hero">
          <AdminMediaUpload
            quiet
            layout="slot"
            slotTitle="로고"
            slotRatio="logo"
            label="C&C 로고"
            hint="C&C 로고"
            variant="image"
            value={values['cnc.logo'] || null}
            onChange={(url) => setField('cnc.logo', url ?? '')}
          />
          <div className="admin-form-grid">
            <label className="admin-field">
              <span className="admin-field__label">영문 라벨</span>
              <input className="admin-input" value={values['cnc.kicker'] ?? ''} onChange={(e) => setField('cnc.kicker', e.target.value)} />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">제목</span>
              <input className="admin-input" value={plain(titleHtml)} onChange={(e) => setField('cnc.title', htmlTitle(e.target.value, emphasis(titleHtml)))} />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">강조 단어</span>
              <input className="admin-input" value={emphasis(titleHtml)} onChange={(e) => setField('cnc.title', htmlTitle(plain(titleHtml), e.target.value))} />
            </label>
          </div>
        </div>
        <label className="admin-field" style={{ marginTop: 14 }}>
          <span className="admin-field__label">설명</span>
          <textarea className="admin-input" rows={3} value={plain(lead)} onChange={(e) => setField('cnc.lead', htmlLines(e.target.value))} />
        </label>
        <div className="aca-side">
          <AdminMediaUpload
            quiet
            layout="slot"
            slotTitle="오른쪽 사진"
            slotRatio="4 : 5"
            label="오른쪽 사진"
            hint="소개서 11p 위쪽"
            variant="image"
            value={values['cnc.heroPhoto'] || null}
            onChange={(url) => setField('cnc.heroPhoto', url ?? '')}
          />
        </div>
      </>
    )
  }
  if (name.includes('브랜드')) {
    return (
      <>
        <TextRows left="키워드" right="설명" pairs={STORIES} values={values} setField={setField} />
        <div className="cnc-note">
          <label className="admin-field">
            <span className="admin-field__label">하단 한 줄 (작은 글씨)</span>
            <input className="admin-input" value={values['cnc.note'] ?? ''} onChange={(e) => setField('cnc.note', e.target.value)} />
          </label>
          <label className="cnc-note__show">
            <input type="checkbox" checked={values['cnc.noteOn'] !== '0'} onChange={(e) => setField('cnc.noteOn', e.target.checked ? '1' : '0')} />
            표시
          </label>
        </div>
      </>
    )
  }
  if (name.includes('제품')) {
    return (
      <>
        <div className="biz-bars">
          {PRODUCTS.map((index) => (
            <div key={index} className="admin-item">
              <span className="biz-grip" aria-hidden="true">⋮⋮</span>
              <div className="cnc-product">
                <AdminMediaUpload
                  quiet
                  layout="slot"
                  slotTitle="사진"
                  slotRatio="logo"
                  label={`제품 ${index + 1} 사진`}
                  variant="image"
                  value={values[`cnc.product.${index}.photo`] || null}
                  onChange={(url) => setField(`cnc.product.${index}.photo`, url ?? '')}
                />
                <label className="admin-field">
                  <span className="admin-field__label">제품명</span>
                  <input className="admin-input" value={values[`cnc.product.${index}`] ?? ''} onChange={(e) => setField(`cnc.product.${index}`, e.target.value)} />
                </label>
              </div>
              <button
                type="button"
                className="biz-x"
                aria-label="삭제"
                onClick={() => {
                  setField(`cnc.product.${index}`, '')
                  setField(`cnc.product.${index}.photo`, '')
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <p className="admin-panel__foot">제품이 한 줄을 넘으면 다음 줄로 이어집니다. 제품명이 비면 그 칸은 공개 화면에서 빠집니다.</p>
      </>
    )
  }
  if (name.includes('구매')) {
    return (
      <>
        <TextRows left="제목" right="설명" pairs={STEPS} values={values} setField={setField} />
        <div className="admin-form-grid" style={{ marginTop: 14 }}>
          <label className="admin-field">
            <span className="admin-field__label">버튼 1 · 글자</span>
            <input className="admin-input" value={values['cnc.storeLabel'] ?? ''} onChange={(e) => setField('cnc.storeLabel', e.target.value)} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">버튼 1 · 링크</span>
            <input className="admin-input" value={values['cnc.store'] ?? ''} onChange={(e) => setField('cnc.store', e.target.value)} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">버튼 2 · 글자</span>
            <input className="admin-input" value={values['cnc.kakaoLabel'] ?? ''} onChange={(e) => setField('cnc.kakaoLabel', e.target.value)} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">버튼 2 · 링크</span>
            <input className="admin-input" value={values['cnc.kakao'] ?? ''} onChange={(e) => setField('cnc.kakao', e.target.value)} />
          </label>
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">인스타그램 주소</span>
            <input className="admin-input" value={values['cnc.instagram'] ?? ''} onChange={(e) => setField('cnc.instagram', e.target.value)} />
          </label>
        </div>
        <p className="admin-panel__foot">구매 버튼과 인스타그램 바로가기는 새 창으로 열립니다. 인스타그램 주소가 비면 그 버튼은 숨깁니다.</p>
      </>
    )
  }
  return null
}
