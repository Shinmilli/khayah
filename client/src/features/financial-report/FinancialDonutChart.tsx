import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react'
import type { FinancialReportSegment } from './financialReportTypes'

const CX = 160
const CY = 160
const R_OUT = 102
const R_IN = 64
/** 두 줄 라벨(큰 % + 항목명) 기준 최소 간격 */
const LABEL_MIN_GAP = 38
const ELBOW_BASE = 34
/** 기타수입·모금비용 등 아주 작은 조각은 라벨·안내선을 왼쪽으로 꺾음 */
const FORCE_LEFT_PERCENT = 1.2

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

function resolveLabelCollisions(drafts: LabelDraft[]): LabelItem[] {
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

  return withPos.map((d) => {
    const yElbow = d.ty - 4
    /** 오른쪽 라벨: 아래로 꺾이면 도넛과 겹침 → 림에서 텍스트 방향으로 수평선만 */
    const poly = d.right
      ? `M ${d.p0.x} ${d.p0.y} L ${d.p1.x} ${d.p1.y} L ${Math.max(d.p1.x + 6, d.tx - 2)} ${d.p1.y}`
      : `M ${d.p0.x} ${d.p0.y} L ${d.p1.x} ${d.p1.y} L ${d.elbowX} ${d.p1.y} L ${d.elbowX} ${yElbow}`
    return {
      key: d.key,
      poly,
      tx: d.tx,
      ty: d.ty,
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
}

export function FinancialDonutChart({ year, kind, segments, totalFormatted }: Props) {
  const gid = useId()
  const wrapRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const [playKey, setPlayKey] = useState(0)
  const prevInViewRef = useRef(false)
  const skipDataBumpRef = useRef(true)

  const segmentKey = useMemo(() => segments.map((s) => `${s.id}:${s.percent}:${s.color}`).join('|'), [segments])

  const title = kind === 'income' ? '수입총액' : '지출총액'

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

    const labelsArr = resolveLabelCollisions(drafts)
    return { paths: pathsArr, labels: labelsArr }
  }, [segments])

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
        viewBox="0 -16 320 400"
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
          <text x={CX} y={CY + 10} textAnchor="middle" className="financial-donut__center-label">
            {title}
          </text>
          <text x={CX} y={CY + 34} textAnchor="middle" className="financial-donut__center-amount">
            {totalFormatted}
          </text>
        </g>
        {labels.map((g, i) => (
          <g
            key={g.key}
            className="financial-donut__label-group"
            style={{ ['--fr-lindex' as string]: i }}
            aria-label={`${g.pctNum}퍼센트 ${g.labelName}`}
          >
            <path d={g.poly} fill="none" className="financial-donut__guide" stroke={g.guideColor} />
            <text x={g.tx} y={g.ty} textAnchor={g.anchor} className="financial-donut__label-pct">
              <tspan className="financial-donut__label-pct-num">{g.pctNum}</tspan>
              <tspan className="financial-donut__label-pct-sign" dy="-0.55em" dx="0.08em">
                %
              </tspan>
            </text>
            <text x={g.tx} y={g.ty + 22} textAnchor={g.anchor} className="financial-donut__label-name">
              {g.labelName}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  )
}
