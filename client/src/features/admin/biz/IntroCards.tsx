import { useState } from 'react'
import { AdminMediaUpload } from '../components/AdminMediaUpload'
import { BUSINESS_HUB_ICON_LABELS } from '../../business/businessHubCardIcons'
import { BUSINESS_HUB_ICONS, type BusinessHub, type BusinessHubCard, type BusinessHubIcon } from '../../business/businessHubCardsTypes'
import { breaksToHtml, plainFromBreaks, plainTextFromBreaks } from '../../../utils/lineBreaks'

function shiftPairs(
  fields: Record<string, string>,
  prefix: string,
  max: number,
  keys: string[],
): Record<string, string> {
  const rows = Array.from({ length: max }, (_, index) => {
    const row: Record<string, string> = {}
    for (const key of keys) row[key] = fields[`${prefix}.${index}.${key}`] ?? ''
    return row
  }).filter((row) => keys.some((key) => row[key].trim()))
  const next = { ...fields }
  for (let index = 0; index < max; index += 1) {
    const row = rows[index]
    for (const key of keys) next[`${prefix}.${index}.${key}`] = row?.[key] ?? ''
  }
  return next
}

export function PrincipleCards({
  fields,
  prefix,
  max,
  onFields,
}: {
  fields: Record<string, string>
  prefix: string
  max: number
  onFields: (fields: Record<string, string>) => void
}) {
  const keys = ['title', 'body']
  const filled = Array.from({ length: max }, (_, index) => index).filter(
    (index) => (fields[`${prefix}.${index}.title`] ?? '').trim() || (fields[`${prefix}.${index}.body`] ?? '').trim(),
  )
  const [extra, setExtra] = useState(0)
  const count = Math.min(max, Math.max(filled.length, 1) + extra)
  const shown = Array.from({ length: count }, (_, index) => index)
  const [drag, setDrag] = useState<number | null>(null)
  const set = (index: number, key: string, value: string) => {
    if (value.trim() && index >= filled.length) setExtra(0)
    onFields({ ...fields, [`${prefix}.${index}.${key}`]: value })
  }
  const reorder = (from: number, to: number) => {
    if (from === to) return
    const next = { ...fields }
    const moving = keys.map((key) => fields[`${prefix}.${from}.${key}`] ?? '')
    const step = from < to ? 1 : -1
    for (let cursor = from; cursor !== to; cursor += step) {
      for (const key of keys) next[`${prefix}.${cursor}.${key}`] = fields[`${prefix}.${cursor + step}.${key}`] ?? ''
    }
    keys.forEach((key, keyIndex) => {
      next[`${prefix}.${to}.${key}`] = moving[keyIndex]
    })
    onFields(next)
  }
  return (
    <div className="biz-bars">
      {shown.map((index) => (
        <div
          key={index}
          className="admin-item"
          draggable
          onDragStart={() => setDrag(index)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => {
            if (drag !== null) reorder(drag, index)
            setDrag(null)
          }}
        >
          <span className="biz-grip" aria-hidden="true">⋮⋮</span>
          <div className="admin-form-grid">
            <label className="admin-field admin-field--full">
              <span className="admin-field__label">제목</span>
              <input className="admin-input" value={fields[`${prefix}.${index}.title`] ?? ''} onChange={(e) => set(index, 'title', e.target.value)} />
            </label>
            <label className="admin-field admin-field--full">
              <span className="admin-field__label">설명</span>
              <textarea
                className="admin-input"
                rows={2}
                value={plainTextFromBreaks(fields[`${prefix}.${index}.body`] ?? '')}
                onChange={(e) => set(index, 'body', breaksToHtml(e.target.value))}
              />
            </label>
          </div>
          <button
            type="button"
            className="biz-x"
            aria-label="삭제"
            onClick={() => {
              setExtra(0)
              onFields(shiftPairs({ ...fields, [`${prefix}.${index}.title`]: '', [`${prefix}.${index}.body`]: '' }, prefix, max, keys))
            }}
          >
            ×
          </button>
        </div>
      ))}
      {count < max ? (
        <button type="button" className="biz-add" onClick={() => setExtra((value) => value + 1)}>
          + 원칙 추가
        </button>
      ) : null}
    </div>
  )
}

export function ProgramCards({
  fields,
  onFields,
}: {
  fields: Record<string, string>
  onFields: (fields: Record<string, string>) => void
}) {
  const set = (key: string, value: string) => onFields({ ...fields, [key]: value })
  return (
    <div className="biz-bars">
      {[0, 1, 2].map((index) => (
        <div key={index} className="admin-item">
          <span className="biz-grip" aria-hidden="true">⋮⋮</span>
          <div className="admin-form-grid">
            <label className="admin-field">
              <span className="admin-field__label">영문 라벨</span>
              <input className="admin-input" value={fields[`dedu.${index}.label`] ?? ''} onChange={(e) => set(`dedu.${index}.label`, e.target.value)} />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">제목</span>
              <input className="admin-input" value={fields[`dedu.${index}.title`] ?? ''} onChange={(e) => set(`dedu.${index}.title`, e.target.value)} />
            </label>
            <label className="admin-field admin-field--full">
              <span className="admin-field__label">태그</span>
              <input className="admin-input" value={fields[`dedu.${index}.sub`] ?? ''} onChange={(e) => set(`dedu.${index}.sub`, e.target.value)} />
            </label>
            <label className="admin-field admin-field--full">
              <span className="admin-field__label">설명</span>
              <textarea
                className="admin-input"
                rows={2}
                value={plainFromBreaks(fields[`dedu.${index}.body`] ?? '')}
                onChange={(e) => set(`dedu.${index}.body`, e.target.value)}
              />
            </label>
            <AdminMediaUpload layout="slot" slotTitle={`사진 ${index + 1}`} slotRatio="4:3" label={`프로그램 ${index + 1} 사진`} variant="image" value={fields[`dedu.${index}.photo`] || null} onChange={(url) => set(`dedu.${index}.photo`, url ?? '')} />
            <label className="admin-field">
              <span className="admin-field__label">사진 설명</span>
              <input className="admin-input" value={fields[`dedu.${index}.caption`] ?? ''} onChange={(e) => set(`dedu.${index}.caption`, e.target.value)} />
            </label>
          </div>
        </div>
      ))}
      <p className="admin-panel__foot">국내 교육 소개에 나옵니다. 글과 사진이 좌우로 번갈아 배치됩니다.</p>
    </div>
  )
}

export function StepList({
  fields,
  onFields,
}: {
  fields: Record<string, string>
  onFields: (fields: Record<string, string>) => void
}) {
  const set = (key: string, value: string) => onFields({ ...fields, [key]: value })
  const steps = Array.from({ length: 10 }, (_, index) => index).filter((index) => (fields[`vol.step.${index}`] ?? '').trim())
  return (
    <div className="biz-bars">
      <div className="admin-item">
        <div className="admin-form-grid">
          <label className="admin-field">
            <span className="admin-field__label">목록 제목</span>
            <input className="admin-input" value={fields['vol.panel.0.title'] ?? ''} onChange={(e) => set('vol.panel.0.title', e.target.value)} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">목록 제목</span>
            <input className="admin-input" value={fields['vol.panel.1.title'] ?? ''} onChange={(e) => set('vol.panel.1.title', e.target.value)} />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">기획 제목</span>
            <input className="admin-input" value={fields['vol.block.0.title'] ?? ''} onChange={(e) => set('vol.block.0.title', e.target.value)} />
          </label>
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">기획 설명</span>
            <textarea
              className="admin-input"
              rows={2}
              value={plainTextFromBreaks(fields['vol.block.0.lead'] ?? '')}
              onChange={(e) => set('vol.block.0.lead', breaksToHtml(e.target.value))}
            />
          </label>
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">운영 전 과정 제목</span>
            <input className="admin-input" value={fields['vol.block.1.title'] ?? ''} onChange={(e) => set('vol.block.1.title', e.target.value)} />
          </label>
          <label className="admin-field admin-field--full">
            <span className="admin-field__label">운영 전 과정 설명</span>
            <textarea
              className="admin-input"
              rows={2}
              value={plainFromBreaks(fields['vol.block.1.lead'] ?? '')}
              onChange={(e) => set('vol.block.1.lead', e.target.value)}
            />
          </label>
        </div>
      </div>
      <div className="biz-steps">
      {steps.map((index) => (
        <div key={index} className="admin-item admin-item--step">
          <span className="biz-grip" aria-hidden="true">⋮⋮</span>
          <span className="admin-item__step">단계 {index + 1}</span>
          <input className="admin-input" aria-label={`단계 ${index + 1}`} value={fields[`vol.step.${index}`] ?? ''} onChange={(e) => set(`vol.step.${index}`, e.target.value)} />
          <button type="button" className="biz-x" aria-label="삭제" onClick={() => {
            const next = { ...fields }
            for (let cursor = index; cursor < 9; cursor += 1) next[`vol.step.${cursor}`] = fields[`vol.step.${cursor + 1}`] ?? ''
            next['vol.step.9'] = ''
            onFields(next)
          }}>×</button>
        </div>
      ))}
      </div>
      {steps.length < 10 ? <button type="button" className="biz-add" onClick={() => set(`vol.step.${steps.length}`, '새 단계')}>+ 단계</button> : null}
      <p className="admin-panel__foot">해외봉사단 소개에 나옵니다. 번호는 자동입니다.</p>
    </div>
  )
}

export function BottomCards({
  fields,
  onFields,
}: {
  fields: Record<string, string>
  onFields: (fields: Record<string, string>) => void
}) {
  const set = (key: string, value: string) => onFields({ ...fields, [key]: value })
  return (
    <div className="biz-bars">
      {[0, 1, 2].map((index) => (
        <div key={index} className="admin-item">
          <span className="biz-grip" aria-hidden="true">⋮⋮</span>
          <div className="admin-form-grid">
            <label className="admin-field">
              <span className="admin-field__label">제목</span>
              <input className="admin-input" value={fields[`res.card.${index}.title`] ?? ''} onChange={(e) => set(`res.card.${index}.title`, e.target.value)} />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">연결 페이지</span>
              <input className="admin-input" value={fields[`res.card.${index}.href`] ?? ''} onChange={(e) => set(`res.card.${index}.href`, e.target.value)} />
            </label>
            <label className="admin-field admin-field--full">
              <span className="admin-field__label">설명</span>
              <textarea
                className="admin-input"
                rows={2}
                value={plainFromBreaks(fields[`res.card.${index}.desc`] ?? '')}
                onChange={(e) => set(`res.card.${index}.desc`, e.target.value)}
              />
            </label>
          </div>
        </div>
      ))}
    </div>
  )
}

export function CtaFields({
  fields,
  prefix,
  onFields,
}: {
  fields: Record<string, string>
  prefix: 'dedu' | 'oedu' | 'vol' | 'res' | 'ovs'
  onFields: (fields: Record<string, string>) => void
}) {
  const set = (key: string, value: string) => onFields({ ...fields, [key]: value })
  const noteKey = `${prefix}.ctaNote`
  return (
    <div className="admin-form-grid">
      <label className="admin-field">
        <span className="admin-field__label">버튼 문구</span>
        <input className="admin-input" value={fields[`${prefix}.cta`] ?? ''} onChange={(e) => set(`${prefix}.cta`, e.target.value)} />
      </label>
      <label className="admin-field">
        <span className="admin-field__label">연결 페이지</span>
        <input className="admin-input" value={fields[`${prefix}.ctaHref`] ?? ''} onChange={(e) => set(`${prefix}.ctaHref`, e.target.value)} />
      </label>
      {prefix === 'ovs' ? null : (
        <label className="admin-field admin-field--full">
          <span className="admin-field__label">버튼 위 안내 문구</span>
          <input className="admin-input" value={fields[noteKey] ?? ''} onChange={(e) => set(noteKey, e.target.value)} />
        </label>
      )}
    </div>
  )
}

export function AxisCards({
  fields,
  onFields,
}: {
  fields: Record<string, string>
  onFields: (fields: Record<string, string>) => void
}) {
  const set = (key: string, value: string) => onFields({ ...fields, [key]: value })
  return (
    <div className="biz-bars">
      {[0, 1, 2].map((index) => (
        <div key={index} className="admin-item">
          <span className="biz-grip" aria-hidden="true">⋮⋮</span>
          <div className="admin-form-grid">
            <label className="admin-field admin-field--full">
              <span className="admin-field__label">제목</span>
              <textarea
                className="admin-input"
                rows={2}
                value={plainTextFromBreaks(fields[`oedu.${index}.title`] ?? '')}
                onChange={(e) => set(`oedu.${index}.title`, breaksToHtml(e.target.value))}
              />
            </label>
            <label className="admin-field admin-field--full">
              <span className="admin-field__label">설명</span>
              <textarea
                className="admin-input"
                rows={3}
                value={plainFromBreaks(fields[`oedu.${index}.body`] ?? '')}
                onChange={(e) => set(`oedu.${index}.body`, e.target.value)}
              />
            </label>
            {index === 1 ? (
              <label className="admin-field admin-field--full">
                <span className="admin-field__label">오른쪽 카드 제목</span>
                <input className="admin-input" value={fields['oedu.1.card.1.title'] ?? ''} onChange={(e) => set('oedu.1.card.1.title', e.target.value)} />
              </label>
            ) : null}
            {[0, 1, 2].map((photo) => (
              <div key={photo} className="admin-form-grid" style={{ gridColumn: '1 / -1' }}>
                <AdminMediaUpload layout="slot" slotTitle={`사진 ${photo + 1}`} slotRatio="4:3" label={`축 ${index + 1} 사진 ${photo + 1}`} variant="image" value={fields[`oedu.${index}.photo.${photo}`] || null} onChange={(url) => set(`oedu.${index}.photo.${photo}`, url ?? '')} />
                <label className="admin-field">
                  <span className="admin-field__label">사진 설명</span>
                  <input className="admin-input" value={fields[`oedu.${index}.cap.${photo}`] ?? ''} onChange={(e) => set(`oedu.${index}.cap.${photo}`, e.target.value)} />
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
      <p className="admin-panel__foot">해외 교육 소개에 나옵니다. 제목, 설명, 사진 3장입니다.</p>
    </div>
  )
}

export function VolunteerPhotos({
  fields,
  onFields,
}: {
  fields: Record<string, string>
  onFields: (fields: Record<string, string>) => void
}) {
  const set = (key: string, value: string) => onFields({ ...fields, [key]: value })
  return (
    <div className="biz-photos">
      {[0, 1, 2].map((index) => (
        <div key={index}>
          <AdminMediaUpload layout="slot" slotTitle={`사진 ${index + 1}`} slotRatio="4:3" label={`하단 사진 ${index + 1}`} variant="image" value={fields[`vol.photo.${index}`] || null} onChange={(url) => set(`vol.photo.${index}`, url ?? '')} />
          <label className="admin-field">
            <span className="admin-field__label">사진 설명</span>
            <input className="admin-input" value={fields[`vol.photo.${index}.alt`] ?? ''} onChange={(e) => set(`vol.photo.${index}.alt`, e.target.value)} />
          </label>
        </div>
      ))}
    </div>
  )
}

const HUB_ICON_LABEL: Record<BusinessHubIcon, string> = {
  education: '교육',
  people: '사람',
  projects: '폴더',
  volunteer: '하트',
}

export function HubCards({
  hub,
  cards,
  onChange,
}: {
  hub: BusinessHub
  cards: BusinessHubCard[]
  onChange: (cards: BusinessHubCard[]) => void
}) {
  const rows = cards.filter((card) => card.hub === hub && card.enabled).sort((a, b) => a.order - b.order)
  const patch = (id: string, next: Partial<BusinessHubCard> & { koTitle?: string; koDesc?: string }) => {
    const { koTitle, koDesc, ...rest } = next
    onChange(cards.map((card) => {
      if (card.id !== id) return card
      return {
        ...card,
        ...rest,
        locales: {
          ...card.locales,
          ko: {
            ...card.locales.ko,
            title: koTitle ?? card.locales.ko.title,
            description: koDesc ?? card.locales.ko.description,
          },
        },
      }
    }))
  }
  return (
    <div className="biz-bars">
      {rows.map((card) => (
        <div key={card.id} className="admin-item">
          <span className="biz-grip" aria-hidden="true">⋮⋮</span>
          <div className="admin-form-grid">
            <label className="admin-field">
              <span className="admin-field__label">아이콘</span>
              <select className="admin-input" value={card.icon} onChange={(e) => patch(card.id, { icon: e.target.value as BusinessHubIcon })}>
                {BUSINESS_HUB_ICONS.map((icon) => (
                  <option key={icon} value={icon}>{HUB_ICON_LABEL[icon] || BUSINESS_HUB_ICON_LABELS[icon]}</option>
                ))}
              </select>
            </label>
            <label className="admin-field">
              <span className="admin-field__label">제목</span>
              <input className="admin-input" value={card.locales.ko.title} onChange={(e) => patch(card.id, { koTitle: e.target.value })} />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">연결 페이지</span>
              <input className="admin-input" value={card.href} onChange={(e) => patch(card.id, { href: e.target.value })} />
            </label>
            <label className="admin-field admin-field--full">
              <span className="admin-field__label">설명</span>
              <textarea className="admin-input" rows={2} value={card.locales.ko.description} onChange={(e) => patch(card.id, { koDesc: e.target.value })} />
            </label>
          </div>
          <button type="button" className="biz-x" aria-label="삭제" onClick={() => onChange(cards.map((item) => (item.id === card.id ? { ...item, enabled: false } : item)))}>×</button>
        </div>
      ))}
      {rows.length < 3 ? (
        <button
          type="button"
          className="biz-add"
          onClick={() => onChange([
            ...cards,
            {
              id: `card-${Date.now()}`,
              hub,
              order: rows.length + 1,
              enabled: true,
              href: hub === 'domestic' ? '/business/domestic/projects' : '/business/overseas/projects',
              icon: 'education',
              locales: {
                ko: { title: '', description: '', buttonLabel: '자세히 보기' },
                en: { title: '', description: '', buttonLabel: 'Learn more' },
              },
            },
          ])}
        >
          + 카드 추가
        </button>
      ) : null}
      <p className="admin-panel__foot">{hub === 'domestic' ? '국내사업 소개' : '해외사업 소개'} 하단에 나옵니다. 게시하면 공개 페이지에 반영됩니다.</p>
    </div>
  )
}
