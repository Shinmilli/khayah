import { useCallback, useEffect, useState } from 'react'
import { adminFetchMaintenance, adminPutMaintenance } from '../../../services/api'
import { MaintenanceScreen } from '../../maintenance/MaintenanceScreen'
import {
  DEFAULT_MAINTENANCE,
  MAINTENANCE_CHANGED_EVENT,
  MAINTENANCE_MESSAGE_MAX,
  MAINTENANCE_TITLE_MAX,
  previewPath,
  type MaintenanceDocument,
} from '../../maintenance/maintenanceTypes'

type EditLocale = 'ko' | 'en'

const EDIT_LOCALES: { id: EditLocale; label: string }[] = [
  { id: 'ko', label: '한국어' },
  { id: 'en', label: 'English' },
]

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

export function AdminMaintenancePage() {
  const [doc, setDoc] = useState<MaintenanceDocument>(() => deepClone(DEFAULT_MAINTENANCE))
  const [savedEnabled, setSavedEnabled] = useState(false)
  const [editLocale, setEditLocale] = useState<EditLocale>('ko')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminFetchMaintenance()
      setDoc(data)
      setSavedEnabled(data.enabled)
    } catch (e) {
      setError(e instanceof Error ? e.message : '불러오지 못했습니다.')
      setDoc(deepClone(DEFAULT_MAINTENANCE))
      setSavedEnabled(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const titleKey = editLocale === 'en' ? 'titleEn' : 'titleKo'
  const messageKey = editLocale === 'en' ? 'messageEn' : 'messageKo'
  const titleMax = MAINTENANCE_TITLE_MAX
  const messageMax = MAINTENANCE_MESSAGE_MAX

  const save = async () => {
    if (doc.enabled && !savedEnabled) {
      const ok = window.confirm(
        '점검 모드를 켜면 로그인하지 않은 사람은 사이트에 들어갈 수 없고, 점검 화면만 봅니다. 관리자로 로그인한 브라우저는 사이트를 그대로 볼 수 있습니다. 켤까요?',
      )
      if (!ok) return
    }
    setSaving(true)
    setError('')
    setSavedAt('')
    try {
      const saved = await adminPutMaintenance(doc)
      setDoc(saved)
      setSavedEnabled(saved.enabled)
      setSavedAt(new Date().toLocaleTimeString('ko-KR'))
      window.dispatchEvent(new CustomEvent(MAINTENANCE_CHANGED_EVENT, { detail: saved }))
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-panel__foot">불러오는 중…</p>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1 className="admin-page__title">점검 모드</h1>
          <p className="admin-page__desc">
            긴급할 때 공개 사이트를 점검 화면으로 바꿉니다. 로그인한 관리자는 사이트를 그대로 볼 수 있고, 방문자 화면은
            미리보기로 확인합니다. 관리자 페이지는 점검 중에도 열립니다.
          </p>
        </div>
        <button type="button" className="admin-btn admin-btn--primary" disabled={saving} onClick={() => void save()}>
          {saving ? '저장 중…' : '저장'}
        </button>
      </div>

      {error ? <p className="admin-banner admin-banner--error">{error}</p> : null}
      {savedAt ? <p className="admin-banner admin-banner--ok">{savedAt}에 저장했습니다.</p> : null}
      {doc.enabled ? (
        <p className="admin-banner admin-banner--error">
          {savedEnabled
            ? '점검 모드가 켜져 있습니다. 로그인하지 않은 방문자는 지금 점검 화면만 봅니다.'
            : '저장하면 방문자에게 바로 적용됩니다.'}
        </p>
      ) : null}

      <section className="admin-panel" aria-labelledby="maintenance-toggle-heading">
        <h2 id="maintenance-toggle-heading" className="admin-panel__title">
          공개 사이트
        </h2>
        <div className="admin-segmented" role="group" aria-label="점검 모드">
          <button
            type="button"
            className={`admin-segmented__btn${doc.enabled ? ' admin-segmented__btn--active' : ''}`}
            onClick={() => setDoc((prev) => ({ ...prev, enabled: true }))}
          >
            점검 중
          </button>
          <button
            type="button"
            className={`admin-segmented__btn${!doc.enabled ? ' admin-segmented__btn--active' : ''}`}
            onClick={() => setDoc((prev) => ({ ...prev, enabled: false }))}
          >
            정상 운영
          </button>
        </div>
        <p className="admin-panel__foot">슈퍼 관리자만 켜고 끌 수 있습니다. 저장해야 방문자에게 반영됩니다.</p>
      </section>

      <section className="admin-panel" aria-labelledby="maintenance-copy-heading">
        <h2 id="maintenance-copy-heading" className="admin-panel__title">
          안내 문구
        </h2>
        <div className="admin-locale-tabs" role="tablist" aria-label="안내 문구 언어">
          {EDIT_LOCALES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={editLocale === item.id}
              className={`admin-locale-tabs__btn${editLocale === item.id ? ' is-active' : ''}`}
              onClick={() => setEditLocale(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="admin-form-grid">
          <label className="admin-field admin-field--full">
            <span className="admin-maintenance__label-row">
              <span className="admin-field__label">제목</span>
              <span className="admin-maintenance__count">
                {doc[titleKey].length}/{titleMax}
              </span>
            </span>
            <input
              className="admin-input"
              value={doc[titleKey]}
              maxLength={titleMax}
              onChange={(e) => setDoc((prev) => ({ ...prev, [titleKey]: e.target.value }))}
            />
          </label>
          <label className="admin-field admin-field--full">
            <span className="admin-maintenance__label-row">
              <span className="admin-field__label">본문</span>
              <span className="admin-maintenance__count">
                {doc[messageKey].length}/{messageMax}
              </span>
            </span>
            <textarea
              className="admin-input admin-input--area"
              value={doc[messageKey]}
              maxLength={messageMax}
              rows={5}
              onChange={(e) => setDoc((prev) => ({ ...prev, [messageKey]: e.target.value }))}
            />
          </label>
        </div>
        <p className="admin-panel__foot">줄바꿈은 점검 화면에 그대로 표시됩니다. 비우면 기본 문구로 저장됩니다.</p>
      </section>

      <section className="admin-panel" aria-labelledby="maintenance-preview-heading">
        <h2 id="maintenance-preview-heading" className="admin-panel__title">
          방문자 화면
        </h2>
        <p className="admin-panel__foot" style={{ marginTop: 0, marginBottom: 14 }}>
          아래는 지금 입력한 문구입니다. 새 탭은 저장된 문구로, 로그인된 관리자만 열 수 있습니다.
        </p>
        <div className="maintenance-frame">
          <MaintenanceScreen doc={doc} locale={editLocale} embedded />
        </div>
        <div className="admin-maintenance__actions">
          <a className="admin-btn" href={previewPath('ko')} target="_blank" rel="noreferrer">
            한국어 화면 열기
          </a>
          <a className="admin-btn" href={previewPath('en')} target="_blank" rel="noreferrer">
            English 화면 열기
          </a>
        </div>
      </section>
    </div>
  )
}
