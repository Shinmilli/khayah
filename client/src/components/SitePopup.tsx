import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  POPUP_CONFIG_CHANGED_EVENT,
  buildVisiblePopupQueue,
  hidePopupToday,
  rememberPopupDismissedThisSession,
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

function ctaHrefFor(item: PopupItem): string {
  return item.buttonUrl?.trim() || item.linkUrl?.trim() || ''
}

export function SitePopup() {
  const location = useLocation()
  const [loaded, setLoaded] = useState(false)
  const [queue, setQueue] = useState<PopupItem[]>([])

  const syncQueue = useCallback(() => {
    if (location.pathname !== '/') {
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

  if (!loaded || location.pathname !== '/' || !current) return null

  const ctaHref = current.buttonEnabled ? ctaHrefFor(current) : ''
  const showCta = Boolean(ctaHref)

  const image = (
    <img className="site-popup__img" src={current.imageUrl} alt="팝업 이미지" loading="eager" />
  )

  return (
    <div className="site-popup" role="dialog" aria-modal="true" aria-label="공지 팝업">
      <button
        type="button"
        className="site-popup__backdrop"
        aria-label="팝업 닫기"
        onClick={advanceAfterClose}
      />
      <div className="site-popup__card">
        <button type="button" className="site-popup__close" aria-label="닫기" onClick={advanceAfterClose}>
          <CloseIcon />
        </button>

        <div className="site-popup__media">
          {current.linkUrl?.trim() ? (
            <a
              href={current.linkUrl.trim()}
              target="_blank"
              rel="noreferrer"
              className="site-popup__link"
              aria-label="팝업 링크"
            >
              {image}
            </a>
          ) : (
            image
          )}
        </div>

        <div className="site-popup__actions">
          <button type="button" className="site-popup__today" onClick={onHideToday}>
            오늘 그만보기
          </button>
          <div className="site-popup__actions-end">
            {showCta ? (
              <a className="site-popup__cta" href={ctaHref} target="_blank" rel="noreferrer">
                {current.buttonLabel?.trim() ? current.buttonLabel.trim() : '자세히 보기'}
              </a>
            ) : null}
            <button type="button" className="site-popup__dismiss" onClick={advanceAfterClose}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
