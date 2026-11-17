import { useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { authMe, fetchMaintenance } from '../../services/api'
import { AdminViewSwitch } from '../admin/AdminViewSwitch'
import { MaintenanceModeNotice } from './MaintenanceModeNotice'
import { MaintenanceScreen } from './MaintenanceScreen'
import '../../styles/admin-view-switch.css'
import {
  DEFAULT_MAINTENANCE,
  isMaintenancePreview,
  readCachedMaintenanceEnabled,
  writeCachedMaintenanceEnabled,
  type MaintenanceDocument,
} from './maintenanceTypes'

const POLL_MS = 20_000
const FIRST_CHECK_MS = 2500

export function MaintenanceGate({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [cachedOn] = useState(readCachedMaintenanceEnabled)
  const [doc, setDoc] = useState<MaintenanceDocument | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [checked, setChecked] = useState(false)
  const [holdExpired, setHoldExpired] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setHoldExpired(true), FIRST_CHECK_MS)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    let cancelled = false
    let requestId = 0

    async function load() {
      const ticket = ++requestId
      const [maintenanceResult, authResult] = await Promise.all([
        fetchMaintenance()
          .then((nextDoc) => ({ ok: true as const, doc: nextDoc }))
          .catch(() => ({ ok: false as const, doc: null })),
        authMe()
          .then((user) => ({ ok: true as const, user }))
          .catch(() => ({ ok: false as const, user: null })),
      ])
      if (cancelled || ticket !== requestId) return
      if (maintenanceResult.ok) {
        setDoc(maintenanceResult.doc)
        writeCachedMaintenanceEnabled(maintenanceResult.doc.enabled)
      }
      if (authResult.ok) setIsAdmin(Boolean(authResult.user))
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

  if (!checked && (cachedOn || previewRequested || !holdExpired)) {
    if (cachedOn) {
      return <MaintenanceScreen doc={doc ?? { ...DEFAULT_MAINTENANCE, enabled: true }} />
    }
    return <div className="maintenance-boot" aria-hidden />
  }

  const showMaintenance = (enabled && (!isAdmin || previewRequested)) || (!enabled && isAdmin && previewRequested)

  if (showMaintenance) {
    return (
      <MaintenanceScreen doc={doc ?? { ...DEFAULT_MAINTENANCE, enabled: true }} preview={previewRequested && isAdmin} />
    )
  }

  return (
    <>
      {isAdmin ? (
        <AdminViewSwitch
          active="site"
          fixed
          notice={enabled ? <MaintenanceModeNotice /> : null}
        />
      ) : null}
      {children}
    </>
  )
}
