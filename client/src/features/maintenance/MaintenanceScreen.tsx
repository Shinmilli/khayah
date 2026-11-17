import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { AdminViewSwitch } from '../admin/AdminViewSwitch'
import { MaintenanceModeNotice } from './MaintenanceModeNotice'
import { splitLocalePath, type Locale } from '../../i18n/locale'
import '../../styles/admin-view-switch.css'
import '../../styles/maintenance.css'
import {
  type MaintenanceDocument,
} from './maintenanceTypes'

const LOGO_SRC = '/images/logo/khayah_logo.png'

const COPY = {
  ko: {
    eyebrow: '점검 안내',
    org: '사단법인 카야인터내셔널',
    logoAlt: '카야인터내셔널',
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
  const activeLocale = locale ?? splitLocalePath(location.pathname).locale
  const copy = COPY[activeLocale]
  const title = activeLocale === 'en' ? doc.titleEn : doc.titleKo
  const message = activeLocale === 'en' ? doc.messageEn : doc.messageKo

  useEffect(() => {
    if (embedded) return
    const previous = document.title
    document.title = `${title} | ${copy.org}`
    return () => {
      document.title = previous
    }
  }, [copy.org, embedded, title])

  return (
    <div
      className={`maintenance${embedded ? ' maintenance--embedded' : ''}`}
      role={embedded ? undefined : 'main'}
      aria-hidden={embedded ? true : undefined}
      aria-label={embedded ? undefined : title}
    >
      {preview && !embedded ? <AdminViewSwitch active="site" notice={<MaintenanceModeNotice />} /> : null}
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
