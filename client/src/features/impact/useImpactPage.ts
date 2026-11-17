import { useEffect, useState } from 'react'
import { fetchImpactPage } from '../../services/api'
import type { ImpactPageDocument } from './impactPageTypes'

let cache: ImpactPageDocument | null = null
let pending: Promise<ImpactPageDocument> | null = null

export function loadImpactPage(): Promise<ImpactPageDocument> {
  if (cache) return Promise.resolve(cache)
  if (!pending) {
    pending = fetchImpactPage()
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

export function resetImpactPageCache() {
  cache = null
  pending = null
}

export function useImpactPage(): ImpactPageDocument | null {
  const [doc, setDoc] = useState<ImpactPageDocument | null>(cache)
  useEffect(() => {
    let cancelled = false
    loadImpactPage()
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
