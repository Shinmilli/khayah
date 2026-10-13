import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { splitLocalePath, type Locale } from '../../i18n/locale'
import { SITE_NAME } from '../../constants'
import '../../styles/maintenance.css'
import {
  searchWithoutMaintenancePreview,
  type MaintenanceDocument,
} from './maintenanceTypes'

const LOGO_SRC = '/images/logo/khayah_logo.png'

const COPY = {
  ko: {
    eyebrow: '점검 안내',
    org: '사단법인 카야 인터내셔널',
    logoAlt: '카야 인터내셔널',
  },
  en: {
    eyebrow: 'MAINTENANCE',
    org: 'Khayah International',
    logoAlt: 'Khayah International',
  },
} as const

export function MaintenanceScreen({
  doc,
  locale,
  preview = false,
  embedded = false,
}: {
  doc: MaintenanceDocument
  locale?: Locale
  preview?: boolean
  embedded?: boolean
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const activeLocale = locale ?? splitLocalePath(location.pathname).locale
  const copy = COPY[activeLocale]
  const title = activeLocale === 'en' ? doc.titleEn : doc.titleKo
  const message = activeLocale === 'en' ? doc.messageEn : doc.messageKo

  useEffect(() => {
    if (embedded) return
    const previous = document.title
    document.title = `${title} | ${SITE_NAME}`
    return () => {
      document.title = previous
    }
  }, [embedded, title])

  return (
    <div
      className={`maintenance${embedded ? ' maintenance--embedded' : ''}`}
      role={embedded ? undefined : 'main'}
      aria-hidden={embedded ? true : undefined}
      aria-label={embedded ? undefined : title}
    >
      {preview && !embedded ? (
        <div className="maintenance-preview-bar">
          <p className="maintenance-preview-bar__text">
            미리보기입니다. 로그인하지 않은 방문자는 사이트 대신 이 화면만 봅니다.
          </p>
          <button
            type="button"
            className="maintenance-preview-bar__btn"
            onClick={() =>
              navigate(
                {
                  pathname: location.pathname,
                  search: searchWithoutMaintenancePreview(location.search),
                },
                { replace: true },
              )
            }
          >
            사이트 보기
          </button>
        </div>
      ) : null}
      <div className="maintenance__stage">
        <div className="maintenance__card">
          <img className="maintenance__logo" src={LOGO_SRC} alt={copy.logoAlt} />
          <p className="maintenance__eyebrow">
            <span className="maintenance__dot" aria-hidden />
            {copy.eyebrow}
          </p>
          <h1 className="maintenance__title">{title}</h1>
          <p className="maintenance__message">{message}</p>
          <hr className="maintenance__rule" />
          <p className="maintenance__org">{copy.org}</p>
        </div>
      </div>
    </div>
  )
}
