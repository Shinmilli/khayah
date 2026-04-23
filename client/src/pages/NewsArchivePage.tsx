import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { normalizePathKey } from '../constants/pagesContent'
import { fetchPostsByKind } from '../services/api'
import type { Post } from '../types/post'
import '../styles/page.css'

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = d.getMonth() + 1
  const day = d.getDate()
  return `${y}년 ${m}월 ${day}일`
}

function usePathKey(): string {
  const location = useLocation()
  return useMemo(() => normalizePathKey(location.pathname), [location.pathname])
}

export function NewsArchivePage() {
  const pathKey = usePathKey()

  const { kind, title } = useMemo(() => {
    if (pathKey === '소식/활동소식') return { kind: '활동소식', title: '활동소식' }
    if (pathKey === '소식/연간소식지') return { kind: '연간소식지', title: '연간소식지' }
    if (pathKey === '소식/언론보도') return { kind: '언론보도', title: '언론보도' }
    return { kind: '공지사항', title: '공지사항' }
  }, [pathKey])

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)
    fetchPostsByKind(kind, 1, 100)
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
  }, [kind])

  useEffect(() => {
    document.title = `${title} | 사단법인 카야 인터내셔널`
    return () => {
      document.title = '사단법인 카야 인터내셔널 | 개발NGO'
    }
  }, [title])

  return (
    <div className="page-content-wrapper notice-archive-page">
      <PageHero title={title} />
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
              <p className="notice-archive__status">등록된 글이 없습니다.</p>
            )}

            {!loading && !error && posts.length > 0 && (
              <ul className="notice-archive__list" aria-label={`${title} 목록`}>
                {posts.map((post) => (
                  <li key={post.id} className="notice-archive__item">
                    <Link to={`/posts/${encodeURIComponent(post.slug)}`} className="notice-archive__link">
                      <div className="notice-archive__date">
                        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                      </div>
                      <h2 className="notice-archive__title">{post.title}</h2>
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

