import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authDemo, authGoogle, authLogout, authMe } from '../../services/api'
import type { AdminUserPublic } from './adminRoles'

type AdminAuthValue = {
  me: AdminUserPublic | null
  loading: boolean
  loginWithGoogle: (idToken: string) => Promise<AdminUserPublic>
  loginWithDemo: () => Promise<AdminUserPublic>
  logout: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<AdminUserPublic | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const user = await authMe()
        if (!cancelled) setMe(user)
      } catch {
        if (!cancelled) setMe(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    function onUnauthorized() {
      setMe(null)
    }
    window.addEventListener('khayah-admin-unauthorized', onUnauthorized)
    return () => window.removeEventListener('khayah-admin-unauthorized', onUnauthorized)
  }, [])

  const loginWithGoogle = useCallback(async (idToken: string) => {
    const user = await authGoogle(idToken)
    setMe(user)
    return user
  }, [])

  const loginWithDemo = useCallback(async () => {
    const user = await authDemo()
    setMe(user)
    return user
  }, [])

  const logout = useCallback(async () => {
    try {
      await authLogout()
    } finally {
      setMe(null)
    }
  }, [])

  const value = useMemo(
    () => ({ me, loading, loginWithGoogle, loginWithDemo, logout }),
    [me, loading, loginWithGoogle, loginWithDemo, logout],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth(): AdminAuthValue {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return ctx
}
