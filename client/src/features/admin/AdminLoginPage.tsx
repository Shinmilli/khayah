import { Navigate, useNavigate } from 'react-router-dom'
import { isAdminMockLoggedIn, setAdminMockLoggedIn } from './session'

export function AdminLoginPage() {
  const navigate = useNavigate()

  if (isAdminMockLoggedIn()) {
    return <Navigate to="/admin/app/main-banner" replace />
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <p className="admin-login__eyebrow">Khayah 관리자</p>
        <h1 className="admin-login__title">관리자 로그인</h1>
        <p className="admin-login__lead">
          URL로만 진입합니다. 공개 메뉴에는 노출되지 않습니다. 실제 서비스에서는 Google 계정(Gmail)으로
          로그인할 예정입니다.
        </p>

        <div className="admin-login__google-wrap">
          <button type="button" className="admin-login__google" disabled aria-disabled="true">
            <span className="admin-login__google-icon" aria-hidden>
              G
            </span>
            Google로 계속하기
          </button>
          <p className="admin-login__hint">OAuth 연동 전 · 버튼 비활성(UI 목업)</p>
        </div>

        <div className="admin-login__divider" role="presentation" />

        <button
          type="button"
          className="admin-login__demo"
          onClick={() => {
            setAdminMockLoggedIn(true)
            navigate('/admin/app/main-banner', { replace: true })
          }}
        >
          담당자 확인용 · 목업으로 관리 화면 보기
        </button>

        <p className="admin-login__note">
          본 화면은 기획·디자인 검토용입니다. 데이터 저장·권한 검증은 구현되지 않았습니다.
        </p>
      </div>
    </div>
  )
}
