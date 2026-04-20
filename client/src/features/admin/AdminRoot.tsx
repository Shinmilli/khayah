import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

export function AdminRoot() {
  useEffect(() => {
    document.body.classList.add('admin-route')
    return () => document.body.classList.remove('admin-route')
  }, [])

  return (
    <div className="admin-root">
      <Outlet />
    </div>
  )
}
