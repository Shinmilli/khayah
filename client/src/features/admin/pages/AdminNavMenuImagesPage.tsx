import { useCallback, useEffect, useState } from 'react'
import { AdminMediaUpload } from '../components/AdminMediaUpload'
import {
  DEFAULT_NAV_MENU_IMAGES,
  NAV_MENU_IMAGE_KEYS,
  NAV_MENU_IMAGE_LABELS,
  type NavMenuImageKey,
  type NavMenuImagesDocument,
} from '../../nav/navMenuImagesTypes'
import { adminFetchNavMenuImages, adminPutNavMenuImages } from '../../../services/api'

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

export function AdminNavMenuImagesPage() {
  const [doc, setDoc] = useState<NavMenuImagesDocument>(() => deepClone(DEFAULT_NAV_MENU_IMAGES))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminFetchNavMenuImages()
      setDoc(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : '불러오지 못했습니다.')
      setDoc(deepClone(DEFAULT_NAV_MENU_IMAGES))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const setImage = (key: NavMenuImageKey, url: string | null) => {
    setDoc((prev) => ({
      ...prev,
      images: { ...prev.images, [key]: url?.trim() ?? '' },
    }))
  }

  const save = async () => {
    setSaving(true)
    setError('')
    try {
      const saved = await adminPutNavMenuImages(doc)
      setDoc(saved)
      setSavedAt(new Date().toLocaleTimeString())
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1 className="admin-page__title">메뉴 이미지</h1>
          <p className="admin-page__desc">
            상단 상세 메뉴(카야·사업·후원·소식) 오른쪽에 들어가는 세로 이미지입니다. 비율은 3:4이며, 제거하면 메뉴에서 사진
            칸이 사라집니다.
          </p>
        </div>
        <button type="button" className="admin-btn admin-btn--primary" onClick={() => void save()} disabled={saving || loading}>
          {saving ? '저장 중…' : '저장'}
        </button>
      </div>

      {error ? <p className="admin-banner admin-banner--error">{error}</p> : null}
      {savedAt ? (
        <p className="admin-panel__foot" role="status">
          저장됨 ({savedAt})
        </p>
      ) : null}

      <section className="admin-nav-images" aria-label="메뉴별 이미지">
        {NAV_MENU_IMAGE_KEYS.map((key) => (
          <div key={key} className="admin-panel admin-nav-images__card">
            <h2 className="admin-panel__title">{NAV_MENU_IMAGE_LABELS[key]}</h2>
            <AdminMediaUpload
              label={`${NAV_MENU_IMAGE_LABELS[key]} 메뉴 이미지`}
              hint="세로로 긴 사진(3:4)을 권장합니다. 제거 후 저장하면 메뉴에서 이미지가 빠집니다."
              variant="image"
              layout="portrait"
              value={doc.images[key] || null}
              onChange={(url) => setImage(key, url)}
              disabled={loading || saving}
            />
          </div>
        ))}
      </section>
    </div>
  )
}
