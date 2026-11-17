import { useEffect, useState } from 'react'
import { fetchKayaPages } from '../../services/api'
import type { KayaPagesDocument } from './kayaPagesTypes'

let cache: KayaPagesDocument | null = null
let pending: Promise<KayaPagesDocument> | null = null

export function loadKayaPages(): Promise<KayaPagesDocument> {
  if (cache) return Promise.resolve(cache)
  if (!pending) {
    pending = fetchKayaPages()
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

export function resetKayaPagesCache() {
  cache = null
  pending = null
}

export function useKayaPages(): KayaPagesDocument | null {
  const [doc, setDoc] = useState<KayaPagesDocument | null>(cache)
  useEffect(() => {
    let cancelled = false
    loadKayaPages()
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
