import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react'
import type { FinancialReportSegment } from './financialReportTypes'

const CX = 160
const CY = 160
const R_OUT = 102
const R_IN = 64
/** 두 줄 라벨(큰 % + 항목명) 기준 최소 간격 */
const LABEL_MIN_GAP = 38
/** 같은 편(좌/우) 안내선 세로 구간이 서로 붙지 않도록 할 최소 x 간격 */
const GUIDE_MIN_X_GAP = 14
const ELBOW_BASE = 34
/** 기타수입·모금비용 등 아주 작은 조각은 라벨·안내선을 왼쪽으로 꺾음 */
const FORCE_LEFT_PERCENT = 1.2

const GUIDE_TEMPLATE_IDS = new Set([
  'misc',
  'brought_forward',
  'subsidy',
  'donation',
  'fundraising',
  'carried_next',
  'admin',
  'programs',
])

/**
 * 관리자 저장본이 seg-uuid여도 항목명으로 표준 키 복구 → 안내선 분기가 적용되도록 함.
 */
function guideSegmentKey(segmentId: string, label: string): string {
  if (GUIDE_TEMPLATE_IDS.has(segmentId)) return segmentId
  const t = label.trim()
  if (t.includes('차기이월금')) return 'carried_next'
  if (t.includes('전기이월금')) return 'brought_forward'
  if (t.includes('보조금')) return 'subsidy'
  if (t.includes('기부금')) return 'donation'
  if (t.includes('기타수입')) return 'misc'
  if (t.includes('모금비용')) return 'fundraising'
  if (t.includes('일반관리비')) return 'admin'
  if (t.includes('사업수행')) return 'programs'
  return segmentId
}

/** 오른쪽일 때 림→바깥→수평 한 줄(차기이월금형). 왼쪽 등은 rim→수평→수직(일반관리비형) */
function usesShelfHorizontalRight(key: string, right: boolean): boolean {
  return right && (key === 'carried_next' || key === 'brought_forward' || key === 'subsidy')
}

function usesRimHorizontalVertical(key: string): boolean {
  return key === 'admin' || key === 'brought_forward' || key === 'subsidy'
}

/**
 * 수입 차트는 지출 안내선 규칙 테이블을 그대로 쓰되, 항목 id만 지출 쪽으로 치환.
 * 지출(kind===expense)일 때는 치환 없음.
 * 기부금(`donation`)은 아래에서 별도 처리(수평으로만 마무리 — 마지막 수직 꺾임 없음).
 */
function resolvedExpenseGuideKey(kind: 'income' | 'expense', segmentKey: string): string {
  if (kind !== 'income') return segmentKey
  switch (segmentKey) {
    case 'misc':
      return 'fundraising'
    /** 전기이월금 → 차기이월금과 동일 규칙(shelf / default) */
    case 'brought_forward':
      return 'carried_next'
    default:
      return segmentKey
  }
}

/** 세로 elbow 간격 보정에서 제외 — 수평 shelf·수입 기부금(수평만) */
function excludesVerticalElbowStagger(kind: 'income' | 'expense', d: LabelDraft): boolean {
  const canon = guideSegmentKey(d.key, d.labelName)
  const gKey = resolvedExpenseGuideKey(kind, canon)
  if (usesShelfHorizontalRight(gKey, d.right)) return true
  if (kind === 'income' && canon === 'donation') return true
  return false
}

function polar(cx: number, cy: number, r: number, angleRad: number) {
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  }
}

function donutSlicePath(cx: number, cy: number, rInner: number, rOuter: number, startRad: number, endRad: number) {
  const p1 = polar(cx, cy, rOuter, startRad)
  const p2 = polar(cx, cy, rOuter, endRad)
  const p3 = polar(cx, cy, rInner, endRad)
  const p4 = polar(cx, cy, rInner, startRad)
  const largeArc = endRad - startRad > Math.PI ? 1 : 0
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${p4.x} ${p4.y}`,
    'Z',
  ].join(' ')
}

type LabelItem = {
  key: string
  poly: string
  tx: number
  ty: number
  /** 수평 안내선 y (림에서 꺾인 뒤 수평 구간) — 이월금 라벨을 선에 맞출 때 사용 */
  shelfY: number
  /** 오른쪽 shelf형 안내선일 때 %를 shelfY에 맞춤 (보조금 등) */
  alignPctToShelf: boolean
  anchor: 'start' | 'end'
  pctNum: string
  labelName: string
  guideColor: string
}

type LabelDraft = {
  key: string
  mid: number
  p0: { x: number; y: number }
  p1: { x: number; y: number }
  elbowX: number
  right: boolean
  anchor: 'start' | 'end'
  pctNum: string
  labelName: string
  guideColor: string
}

function wrapAngleDiff(a: number, b: number): number {
  let d = b - a
  while (d > Math.PI) d -= Math.PI * 2
  while (d < -Math.PI) d += Math.PI * 2
  return Math.abs(d)
}

function resolveLabelCollisions(drafts: LabelDraft[], kind: 'income' | 'expense'): LabelItem[] {
  if (drafts.length === 0) return []

  const withPos = drafts.map((d) => ({
    ...d,
    ty: d.p1.y + 4,
    tx: d.elbowX + (d.right ? 6 : -6),
  }))

  for (let pass = 0; pass < 2; pass++) {
    for (const right of [true, false]) {
      const side = withPos.filter((d) => d.right === right).sort((a, b) => a.ty - b.ty)
      for (let i = 1; i < side.length; i++) {
        if (side[i].ty - side[i - 1].ty < LABEL_MIN_GAP) {
          side[i].ty = side[i - 1].ty + LABEL_MIN_GAP
        }
      }
    }

    const angleSorted = [...withPos].sort((a, b) => a.mid - b.mid)
    for (let i = 1; i < angleSorted.length; i++) {
      const prev = angleSorted[i - 1]
      const cur = angleSorted[i]
      if (wrapAngleDiff(prev.mid, cur.mid) > 0.52) continue
      if (cur.ty - prev.ty < LABEL_MIN_GAP) {
        cur.ty = prev.ty + LABEL_MIN_GAP
      }
    }
  }

  /** 안내선 세로 구간(elbowX) 보정 — 오른쪽 수평 shelf형(차기·전기·보조)은 예외 */
  for (const right of [true, false]) {
    const side = withPos
      .filter((d) => d.right === right && !excludesVerticalElbowStagger(kind, d))
      .sort((a, b) => a.elbowX - b.elbowX)
    for (let i = 1; i < side.length; i++) {
      const minX = side[i - 1].elbowX + GUIDE_MIN_X_GAP
      if (side[i].elbowX < minX) side[i].elbowX = minX
    }
  }

  for (const d of withPos) {
    d.tx = d.elbowX + (d.right ? 6 : -6)
  }

  return withPos.map((d) => {
    const yElbow = d.ty - 4
    /** 오른쪽 차기·전기·보조: 림→바깥→텍스트 방향 수평 한 줄 */
    const polyShelfHorizRight = `M ${d.p0.x} ${d.p0.y} L ${d.p1.x} ${d.p1.y} L ${Math.max(d.p1.x + 6, d.tx - 2)} ${d.p1.y}`
    /** 전기·보조(왼쪽)·일반관리비: 도넛 외곽에서 수평 → elbow에서 수직 */
    const rimHV = polar(CX, CY, R_OUT + 2, d.mid)
    const polyRimHV = `M ${rimHV.x} ${rimHV.y} L ${d.elbowX} ${rimHV.y} L ${d.elbowX} ${yElbow}`
    const polyDefault = `M ${d.p0.x} ${d.p0.y} L ${d.p1.x} ${d.p1.y} L ${d.elbowX} ${d.p1.y} L ${d.elbowX} ${yElbow}`
    const canon = guideSegmentKey(d.key, d.labelName)
    const gKey = resolvedExpenseGuideKey(kind, canon)
    let poly: string
    if (kind === 'income' && canon === 'donation' && d.right) {
      /** 전기이월금형: 바깥→수평만, 마지막 아래 수직 없음 */
      poly = polyShelfHorizRight
    } else if (kind === 'income' && canon === 'donation' && !d.right) {
      /** 왼쪽 기부금: 림에서 텍스트 방향 수평 한 줄만 */
      poly = `M ${rimHV.x} ${rimHV.y} L ${Math.min(rimHV.x - 6, d.tx + 2)} ${rimHV.y}`
    } else if (usesShelfHorizontalRight(gKey, d.right)) {
      poly = polyShelfHorizRight
    } else if (usesRimHorizontalVertical(gKey)) {
      poly = polyRimHV
    } else {
      poly = polyDefault
    }
    return {
      key: d.key,
      poly,
      tx: d.tx,
      ty: d.ty,
      shelfY: d.p1.y,
      alignPctToShelf:
        (kind === 'income' && canon === 'donation' && d.right) ||
        usesShelfHorizontalRight(gKey, d.right),
      anchor: d.anchor,
      pctNum: d.pctNum,
      labelName: d.labelName,
      guideColor: d.guideColor,
    }
  })
}

type Props = {
  year: number
  kind: 'income' | 'expense'
  segments: FinancialReportSegment[]
  totalFormatted: string
  incomeTitle?: string
  expenseTitle?: string
}

export function FinancialDonutChart({ year, kind, segments, totalFormatted, incomeTitle, expenseTitle }: Props) {
  const gid = useId()
  const wrapRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const [playKey, setPlayKey] = useState(0)
  const prevInViewRef = useRef(false)
  const skipDataBumpRef = useRef(true)

  const segmentKey = useMemo(() => segments.map((s) => `${s.id}:${s.percent}:${s.color}`).join('|'), [segments])

  const title = kind === 'income' ? (incomeTitle ?? '수입총액') : (expenseTitle ?? '지출총액')

  const { centerAmountNum, centerAmountWon } = useMemo(() => {
    if (totalFormatted.endsWith('원')) {
      return { centerAmountNum: totalFormatted.slice(0, -1), centerAmountWon: '원' }
    }
    return { centerAmountNum: totalFormatted, centerAmountWon: '' }
  }, [totalFormatted])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(!!entry?.isIntersecting)
      },
      { threshold: 0.18, rootMargin: '0px 0px -4% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [segmentKey, year, kind])

  useEffect(() => {
    if (!inView) {
      prevInViewRef.current = false
      return
    }
    if (!prevInViewRef.current) {
      setPlayKey((k) => k + 1)
    }
    prevInViewRef.current = true
  }, [inView])

  useEffect(() => {
    if (!inView) return
    if (skipDataBumpRef.current) {
      skipDataBumpRef.current = false
      return
    }
    setPlayKey((k) => k + 1)
  }, [segmentKey, year, kind, inView])

  const { paths, labels } = useMemo(() => {
    const startBase = -Math.PI / 2
    let acc = 0
    const pathsArr: Array<{ d: string; color: string; key: string }> = []
    const drafts: LabelDraft[] = []

    for (const seg of segments) {
      const frac = seg.percent / 100
      const a0 = startBase + acc * Math.PI * 2
      const a1 = startBase + (acc + frac) * Math.PI * 2
      const mid = (a0 + a1) / 2
      pathsArr.push({
        key: seg.id,
        d: donutSlicePath(CX, CY, R_IN, R_OUT, a0, a1),
        color: seg.color,
      })

      const p0 = polar(CX, CY, R_OUT + 2, mid)
      const p1 = polar(CX, CY, R_OUT + 18, mid)
      const forceLeft = seg.percent < FORCE_LEFT_PERCENT
      const right = forceLeft ? false : Math.cos(mid) >= 0
      const elbowExtra = seg.percent < 2 ? 20 : seg.percent < 6 ? 10 : 0
      const elbow = ELBOW_BASE + elbowExtra
      const elbowX = p1.x + (right ? elbow : -elbow)
      const pct =
        seg.percent < 1 ? seg.percent.toFixed(2) : Number.isInteger(seg.percent) ? String(seg.percent) : seg.percent.toFixed(2)

      drafts.push({
        key: seg.id,
        mid,
        p0,
        p1,
        elbowX,
        right,
        anchor: right ? 'start' : 'end',
        pctNum: pct,
        labelName: seg.label,
        guideColor: seg.color,
      })

      acc += frac
    }

    const labelsArr = resolveLabelCollisions(drafts, kind)
    return { paths: pathsArr, labels: labelsArr }
  }, [segments, kind])

  const stepMs = 72
  const n = paths.length
  const cssVars: CSSProperties = {
    ['--fr-n' as string]: n,
    ['--fr-step' as string]: `${stepMs}ms`,
  }

  return (
    <figure ref={wrapRef} className="financial-donut" style={cssVars} aria-label={`${year}년 ${title} 구성`}>
      <svg
        key={String(playKey)}
        className="financial-donut__svg"
        viewBox="0 -16 320 372"
        role="img"
        aria-labelledby={`${gid}-t`}
      >
        <title id={`${gid}-t`}>
          {year}년 {title} {totalFormatted}
        </title>
        {paths.map((p, i) => (
          <g
            key={p.key}
            className="financial-donut__segment"
            style={{ ['--fr-index' as string]: i, transformOrigin: `${CX}px ${CY}px` }}
          >
            <g className="financial-donut__segment-hover" style={{ transformOrigin: `${CX}px ${CY}px` }}>
              <path d={p.d} fill={p.color} stroke="#fff" strokeWidth="2" className="financial-donut__slice-path" />
            </g>
          </g>
        ))}
        <g className="financial-donut__center-wrap">
          <text x={CX} y={CY - 10} textAnchor="middle" className="financial-donut__center-year">
            {year}
          </text>
          <text x={CX} y={CY + 8} textAnchor="middle" className="financial-donut__center-label">
            {title}
          </text>
          <text x={CX} y={CY + 26} textAnchor="middle" className="financial-donut__center-amount">
            <tspan className="financial-donut__center-amount-num">{centerAmountNum}</tspan>
            {centerAmountWon ? <tspan className="financial-donut__center-amount-won">{centerAmountWon}</tspan> : null}
          </text>
        </g>
        {labels.map((g, i) => {
          /** 이월금류·오른쪽 shelf형(전기·보조 등): %를 수평 안내선(shelfY)에 맞춤 */
          const isCarryMoneyOnShelf =
            g.key === 'brought_forward' || g.key === 'carried_next' || g.labelName.includes('이월금')
          const pctOnShelf = isCarryMoneyOnShelf || g.alignPctToShelf
          const pctY = pctOnShelf ? g.shelfY + 1 : g.ty
          const nameY = pctY + 22
          return (
          <g
            key={g.key}
            className="financial-donut__label-group"
            style={{ ['--fr-lindex' as string]: i }}
            aria-label={`${g.pctNum}퍼센트 ${g.labelName}`}
          >
            <path d={g.poly} fill="none" className="financial-donut__guide" stroke={g.guideColor} />
            <text
              x={g.tx}
              y={pctY}
              textAnchor={g.anchor}
              fill={g.guideColor}
              className={`financial-donut__label-pct${pctOnShelf ? ' financial-donut__label-pct--onShelf' : ''}`}
            >
              <tspan className="financial-donut__label-pct-num">{g.pctNum}</tspan>
              <tspan className="financial-donut__label-pct-sign" dy="-0.55em" dx="0.08em">
                %
              </tspan>
            </text>
            <text x={g.tx} y={nameY} textAnchor={g.anchor} className="financial-donut__label-name">
              {g.labelName}
            </text>
          </g>
          )
        })}
      </svg>
    </figure>
  )
}
