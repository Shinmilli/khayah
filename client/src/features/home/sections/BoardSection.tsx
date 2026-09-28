import { useEffect, useState } from 'react'
import { BLOG_URL, INSTAGRAM_URL } from '../../../constants'
import { PROMO_YOUTUBE_CHANNEL_URL } from '../../../constants/youtube'
import { fetchYoutubeLatest } from '../../../services/api'
import type { YoutubeLatestVideo } from '../../../types/youtube'
import { useLocale } from '../../../i18n/LocaleContext'

const BLOG_CARD_IMAGE = '/images/home/board-blog.jpg'
const INSTAGRAM_CARD_IMAGE = '/images/home/board-instagram.jpg'

function formatPublished(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

function NaverBlogLockup() {
  return (
    <span className="naver-blog-lockup" aria-hidden="true">
      <svg className="naver-blog-lockup__mark" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="5" fill="#03C75A" />
        <path
          fill="#fff"
          transform="translate(-1 0)"
          d="M7.15 5.4h3.55l4.55 7.15V5.4h3.6v13.2h-3.55l-4.55-7.15v7.15H7.15V5.4z"
        />
      </svg>
      <span className="naver-blog-lockup__word">blog</span>
    </span>
  )
}

function ChannelCard({
  href,
  variant,
  image,
  title,
  desc,
}: {
  href: string
  variant: 'blog' | 'instagram'
  image: string
  title: string
  desc: string
}) {
  const showBlogMark = variant === 'blog'
  return (
    <a
      className={`board-channel__card board-channel__card--${variant} has-photo${showBlogMark ? ' has-brand-mark' : ''}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="board-channel__media">
        <img className="board-channel__photo" src={image} alt="" />
        {showBlogMark ? (
          <span className="board-channel__brand-mark" aria-hidden="true">
            <NaverBlogLockup />
          </span>
        ) : null}
      </span>
      <span className="board-channel__copy">
        <span className="board-channel__brand">{title}</span>
        {desc ? <span className="board-channel__desc">{desc}</span> : null}
      </span>
    </a>
  )
}

export function BoardSection() {
  const { messages } = useLocale()
  const m = messages.home.board
  const [promo, setPromo] = useState<YoutubeLatestVideo | null>(null)
  const [promoError, setPromoError] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchYoutubeLatest()
      .then((data) => {
        if (!cancelled) setPromo(data)
      })
      .catch(() => {
        if (!cancelled) setPromoError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="board-section" aria-label={m.aria}>
      <header className="home-section-intro">
        <p className="home-section-intro__kicker">{m.kicker}</p>
        <h2 className="home-section-intro__title">{m.title}</h2>
        <p className="home-section-intro__sub">{m.subtitle}</p>
      </header>

      <div className="board-grid">
        <article className="board-column board-channel">
          <div className="board-head">
            <h3 className="board-head__title">{m.blogTitle}</h3>
            <a
              className="board-more"
              href={BLOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={m.blogAria}
            >
              {m.more}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          <ChannelCard
            href={BLOG_URL}
            variant="blog"
            image={BLOG_CARD_IMAGE}
            title="Naver Blog"
            desc={m.blogDesc}
          />
        </article>

        <article className="board-column board-channel">
          <div className="board-head">
            <h3 className="board-head__title">{m.instagramTitle}</h3>
            <a
              className="board-more"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={m.instagramAria}
            >
              {m.more}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          <ChannelCard
            href={INSTAGRAM_URL}
            variant="instagram"
            image={INSTAGRAM_CARD_IMAGE}
            title="Instagram"
            desc={m.instagramDesc}
          />
        </article>

        <article className="board-column board-channel">
          <div className="board-head">
            <h3 className="board-head__title">{m.youtubeTitle}</h3>
            <a
              className="board-more"
              href={PROMO_YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={m.promoMoreAria}
            >
              {m.more}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="promo-video">
            <div className="board-channel__media promo-video__player">
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
