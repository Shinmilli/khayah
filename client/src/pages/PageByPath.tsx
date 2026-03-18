import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchPageBySlug, fetchPostBySlug } from '../services/api'
import { PAGES_STATIC, pathToSlug } from '../constants/pagesContent'
import type { Page } from '../types/page'
import type { Post } from '../types/post'
import '../styles/page.css'

export function PageByPath() {
  const location = useLocation()
  const pathKey = location.pathname.replace(/^\/+|\/+$/g, '')
  const [apiPage, setApiPage] = useState<Page | null | undefined>(undefined)
  const [post, setPost] = useState<Post | null | undefined>(undefined)

  const isPostPath = pathKey.startsWith('posts/')
  const postSlug = isPostPath ? pathKey.replace(/^posts\/?/, '') : ''

  const staticPage = pathKey && !isPostPath ? PAGES_STATIC[pathKey] : null

  const slug = pathToSlug(location.pathname)

  useEffect(() => {
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
  }, [slug, staticPage, isPostPath, postSlug])

  const title = staticPage?.title ?? apiPage?.title ?? post?.title ?? null
  useEffect(() => {
    if (title) document.title = `${title} | 사단법인 카야 인터내셔널`
    return () => { document.title = '사단법인 카야 인터내셔널 | 개발NGO' }
  }, [title])

  if (post) {
    return (
      <div className="page-content-wrapper">
        <div className="section">
          <div className="section_wrapper clearfix">
            <div className="column one">
              <h1 className="page-title">{post.title}</h1>
              <div className="entry-meta" style={{ marginBottom: 16 }}>
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString('ko-KR')}
                </time>
                {post.author && <span> · {post.author.displayName}</span>}
              </div>
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
    return (
      <div className="page-content-wrapper">
        <div className="section">
          <div className="section_wrapper clearfix">
            <div className="column one">
              <h1 className="page-title">{staticPage.title}</h1>
              <div
                className="the_content_wrapper page-body"
                dangerouslySetInnerHTML={{ __html: staticPage.content }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (apiPage) {
    return (
      <div className="page-content-wrapper">
        <div className="section">
          <div className="section_wrapper clearfix">
            <div className="column one">
              <h1 className="page-title">{apiPage.title}</h1>
              <div
                className="the_content_wrapper page-body"
                dangerouslySetInnerHTML={{ __html: apiPage.content || '' }}
              />
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
        <div className="section">
          <div className="section_wrapper clearfix">
            <div className="column one">
              <h1 className="page-title">페이지를 찾을 수 없습니다</h1>
              <p>요청하신 경로에 해당하는 페이지가 없거나 이동되었을 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content-wrapper">
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
