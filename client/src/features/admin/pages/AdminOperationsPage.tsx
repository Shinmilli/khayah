import { useEffect, useState, type FormEvent } from 'react'
import {
  adminDeleteUser,
  adminFetchUsers,
  adminInviteUser,
  adminPatchUser,
} from '../../../services/api'
import { useAdminAuth } from '../AdminAuthContext'
import { ADMIN_ROLE_LABEL, ADMIN_ROLES, type AdminRole, type AdminUserPublic } from '../adminRoles'

function formatLastLogin(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function AdminOperationsPage() {
  const { me } = useAdminAuth()
  const [users, setUsers] = useState<AdminUserPublic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<AdminRole>('content')
  const [saving, setSaving] = useState(false)

  async function load() {
    setError('')
    setLoading(true)
    try {
      setUsers(await adminFetchUsers())
    } catch (e) {
      setError(e instanceof Error ? e.message : '목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function onInvite(e: FormEvent) {
    e.preventDefault()
    const email = inviteEmail.trim()
    if (!email) return
    setSaving(true)
    setError('')
    try {
      const created = await adminInviteUser(email, inviteRole)
      setUsers((prev) => [...prev, created])
      setInviteEmail('')
      setInviteRole('content')
    } catch (err) {
      setError(err instanceof Error ? err.message : '초대에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  async function onChangeRole(id: number, role: AdminRole) {
    setError('')
    try {
      const updated = await adminPatchUser(id, { role })
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)))
    } catch (err) {
      setError(err instanceof Error ? err.message : '역할 변경에 실패했습니다.')
    }
  }

  async function onToggleActive(user: AdminUserPublic) {
    setError('')
    try {
      const updated = await adminPatchUser(user.id, { active: !user.active })
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)))
    } catch (err) {
      setError(err instanceof Error ? err.message : '상태 변경에 실패했습니다.')
    }
  }

  async function onRemove(user: AdminUserPublic) {
    if (!window.confirm(`${user.email} 계정을 관리자 목록에서 삭제할까요?`)) return
    setError('')
    try {
      await adminDeleteUser(user.id)
      setUsers((prev) => prev.filter((u) => u.id !== user.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : '삭제에 실패했습니다.')
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1 className="admin-page__title">운영·권한 관리</h1>
          <p className="admin-page__desc">
            Google 계정 이메일을 초대해 관리자를 추가합니다. 등록되지 않은 계정은 로그인할 수 없습니다.
          </p>
        </div>
      </div>

      <section className="admin-callout" role="note">
        <h2 className="admin-callout__title">역할</h2>
        <ul className="admin-callout__list">
          <li>
            <strong>슈퍼 관리자</strong> — 모든 메뉴와 운영·권한(초대·역할 변경·삭제)
          </li>
          <li>
            <strong>콘텐츠</strong> — 배너·팝업·게시글·재정보고·나눔의 결실·연혁·FAQ. 문의·권한 관리 제외
          </li>
          <li>
            <strong>문의</strong> — 고객 문의와 FAQ. 사이트 콘텐츠·권한 관리 제외
          </li>
        </ul>
      </section>

      <section className="admin-panel" aria-labelledby="invite-heading">
        <h2 id="invite-heading" className="admin-panel__title">
          관리자 초대
        </h2>
        <form className="admin-form-grid" onSubmit={(e) => void onInvite(e)}>
          <label className="admin-field">
            <span className="admin-field__label">Google 이메일</span>
            <input
              className="admin-input"
              type="email"
              autoComplete="off"
              value={inviteEmail}
              onChange={(ev) => setInviteEmail(ev.target.value)}
              placeholder="name@gmail.com"
              required
            />
          </label>
          <label className="admin-field">
            <span className="admin-field__label">역할</span>
            <select
              className="admin-input"
              value={inviteRole}
              onChange={(ev) => setInviteRole(ev.target.value as AdminRole)}
            >
              {ADMIN_ROLES.map((role) => (
                <option key={role} value={role}>
                  {ADMIN_ROLE_LABEL[role]}
                </option>
              ))}
            </select>
          </label>
          <div className="admin-field admin-field--full">
            <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
              {saving ? '초대 중…' : '초대'}
            </button>
          </div>
        </form>
      </section>

      {error ? (
        <p className="admin-panel__foot" style={{ color: '#b00020' }}>
          {error}
        </p>
      ) : null}

      <section className="admin-panel" aria-labelledby="admin-table-heading">
        <h2 id="admin-table-heading" className="admin-panel__title">
          관리자 계정
        </h2>
        {loading ? (
          <p className="admin-panel__foot">불러오는 중…</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">계정</th>
                  <th scope="col">이름</th>
                  <th scope="col">역할</th>
                  <th scope="col">마지막 접속</th>
                  <th scope="col">상태</th>
                  <th scope="col">관리</th>
                </tr>
              </thead>
              <tbody>
                {users.map((row) => (
                  <tr key={row.id}>
                    <td>
                      {row.email}
                      {me?.id === row.id ? ' (나)' : ''}
                    </td>
                    <td>{row.name || '—'}</td>
                    <td>
                      <select
                        className="admin-input"
                        value={row.role}
                        aria-label={`${row.email} 역할`}
                        onChange={(ev) => void onChangeRole(row.id, ev.target.value as AdminRole)}
                      >
                        {ADMIN_ROLES.map((role) => (
                          <option key={role} value={role}>
                            {ADMIN_ROLE_LABEL[role]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{formatLastLogin(row.lastLoginAt)}</td>
                    <td>
                      {row.active ? (
                        <span className="admin-tag admin-tag--ok">활성</span>
                      ) : (
                        <span className="admin-tag">비활성</span>
                      )}
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <button
                          type="button"
                          className="admin-btn admin-btn--sm admin-btn--ghost"
                          onClick={() => void onToggleActive(row)}
                        >
                          {row.active ? '비활성화' : '활성화'}
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn--sm admin-btn--danger-ghost"
                          onClick={() => void onRemove(row)}
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="admin-panel__foot">
          Google에서 계정을 만든 뒤, 여기서 이메일을 초대해야 관리자 화면에 들어올 수 있습니다. 마지막
          슈퍼 관리자는 삭제하거나 역할을 바꿀 수 없습니다.
        </p>
      </section>
    </div>
  )
}
