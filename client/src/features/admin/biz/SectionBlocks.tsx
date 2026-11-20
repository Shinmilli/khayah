import { useEffect, useRef } from 'react'
import { AdminMediaUpload } from '../components/AdminMediaUpload'
import { BizHead } from './BizChrome'
import { PAGE_BLOCK_TYPES, blockTypeLabel, emptyPageBlock, type PageBlock, type PageBlockType } from '../../biz/pageBlockTypes'

const MAX_BLOCKS = 8

function move(blocks: PageBlock[], id: string, dir: -1 | 1): PageBlock[] {
  const ranked = blocks.slice().sort((a, b) => a.order - b.order)
  const index = ranked.findIndex((row) => row.id === id)
  const nextIndex = index + dir
  if (index < 0 || nextIndex < 0 || nextIndex >= ranked.length) return ranked.map((row, order) => ({ ...row, order }))
  const next = ranked.slice()
  const [row] = next.splice(index, 1)
  next.splice(nextIndex, 0, row)
  return next.map((item, order) => ({ ...item, order }))
}

export function SectionBlocks({
  blocks,
  onChange,
  note,
}: {
  blocks: PageBlock[]
  onChange: (blocks: PageBlock[]) => void
  note?: string
}) {
  const ranked = blocks.slice().sort((a, b) => a.order - b.order)
  const update = (id: string, patch: Partial<PageBlock>) => onChange(ranked.map((row) => (row.id === id ? { ...row, ...patch } : row)))
  const count = useRef(ranked.length)
  const fresh = useRef<HTMLElement>(null)
  useEffect(() => {
    if (ranked.length > count.current) fresh.current?.scrollIntoView({ block: 'center' })
    count.current = ranked.length
  }, [ranked.length])
  return (
    <>
      {ranked.map((block, index) => (
        <section key={block.id} className="admin-panel" ref={index === ranked.length - 1 ? fresh : undefined}>
          <BizHead
            title={blockTypeLabel(block.type)}
            enabled={block.enabled}
            onUp={() => onChange(move(ranked, block.id, -1))}
            onDown={() => onChange(move(ranked, block.id, 1))}
            onToggle={() => update(block.id, { enabled: !block.enabled })}
          >
            <button type="button" className="admin-btn" onClick={() => onChange(ranked.filter((row) => row.id !== block.id).map((row, order) => ({ ...row, order })))}>
              섹션 삭제
            </button>
          </BizHead>
          {block.enabled ? <BlockFields block={block} onChange={(patch) => update(block.id, patch)} /> : null}
        </section>
      ))}
      <section className="admin-panel" style={{ borderStyle: 'dashed' }}>
        <div className="admin-panel__head biz-phd">
          <h2 className="admin-panel__title">+ 섹션 추가</h2>
        </div>
        <div className="admin-segmented" role="group" aria-label="유형 선택">
          {PAGE_BLOCK_TYPES.map(([type, label]) => (
            <button
              key={type}
              type="button"
              className="admin-segmented__btn"
              disabled={ranked.length >= MAX_BLOCKS}
              onClick={() => onChange([...ranked, emptyPageBlock(type as PageBlockType, ranked.length)])}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="admin-panel__foot">
          {note ? `${note} ` : ''}
          유형을 누르면 바로 위에 칸이 생깁니다. 내용을 넣고 게시를 눌러야 이 화면의 공개 페이지에 나옵니다.
        </p>
      </section>
    </>
  )
}

function BlockFields({ block, onChange }: { block: PageBlock; onChange: (patch: Partial<PageBlock>) => void }) {
  if (block.type === 'intro') {
    return (
      <div className="admin-form-grid">
        <label className="admin-field">
          <span className="admin-field__label">소제목</span>
          <input className="admin-input" value={block.kicker} onChange={(e) => onChange({ kicker: e.target.value })} />
        </label>
        <label className="admin-field">
          <span className="admin-field__label">제목</span>
          <input className="admin-input" value={block.title} onChange={(e) => onChange({ title: e.target.value })} />
        </label>
        <label className="admin-field">
          <span className="admin-field__label">강조 단어</span>
          <input className="admin-input" value={block.emphasis} onChange={(e) => onChange({ emphasis: e.target.value })} />
        </label>
        <label className="admin-field admin-field--full">
          <span className="admin-field__label">설명 (문장마다 줄바꿈)</span>
          <textarea className="admin-input" rows={3} value={block.lead} onChange={(e) => onChange({ lead: e.target.value })} />
        </label>
        <AdminMediaUpload layout="slot" slotTitle="사진" slotRatio="4:3" label="사진" variant="image" value={block.photo || null} onChange={(url) => onChange({ photo: url ?? '' })} />
        <label className="admin-field">
          <span className="admin-field__label">사진 설명</span>
          <input className="admin-input" value={block.photoAlt} onChange={(e) => onChange({ photoAlt: e.target.value })} />
        </label>
        <div className="admin-field">
          <span className="admin-field__label">사진 위치</span>
          <div className="admin-segmented admin-segmented--tight" role="group" aria-label="사진 위치">
            {(['right', 'left', 'none'] as const).map((side) => (
              <button key={side} type="button" className={`admin-segmented__btn${block.photoSide === side ? ' admin-segmented__btn--active' : ''}`} onClick={() => onChange({ photoSide: side })}>
                {side === 'right' ? '오른쪽' : side === 'left' ? '왼쪽' : '없음'}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }
  if (block.type === 'facts') {
    return (
      <div className="biz-bars">
        {block.cards.map((card, index) => (
          <div key={index} className="admin-item">
            <span className="biz-grip" aria-hidden="true">⋮⋮</span>
            <div className="admin-form-grid biz-pair">
              <label className="admin-field"><span className="admin-field__label">숫자</span><input className="admin-input" value={card.value} onChange={(e) => onChange({ cards: block.cards.map((row, rowIndex) => rowIndex === index ? { ...row, value: e.target.value } : row) })} /></label>
              <label className="admin-field"><span className="admin-field__label">단위</span><input className="admin-input" value={card.unit} onChange={(e) => onChange({ cards: block.cards.map((row, rowIndex) => rowIndex === index ? { ...row, unit: e.target.value } : row) })} /></label>
              <label className="admin-field"><span className="admin-field__label">설명</span><input className="admin-input" value={card.note} onChange={(e) => onChange({ cards: block.cards.map((row, rowIndex) => rowIndex === index ? { ...row, note: e.target.value } : row) })} /></label>
              <label className="admin-field"><span className="admin-field__label">기준·출처</span><input className="admin-input" value={card.source} onChange={(e) => onChange({ cards: block.cards.map((row, rowIndex) => rowIndex === index ? { ...row, source: e.target.value } : row) })} /></label>
            </div>
            <button type="button" className="biz-x" aria-label="삭제" onClick={() => onChange({ cards: block.cards.filter((_, rowIndex) => rowIndex !== index) })}>×</button>
          </div>
        ))}
        {block.cards.length < 4 ? (
          <button type="button" className="biz-add" onClick={() => onChange({ cards: [...block.cards, { value: '', unit: '', note: '', source: '' }] })}>+ 숫자 카드</button>
        ) : null}
      </div>
    )
  }
  if (block.type === 'flow') {
    return (
      <div>
        <div className="admin-form-grid">
          <label className="admin-field"><span className="admin-field__label">소제목</span><input className="admin-input" value={block.kicker} onChange={(e) => onChange({ kicker: e.target.value })} /></label>
          <label className="admin-field"><span className="admin-field__label">제목</span><input className="admin-input" value={block.title} onChange={(e) => onChange({ title: e.target.value })} /></label>
        </div>
        <div className="biz-bars">
        {block.steps.map((step, index) => (
          <div key={index} className="admin-item">
            <span className="biz-grip" aria-hidden="true">⋮⋮</span>
            <div className="admin-form-grid">
              <label className="admin-field"><span className="admin-field__label">단계명</span><input className="admin-input" value={step.name} onChange={(e) => onChange({ steps: block.steps.map((row, rowIndex) => rowIndex === index ? { ...row, name: e.target.value } : row) })} /></label>
              <label className="admin-field"><span className="admin-field__label">설명</span><input className="admin-input" value={step.body} onChange={(e) => onChange({ steps: block.steps.map((row, rowIndex) => rowIndex === index ? { ...row, body: e.target.value } : row) })} /></label>
            </div>
            <button type="button" className="biz-x" aria-label="삭제" onClick={() => onChange({ steps: block.steps.filter((_, rowIndex) => rowIndex !== index) })}>×</button>
          </div>
        ))}
        </div>
        {block.steps.length < 6 ? (
          <button type="button" className="biz-add" onClick={() => onChange({ steps: [...block.steps, { name: '', body: '' }] })}>+ 단계</button>
        ) : null}
      </div>
    )
  }
  if (block.type === 'cards' || block.type === 'timeline' || block.type === 'cases') {
    return (
      <div>
        {block.type === 'cards' ? (
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">목록 제목</span>
            <input className="admin-input" value={block.title} onChange={(e) => onChange({ title: e.target.value })} />
          </label>
        ) : null}
        <div className="biz-bars">
        {block.items.map((item, index) => (
          <div key={index} className="admin-item">
            <span className="biz-grip" aria-hidden="true">⋮⋮</span>
            <div className="admin-form-grid">
            {block.type === 'timeline' ? (
              <label className="admin-field"><span className="admin-field__label">연도</span><input className="admin-input" value={item.year} onChange={(e) => onChange({ items: block.items.map((row, rowIndex) => rowIndex === index ? { ...row, year: e.target.value } : row) })} /></label>
            ) : null}
            <label className="admin-field"><span className="admin-field__label">{block.type === 'cases' ? '장소' : '제목'}</span><input className="admin-input" value={item.title} onChange={(e) => onChange({ items: block.items.map((row, rowIndex) => rowIndex === index ? { ...row, title: e.target.value } : row) })} /></label>
            <label className="admin-field"><span className="admin-field__label">설명</span><input className="admin-input" value={item.body} onChange={(e) => onChange({ items: block.items.map((row, rowIndex) => rowIndex === index ? { ...row, body: e.target.value } : row) })} /></label>
            {block.type === 'cards' ? (
              <label className="admin-field"><span className="admin-field__label">링크</span><input className="admin-input" value={item.href} onChange={(e) => onChange({ items: block.items.map((row, rowIndex) => rowIndex === index ? { ...row, href: e.target.value } : row) })} /></label>
            ) : null}
            </div>
            <button type="button" className="biz-x" aria-label="삭제" onClick={() => onChange({ items: block.items.filter((_, rowIndex) => rowIndex !== index) })}>×</button>
          </div>
        ))}
        </div>
        {block.items.length < 8 ? (
          <button type="button" className="biz-add" onClick={() => onChange({ items: [...block.items, { title: '', body: '', href: '', year: '' }] })}>
            {block.type === 'timeline' ? '+ 연도' : block.type === 'cases' ? '+ 사례' : '+ 카드'}
          </button>
        ) : null}
      </div>
    )
  }
  return (
    <div>
      {block.photos.map((photo, index) => (
        <div key={index} className="admin-form-grid">
          <AdminMediaUpload layout="slot" slotTitle={`사진 ${index + 1}`} slotRatio="4:3" label={`사진 ${index + 1}`} variant="image" value={photo.src || null} onChange={(url) => onChange({ photos: block.photos.map((row, rowIndex) => rowIndex === index ? { ...row, src: url ?? '' } : row) })} />
          <label className="admin-field">
            <span className="admin-field__label">사진 설명</span>
            <input className="admin-input" value={photo.alt} onChange={(e) => onChange({ photos: block.photos.map((row, rowIndex) => rowIndex === index ? { ...row, alt: e.target.value } : row) })} />
          </label>
        </div>
      ))}
    </div>
  )
}
