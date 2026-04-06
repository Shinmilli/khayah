import { useCallback, useEffect, useMemo, useRef } from 'react'
import { STORY_ITEMS } from '../homeRedesignData'

export function StorySection() {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const fillRef = useRef<HTMLDivElement | null>(null)
  const progressRef = useRef<HTMLDivElement | null>(null)

  const storyItems = useMemo(() => STORY_ITEMS, [])

  const updateStoryProgress = useCallback(() => {
    const storyTrack = trackRef.current
    const storyProgressFill = fillRef.current
    const storyProgress = progressRef.current
    if (!storyTrack || !storyProgressFill || !storyProgress) return

    const maxScroll = storyTrack.scrollWidth - storyTrack.clientWidth
    const trackW = storyProgress.clientWidth
    const fillW = storyProgressFill.getBoundingClientRect().width

    if (trackW <= 0) return

    if (maxScroll <= 0 || trackW <= fillW) {
      storyProgressFill.style.transform = 'translateX(0px)'
      return
    }

    const ratio = Math.max(0, Math.min(1, storyTrack.scrollLeft / maxScroll))
    const x = (trackW - fillW) * ratio
    storyProgressFill.style.transform = `translateX(${x}px)`
  }, [])

  useEffect(() => {
    const storyTrack = trackRef.current
    if (!storyTrack) return

    const onScroll = () => updateStoryProgress()
    storyTrack.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateStoryProgress)
    updateStoryProgress()

    return () => {
      storyTrack.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateStoryProgress)
    }
  }, [updateStoryProgress, storyItems.length])

  const scrollByStep = (direction: number) => {
    const track = trackRef.current
    if (!track) return
    const firstSlide = track.querySelector('.story-slide')
    if (!firstSlide) return
    const styles = window.getComputedStyle(track)
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0
    const step = firstSlide.getBoundingClientRect().width + gap
    track.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  useEffect(() => {
    const storyTrack = trackRef.current
    if (!storyTrack) return

    let isDown = false
    let startX = 0
    let startScrollLeft = 0

    const onDown = (clientX: number) => {
      isDown = true
      startX = clientX
      startScrollLeft = storyTrack.scrollLeft
    }
    const onMove = (e: PointerEvent) => {
      if (!isDown) return
      storyTrack.scrollLeft = startScrollLeft - (e.clientX - startX)
    }
    const onUp = () => {
      isDown = false
    }

    const pd = (e: PointerEvent) => {
      storyTrack.setPointerCapture?.(e.pointerId)
      onDown(e.clientX)
    }

    storyTrack.addEventListener('pointerdown', pd)
    storyTrack.addEventListener('pointermove', onMove)
    storyTrack.addEventListener('pointerup', onUp)
    storyTrack.addEventListener('pointercancel', onUp)
    storyTrack.addEventListener('pointerleave', onUp)

    return () => {
      storyTrack.removeEventListener('pointerdown', pd)
      storyTrack.removeEventListener('pointermove', onMove)
      storyTrack.removeEventListener('pointerup', onUp)
      storyTrack.removeEventListener('pointercancel', onUp)
      storyTrack.removeEventListener('pointerleave', onUp)
    }
  }, [])

  return (
    <section className="story-section" id="news" aria-label="스토리">
      <div className="story-container">
        <h2 className="impact-banner__title story-title">스토리</h2>
        <p className="impact-banner__sub story-sub">우리들이 전하는 이야기</p>

        <div className="story-slider">
          <div ref={trackRef} className="story-track" tabIndex={0} aria-label="스토리 목록">
            {storyItems.map((item) => (
              <article key={item.title} className="story-slide">
                <a className="story-card" href="#news">
                  <div className="story-card__media">
                    <img src={item.image} alt={item.alt} />
                  </div>
                  <div className="story-card__overlay" aria-hidden="true" />
                  <div className="story-card__content">
                    <span className="story-card__chip">{item.chip}</span>
                    <h3 className="story-card__title">
                      <span className="story-card__title-inner">{item.title}</span>
                    </h3>
                    <p className="story-card__text">{item.text}</p>
                  </div>
                </a>
              </article>
            ))}
          </div>

          <div className="story-controls" aria-label="스토리 슬라이더 컨트롤">
            <div ref={progressRef} className="story-progress" aria-hidden="true">
              <div ref={fillRef} className="story-progress__fill" />
            </div>
            <button type="button" className="story-nav story-nav--prev" aria-label="이전 스토리" onClick={() => scrollByStep(-1)}>
              <span aria-hidden="true">‹</span>
            </button>
            <button type="button" className="story-nav story-nav--next" aria-label="다음 스토리" onClick={() => scrollByStep(1)}>
              <span aria-hidden="true">›</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
