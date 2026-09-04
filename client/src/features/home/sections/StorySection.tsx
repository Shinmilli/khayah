import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPostsByKind } from '../../../services/api'
import type { Post } from '../../../types/post'
import { useLocale } from '../../../i18n/LocaleContext'

export function StorySection() {
  const { messages, localize } = useLocale()
  const m = messages.home.story
  const trackRef = useRef<HTMLDivElement | null>(null)
  const fillRef = useRef<HTMLDivElement | null>(null)
  const progressRef = useRef<HTMLDivElement | null>(null)
  const [posts, setPosts] = useState<Post[]>([])

  /** 최대 8장 — 마지막(8번째)은 실제 스토리 카드 위에 반투명 CTA 오버레이 */
  const storyItems = useMemo(() => posts.slice(0, 8), [posts])

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
      // 카드 전체가 <Link>라서, 여기서 포인터 캡처를 걸면 클릭이 트랙으로 가버려
      // 내비게이션(click)이 발생하지 않는 경우가 있습니다.
      const raw = e.target as Node | null
      const el = raw instanceof Element ? raw : raw?.parentElement
      if (el && storyTrack.contains(el) && el.closest('a')) return

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

  useEffect(() => {
    let cancelled = false
    fetchPostsByKind('스토리', 1, 50)
      .then((res) => {
        if (!cancelled) setPosts(res.posts)
      })
      .catch(() => {
        if (!cancelled) setPosts([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const storyCoverSrc = (p: Post): string => p.meta?.khayah_cover_url?.trim() ?? ''

  const chipLabel = (p: Post): string => {
    const scope = p.meta?.khayah_story_scope ?? ''
    switch (scope) {
      case '국내':
        return m.chip.domestic
      case '해외':
        return m.chip.overseas
      case '옹호':
        return m.chip.advocacy
      case '지원':
      case '진행':
        return m.chip.support
      default:
        return m.chip.default
    }
  }

  return (
    <section className="story-section" id="news" aria-label={m.aria}>
      <div className="story-container">
        <h2 className="impact-banner__title story-title">{m.title}</h2>
        <p className="impact-banner__sub story-sub">{m.subtitle}</p>

        <div className="story-slider">
          <div ref={trackRef} className="story-track" tabIndex={0} aria-label={m.listAria}>
            {storyItems.map((p, idx) => {
              const isLastCta = idx === storyItems.length - 1
              const cardInner = (
                <>
                  <div className="story-card__media">
                    {storyCoverSrc(p) ? <img src={storyCoverSrc(p)} alt="" loading="lazy" /> : null}
                  </div>
                  <div className="story-card__overlay" aria-hidden="true" />
                  <div className="story-card__content">
                    <span className="story-card__chip">{chipLabel(p)}</span>
                    <h3 className="story-card__title">
                      <span className="story-card__title-inner">{p.title}</span>
                    </h3>
                    <p className="story-card__text">{p.excerpt || ''}</p>
                  </div>
                </>
              )
              return (
                <article key={p.id} className="story-slide">
                  {isLastCta ? (
                    <div className="story-card-wrap story-card-wrap--cta">
                      <div className="story-card story-card--under" aria-hidden="true">
                        {cardInner}
                      </div>
                      <Link
                        className="story-card__cta-layer"
                        to={localize('/stories')}
                        aria-label={m.moreAria(p.title)}
                      >
                        <span className="story-more__btn">
                          {m.more} <span aria-hidden="true">›</span>
                        </span>
                      </Link>
                    </div>
                  ) : (
                    <Link className="story-card" to={localize(`/posts/${encodeURIComponent(p.slug)}`)}>
                      {cardInner}
                    </Link>
                  )}
                </article>
              )
            })}
          </div>

          <div className="story-controls" aria-label={m.controls}>
            <div ref={progressRef} className="story-progress" aria-hidden="true">
              <div ref={fillRef} className="story-progress__fill" />
            </div>
            <button type="button" className="story-nav story-nav--prev" aria-label={m.prev} onClick={() => scrollByStep(-1)}>
              <span aria-hidden="true">‹</span>
            </button>
            <button type="button" className="story-nav story-nav--next" aria-label={m.next} onClick={() => scrollByStep(1)}>
              <span aria-hidden="true">›</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
