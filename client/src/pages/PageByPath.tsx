import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { fetchPageBySlug, fetchPostBySlug } from '../services/api'
import { PAGES_STATIC, normalizePathKey, pathToSlug } from '../constants/pagesContent'
import type { Page } from '../types/page'
import type { Post } from '../types/post'
import { NewsArchivePage } from './NewsArchivePage'
import { PageHero } from '../components/PageHero'
import '../styles/page.css'
import '../styles/greeting-modern.css'
import '../styles/business-education.css'
import '../styles/business-domestic.css'
import '../styles/business-overseas.css'
import '../styles/business-overseas-education.css'
import '../styles/business-overseas-health.css'
import '../styles/business-advocacy.css'

function storyCtaForPathKey(pathKey: string): { label: string; to: string } | null {
  if (!pathKey) return null
  if (pathKey === '국내사업' || pathKey.startsWith('국내사업/')) {
    return { label: '국내 스토리 확인하기', to: '/stories/domestic' }
  }
  if (pathKey === '해외사업' || pathKey.startsWith('해외사업/')) {
    return { label: '해외 스토리 확인하기', to: '/stories/overseas' }
  }
  if (pathKey === '사업/옹호사업' || pathKey.startsWith('사업/옹호사업/')) {
    return { label: '옹호 스토리 확인하기', to: '/stories/advocacy' }
  }
  if (pathKey === '사업/진행사업' || pathKey.startsWith('사업/진행사업/')) {
    return { label: '지원 스토리 확인하기', to: '/stories/support' }
  }
  return null
}

export function PageByPath() {
  const location = useLocation()
  const pathKey = normalizePathKey(location.pathname)

  // Backward compatibility redirects (old slugs)
  if (pathKey === '소식/카야소식') return <Navigate to="/소식/활동소식" replace />
  if (pathKey === '소식/소식지') return <Navigate to="/소식/연간소식지" replace />
  if (pathKey === '카야/조직도') return <Navigate to="/카야/카야소개?tab=org#org-chart" replace />
  if (pathKey === '카야/이사회-전문위원') return <Navigate to="/카야/카야소개?tab=org#directors" replace />

  const isNewsArchive =
    pathKey === '소식/공지사항' || pathKey === '소식/활동소식' || pathKey === '소식/연간소식지' || pathKey === '소식/언론보도'

  const hashId = location.hash.replace(/^#/, '')
  const [apiPage, setApiPage] = useState<Page | null | undefined>(undefined)
  const [post, setPost] = useState<Post | null | undefined>(undefined)

  const isPostPath = pathKey.startsWith('posts/')
  const postSlug = isPostPath ? pathKey.replace(/^posts\/?/, '') : ''

  const staticPage = pathKey && !isPostPath ? PAGES_STATIC[pathKey] : null

  const slug = pathToSlug(location.pathname)

  useEffect(() => {
    if (isNewsArchive) {
      setApiPage(null)
      setPost(null)
      return
    }
    if (staticPage || !slug) {
      setApiPage(null)
      setPost(null)
      return
    }
    if (isPostPath && postSlug) {
      setApiPage(null)
      let cancelled = false
      fetchPostBySlug(postSlug)
        .then((p) => {
          if (!cancelled) setPost(p ?? null)
        })
        .catch(() => {
          if (!cancelled) setPost(null)
        })
      return () => { cancelled = true }
    }
    let cancelled = false
    setPost(null)
    fetchPageBySlug(slug)
      .then((p) => {
        if (!cancelled) setApiPage(p ?? null)
      })
      .catch(() => {
        if (!cancelled) setApiPage(null)
      })
    return () => { cancelled = true }
  }, [slug, staticPage, isPostPath, postSlug, isNewsArchive])

  const title = staticPage?.title ?? apiPage?.title ?? post?.title ?? null
  useEffect(() => {
    if (title) document.title = `${title} | 사단법인 카야 인터내셔널`
    return () => { document.title = '사단법인 카야 인터내셔널 | 개발NGO' }
  }, [title])

  useEffect(() => {
    if (!hashId) return
    const timer = window.setTimeout(() => {
      document.getElementById(hashId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
    return () => clearTimeout(timer)
  }, [hashId, pathKey, staticPage, apiPage])

  if (isNewsArchive) return <NewsArchivePage />

  if (post) {
    const kind = post.meta?.khayah_kind ?? ''
    const heroTitle =
      kind === '활동소식'
        ? '활동소식'
        : kind === '연간소식지'
          ? '연간소식지'
          : kind || '소식'
    return (
      <div className="page-content-wrapper">
        <PageHero title={heroTitle} />
        <div className="section">
          <div className="section_wrapper clearfix">
            <div className="column one">
              <div className="entry-meta" style={{ marginBottom: 16 }}>
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString('ko-KR')}
                </time>
                {post.author && <span> · {post.author.displayName}</span>}
              </div>
              <h1 className="entry-title" style={{ marginBottom: 18 }}>
                {post.title}
              </h1>
              <div
                className="the_content_wrapper page-body"
                dangerouslySetInnerHTML={{ __html: post.content || post.excerpt || '' }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (staticPage) {
    const storyCta = storyCtaForPathKey(pathKey)
    return (
      <div className="page-content-wrapper">
        <PageHero title={staticPage.title} showScrollHint={pathKey !== '카야/위치안내'} />
        <div className="section">
          <div className="section_wrapper clearfix">
            <div className="column one">
              <div
                className="the_content_wrapper page-body"
                dangerouslySetInnerHTML={{ __html: staticPage.content }}
              />
              {storyCta ? (
                <div className="page-story-cta">
                  <Link className="page-story-cta__btn" to={storyCta.to}>
                    {storyCta.label}
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (apiPage) {
    const storyCta = storyCtaForPathKey(pathKey)
    return (
      <div className="page-content-wrapper">
        <PageHero title={apiPage.title} />
        <div className="section">
          <div className="section_wrapper clearfix">
            <div className="column one">
              <div
                className="the_content_wrapper page-body"
                dangerouslySetInnerHTML={{ __html: apiPage.content || '' }}
              />
              {storyCta ? (
                <div className="page-story-cta">
                  <Link className="page-story-cta__btn" to={storyCta.to}>
                    {storyCta.label}
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const show404 =
    !staticPage &&
    ((isPostPath && post === null) || (!isPostPath && apiPage === null))

  if (show404) {
    return (
      <div className="page-content-wrapper">
        <PageHero title="페이지를 찾을 수 없습니다" />
        <div className="section">
          <div className="section_wrapper clearfix">
            <div className="column one">
              <p>요청하신 경로에 해당하는 페이지가 없거나 이동되었을 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content-wrapper">
      <PageHero title={title ?? '불러오는 중...'} />
      <div className="section">
        <div className="section_wrapper clearfix">
          <div className="column one">
            <p className="loading">불러오는 중...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
