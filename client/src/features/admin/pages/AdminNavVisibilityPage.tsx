import { useCallback, useEffect, useState } from 'react'
import { AdminSaveActions, draftStatus, takeUnpublished } from '../AdminSaveActions'
import { adminFetchNavVisibility, adminPutNavVisibility, type SaveMode } from '../../../services/api'
import {
  DEFAULT_NAV_VISIBILITY,
  mergeNavVisibility,
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
  const [savedMode, setSavedMode] = useState<SaveMode | ''>('')
  const [unpublished, setUnpublished] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const loaded = takeUnpublished(await adminFetchNavVisibility())
      setDoc(mergeNavVisibility(loaded.doc))
      setUnpublished(loaded.unpublished)
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

  const save = async (mode: SaveMode) => {
    setSaving(true)
    setError('')
    setSavedAt('')
    try {
      const saved = takeUnpublished(await adminPutNavVisibility(doc, mode))
      setDoc(mergeNavVisibility(saved.doc))
      setUnpublished(saved.unpublished)
      setSavedMode(mode)
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
          <p className="admin-page__desc">메인 · 사이트 설정</p>
          <h1 className="admin-page__title">⑦ 메뉴 표시</h1>
          <p className="admin-page__desc">
            새 구조 반영: 국내사업 › 교육·연구사업 › 교육연구 삭제, 소셜비즈니스 신규, 해외사업 › 보건 → 해외봉사단,
            재정보고 → 투명경영, 후원 방법 신규, 한눈에 보는 카야 신규(숨김), 지원사업 숨김, 진행사업 유지.
            상위 메뉴를 OFF하면 그 아래 항목도 사이트에서 보이지 않습니다.
          </p>
        </div>
        <div className="admin-page__actions">
          <a className="admin-btn" href="/" target="_blank" rel="noopener noreferrer">미리보기</a>
          <AdminSaveActions saving={saving} onSave={(mode) => void save(mode)} />
        </div>
      </div>

      {error ? (
        <p className="admin-panel__foot" style={{ color: '#b00020' }}>
          {error}
        </p>
      ) : null}
      {draftStatus(unpublished, savedAt, savedMode) ? <p className="admin-panel__foot">{draftStatus(unpublished, savedAt, savedMode)}</p> : null}

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
