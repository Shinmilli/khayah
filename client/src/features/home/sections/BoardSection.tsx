import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PROMO_YOUTUBE_CHANNEL_URL } from '../../../constants/youtube'
import { fetchPostsByKind, fetchYoutubeLatest } from '../../../services/api'
import type { YoutubeLatestVideo } from '../../../types/youtube'
import type { Post } from '../../../types/post'

function formatPublished(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

export function BoardSection() {
  const [promo, setPromo] = useState<YoutubeLatestVideo | null>(null)
  const [promoError, setPromoError] = useState(false)
  const [notices, setNotices] = useState<Post[]>([])
  const [noticeError, setNoticeError] = useState(false)

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

  useEffect(() => {
    let cancelled = false
    fetchPostsByKind('공지사항', 1, 5)
      .then((res) => {
        if (!cancelled) setNotices(res.posts)
      })
      .catch(() => {
        if (!cancelled) setNoticeError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="board-section">
      <div className="board-grid">
        <div className="board-column board-column--notice">
          <div className="board-head">
            <h2 className="board-head__title">Notice</h2>
            <span className="board-head__badge" aria-hidden="true">
              공지글
            </span>
            <Link className="board-more" to="/소식/공지사항" aria-label="더보기">
              +
            </Link>
          </div>

          <div className="board-list" role="list" aria-label="공지글 목록">
            {noticeError ? (
              <article className="board-item board-item--notice" role="listitem">
                <h3 className="board-item__title">공지사항을 불러오지 못했습니다.</h3>
              </article>
            ) : notices.length === 0 ? (
              <article className="board-item board-item--notice" role="listitem">
                <h3 className="board-item__title">등록된 공지사항이 없습니다.</h3>
              </article>
            ) : (
              notices.map((post) => (
                <article key={post.id} className="board-item board-item--notice" role="listitem">
                  <Link to={`/posts/${encodeURIComponent(post.slug)}`} className="board-item__title">
                    {post.title}
                  </Link>
                  <div className="board-item__meta">
                    <span className="board-item__date">{formatPublished(post.publishedAt)}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="board-column promo-column">
          <div className="board-head board-head--promo">
            <h2 className="board-head__title">홍보영상</h2>
            <a
              className="board-more"
              href={PROMO_YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="유튜브 채널에서 홍보영상 더보기"
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
                  <p className="promo-video__fallback-text">영상을 불러오지 못했습니다.</p>
                  <a href={PROMO_YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
                    유튜브 채널에서 보기
                  </a>
                </div>
              ) : (
                <div className="promo-video__skeleton" aria-hidden="true" />
              )}
            </div>
            <div className="promo-video__caption">
              <span className="promo-video__title">
                {promo?.title ?? (promoError ? '홍보영상' : '불러오는 중…')}
              </span>
              <span className="promo-video__date">
                {promo ? formatPublished(promo.publishedAt) : promoError ? '' : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
