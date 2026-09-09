import { useEffect, useState } from 'react'
import { BLOG_URL, INSTAGRAM_URL } from '../../../constants'
import { PROMO_YOUTUBE_CHANNEL_URL } from '../../../constants/youtube'
import { fetchSocialLatest, fetchYoutubeLatest } from '../../../services/api'
import type { SocialPreview } from '../../../types/social'
import type { YoutubeLatestVideo } from '../../../types/youtube'
import { useLocale } from '../../../i18n/LocaleContext'

function formatPublished(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

const NAVER_BLOG_MARK = '/images/social/naver-blog.svg'

function ChannelCard({
  href,
  variant,
  fallbackTitle,
  fallbackDesc,
  preview,
  latestLabel,
}: {
  href: string
  variant: 'blog' | 'instagram'
  fallbackTitle: string
  fallbackDesc: string
  preview: SocialPreview | null
  latestLabel: string
}) {
  const title = preview?.title?.trim() || fallbackTitle
  const desc = preview?.description?.trim() || fallbackDesc
  const image = preview?.image
  const date = preview?.publishedAt ? formatPublished(preview.publishedAt) : ''
  const link = preview?.url || href
  const hasLatest = Boolean(preview?.publishedAt)
  const [imgFailed, setImgFailed] = useState(false)
  const showPhoto = Boolean(image) && !imgFailed
  const showBlogMark = variant === 'blog' && !showPhoto

  useEffect(() => {
    setImgFailed(false)
  }, [image])

  return (
    <a
      className={`board-channel__card board-channel__card--${variant}${showPhoto ? ' has-photo' : ''}${showBlogMark ? ' has-brand-mark' : ''}`}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {showPhoto ? (
        <img
          className="board-channel__photo"
          src={image ?? ''}
          alt=""
          onError={() => setImgFailed(true)}
        />
      ) : null}
      {showBlogMark ? (
        <span className="board-channel__brand-mark" aria-hidden="true">
          <img src={NAVER_BLOG_MARK} alt="" />
        </span>
      ) : null}
      <span className="board-channel__copy">
        {hasLatest ? <span className="board-channel__kicker">{latestLabel}</span> : null}
        <span className="board-channel__brand">{title}</span>
        {desc ? <span className="board-channel__desc">{desc}</span> : null}
        {date ? <span className="board-channel__date">{date}</span> : null}
      </span>
    </a>
  )
}

export function BoardSection() {
  const { messages } = useLocale()
  const m = messages.home.board
  const [promo, setPromo] = useState<YoutubeLatestVideo | null>(null)
  const [promoError, setPromoError] = useState(false)
  const [blog, setBlog] = useState<SocialPreview | null>(null)
  const [instagram, setInstagram] = useState<SocialPreview | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchYoutubeLatest()
      .then((data) => {
        if (!cancelled) setPromo(data)
      })
      .catch(() => {
        if (!cancelled) setPromoError(true)
      })
    fetchSocialLatest()
      .then((data) => {
        if (cancelled) return
        setBlog(data.blog)
        setInstagram(data.instagram)
      })
      .catch(() => {
        /* 정적 카드 문구로 표시 */
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="board-section" aria-label={m.youtubeTitle}>
      <div className="board-grid">
        <article className="board-column board-channel">
          <div className="board-head">
            <h2 className="board-head__title">{m.blogTitle}</h2>
            <a
              className="board-more"
              href={BLOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={m.blogAria}
            >
              +
            </a>
          </div>
          <ChannelCard
            href={BLOG_URL}
            variant="blog"
            fallbackTitle="Naver Blog"
            fallbackDesc={m.blogDesc}
            preview={blog}
            latestLabel={m.latestLabel}
          />
        </article>

        <article className="board-column board-channel">
          <div className="board-head">
            <h2 className="board-head__title">{m.instagramTitle}</h2>
            <a
              className="board-more"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={m.instagramAria}
            >
              +
            </a>
          </div>
          <ChannelCard
            href={INSTAGRAM_URL}
            variant="instagram"
            fallbackTitle="Instagram"
            fallbackDesc={m.instagramDesc}
            preview={instagram}
            latestLabel={m.latestLabel}
          />
        </article>

        <article className="board-column board-channel">
          <div className="board-head">
            <h2 className="board-head__title">{m.youtubeTitle}</h2>
            <a
              className="board-more"
              href={PROMO_YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={m.promoMoreAria}
            >
              +
            </a>
          </div>
          <div className="promo-video">
            <div className="promo-video__player">
              {promo ? (
                <iframe
                  className="promo-video__embed"
                  src={`https://www.youtube-nocookie.com/embed/${promo.videoId}`}
                  title={promo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : promoError ? (
                <div className="promo-video__fallback">
                  <p className="promo-video__fallback-text">{m.promoError}</p>
                  <a href={PROMO_YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
                    {m.watchOnYoutube}
                  </a>
                </div>
              ) : (
                <div className="promo-video__skeleton" aria-hidden="true" />
              )}
            </div>
            <div className="promo-video__caption">
              <span className="promo-video__title">
                {promo?.title ?? (promoError ? m.youtubeTitle : m.promoLoading)}
              </span>
              <span className="promo-video__date">
                {promo ? formatPublished(promo.publishedAt) : promoError ? '' : '—'}
              </span>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
