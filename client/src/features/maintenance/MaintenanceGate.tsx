import { useEffect, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { authMe, fetchMaintenance } from '../../services/api'
import { MaintenanceScreen } from './MaintenanceScreen'
import {
  DEFAULT_MAINTENANCE,
  isMaintenancePreview,
  readCachedMaintenanceEnabled,
  searchWithMaintenancePreview,
  writeCachedMaintenanceEnabled,
  type MaintenanceDocument,
} from './maintenanceTypes'

const POLL_MS = 20_000

export function MaintenanceGate({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [cachedOn] = useState(readCachedMaintenanceEnabled)
  const [doc, setDoc] = useState<MaintenanceDocument | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    let cancelled = false
    let requestId = 0

    async function load() {
      const ticket = ++requestId
      const [nextDoc, me] = await Promise.all([
        fetchMaintenance().catch(() => null),
        authMe().catch(() => null),
      ])
      if (cancelled || ticket !== requestId) return
      if (nextDoc) {
        setDoc(nextDoc)
        writeCachedMaintenanceEnabled(nextDoc.enabled)
      }
      setIsAdmin(Boolean(me))
      setChecked(true)
    }

    void load()
    const id = window.setInterval(() => void load(), POLL_MS)
    const onVisible = () => {
      if (document.visibilityState === 'visible') void load()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      cancelled = true
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  const previewRequested = isMaintenancePreview(location.search)
  const enabled = doc ? doc.enabled : cachedOn

  if (!checked && previewRequested && !cachedOn) {
    return <div className="maintenance-boot" aria-hidden />
  }

  if (!checked && cachedOn && !previewRequested) {
    return <MaintenanceScreen doc={doc ?? { ...DEFAULT_MAINTENANCE, enabled: true }} />
  }

  const showMaintenance = (enabled && (!isAdmin || previewRequested)) || (!enabled && isAdmin && previewRequested)

  if (showMaintenance) {
    return (
      <MaintenanceScreen doc={doc ?? { ...DEFAULT_MAINTENANCE, enabled: true }} preview={previewRequested && isAdmin} />
    )
  }

  return (
    <>
      {children}
      {enabled && isAdmin ? (
        <div className="maintenance-admin-bar" role="status">
          <p className="maintenance-admin-bar__text">
            점검 모드가 켜져 있습니다. 방문자는 이 페이지를 볼 수 없습니다.
          </p>
          <div className="maintenance-admin-bar__actions">
            <button
              type="button"
              className="maintenance-admin-bar__btn"
              onClick={() =>
                navigate({
                  pathname: location.pathname,
                  search: searchWithMaintenancePreview(location.search),
                })
              }
            >
              방문자 화면
            </button>
            <a className="maintenance-admin-bar__btn maintenance-admin-bar__btn--ghost" href="/admin/app/maintenance">
              점검 설정
            </a>
          </div>
        </div>
      ) : null}
    </>
  )
}
