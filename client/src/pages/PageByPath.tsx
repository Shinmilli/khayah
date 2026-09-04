import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { fetchPageBySlug, fetchPostBySlug } from '../services/api'
import { PostDetail, crumbsForPost, heroTitleForKind } from '../components/PostDetail'
import { getStaticPage, normalizePathKey, pathToSlug } from '../constants/pagesContent'
import { useLocale } from '../i18n/LocaleContext'
import type { Page } from '../types/page'
import type { Post } from '../types/post'
import { NewsArchivePage } from './NewsArchivePage'
import { InquiryPage } from './InquiryPage'
import { HistoryPage } from './HistoryPage'
import { PageHero } from '../components/PageHero'
import '../styles/page.css'
import '../styles/greeting-modern.css'
import '../styles/business-education.css'
import '../styles/business-domestic.css'
import '../styles/business-overseas.css'
import '../styles/business-overseas-education.css'
import '../styles/business-overseas-health.css'
import '../styles/business-advocacy.css'
import '../styles/donor-guide.css'
import { NANUM_DONATE_URL } from '../constants/nanumDonate'
import { PATH } from '../i18n/routes'

function storyCtaForPathKey(
  pathKey: string,
  messages: ReturnType<typeof useLocale>['messages'],
): { label: string; to: string } | null {
  const cta = messages.pages.storyCta
  if (!pathKey) return null
  if (pathKey === PATH.businessDomestic || pathKey.startsWith(`${PATH.businessDomestic}/`)) {
    return { label: cta.domestic, to: '/stories/domestic' }
  }
  if (pathKey === PATH.businessOverseas || pathKey.startsWith(`${PATH.businessOverseas}/`)) {
    return { label: cta.overseas, to: '/stories/overseas' }
  }
  if (pathKey === PATH.businessAdvocacy || pathKey.startsWith(`${PATH.businessAdvocacy}/`)) {
    return { label: cta.advocacy, to: '/stories/advocacy' }
  }
  if (pathKey === PATH.businessProjects || pathKey.startsWith(`${PATH.businessProjects}/`)) {
    return { label: cta.support, to: '/stories/support' }
  }
  return null
}

export function PageByPath() {
  const location = useLocation()
  const { locale, localize, messages } = useLocale()
  const pathKey = normalizePathKey(location.pathname)

  const isNewsArchive =
    pathKey === PATH.newsAnnouncements ||
    pathKey === PATH.newsActivities ||
    pathKey === PATH.newsNewsletter ||
    pathKey === PATH.newsPress
  const isInquiry = pathKey === PATH.newsInquiry
  const isHistory = pathKey === PATH.aboutHistory

  const hashId = location.hash.replace(/^#/, '')
  const [apiPage, setApiPage] = useState<Page | null | undefined>(undefined)
  const [post, setPost] = useState<Post | null | undefined>(undefined)

  const isPostPath = pathKey.startsWith('posts/')
  const postSlug = isPostPath ? pathKey.replace(/^posts\/?/, '') : ''

  const staticPage =
    pathKey && !isPostPath && !isInquiry && !isHistory ? getStaticPage(pathKey, locale) : null

  const slug = pathToSlug(location.pathname)

  useEffect(() => {
    if (isNewsArchive || isInquiry || isHistory) {
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
  }, [slug, staticPage, isPostPath, postSlug, isNewsArchive, isInquiry, isHistory])

  const title = isInquiry ? null : (staticPage?.title ?? apiPage?.title ?? post?.title ?? null)
  useEffect(() => {
    if (title) document.title = messages.pages.documentTitle(title)
    return () => { document.title = messages.pages.defaultTitle }
  }, [title, messages.pages])

  useEffect(() => {
    if (!hashId) return
    const timer = window.setTimeout(() => {
      document.getElementById(hashId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
    return () => clearTimeout(timer)
  }, [hashId, pathKey, staticPage, apiPage])

  useEffect(() => {
    if (pathKey !== PATH.supportGuide) return
    const root = document.querySelector<HTMLElement>('.page-content-wrapper .the_content_wrapper.page-body')
    if (!root) return
    let hideTimer: number
    const showToast = (message: string) => {
      const toast = document.getElementById('sg-toast')
      if (!toast) return
      toast.textContent = message
      toast.removeAttribute('hidden')
      window.clearTimeout(hideTimer)
      hideTimer = window.setTimeout(() => {
        toast.setAttribute('hidden', '')
      }, 2800)
    }
    const onClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest('#sg-copy-nanum')
      if (!btn) return
      e.preventDefault()
      void navigator.clipboard.writeText(NANUM_DONATE_URL).then(
        () => showToast(messages.pages.supportGuide.copySuccess),
        () => showToast(messages.pages.supportGuide.copyFail),
      )
    }
    root.addEventListener('click', onClick)
    return () => {
      root.removeEventListener('click', onClick)
      window.clearTimeout(hideTimer)
    }
  }, [pathKey, location.pathname, messages.pages.supportGuide])

  if (isInquiry) return <InquiryPage />

  if (isHistory) return <HistoryPage />

  if (isNewsArchive) return <NewsArchivePage />

  if (post) {
    const kind = post.meta?.khayah_kind ?? ''
    return (
      <div className="page-content-wrapper">
        <PageHero title={heroTitleForKind(kind)} crumbs={crumbsForPost(post)} />
        <div className="section">
          <div className="section_wrapper clearfix">
            <div className="column one">
              <PostDetail post={post} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (staticPage) {
    const storyCta = storyCtaForPathKey(pathKey, messages)
    return (
      <div className="page-content-wrapper">
        <PageHero title={staticPage.title} showScrollHint={pathKey !== PATH.aboutLocation} />
        <div className="section">
          <div className="section_wrapper clearfix">
            <div className="column one">
              <div
                className="the_content_wrapper page-body"
                dangerouslySetInnerHTML={{ __html: staticPage.content }}
              />
              {storyCta ? (
                <div className="page-story-cta">
                  <Link className="page-story-cta__btn" to={localize(storyCta.to)}>
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
    const storyCta = storyCtaForPathKey(pathKey, messages)
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
                  <Link className="page-story-cta__btn" to={localize(storyCta.to)}>
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
        <PageHero title={messages.pages.notFoundTitle} />
        <div className="section">
          <div className="section_wrapper clearfix">
            <div className="column one">
              <p>{messages.pages.notFoundBody}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content-wrapper">
      <PageHero title={title ?? messages.pages.loading} />
      <div className="section">
        <div className="section_wrapper clearfix">
          <div className="column one">
            <p className="loading">{messages.pages.loading}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
