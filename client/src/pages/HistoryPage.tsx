import { useEffect, useState } from 'react'
import { PageHero } from '../components/PageHero'
import { pageHeroImageForPath } from '../constants/pageHeroImages'
import { getStaticPage } from '../constants/pagesContent'
import { historyContentToHtml } from '../features/history/historyTypes'
import { useLocale } from '../i18n/LocaleContext'
import { PATH } from '../i18n/routes'
import { fetchHistory } from '../services/api'
import '../styles/page.css'

export function HistoryPage() {
  const { locale, messages } = useLocale()
  const staticPage = getStaticPage(PATH.aboutHistory, locale)
  const title = staticPage?.title ?? messages.nav.links.history
  const [html, setHtml] = useState(staticPage?.content ?? '')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchHistory(locale)
      .then((content) => {
        if (!cancelled) setHtml(historyContentToHtml(content))
      })
      .catch(() => {
        if (!cancelled) setHtml(staticPage?.content ?? '')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [locale, staticPage?.content])

  return (
    <div className="page-content-wrapper">
      <PageHero title={title} backgroundImageUrl={pageHeroImageForPath(PATH.aboutHistory)} />
      <div className="section">
        <div className="section_wrapper clearfix">
          <div className="column one">
            {loading && !html ? <p className="notice-archive__status">…</p> : null}
            <div
              className="the_content_wrapper page-body"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
