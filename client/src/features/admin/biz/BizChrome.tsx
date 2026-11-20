import type { ReactNode } from 'react'
import type { BizPanel } from '../../biz/bizSupportTypes'

export function BizHead({
  title,
  note,
  enabled = true,
  onUp,
  onDown,
  onToggle,
  children,
  trailing,
}: {
  title: string
  note?: string
  enabled?: boolean
  onUp?: () => void
  onDown?: () => void
  onToggle?: () => void
  children?: ReactNode
  trailing?: ReactNode
}) {
  return (
    <div className="admin-panel__head biz-phd">
      <h2 className="admin-panel__title">
        {title}
        {note ? <small className="biz-pt-note">{note}</small> : null}
      </h2>
      <div className="biz-ctl">
        {children}
        {onUp || onDown ? (
          <>
            <span>순서</span>
            <button type="button" className="biz-mv" aria-label="위로" onClick={onUp}>↑</button>
            <button type="button" className="biz-mv" aria-label="아래로" onClick={onDown}>↓</button>
          </>
        ) : null}
        {onToggle ? (
          <>
            <span>표시</span>
            <button type="button" className={`biz-tg${enabled ? ' is-on' : ''}`} aria-pressed={enabled} aria-label="표시" onClick={onToggle}>
              <span />
            </button>
          </>
        ) : null}
        {trailing}
      </div>
    </div>
  )
}

const BIZ_MARKS = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳'

export function bizMark(index: number): string {
  return BIZ_MARKS[index] ?? String(index + 1)
}

export function bizTitle(index: number, title: string): string {
  return `${bizMark(index)} ${title.replace(/^[①-⑳]\s*/, '')}`
}

function rankPanels(layout: BizPanel[] | undefined, ids: string[]): BizPanel[] {
  return ids
    .map((id, index) => {
      const found = layout?.find((row) => row.id === id)
      return {
        id,
        order: found?.order ?? index,
        enabled: found?.enabled !== false,
        removed: found?.removed === true,
      }
    })
    .sort((a, b) => a.order - b.order)
}

export function sortPanels<T extends { id: string }>(items: T[], layout: BizPanel[] | undefined): Array<T & { order: number; enabled: boolean; removed: boolean }> {
  return items
    .map((item, index) => {
      const found = layout?.find((row) => row.id === item.id)
      return { ...item, order: found?.order ?? index, enabled: found?.enabled !== false, removed: found?.removed === true }
    })
    .sort((a, b) => a.order - b.order)
}

export function movePanels(layout: BizPanel[] | undefined, ids: string[], id: string, dir: -1 | 1): BizPanel[] {
  const ranked = rankPanels(layout, ids)
  const visible = ranked.filter((row) => !row.removed)
  const index = visible.findIndex((row) => row.id === id)
  const nextIndex = index + dir
  const nextVisible = visible.slice()
  if (index >= 0 && nextIndex >= 0 && nextIndex < nextVisible.length) {
    const [row] = nextVisible.splice(index, 1)
    nextVisible.splice(nextIndex, 0, row)
  }
  return [...nextVisible, ...ranked.filter((row) => row.removed)].map((row, order) => ({ ...row, order }))
}

export function togglePanel(layout: BizPanel[] | undefined, ids: string[], id: string): BizPanel[] {
  return rankPanels(layout, ids).map((row, order) => ({
    ...row,
    order,
    enabled: row.id === id ? !row.enabled : row.enabled,
  }))
}

export function removePanel(layout: BizPanel[] | undefined, ids: string[], id: string): BizPanel[] {
  return rankPanels(layout, ids).map((row, order) => ({
    ...row,
    order,
    removed: row.id === id ? true : row.removed,
  }))
}

export function mergePanels(current: BizPanel[] | undefined, next: BizPanel[]): BizPanel[] {
  const ids = new Set(next.map((row) => row.id))
  return [...(current ?? []).filter((row) => row.id && !ids.has(row.id)), ...next]
}
