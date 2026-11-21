import { useEffect, useState } from 'react'
import { BLOG_URL, INSTAGRAM_URL } from '../../../constants'
import { PROMO_YOUTUBE_CHANNEL_URL } from '../../../constants/youtube'
import { fetchYoutubeLatest } from '../../../services/api'
import type { YoutubeLatestVideo } from '../../../types/youtube'
import { useLocale } from '../../../i18n/LocaleContext'
import { useSiteCommon } from '../../site/useSiteCommon'
import { youtubePosterUrl } from '../../../utils/postMedia'
import { normalizeHref } from '../../../utils/hrefs'

const BLOG_CARD_IMAGE = '/images/home/board-blog.jpg'
const INSTAGRAM_CARD_IMAGE = '/images/home/board-instagram.jpg'

export function BoardSection() {
  const { messages } = useLocale()
  const copy = messages.home.board
  const site = useSiteCommon()
  const channels = site?.homeStories
  const blogHref = normalizeHref(channels?.blog.href.trim() || BLOG_URL)
  const blogImage = channels?.blog.image.trim() || BLOG_CARD_IMAGE
  const instaHref = normalizeHref(channels?.instagram.href.trim() || INSTAGRAM_URL)
  const instaImage = channels?.instagram.image.trim() || INSTAGRAM_CARD_IMAGE
  const storedYoutubeImage = channels?.youtube.image.trim() || ''
  const storedYoutubeHref = normalizeHref(channels?.youtube.href.trim() || '')
  const [latest, setLatest] = useState<YoutubeLatestVideo | null>(null)

  useEffect(() => {
    if (storedYoutubeImage) return
    let cancelled = false
    fetchYoutubeLatest()
      .then((data) => {
        if (!cancelled) setLatest(data)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [storedYoutubeImage])

  const youtubeImage = storedYoutubeImage || (latest ? youtubePosterUrl(latest.videoId) : '')
  const youtubeHref = storedYoutubeHref || (latest ? `https://www.youtube.com/watch?v=${latest.videoId}` : PROMO_YOUTUBE_CHANNEL_URL)
  return (
    <section className="home-follow" aria-labelledby="home-follow-title">
      <p className="home-follow__kicker">{copy.kicker.toUpperCase()}</p>
      <h2 id="home-follow-title">{copy.title}</h2>
      <p className="home-follow__sub">{copy.subtitle}</p>
      <div className="home-follow__grid">
        <a href={blogHref} target="_blank" rel="noopener noreferrer">
          <img src={blogImage} alt="" />
          <p className="home-follow__name">{copy.blogTitle} ↗</p>
          <p>{copy.blogDesc}</p>
        </a>
        <a href={instaHref} target="_blank" rel="noopener noreferrer">
          <img src={instaImage} alt="" />
          <p className="home-follow__name">{copy.instagramTitle} ↗</p>
          <p>{copy.instagramDesc}</p>
        </a>
        <a href={youtubeHref} target="_blank" rel="noopener noreferrer">
          {youtubeImage ? <img src={youtubeImage} alt={latest?.title || ''} /> : <span className="home-follow__photo" aria-hidden="true" />}
          <p className="home-follow__name">{copy.youtubeTitle} ↗</p>
          <p>{copy.youtubeDesc}</p>
        </a>
      </div>
    </section>
  )
}
