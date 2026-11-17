import { useEffect, useState } from 'react'
import { fetchSiteCommon } from '../../services/api'
import type { SiteCommonDocument } from './siteCommonTypes'

let cache: SiteCommonDocument | null = null
let pending: Promise<SiteCommonDocument> | null = null

export function loadSiteCommon(): Promise<SiteCommonDocument> {
  if (cache) return Promise.resolve(cache)
  if (!pending) {
    pending = fetchSiteCommon()
      .then((doc) => {
        cache = doc
        return doc
      })
      .finally(() => {
        pending = null
      })
  }
  return pending
}

export function resetSiteCommonCache() {
  cache = null
  pending = null
}

export function useSiteCommon(): SiteCommonDocument | null {
  const [doc, setDoc] = useState<SiteCommonDocument | null>(cache)
  useEffect(() => {
    let cancelled = false
    loadSiteCommon()
      .then((next) => {
        if (!cancelled) setDoc(next)
      })
      .catch(() => {
        if (!cancelled) setDoc(null)
      })
    return () => {
      cancelled = true
    }
  }, [])
  return doc
}
