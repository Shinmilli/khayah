import { useEffect, useState } from 'react'
import { fetchBizSupport } from '../../services/api'
import { NANUM_DONATE_URL } from '../../constants/nanumDonate'
import { normalizeHref } from '../../utils/hrefs'
import type { BizSupportDocument } from './bizSupportTypes'

let cache: BizSupportDocument | null = null
let pending: Promise<BizSupportDocument> | null = null

export function loadBizSupport(): Promise<BizSupportDocument> {
  if (cache) return Promise.resolve(cache)
  if (!pending) {
    pending = fetchBizSupport()
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

export function resetBizSupportCache() {
  cache = null
  pending = null
}

export function useBizSupport(): BizSupportDocument | null {
  const [doc, setDoc] = useState<BizSupportDocument | null>(cache)
  useEffect(() => {
    let cancelled = false
    loadBizSupport()
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

export function donateHref(doc: BizSupportDocument | null): string {
  const url = doc?.donate.url?.trim()
  return normalizeHref(url || NANUM_DONATE_URL)
}
