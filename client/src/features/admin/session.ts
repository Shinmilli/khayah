const ADMIN_MOCK_SESSION_KEY = 'khayah_admin_mock_session'

export function isAdminMockLoggedIn(): boolean {
  return sessionStorage.getItem(ADMIN_MOCK_SESSION_KEY) === '1'
}

export function setAdminMockLoggedIn(value: boolean): void {
  if (value) sessionStorage.setItem(ADMIN_MOCK_SESSION_KEY, '1')
  else sessionStorage.removeItem(ADMIN_MOCK_SESSION_KEY)
}
