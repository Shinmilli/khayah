import { useEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAdminAuth } from './AdminAuthContext'
import { homePathForRole } from './adminRoles'

const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim() ?? ''
const GSI_SRC = 'https://accounts.google.com/gsi/client'

function loadGsiScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve()
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${GSI_SRC}"]`)
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Google 로그인 스크립트를 불러오지 못했습니다.')), {
        once: true,
      })
    })
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = GSI_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Google 로그인 스크립트를 불러오지 못했습니다.'))
    document.head.appendChild(script)
  })
}

export function AdminLoginPage() {
  const { me, loading, loginWithGoogle, loginWithDemo } = useAdminAuth()
  const buttonHostRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)
  const [demoBusy, setDemoBusy] = useState(false)

  useEffect(() => {
    if (loading || me || !GOOGLE_CLIENT_ID) return
    let cancelled = false
    void (async () => {
      try {
        await loadGsiScript()
        if (cancelled || !buttonHostRef.current || !window.google?.accounts?.id) return
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            const token = response.credential
            if (!token) {
              setError('Google 로그인 응답이 비어 있습니다.')
              return
            }
            void loginWithGoogle(token).catch((e: unknown) => {
              setError(e instanceof Error ? e.message : '로그인에 실패했습니다.')
            })
          },
          auto_select: false,
          ux_mode: 'popup',
        })
        buttonHostRef.current.innerHTML = ''
        window.google.accounts.id.renderButton(buttonHostRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          width: 320,
          locale: 'ko',
        })
        if (!cancelled) setReady(true)
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Google 로그인을 준비하지 못했습니다.')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [loading, me, loginWithGoogle])

  if (loading) {
    return (
      <div className="admin-login">
        <div className="admin-login__card">
          <p className="admin-login__lead">세션을 확인하는 중…</p>
        </div>
      </div>
    )
  }

  if (me) {
    return <Navigate to={homePathForRole(me.role)} replace />
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <p className="admin-login__eyebrow">Khayah 관리자</p>
        <h1 className="admin-login__title">관리자 로그인</h1>
        <p className="admin-login__lead">
          Google 계정으로만 로그인합니다. 슈퍼 관리자가 초대한 이메일만 입장할 수 있습니다.
        </p>

        <div className="admin-login__google-wrap">
          {GOOGLE_CLIENT_ID ? (
            <>
              <div ref={buttonHostRef} className="admin-login__google-host" />
              {!ready && !error ? <p className="admin-login__hint">Google 버튼을 불러오는 중…</p> : null}
            </>
          ) : (
            <p className="admin-login__hint">
              환경 변수 <code>VITE_GOOGLE_CLIENT_ID</code>가 없어 로그인 버튼을 표시할 수 없습니다.
            </p>
          )}
        </div>

        {error ? (
          <p className="admin-login__error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="admin-login__divider" role="presentation" />

        <button
          type="button"
          className="admin-login__demo"
          disabled={demoBusy}
          onClick={() => {
            setError('')
            setDemoBusy(true)
            void loginWithDemo()
              .catch((e: unknown) => {
                setError(e instanceof Error ? e.message : '목업 로그인에 실패했습니다.')
              })
              .finally(() => setDemoBusy(false))
          }}
        >
          {demoBusy ? '입장 중…' : '담당자 확인용 · 목업으로 관리 화면 보기'}
        </button>

        <p className="admin-login__note">
          처음 설정 시 서버의 <code>ADMIN_BOOTSTRAP_EMAIL</code>과 같은 Google 계정으로 로그인하면 슈퍼
          관리자가 만들어집니다.
        </p>
      </div>
    </div>
  )
}
