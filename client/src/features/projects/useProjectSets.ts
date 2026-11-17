import { useEffect, useState } from 'react'
import { fetchProjectSets } from '../../services/api'
import type { ProjectSetsDocument } from './projectSetTypes'

let cache: ProjectSetsDocument | null = null
let pending: Promise<ProjectSetsDocument> | null = null

export function loadProjectSets(): Promise<ProjectSetsDocument> {
  if (cache) return Promise.resolve(cache)
  if (!pending) {
    pending = fetchProjectSets()
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

export function resetProjectSetsCache() {
  cache = null
  pending = null
}

export function useProjectSets(): ProjectSetsDocument | null {
  const [doc, setDoc] = useState<ProjectSetsDocument | null>(cache)
  useEffect(() => {
    let cancelled = false
    loadProjectSets()
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
