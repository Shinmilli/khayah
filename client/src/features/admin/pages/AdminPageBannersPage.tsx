import { useCallback, useEffect, useState } from 'react'
import { AdminMediaUpload } from '../components/AdminMediaUpload'
import {
  DEFAULT_PAGE_HERO_BANNERS,
  PAGE_HERO_BANNER_HINTS,
  PAGE_HERO_BANNER_KEYS,
  PAGE_HERO_BANNER_LABELS,
  type PageHeroBannerKey,
  type PageHeroBannersDocument,
} from '../../page-hero/pageHeroBannerTypes'
import { adminFetchPageHeroBanners, adminPutPageHeroBanners } from '../../../services/api'

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

export function AdminPageBannersPage() {
  const [doc, setDoc] = useState<PageHeroBannersDocument>(() => deepClone(DEFAULT_PAGE_HERO_BANNERS))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedAt, setSavedAt] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminFetchPageHeroBanners()
      setDoc({
        version: 1,
        images: { ...DEFAULT_PAGE_HERO_BANNERS.images, ...data.images },
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : '불러오지 못했습니다.')
      setDoc(deepClone(DEFAULT_PAGE_HERO_BANNERS))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const setImage = (key: PageHeroBannerKey, url: string | null) => {
    setDoc((prev) => ({
      ...prev,
      images: { ...prev.images, [key]: url?.trim() ?? '' },
    }))
  }

  const save = async () => {
    setSaving(true)
    setError('')
    try {
      const saved = await adminPutPageHeroBanners(doc)
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
          <h1 className="admin-page__title">페이지 배너</h1>
          <p className="admin-page__desc">
            상단 메뉴 네 구역(카야·사업·후원·소식)의 상세 페이지 히어로 배너입니다. 비우면 사이트 기본 배너가 사용됩니다.
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

      <section className="admin-page-banners" aria-label="구역별 페이지 배너">
        {PAGE_HERO_BANNER_KEYS.map((key) => (
          <div key={key} className="admin-panel admin-page-banners__card">
            <h2 className="admin-panel__title">{PAGE_HERO_BANNER_LABELS[key]}</h2>
            <p className="admin-page-banners__meta">{PAGE_HERO_BANNER_HINTS[key]}</p>
            <AdminMediaUpload
              label={`${PAGE_HERO_BANNER_LABELS[key]} 배너`}
              hint="가로로 넓은 사진을 권장합니다. 제거하면 기본 배너로 돌아갑니다."
              variant="image"
              layout="wide"
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
