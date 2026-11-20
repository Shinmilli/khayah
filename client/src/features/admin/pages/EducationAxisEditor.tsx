import { useState } from 'react'
import { AdminMediaUpload } from '../components/AdminMediaUpload'
import { BizHead, bizMark } from '../biz/BizChrome'
import { DEFAULT_EDUCATION_AXES } from '../../projects/educationAxes'
import type { EducationAxis, EducationCard, EducationCase, EducationPhoto, ProjectPageHeader } from '../../projects/projectSetTypes'

function blankCard(): EducationCard {
  return { title: '', subtitle: '', body: '', tag: '' }
}

function blankCase(): EducationCase {
  return { place: '', body: '' }
}

function withPhotos(photos: EducationPhoto[]): EducationPhoto[] {
  return [0, 1, 2].map((index) => photos[index] ?? { src: '', alt: '' })
}

export function EducationAxisEditor({
  header,
  onChange,
  start = 2,
}: {
  header: ProjectPageHeader
  onChange: (header: ProjectPageHeader) => void
  start?: number
}) {
  const axes = header.axes?.length ? header.axes : DEFAULT_EDUCATION_AXES
  const [open, setOpen] = useState<string | null>(null)
  const commit = (next: EducationAxis[]) => onChange({ ...header, axes: next })
  const patchAxis = (index: number, patch: Partial<EducationAxis>) => {
    commit(axes.map((axis, axisIndex) => (axisIndex === index ? { ...axis, ...patch } : axis)))
  }
  const move = (index: number, dir: -1 | 1) => {
    const nextIndex = index + dir
    if (nextIndex < 0 || nextIndex >= axes.length) return
    const next = axes.slice()
    const [row] = next.splice(index, 1)
    next.splice(nextIndex, 0, row)
    commit(next)
  }

  return (
    <>
      {axes.map((axis, index) => {
        const enabled = axis.enabled !== false
        const photos = withPhotos(axis.photos)
        return (
          <section key={`${axis.phrase}-${index}`} className="admin-panel">
            <BizHead
              title={`${bizMark(start + index)} ${axis.title.replace(/\n/g, ' ') || '교육'}`}
              note={axis.phrase || undefined}
              enabled={enabled}
              onUp={() => move(index, -1)}
              onDown={() => move(index, 1)}
              onToggle={() => patchAxis(index, { enabled: !enabled })}
              trailing={
                <button type="button" className="biz-del" onClick={() => commit(axes.filter((_, axisIndex) => axisIndex !== index))}>
                  섹션 삭제
                </button>
              }
            >
              <span>수정 방식</span>
              <div className="admin-segmented admin-segmented--tight" role="group" aria-label="수정 방식">
                <button type="button" className={`admin-segmented__btn${axis.mode !== 'image' ? ' admin-segmented__btn--active' : ''}`} onClick={() => patchAxis(index, { mode: 'text' })}>
                  텍스트
                </button>
                <button type="button" className={`admin-segmented__btn${axis.mode === 'image' ? ' admin-segmented__btn--active' : ''}`} onClick={() => patchAxis(index, { mode: 'image' })}>
                  이미지
                </button>
              </div>
            </BizHead>
            {enabled && axis.mode === 'image' ? (
              <AdminMediaUpload layout="slot" slotTitle="구역 이미지" slotRatio="가로로 긴 이미지" label="구역 이미지" variant="image" value={axis.image || null} onChange={(url) => patchAxis(index, { image: url ?? '' })} />
            ) : null}
            {enabled && axis.mode !== 'image' ? (
              <>
                <div className="admin-form-grid">
                  <label className="admin-field">
                    <span className="admin-field__label">영문 라벨</span>
                    <input className="admin-input" value={axis.phrase} onChange={(e) => patchAxis(index, { phrase: e.target.value })} />
                  </label>
                  <label className="admin-field">
                    <span className="admin-field__label">제목</span>
                    <input className="admin-input" value={axis.title} onChange={(e) => patchAxis(index, { title: e.target.value })} />
                  </label>
                  <label className="admin-field admin-field--full">
                    <span className="admin-field__label">설명 (문장마다 줄바꿈)</span>
                    <textarea className="admin-input" rows={2} value={axis.body} onChange={(e) => patchAxis(index, { body: e.target.value })} />
                  </label>
                </div>
                <p className="admin-field__label">내용 카드 (제목 · 부제 · 설명 · 태그)</p>
                <div className="biz-bars">
                  {axis.cards.map((card, cardIndex) => {
                    const key = `${index}-card-${cardIndex}`
                    return (
                      <div key={key}>
                        <button type="button" className="biz-bar" onClick={() => setOpen(open === key ? null : key)}>
                          {card.title || '제목 없음'}
                        </button>
                        {open === key ? (
                          <div className="admin-item">
                            <div className="admin-form-grid">
                              <label className="admin-field">
                                <span className="admin-field__label">제목</span>
                                <input className="admin-input" value={card.title} onChange={(e) => patchAxis(index, { cards: axis.cards.map((item, itemIndex) => (itemIndex === cardIndex ? { ...item, title: e.target.value } : item)) })} />
                              </label>
                              <label className="admin-field">
                                <span className="admin-field__label">부제</span>
                                <input className="admin-input" value={card.subtitle} onChange={(e) => patchAxis(index, { cards: axis.cards.map((item, itemIndex) => (itemIndex === cardIndex ? { ...item, subtitle: e.target.value } : item)) })} />
                              </label>
                              <label className="admin-field admin-field--full">
                                <span className="admin-field__label">설명</span>
                                <textarea className="admin-input" rows={3} value={card.body} onChange={(e) => patchAxis(index, { cards: axis.cards.map((item, itemIndex) => (itemIndex === cardIndex ? { ...item, body: e.target.value } : item)) })} />
                              </label>
                              <label className="admin-field">
                                <span className="admin-field__label">태그</span>
                                <input className="admin-input" value={card.tag} onChange={(e) => patchAxis(index, { cards: axis.cards.map((item, itemIndex) => (itemIndex === cardIndex ? { ...item, tag: e.target.value } : item)) })} />
                              </label>
                            </div>
                            <button type="button" className="biz-x" aria-label="카드 삭제" onClick={() => patchAxis(index, { cards: axis.cards.filter((_, itemIndex) => itemIndex !== cardIndex) })}>
                              ×
                            </button>
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
                  {axis.cards.length < 8 ? (
                    <button type="button" className="biz-add" onClick={() => patchAxis(index, { cards: [...axis.cards, blankCard()] })}>
                      + 카드
                    </button>
                  ) : null}
                </div>
                <p className="admin-field__label">현장 사례 (여러 개 가능)</p>
                <div className="biz-bars">
                  {axis.cases.map((item, caseIndex) => {
                    const key = `${index}-case-${caseIndex}`
                    return (
                      <div key={key}>
                        <button type="button" className="biz-bar" onClick={() => setOpen(open === key ? null : key)}>
                          {item.place || '사례'}
                        </button>
                        {open === key ? (
                          <div className="admin-item">
                            <div className="admin-form-grid">
                              <label className="admin-field">
                                <span className="admin-field__label">장소·사업</span>
                                <input className="admin-input" value={item.place} onChange={(e) => patchAxis(index, { cases: axis.cases.map((row, rowIndex) => (rowIndex === caseIndex ? { ...row, place: e.target.value } : row)) })} />
                              </label>
                              <label className="admin-field admin-field--full">
                                <span className="admin-field__label">내용</span>
                                <textarea className="admin-input" rows={2} value={item.body} onChange={(e) => patchAxis(index, { cases: axis.cases.map((row, rowIndex) => (rowIndex === caseIndex ? { ...row, body: e.target.value } : row)) })} />
                              </label>
                            </div>
                            <button type="button" className="biz-x" aria-label="사례 삭제" onClick={() => patchAxis(index, { cases: axis.cases.filter((_, rowIndex) => rowIndex !== caseIndex) })}>
                              ×
                            </button>
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
                  {axis.cases.length < 8 ? (
                    <button type="button" className="biz-add" onClick={() => patchAxis(index, { cases: [...axis.cases, blankCase()] })}>
                      + 사례
                    </button>
                  ) : null}
                </div>
                <div className="biz-photos">
                  {photos.map((photo, photoIndex) => (
                    <div key={photoIndex}>
                      <AdminMediaUpload
                        layout="slot"
                        slotTitle={`사진 ${photoIndex + 1}`}
                        slotRatio="4:3"
                        label={`사진 ${photoIndex + 1}`}
                        variant="image"
                        value={photo.src || null}
                        onChange={(url) => patchAxis(index, { photos: photos.map((row, rowIndex) => (rowIndex === photoIndex ? { ...row, src: url ?? '' } : row)) })}
                      />
                      <label className="admin-field">
                        <span className="admin-field__label">사진 설명</span>
                        <input className="admin-input" value={photo.alt} onChange={(e) => patchAxis(index, { photos: photos.map((row, rowIndex) => (rowIndex === photoIndex ? { ...row, alt: e.target.value } : row)) })} />
                      </label>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </section>
        )
      })}
    </>
  )
}
