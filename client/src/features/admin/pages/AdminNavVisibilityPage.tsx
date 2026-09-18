import { useCallback, useEffect, useState } from 'react'
import { adminFetchNavVisibility, adminPutNavVisibility } from '../../../services/api'
import {
  DEFAULT_NAV_VISIBILITY,
  NAV_LINK_LABELS,
  NAV_MENU_COLUMNS,
  NAV_TOP_LABELS,
  type NavMenuLinkDef,
  type NavVisibilityDocument,
  type NavVisibilityLinkKey,
  type NavVisibilityTopKey,
} from '../../nav/navVisibilityTypes'

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

function OnOffToggle({
  enabled,
  onChange,
  label,
}: {
  enabled: boolean
  onChange: (next: boolean) => void
  label: string
}) {
  return (
    <div className="admin-segmented admin-segmented--tight" role="group" aria-label={`${label} 표시`}>
      <button
        type="button"
        className={`admin-segmented__btn${enabled ? ' admin-segmented__btn--active' : ''}`}
        onClick={() => onChange(true)}
      >
        ON
      </button>
      <button
        type="button"
        className={`admin-segmented__btn${!enabled ? ' admin-segmented__btn--active' : ''}`}
        onClick={() => onChange(false)}
      >
        OFF
      </button>
    </div>
  )
}

function LinkRows({
  links,
  doc,
  depth,
  onToggle,
}: {
  links: NavMenuLinkDef[]
  doc: NavVisibilityDocument
  depth: number
  onToggle: (key: NavVisibilityLinkKey, enabled: boolean) => void
}) {
  return (
    <>
      {links.map((link) => (
        <div key={link.key}>
          <div className={`admin-nav-vis__row${depth > 0 ? ' admin-nav-vis__row--child' : ''}`}>
            <span className="admin-nav-vis__label">{NAV_LINK_LABELS[link.key]}</span>
            <OnOffToggle
              enabled={doc.links[link.key]}
              label={NAV_LINK_LABELS[link.key]}
              onChange={(enabled) => onToggle(link.key, enabled)}
            />
          </div>
          {link.children?.length ? (
            <LinkRows links={link.children} doc={doc} depth={depth + 1} onToggle={onToggle} />
          ) : null}
        </div>
      ))}
    </>
  )
}

export function AdminNavVisibilityPage() {
  const [doc, setDoc] = useState<NavVisibilityDocument>(() => deepClone(DEFAULT_NAV_VISIBILITY))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminFetchNavVisibility()
      setDoc(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : '불러오지 못했습니다.')
      setDoc(deepClone(DEFAULT_NAV_VISIBILITY))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const setTop = (key: NavVisibilityTopKey, enabled: boolean) => {
    setDoc((prev) => ({ ...prev, top: { ...prev.top, [key]: enabled } }))
  }

  const setLink = (key: NavVisibilityLinkKey, enabled: boolean) => {
    setDoc((prev) => ({ ...prev, links: { ...prev.links, [key]: enabled } }))
  }

  const save = async () => {
    setSaving(true)
    setError('')
    setSavedAt('')
    try {
      const saved = await adminPutNavVisibility(doc)
      setDoc(saved)
      setSavedAt(new Date().toLocaleTimeString('ko-KR'))
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
          <h1 className="admin-page__title">메뉴 표시</h1>
          <p className="admin-page__desc">
            상단 네비게이션 메뉴를 켜고 끌 수 있습니다. 상위 메뉴를 OFF하면 그 아래 항목도 사이트에서 보이지 않습니다.
            숨긴 페이지는 주소로 직접 들어갈 수는 있습니다.
          </p>
        </div>
        <button type="button" className="admin-btn admin-btn--primary" disabled={saving} onClick={() => void save()}>
          {saving ? '저장 중…' : '저장'}
        </button>
      </div>

      {error ? (
        <p className="admin-panel__foot" style={{ color: '#b00020' }}>
          {error}
        </p>
      ) : null}
      {savedAt ? (
        <p className="admin-panel__foot" style={{ color: '#1b6b3a' }}>
          저장됨 ({savedAt})
        </p>
      ) : null}

      {NAV_MENU_COLUMNS.map((col) => (
        <section key={col.id} className="admin-panel">
          <div className="admin-nav-vis__row admin-nav-vis__row--top">
            <h2 className="admin-panel__title" style={{ margin: 0 }}>
              {NAV_TOP_LABELS[col.topKey]}
            </h2>
            <OnOffToggle
              enabled={doc.top[col.topKey]}
              label={NAV_TOP_LABELS[col.topKey]}
              onChange={(enabled) => setTop(col.topKey, enabled)}
            />
          </div>
          <p className="admin-fieldset__hint">하위 메뉴</p>
          <LinkRows links={col.links} doc={doc} depth={0} onToggle={setLink} />
        </section>
      ))}
    </div>
  )
}
