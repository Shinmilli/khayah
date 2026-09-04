import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { splitLocalePath } from '../i18n/locale'
import { useLocale } from '../i18n/LocaleContext'
import {
  POPUP_CONFIG_CHANGED_EVENT,
  buildVisiblePopupQueue,
  getPopupButtonLabel,
  hidePopupToday,
  rememberPopupDismissedThisSession,
  resolvePopupButtonLinkUrl,
  resolvePopupImageLinkUrl,
  type PopupItem,
} from '../utils/popup'
import '../styles/popup.css'

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SitePopup() {
  const location = useLocation()
  const { locale, messages } = useLocale()
  const popupMsg = messages.pages.popup
  const [loaded, setLoaded] = useState(false)
  const [queue, setQueue] = useState<PopupItem[]>([])

  const syncQueue = useCallback(() => {
    const { pathnameWithoutLocale } = splitLocalePath(location.pathname)
    if (pathnameWithoutLocale !== '/') {
      setQueue([])
      return
    }
    setQueue(buildVisiblePopupQueue())
  }, [location.pathname])

  useEffect(() => {
    setLoaded(true)
  }, [])

  useEffect(() => {
    syncQueue()
  }, [syncQueue])

  useEffect(() => {
    const onCfg = () => syncQueue()
    window.addEventListener(POPUP_CONFIG_CHANGED_EVENT, onCfg)
    window.addEventListener('storage', onCfg)
    return () => {
      window.removeEventListener(POPUP_CONFIG_CHANGED_EVENT, onCfg)
      window.removeEventListener('storage', onCfg)
    }
  }, [syncQueue])

  const current = queue[0] ?? null

  const advanceAfterClose = () => {
    const cur = queue[0]
    if (cur) rememberPopupDismissedThisSession(cur.id)
    setQueue(buildVisiblePopupQueue())
  }

  const onHideToday = () => {
    const cur = queue[0]
    if (!cur) return
    hidePopupToday(cur.id)
    setQueue(buildVisiblePopupQueue())
  }

  if (!loaded || splitLocalePath(location.pathname).pathnameWithoutLocale !== '/' || !current) return null

  const imageLinkHref = resolvePopupImageLinkUrl(current)
  const ctaHref = current.buttonEnabled ? resolvePopupButtonLinkUrl(current) : ''
  const showCta = Boolean(ctaHref)
  const ctaLabel = getPopupButtonLabel(current, locale)

  const image = (
    <img className="site-popup__img" src={current.imageUrl} alt={popupMsg.imageAlt} loading="eager" />
  )

  return (
    <div className="site-popup" role="dialog" aria-modal="true" aria-label={popupMsg.aria}>
      <button
        type="button"
        className="site-popup__backdrop"
        aria-label={popupMsg.closeBackdrop}
        onClick={advanceAfterClose}
      />
      <div className="site-popup__card">
        <button type="button" className="site-popup__close" aria-label={popupMsg.close} onClick={advanceAfterClose}>
          <CloseIcon />
        </button>

        <div className="site-popup__media">
          {imageLinkHref ? (
            <a
              href={imageLinkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="site-popup__link"
              aria-label={popupMsg.linkAria}
            >
              {image}
            </a>
          ) : (
            image
          )}
        </div>

        <div className="site-popup__actions">
          <button type="button" className="site-popup__today" onClick={onHideToday}>
            {popupMsg.hideToday}
          </button>
          <div className="site-popup__actions-end">
            {showCta ? (
              <a className="site-popup__cta" href={ctaHref} target="_blank" rel="noopener noreferrer">
                {ctaLabel}
              </a>
            ) : null}
            <button type="button" className="site-popup__dismiss" onClick={advanceAfterClose}>
              {popupMsg.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
