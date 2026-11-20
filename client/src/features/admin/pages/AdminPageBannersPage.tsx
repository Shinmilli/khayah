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
import { AdminSaveActions, draftStatus, takeUnpublished } from '../AdminSaveActions'
import { adminFetchPageHeroBanners, adminPutPageHeroBanners, type SaveMode } from '../../../services/api'

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

export function AdminPageBannersPage() {
  const [doc, setDoc] = useState<PageHeroBannersDocument>(() => deepClone(DEFAULT_PAGE_HERO_BANNERS))
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
      const loaded = takeUnpublished(await adminFetchPageHeroBanners())
      setUnpublished(loaded.unpublished)
      setDoc({
        version: 1,
        images: { ...DEFAULT_PAGE_HERO_BANNERS.images, ...loaded.doc.images },
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

  const save = async (mode: SaveMode) => {
    setSaving(true)
    setError('')
    try {
      const saved = takeUnpublished(await adminPutPageHeroBanners(doc, mode))
      setDoc(saved.doc)
      setUnpublished(saved.unpublished)
      setSavedMode(mode)
      setSavedAt(new Date().toLocaleTimeString('ko-KR'))
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
        <div className="admin-page__actions">
          <a className="admin-btn" href="/about/khayah" target="_blank" rel="noopener noreferrer">미리보기</a>
          <AdminSaveActions saving={saving || loading} onSave={(mode) => void save(mode)} />
        </div>
      </div>

      {error ? <p className="admin-banner admin-banner--error">{error}</p> : null}
      {draftStatus(unpublished, savedAt, savedMode) ? <p className="admin-panel__foot">{draftStatus(unpublished, savedAt, savedMode)}</p> : null}

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
