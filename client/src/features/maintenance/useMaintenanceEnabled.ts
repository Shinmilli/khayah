import { useEffect, useState } from 'react'
import { fetchMaintenance } from '../../services/api'
import { MAINTENANCE_CHANGED_EVENT, type MaintenanceDocument } from './maintenanceTypes'

export function useMaintenanceEnabled(): boolean {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    let cancelled = false
    const apply = (doc: MaintenanceDocument) => {
      if (!cancelled) setEnabled(doc.enabled)
    }
    const load = () => {
      fetchMaintenance()
        .then(apply)
        .catch(() => undefined)
    }
    const onChange = (event: Event) => {
      const doc = (event as CustomEvent<MaintenanceDocument>).detail
      if (doc && typeof doc.enabled === 'boolean') apply(doc)
      else load()
    }
    load()
    window.addEventListener(MAINTENANCE_CHANGED_EVENT, onChange)
    return () => {
      cancelled = true
      window.removeEventListener(MAINTENANCE_CHANGED_EVENT, onChange)
    }
  }, [])

  return enabled
}
