import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { pageHeroImageForPath } from '../constants/pageHeroImages'
import { PATH } from '../i18n/routes'
import { fetchPostsByKind } from '../services/api'
import type { Post } from '../types/post'
import '../styles/page.css'

function formatNoticeDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = d.getMonth() + 1
  const day = d.getDate()
  return `${y}년 ${m}월 ${day}일`
}

function ClockIcon() {
  return (
    <svg className="notice-archive__clock" width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 7v5l3 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function NoticeArchivePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchPostsByKind('공지사항', 1, 50)
      .then((res) => {
        if (!cancelled) setPosts(res.posts)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    document.title = '공지사항 | 사단법인 카야 인터내셔널'
    return () => {
      document.title = '사단법인 카야 인터내셔널 | 개발NGO'
    }
  }, [])

  return (
    <div className="page-content-wrapper notice-archive-page">
      <PageHero title="공지사항" backgroundImageUrl={pageHeroImageForPath(PATH.newsAnnouncements)} />
      <div className="section">
        <div className="section_wrapper clearfix">
          <div className="column one">
            {loading && <p className="notice-archive__status">불러오는 중…</p>}
            {error && (
              <p className="notice-archive__status notice-archive__status--error">
                목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
              </p>
            )}

            {!loading && !error && posts.length === 0 && (
              <p className="notice-archive__status">등록된 공지가 없습니다.</p>
            )}

            {!loading && !error && posts.length > 0 && (
              <ul className="notice-archive__list">
                {posts.map((post) => (
                  <li key={post.id} className="notice-archive__item">
                    <Link to={`/posts/${encodeURIComponent(post.slug)}`} className="notice-archive__link">
                      <h2 className="notice-archive__title">{post.title}</h2>
                      <div className="notice-archive__date">
                        <ClockIcon />
                        <time dateTime={post.publishedAt}>{formatNoticeDate(post.publishedAt)}</time>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
