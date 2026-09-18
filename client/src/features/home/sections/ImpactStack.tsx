import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react'

const AUTO_ADVANCE_MS = 3800
const RESUME_AFTER_INTERACT_MS = 8000

function StackArrow({ dir }: { dir: 'up' | 'down' | 'left' | 'right' }) {
  const rotate = dir === 'up' ? 180 : dir === 'left' ? 90 : dir === 'right' ? -90 : 0
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" style={{ transform: `rotate(${rotate}deg)` }}>
      <path fill="currentColor" d="M7.4 9.2 12 13.8l4.6-4.6L18 10.6l-6 6-6-6z" />
    </svg>
  )
}

export function ImpactStack({
  items,
  visible,
  axis = 'y',
  className = '',
  ariaLabel,
  prevLabel,
  nextLabel,
}: {
  items: ReactNode[]
  visible: number
  axis?: 'x' | 'y'
  className?: string
  ariaLabel: string
  prevLabel: string
  nextLabel: string
}) {
  const slot = Math.max(1, visible)
  const maxStart = Math.max(0, items.length - slot)
  const [start, setStart] = useState(0)
  const [paused, setPaused] = useState(false)
  const hoverCount = useRef(0)
  const interactPause = useRef(false)
  const resumeTimer = useRef(0)
  const clamped = Math.min(start, maxStart)
  const showControls = items.length > slot

  function syncPaused() {
    setPaused(hoverCount.current > 0 || interactPause.current)
  }

  function onHoverStart() {
    hoverCount.current += 1
    syncPaused()
  }

  function onHoverEnd() {
    hoverCount.current = Math.max(0, hoverCount.current - 1)
    syncPaused()
  }

  useEffect(() => {
    setStart((prev) => Math.min(prev, maxStart))
  }, [maxStart])

  useEffect(() => {
    return () => window.clearTimeout(resumeTimer.current)
  }, [])

  useEffect(() => {
    if (!showControls || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => {
      setStart((prev) => {
        const current = Math.min(prev, maxStart)
        return current >= maxStart ? 0 : current + 1
      })
    }, AUTO_ADVANCE_MS)
    return () => window.clearInterval(timer)
  }, [showControls, paused, maxStart])

  function pauseWhileIdleResets() {
    interactPause.current = true
    syncPaused()
    window.clearTimeout(resumeTimer.current)
    resumeTimer.current = window.setTimeout(() => {
      interactPause.current = false
      syncPaused()
    }, RESUME_AFTER_INTERACT_MS)
  }

  const prevBtn = (
    <button
      type="button"
      className="impact-stack__btn impact-stack__btn--prev"
      disabled={clamped <= 0}
      onClick={() => {
        pauseWhileIdleResets()
        setStart(clamped - 1)
      }}
      aria-label={prevLabel}
    >
      <StackArrow dir={axis === 'x' ? 'left' : 'up'} />
    </button>
  )

  const nextBtn = (
    <button
      type="button"
      className="impact-stack__btn impact-stack__btn--next"
      disabled={clamped >= maxStart}
      onClick={() => {
        pauseWhileIdleResets()
        setStart(clamped + 1)
      }}
      aria-label={nextLabel}
    >
      <StackArrow dir={axis === 'x' ? 'right' : 'down'} />
    </button>
  )

  return (
    <div
      className={`impact-stack impact-stack--${axis}${showControls ? ' impact-stack--paged' : ''} ${className}`.trim()}
      style={{ '--visible': slot } as CSSProperties}
    >
      <div
        className="impact-stack__viewport"
        role="list"
        aria-label={ariaLabel}
        onPointerEnter={onHoverStart}
        onPointerLeave={onHoverEnd}
      >
        <div
          className="impact-stack__track"
          style={{
            transform:
              axis === 'x'
                ? `translateX(calc(-${clamped} * (var(--card-basis, 100cqw) + var(--stack-gap, 12px))))`
                : `translateY(calc(-${clamped} * ((100cqh - (var(--visible) - 1) * var(--stack-gap, 12px)) / var(--visible) + var(--stack-gap, 12px))))`,
          }}
        >
          {items}
        </div>
      </div>
      {showControls ? (
        <div className="impact-stack__controls" onPointerEnter={onHoverStart} onPointerLeave={onHoverEnd}>
          {prevBtn}
          {nextBtn}
        </div>
      ) : null}
    </div>
  )
}
