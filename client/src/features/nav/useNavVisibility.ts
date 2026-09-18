import { useEffect, useState } from 'react'
import { fetchNavVisibility } from '../../services/api'
import { DEFAULT_NAV_VISIBILITY, type NavVisibilityDocument } from './navVisibilityTypes'

export function useNavVisibility(): NavVisibilityDocument | null {
  const [doc, setDoc] = useState<NavVisibilityDocument | null>(DEFAULT_NAV_VISIBILITY)

  useEffect(() => {
    let cancelled = false
    fetchNavVisibility()
      .then((data) => {
        if (!cancelled) setDoc(data)
      })
      .catch(() => {
        if (!cancelled) setDoc(DEFAULT_NAV_VISIBILITY)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return doc
}
